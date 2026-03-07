import json
from pathlib import Path
from datetime import datetime, timezone
import hashlib

ROOT = Path(__file__).resolve().parents[1]

NDVI_FILE = ROOT / "outputs" / "ndvi_output.json"
DROUGHT_FILE = ROOT / "outputs" / "drought_output.json"

BUNDLE_FILE = ROOT / "outputs" / "environmental_evidence_bundle.json"
REPORT_FILE = ROOT / "outputs" / "environmental_report.md"


def load_json(path: Path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def make_run_id(bundle_name: str, generated_at: str) -> str:
    raw = f"{bundle_name}|{generated_at}"
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()[:12]


def build_bundle(ndvi_data: dict, drought_data: dict) -> dict:
    generated_at = datetime.now(timezone.utc).isoformat()

    bundle = {
        "bundle_name": "EnvironmentalEvidenceBundle",
        "generated_at": generated_at,
        "run_id": make_run_id("EnvironmentalEvidenceBundle", generated_at),
        "data_sources": [
            "Sentinel-2 NDVI analysis",
            "Drought risk analysis"
        ],
        "site_description": {
            "aoi_bbox_epsg4326": ndvi_data.get("aoi_bbox_epsg4326"),
            "aoi_type": "pending_manual_description",
            "region": "Greater London / Europe",
            "monitoring_purpose": "Environmental change detection and MRV-style evidence generation"
        },
        "pre_work_baseline_evidence": {
            "scene_id": (ndvi_data.get("earlier_scene") or {}).get("id"),
            "scene_date": (ndvi_data.get("earlier_scene") or {}).get("date"),
            "cloud_cover": (ndvi_data.get("earlier_scene") or {}).get("cloud_cover"),
            "mean_ndvi": (ndvi_data.get("earlier_scene") or {}).get("mean_ndvi"),
            "valid_pixel_ratio": (ndvi_data.get("earlier_scene") or {}).get("valid_pixel_ratio"),
            "quality_flags": (ndvi_data.get("earlier_scene") or {}).get("quality_flags", [])
        },
        "post_work_latest_evidence": {
            "scene_id": (ndvi_data.get("later_scene") or {}).get("id"),
            "scene_date": (ndvi_data.get("later_scene") or {}).get("date"),
            "cloud_cover": (ndvi_data.get("later_scene") or {}).get("cloud_cover"),
            "mean_ndvi": (ndvi_data.get("later_scene") or {}).get("mean_ndvi"),
            "valid_pixel_ratio": (ndvi_data.get("later_scene") or {}).get("valid_pixel_ratio"),
            "quality_flags": (ndvi_data.get("later_scene") or {}).get("quality_flags", [])
        },
        "change_analysis": {
            "ndvi_delta": ndvi_data.get("ndvi_delta"),
            "delta_quality_flags": ndvi_data.get("delta_quality_flags", []),
            "change_signals": ndvi_data.get("change_signals", {}),
            "interpretation": build_change_interpretation(ndvi_data)
        },
        "environmental_risk_assessment": {
            "drought_score": drought_data.get("drought_score"),
            "tier": drought_data.get("tier"),
            "confidence": drought_data.get("confidence"),
            "drivers": drought_data.get("drivers", []),
            "warnings": drought_data.get("warnings", []),
            "debug": drought_data.get("debug", {})
        },
        "validation_and_quality_review": {
            "validation_status": build_validation_status(ndvi_data, drought_data),
            "quality_observations": build_quality_observations(ndvi_data, drought_data),
            "limitations": build_limitations(ndvi_data, drought_data),
            "review_type": "preliminary_rule_based_validation"
        },
        "compliance_mrv_caveats": {
            "compliance_status": "preliminary_demo_artifact",
            "statements": [
                "This report is generated from automated environmental analysis outputs.",
                "This artifact is intended for exploratory monitoring and MRV-style evidence generation.",
                "It is not a certified regulatory or registry-compliant submission.",
                "Formal third-party review and domain validation would be required for production MRV use."
            ]
        }
    }

    return bundle


def build_change_interpretation(ndvi_data: dict) -> str:
    ndvi_delta = ndvi_data.get("ndvi_delta")
    if ndvi_delta is None:
        return "NDVI change could not be determined from the available inputs."

    if ndvi_delta < -0.05:
        return "Vegetation signal shows a noticeable decline between the baseline and latest observation."
    if ndvi_delta < 0:
        return "Vegetation signal shows a slight decline between the baseline and latest observation."
    if ndvi_delta > 0.05:
        return "Vegetation signal shows a noticeable improvement between the baseline and latest observation."
    if ndvi_delta > 0:
        return "Vegetation signal shows a slight improvement between the baseline and latest observation."
    return "Vegetation signal is broadly stable between the two observations."


def build_validation_status(ndvi_data: dict, drought_data: dict) -> str:
    ndvi_flags = ndvi_data.get("delta_quality_flags", [])
    drought_conf = drought_data.get("confidence")

    if ndvi_flags and drought_conf in {"LOW", "MEDIUM"}:
        return "REVIEW_NEEDED"
    if ndvi_flags:
        return "PASS_WITH_CAVEATS"
    return "PASS"


def build_quality_observations(ndvi_data: dict, drought_data: dict) -> list:
    observations = []

    earlier = ndvi_data.get("earlier_scene", {})
    later = ndvi_data.get("later_scene", {})

    earlier_vpr = earlier.get("valid_pixel_ratio")
    later_vpr = later.get("valid_pixel_ratio")

    if earlier_vpr is not None:
        observations.append(f"Baseline valid pixel ratio: {earlier_vpr}")
    if later_vpr is not None:
        observations.append(f"Latest valid pixel ratio: {later_vpr}")

    earlier_flags = earlier.get("quality_flags", [])
    if earlier_flags:
        observations.append(f"Baseline scene quality flags: {earlier_flags}")

    delta_flags = ndvi_data.get("delta_quality_flags", [])
    if delta_flags:
        observations.append(f"NDVI delta quality flags: {delta_flags}")

    drought_conf = drought_data.get("confidence")
    if drought_conf:
        observations.append(f"Drought model confidence: {drought_conf}")

    drought_warnings = drought_data.get("warnings", [])
    if drought_warnings:
        observations.append(f"Drought warnings: {drought_warnings}")

    if not observations:
        observations.append("No additional quality observations were generated.")

    return observations


def build_limitations(ndvi_data: dict, drought_data: dict) -> list:
    limitations = []

    earlier = ndvi_data.get("earlier_scene", {})
    if "LOW_VALID_PIXEL_RATIO" in earlier.get("quality_flags", []):
        limitations.append(
            "Baseline scene has LOW_VALID_PIXEL_RATIO, so before/after comparison should be interpreted with caution."
        )

    if ndvi_data.get("delta_quality_flags"):
        limitations.append(
            "NDVI change outputs contain quality flags that may affect interpretation."
        )

    if drought_data.get("warnings"):
        limitations.append(
            "Drought output includes warning signals that should be reviewed before downstream decision-making."
        )

    if not limitations:
        limitations.append(
            "No critical validation limitations were detected in the current outputs."
        )

    return limitations


def save_json(data: dict, path: Path):
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)


