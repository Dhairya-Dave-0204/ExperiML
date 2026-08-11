# ExperiML — Prisma Schema Reference

## Purpose

This document is a reusable reference for understanding the `schema.prisma` file used by ExperiML.

It covers:

- Prisma schema structure
- Nullable fields (`?`)
- Required vs nullable values
- Defaults
- Primary keys
- Relationships and foreign keys
- Field/model mapping
- PostgreSQL-specific types
- JSON fields
- Indexes and unique constraints
- The ExperiML entity relationships
- Lifecycle-related nullable fields

---

# 1. Prisma Schema Structure

The ExperiML schema is organized into:

```text
schema.prisma
│
├── generator
├── datasource
│
├── User
├── Session
├── Project
├── Dataset
├── Experiment
├── Artifact
├── Prediction
│
└── Enums
```

### Generator
Defines how Prisma Client is generated.

### Datasource
Defines the database provider.

### Models
Represent database tables.

### Enums
Represent controlled sets of allowed values.

---

# 2. Generator

```prisma
generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}
```

This tells Prisma to generate Prisma Client from the schema.

Conceptually:

```text
Express Controller
       ↓
Service
       ↓
Prisma Client
       ↓
PostgreSQL
```

The generated client is the application-level interface used by the Node.js backend to communicate with PostgreSQL.

---

# 3. Datasource

```prisma
datasource db {
  provider = "postgresql"
}
```

This tells Prisma that ExperiML uses PostgreSQL.

The database connection URL is supplied through the environment/configuration layer rather than being hardcoded into the schema.

---

# 4. The `?` — Nullable Fields

One of the most important Prisma concepts is the `?` after a field type.

```prisma
description String?
```

means:

> The field can contain a string or `NULL`.

Without the `?`:

```prisma
description String
```

means:

> The field cannot contain `NULL`.

| Prisma | Meaning | PostgreSQL concept |
|---|---|---|
| `String` | Required string | `TEXT NOT NULL` |
| `String?` | Nullable string | `TEXT` |
| `Int` | Required integer | `INTEGER NOT NULL` |
| `Int?` | Nullable integer | `INTEGER` |
| `DateTime` | Required timestamp | `TIMESTAMPTZ NOT NULL` |
| `DateTime?` | Nullable timestamp | `TIMESTAMPTZ` |
| `Json` | Required JSON | `JSONB NOT NULL` |
| `Json?` | Nullable JSON | `JSONB` |
| `Artifact?` | Optional relation | Zero or one related Artifact |

The key idea:

```text
String
    ↓
must have a value

String?
    ↓
may contain NULL
```

---

# 5. Why ExperiML Needs Nullable Fields

Many ExperiML entities have lifecycle states.

For example:

```prisma
startedAt   DateTime?
completedAt DateTime?
```

When an experiment is initially created:

```text
Experiment created
    ↓
startedAt = NULL
completedAt = NULL
```

When training begins:

```text
startedAt = timestamp
completedAt = NULL
```

When training finishes:

```text
startedAt = timestamp
completedAt = timestamp
```

Nullable fields allow the database to represent the real state instead of requiring placeholder values.

---

# 6. `description String?`

A project description is optional:

```prisma
description String?
```

Both are valid:

```text
name: "Customer Churn"
description: "Predict customer churn"
```

and:

```text
name: "Customer Churn"
description: NULL
```

---

# 7. `deletedAt DateTime?`

ExperiML uses soft deletion for applicable entities.

When active:

```text
deletedAt = NULL
```

When soft-deleted:

```text
deletedAt = timestamp
```

The record remains in the database, allowing historical/audit information to be preserved.

---

# 8. `metrics Json?`

Experiment metrics are nullable:

```prisma
metrics Json?
```

An experiment can exist before training finishes.

Initial state:

```text
Experiment
├── configuration     → exists
├── hyperparameters   → exists
├── metrics           → NULL
└── status            → CREATED
```

After training:

```text
Experiment
├── configuration     → exists
├── hyperparameters   → exists
├── metrics           → JSON
└── status            → COMPLETED
```

---

# 9. `outputArtifactId String?`

Prediction output does not necessarily exist when a prediction is first created.

```text
Prediction created
        ↓
outputArtifactId = NULL
        ↓
Prediction running
        ↓
Prediction completed
        ↓
Output artifact generated
        ↓
outputArtifactId = UUID
```

