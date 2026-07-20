# Database Table Design Standards

## Document Information

| Field | Value |
|--------|-------|
| **Document** | Database Table Design Standards |
| **Project** | ExperiML |
| **Category** | ML Experiment Management Platform |
| **Version** | v1.0.0 |
| **Codename** | Genesis |
| **Status** | Approved |
| **Phase** | 3.2 (Foundation) |

---

# Purpose

This document establishes the design standards that every PostgreSQL table within ExperiML must follow.

Rather than defining individual tables, this document defines the structural rules, column conventions, PostgreSQL data types, and architectural guidelines that ensure consistency throughout the database.

All table designs created in later phases must comply with these standards.

---

# Scope

This document covers:

- Standard column conventions
- PostgreSQL data type standards
- Primary key strategy
- Timestamp strategy
- JSON storage strategy
- Artifact storage strategy
- Table design philosophy
- Constraint guidelines
- Future scalability considerations

Individual table definitions are intentionally excluded.

---

# 1. Table Design Philosophy

Every table should represent exactly one business responsibility.

Tables should never mix unrelated concepts.

The database should remain:

- Normalized (3NF)
- Maintainable
- Easy to query
- Easy to extend
- Production-oriented

Every table should answer one question:

> **What business responsibility does this table own?**

If a table owns multiple unrelated responsibilities, it should be redesigned.

---

# 2. Standard Primary Key

Every major entity uses UUID as its primary key.

Example:

```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
```

## Reasons

- Globally unique
- Secure
- Production-friendly
- Native PostgreSQL support
- Excellent Prisma support

UUIDs are used consistently across all major entities.

---

# 3. Standard Audit Columns

Every major table should contain standard audit fields.

Required:

- id
- created_at
- updated_at

Optional (when applicable):

- deleted_at

The audit fields support:

- Historical tracking
- Debugging
- Reporting
- Future recovery features

---

# 4. Timestamp Strategy

ExperiML uses timezone-aware timestamps.

Standard type:

```text
TIMESTAMPTZ
```

Examples:

- created_at
- updated_at
- expires_at
- last_used_at
- revoked_at

Using TIMESTAMPTZ ensures correct handling across environments and deployments.

---

# 5. PostgreSQL Data Type Standards

The following standards apply throughout the project.

| Data | PostgreSQL Type |
|------|-----------------|
| Primary Key | UUID |
| Email | TEXT |
| Password Hash | TEXT |
| Name | TEXT |
| Description | TEXT |
| File Name | TEXT |
| File Path | TEXT |
| MIME Type | TEXT |
| File Size | BIGINT |
| Checksum | TEXT |
| Boolean Values | BOOLEAN |
| Date & Time | TIMESTAMPTZ |
| Flexible Configuration | JSONB |
| Status Values | ENUM |
| URLs | TEXT |

---

# 6. JSONB Strategy

ExperiML uses PostgreSQL JSONB for structured configuration and machine learning metadata.

Examples include:

- Hyperparameters
- Training configuration
- Preprocessing configuration
- Feature selection
- Evaluation metrics
- Model configuration
- Training summary

## Why JSONB?

- Flexible structure
- Queryable
- Indexable
- Production standard
- Avoids unnecessary sparse columns

Only structured metadata belongs in JSONB.

Binary files do not.

---

# 7. Artifact Strategy

One of the core database principles of ExperiML is the distinction between structured metadata and generated files.

## Structured Information

Stored inside PostgreSQL.

Examples:

- Metrics
- Hyperparameters
- Feature list
- Training configuration
- Model configuration
- Experiment summary

These values remain queryable through SQL.

---

## Artifacts

Artifacts represent downloadable or generated files.

Examples include:

- model.pkl
- preprocessing_pipeline.pkl
- report.pdf
- prediction_export.csv
- feature_importance.json
- feature_importance.csv

Artifacts are stored in the filesystem.

PostgreSQL stores only their metadata and file references.

---

# 8. Artifact Definition

An Artifact is defined as:

> **Any downloadable or generated file produced by an Experiment.**

Artifacts are not independent business entities.

They always belong to exactly one Experiment.

Each Artifact stores metadata such as:

- Artifact Type
- File Name
- File Path
- File Size
- MIME Type
- Checksum
- Creation Timestamp

The actual file is stored outside PostgreSQL.

---

# 9. Structured Experiment Data

The Experiment entity owns structured machine learning information.

Examples include:

- Training metrics
- Hyperparameters
- Feature selection
- Training configuration
- Preprocessing configuration
- Model configuration

These values are stored directly inside the Experiment table using standard columns and JSONB where appropriate.

This enables efficient querying without reading external files.

---

# 10. Constraint Philosophy

Every table should use constraints to protect data integrity.

Typical constraints include:

- Primary Keys
- Foreign Keys
- NOT NULL
- UNIQUE
- CHECK constraints
- ENUM validation

Constraints should enforce business rules whenever possible.

---

# 11. Indexing Philosophy

Indexes should support common application queries.

Examples include:

- User lookups
- Project retrieval
- Experiment history
- Session validation
- Artifact retrieval
- Prediction history

Indexes will be defined individually during table implementation.

---

# 12. Security Considerations

Sensitive information should never be stored in plain text.

Examples:

- Passwords → Hashed
- Refresh Tokens → Hashed

Authentication cookies are managed by the backend and are not stored directly in PostgreSQL.

The database stores only the hashed Refresh Token for session validation.

---

# 13. Future Scalability

These standards are designed to support future enhancements without major schema redesign.

Examples include:

- Cloud object storage
- Background jobs
- Additional ML algorithms
- Explainability modules
- Batch prediction
- Experiment comparison
- Multi-model support

The database should evolve through new entities and relationships rather than breaking existing structures.

---

# Guiding Principles

The following principles guide all future table designs.

- Third Normal Form (3NF)
- Single Responsibility
- Consistent Naming
- Query-Friendly Design
- Metadata over Binary Storage
- Strong Referential Integrity
- Production-Oriented Standards
- Future Extensibility
- Secure Authentication
- Maintainable Schema

---

# Approved Architectural Decisions

The following decisions are approved.

- UUID is the standard primary key.
- TIMESTAMPTZ is the standard timestamp type.
- JSONB is the standard type for flexible structured ML metadata.
- PostgreSQL stores metadata, not binary files.
- Every downloadable/generated file produced by an Experiment is an Artifact.
- Metrics remain inside the Experiment entity.
- Hyperparameters remain inside the Experiment entity.
- Training configuration remains inside the Experiment entity.
- Preprocessing configuration remains inside the Experiment entity.
- Artifact metadata is stored in PostgreSQL.
- Artifact files are stored in the filesystem.
- Every table follows a single-responsibility design.

---

# Summary

The Database Table Design Standards establish the structural foundation for every PostgreSQL table in ExperiML.

By standardizing primary keys, audit fields, PostgreSQL data types, JSONB usage, artifact handling, and table design philosophy before implementation, the database remains consistent, maintainable, scalable, and aligned with production-grade engineering practices.

These standards serve as the blueprint for designing every entity table in the upcoming phases.