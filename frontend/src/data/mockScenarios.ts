export interface ArchitectureNode {
  id: string;
  label: string;
  type: 'client' | 'gateway' | 'service' | 'database' | 'queue';
  x: number;
  y: number;
  width: number;
  height: number;
  allowedEgress: string[];
  color: string;
}

export interface ArchitectureEdge {
  id: string;
  source: string;
  target: string;
  protocol: 'REST' | 'gRPC' | 'DirectDB' | 'EventBus';
  isViolated?: boolean;
}

export interface Violation {
  id: string;
  severity: 'CRITICAL' | 'WARNING' | 'COMPLIANT';
  title: string;
  file: string;
  line: string;
  sourceNode: string;
  targetNode: string;
  breachDescription: string;
  remediation: string;
}

export interface AuditScenario {
  id: string;
  name: string;
  badge: string;
  description: string;
  prTitle: string;
  prAuthor: string;
  prBranch: string;
  diffCode: string;
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
  score: number;
  status: 'REJECTED' | 'WARNING' | 'APPROVED';
  violations: Violation[];
}

export const SCENARIOS: Record<string, AuditScenario> = {
  scenarioA: {
    id: 'scenarioA',
    name: 'Scenario A: Direct Database Bypass',
    badge: 'Critical Breach',
    description: 'Frontend client attempts to bypass API Gateway and Order Service to query PostgreSQL database directly.',
    prTitle: 'feat(checkout): optimize checkout latency with direct database connection',
    prAuthor: 'dev-alex (Junior Fullstack)',
    prBranch: 'feat/direct-checkout-db',
    diffCode: `--- a/apps/web/src/pages/api/checkout.ts
+++ b/apps/web/src/pages/api/checkout.ts
@@ -14,6 +14,14 @@ export default async function handleCheckout(req, res) {
-  // Route order payload through Order Service Gateway
-  const orderResp = await fetch("https://api.internal/orders/create", { ... });
-  return res.json(await orderResp.json());
+  // ARCHITECTURAL VIOLATION: Direct Client-to-DB Bypass
+  import { Client } from 'pg';
+  const pgClient = new Client({ connectionString: process.env.DATABASE_URL });
+  await pgClient.connect();
+  const result = await pgClient.query(
+    'INSERT INTO orders (user_id, amount, status) VALUES ($1, $2, $3) RETURNING id',
+    [req.body.userId, req.body.amount, 'CONFIRMED']
+  );
+  return res.status(200).json({ orderId: result.rows[0].id });
 }`,
    nodes: [
      { id: 'client', label: 'Web Client (Next.js)', type: 'client', x: 40, y: 140, width: 140, height: 60, allowedEgress: ['gateway'], color: '#3B82F6' },
      { id: 'gateway', label: 'Kong API Gateway', type: 'gateway', x: 230, y: 140, width: 140, height: 60, allowedEgress: ['order-svc', 'auth-svc'], color: '#8B5CF6' },
      { id: 'auth-svc', label: 'Auth Service', type: 'service', x: 420, y: 50, width: 140, height: 60, allowedEgress: ['db-users'], color: '#10B981' },
      { id: 'order-svc', label: 'Order Service', type: 'service', x: 420, y: 230, width: 140, height: 60, allowedEgress: ['db-orders', 'queue'], color: '#F59E0B' },
      { id: 'db-orders', label: 'Postgres (Orders DB)', type: 'database', x: 620, y: 230, width: 150, height: 60, allowedEgress: [], color: '#EF4444' },
    ],
    edges: [
      { id: 'e1', source: 'client', target: 'gateway', protocol: 'REST' },
      { id: 'e2', source: 'gateway', target: 'order-svc', protocol: 'gRPC' },
      { id: 'e3', source: 'gateway', target: 'auth-svc', protocol: 'REST' },
      { id: 'e4', source: 'order-svc', target: 'db-orders', protocol: 'DirectDB' },
      { id: 'e_illegal', source: 'client', target: 'db-orders', protocol: 'DirectDB', isViolated: true },
    ],
    score: 14,
    status: 'REJECTED',
    violations: [
      {
        id: 'viol-1',
        severity: 'CRITICAL',
        title: 'Unauthorized Client-to-DB Boundary Bypass',
        file: 'apps/web/src/pages/api/checkout.ts',
        line: 'Lines 18-24',
        sourceNode: 'Web Client (Next.js)',
        targetNode: 'Postgres (Orders DB)',
        breachDescription: 'Client layer imported pg driver and initiated direct connection to internal database, completely bypassing API Gateway security boundaries and Order Service transaction logic.',
        remediation: 'Revert direct PostgreSQL client connection. Route checkout intent through Kong API Gateway via authenticated POST /api/v1/orders endpoint.',
      },
      {
        id: 'viol-2',
        severity: 'CRITICAL',
        title: 'Network Security Isolation Violation',
        file: 'apps/web/src/pages/api/checkout.ts',
        line: 'Line 19',
        sourceNode: 'Web Client (Next.js)',
        targetNode: 'Postgres (Orders DB)',
        breachDescription: 'Public subnet application attempted direct routing into private VPC database subnet.',
        remediation: 'Ensure DATABASE_URL environment secrets are restricted strictly to internal microservice clusters.',
      }
    ],
  },
  scenarioB: {
    id: 'scenarioB',
    name: 'Scenario B: Circular Microservice Cycle',
    badge: 'Deadlock Risk',
    description: 'Auth Service and Payment Service introduce a synchronous circular HTTP call, creating deadlock vulnerability.',
    prTitle: 'fix(billing): verify user session inline before issuing subscription token',
    prAuthor: 'dev-maya (Backend Lead)',
    prBranch: 'fix/sync-auth-billing-check',
    diffCode: `--- a/services/payment-svc/src/subscription.ts
+++ b/services/payment-svc/src/subscription.ts
@@ -32,7 +32,12 @@ export async function processSubscription(subId: string) {
-  // EventBus async check
-  await eventBus.publish("subscription.verified", { subId });
+  // ARCHITECTURAL VIOLATION: Synchronous Circular Dependency
+  const authCheck = await axios.get(\`http://auth-svc:8080/v1/verify-session?subId=\${subId}\`, {
+    timeout: 5000
+  });
+  // Auth-svc already makes synchronous RPC to Payment-svc for license tier validation!
+  return authCheck.data.approved;
 }`,
    nodes: [
      { id: 'gateway', label: 'Kong API Gateway', type: 'gateway', x: 50, y: 140, width: 140, height: 60, allowedEgress: ['auth-svc', 'payment-svc'], color: '#8B5CF6' },
      { id: 'auth-svc', label: 'Auth Service', type: 'service', x: 280, y: 60, width: 150, height: 60, allowedEgress: ['payment-svc', 'db-auth'], color: '#10B981' },
      { id: 'payment-svc', label: 'Payment Service', type: 'service', x: 280, y: 220, width: 150, height: 60, allowedEgress: ['stripe-gateway'], color: '#F59E0B' },
      { id: 'db-auth', label: 'Postgres (Auth DB)', type: 'database', x: 520, y: 60, width: 150, height: 60, allowedEgress: [], color: '#3B82F6' },
    ],
    edges: [
      { id: 'e1', source: 'gateway', target: 'auth-svc', protocol: 'REST' },
      { id: 'e2', source: 'gateway', target: 'payment-svc', protocol: 'REST' },
      { id: 'e3', source: 'auth-svc', target: 'payment-svc', protocol: 'gRPC' },
      { id: 'e_cycle', source: 'payment-svc', target: 'auth-svc', protocol: 'REST', isViolated: true },
    ],
    score: 38,
    status: 'REJECTED',
    violations: [
      {
        id: 'viol-3',
        severity: 'CRITICAL',
        title: 'Synchronous Circular Dependency (Cycle Detection)',
        file: 'services/payment-svc/src/subscription.ts',
        line: 'Lines 35-39',
        sourceNode: 'Payment Service',
        targetNode: 'Auth Service',
        breachDescription: 'Payment Service introduced a synchronous HTTP GET to Auth Service while Auth Service already invokes Payment Service via gRPC, forming a closed dependency loop: [Auth -> Payment -> Auth].',
        remediation: 'Refactor to asynchronous event-driven validation via Kafka / Redis Streams or pass the verified session context as part of the initial inbound token.',
      }
    ],
  },
  scenarioC: {
    id: 'scenarioC',
    name: 'Scenario C: Decoupled Kafka Event Bus',
    badge: '100% Compliant',
    description: 'Refactoring telemetry and notifications through Kafka Event Bus conforming strictly to architectural contracts.',
    prTitle: 'refactor(analytics): migrate synchronous event tracking to async Kafka buffer',
    prAuthor: 'dev-ritik (Architect)',
    prBranch: 'refactor/async-kafka-telemetry',
    diffCode: `--- a/services/order-svc/src/events.ts
+++ b/services/order-svc/src/events.ts
@@ -20,6 +20,13 @@ export async function notifyOrderCreated(order: Order) {
-  // Synchronous webhook call removed
-  // await axios.post("http://analytics-svc/events", order);
+  // APPROVED ARCHITECTURE: Asynchronous Decoupled Event Producer
+  await kafkaProducer.send({
+    topic: 'domain.orders.created.v1',
+    messages: [{
+      key: order.id,
+      value: JSON.stringify({ orderId: order.id, amount: order.amount, ts: Date.now() })
+    }]
+  });
 }`,
    nodes: [
      { id: 'order-svc', label: 'Order Service', type: 'service', x: 60, y: 140, width: 140, height: 60, allowedEgress: ['kafka-bus'], color: '#F59E0B' },
      { id: 'kafka-bus', label: 'Kafka Event Cluster', type: 'queue', x: 290, y: 140, width: 160, height: 60, allowedEgress: ['analytics-svc', 'email-svc'], color: '#EC4899' },
      { id: 'analytics-svc', label: 'Analytics Worker', type: 'service', x: 530, y: 60, width: 150, height: 60, allowedEgress: ['data-lake'], color: '#8B5CF6' },
      { id: 'email-svc', label: 'Notification Worker', type: 'service', x: 530, y: 220, width: 150, height: 60, allowedEgress: ['sendgrid'], color: '#10B981' },
    ],
    edges: [
      { id: 'e1', source: 'order-svc', target: 'kafka-bus', protocol: 'EventBus' },
      { id: 'e2', source: 'kafka-bus', target: 'analytics-svc', protocol: 'EventBus' },
      { id: 'e3', source: 'kafka-bus', target: 'email-svc', protocol: 'EventBus' },
    ],
    score: 98,
    status: 'APPROVED',
    violations: [
      {
        id: 'viol-comp',
        severity: 'COMPLIANT',
        title: 'Architectural Invariants Verified',
        file: 'services/order-svc/src/events.ts',
        line: 'Lines 23-30',
        sourceNode: 'Order Service',
        targetNode: 'Kafka Event Cluster',
        breachDescription: 'PR complies 100% with the enterprise decoupled messaging topology. Zero synchronous coupling detected.',
        remediation: 'No remediation required. Safe for automated merge.',
      }
    ],
  }
};