Therefore:

```prisma
outputArtifactId String?
```

is correct.

---

# 10. `outputArtifact Artifact?`

The corresponding Prisma relation is:

```prisma
outputArtifact Artifact?
```

This means:

> A Prediction can have zero or one output Artifact.

The scalar foreign-key field is:

```prisma
outputArtifactId String?
```

The Prisma relation field is:

```prisma
outputArtifact Artifact?
```

These represent the same relationship from different perspectives.

---

# 11. `?` vs `@default`

These are different concepts.

### Nullable

```prisma
metrics Json?
```

means:

```text
JSON value OR NULL
```

### Default

```prisma
experimentStatus ExperimentStatus @default(CREATED)
```

means:

> The field is required, but if no value is supplied, `CREATED` is used.

It does **not** mean the field can be `NULL`.

---

# 12. User Model

The `User` model represents the application's identity/authentication entity.

Conceptually:

```text
User
├── Sessions
└── Projects
```

Important fields include:

```text
id
firstName
lastName
email
passwordHash
accountStatus
createdAt
updatedAt
deletedAt
```

---

# 13. UUID Primary Keys

A typical ID is:

```prisma
id String @id @default(uuid()) @db.Uuid
```

Breakdown:

- `String` — Prisma's application representation
- `@id` — primary key
- `@default(uuid())` — automatically generate a UUID
- `@db.Uuid` — use PostgreSQL's native UUID type

Conceptually:

```text
Prisma
id String
      ↓
PostgreSQL
id UUID PRIMARY KEY
```

---

# 14. `@map`

ExperiML uses camelCase in application code and snake_case in the database.

```prisma
firstName String @map("first_name")
```

Application:

```javascript
user.firstName
```

Database:

```text
first_name
```

This keeps JavaScript code idiomatic while maintaining the database naming convention.

---

# 15. `@db.Text`

Example:

```prisma
email String @db.Text
```

This explicitly maps the field to PostgreSQL `TEXT`.

ExperiML uses `TEXT` for values such as names, emails, descriptions, file paths, MIME types, algorithm names, and checksums.

---

# 16. `[]` — Multiple Relations

```prisma
sessions Session[]
projects Project[]
```

The `[]` means multiple related records.

One User can therefore have many Sessions and many Projects.

```text
User
├── Session
├── Session
├── Session
│
├── Project
├── Project
└── Project
```

---

# 17. `@relation`

Example:

```prisma
user User @relation(
  fields: [userId],
  references: [id]
)
```

This tells Prisma that:

> `userId` is the foreign key and references `User.id`.

Conceptually:

```text
Session
│
├── userId
│
└── user
      ↓
     User
```

Database relationship:

```text
sessions.user_id
        ↓
users.id
```

---

# 18. User → Session

```text
User 1 ─────────── N Session
```

A user can have multiple sessions, for example from different browsers/devices.

---

# 19. User → Project

```text
User 1 ─────────── N Project
```

A user can own multiple ML projects.

---

# 20. Project → Dataset

```text
Project
├── Dataset
├── Dataset
└── Dataset
```

A Dataset contains a foreign key:

```prisma
projectId String @map("project_id") @db.Uuid
```

---

# 21. Project → Experiment

```text
Project
├── Experiment
├── Experiment
└── Experiment
```

An Experiment contains:

```prisma
projectId String @map("project_id") @db.Uuid
```

---

# 22. Dataset Versioning

The Dataset model contains:

```prisma
datasetVersion Int @map("dataset_version")
```

and:

```prisma
@@unique([projectId, name, datasetVersion])
```

This permits:

```text
Project A
├── Customer Churn v1
├── Customer Churn v2
└── Customer Churn v3
```

while preventing duplicate versions within the same project/name combination.

---

# 23. Dataset Metadata

```prisma
metadata Json?
```

This can store flexible profiling information:

```json
{
  "duplicate_rows": 3,
  "missing_values": 18,
  "numeric_columns": 9,
  "categorical_columns": 6
}
```

It is nullable because metadata may not exist during the earliest processing stages.

---

# 24. Experiment — Central Entity

Experiment is the central entity of ExperiML.

```text
Project
   │
   └── Experiment
          │
          ├── Dataset
          ├── Artifacts
          └── Predictions
```

Important fields include:

