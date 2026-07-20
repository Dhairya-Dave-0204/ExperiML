# Database Design Principles

## Document Information

| Field | Value |
|--------|-------|
| **Document** | Database Design Principles |
| **Project** | ExperiML |
| **Category** | ML Experiment Management Platform |
| **Version** | v1.0.0 |
| **Codename** | Genesis |
| **Status** | Approved |
| **Phase** | 3.0 |

---

# Purpose

This document establishes the architectural principles that govern the design of the ExperiML database.

Rather than defining individual tables, this document defines the rules, standards, and design decisions that every database entity must follow throughout the project.

The objective is to create a database that is secure, normalized, scalable, maintainable, and aligned with production-grade software engineering practices.

---

# Scope

This document covers:

- Authentication strategy
- Session management
- Primary key strategy
- Naming conventions
- Audit fields
- Database normalization
- Soft delete strategy
- Cascade rules
- File storage strategy
- ENUM usage
- JSON column usage
- Indexing philosophy
- Transaction strategy

Individual table definitions, relationships, and the ER diagram are intentionally excluded and will be covered in later phases.

---

# 1. Authentication Strategy

ExperiML adopts a hybrid JWT authentication strategy that combines stateless authentication with stateful session management.

## Access Token

| Property | Value |
|----------|-------|
| Token Type | JWT |
| Storage | HTTP-only Cookie |
| Lifetime | 15 Minutes |
| Database Storage | No |

The Access Token is short-lived and is used to authenticate every protected request.

---

## Refresh Token

| Property | Value |
|----------|-------|
| Token Type | JWT |
| Storage | HTTP-only Cookie |
| Lifetime | 7 Days (Configurable) |
| Database Storage | Hashed Refresh Token |

The Refresh Token is used only to generate new Access Tokens after expiration.

Only a hashed version of the Refresh Token is stored in PostgreSQL.

---

## Session Management

Each successful login creates a new session.

Sessions provide:

- Secure authentication
- Multiple device support
- Token revocation
- Logout from individual devices
- Future session monitoring

Authentication requests remain stateless through JWT, while Refresh Tokens enable controlled session management.

---

# 2. Session Table

ExperiML maintains a dedicated Session table.

Recommended fields include:

- session_id
- user_id
- refresh_token_hash
- device_name
- browser
- operating_system
- ip_address
- user_agent
- created_at
- last_used_at
- expires_at
- revoked_at
- is_active

This design supports future features such as:

- Logged-in devices
- Logout from individual devices
- Logout from all devices
- Security auditing
- Session revocation

---

# 3. Primary Key Strategy

ExperiML uses UUIDs as the primary key for all major entities.

## Reasons

- Globally unique
- Difficult to guess
- Suitable for APIs
- Native PostgreSQL support
- Excellent Prisma support
- Widely used in production systems

UUIDs are preferred over integer identifiers for Version 1.

---

# 4. Naming Conventions

ExperiML follows a consistent naming convention.

---

## Tables

Plural nouns.

Examples:

- users
- projects
- datasets
- experiments
- sessions
- reports
- artifacts

---

## Columns

Snake case.

Examples:

- first_name
- created_at
- project_id
- experiment_status

---

## Foreign Keys

Always use descriptive names.

Examples:

- user_id
- project_id
- dataset_id
- experiment_id

---

## Constraints

Examples:

- pk_users
- fk_projects_user
- uq_users_email

---

## Indexes

Examples:

- idx_projects_user
- idx_experiments_project
- idx_sessions_user

---

# 5. Audit Columns

Every major table should contain standard audit fields.

Required:

- created_at
- updated_at

Optional (when applicable):

- deleted_at

These fields provide:

- Historical tracking
- Debugging support
- Future reporting capabilities

---

# 6. Database Normalization

ExperiML follows Third Normal Form (3NF).

Objectives:

- Eliminate redundant data
- Eliminate partial dependencies
- Eliminate transitive dependencies
- Maintain data integrity

