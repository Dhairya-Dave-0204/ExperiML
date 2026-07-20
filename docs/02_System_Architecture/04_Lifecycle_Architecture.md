# Lifecycle Architecture

## Document Information

| Field | Value |
|--------|-------|
| **Document** | Lifecycle Architecture |
| **Project** | ExperiML |
| **Category** | ML Experiment Management Platform |
| **Version** | v1.0.0 |
| **Codename** | Genesis |
| **Status** | Approved |
| **Phase** | 2.4 |

---

# Purpose

This document defines how the major entities within ExperiML evolve throughout their lifetime.

It establishes the lifecycle of each core entity, the events that trigger state transitions, ownership of lifecycle changes, deletion strategies, dependency rules, and the architectural principles that ensure reproducibility and maintainability.

Unlike the Communication Architecture, which focuses on how services interact, the Lifecycle Architecture focuses on how application entities are created, modified, archived, and removed over time.

---

# Scope

This document covers:

- Core lifecycle entities
- Entity creation
- Entity states
- State transitions
- Lifecycle ownership
- Dependency relationships
- Deletion strategies
- Recovery strategy
- Audit information
- Experiment-centric architecture

Database schema implementation is intentionally excluded.

---

# 1. Core Lifecycle Entities

Only entities that represent meaningful user work have a defined lifecycle.

The primary lifecycle entities are:

- Project
- Dataset
- Experiment
- Prediction
- Report

Machine learning models, preprocessing pipelines, metrics, and configurations are **not treated as independent entities**. Instead, they are considered artifacts produced by an Experiment.

---

# 2. Entity Creation

Each entity is created through a well-defined workflow.

## Project

Created when a user creates a new project.

```text
User
    ↓
React
    ↓
Express
    ↓
Database
```

---

## Dataset

Created when a user uploads a dataset.

```text
User
    ↓
React
    ↓
Express
    ↓
Store Dataset
    ↓
Save Metadata
```

---

## Experiment

Created when the user starts a training process.

```text
User
    ↓
React
    ↓
Express
    ↓
Create Experiment
    ↓
FastAPI
    ↓
Return Results
    ↓
Persist Artifacts
```

---

## Prediction

Created whenever a prediction request is executed.

---

## Report

Created whenever the user generates a report for an experiment.

---

# 3. Lifecycle States

Each lifecycle entity progresses through a predefined set of states.

---

## Project

```text
Created
    ↓
Active
    ↓
Archived
    ↓
Deleted
```

---

## Dataset

```text
Uploading
    ↓
Processing
    ↓
Ready
    ↓
Deleted
```

---

## Experiment

```text
Created
    ↓
Queued
    ↓
Training
    ↓
Completed
        ↘
         Failed
```

Completed and Failed experiments become permanent historical records.

---

## Prediction

```text
Requested
    ↓
Running
    ↓
Completed
```

Future versions may introduce prediction expiration or archival.

---

## Report

```text
Generating
    ↓
Available
    ↓
Downloaded
    ↓
Deleted
```

---

# 4. State Transitions

Every state transition is triggered by a defined event.

Examples:

### Experiment

```text
Created
    ↓ (User starts training)
Queued
    ↓
Training
    ↓ (Training completed successfully)
Completed
```

or

```text
Training
    ↓ (Training error)
Failed
```

State transitions are always controlled by Express.

---

# 5. Entity Modification Rules

Each entity has different modification permissions.

## Project

Editable

- Name
- Description

---

## Dataset

Immutable after upload.

If the data changes, a new dataset should be uploaded.

---

## Experiment

Immutable.

No modifications are allowed after creation.

Any change to:

- Algorithm
- Hyperparameters
- Feature Selection
- Train/Test Split
- Preprocessing
- Scaling

requires creating a new Experiment.

---

## Prediction

Immutable historical record.

---

## Report

Immutable generated artifact.

A new report can be generated if required.

---

# 6. Dependency Hierarchy