```text
problemType
algorithmName
configuration
hyperparameters
metrics
experimentStatus
startedAt
completedAt
```

---

# 25. Configuration, Hyperparameters and Metrics

These are deliberately stored separately.

### Configuration

```prisma
configuration Json
```

Example:

```json
{
  "target_column": "churn",
  "feature_columns": ["age", "income"],
  "train_size": 0.8,
  "random_state": 42,
  "scaling": "StandardScaler"
}
```

### Hyperparameters

```prisma
hyperparameters Json
```

Example:

```json
{
  "n_estimators": 500,
  "max_depth": 12
}
```

### Metrics

```prisma
metrics Json?
```

Example:

```json
{
  "accuracy": 0.943,
  "precision": 0.931,
  "recall": 0.925
}
```

Metrics are nullable because they may not exist until training has completed.

---

# 26. Why `algorithmName` Is a String

The schema uses:

```prisma
algorithmName String
```

instead of an enum.

This keeps the platform flexible.

Possible values include:

```text
Random Forest
XGBoost
LightGBM
CatBoost
SVM
```

Future algorithms can be added without changing the database schema.

---

# 27. Experiment Status

Experiment status is an enum:

```text
CREATED
QUEUED
TRAINING
COMPLETED
FAILED
CANCELLED
```

Typical lifecycle:

```text
CREATED
   ↓
QUEUED
   ↓
TRAINING
   ↓
COMPLETED
```

Failure:

```text
TRAINING
   ↓
FAILED
```

Cancellation:

```text
QUEUED
   ↓
CANCELLED
```

---

# 28. Artifact

Artifact represents a generated file associated with an Experiment.

Examples:

```text
model.pkl
preprocessing_pipeline.pkl
report.pdf
feature_importance.json
confusion_matrix.png
```

The database stores metadata about the file rather than its binary contents.

Important fields include:

```text
filePath
fileSize
mimeType
checksum
metadata
```

The actual file is stored in the configured filesystem/storage layer.

---

# 29. Artifact Type vs File Format

The schema separates:

```prisma
artifactType ArtifactType
```

from:

```prisma
fileFormat String
```

These mean different things.

### Artifact Type

What is the artifact?

```text
MODEL
REPORT
VISUALIZATION
FEATURE_IMPORTANCE
...
```

### File Format

How is it stored?

```text
PKL
PDF
PNG
JSON
```

Example:

```text
artifactType = MODEL
fileFormat   = PKL
```

---

# 30. Prediction

Prediction represents an inference execution.

```text
Experiment
├── Prediction #1
├── Prediction #2
└── Prediction #3
```

A Prediction has its own input file information and can eventually point to an output Artifact.

---

# 31. Prediction Input vs Dataset

A Prediction does not directly reference a Dataset.

Instead, it stores:

```text
inputFileName
inputFilePath
inputFormat
fileSize
mimeType
checksum
```

This is intentional.

A Dataset is a versioned, long-lived project resource.

A prediction input is an operational upload used for inference.

They have different lifecycles and therefore remain separate concepts.

---

# 32. Prisma Syntax Quick Reference

| Syntax | Meaning |
|---|---|
| `String` | Required string |
| `String?` | Nullable string |
| `Int` | Required integer |
| `Int?` | Nullable integer |
| `DateTime` | Required timestamp |
| `DateTime?` | Nullable timestamp |
| `Json` | Required JSON |
| `Json?` | Nullable JSON |
| `Model[]` | Multiple related records |
| `Model?` | Zero-or-one related record |
| `@id` | Primary key |
| `@default(...)` | Default value |
| `@unique` | Unique field |
| `@updatedAt` | Automatically update timestamp |
| `@map(...)` | Map a field to a database column |
| `@@map(...)` | Map a model/enum to a database name |
| `@relation(...)` | Define a relationship |
| `@@unique(...)` | Composite unique constraint |
| `@@index(...)` | Database index |
| `@db.Uuid` | PostgreSQL UUID |
| `@db.Text` | PostgreSQL TEXT |
| `@db.BigInt` | PostgreSQL BIGINT |
| `@db.Timestamptz(6)` | PostgreSQL timezone-aware timestamp |

---

# 33. Complete ExperiML Entity Relationship

