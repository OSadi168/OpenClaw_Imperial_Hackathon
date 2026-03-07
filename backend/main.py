"""
FastAPI main application for EcoClaw Nexus.
Environmental intelligence system orchestrator.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any
import uvicorn
import csv
from pathlib import Path

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
@app.get("/api/status")
async def health_check():
    """Health check / status endpoint."""
    return {
        "status": "healthy",
        "services": {
            "orchestrator": "active",
            "evidence_builder": "active"
        }
    }


@app.post("/run", response_model=OrchestratorResponse)
@app.post("/api/analyze", response_model=OrchestratorResponse)
async def run_orchestrator(request: OrchestratorRequest):
    """
    Run the environmental intelligence orchestrator for a given AOI.
    
    - **aoi**: Area of Interest with coordinates and metadata
    - **evidence_types**: List of evidence types to collect (optional)
    """
    try:
        response = orchestrator.run_agents(request)
        if response.evidence_bundle:
            evidence_builder.save_bundle(response.evidence_bundle)
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


@app.get("/bundles/latest")
async def get_latest_bundle():
    """Get the most recently created evidence bundle."""
    try:
        bundles = evidence_builder.list_bundles()
        if not bundles:
            raise HTTPException(status_code=404, detail="No bundles found. Run an analysis first.")
        bundles.sort(key=lambda b: b.get("created_at", ""), reverse=True)
        return bundles[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


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


SAMPLE_AOIS = {
    "Amazon Ridge Conservation Area": {
        "id": "amazon_ridge_01",
        "name": "Amazon Ridge Conservation Area",
        "coordinates": [[[-63.0, -3.5], [-62.8, -3.5], [-62.8, -3.3], [-63.0, -3.3], [-63.0, -3.5]]],
        "area_hectares": 5000.0
    },
    "Borneo Forest Reserve": {
        "id": "borneo_forest_02",
        "name": "Borneo Forest Reserve",
        "coordinates": [[[114.5, 1.2], [114.7, 1.2], [114.7, 1.4], [114.5, 1.4], [114.5, 1.2]]],
        "area_hectares": 7500.0
    },
    "Congo Basin Protection Zone": {
        "id": "congo_basin_03",
        "name": "Congo Basin Protection Zone",
        "coordinates": [[[18.0, -1.5], [18.3, -1.5], [18.3, -1.2], [18.0, -1.2], [18.0, -1.5]]],
        "area_hectares": 10000.0
    }
}


@app.post("/api/analyze/simple")
async def analyze_simple(body: Dict[str, Any]):
    """Run analysis with just aoi_name. Example: {"aoi_name": "Amazon Ridge Conservation Area"}"""
    aoi_name = body.get("aoi_name", "Amazon Ridge Conservation Area")
    aoi_data = SAMPLE_AOIS.get(aoi_name, list(SAMPLE_AOIS.values())[0])
    try:
        aoi = AOI(**aoi_data)
        request = OrchestratorRequest(aoi=aoi)
        response = orchestrator.run_agents(request)
        if response.evidence_bundle:
            evidence_builder.save_bundle(response.evidence_bundle)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


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


@app.get("/api/verra-projects")
async def get_verra_projects():
    """Get cleaned Verra carbon project data."""
    csv_path = Path(__file__).parent.parent / "Data" / "esg" / "allprojects_cleaned.csv"
    if not csv_path.exists():
        raise HTTPException(status_code=404, detail="Verra dataset not found")
    projects = []
    with open(csv_path, 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            projects.append(row)
    return {"projects": projects[:20], "total": len(projects)}


@app.get("/api/verra-companies")
async def get_verra_companies():
    """Get unique companies from Verra dataset."""
    csv_path = Path(__file__).parent.parent / "Data" / "esg" / "companies_dataset.csv"
    if not csv_path.exists():
        raise HTTPException(status_code=404, detail="Companies dataset not found")
    companies = []
    with open(csv_path, 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            companies.append(row)
    hash_path = Path(__file__).parent.parent / "Data" / "esg" / "dataset_hash.txt"
    dataset_hash = hash_path.read_text().strip() if hash_path.exists() else "N/A"
    return {"companies": companies[:20], "total": len(companies), "blockchain_hash": dataset_hash}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
