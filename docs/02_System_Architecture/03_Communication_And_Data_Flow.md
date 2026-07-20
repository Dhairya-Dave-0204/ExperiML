# Communication & Data Flow Architecture

## Document Information

| Field | Value |
|--------|-------|
| **Document** | Communication & Data Flow Architecture |
| **Project** | ExperiML |
| **Category** | ML Experiment Management Platform |
| **Version** | v1.0.0 |
| **Codename** | Genesis |
| **Status** | Approved |
| **Phase** | 2.3 |

---

# Purpose

This document defines how the different services within ExperiML communicate with each other and how data moves throughout the system.

Its purpose is to establish clear communication boundaries, define ownership of responsibilities, describe request and response lifecycles, and ensure that every service has a well-defined role.

The architecture follows a centralized orchestration model where Express acts as the communication hub and the single persistence layer for the application.

---

# Scope

This document covers:

- Service communication model
- Request lifecycle
- Response lifecycle
- Data ownership
- Persistence ownership
- Communication rules
- Dataset flow
- Experiment flow
- Prediction flow
- Report flow
- Error propagation
- Communication principles

This document does **not** define API endpoints, database schema, deployment, or folder structures.

---

# 1. Communication Model

ExperiML follows a **Centralized Communication Architecture**.

Every request made by the frontend is routed through Express.

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

Express acts as the central orchestrator of the application.

No other service communicates directly with the frontend.

---

# 2. Service Communication Rules

## React

React communicates **only** with Express.

Allowed operations include:

- Authentication
- Dashboard
- Projects
- Datasets
- Experiments
- Reports
- Predictions
- Settings

React must never communicate directly with:

- FastAPI
- PostgreSQL
- Local File Storage

---

## Express

Express communicates with:

- React
- FastAPI
- PostgreSQL
- Local File Storage

Express is responsible for coordinating the complete lifecycle of every request.

---

## FastAPI

FastAPI communicates only with:

- Express

FastAPI never communicates directly with:

- React
- PostgreSQL
- Users

FastAPI remains completely independent from authentication, authorization, and project management.

---

# 3. Communication Responsibilities

Every service has a clearly defined communication responsibility.

## React

Responsible for:

- Sending user requests
- Displaying responses
- Presenting validation feedback
- Managing user interaction

---

## Express

Responsible for:

- Receiving requests
- Authentication
- Authorization
- Business logic
- Database communication
- File persistence
- Calling FastAPI
- Returning standardized responses

Express is the application's central orchestration layer.

---

## FastAPI

Responsible for:

- Data preprocessing
- Model training
- Model evaluation
- Predictions
- Returning ML results

FastAPI performs computation only.

---

# 4. Data Ownership

Every category of data has one clearly defined owner.

| Data | Owner |
|--------|-------|
| User Accounts | Express |
| Authentication | Express |
| Projects | Express |
| Datasets | Express |
| Experiments | Express |
| Reports | Express |
| Metadata | Express |
| Files | Express |
| ML Computation | FastAPI |
| Predictions | FastAPI |
| Metrics | FastAPI |

Express owns all application resources.

FastAPI owns machine learning computation.

---

# 5. Persistence Strategy

One of the core architectural decisions of ExperiML is that **Express is the single persistence layer**.

FastAPI never permanently stores data.

Instead:

```text
FastAPI

↓

Return Results

↓

Express

↓

Persist Files

↓

Persist Metadata

↓

Return Response
```

This means Express is solely responsible for:

- Saving uploaded datasets
- Saving trained models
- Saving preprocessing pipelines
- Saving reports
- Saving prediction exports
- Updating PostgreSQL
- Deleting resources
- Managing file lifecycle

FastAPI performs computation and returns artifacts but does not decide how or where they are stored.

---

# 6. Request Lifecycle

Every request follows a predictable sequence.

```text
User

↓

React

↓

Express

↓

Authentication

↓

Validation

↓

Business Logic

↓

FastAPI (if required)

↓

Return ML Results

↓

Persist Data

↓

Standardize Response

↓

React
```

