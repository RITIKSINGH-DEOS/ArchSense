from typing import List, Optional, Literal
from pydantic import BaseModel, Field

NodeType = Literal["client", "gateway", "service", "database", "queue"]
ProtocolType = Literal["REST", "gRPC", "DirectDB", "EventBus"]
SeverityType = Literal["CRITICAL", "WARNING", "COMPLIANT"]
AuditStatus = Literal["REJECTED", "WARNING", "APPROVED"]

class TopologyNode(BaseModel):
    id: str
    label: str
    type: NodeType
    x: float = 0.0
    y: float = 0.0
    width: float = 140.0
    height: float = 60.0
    allowed_egress: List[str] = Field(default_factory=list)
    color: Optional[str] = "#3B82F6"

class TopologyEdge(BaseModel):
    id: str
    source: str
    target: str
    protocol: ProtocolType
    is_violated: bool = False

class Violation(BaseModel):
    id: str
    severity: SeverityType
    title: str
    file: str
    line: str
    source_node: str
    target_node: str
    breach_description: str
    remediation: str

class AuditRequest(BaseModel):
    scenario_id: Optional[str] = None
    pr_title: Optional[str] = "Manual PR Review"
    git_diff: str
    nodes: List[TopologyNode]
    edges: List[TopologyEdge]

class AuditResponse(BaseModel):
    score: int = Field(ge=0, le=100)
    status: AuditStatus
    violations: List[Violation]
    nodes: List[TopologyNode]
    edges: List[TopologyEdge]
    latency_ms: float
    engine: str = "Meta SAM 3.1 + Muse Spark (Pydantic Air-Gap Gate)"
    ai_reasoning: Optional[str] = None
    inference_provider: str = "Deterministic Graph Engine"

class GitHubPRRequest(BaseModel):
    url: str

class GitHubPRResponse(BaseModel):
    repo: str
    pr_number: int
    title: str
    author: str
    author_avatar: Optional[str] = None
    branch: str
    base_branch: str
    diff: str
    additions: int = 0
    deletions: int = 0
    changed_files: int = 0
    html_url: str
