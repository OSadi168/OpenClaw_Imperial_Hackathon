"""
FastAPI main application for EcoClaw Nexus.
Environmental intelligence system orchestrator.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any
import uvicorn

from models.schemas import (
    OrchestratorRequest,
    OrchestratorResponse,
    AOI,
    EvidenceType,
    AgentStatus
)
from agents.orchestrator import Orchestrator
from services.evidence_builder import EvidenceBuilder


# Initialize FastAPI app
app = FastAPI(
    title="EcoClaw Nexus",
    description="Environmental Intelligence System for Carbon Markets",
    version="1.0.0"
)

# Add CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
orchestrator = Orchestrator()
evidence_builder = EvidenceBuilder()


@app.get("/")
async def root():
    """Root endpoint - API health check."""
    return {
        "message": "EcoClaw Nexus API",
        "version": "1.0.0",
        "status": "running"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "services": {
            "orchestrator": "active",
            "evidence_builder": "active"
        }
    }


@app.post("/run", response_model=OrchestratorResponse)
async def run_orchestrator(request: OrchestratorRequest):
    """
    Run the environmental intelligence orchestrator for a given AOI.
    
    - **aoi**: Area of Interest with coordinates and metadata
    - **evidence_types**: List of evidence types to collect (optional)
    """
    try:
        response = orchestrator.run_agents(request)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Orchestrator execution failed: {str(e)}")


@app.get("/results/{request_id}")
async def get_results(request_id: str):
    """Get results for a specific orchestrator request."""
    try:
        status = orchestrator.get_agent_status(request_id)
        return status
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Request {request_id} not found")


@app.get("/bundles")
async def list_evidence_bundles():
    """List all available evidence bundles."""
    try:
        bundles = evidence_builder.list_bundles()
        return {"bundles": bundles}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list bundles: {str(e)}")


@app.get("/bundles/{bundle_id}")
async def get_evidence_bundle(bundle_id: str):
    """Get a specific evidence bundle."""
    try:
        bundle = evidence_builder.load_bundle(bundle_id)
        if not bundle:
            raise HTTPException(status_code=404, detail=f"Bundle {bundle_id} not found")
        return bundle
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load bundle: {str(e)}")


@app.get("/bundles/{bundle_id}/summary")
async def get_bundle_summary(bundle_id: str):
    """Get summary report for a specific evidence bundle."""
    try:
        bundle_data = evidence_builder.load_bundle(bundle_id)
        if not bundle_data:
            raise HTTPException(status_code=404, detail=f"Bundle {bundle_id} not found")
        
        # For hackathon, generate summary from raw bundle data
        summary = {
            "bundle_id": bundle_data.get("bundle_id"),
            "aoi_name": bundle_data.get("aoi", {}).get("name", "Unknown"),
            "evidence_count": len(bundle_data.get("satellite_evidence", [])) + len(bundle_data.get("weather_evidence", [])),
            "confidence": bundle_data.get("total_confidence", 0.0),
            "created_at": bundle_data.get("created_at")
        }
        return summary
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate summary: {str(e)}")


@app.post("/bundles/{bundle_id}/save")
async def save_bundle(bundle_id: str, bundle_data: Dict[str, Any]):
    """Save an evidence bundle to local storage."""
    try:
        # For hackathon, this is a simplified implementation
        filepath = f"backend/outputs/bundle_{bundle_id}.json"
        return {"message": f"Bundle saved to {filepath}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save bundle: {str(e)}")


@app.get("/evidence-types")
async def get_evidence_types():
    """Get available evidence types."""
    return {
        "evidence_types": [et.value for et in EvidenceType],
        "descriptions": {
            "ndvi": "Normalized Difference Vegetation Index",
            "change_detection": "Land cover change detection",
            "drought_risk": "Drought risk assessment",
            "weather_data": "General weather data"
        }
    }


# Sample AOI endpoints for hackathon demo
@app.get("/sample-aois")
async def get_sample_aois():
    """Get sample AOIs for demo purposes."""
    sample_aois = [
        {
            "id": "amazon_ridge_01",
            "name": "Amazon Ridge Conservation Area",
            "coordinates": [[[-63.0, -3.5], [-62.8, -3.5], [-62.8, -3.3], [-63.0, -3.3], [-63.0, -3.5]]],
            "area_hectares": 5000.0
        },
        {
            "id": "borneo_forest_02",
            "name": "Borneo Forest Reserve",
            "coordinates": [[[114.5, 1.2], [114.7, 1.2], [114.7, 1.4], [114.5, 1.4], [114.5, 1.2]]],
            "area_hectares": 7500.0
        },
        {
            "id": "congo_basin_03",
            "name": "Congo Basin Protection Zone",
            "coordinates": [[[18.0, -1.5], [18.3, -1.5], [18.3, -1.2], [18.0, -1.2], [18.0, -1.5]]],
            "area_hectares": 10000.0
        }
    ]
    return {"aois": sample_aois}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