ExperiML follows a strict dependency hierarchy.

```text
User
│
└── Project
      │
      ├── Dataset(s)
      │
      └── Experiment(s)
             │
             ├── Model Artifact
             ├── Pipeline Artifact
             ├── Metrics
             ├── Configuration
             ├── Report
             └── Prediction History
```

Every Experiment belongs to exactly one Project.

Every Experiment references one Dataset.

All artifacts belong to exactly one Experiment.

---

# 7. Experiment-Centric Architecture

One of the core architectural decisions of ExperiML is that the platform is **Experiment-Centric** rather than **Model-Centric**.

Instead of treating trained models as the primary object, Experiments become the central engineering unit.

An Experiment represents one complete machine learning training run.

Each Experiment contains:

- Dataset Reference
- Feature List
- Target Column
- Preprocessing Configuration
- Train/Test Split Configuration
- Algorithm
- Hyperparameters
- Evaluation Metrics
- Model Artifact
- Pipeline Artifact
- Generated Report
- Prediction History
- Timestamp

This architecture aligns with professional experiment tracking systems and greatly improves reproducibility.

---

# 8. Experiment Artifacts

Experiments produce artifacts.

Artifacts are outputs generated during training and evaluation.

Typical artifacts include:

- model.pkl
- preprocessing_pipeline.pkl
- metrics.json
- experiment_config.json
- feature_importance.json (when supported)
- report.pdf

Artifacts are not independent entities.

They exist only as part of an Experiment.

---

# 9. Deletion Strategy

Deletion follows dependency rules.

## Project

Deleting a project removes all associated resources.

The deletion process includes:

- Datasets
- Experiments
- Reports
- Artifacts
- Prediction History

---

## Dataset

Datasets may only be deleted if dependency rules allow.

Datasets currently referenced by Experiments should not be deleted directly.

---

## Experiment

Deleting an Experiment removes all associated artifacts.

This includes:

- Model
- Pipeline
- Metrics
- Configuration
- Reports
- Prediction History

---

## Report

Reports can be regenerated.

Hard deletion is acceptable.

---

# 10. Recovery Strategy

Experiments are never restarted.

If training fails:

```text
Failed Experiment

↓

User modifies configuration

↓

Create New Experiment
```

The failed experiment remains part of the project's history.

This preserves reproducibility and historical records.

---

# 11. Audit Information

Every lifecycle entity should maintain audit information.

Recommended fields:

- Created At
- Updated At
- Status
- Owner
- Deleted At (optional for future use)

These fields improve traceability, debugging, and future reporting.

---

# 12. Lifecycle Ownership

Express is responsible for every lifecycle transition.

FastAPI performs machine learning computation but never changes application state.

Examples:

- Mark Experiment as Completed
- Mark Experiment as Failed
- Generate Reports
- Save Artifacts
- Delete Resources

All lifecycle decisions remain inside Express.

---

# Approved Architectural Decisions

The following lifecycle decisions are approved.

- Experiments are immutable.
- Experiments are the central engineering entity.
- Models are not first-class entities.
- Models, pipelines, metrics, reports, and configurations are Experiment Artifacts.
- Every Experiment represents one complete training run.
- Every state transition is managed by Express.
- Failed Experiments remain part of project history.
- Creating a modified training configuration always results in a new Experiment.
- Artifacts cannot exist independently from an Experiment.

---

# Summary

ExperiML adopts an Experiment-Centric Lifecycle Architecture.

Projects act as workspaces, Datasets provide the source data, and Experiments become the primary engineering unit responsible for encapsulating the complete machine learning workflow.

Every Experiment is immutable and produces a collection of artifacts—including trained models, preprocessing pipelines, metrics, reports, and configurations—that together form a reproducible snapshot of a training run.

This lifecycle design establishes a clean, scalable, and production-inspired foundation that will directly guide the upcoming Database Design, API Specification, File Management Strategy, and Machine Learning Pipeline.