// Shared TypeScript interfaces for EcoClaw Nexus
// These types are used across frontend and backend

export interface AOI {
  id: string;
  name: string;
  coordinates: number[][][]; // GeoJSON polygon coordinates
  area_hectares: number;
}

export enum EvidenceType {
  NDVI = "ndvi",
  CHANGE_DETECTION = "change_detection",
  DROUGHT_RISK = "drought_risk",
  WEATHER_DATA = "weather_data"
}

export enum ConfidenceLevel {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high"
}

export enum AgentStatus {
  PENDING = "pending",
  RUNNING = "running",
  COMPLETED = "completed",
  FAILED = "failed"
}

export interface SatelliteEvidence {
  evidence_type: EvidenceType;
  timestamp: string;
  value: number;
  unit: string;
  confidence: ConfidenceLevel;
  metadata: Record<string, any>;
}

export interface WeatherEvidence {
  evidence_type: EvidenceType;
  timestamp: string;
  risk_score: number;
  confidence: ConfidenceLevel;
  metadata: Record<string, any>;
}

export interface ValidationResult {
  is_complete: boolean;
  confidence_score: number;
  missing_evidence: EvidenceType[];
  validation_errors: string[];
}

export interface EnvironmentalEvidenceBundle {
  aoi: AOI;
  satellite_evidence: SatelliteEvidence[];
  weather_evidence: WeatherEvidence[];
  validation_result: ValidationResult;
  bundle_id: string;
  created_at: string;
  total_confidence: number;
}

export interface AgentResult {
  agent_name: string;
  status: AgentStatus;
  data?: Record<string, any>;
  error_message?: string;
  execution_time: number;
}

export interface OrchestratorRequest {
  aoi: AOI;
  evidence_types?: EvidenceType[];
}

export interface OrchestratorResponse {
  request_id: string;
  status: AgentStatus;
  agent_results: AgentResult[];
  evidence_bundle?: EnvironmentalEvidenceBundle;
  total_execution_time: number;
}
