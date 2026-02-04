# NonceLogic Architecture: The Concept Car

## 1. Overview

**NonceLogic** is an enterprise-grade AI governance platform.
The "Concept Car" represents our **Vertical Slice**—a fully functional, end-to-end demonstration of the core value proposition: **AI Generation with Compliance Guardrails.**

We are proving that you can generate assets (Text, Code, Media) while enforcing strict policy checks (PII, C2PA, License) in real-time.

---

## 2. Tech Stack

Our stack is chosen for **Safety, Scalability, and Speed**.

### **Frontend** (`apps/web`)

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **State Management:** React Query (via tRPC)
- **Styling:** Tailwind CSS + Radix UI (`@repo/ui`)
- **Forms:** React Hook Form + Zod

### **Backend Service** (`packages/service`)

- **API Layer:** tRPC (Type-safe API)
- **Runtime:** Node.js (Next.js API Routes / Server Actions)
- **Validation:** Zod (Runtime schema validation)

### **Database** (`packages/database`)

- **ORM:** Prisma
- **Database:** PostgreSQL (Supabase / Neon / RDS)
- **Single Source of Truth:** All schema definitions live here.

### **AI & Policy**

- **AI SDK:** Vercel AI SDK (`ai`, `@ai-sdk/openai`)
- **Policy Engine:** Custom Rule Engine (`packages/service/src/services/policy.ts`)
- **Compliance:** C2PA (simulated), PII detection

---

## 3. Data Flow

### **Asset Generation**

1.  **User** submits a prompt via `apps/web`.
2.  **tRPC Mutation** (`media.generate`) receives the request.
3.  **Service** creates a `GenerationJob` in the DB (`PROCESSING`).
4.  **AI Worker** (simulated async process) generates the asset.
5.  **Policy Engine** runs checks (C2PA, Safety) on the generated content.
6.  **Asset** is created with status `PENDING_REVIEW` (if policy passes) or `REJECTED` (if critical failure).
7.  **Audit Log** records every step.

### **Asset Banking & Review**

1.  **Reviewer** accesses the **Approval Queue**.
2.  **tRPC Query** (`asset.approvalQueue`) fetches pending assets.
3.  **Reviewer** approves or rejects.
4.  **Audit Log** records the decision, actor, and timestamp.
5.  **Asset Status** updates to `APPROVED` or `REJECTED`.

---

## 4. Security & Compliance

### **RBAC (Role-Based Access Control)**

- **VIEWER:** Can see approved assets.
- **CONTRIBUTOR:** Can generate and submit assets.
- **REVIEWER:** Can approve/reject assets.
- **ADMIN:** Full access, bulk actions, configuration.

### **Policy Engine**

We treat policies as **Code**.

- **Rules:** Defined in `services/policy.ts` using `zod` refinements.
- **Execution:** Runs synchronously after generation or asynchronously on update.
- **Transparency:** Every check produces a pass/fail report attached to the asset.

### **Audit Trail**

- **Immutable Logs:** Every `create`, `update`, `delete`, or `status_change` is logged to the `AuditLog` table.
- **Who, What, When:** Actor ID, Action Type, Entity ID, Timestamp.

---

## 5. Repository Structure (Monorepo)

```bash
.
├── apps/
│   └── web/                # Next.js Application (Dashboard)
├── packages/
│   ├── config/             # Shared TSConfig, ESLint, Tailwind
│   ├── database/           # Prisma Schema & Client
│   ├── entities/           # Shared Zod Schemas & Types
│   ├── feedback/           # Feedback Widget Component
│   ├── forms/              # Shared Form Logic
│   ├── service/            # Business Logic (tRPC Routers, Policy)
│   ├── state/              # Global State (XState / Zustand - optional)
│   └── ui/                 # Shared UI Components (Design System)
└── docs/                   # Documentation
```

---

## 6. Roadmap

### **Phase 1: Concept Car (Current)**

- [x] Monorepo Setup (Turbo)
- [x] Database Schema (Prisma)
- [x] tRPC Setup
- [x] AI Generation Mockup
- [x] Policy Engine Prototype
- [x] Asset Banking UI

### **Phase 2: The Engine (Next)**

- [ ] **Real AI Integration:** Connect OpenAI / Anthropic via Vercel AI SDK.
- [ ] **Vector Database:** For semantic search of assets.
- [ ] **Auth:** Integrate Clerk / NextAuth for real user management.
- [ ] **Storage:** Connect S3 / R2 for real media files.

### **Phase 3: The Enterprise**

- [ ] **SSO / SAML:** For corporate login.
- [ ] **Custom Policies:** Allow admins to write policies in UI.
- [ ] **Analytics:** Dashboard for usage and compliance stats.
