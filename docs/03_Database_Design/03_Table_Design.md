# Users Table Design

## Document Information

| Field | Value |
|--------|-------|
| **Document** | Users Table Design |
| **Project** | ExperiML |
| **Category** | ML Experiment Management Platform |
| **Version** | v1.0.0 |
| **Codename** | Genesis |
| **Status** | Approved |
| **Phase** | 3.3.1 |

---

# Purpose

The **Users** table represents every registered user of ExperiML.

Its responsibility is limited to storing user identity and authentication credentials.

The table deliberately excludes session management, preferences, API keys, and other unrelated concerns, ensuring that it follows the **Single Responsibility Principle**.

---

# Responsibilities

The Users table is responsible for:

- User identity
- Login credentials
- Account lifecycle
- Ownership of projects

The Users table is **not** responsible for:

- Authentication sessions
- Refresh tokens
- User preferences
- Application settings
- Experiment ownership (indirect through Projects)

---

# Relationships

The User entity is the root of the ownership hierarchy.

```text
User
│
├── Sessions
│
└── Projects
```

A User may own multiple Sessions and multiple Projects.

---

# Table Structure

| Column | PostgreSQL Type | Constraints | Description |
|----------|----------------|-------------|-------------|
| **id** | UUID | Primary Key | Unique identifier for the user |
| **first_name** | TEXT | NOT NULL | User's first name |
| **last_name** | TEXT | NOT NULL | User's last name |
| **email** | TEXT | NOT NULL, UNIQUE | User's email address |
| **password_hash** | TEXT | NOT NULL | BCrypt password hash |
| **account_status** | ENUM | NOT NULL | Current account status |
| **created_at** | TIMESTAMPTZ | NOT NULL | Record creation timestamp |
| **updated_at** | TIMESTAMPTZ | NOT NULL | Last modification timestamp |
| **deleted_at** | TIMESTAMPTZ | NULL | Soft deletion timestamp |

---

# Account Status

The Users table includes an Account Status field to represent the operational state of an account.

## ENUM Values

```text
ACTIVE
INACTIVE
SUSPENDED
```

### ACTIVE

The account is fully operational.

---

### INACTIVE

The account exists but is currently inactive.

This value provides flexibility for future features such as email verification or manual activation.

---

### SUSPENDED

The account is temporarily disabled.

Suspended users cannot authenticate until the account is restored.

---

# Primary Key Strategy

The Users table uses UUID as its primary key.

```text
UUID
```

Reasons:

- Globally unique
- Secure
- Difficult to guess
- Production-friendly
- Native PostgreSQL support
- Excellent Prisma compatibility

---

# Authentication

Passwords are **never** stored.

Only BCrypt password hashes are stored.

Example:

```text
$2b$12$...
```

The Users table never stores:

- Plain-text passwords
- Access Tokens
- Refresh Tokens

Authentication sessions are managed by the **Sessions** table.

---

# Constraints

## Primary Key

```text
PRIMARY KEY (id)
```

---

## Unique Constraint

```text
UNIQUE(email)
```

Every email address must be unique.

---

## NOT NULL Constraints

Required fields:

- first_name
- last_name
- email
- password_hash
- account_status
- created_at
- updated_at

---

# Indexing Strategy

## Primary Index

Primary Key (UUID)

---

## Unique Index

```text
email
```

This index supports fast authentication lookups.

No additional indexes are required for Version 1.

---

# Audit Strategy

The Users table follows the standard ExperiML audit policy.

Required audit fields:

- created_at
- updated_at

Optional:

- deleted_at

## Timestamp Management

- **created_at** is automatically assigned when the user is created.
- **updated_at** is automatically updated whenever the record changes.
- **deleted_at** remains NULL until a soft delete occurs.

---

# Soft Delete Strategy

ExperiML uses soft deletion for Users.

Deleting a user does not immediately remove the record.

Instead:

```text
account_status = SUSPENDED (optional)

↓

deleted_at = Current Timestamp
```

This preserves historical integrity and enables future account recovery.

---

# Security Considerations

Sensitive information must never be exposed.

Protected fields include:

- password_hash

Authentication tokens are never stored in this table.

Authorization logic is handled by the application layer.

---

# Future Expansion

The schema has been intentionally designed for future growth.

Potential additions include:

- profile_image
- email_verified
- last_login
- password_changed_at
- two_factor_enabled

These additions can be introduced without redesigning the existing schema.

---

# Design Rationale

Several architectural decisions influence the Users table.

## Separate First and Last Name

The schema stores:

- first_name
- last_name

instead of a single full_name field.

Benefits include:

- Easier personalization
- Better sorting
- Industry-standard structure
- Improved future flexibility

---

## Account Status

The Account Status field is separate from deleted_at.

This distinction allows the application to differentiate between:

- Active accounts
- Temporarily suspended accounts
- Soft-deleted accounts

without overloading a single field with multiple meanings.

---

## Separation of Concerns

The Users table stores identity only.

Session management, authentication state, and device information are delegated to the Sessions table.

This keeps the schema clean and aligned with the Single Responsibility Principle.

---

# Approved Design Decisions

The following decisions are approved.

- UUID is the primary key.
- Separate first_name and last_name fields are used.
- Email is unique.
- Passwords are stored only as BCrypt hashes.
- Authentication tokens are never stored in the Users table.
- Sessions are managed separately.
- Account Status is stored independently from deleted_at.
- Users support soft deletion.
- Standard audit fields are included.
- No role-based access is implemented in Version 1.

---

# Summary

The Users table serves as the identity layer of ExperiML.

It stores only the information required to identify and authenticate a user while delegating session management, authentication state, and application-specific functionality to dedicated components.

By separating account lifecycle from authentication sessions and adopting production-grade practices such as UUID primary keys, BCrypt password hashing, audit fields, soft deletion, and account status management, the table provides a secure, maintainable, and extensible foundation for the remainder of the database architecture.


# Sessions Table Design

## Document Information

| Field | Value |
|--------|-------|
| **Document** | Sessions Table Design |
| **Project** | ExperiML |
| **Category** | ML Experiment Management Platform |
| **Version** | v1.0.0 |
| **Codename** | Genesis |
| **Status** | Approved |
| **Phase** | 3.3.2 |

---

# Purpose

The **Sessions** table represents a single authenticated login session within ExperiML.

A Session is created every time a user successfully logs into the application.

The purpose of this table is to provide secure session management while maintaining stateless authentication through JWT.

The Sessions table is responsible only for authentication session management and must not contain unrelated business information.

---

# Responsibilities

The Sessions table is responsible for:

- Refresh Token management
- Session lifecycle
- Device tracking
- Session expiration
- Session revocation
- Authentication auditing

The Sessions table is **not** responsible for:

- User identity
- User profile
- Authentication credentials
- Projects
- Preferences
- Machine Learning data

---

# Relationships

A User may own multiple Sessions.

```text
User
│
└── Sessions
```

Relationship:

- One User → Many Sessions

---

# Session Lifecycle

A Session is created when a user successfully logs in.

```text
Login
    ↓
Session Created
    ↓
Authenticated Requests
    ↓
Last Activity Updated
    ↓
Logout OR Expiration
    ↓
Session Revoked / Expired
```

Every login creates a completely new Session.

---

# Table Structure

