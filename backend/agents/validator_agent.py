"""
Validator Agent for EcoClaw Nexus.
Validates MVP environmental evidence bundles.
"""

import time
from typing import Dict, Any
from datetime import datetime

from ..models.schemas import (
    AgentResult,
    AgentStatus
)


class ValidatorAgent:
    """Agent for validating environmental evidence completeness and confidence."""
    
    def __init__(self):
        self.agent_name = "validator_agent"
    
    def validate_mvp_bundle(self, satellite_analysis: Dict[str, Any], weather_risk: Dict[str, Any]) -> Dict[str, Any]:
        """Validate MVP evidence bundle completeness and quality."""
        validation_errors = []
        confidence_score = 0.0
        is_complete = True
        
        # Validate satellite analysis
        if not satellite_analysis:
            validation_errors.append("Missing satellite analysis")
            is_complete = False
        else:
            required_satellite_keys = ["earlier_scene", "later_scene", "ndvi_delta", "delta_quality_flags", "change_signals"]
            for key in required_satellite_keys:
                if key not in satellite_analysis:
                    validation_errors.append(f"Missing satellite data: {key}")
                    is_complete = False
            
            # Calculate satellite confidence
            if "delta_quality_flags" in satellite_analysis:
                flags = satellite_analysis["delta_quality_flags"]
                satellite_confidence = sum([
                    flags.get("high_confidence", False),
                    flags.get("sufficient_coverage", False),
                    flags.get("seasonal_consistent", False),
                    flags.get("cloud_free", False),
                    flags.get("processing_complete", False)
                ]) / 5.0
                confidence_score += satellite_confidence * 0.5
        
        # Validate weather risk
        if not weather_risk:
            validation_errors.append("Missing weather risk analysis")
            is_complete = False
        else:
            required_weather_keys = ["drought_score", "tier", "confidence", "drivers", "warnings"]
            for key in required_weather_keys:
                if key not in weather_risk:
                    validation_errors.append(f"Missing weather data: {key}")
                    is_complete = False
            
            # Calculate weather confidence
            if "confidence" in weather_risk:
                weather_confidence = weather_risk["confidence"]
                confidence_score += weather_confidence * 0.5
        
        # Normalize confidence score
        confidence_score = min(confidence_score, 1.0)
        
        return {
            "is_complete": is_complete,
            "confidence_score": confidence_score,
            "validation_errors": validation_errors,
            "validation_date": datetime.now().isoformat(),
            "validator_agent": self.agent_name
        }
    
    def run(self, satellite_result: Dict[str, Any], weather_result: Dict[str, Any]) -> AgentResult:
        """Execute validator agent for MVP bundle validation."""
        start_time = time.time()
        
        try:
            satellite_analysis = satellite_result.get("data", {}).get("satellite_analysis", {})
            weather_risk = weather_result.get("data", {}).get("weather_risk", {})
            
            validator_review = self.validate_mvp_bundle(satellite_analysis, weather_risk)
            
            execution_time = time.time() - start_time
            
            return AgentResult(
                agent_name=self.agent_name,
                status=AgentStatus.COMPLETED,
                data={
                    "validator_review": validator_review,
                    "run_trace": {
                        "processing_date": datetime.now().isoformat(),
                        "algorithm_version": "v1.0.0",
                        "processing_time_seconds": execution_time,
                        "agent": self.agent_name
                    }
                },
                execution_time=execution_time
            )
            
        except Exception as e:
            execution_time = time.time() - start_time
            return AgentResult(
                agent_name=self.agent_name,
                status=AgentStatus.FAILED,
                error_message=str(e),
                execution_time=execution_time
            )
