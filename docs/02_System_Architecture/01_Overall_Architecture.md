# ExperiML - Overall Architecture

**Document:** Overall Architecture  
**Project:** ExperiML  
**Category:** ML Experiment Management Platform  
**Version:** v1.0.0  
**Codename:** Genesis

---

# 1. Objective

This document defines the high-level architecture of ExperiML.

Its purpose is to establish how the overall system is organized, the responsibilities of each major service, and the architectural principles that will guide all future development decisions.

This document intentionally avoids implementation details such as database schema, APIs, and folder structures, which are covered in later planning phases.

---

# 2. Application Type

ExperiML is a **full-stack web application** built using a **Service-Oriented Architecture (SOA)**.

The platform enables users to create and manage machine learning projects, upload datasets, train and compare models, manage experiments, generate predictions, and produce professional reports through a browser.

Unlike traditional ML demo projects that focus on solving one prediction problem, ExperiML focuses on providing a reusable platform for managing the complete lifecycle of machine learning experiments.

---

# 3. Product Vision

The vision of ExperiML is to provide a production-inspired ML Experiment Management Platform that demonstrates real-world software engineering principles together with machine learning workflows.

The platform emphasizes:

- Production-style architecture
- Experiment management
- Reproducibility
- Modular system design
- Clean separation of responsibilities

Rather than acting as an AutoML platform or chatbot, Version 1 focuses on creating a polished, maintainable, and extensible engineering product.

---

# 4. Architectural Style

ExperiML follows a **Service-Oriented Architecture (SOA)**.

The application is divided into three independent services, each responsible for a specific domain.

```text
                    React + Tailwind

                           │

                           ▼

                  Node.js + Express

                           │

                           ▼

                    FastAPI ML Service

                           │

                           ▼

          PostgreSQL + Local File Storage
```

## Why Service-Oriented Architecture?

This architecture provides:

- Clear separation of concerns
- Better maintainability
- Easier debugging
- Independent scalability
- Production-like organization

### Why not a Monolithic Architecture?

Machine learning logic is fundamentally different from authentication, project management, and business logic.

Keeping ML isolated improves maintainability and allows Python to remain the language responsible for all ML operations.

### Why not Microservices?

A microservice architecture would introduce unnecessary complexity for the scope of Version 1.

The current architecture provides the advantages of separation while remaining simple enough for an internship project.

---

# 5. Major System Layers

## 5.1 Presentation Layer

### Technology

- React
- Tailwind CSS

### Responsibilities

- User Interface
- Routing
- Forms
- Data Visualization
- Dashboard
- Authentication Screens
- User Interaction

The Presentation Layer should never contain business logic or machine learning code.

---

## 5.2 Application Layer

### Technology

- Node.js
- Express

### Responsibilities

- Authentication
- Authorization
- Project Management
- Dataset Management
- File Upload Management
- Business Logic
- Database Operations
- Communication with FastAPI

The Application Layer acts as the central coordinator of the system.

---

## 5.3 Machine Learning Layer

### Technology

- FastAPI
- Python

### Responsibilities

- Data Validation
- Data Preprocessing
- Feature Engineering
- Model Training
- Model Evaluation
- Predictions
- Saving ML Artifacts
- Loading ML Artifacts

The ML Layer remains completely independent from authentication and user management.

---

## 5.4 Data Layer

### Technology

- PostgreSQL
- Local File Storage

### Responsibilities

- Persistent Data Storage
- Metadata Storage
- Uploaded Files
- Trained Models
- Generated Reports
- Prediction Exports

Structured data and binary files are intentionally stored separately.

---

# 6. Service Responsibilities

## React

Responsible for:

- Rendering the UI
- Navigation
- Forms
- Client-side validation
- Calling backend APIs
- Displaying results

Not responsible for:

- Business Logic
- Authentication Logic
- Database Operations
- Machine Learning

---

## Express

Responsible for:

- User Authentication
- Project Management
- Dataset Management
- Experiment Management
- File Management
- Database Communication
- Calling FastAPI
- Returning responses to the frontend

Not responsible for:

- Training ML Models
- Running Predictions
- Data Preprocessing

---

## FastAPI