| Column | PostgreSQL Type | Constraints | Description |
|----------|----------------|-------------|-------------|
| **id** | UUID | Primary Key | Unique Session Identifier |
| **user_id** | UUID | Foreign Key | Owner of the session |
| **refresh_token_hash** | TEXT | NOT NULL | Hashed Refresh Token |
| **browser** | TEXT | NOT NULL | Browser name |
| **operating_system** | TEXT | NOT NULL | Operating System |
| **device_type** | ENUM | NOT NULL | Device category |
| **ip_address** | TEXT | NOT NULL | Client IP Address |
| **user_agent** | TEXT | NOT NULL | Original User-Agent header |
| **created_at** | TIMESTAMPTZ | NOT NULL | Login timestamp |
| **last_activity_at** | TIMESTAMPTZ | NOT NULL | Last authenticated activity |
| **expires_at** | TIMESTAMPTZ | NOT NULL | Session expiration time |
| **revoked_at** | TIMESTAMPTZ | NULL | Logout / Revocation timestamp |

---

# Device Type

The Device Type field uses a PostgreSQL ENUM.

## ENUM Values

```text
DESKTOP
LAPTOP
MOBILE
TABLET
UNKNOWN
```

This allows the frontend to display user-friendly information while maintaining consistent values in the database.

---

# Authentication Strategy

ExperiML uses a hybrid JWT authentication model.

## Access Token

- Stored in HTTP-only Cookie
- Short-lived
- Never stored in the database

---

## Refresh Token

- Stored in HTTP-only Cookie
- Long-lived
- Only the hashed Refresh Token is stored in PostgreSQL

This provides production-grade authentication while allowing session revocation.

---

# Session State

The Sessions table intentionally does **not** contain:

- is_active
- status

A Session's state is derived dynamically.

## Active

```text
revoked_at IS NULL

AND

expires_at > Current Time
```

---

## Revoked

```text
revoked_at IS NOT NULL
```

---

## Expired

```text
expires_at < Current Time
```

This approach avoids redundant data and guarantees consistency.

---

# Constraints

## Primary Key

```text
PRIMARY KEY (id)
```

---

## Foreign Key

```text
user_id → users(id)
```

Every Session belongs to exactly one User.

---

## NOT NULL

Required fields:

- user_id
- refresh_token_hash
- browser
- operating_system
- device_type
- ip_address
- user_agent
- created_at
- last_activity_at
- expires_at

---

# Indexing Strategy

Recommended indexes:

## Primary Index

```text
id
```

---

## Foreign Key Index

```text
user_id
```

Supports retrieval of all sessions belonging to a user.

---

## Expiration Index

```text
expires_at
```

Supports cleanup jobs for expired sessions.

---

# Audit Strategy

The Sessions table follows the standard audit policy.

Audit fields:

- created_at
- last_activity_at
- expires_at
- revoked_at

These fields allow accurate session tracking and future security analysis.

---

# Security Considerations

Sensitive fields must never be exposed through public APIs.

Protected fields include:

- refresh_token_hash
- user_agent
- ip_address (except where explicitly required)

Only sanitized session information should be returned to the frontend.

---

# Hard Delete Strategy

Sessions are not soft deleted.

Expired or revoked sessions may be permanently removed during scheduled cleanup.

This keeps the authentication subsystem efficient while preserving only relevant session records.

---

# Future Expansion

The schema supports future additions without redesign.

Possible future fields include:

- country
- city
- trusted_device
- device_name
- mfa_verified
- login_method

These features can be introduced while maintaining backward compatibility.

---

# Design Rationale

Several architectural decisions influenced this table.

## One Login = One Session

Each successful login creates an independent Session.

Multiple devices therefore create multiple Session records.

---

## Stateless Access Tokens

Access Tokens remain stateless and are never persisted.

Only Refresh Tokens require database persistence.

---

## Separate Browser Information

Instead of parsing the User-Agent on every request, Express extracts and stores:

- browser
- operating_system
- device_type

The original User-Agent is preserved for debugging and future analysis.

---

## Derived Session State

The database deliberately avoids storing:

- is_active
- status

because both values can always be derived from:

- revoked_at
- expires_at
- current timestamp

This keeps the schema normalized and prevents inconsistent state.

---

## Single Responsibility

The Sessions table manages authentication sessions only.

Identity remains inside the Users table.

Business data remains inside Projects, Datasets, and Experiments.

---

# Approved Design Decisions

The following decisions are approved.

- Every successful login creates one Session.
- UUID is the primary key.
- Every Session belongs to one User.
- Only hashed Refresh Tokens are stored.
- Access Tokens are never stored.
- Device information is stored in structured columns.
- The original User-Agent is preserved.
- Session state is derived from timestamps.
- No is_active column is stored.
- No status column is stored.
- Sessions are hard deleted after expiration or cleanup.
- Standard audit timestamps are maintained.

---

# Summary

The Sessions table provides the foundation for ExperiML's production-grade authentication system.

By combining stateless Access Tokens with stateful Refresh Token management, the design supports secure authentication, multiple concurrent devices, session revocation, activity tracking, and future security enhancements while maintaining a clean, normalized, and scalable database schema.

The table follows the Single Responsibility Principle by focusing exclusively on authentication sessions and delegates identity management to the Users table and business workflows to the remainder of the application.


# Projects Table Design

## Document Information

| Field | Value |
|--------|-------|
| **Document** | Projects Table Design |
| **Project** | ExperiML |
| **Category** | ML Experiment Management Platform |
| **Version** | v1.0.0 |
| **Codename** | Genesis |
| **Status** | Approved |
| **Phase** | 3.3.3 |

---

# Purpose

The **Projects** table represents the primary workspace within ExperiML.

Every machine learning workflow begins with a Project. A Project serves as the organizational boundary for datasets, experiments, artifacts, and predictions that solve a single machine learning problem.

Projects are the central business entity of the application.

---

# Responsibilities

The Projects table is responsible for:

- Project identity
- Project ownership
- Project metadata
- Project lifecycle

The Projects table is **not** responsible for:

- Dataset storage
- Experiment management
- Model storage
- Reports
- Predictions
- Machine learning configurations

These responsibilities belong to child entities.

---

# Relationships

Projects belong directly to Users.

Projects own Datasets and Experiments.

```text
User
│
└── Projects
      │
      ├── Datasets
      │
      └── Experiments
```

Relationship Summary:

- One User → Many Projects
- One Project → Many Datasets
- One Project → Many Experiments

---

# Table Structure

| Column | PostgreSQL Type | Constraints | Description |
|----------|----------------|-------------|-------------|
| **id** | UUID | Primary Key | Unique Project Identifier |
| **user_id** | UUID | Foreign Key | Owner of the Project |
| **name** | TEXT | NOT NULL | Project Name |
| **description** | TEXT | NULL | Project Description |
| **project_status** | ENUM | NOT NULL | Current Project Status |
| **created_at** | TIMESTAMPTZ | NOT NULL | Project creation timestamp |
| **updated_at** | TIMESTAMPTZ | NOT NULL | Last modification timestamp |
| **deleted_at** | TIMESTAMPTZ | NULL | Soft deletion timestamp |

---

# Project Status

Projects include a lifecycle status represented using a PostgreSQL ENUM.

## ENUM Values

```text
ACTIVE
ARCHIVED
```

### ACTIVE

The Project is available for normal use.

Users can upload datasets, train experiments, generate reports, and perform predictions.

---

### ARCHIVED

The Project is preserved but no longer actively maintained.

Archived Projects remain accessible for historical reference.

---

# Primary Key Strategy

Projects use UUID as the primary key.

Reasons:

- Globally unique
- Difficult to guess
- Production-ready
- Native PostgreSQL support
- Excellent Prisma compatibility

---

# Ownership

Every Project belongs to exactly one User.

Ownership is enforced using a foreign key.

```text
Projects
    ↓
Users
```

