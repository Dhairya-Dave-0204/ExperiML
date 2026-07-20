# Internal Service Architecture

## Document Information

| Field | Value |
|--------|-------|
| **Document** | Internal Service Architecture |
| **Project** | ExperiML |
| **Category** | ML Experiment Management Platform |
| **Version** | v1.0.0 |
| **Codename** | Genesis |
| **Status** | Approved |
| **Phase** | 2.2 |

---

# Purpose

This document defines the internal architecture of each service within ExperiML.

Rather than describing how the services communicate with each other, this document explains how each individual service should be organized internally, where responsibilities belong, and the architectural patterns that will guide implementation.

The objective is to create a maintainable, scalable, and production-inspired codebase from the beginning.

---

# Scope

This document covers:

- Internal architecture of React
- Internal architecture of Express
- Internal architecture of FastAPI
- Responsibility distribution
- Service communication strategy
- Validation strategy
- Configuration management
- Error handling
- Logging strategy
- Extensibility principles

Database schema, API contracts, deployment, and file management are intentionally excluded and will be covered in later planning phases.

---

# 1. Architectural Pattern

ExperiML follows different architectural patterns for each service based on its responsibilities.

---

## 1.1 React

### Pattern

Feature-Based Architecture

Instead of grouping files by type, React will group files by feature.

Example:

```text
features/

├── authentication/

├── dashboard/

├── projects/

├── datasets/

├── experiments/

├── predictions/

├── reports/

└── profile/
```

### Why?

This approach keeps all files related to a feature together, making navigation easier and improving maintainability as the project grows.

---

## 1.2 Express

### Pattern

Layered Architecture

```text
Routes

↓

Controllers

↓

Services

↓

Repositories (Prisma)

↓

PostgreSQL
```

### Layer Responsibilities

**Routes**

- Define API endpoints
- Connect requests to controllers

---

**Controllers**

- Receive HTTP requests
- Validate request format
- Return HTTP responses
- Call services

---

**Services**

- Business logic
- Project workflows
- Dataset workflows
- Experiment workflows
- Communication with FastAPI

---

**Repositories (Prisma)**

- Database interaction
- CRUD operations
- Query abstraction

---

### Why?

Each layer has a single responsibility, resulting in a clean, modular architecture.

---

## 1.3 FastAPI

### Pattern

Layered Machine Learning Architecture

```text
API Endpoints

↓

ML Services

↓

Training Pipeline

↓

Model Manager

↓

Artifacts
```

### Responsibilities

**API Layer**

- Accept requests
- Validate ML schemas
- Return responses

---

**ML Services**

- Coordinate ML workflows
- Call preprocessing
- Call training
- Call prediction

---

**Training Pipeline**

- Data preprocessing
- Feature engineering
- Model training
- Evaluation

---

**Model Manager**

- Save models
- Load models
- Manage pipelines

---

**Artifacts**

- Models
- Pipelines
- Metrics
- Configurations

---

FastAPI is completely independent from user authentication and project management.

---

# 2. Responsibility Distribution

Every service has clearly defined responsibilities.

---

## React

Responsible for:

- User Interface
- Routing
- Forms
- Client-side validation
- Dashboard
- Charts
- API calls

Not responsible for:

- Authentication logic
- Database operations
- Business logic
- Machine learning

---

## Express

Responsible for:

- Authentication
- Authorization
- Project management
- Dataset management
- Experiment management
- Report management
- Database operations
- File management
- Business logic
- Communication with FastAPI

Not responsible for:

- Training models
- Predictions
- ML preprocessing

---

## FastAPI

Responsible for:

- Data preprocessing
- Feature engineering
- Training
- Evaluation
- Prediction
- Model persistence
- Pipeline persistence

Not responsible for:

- Users
- Authentication
- Projects
- Database relationships

---

# 3. Frontend Communication Strategy

The React application communicates only with Express.

Components never communicate directly with Axios.

Instead, every request passes through a centralized API layer.

```text
Component

↓

API Service

↓

Axios

↓

Express
```

## Benefits

- Centralized API configuration
- Easier authentication handling
- Consistent error handling
- Better maintainability

---

# 4. Backend Communication Strategy

Express acts as the central orchestrator of the application.

FastAPI is never called directly by the frontend.

Communication flow:

```text
React

↓

Express

↓

FastAPI

↓

Express

↓

React
```

This architecture ensures that all authentication, authorization, project ownership checks, and business rules remain inside Express.

---

# 5. Validation Strategy

Validation occurs at multiple levels.

## React

- Required fields
- Form validation
- User-friendly feedback

---

## Express

- Authentication
- Authorization
- Business rules
- Input validation

---

## FastAPI

- ML schema validation
- Dataset validation
- Prediction validation
- Training configuration validation

This layered validation approach provides defense in depth.

---

# 6. Configuration Management

Each service maintains its own configuration.

---

## React

Examples

- Backend API URL

---

## Express

Examples

- JWT Secret
- Database URL
- FastAPI URL
- Upload directory

---

## FastAPI

Examples

- Model directory
- Pipeline directory
- Artifact directory
- Training defaults

Environment variables will be used to separate development and production environments.

---

# 7. Error Handling Strategy

All services should follow a consistent error response format.

Example:

```json
{
    "success": false,
    "message": "Dataset not found.",
    "errorCode": "DATASET_NOT_FOUND"
}
```

Benefits:

- Consistent frontend handling
- Easier debugging
- Predictable API behavior

---

# 8. Logging Strategy

Version 1 uses structured application logs.

Events that should be logged include:

- User login
- User registration
- Dataset upload
- Experiment creation
- Model training started
- Model training completed
- Prediction completed
- Report generated

Logging should assist debugging without introducing unnecessary complexity.

---

# 9. Internal Module Communication

Modules should communicate only through their public services.

Example:

```text
Project Service

↓

Dataset Service

↓

Experiment Service
```

Direct access between unrelated modules should be avoided.

This promotes loose coupling and improves maintainability.

---

# 10. Extensibility Principles

The architecture should support future expansion without major restructuring.

Future enhancements should include:

- New ML algorithms
- Additional preprocessing techniques
- SHAP explainability
- Batch prediction improvements
- Cloud storage
- Background jobs
- AI assistants

The system should be designed for extension rather than modification.

---

# Architectural Decisions

The following decisions are approved for ExperiML Version 1.

- React follows a Feature-Based Architecture.
- Express follows a Layered Architecture.
- FastAPI follows a Layered Machine Learning Architecture.
- Express acts as the central application orchestrator.
- React never communicates directly with FastAPI.
- REST APIs are used for inter-service communication.
- Validation occurs independently within each layer.
- Configuration is managed through environment variables.
- Structured logging is used throughout the application.
- Internal modules communicate through service interfaces rather than direct access.

---

# Summary

The Internal Service Architecture establishes the organizational structure of every service within ExperiML.

Each service has a clearly defined purpose, responsibilities are separated according to architectural best practices, and communication follows a centralized orchestration model where Express coordinates all interactions with the Machine Learning service.

This document provides the structural foundation for backend implementation, API design, and future system scalability while maintaining a clean and maintainable codebase.