"""
Orchestrator Agent for EcoClaw Nexus.
Coordinates execution of all agents and creates MVP evidence bundles.
"""

import uuid
import time
from typing import Dict, Any
from datetime import datetime

from models.schemas import (
    OrchestratorRequest,
    OrchestratorResponse,
    AgentResult,
    AgentStatus,
    AOI,
    EnvironmentalEvidenceBundle
)
from agents.satellite_agent import SatelliteAgent
from agents.weather_agent import WeatherAgent
from agents.validator_agent import ValidatorAgent


class Orchestrator:
    """Main orchestrator for EcoClaw Nexus environmental intelligence system."""
    
    def __init__(self):
        self.satellite_agent = SatelliteAgent()
        self.weather_agent = WeatherAgent()
        self.validator_agent = ValidatorAgent()
    
    def create_mvp_bundle(self, request: OrchestratorRequest, agent_results: list) -> EnvironmentalEvidenceBundle:
        """Create MVP EnvironmentalEvidenceBundle from agent results."""
        bundle_id = str(uuid.uuid4())
        created_at = datetime.now()
        
        # Extract data from agent results
        satellite_analysis = {}
        weather_risk = {}
        validator_review = None
        run_traces = []
        
        for result in agent_results:
            if result.status == AgentStatus.COMPLETED and result.data:
                if result.agent_name == "satellite_agent":
                    satellite_analysis = result.data.get("satellite_analysis", {})
                    if "run_trace" in result.data:
                        run_traces.append(result.data["run_trace"])
                elif result.agent_name == "weather_agent":
                    weather_risk = result.data.get("weather_risk", {})
                    if "run_trace" in result.data:
                        run_traces.append(result.data["run_trace"])
                elif result.agent_name == "validator_agent":
                    validator_review = result.data.get("validator_review", {})
                    if "run_trace" in result.data:
                        run_traces.append(result.data["run_trace"])
        
        # Calculate total confidence
        total_confidence = 0.0
        if validator_review and "confidence_score" in validator_review:
            total_confidence = validator_review["confidence_score"]
        else:
            # Fallback confidence calculation
            satellite_confidence = 0.8 if satellite_analysis else 0.0
            weather_confidence = 0.8 if weather_risk else 0.0
            total_confidence = (satellite_confidence + weather_confidence) / 2.0
        
        # Create combined run trace as List[str]
        run_trace_strings = [
            f"Processing date: {created_at.isoformat()}",
            f"Total agents: {len(agent_results)}",
            f"Successful agents: {len([r for r in agent_results if r.status == AgentStatus.COMPLETED])}",
            f"Total execution time: {sum(r.execution_time for r in agent_results):.2f}s",
            f"Orchestrator version: v1.0.0"
        ]
        
        # Add individual agent traces
        for i, trace in enumerate(run_traces):
            if isinstance(trace, dict):
                trace_str = f"Agent {i+1}: {trace.get('agent', 'unknown')} - {trace.get('algorithm_version', 'unknown')} - {trace.get('processing_time_seconds', 0):.2f}s"
                run_trace_strings.append(trace_str)
        
        return EnvironmentalEvidenceBundle(
            aoi_name=request.aoi.name,
            satellite_analysis=satellite_analysis,
            weather_risk=weather_risk,
            validator_review=validator_review,
            run_trace=run_trace_strings,
            bundle_id=bundle_id,
            created_at=created_at,
            total_confidence=total_confidence
        )
    
    def run_agents(self, request: OrchestratorRequest) -> OrchestratorResponse:
        """Execute all agents and create MVP evidence bundle."""
        request_id = str(uuid.uuid4())
        start_time = time.time()
        
        agent_results = []
        
        try:
            # Run Satellite Agent
            satellite_result = self.satellite_agent.run(request.aoi, ["ndvi", "change_detection"])
            agent_results.append(satellite_result)
            
            # Run Weather Agent
            weather_result = self.weather_agent.run(request.aoi, ["drought_risk", "weather_data"])
            agent_results.append(weather_result)
            
            # Run Validator Agent (only if both satellite and weather succeeded)
            if (satellite_result.status == AgentStatus.COMPLETED and 
                weather_result.status == AgentStatus.COMPLETED):
                validator_result = self.validator_agent.run(
                    satellite_result.data if satellite_result.data else {},
                    weather_result.data if weather_result.data else {}
                )
                agent_results.append(validator_result)
            
            # Check for failures
            failed_agents = [r for r in agent_results if r.status == AgentStatus.FAILED]
            if failed_agents:
                total_execution_time = time.time() - start_time
                return OrchestratorResponse(
                    request_id=request_id,
                    status=AgentStatus.FAILED,
                    agent_results=agent_results,
                    total_execution_time=total_execution_time
                )
            
            # Create evidence bundle
            evidence_bundle = self.create_mvp_bundle(request, agent_results)
            
            total_execution_time = time.time() - start_time
            
            return OrchestratorResponse(
                request_id=request_id,
                status=AgentStatus.COMPLETED,
                agent_results=agent_results,
                evidence_bundle=evidence_bundle,
                total_execution_time=total_execution_time
            )
            
        except Exception as e:
            total_execution_time = time.time() - start_time
            return OrchestratorResponse(
                request_id=request_id,
                status=AgentStatus.FAILED,
                agent_results=agent_results,
                total_execution_time=total_execution_time
            )
    
    def get_agent_status(self, request_id: str) -> Dict[str, Any]:
        """Get status of running agents (placeholder for async implementation)."""
        return {
            "request_id": request_id,
            "status": AgentStatus.COMPLETED,
            "message": "Synchronous execution completed"
        }