---

# Constraints

## Primary Key

```text
PRIMARY KEY (id)
```

---

## Foreign Key

```text
user_id → users(id)
```

---

## Composite Unique Constraint

Projects must have unique names **per user**.

Constraint:

```text
UNIQUE (user_id, name)
```

This allows:

```text
User A
├── Customer Churn
├── House Prices
```

and

```text
User B
├── Customer Churn
```

while preventing duplicate project names for the same user.

---

## NOT NULL

Required fields:

- user_id
- name
- project_status
- created_at
- updated_at

---

# Indexing Strategy

Recommended indexes include:

## Primary Index

```text
id
```

---

## Foreign Key Index

```text
user_id
```

Supports retrieval of all projects belonging to a user.

---

## Composite Unique Index

```text
(user_id, name)
```

Supports uniqueness validation and fast project lookup.

No additional indexes are required for Version 1.

---

# Audit Strategy

Projects follow the standard ExperiML audit policy.

Audit fields include:

- created_at
- updated_at
- deleted_at

## Timestamp Management

- **created_at** is automatically assigned when the Project is created.
- **updated_at** is automatically updated whenever the Project changes.
- **deleted_at** remains NULL until the Project is soft deleted.

---

# Soft Delete Strategy

Projects support soft deletion.

Deleting a Project does not immediately remove it from the database.

Instead:

```text
deleted_at = Current Timestamp
```

This enables future recovery while preserving historical integrity.

Permanent deletion may be implemented through future cleanup workflows.

---

# Cascade Strategy

Projects act as the parent entity for the machine learning workflow.

Deleting a Project ultimately removes all dependent resources.

Dependency hierarchy:

```text
Project
│
├── Datasets
│
├── Experiments
│     │
│     ├── Artifacts
│     └── Predictions
```

Deletion follows this dependency chain to maintain referential integrity.

---

# Typical Queries

The following represent the primary queries expected for the Projects table.

---

## Retrieve All Projects

Retrieve all Projects belonging to the authenticated user.

Typical ordering:

```text
updated_at DESC
```

---

## Search Projects

Search Projects using partial name matching.

Example:

```text
WHERE name ILIKE '%search%'
```

---

## Open Project

Retrieve one Project using its UUID.

---

## Dashboard

Retrieve all active Projects for display on the dashboard.

---

## Project Count

Count Projects owned by the authenticated user.

---

## Recent Projects

Future enhancement.

Retrieve recently modified Projects ordered by:

```text
updated_at DESC
```

---

# Derived Information

The Projects table intentionally does **not** store:

- dataset_count
- experiment_count
- prediction_count

These values are derived through queries when required.

Storing them would introduce redundant data and increase maintenance complexity.

---

# Security Considerations

Projects are private to their owner.

Every Project request must verify:

- Authentication
- Ownership

Projects belonging to other users must never be accessible.

Authorization is enforced within the Express application layer.

---

# Future Expansion

The schema has been intentionally designed for future enhancements.

Possible additions include:

- icon
- favorite
- tags
- visibility
- theme
- last_opened_at

These additions can be introduced without redesigning the existing schema.

---

# Design Rationale

Several architectural decisions influenced the Projects table.

---

## Projects Are Workspaces

Projects represent organizational workspaces rather than machine learning configurations.

Machine learning decisions belong to Experiments.

---

## No Problem Type

The Project does not contain:

- Classification
- Regression
- Clustering
- Time Series

These belong to individual Experiments because different experiments within the same Project may evolve independently.

---

## No Project Code

The database does not store generated identifiers such as:

```text
PRJ-001
```

UUIDs already provide unique identification.

Human-readable identifiers can be introduced later if a business need arises.

---

## Minimal Metadata

The Projects table intentionally stores only:

- Identity
- Ownership
- Metadata
- Lifecycle

All derived values are calculated dynamically.

---

## Single Responsibility

The Projects table is responsible only for managing Project information.

Datasets, Experiments, Artifacts, and Predictions each maintain their own independent responsibilities.

---

# Approved Design Decisions

The following decisions are approved.

- Projects are the central business workspace.
- UUID is the primary key.
- Every Project belongs to one User.
- Project names are unique per User.
- Projects support soft deletion.
- Project lifecycle uses an ENUM.
- Projects do not store derived counts.
- Projects do not store problem type.
- Projects do not store project codes.
- Projects contain only identity and metadata.
- Standard audit fields are included.

---

# Summary

The Projects table forms the organizational foundation of ExperiML.

Every machine learning workflow is performed within a Project, making it the central business entity of the platform. The schema focuses exclusively on ownership, identity, metadata, and lifecycle while delegating datasets, experiments, artifacts, and predictions to their respective entities.

By maintaining a minimal, normalized, and production-oriented design, the Projects table provides a scalable foundation that supports future enhancements without introducing unnecessary complexity.


# Datasets Table Design

## Document Information

| Field | Value |
|--------|-------|
| **Document** | Datasets Table Design |
| **Project** | ExperiML |
| **Category** | ML Experiment Management Platform |
| **Version** | v1.0.0 |
| **Codename** | Genesis |
| **Status** | Approved |
| **Phase** | 3.3.4 |

---

# Purpose

The **Datasets** table represents an immutable dataset uploaded by a user within a Project.

Each upload creates a new Dataset record, regardless of whether the uploaded file is similar to a previous version.

Datasets are never modified after creation. Instead, every new upload creates a new dataset version.

This design ensures complete reproducibility of machine learning experiments.

---

# Responsibilities

The Datasets table is responsible for:

- Dataset identity
- Project ownership
- Dataset versioning
- File metadata
- Dataset profiling metadata
- Upload lifecycle
- Dataset integrity

The Datasets table is **not** responsible for:

- Feature selection
- Target column
- Data preprocessing
- Feature engineering
- Model training
- Predictions

These responsibilities belong to the Experiment entity.

---

# Relationships

Datasets belong to Projects.

Experiments reference specific Dataset versions.

```text
User
│
└── Project
      │
      ├── Datasets
      │      │
      │      └── Experiment
      │
      └── Experiments
```

Relationship Summary

- One Project → Many Datasets
- One Dataset → Many Experiments

Each Experiment references exactly one Dataset version.

---

# Immutability

Datasets are immutable.

A Dataset is never modified after upload.

Example

```text
Customer Churn
│
├── Version 1
├── Version 2
├── Version 3
```

Each version is stored as an independent Dataset record.

Experiments always reference the exact Dataset version used during training.

This guarantees complete reproducibility.

---

# Table Structure

| Column | PostgreSQL Type | Constraints | Description |
|----------|----------------|-------------|-------------|
| **id** | UUID | Primary Key | Unique Dataset Identifier |
| **project_id** | UUID | Foreign Key | Parent Project |
| **name** | TEXT | NOT NULL | Dataset Name |
| **dataset_version** | INTEGER | NOT NULL | Dataset Version Number |
| **original_file_name** | TEXT | NOT NULL | Uploaded File Name |
| **file_path** | TEXT | NOT NULL | Storage Location |
| **file_size** | BIGINT | NOT NULL | File Size (Bytes) |
| **mime_type** | TEXT | NOT NULL | MIME Type |
| **checksum** | TEXT | NOT NULL | File Integrity Hash |
| **dataset_format** | ENUM | NOT NULL | Dataset File Format |
| **row_count** | INTEGER | NOT NULL | Total Number of Rows |
| **column_count** | INTEGER | NOT NULL | Total Number of Columns |
| **metadata** | JSONB | NULL | Dataset Profiling Metadata |
| **dataset_status** | ENUM | NOT NULL | Upload Lifecycle Status |
| **created_at** | TIMESTAMPTZ | NOT NULL | Upload Timestamp |
| **updated_at** | TIMESTAMPTZ | NOT NULL | Metadata Update Timestamp |
| **deleted_at** | TIMESTAMPTZ | NULL | Soft Delete Timestamp |

