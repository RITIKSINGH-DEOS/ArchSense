import pytest
from app.models import TopologyNode, TopologyEdge, AuditRequest
from app.graph_engine import ArchitecturalGraphEngine

def test_direct_database_bypass_detection():
    """Scenario A: Verify direct Client-to-DB bypass is flagged as CRITICAL and REJECTED."""
    nodes = [
        TopologyNode(id="client", label="Web Client", type="client", allowed_egress=["gateway"]),
        TopologyNode(id="gateway", label="API Gateway", type="gateway", allowed_egress=["order-svc"]),
        TopologyNode(id="order-svc", label="Order Service", type="service", allowed_egress=["db-orders"]),
        TopologyNode(id="db-orders", label="Postgres DB", type="database", allowed_egress=[]),
    ]
    edges = [
        TopologyEdge(id="e1", source="client", target="gateway", protocol="REST"),
        TopologyEdge(id="e2", source="gateway", target="order-svc", protocol="gRPC"),
        TopologyEdge(id="e_bypass", source="client", target="db-orders", protocol="DirectDB"),
    ]

    diff = "const pgClient = new Client({ connectionString: process.env.DATABASE_URL });"
    engine = ArchitecturalGraphEngine(nodes=nodes, edges=edges)
    violations, updated_edges = engine.verify_boundaries(git_diff=diff)
    score, status = engine.calculate_score(violations)

    assert status == "REJECTED"
    assert score < 50
    assert any(v.severity == "CRITICAL" and "Direct-to-DB" in v.title or "Client-to-DB" in v.title for v in violations)
    assert any(e.id == "e_bypass" and e.is_violated for e in updated_edges)

def test_circular_dependency_deadlock_detection():
    """Scenario B: Verify synchronous circular dependency is detected via NetworkX cycles."""
    nodes = [
        TopologyNode(id="auth-svc", label="Auth Service", type="service", allowed_egress=["payment-svc"]),
        TopologyNode(id="payment-svc", label="Payment Service", type="service", allowed_egress=["auth-svc"]),
    ]
    edges = [
        TopologyEdge(id="e1", source="auth-svc", target="payment-svc", protocol="gRPC"),
        TopologyEdge(id="e2", source="payment-svc", target="auth-svc", protocol="REST"),
    ]

    engine = ArchitecturalGraphEngine(nodes=nodes, edges=edges)
    cycles = engine.detect_cycles()
    assert len(cycles) > 0

    violations, updated_edges = engine.verify_boundaries(git_diff="axios.get('http://auth-svc')")
    score, status = engine.calculate_score(violations)

    assert status == "REJECTED"
    assert any("Circular Dependency" in v.title for v in violations)

def test_approved_decoupled_flow():
    """Scenario C: Verify compliant decoupled async architecture scores >= 90 and is APPROVED."""
    nodes = [
        TopologyNode(id="order-svc", label="Order Service", type="service", allowed_egress=["kafka-bus"]),
        TopologyNode(id="kafka-bus", label="Kafka Event Cluster", type="queue", allowed_egress=["analytics-svc"]),
        TopologyNode(id="analytics-svc", label="Analytics Worker", type="service", allowed_egress=[]),
    ]
    edges = [
        TopologyEdge(id="e1", source="order-svc", target="kafka-bus", protocol="EventBus"),
        TopologyEdge(id="e2", source="kafka-bus", target="analytics-svc", protocol="EventBus"),
    ]

    diff = "await kafkaProducer.send({ topic: 'domain.orders.created.v1' });"
    engine = ArchitecturalGraphEngine(nodes=nodes, edges=edges)
    violations, updated_edges = engine.verify_boundaries(git_diff=diff)
    score, status = engine.calculate_score(violations)

    assert status == "APPROVED"
    assert score >= 90
    assert all(not e.is_violated for e in updated_edges)

def test_deterministic_pydantic_schema_validation():
    """Verify strictly-typed Pydantic boundary assertion rejects invalid protocols."""
    with pytest.raises(Exception):
        TopologyEdge(id="bad", source="a", target="b", protocol="INVALID_PROTOCOL")