```text
                         ┌─────────────┐
                         │    User     │
                         └──────┬──────┘
                                │
                    ┌───────────┴───────────┐
                    │                       │
                    ▼                       ▼
              ┌───────────┐          ┌───────────┐
              │  Session  │          │  Project  │
              └───────────┘          └─────┬─────┘
                                           │
                              ┌────────────┴────────────┐
                              │                         │
                              ▼                         ▼
                       ┌───────────┐             ┌────────────┐
                       │  Dataset  │             │ Experiment │
                       │   v1/v2   │────────────►│            │
                       └───────────┘             └─────┬──────┘
                                                      │
                                          ┌───────────┴───────────┐
                                          │                       │
                                          ▼                       ▼
                                   ┌────────────┐          ┌────────────┐
                                   │  Artifact  │          │ Prediction │
                                   └────────────┘          └──────┬─────┘
                                                                  │
                                                                  ▼
                                                            ┌────────────┐
                                                            │  Artifact  │
                                                            │   (output) │
                                                            └────────────┘
```

Main relationships:

```text
User       → Sessions
User       → Projects
Project    → Datasets
Project    → Experiments
Dataset    → Experiments
Experiment → Artifacts
Experiment → Predictions
Prediction → Output Artifact
```

---

# 34. How to Read a Complex Prisma Field

When reading a declaration, break it into parts.

Example:

```prisma
deletedAt DateTime? @map("deleted_at") @db.Timestamptz(6)
```

Read it as:

```text
deletedAt
    ↓
Prisma/application field name

DateTime?
    ↓
timestamp that may be NULL

@map("deleted_at")
    ↓
database column is called deleted_at

@db.Timestamptz(6)
    ↓
use PostgreSQL timezone-aware timestamp
```

Another example:

```prisma
id String @id @default(uuid()) @db.Uuid
```

Read it as:

```text
id
 ↓
String representation in Prisma

@id
 ↓
Primary key

@default(uuid())
 ↓
Automatically generate UUID

@db.Uuid
 ↓
Native PostgreSQL UUID
```

---

# 35. Most Important Concept About `?`

The `?` does **not** mean:

> "The application doesn't care about this field."

It means:

> "The database allows this field to contain NULL."

Whether a field is required at a particular point in the application's workflow is a separate business-logic concern.

For example:

```prisma
completedAt DateTime?
```

means the database allows:

```text
completedAt = NULL
```

but the application may enforce:

```text
ExperimentStatus = COMPLETED
        ↓
completedAt MUST NOT be NULL
```

That type of rule belongs in application/service validation or in database constraints where appropriate.

---

# 36. ExperiML Nullable Field Quick Reference

| Field | Why nullable? |
|---|---|
| `User.deletedAt` | User may not be deleted |
| `Session.revokedAt` | Session may not have been revoked |
| `Project.description` | Description is optional |
| `Project.deletedAt` | Project may not be deleted |
| `Dataset.metadata` | Profiling metadata may not exist yet |
| `Dataset.deletedAt` | Dataset may not be deleted |
| `Experiment.metrics` | Metrics may not exist before training completes |
| `Experiment.startedAt` | Training may not have started |
| `Experiment.completedAt` | Training may not have completed |
| `Experiment.deletedAt` | Experiment may not be deleted |
| `Artifact.metadata` | Additional metadata may be absent |
| `Artifact.deletedAt` | Artifact may not be deleted |
| `Prediction.outputArtifactId` | Output does not exist until successful completion |
| `Prediction.outputArtifact` | Same zero-or-one relationship |
| `Prediction.metadata` | Additional metadata may be absent |
| `Prediction.startedAt` | Prediction may not have started |
| `Prediction.completedAt` | Prediction may not have completed |
| `Prediction.deletedAt` | Prediction may not be deleted |

---

# 37. Final Mental Model

The most useful mental model is:

```text
?        → NULL is allowed
[]       → many related records
@id      → primary key
@default → automatic default
@unique  → unique value
@map     → database column name mapping
@@unique → composite uniqueness
@@index  → database index
@relation → relationship / foreign key
@db.*    → PostgreSQL-specific type
```

For ExperiML:

```text
User
 ↓
Project
 ↓
Dataset ────────────────┐
                        ↓
                    Experiment
                    ↙        ↘
              Artifact      Prediction
                                  ↓
                               Artifact
```

The schema is built around versioned datasets, immutable experiment records, generated artifacts, and inference executions, while nullable fields allow entities to accurately represent their different lifecycle stages.