---

# Dataset Versioning

Each upload generates a new version.

Example

```text
Customer Churn

Version 1
Version 2
Version 3
```

Dataset versions are sequential within a Project.

Older versions remain available for existing Experiments.

Version history is never overwritten.

---

# Dataset Format

The dataset format is represented using a PostgreSQL ENUM.

## ENUM Values

```text
CSV
XLSX
PARQUET
```

Additional formats may be added in future versions.

---

# Dataset Status

Datasets follow an upload lifecycle.

## ENUM Values

```text
UPLOADING
PROCESSING
READY
FAILED
```

### UPLOADING

The file is currently being uploaded.

---

### PROCESSING

The backend is validating the dataset and extracting metadata.

Typical tasks include:

- Reading the file
- Counting rows
- Counting columns
- Computing checksum
- Generating profiling metadata

---

### READY

The Dataset has been successfully processed and is available for Experiments.

---

### FAILED

Dataset processing failed.

The Dataset cannot be used until the issue is resolved.

---

# Metadata

The metadata column stores derived profiling information using PostgreSQL JSONB.

Typical contents include:

```json
{
  "duplicate_rows": 3,
  "missing_values": 18,
  "numeric_columns": 9,
  "categorical_columns": 6,
  "column_data_types": {
    "Age": "INTEGER",
    "Income": "FLOAT",
    "Gender": "TEXT"
  }
}
```

The metadata column stores descriptive information only.

It does **not** contain:

- Target column
- Selected features
- Preprocessing configuration
- Scaling information
- Encoding strategy

Those belong to the Experiment.

---

# File Metadata

Each Dataset stores file-related metadata.

Included information:

- Original filename
- File path
- File size
- MIME type
- Checksum

The checksum enables:

- File integrity verification
- Duplicate detection
- Future optimization opportunities

---

# Constraints

## Primary Key

```text
PRIMARY KEY (id)
```

---

## Foreign Key

```text
project_id → projects(id)
```

---

## Composite Unique Constraint

Datasets are uniquely identified within a Project using:

```text
UNIQUE(project_id, name, dataset_version)
```

This allows multiple versions of the same dataset while preventing duplicate version numbers.

---

## NOT NULL

Required fields:

- project_id
- name
- dataset_version
- original_file_name
- file_path
- file_size
- mime_type
- checksum
- dataset_format
- row_count
- column_count
- dataset_status
- created_at
- updated_at

---

# Indexing Strategy

Recommended indexes include:

## Primary Index

```text
id
```

---

## Foreign Key Index

```text
project_id
```

Supports retrieval of all datasets belonging to a Project.

---

## Composite Unique Index

```text
(project_id, name, dataset_version)
```

Supports version history lookup and uniqueness validation.

No additional indexes are required for Version 1.

---

# Audit Strategy

Datasets follow the standard ExperiML audit policy.

Audit fields include:

- created_at
- updated_at
- deleted_at

## Timestamp Management

- **created_at** records the upload time.
- **updated_at** records metadata changes.
- **deleted_at** supports soft deletion.

---

# Soft Delete Strategy

Datasets support soft deletion.

Datasets are never immediately removed because Experiments may depend on them.

Deleting a Dataset sets:

```text
deleted_at = Current Timestamp
```

Permanent removal can be implemented through future cleanup workflows after dependency validation.

---

# Typical Queries

The following represent the primary queries expected for the Datasets table.

---

## List Datasets

Retrieve all Datasets belonging to a Project.

Typical ordering:

```text
dataset_version DESC
```

---

## Retrieve Latest Version

Retrieve the latest version of a Dataset.

Example:

```text
Customer Churn

ORDER BY dataset_version DESC

LIMIT 1
```

---

## Dataset History

Retrieve all versions of a Dataset.

Useful for comparing uploaded revisions.

---

## Dataset Selection

Retrieve all READY datasets available for Experiment creation.

---

## Dataset Details

Retrieve Dataset information using its UUID.

---

## Upload Validation

Retrieve datasets currently in:

```text
PROCESSING
```

or

```text
FAILED
```

to monitor upload progress.

---

# Derived Information

The Datasets table intentionally does **not** store:

- Target column
- Feature selection
- Encoding configuration
- Scaling strategy
- Train/Test split
- Missing value handling strategy

These values are specific to individual Experiments.

The same Dataset may be used by multiple Experiments with completely different configurations.

---

# Security Considerations

Datasets are private to the owning User through their Project.

Every request must verify:

- Authentication
- Project ownership

Users must never access Datasets belonging to another Project.

Authorization is enforced within the Express application layer.

---

# Future Expansion

The schema supports future enhancements without redesign.

Possible additions include:

- compression_type
- upload_duration
- schema_version
- preview_cache
- storage_provider
- storage_bucket

These additions can be introduced without affecting the current schema.

---

# Design Rationale

Several architectural decisions influenced the Datasets table.

---

## Immutable Datasets

Datasets are immutable.

Every upload creates a new Dataset version.

Existing Experiments always reference the Dataset used during training.

---

## Experiments Reference Datasets

Experiments reference a specific Dataset version rather than only a Project.

This guarantees reproducibility.

---

## Metadata Separation

Dataset profiling information belongs in the metadata JSONB column.

Machine learning configuration belongs to the Experiment.

This separation keeps responsibilities clear.

---

## Explicit Naming

Fields such as:

- dataset_version
- dataset_status

use explicit names to improve readability in joins and future schema growth.

---

## File Metadata

Dataset-specific file metadata remains within the Dataset entity because it shares the same lifecycle.

It is intentionally not extracted into a generic file table.

---

## Single Responsibility

The Datasets table manages uploaded datasets only.

Machine learning decisions remain entirely within the Experiment entity.

---

# Approved Design Decisions

The following decisions are approved.

- Every upload creates a new Dataset version.
- Datasets are immutable.
- Experiments reference a specific Dataset version.
- UUID is the primary key.
- Dataset versions are unique within a Project.
- Dataset profiling uses JSONB metadata.
- File metadata is stored within the Dataset.
- Dataset lifecycle uses ENUM values.
- Dataset-specific configuration is not stored.
- Datasets support soft deletion.
- Standard audit fields are included.

---

# Summary

The Datasets table provides the foundation for reproducible machine learning within ExperiML.

By treating datasets as immutable, versioned resources and ensuring that every Experiment references a specific Dataset version, the platform guarantees reproducibility, auditability, and long-term maintainability.

The table focuses exclusively on dataset identity, versioning, file metadata, profiling metadata, and lifecycle management while delegating all machine learning configuration to the Experiment entity. This separation of responsibilities results in a clean, normalized, and production-ready database design.


# Experiments Table Design

## Document Information

| Field | Value |
|--------|-------|
| **Document** | Experiments Table Design |
| **Project** | ExperiML |
| **Category** | ML Experiment Management Platform |
| **Version** | v1.0.0 |
| **Codename** | Genesis |
| **Status** | Approved |
| **Phase** | 3.3.5 |

---

# Purpose

The **Experiments** table represents a single immutable machine learning training run.

An Experiment captures everything required to reproduce a model training execution, including:

- Dataset reference
- Training configuration
- Hyperparameters
- Training metrics
- Lifecycle information