def export_report(bundle: dict, path: Path):
    pre = bundle["pre_work_baseline_evidence"]
    post = bundle["post_work_latest_evidence"]
    change = bundle["change_analysis"]
    risk = bundle["environmental_risk_assessment"]
    validation = bundle["validation_and_quality_review"]
    caveats = bundle["compliance_mrv_caveats"]
    site = bundle["site_description"]

    report = f"""# EcoClaw Nexus Environmental Evidence Report

## 1. Report Metadata
- **Bundle Name:** {bundle["bundle_name"]}
- **Generated At:** {bundle["generated_at"]}
- **Run ID:** {bundle["run_id"]}
- **Data Sources:** {", ".join(bundle["data_sources"])}

## 2. Site / AOI Description
- **AOI Bounding Box (EPSG:4326):** {site["aoi_bbox_epsg4326"]}
- **AOI Type:** {site["aoi_type"]}
- **Region:** {site["region"]}
- **Monitoring Purpose:** {site["monitoring_purpose"]}

## 3. Pre-Work / Baseline Evidence
- **Scene ID:** {pre["scene_id"]}
- **Scene Date:** {pre["scene_date"]}
- **Cloud Cover:** {pre["cloud_cover"]}
- **Mean NDVI:** {pre["mean_ndvi"]}
- **Valid Pixel Ratio:** {pre["valid_pixel_ratio"]}
- **Quality Flags:** {pre["quality_flags"]}

## 4. Post-Work / Latest Evidence
- **Scene ID:** {post["scene_id"]}
- **Scene Date:** {post["scene_date"]}
- **Cloud Cover:** {post["cloud_cover"]}
- **Mean NDVI:** {post["mean_ndvi"]}
- **Valid Pixel Ratio:** {post["valid_pixel_ratio"]}
- **Quality Flags:** {post["quality_flags"]}

## 5. Change Analysis
- **NDVI Delta:** {change["ndvi_delta"]}
- **Delta Quality Flags:** {change["delta_quality_flags"]}
- **Change Signals:** {change["change_signals"]}
- **Interpretation:** {change["interpretation"]}

## 6. Environmental Risk Assessment
- **Drought Score:** {risk["drought_score"]}
- **Tier:** {risk["tier"]}
- **Confidence:** {risk["confidence"]}
- **Drivers:** {risk["drivers"]}
- **Warnings:** {risk["warnings"]}

## 7. Validation and Quality Review
- **Validation Status:** {validation["validation_status"]}
- **Review Type:** {validation["review_type"]}

### Quality Observations
{chr(10).join(f"- {item}" for item in validation["quality_observations"])}

### Limitations
{chr(10).join(f"- {item}" for item in validation["limitations"])}

## 8. Compliance / MRV Caveats
- **Compliance Status:** {caveats["compliance_status"]}

{chr(10).join(f"- {item}" for item in caveats["statements"])}
"""

    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(report)


def main():
    ndvi_data = load_json(NDVI_FILE)
    drought_data = load_json(DROUGHT_FILE)

    bundle = build_bundle(ndvi_data, drought_data)

    save_json(bundle, BUNDLE_FILE)
    export_report(bundle, REPORT_FILE)

    print(f"Saved bundle: {BUNDLE_FILE}")
    print(f"Saved report: {REPORT_FILE}")


if __name__ == "__main__":
    main()