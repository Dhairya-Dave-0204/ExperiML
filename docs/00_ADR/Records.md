# Architectural Decision Records (ADRs)

For every major architectural decision we make, we record it.

## ADR-001
- Decision: ExperiML uses Service-Oriented Architecture.
- Reason: Separate application logic from ML logic.

## ADR-002
- Decision: React never communicates directly with FastAPI.
- Reason: Express remains the orchestration layer.

## ADR-003
- Decision: Experiments are immutable.
- Reason: Ensures reproducibility and historical tracking.

## ADR-004
- Decision: Express is the single persistence layer.
- Reason: One owner for all persistence simplifies lifecycle management, storage migration, backups, and cleanup.

## ADR-005
Express is the only service that communicates with FastAPI.

## ADR-006 
Express is the single persistence layer.

## ADR-007 
FastAPI is stateless and performs computation only.

## ADR-008 
All persistent application resources are owned by Express.

## ADR-009 
ExperiML follows an Experiment-Centric Architecture rather than a Model-Centric Architecture.

## ADR-010
Models, pipelines, metrics, reports, and configurations are Experiment Artifacts, not first-class entities.

## ADR-011
Every Experiment is immutable and represents a complete training snapshot.

## ADR-012 
Failed experiments are retained as part of the project's history and are never restarted.

## ADR-013 
Every lifecycle transition is controlled by Express.

## ADR-014
Hybrid JWT authentication with short-lived Access Tokens and hashed Refresh Tokens.

## ADR-015 
HTTP-only cookies are the exclusive storage mechanism for authentication tokens.

## ADR-016 
Every successful login creates a persistent Session record.

## ADR-017 
UUID is the standard primary key strategy across major entities.

## ADR-018 
PostgreSQL stores metadata only; binary artifacts are stored in the filesystem.

## ADR-019 
ExperiML targets Third Normal Form (3NF) with practical normalization.

## ADR-020 
PostgreSQL ENUMs are preferred over lookup tables for application-controlled values.

## ADR-021 
JSON columns are used for flexible ML configurations where appropriate.

## ADR-022 
ExperiML models only objects with an independent business identity as database entities.

## ADR-023 
The domain model consists of four business entities and three supporting entities.

## ADR-024 
Artifact is a first-class supporting entity representing all generated experiment outputs.

## ADR-025
Predictions belong to Experiments, not Projects.

## ADR-026 
Generated outputs (models, reports, metrics, pipelines, configurations, etc.) are represented as Artifacts rather than individual entities.

## ADR-027 
UUID is the standard primary key for all major database entities.

## ADR-028 
TIMESTAMPTZ is the standard timestamp type across the database.

## ADR-029 
JSONB is used for structured, queryable ML metadata.

## ADR-030 
Only downloadable/generated files are classified as Artifacts.

## ADR-031 
Structured ML data (metrics, hyperparameters, configurations, etc.) belongs in the experiments table rather than as filesystem artifacts.

## ADR-032 
PostgreSQL stores metadata, while the filesystem stores binary artifacts.

## ADR-033 
The users table is responsible only for identity and authentication credentials.

## ADR-034 
first_name and last_name are stored separately instead of a single full_name.

## ADR-035 
account_status and deleted_at serve different purposes and are both retained.

## ADR-036 
Authentication sessions are managed exclusively by the sessions table.

## ADR-037 
Audit timestamps are standardized and managed consistently across all major tables.

## ADR-038 
Every successful login creates a new Session.

## ADR-039 
Sessions store only hashed Refresh Tokens; Access Tokens are never persisted.

## ADR-040 
Session state is derived from timestamps rather than stored explicitly.

## ADR-041 
Device information is stored in structured fields while preserving the original User-Agent.

## ADR-042 
Sessions are hard deleted after expiration or scheduled cleanup.

## ADR-043 
Projects are the central business workspace of ExperiML.

## ADR-044 
Project names must be unique per user (UNIQUE(user_id, name)).

## ADR-045 
Projects store only identity, ownership, metadata, and lifecycle information.

## ADR-046 
Problem type belongs to Experiments, not Projects.

## ADR-047 
Derived values (dataset count, experiment count, etc.) are never stored in the Projects table.

## ADR-048 
Human-readable project codes are intentionally excluded from Version 1 in favor of UUIDs.

## ADR-049 
Datasets are immutable; every upload creates a new Dataset record.

## ADR-050 
Experiments must reference a specific Dataset version, not just a Project.

## ADR-051 
Dataset profiling information is stored in a JSONB metadata column.

## ADR-052 
Dataset-specific file metadata remains within the Datasets table rather than a generic file entity.

## ADR-053 
Dataset versions are unique within a Project using UNIQUE(project_id, name, dataset_version).

## ADR-054 
Machine learning configuration (target column, preprocessing, feature selection, etc.) belongs exclusively to the Experiment entity.

## ADR-055 
Experiments are immutable; any change creates a new Experiment.

## ADR-056 
Experiments reference both project_id and dataset_id; consistency is enforced by the application layer.

## ADR-057 
Training configuration, hyperparameters, and metrics are stored in separate JSONB columns.