Experiments are the core business entity of ExperiML.

---

# Responsibilities

The Experiments table is responsible for:

- Experiment identity
- Project association
- Dataset association
- Training configuration
- Hyperparameter storage
- Model evaluation metrics
- Experiment lifecycle
- Reproducibility

The Experiments table is **not** responsible for:

- Dataset storage
- Model files
- Reports
- Prediction exports

These responsibilities belong to the Dataset, Artifact, and Prediction entities.

---

# Relationships

Experiments belong to a Project and reference exactly one Dataset version.

Artifacts and Predictions belong to an Experiment.

```text
User
│
└── Project
      │
      ├── Dataset
      │      │
      │      └── Experiment
      │             │
      │             ├── Artifacts
      │             └── Predictions
```

Relationship Summary

- One Project → Many Experiments
- One Dataset → Many Experiments
- One Experiment → Many Artifacts
- One Experiment → Many Predictions

Every Experiment references one immutable Dataset version.

---

# Immutability

Experiments are immutable.

An Experiment is never modified after creation.

Changing any of the following creates a completely new Experiment:

- Algorithm
- Hyperparameters
- Target column
- Selected features
- Feature engineering
- Data preprocessing
- Train/Test split
- Random seed
- Encoding strategy
- Scaling strategy

Every Experiment represents one complete training execution.

---

# Table Structure

| Column | PostgreSQL Type | Constraints | Description |
|----------|----------------|-------------|-------------|
| **id** | UUID | Primary Key | Unique Experiment Identifier |
| **project_id** | UUID | Foreign Key | Parent Project |
| **dataset_id** | UUID | Foreign Key | Dataset used for training |
| **name** | TEXT | NOT NULL | Experiment Name |
| **problem_type** | ENUM | NOT NULL | Machine Learning Problem Type |
| **algorithm_name** | TEXT | NOT NULL | Training Algorithm |
| **configuration** | JSONB | NOT NULL | Training Configuration |
| **hyperparameters** | JSONB | NOT NULL | Algorithm Hyperparameters |
| **metrics** | JSONB | NULL | Evaluation Metrics |
| **experiment_status** | ENUM | NOT NULL | Training Lifecycle Status |
| **started_at** | TIMESTAMPTZ | NULL | Training Start Time |
| **completed_at** | TIMESTAMPTZ | NULL | Training Completion Time |
| **created_at** | TIMESTAMPTZ | NOT NULL | Experiment Creation Time |
| **updated_at** | TIMESTAMPTZ | NOT NULL | Last Metadata Update |
| **deleted_at** | TIMESTAMPTZ | NULL | Soft Delete Timestamp |

---

# Problem Type

The machine learning problem type is represented using a PostgreSQL ENUM.

## ENUM Values

```text
CLASSIFICATION
REGRESSION
CLUSTERING
TIME_SERIES
ANOMALY_DETECTION
```

This identifies the category of machine learning problem rather than the specific algorithm.

---

# Algorithm

The training algorithm is stored as TEXT.

Examples:

```text
Random Forest
XGBoost
LightGBM
CatBoost
Support Vector Machine
Logistic Regression
Linear Regression
K-Means
DBSCAN
```

TEXT is intentionally used instead of an ENUM to support future algorithms without schema modifications.

---

# Training Configuration

Training configuration is stored using PostgreSQL JSONB.

Example

```json
{
  "target_column": "churn",
  "feature_columns": [
    "age",
    "income",
    "balance"
  ],
  "train_size": 0.8,
  "test_size": 0.2,
  "random_state": 42,
  "encoding": "OneHotEncoder",
  "scaling": "StandardScaler"
}
```

Configuration describes how the dataset was prepared before training.

---

# Hyperparameters

Algorithm-specific hyperparameters are stored independently using JSONB.

Example

```json
{
  "n_estimators": 500,
  "max_depth": 12,
  "min_samples_split": 4
}
```

Separating hyperparameters from configuration keeps responsibilities clear.

---

# Metrics

Evaluation metrics are stored using JSONB.

Example

```json
{
  "accuracy": 0.943,
  "precision": 0.931,
  "recall": 0.925,
  "f1_score": 0.928,
  "roc_auc": 0.962
}
```

Different machine learning algorithms generate different metrics.

JSONB provides the flexibility required for multiple problem types.

---

# Experiment Status

Experiments follow a lifecycle represented using a PostgreSQL ENUM.

## ENUM Values

```text
CREATED
QUEUED
TRAINING
COMPLETED
FAILED
CANCELLED
```

### CREATED

The Experiment record has been created.

---

### QUEUED

The Experiment is waiting to begin training.

---

### TRAINING

Model training is currently in progress.

---

### COMPLETED

Training completed successfully.

Metrics and Artifacts are available.

---

### FAILED

Training terminated due to an error.

---

### CANCELLED

Training was intentionally stopped before completion.

---

# Configuration Separation

The Experiments table intentionally separates three different responsibilities.

## Configuration

Describes data preparation.

Examples:

- Target column
- Feature selection
- Scaling
- Encoding
- Train/Test split
- Random seed

---

## Hyperparameters

Describes algorithm configuration.

Examples:

- max_depth
- learning_rate
- n_estimators
- C
- gamma

---

## Metrics

Describes evaluation results.

Examples:

- Accuracy
- Precision
- Recall
- RMSE
- MAE
- Silhouette Score

This separation improves clarity and extensibility.

---

# Constraints

## Primary Key

```text
PRIMARY KEY (id)
```

---

## Foreign Keys

```text
project_id → projects(id)

dataset_id → datasets(id)
```

Every Experiment belongs to one Project and references one Dataset version.

---

## NOT NULL

Required fields:

- project_id
- dataset_id
- name
- problem_type
- algorithm_name
- configuration
- hyperparameters
- experiment_status
- created_at
- updated_at

---

# Indexing Strategy

Recommended indexes include:

## Primary Index

```text
id
```

---

## Project Index

```text
project_id
```

Supports retrieval of all Experiments within a Project.

---

## Dataset Index

```text
dataset_id
```

Supports retrieval of all Experiments trained using a specific Dataset.

No additional indexes are required for Version 1.

---

# Audit Strategy

Experiments follow the standard ExperiML audit policy.

Audit fields include:

- created_at
- updated_at
- deleted_at
- started_at
- completed_at

## Timestamp Management

- **created_at** records Experiment creation.
- **started_at** records when training begins.
- **completed_at** records when training ends.
- **updated_at** records metadata updates.
- **deleted_at** supports soft deletion.

---

# Soft Delete Strategy

Experiments support soft deletion.

Experiments represent historical machine learning work and should not be permanently removed immediately.

Deleting an Experiment sets:

```text
deleted_at = Current Timestamp
```

Permanent deletion may be introduced through future cleanup workflows after dependency validation.

---

# Typical Queries

The following represent the primary queries expected for the Experiments table.

---

## List Experiments

Retrieve all Experiments belonging to a Project.

Typical ordering:

```text
created_at DESC
```

---

## Open Experiment

Retrieve an Experiment using its UUID.

---

## Compare Experiments

Retrieve all completed Experiments within a Project for comparison.

---

## Dataset Usage

Retrieve every Experiment trained using a specific Dataset version.

---

## Training Queue

Retrieve Experiments currently in:

```text
QUEUED
```

or

```text
TRAINING
```

---

## Failed Experiments

Retrieve Experiments where:

```text
experiment_status = FAILED
```

Useful for debugging.

---

## Recent Experiments

Retrieve the latest Experiments created within a Project.

---

# Derived Information

The Experiments table intentionally does **not** store:

