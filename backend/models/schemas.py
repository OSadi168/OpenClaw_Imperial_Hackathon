"""
Pydantic models for EcoClaw Nexus environmental intelligence system.
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


class AOI(BaseModel):
    """Area of Interest definition."""
    id: str
    name: str
    coordinates: List[List[float]]  # GeoJSON polygon coordinates
    area_hectares: float


class EvidenceType(str, Enum):
    """Types of environmental evidence."""
    NDVI = "ndvi"
    CHANGE_DETECTION = "change_detection"
    DROUGHT_RISK = "drought_risk"
    WEATHER_DATA = "weather_data"


class ConfidenceLevel(str, Enum):
    """Confidence levels for evidence."""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class SatelliteEvidence(BaseModel):
    """Satellite-derived environmental evidence."""
    evidence_type: EvidenceType
    timestamp: datetime
    value: float
    unit: str
    confidence: ConfidenceLevel
    metadata: Dict[str, Any]


class WeatherEvidence(BaseModel):
    """Weather-related environmental evidence."""
    evidence_type: EvidenceType
    timestamp: datetime
    risk_score: float
    confidence: ConfidenceLevel
    metadata: Dict[str, Any]


class ValidationResult(BaseModel):
    """Result of evidence validation."""
    is_complete: bool
    confidence_score: float
    missing_evidence: List[EvidenceType]
    validation_errors: List[str]


class EnvironmentalEvidenceBundle(BaseModel):
    """Complete bundle of environmental evidence for an AOI - MVP Schema."""
    aoi_name: str
    satellite_analysis: Dict[str, Any]
    weather_risk: Dict[str, Any]
    validator_review: Optional[Dict[str, Any]] = None
    run_trace: List[str]
    bundle_id: str
    created_at: datetime
    total_confidence: float


class AgentStatus(str, Enum):
    """Status of agent execution."""
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"


class AgentResult(BaseModel):
    """Result from an agent execution."""
    agent_name: str
    status: AgentStatus
    data: Optional[Dict[str, Any]] = None
    error_message: Optional[str] = None
    execution_time: float


class OrchestratorRequest(BaseModel):
    """Request to run orchestrator for an AOI."""
    aoi: AOI
    evidence_types: List[EvidenceType] = Field(default_factory=lambda: list(EvidenceType))


class OrchestratorResponse(BaseModel):
    """Response from orchestrator execution."""
    request_id: str
    status: AgentStatus
    agent_results: List[AgentResult]
    evidence_bundle: Optional[EnvironmentalEvidenceBundle] = None
    total_execution_time: float