This architecture ensures consistent handling for every request.

---

# 7. Dataset Upload Flow

Dataset uploads remain entirely inside the application layer.

```text
User

↓

React

↓

Express

↓

Validate Dataset

↓

Store Dataset

↓

Store Metadata

↓

React
```

FastAPI is not involved during dataset upload.

Datasets are used later during model training.

---

# 8. Experiment Training Flow

```text
User

↓

React

↓

Express

↓

Validate Request

↓

Create Experiment

↓

FastAPI

↓

Load Dataset

↓

Preprocess

↓

Train

↓

Evaluate

↓

Return Artifacts

↓

Express

↓

Persist Files

↓

Persist Metadata

↓

Update Experiment

↓

React
```

This architecture keeps FastAPI stateless while allowing Express to manage all persistent resources.

---

# 9. Prediction Flow

### Version 1

Single Prediction

```text
User

↓

React

↓

Express

↓

FastAPI

↓

Load Model

↓

Predict

↓

Return Prediction

↓

Express

↓

Store Prediction History

↓

React
```

---

### Version 1.5

Batch Prediction follows the same architecture.

The only difference is that multiple prediction results are generated and exported as a downloadable file.

---

# 10. Report Generation Flow

```text
User

↓

React

↓

Express

↓

Load Experiment

↓

Collect Metrics

↓

Generate PDF

↓

Store Report

↓

Store Metadata

↓

React
```

FastAPI provides experiment results when required.

Express generates and stores the final report.

---

# 11. File Transfer Flow

ExperiML follows a controlled file movement strategy.

### Dataset

```text
React

↓

Express

↓

Local Storage
```

---

### Model

```text
FastAPI

↓

Express

↓

Local Storage
```

---

### Pipeline

```text
FastAPI

↓

Express

↓

Local Storage
```

---

### Report

```text
Express

↓

Local Storage
```

---

### Prediction Export

```text
Express

↓

Local Storage
```

Every persistent file passes through Express.

---

# 12. Response Flow

Every response returns through Express.

```text
FastAPI

↓

Express

↓

React
```

Express is responsible for:

- Response formatting
- Error formatting
- Authentication validation
- Logging

This guarantees a consistent API contract for the frontend.

---

# 13. Error Handling

If an error occurs:

```text
FastAPI

↓

Express

↓

Standard Error Response

↓

React
```

FastAPI never exposes raw exceptions to the frontend.

Example:

```json
{
    "success": false,
    "message": "Training failed.",
    "errorCode": "TRAINING_FAILED"
}
```

This keeps error handling consistent across the application.

---

# 14. Communication Principles

The communication architecture follows these principles.

## Centralized Orchestration

Express coordinates every workflow.

---

## Single Persistence Layer

Express is the only service allowed to permanently store application resources.

---

## Separation of Concerns

Each service has one clearly defined responsibility.

---

## Stateless ML Service

FastAPI performs computation but remains stateless between requests.

---

## Loose Coupling

Services communicate only through REST APIs.

---

## Predictable Request Lifecycle

Every request follows the same architectural flow.

---

## Independent Evolution

Each service can evolve independently without affecting unrelated components.

---

# Approved Architectural Decisions

The following architectural decisions have been approved.

- React communicates only with Express.
- Express is the application's orchestration layer.
- Express is the single persistence layer.
- FastAPI performs computation only.
- FastAPI never communicates directly with React.
- FastAPI never writes permanent application data.
- PostgreSQL is accessed only through Express.
- REST APIs are used for inter-service communication.
- Express owns application metadata.
- FastAPI owns machine learning computation.

---

# Summary

ExperiML adopts a centralized communication architecture built around Express as the application's orchestration and persistence layer.

React is responsible solely for presentation and user interaction, while FastAPI focuses exclusively on machine learning computation. All communication, persistence, validation, and response formatting are coordinated by Express, resulting in a clean separation of concerns, predictable request handling, and a maintainable production-inspired architecture.

This communication model provides the foundation for the upcoming Database Design, Backend Design, API Specification, File Management, and ML Pipeline planning phases.