- Model files
- Report files
- Prediction exports
- Training duration
- Primary metric
- Experiment version

These values are either stored elsewhere or derived from existing data.

Training duration can be calculated from:

```text
completed_at - started_at
```

---

# Security Considerations

Experiments inherit Project ownership.

Every request must verify:

- Authentication
- Project ownership

Users must never access Experiments belonging to another Project.

Authorization is enforced within the Express application layer.

---

# Future Expansion

The schema supports future enhancements without redesign.

Possible additions include:

- framework_name
- framework_version
- python_version
- hardware_information
- gpu_information
- experiment_notes
- tags

These additions can be introduced without modifying the existing architecture.

---

# Design Rationale

Several architectural decisions influenced the Experiments table.

---

## Immutable Experiments

Experiments are immutable.

Any change to training configuration results in a new Experiment.

---

## Dataset Version References

Experiments reference a specific Dataset version.

This guarantees complete reproducibility.

---

## Project Reference

Experiments store both:

- project_id
- dataset_id

Although the Dataset already belongs to a Project, storing the Project reference simplifies common queries and dashboard operations.

Application-level validation ensures both references remain consistent.

---

## Configuration Separation

Configuration, Hyperparameters, and Metrics are stored independently using three JSONB columns.

Each serves a unique responsibility.

---

## Flexible Algorithm Support

Algorithms are stored as TEXT instead of ENUM.

This allows future algorithms without requiring schema changes.

---

## Lifecycle Tracking

Training lifecycle is tracked using:

- experiment_status
- started_at
- completed_at

This provides a complete operational history while allowing runtime calculations.

---

## Single Responsibility

The Experiments table records one complete machine learning training execution.

Artifacts, reports, and prediction outputs remain separate entities.

---

# Approved Design Decisions

The following decisions are approved.

- Experiments are immutable.
- Every Experiment references one Dataset version.
- UUID is the primary key.
- Experiments belong to a Project.
- Algorithms are stored as TEXT.
- Problem types use a PostgreSQL ENUM.
- Configuration, Hyperparameters, and Metrics each use separate JSONB columns.
- Training lifecycle is represented using ENUM values.
- started_at and completed_at are stored instead of training duration.
- Model files are not stored in the Experiments table.
- Experiments support soft deletion.
- Standard audit fields are included.

---

# Summary

The Experiments table is the central business entity of ExperiML.

Each Experiment represents one immutable machine learning training execution, capturing the dataset used, the complete training configuration, algorithm hyperparameters, evaluation metrics, and lifecycle information required for full reproducibility.

By separating configuration, hyperparameters, metrics, and artifacts into dedicated responsibilities, the schema remains clean, extensible, and aligned with production-grade machine learning platform design principles.


# Artifacts Table Design

## Document Information

| Field | Value |
|--------|-------|
| **Document** | Artifacts Table Design |
| **Project** | ExperiML |
| **Category** | ML Experiment Management Platform |
| **Version** | v1.0.0 |
| **Codename** | Genesis |
| **Status** | Approved |
| **Phase** | 3.3.6 |

---

# Purpose

The **Artifacts** table represents every generated file produced by an Experiment.

Artifacts are outputs of machine learning workflows rather than uploaded resources.

Typical examples include:

- Trained model files
- Preprocessing pipelines
- Evaluation reports
- Prediction exports
- Feature importance files
- Generated visualizations

Artifacts provide a centralized and extensible mechanism for managing experiment outputs.

---

# Responsibilities

The Artifacts table is responsible for:

- Artifact identity
- Experiment ownership
- File metadata
- Artifact classification
- Storage location
- File integrity
- Artifact lifecycle

The Artifacts table is **not** responsible for:

- Experiment configuration
- Hyperparameters
- Evaluation metrics
- Dataset information
- Predictions

These responsibilities belong to their respective entities.

---

# Relationships

Artifacts belong directly to Experiments.

```text
User
│
└── Project
      │
      └── Experiment
             │
             └── Artifacts
```

Relationship Summary

- One Experiment → Many Artifacts

Every Artifact belongs to exactly one Experiment.

---

# Artifact Philosophy

Artifacts are generated outputs.

Uploaded datasets are **not** Artifacts.

Examples of Artifacts include:

```text
model.pkl

preprocessing_pipeline.pkl

evaluation_report.pdf

prediction_export.csv

feature_importance.json

confusion_matrix.png
```

Each Artifact represents a generated file associated with one Experiment.

---

# Immutability

Artifacts are append-only.

Once generated:

- They are never modified.
- They are never overwritten.
- They may be soft deleted.
- New Experiments generate new Artifacts.

This guarantees consistency with the immutable Experiment architecture.

---

# Table Structure

| Column | PostgreSQL Type | Constraints | Description |
|----------|----------------|-------------|-------------|
| **id** | UUID | Primary Key | Unique Artifact Identifier |
| **experiment_id** | UUID | Foreign Key | Parent Experiment |
| **artifact_name** | TEXT | NOT NULL | Human-readable Artifact Name |
| **artifact_type** | ENUM | NOT NULL | Business Classification |
| **file_format** | TEXT | NOT NULL | Artifact File Format |
| **original_file_name** | TEXT | NOT NULL | Generated File Name |
| **file_path** | TEXT | NOT NULL | Storage Location |
| **file_size** | BIGINT | NOT NULL | File Size (Bytes) |
| **mime_type** | TEXT | NOT NULL | MIME Type |
| **checksum** | TEXT | NOT NULL | File Integrity Hash |
| **metadata** | JSONB | NULL | Artifact-Specific Metadata |
| **artifact_status** | ENUM | NOT NULL | Artifact Lifecycle |
| **created_at** | TIMESTAMPTZ | NOT NULL | Generation Timestamp |
| **updated_at** | TIMESTAMPTZ | NOT NULL | Metadata Update Timestamp |
| **deleted_at** | TIMESTAMPTZ | NULL | Soft Delete Timestamp |

---

# Artifact Type

Artifact types describe the business purpose of a generated file.

## ENUM Values

```text
MODEL
PREPROCESSING_PIPELINE
REPORT
PREDICTION_EXPORT
FEATURE_IMPORTANCE
VISUALIZATION
OTHER
```

Artifact Type represents the purpose of the file rather than its storage format.

---

# File Format

File format is stored using TEXT.

Examples:

```text
PKL
JOBLIB
ONNX
PDF
CSV
JSON
PNG
SVG
ZIP
```

TEXT is intentionally used instead of ENUM to allow future formats without schema modifications.

---

# Artifact Status

Artifacts follow a simple lifecycle.

## ENUM Values

```text
GENERATING
AVAILABLE
FAILED
```

### GENERATING

The Artifact is currently being generated.

---

### AVAILABLE

The Artifact has been successfully generated and is available for download.

---

### FAILED

Artifact generation failed.

---

# Metadata

Artifact-specific descriptive information is stored using PostgreSQL JSONB.

Example (Visualization)

```json
{
  "width": 1200,
  "height": 800
}
```

Example (Report)

```json
{
  "pages": 12
}
```

Example (Serialized Model)

```json
{
  "framework": "scikit-learn",
  "python_version": "3.12"
}
```

Metadata describes the generated file itself.

It does **not** contain:

- Metrics
- Hyperparameters
- Configuration
- Target column
- Experiment settings

Those belong to the Experiment entity.

---

# File Metadata

Every Artifact stores standard file metadata.

Included information:

- Original filename
- Storage path
- File size
- MIME type
- Checksum

The checksum supports:

- File integrity verification
- Duplicate detection
- Storage validation
- Future cloud storage migration

