# EcoClaw Nexus Environmental Evidence Report

## 1. Report Metadata
- **Bundle Name:** EnvironmentalEvidenceBundle
- **Generated At:** 2026-03-06T18:32:49.389124+00:00
- **Run ID:** e744503b0b84
- **Data Sources:** Sentinel-2 NDVI analysis, Drought risk analysis

## 2. Site / AOI Description
- **AOI Bounding Box (EPSG:4326):** [-0.489, 51.28, 0.236, 51.686]
- **AOI Type:** pending_manual_description
- **Region:** Greater London / Europe
- **Monitoring Purpose:** Environmental change detection and MRV-style evidence generation

## 3. Pre-Work / Baseline Evidence
- **Scene ID:** S2C_MSIL2A_20250130T111341_R137_T30UXB_20250206T165811
- **Scene Date:** 2025-01-30
- **Cloud Cover:** 0.023069
- **Mean NDVI:** 0.31048256158828735
- **Valid Pixel Ratio:** 0.39265605875153
- **Quality Flags:** ['LOW_VALID_PIXEL_RATIO']

## 4. Post-Work / Latest Evidence
- **Scene ID:** S2A_MSIL2A_20251225T110511_R094_T30UXC_20251225T145009
- **Scene Date:** 2025-12-25
- **Cloud Cover:** 0.020028
- **Mean NDVI:** 0.274732768535614
- **Valid Pixel Ratio:** 1.0
- **Quality Flags:** []

## 5. Change Analysis
- **NDVI Delta:** -0.03574979305267334
- **Delta Quality Flags:** ['LOW_VALID_PIXEL_RATIO']
- **Change Signals:** {'sig_loss_fraction': 0.22026427169724047, 'sig_gain_fraction': 0.17554943031601233}
- **Interpretation:** Vegetation signal shows a slight decline between the baseline and latest observation.

## 6. Environmental Risk Assessment
- **Drought Score:** 7.149958610534668
- **Tier:** LOW
- **Confidence:** HIGH
- **Drivers:** ['No strong drought signals detected from available features']
- **Warnings:** []

## 7. Validation and Quality Review
- **Validation Status:** PASS_WITH_CAVEATS
- **Review Type:** preliminary_rule_based_validation

### Quality Observations
- Baseline valid pixel ratio: 0.39265605875153
- Latest valid pixel ratio: 1.0
- Baseline scene quality flags: ['LOW_VALID_PIXEL_RATIO']
- NDVI delta quality flags: ['LOW_VALID_PIXEL_RATIO']
- Drought model confidence: HIGH

### Limitations
- Baseline scene has LOW_VALID_PIXEL_RATIO, so before/after comparison should be interpreted with caution.
- NDVI change outputs contain quality flags that may affect interpretation.

## 8. Compliance / MRV Caveats
- **Compliance Status:** preliminary_demo_artifact

- This report is generated from automated environmental analysis outputs.
- This artifact is intended for exploratory monitoring and MRV-style evidence generation.
- It is not a certified regulatory or registry-compliant submission.
- Formal third-party review and domain validation would be required for production MRV use.