Responsible for:

- Data Preprocessing
- Feature Engineering
- Model Training
- Predictions
- Evaluation
- Saving Models
- Loading Models

Not responsible for:

- Authentication
- Users
- Projects
- Database Relationships

---

# 7. Service Communication

ExperiML uses REST APIs for communication between services.

Communication formats:

- JSON
- Multipart Form Data (File Uploads)
- Binary Downloads

The request flow is:

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

The frontend never communicates directly with FastAPI.

Express acts as the central coordinator for all application requests.

---

# 8. Core Entity

The central entity of ExperiML is the **Project**.

Everything inside the platform belongs to a Project.

```text
Project

├── Datasets

├── Experiments

├── Models

├── Predictions

├── Reports

└── History
```

Projects provide a clean organizational structure that allows users to manage multiple independent machine learning workflows.

---

# 9. Ownership Model

ExperiML Version 1 follows a **single-user ownership model**.

Characteristics:

- Each user owns only their own resources.
- No collaboration.
- No teams.
- No organizations.
- No shared projects.

This keeps the system simple while remaining extensible for future versions.

---

# 10. Request Lifecycle

Example: Model Training

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

FastAPI

↓

Training

↓

Save Artifacts

↓

Update Database

↓

Return Response

↓

React
```

The Application Layer coordinates all communication with the Machine Learning Layer.

---

# 11. Data Storage Strategy

## Structured Data

Stored in PostgreSQL.

Examples:

- Users
- Projects
- Experiments
- Metadata
- Reports Metadata
- Prediction Metadata

---

## Binary Files

Stored in the local filesystem.

Examples:

- Uploaded CSV files
- Saved Models
- Saved Pipelines
- Generated Reports
- Prediction Exports

The database stores metadata and file references rather than binary files.

---

# 12. Architectural Principles

The following principles guide all future design decisions.

## Single Responsibility Principle

Every service has one clearly defined responsibility.

---

## Separation of Concerns

Presentation, business logic, and machine learning remain independent.

---

## Modularity

Components should be replaceable without affecting unrelated parts of the system.

---

## Maintainability

The architecture should remain understandable and easy to extend.

---

## Scalability

Future versions should allow independent scaling of services if required.

---

## Reproducibility

Machine learning experiments should always be reproducible.

---

# 13. Version 1 Boundaries

The following features are intentionally excluded from Version 1.

- Team Collaboration
- Organizations
- AutoML
- AI Chat
- LLM Integration
- Cloud Object Storage
- Public Model Deployment
- Background Job Queues
- Distributed Training
- Experiment Scheduling

These features remain potential additions for future versions.

---

# 14. Immutable Experiments

One of the core architectural decisions of ExperiML is that **experiments are immutable**.

Once an experiment has completed training, it becomes a permanent historical record.

The experiment cannot be modified.

If the user wants to change:

- Algorithm
- Hyperparameters
- Feature Selection
- Preprocessing
- Train/Test Split
- Scaling Strategy

a **new experiment** must be created.

For example:

```text
Customer Churn Project

│

├── Experiment 1
│   └── Random Forest

├── Experiment 2
│   └── XGBoost

├── Experiment 3
│   └── SVM

└── Experiment 4
    └── Random Forest (Tuned)
```

Every experiment represents one complete training run and preserves:

- Dataset used
- Features
- Preprocessing pipeline
- Algorithm
- Hyperparameters
- Metrics
- Generated model
- Generated reports
- Timestamp

## Benefits

- Complete reproducibility
- Reliable experiment comparison
- Historical tracking
- Safer model management
- No accidental overwriting of successful experiments
- Closer alignment with professional ML experiment tracking systems

---

# 15. Summary

The Overall Architecture establishes the foundational structure of ExperiML.

The platform adopts a Service-Oriented Architecture with React, Express, FastAPI, PostgreSQL, and local file storage. Responsibilities are clearly separated between services, communication occurs through REST APIs, Projects serve as the central organizational unit, and immutable experiments ensure reproducibility and maintainability.

This document serves as the architectural foundation for all subsequent design phases, including database design, backend architecture, API specification, file management, machine learning pipeline design, and deployment architecture.