---

# Constraints

## Primary Key

```text
PRIMARY KEY (id)
```

---

## Foreign Key

```text
experiment_id → experiments(id)
```

Every Artifact belongs to exactly one Experiment.

---

## NOT NULL

Required fields:

- experiment_id
- artifact_name
- artifact_type
- file_format
- original_file_name
- file_path
- file_size
- mime_type
- checksum
- artifact_status
- created_at
- updated_at

---

# Indexing Strategy

Recommended indexes include:

## Primary Index

```text
id
```

---

## Foreign Key Index

```text
experiment_id
```

Supports retrieval of all Artifacts belonging to an Experiment.

No additional indexes are required for Version 1.

---

# Audit Strategy

Artifacts follow the standard ExperiML audit policy.

Audit fields include:

- created_at
- updated_at
- deleted_at

## Timestamp Management

- **created_at** records Artifact generation.
- **updated_at** records metadata updates.
- **deleted_at** supports soft deletion.

---

# Soft Delete Strategy

Artifacts support soft deletion.

Artifacts are not immediately removed because they may be referenced by historical Experiment records.

Deleting an Artifact sets:

```text
deleted_at = Current Timestamp
```

Permanent removal may be performed by future cleanup workflows.

---

# Typical Queries

The following represent the primary queries expected for the Artifacts table.

---

## List Artifacts

Retrieve all Artifacts belonging to an Experiment.

---

## Download Model

Retrieve the Artifact where:

```text
artifact_type = MODEL
```

---

## Download Pipeline

Retrieve the Artifact where:

```text
artifact_type = PREPROCESSING_PIPELINE
```

---

## Download Report

Retrieve the Artifact where:

```text
artifact_type = REPORT
```

---

## Download Prediction Export

Retrieve the Artifact where:

```text
artifact_type = PREDICTION_EXPORT
```

---

## Download Visualization

Retrieve all visualization Artifacts for an Experiment.

---

## Failed Artifact Generation

Retrieve Artifacts where:

```text
artifact_status = FAILED
```

Useful for operational monitoring and debugging.

---

# Derived Information

The Artifacts table intentionally does **not** store:

- Download count
- Experiment metrics
- Hyperparameters
- Dataset information
- Prediction results

These values either belong to other entities or can be derived from application logic.

---

# Security Considerations

Artifacts inherit ownership from their parent Experiment.

Every request must verify:

- Authentication
- Project ownership
- Experiment ownership

Users must never access Artifacts belonging to another user's Experiment.

Authorization is enforced within the Express application layer.

---

# Future Expansion

The schema supports future enhancements without redesign.

Possible additions include:

- storage_provider
- storage_bucket
- compression_type
- encryption_status
- virus_scan_status
- download_url
- retention_policy

These additions can be introduced without affecting the existing schema.

---

# Design Rationale

Several architectural decisions influenced the Artifacts table.

---

## Generated Files Only

Artifacts represent generated outputs.

Uploaded datasets remain a separate entity because they have a different lifecycle and responsibility.

---

## Append-Only Architecture

Artifacts are append-only.

Files are never modified or overwritten.

Every new Experiment generates its own independent Artifacts.

---

## Business Classification

Artifact Type describes the business meaning of the file.

File Format describes the storage format.

Separating these concepts keeps the schema flexible.

---

## Flexible File Formats

File formats are stored as TEXT rather than ENUM.

This allows future formats without database schema modifications.

---

## Metadata Separation

Artifact-specific metadata is stored in JSONB.

Experiment configuration remains inside the Experiment entity.

This prevents duplication of responsibilities.

---

## Centralized File Management

Every generated file within ExperiML follows the same storage model.

This enables consistent handling of:

- Storage
- Downloads
- Validation
- Cleanup
- Future cloud storage migration

---

## Single Responsibility

The Artifacts table manages generated files only.

Machine learning logic, metrics, configuration, and predictions remain in their dedicated entities.

---

# Approved Design Decisions

The following decisions are approved.

- Artifacts represent generated files only.
- Uploaded datasets are not Artifacts.
- Artifacts are append-only.
- UUID is the primary key.
- Every Artifact belongs to one Experiment.
- Artifact Type uses a PostgreSQL ENUM.
- File Format is stored as TEXT.
- Artifact-specific metadata uses JSONB.
- File metadata is stored within the Artifacts table.
- Artifacts support soft deletion.
- Standard audit fields are included.

---

# Summary

The Artifacts table provides a centralized, production-grade mechanism for managing every generated file produced by an Experiment.

By separating generated files from experiment configuration and dataset storage, the design maintains a clear separation of responsibilities while supporting extensibility, storage abstraction, integrity verification, and future cloud-based deployments.

The append-only architecture ensures that every generated output remains permanently associated with the immutable Experiment that created it, preserving reproducibility and long-term auditability.


# Predictions Table Design

## Document Information

| Field | Value |
|--------|-------|
| **Document** | Predictions Table Design |
| **Project** | ExperiML |
| **Category** | ML Experiment Management Platform |
| **Version** | v1.0.0 |
| **Codename** | Genesis |
| **Status** | Approved |
| **Phase** | 3.3.7 |

---

# Purpose

The **Predictions** table represents a single inference request executed using a specific Experiment.

A Prediction records the operational details of an inference execution, including:

- Experiment used
- Prediction input file
- Prediction lifecycle
- Generated output artifact
- Operational metadata

The Predictions table does **not** store prediction values themselves.

Prediction outputs are stored as Artifacts.

---

# Responsibilities

The Predictions table is responsible for:

- Prediction identity
- Experiment association
- Prediction request lifecycle
- Prediction input metadata
- Output artifact association
- Operational metadata

The Predictions table is **not** responsible for:

- Model storage
- Dataset versioning
- Experiment configuration
- Hyperparameters
- Prediction values

These responsibilities belong to the Experiment and Artifact entities.

---

# Relationships

Predictions belong directly to Experiments.

Each Prediction generates one output Artifact.

```text
User
│
└── Project
      │
      └── Experiment
             │
             ├── Artifacts
             │
             └── Predictions
                    │
                    └── Output Artifact
```

Relationship Summary

- One Experiment → Many Predictions
- One Prediction → One Output Artifact

Every Prediction references exactly one Experiment.

---

# Prediction Philosophy

A Prediction represents an inference request.

Example

```text
Experiment
│
├── Prediction #1
├── Prediction #2
├── Prediction #3
```

Each Prediction may use different input files while referencing the same Experiment.

Prediction history is therefore preserved independently from model training.

---

# Output Management

Prediction values are **not** stored inside the Predictions table.

Instead, every completed Prediction generates an output Artifact.

Example

```text
Prediction
│
└── prediction_results.csv
```

This keeps prediction history lightweight while allowing very large prediction outputs without affecting database performance.

---

# Table Structure

