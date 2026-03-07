"""
Evidence Builder Service for EcoClaw Nexus.
Builds and manages MVP EnvironmentalEvidenceBundle objects.
"""

import json
import uuid
from pathlib import Path
from typing import Dict, Any, Optional
from datetime import datetime

from ..models.schemas import (
    EnvironmentalEvidenceBundle
)


class EvidenceBuilder:
    """Service for building and managing environmental evidence bundles."""
    
    def __init__(self, output_dir: str = "backend/outputs"):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)
    
    def save_bundle(self, bundle: EnvironmentalEvidenceBundle) -> str:
        """Save evidence bundle to local JSON file."""
        filename = f"bundle_{bundle.bundle_id}.json"
        filepath = self.output_dir / filename
        
        bundle_dict = bundle.dict()
        bundle_dict["created_at"] = bundle.created_at.isoformat()
        
        with open(filepath, 'w') as f:
            json.dump(bundle_dict, f, indent=2)
        
        return str(filepath)
    
    def load_bundle(self, bundle_id: str) -> Optional[EnvironmentalEvidenceBundle]:
        """Load evidence bundle from local JSON file."""
        filename = f"bundle_{bundle_id}.json"
        filepath = self.output_dir / filename
        
        if not filepath.exists():
            return None
        
        with open(filepath, 'r') as f:
            bundle_dict = json.load(f)
        
        # Reconstruct the bundle (simplified for hackathon)
        return bundle_dict
    
    def list_bundles(self) -> List[Dict[str, Any]]:
        """List all available evidence bundles."""
        bundles = []
        
        for filepath in self.output_dir.glob("bundle_*.json"):
            try:
                with open(filepath, 'r') as f:
                    bundle_data = json.load(f)
                
                bundles.append({
                    "bundle_id": bundle_data.get("bundle_id"),
                    "aoi_name": bundle_data.get("aoi_name", "Unknown"),
                    "created_at": bundle_data.get("created_at"),
                    "total_confidence": bundle_data.get("total_confidence", 0.0),
                    "file_path": str(filepath)
                })
            except Exception as e:
                print(f"Error reading bundle {filepath}: {e}")
        
        return bundles
    
    def generate_summary_report(self, bundle: EnvironmentalEvidenceBundle) -> Dict[str, Any]:
        """Generate a summary report for the evidence bundle."""
        report = {
            "bundle_id": bundle.bundle_id,
            "aoi_name": bundle.aoi_name,
            "evidence_summary": {
                "satellite_analysis_available": bool(bundle.satellite_analysis),
                "weather_risk_available": bool(bundle.weather_risk),
                "validator_review_available": bool(bundle.validator_review)
            },
            "validation": {
                "is_complete": bundle.validator_review.get("is_complete", False) if bundle.validator_review else False,
                "confidence_score": bundle.validator_review.get("confidence_score", 0.0) if bundle.validator_review else 0.0,
                "validation_errors_count": len(bundle.validator_review.get("validation_errors", [])) if bundle.validator_review else 0
            },
            "overall_confidence": bundle.total_confidence,
            "created_at": bundle.created_at.isoformat()
        }
        
        return report