## ADR-058 
Algorithms are stored as TEXT instead of an ENUM to allow future expansion.

## ADR-059 
started_at and completed_at are stored instead of a derived training duration.

## ADR-060 
Experiments are the system's single source of truth for reproducible ML training runs.

## ADR-061 
Artifacts represent only generated outputs; uploaded datasets are separate entities.

## ADR-062 
Artifacts are append-only and are never modified or overwritten.

## ADR-063 
Artifact types describe business purpose and use a PostgreSQL ENUM.

## ADR-064 
File formats are stored as TEXT to support future formats without schema changes.

## ADR-065 
Artifact-specific descriptive information is stored in a metadata JSONB column.

## ADR-066 
All generated files follow a centralized storage and lifecycle model through the Artifacts table.

## ADR-068 
Prediction outputs are stored as Artifacts and linked through output_artifact_id.

## ADR-069 
Prediction input files are separate from the Datasets entity because they have different business lifecycle.

## ADR-070 
Prediction metadata is stored in a dedicated JSONB column.

## ADR-071 
Prediction execution lifecycle is tracked using prediction_status, started_at, and completed_at.

## ADR-072 
Prediction inputs support multiple formats (CSV, XLSX, PARQUET) through an ENUM.

## ADR-073 
Backend responsibilities are divided using a layered architecture with single-responsibility components.

## ADR-074 
Express acts as the orchestration layer while FastAPI remains stateless and computation-focused.

## ADR-075 
Business logic resides exclusively within the Service layer.

## ADR-076 
All API responses and errors follow standardized formats using ApiResponse and ApiError.

## ADR-077 
Critical ML entities (Datasets, Experiments, Artifacts) follow an immutable lifecycle.

## ADR-078 
Architectural dependencies flow inward toward the business logic and infrastructure never depends on HTTP layers.

## ADR-079 
Express is the single orchestration layer for all application workflows.

## ADR-080 
Backend services are divided into Domain Services and Infrastructure Services.

## ADR-081 
PostgreSQL stores only business metadata, while binary assets are stored in the filesystem.

## ADR-082 
All machine learning operations are delegated to a stateless FastAPI service.

## ADR-083 
Infrastructure dependencies are accessed only through Infrastructure Services.

## ADR-084 
Every backend request follows the Route → Middleware → Controller → Domain Service → Infrastructure Service execution flow.

## ADR-085 
Every request follows a fixed execution flow from Route to ApiResponse.

## ADR-086 
Controllers remain thin and delegate all business logic to Domain Services.

## ADR-087 
Middleware executes in a fixed order: Logging → Authentication → Authorization → Validation → File Upload.

## ADR-088 
Infrastructure interactions occur exclusively through Infrastructure Services.

## ADR-089 
Errors propagate using ApiError, asyncHandler, and Global Error Middleware.

## ADR-090 
Database transactions are managed exclusively within the Service layer.

## ADR-091 
Every request is assigned a unique Request ID for end-to-end tracing.

## ADR-092 
The backend adopts a feature-based directory structure with Infrastructure divided into Clients (external communication) and Services (application-facing abstractions), ensuring clear separation between business logic and external integrations.

## ADR-093
All backend APIs follow a versioned REST architecture using standardized JSON responses, consistent HTTP methods, uniform naming conventions, and a common pagination format.

## ADR-094
ExperiML uses JWT-based stateless authentication with resource ownership authorization, bcrypt password hashing, and a security model designed to support future role-based access control.

## ADR-095
ExperiML separates application orchestration, machine learning execution, and file storage by using an Express backend, a dedicated FastAPI service, and a storage abstraction composed of Storage Services and Storage Clients. Large files are stored on the file system while metadata is maintained in the relational database.

## ADR-096
ExperiML centralizes operational concerns through a Configuration Service and Logger Service, uses environment-based configuration management, follows standardized error handling, and adopts a stateless, platform-independent deployment architecture with independently deployable backend services.

## ADR-097
The API documentation is maintained as a single endpoint catalog that provides a high-level inventory of available REST endpoints while delegating implementation details, response standards, authentication, and architectural behavior to the Backend Design documentation.

## ADR-098
ExperiML manages all datasets, artifacts, visualizations, and prediction outputs through a controlled lifecycle that separates file storage from metadata management, enforces secure upload and download operations, and maintains consistency between the file system and the database.

## ADR-099 
ExperiML adopts a centralized design system based on Tailwind CSS, Manrope, Inter, Lucide React, and Framer Motion. The system emphasizes accessibility, consistency, responsive design, and restrained use of motion to create a professional enterprise-grade user interface.

## ADR-100
ExperiML adopts a modular machine learning pipeline where experiment orchestration is managed by the Express backend and computational ML tasks are delegated to an independent FastAPI service. This separation improves scalability, maintainability, and reproducibility while ensuring a consistent workflow for all experiments.

## ADR-101
ExperiML adopts a standardized experiment lifecycle in which every experiment progresses through defined stages from creation to completion. This ensures reproducibility, organized project management, consistent execution tracking, and persistent association between experiments, datasets, models, and generated artifacts.