The design favors practical normalization while avoiding unnecessary over-normalization.

---

# 7. Soft Delete Strategy

Deletion behavior varies depending on the entity.

## Soft Delete

Recommended for:

- Users
- Projects
- Datasets
- Experiments

These entities represent significant user work and should be recoverable.

---

## Hard Delete

Recommended for:

- Reports
- Session records (when appropriate)
- Temporary artifacts

Hard deletion is acceptable for resources that can be regenerated or safely recreated.

---

# 8. Cascade Strategy

Cascade behavior follows dependency rules.

## Project

Deleting a Project removes:

- Datasets
- Experiments
- Reports
- Artifacts
- Prediction History

---

## Dataset

Datasets referenced by Experiments cannot be deleted until dependency rules allow.

---

## User

Users are soft deleted rather than immediately removed.

---

Cascade behavior should always preserve database integrity.

---

# 9. File Storage Strategy

ExperiML separates structured data from binary files.

---

## PostgreSQL Stores

- Metadata
- File references
- Relationships
- Configuration
- Ownership

---

## File System Stores

- CSV datasets
- Trained models
- Pipelines
- Reports
- Prediction exports

---

The database never stores large binary files.

Instead, it stores references including:

- file_name
- file_path
- file_size
- mime_type
- checksum

This design supports future migration to cloud object storage.

---

# 10. ENUM Strategy

PostgreSQL ENUM types are used for controlled values.

Examples:

- Experiment Status
- Report Status
- Artifact Type

Lookup tables should only be used when values are expected to change dynamically.

---

# 11. JSON Column Strategy

JSON columns are used for flexible configuration data.

Examples include:

- Hyperparameters
- Training configuration
- Preprocessing configuration
- Evaluation metrics
- Feature selection

Using JSON prevents unnecessary schema complexity while maintaining flexibility.

---

# 12. Indexing Strategy

Indexes should support the application's most common queries.

Typical indexed fields include:

- users.email
- projects.user_id
- datasets.project_id
- experiments.project_id
- sessions.user_id
- artifacts.experiment_id

Additional indexes will be introduced during table design where required.

---

# 13. Transaction Strategy

Operations affecting multiple related records should execute within database transactions.

Examples include:

- Creating an Experiment
- Saving Experiment metadata
- Persisting artifact references
- Deleting Projects

Transactions ensure consistency and prevent partial database updates.

External operations such as machine learning training and filesystem writes are coordinated carefully, recognizing that they cannot always be rolled back like database transactions.

---

# Guiding Principles

The ExperiML database follows the following principles:

- Third Normal Form (3NF)
- Single Source of Truth
- Strong Referential Integrity
- Minimal Redundancy
- Consistent Naming
- Secure Authentication
- Clear Ownership
- Production-Oriented Design
- Future Scalability
- Maintainability

---

# Approved Architectural Decisions

The following decisions are approved for ExperiML Version 1.

- Hybrid JWT Authentication is used.
- Access Tokens are stored in HTTP-only cookies.
- Refresh Tokens are stored in HTTP-only cookies.
- Only hashed Refresh Tokens are stored in PostgreSQL.
- Every login creates a Session.
- UUIDs are used as primary keys.
- PostgreSQL stores metadata only.
- Binary files remain in the filesystem.
- Third Normal Form (3NF) is mandatory.
- Standard audit columns are used across major tables.
- Soft delete is preferred for critical user resources.
- PostgreSQL ENUMs are used for controlled values.
- JSON columns are used for flexible ML configurations.
- Database transactions protect multi-step database operations.

---

# Summary

The Database Design Principles establish the foundational rules that govern the ExperiML database architecture.

These principles ensure that the database remains normalized, secure, scalable, and maintainable while supporting production-grade authentication, robust session management, clean relationships, and efficient storage strategies.

All future database entities, relationships, constraints, and indexes must comply with the standards defined in this document.