| Column | PostgreSQL Type | Constraints | Description |
|----------|----------------|-------------|-------------|
| **id** | UUID | Primary Key | Unique Prediction Identifier |
| **experiment_id** | UUID | Foreign Key | Parent Experiment |
| **output_artifact_id** | UUID | Foreign Key, NULL | Generated Prediction Output |
| **name** | TEXT | NOT NULL | Prediction Name |
| **prediction_type** | ENUM | NOT NULL | Prediction Execution Type |
| **input_file_name** | TEXT | NOT NULL | Uploaded Prediction Input |
| **input_file_path** | TEXT | NOT NULL | Storage Location |
| **input_format** | ENUM | NOT NULL | Prediction Input Format |
| **file_size** | BIGINT | NOT NULL | Input File Size |
| **mime_type** | TEXT | NOT NULL | MIME Type |
| **checksum** | TEXT | NOT NULL | File Integrity Hash |
| **rows_processed** | INTEGER | NOT NULL | Number of Rows Processed |
| **metadata** | JSONB | NULL | Prediction Metadata |
| **prediction_status** | ENUM | NOT NULL | Prediction Lifecycle |
| **started_at** | TIMESTAMPTZ | NULL | Prediction Start Time |
| **completed_at** | TIMESTAMPTZ | NULL | Prediction Completion Time |
| **created_at** | TIMESTAMPTZ | NOT NULL | Prediction Creation Time |
| **updated_at** | TIMESTAMPTZ | NOT NULL | Metadata Update Time |
| **deleted_at** | TIMESTAMPTZ | NULL | Soft Delete Timestamp |

---

# Prediction Type

Prediction execution type is represented using a PostgreSQL ENUM.

## ENUM Values

```text
SINGLE
BATCH
```

### SINGLE

Inference for one individual record.

---

### BATCH

Inference for multiple records uploaded in a file.

---

# Input Format

Prediction input format is represented using a PostgreSQL ENUM.

## ENUM Values

```text
CSV
XLSX
PARQUET
```

This matches the supported training dataset formats and keeps the system consistent.

---

# Prediction Status

Predictions follow a lifecycle represented using a PostgreSQL ENUM.

## ENUM Values

```text
CREATED
RUNNING
COMPLETED
FAILED
CANCELLED
```

### CREATED

Prediction request created.

---

### RUNNING

Inference is currently executing.

---

### COMPLETED

Prediction finished successfully.

The output Artifact is available for download.

---

### FAILED

Prediction execution failed.

---

### CANCELLED

Prediction execution was intentionally stopped.

---

# Metadata

Prediction-specific metadata is stored using PostgreSQL JSONB.

Example

```json
{
  "prediction_column": "prediction",
  "confidence_scores": true,
  "average_confidence": 0.94
}
```

Metadata contains descriptive information about the prediction execution.

It does **not** contain the prediction values themselves.

---

# Input File Metadata

Every Prediction stores metadata describing the uploaded inference input.

Included information:

- Original filename
- Storage path
- File size
- MIME type
- Checksum

The checksum supports:

- File integrity verification
- Duplicate detection
- Storage validation

---

# Output Artifact

Each completed Prediction references one generated Artifact.

This Artifact typically contains:

- Prediction CSV
- Prediction Excel file
- Prediction JSON

The direct relationship allows efficient retrieval of prediction outputs without searching through all Experiment Artifacts.

---

# Constraints

## Primary Key

```text
PRIMARY KEY (id)
```

---

## Foreign Keys

```text
experiment_id → experiments(id)

output_artifact_id → artifacts(id)
```

`output_artifact_id` remains NULL until prediction generation completes successfully.

---

## NOT NULL

Required fields:

- experiment_id
- name
- prediction_type
- input_file_name
- input_file_path
- input_format
- file_size
- mime_type
- checksum
- rows_processed
- prediction_status
- created_at
- updated_at

---

# Indexing Strategy

Recommended indexes include:

## Primary Index

```text
id
```

---

## Experiment Index

```text
experiment_id
```

Supports retrieval of Prediction history for an Experiment.

---

## Output Artifact Index

```text
output_artifact_id
```

Supports rapid download of generated prediction outputs.

No additional indexes are required for Version 1.

---

# Audit Strategy

Predictions follow the standard ExperiML audit policy.

Audit fields include:

- created_at
- updated_at
- deleted_at
- started_at
- completed_at

## Timestamp Management

- **created_at** records Prediction creation.
- **started_at** records inference start.
- **completed_at** records inference completion.
- **updated_at** records metadata updates.
- **deleted_at** supports soft deletion.

---

# Soft Delete Strategy

Predictions support soft deletion.

Prediction history represents valuable operational information and should not be removed immediately.

Deleting a Prediction sets:

```text
deleted_at = Current Timestamp
```

Permanent removal may be introduced through future cleanup workflows after dependency validation.

---

# Typical Queries

The following represent the primary queries expected for the Predictions table.

---

## Prediction History

Retrieve all Predictions belonging to an Experiment.

Typical ordering:

```text
created_at DESC
```

---

## Open Prediction

Retrieve a Prediction using its UUID.

---

## Running Predictions

Retrieve Predictions where:

```text
prediction_status = RUNNING
```

---

## Failed Predictions

Retrieve Predictions where:

```text
prediction_status = FAILED
```

Useful for operational monitoring and debugging.

---

## Download Prediction Output

Retrieve the output Artifact associated with a completed Prediction.

---

## Recent Predictions

Retrieve the latest Predictions executed for an Experiment.

---

# Derived Information

The Predictions table intentionally does **not** store:

- Prediction values
- Model configuration
- Experiment metrics
- Training parameters
- Runtime duration

Prediction runtime is calculated from:

```text
completed_at - started_at
```

Prediction outputs are retrieved through the associated Artifact.

---

# Security Considerations

Predictions inherit ownership from their parent Experiment.

Every request must verify:

- Authentication
- Project ownership
- Experiment ownership

Users must never access Predictions belonging to another user's Experiment.

Authorization is enforced within the Express application layer.

---

# Future Expansion

The schema supports future enhancements without redesign.

Possible additions include:

- prediction_notes
- inference_device
- inference_framework
- model_latency
- api_request_id
- prediction_tags

These additions can be introduced without affecting the existing architecture.

---

# Design Rationale

Several architectural decisions influenced the Predictions table.

---

## Predictions Represent Requests

Predictions represent inference requests rather than prediction values.

This keeps the database lightweight and scalable.

---

## Output as Artifacts

Prediction outputs are generated Artifacts.

This maintains consistency with the centralized file management architecture.

---

## Separate Prediction Inputs

Prediction input files are intentionally separate from the Datasets table.

Training datasets are long-lived, versioned resources.

Prediction inputs are operational resources used only for inference.

These distinct lifecycles justify separate entities.

---

## Direct Artifact Relationship

Each Prediction references its generated output Artifact.

This avoids ambiguity when an Experiment has multiple prediction executions.

---

## Lightweight Metadata

Prediction-specific descriptive information is stored using JSONB.

Prediction values remain outside the database.

---

## Lifecycle Tracking

Prediction execution is tracked using:

- prediction_status
- started_at
- completed_at

This provides a complete operational history while allowing runtime calculations.

---

## Single Responsibility

The Predictions table records one inference execution.

Model training, experiment configuration, generated files, and datasets remain separate entities.

---

# Approved Design Decisions

The following decisions are approved.

- Predictions represent inference requests rather than prediction values.
- Every Prediction belongs to one Experiment.
- Every completed Prediction references one output Artifact.
- UUID is the primary key.
- Prediction outputs are stored as Artifacts.
- Prediction inputs remain separate from the Datasets table.
- Prediction Type uses a PostgreSQL ENUM.
- Input Format uses a PostgreSQL ENUM.
- Prediction metadata uses JSONB.
- started_at and completed_at are stored instead of prediction duration.
- Predictions support soft deletion.
- Standard audit fields are included.

---

# Summary

The Predictions table completes the machine learning lifecycle within ExperiML.

Each Prediction represents one immutable inference request executed using a specific Experiment while maintaining a clear separation between operational metadata and generated prediction outputs.

By storing prediction outputs as Artifacts and keeping inference requests lightweight, the schema remains scalable, production-ready, and consistent with the architectural principles established throughout ExperiML.