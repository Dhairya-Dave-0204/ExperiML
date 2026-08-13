# ExperiML Dataset Module Architecture Decisions

## Overview

This document contains the finalized architectural decisions for the
ExperiML Dataset module.

The Dataset module manages:

-   Dataset uploads
-   File validation
-   File storage
-   Dataset versioning
-   Dataset lifecycle management
-   Metadata extraction
-   Processing workflow
-   Failure handling
-   Future FastAPI integration

The core principle:

> Express manages application workflow and file lifecycle. Dataset
> processing remains abstract and can move to FastAPI later.

------------------------------------------------------------------------

# Storage Architecture

## Final Decision

A storage abstraction layer will be used.

Architecture:

    Dataset Service
          |
          v
    File Storage Service
          |
          v
    Storage Provider
          |
          +----------------+
          |                |
          v                v
    Local Filesystem    Cloudinary
    (V1 Development)    (Production)

The Dataset module will never directly depend on a storage provider.

------------------------------------------------------------------------

# Development Storage

Development uses:

    STORAGE_PROVIDER=local

The local filesystem is used because it provides:

-   Simple development
-   Fast access
-   Easy debugging
-   No external dependency

------------------------------------------------------------------------

# Production Storage

Production will initially use Cloudinary.

The storage abstraction allows future migration to:

-   AWS S3
-   Cloudflare R2
-   Google Cloud Storage
-   Other object storage providers

without changing Dataset business logic.

------------------------------------------------------------------------

# File Storage Structure

## Temporary Storage

    storage/
    └── temp/
        └── <temporary-upload-id>/
            └── uploaded-file

Temporary files exist only during upload and processing.

## Permanent Storage

    storage/
    └── projects/
        └── <projectId>/
            └── datasets/
                └── <datasetId>/
                    └── data.<extension>

The dataset ID is used as the permanent storage identity.

------------------------------------------------------------------------

# File Naming

The original filename is stored in the database.

Example:

Original:

    customer_churn_final.csv

Stored:

    data.csv

Database:

    originalFileName:
    customer_churn_final.csv

    filePath:
    projects/projectId/datasets/datasetId/data.csv

------------------------------------------------------------------------

# Upload Handling

Multer is used for multipart uploads.

Flow:

    Client
     |
     v
    Express
     |
     v
    Multer
     |
     v
    Temporary Storage

Multer only handles receiving the file.

It does not perform:

-   Metadata extraction
-   Database creation
-   Dataset processing

------------------------------------------------------------------------

# File Size Configuration

The upload size limit is environment controlled.

Development:

    MAX_DATASET_FILE_SIZE=100MB

The value can be changed per environment without modifying code.

------------------------------------------------------------------------

# File Validation

Validation occurs in three layers.

## Extension Validation

Supported:

    CSV
    XLSX
    PARQUET

## MIME Validation

The uploaded MIME type is checked.

## Parser Validation

The actual file content is validated by attempting to read it.

Flow:

    Extension
       |
       v
    MIME
       |
       v
    Parser
       |
       v
    Valid Dataset

------------------------------------------------------------------------

# Dataset Processing Architecture

Processing is abstracted.

## Current V1

    Express
     |
     v
    Dataset Processing Service
     |
     v
    Lightweight Node Parser

## Future

    Express
     |
     v
    Dataset Processing Service
     |
     v
    FastAPI
     |
     v
    Python Processing

------------------------------------------------------------------------

# Dataset Metadata

V1 extracts moderate metadata:

-   Row count
-   Column count
-   Column names
-   Data types
-   Nullable information

Example:

``` json
{
  "columns": [
    {
      "name": "age",
      "type": "integer",
      "nullable": false
    }
  ]
}
```

Advanced analysis such as:

-   Correlations
-   Feature importance
-   Statistics
-   Profiling

belongs to later ML workflows.

------------------------------------------------------------------------

# Checksum

Node calculates SHA-256 during file storage.

Flow:

    Temporary File
          |
          v
    Node crypto
          |
          v
    SHA-256
          |
          v
    Dataset checksum

Purpose:

-   Integrity verification
-   Duplicate detection
-   Reproducibility

------------------------------------------------------------------------

# Dataset Lifecycle

Dataset states:

    UPLOADING
    PROCESSING
    READY
    FAILED

Flow:

    Upload
     |
     v
    UPLOADING
     |
     v
    Processing
     |
     +----------+
     |          |
     v          v
    READY    FAILED

------------------------------------------------------------------------

# Complete Upload Flow

    Client Upload

          |
          v

    Authenticate User

          |
          v

    Verify Project Ownership

          |
          v

    Multer Upload

          |
          v

    Temporary Storage

          |
          v

    File Validation

          |
          v

    SHA-256 Generation

          |
          v

    PROCESSING

          |
          v

    Dataset Processing Service

          |
          v

    Metadata Extraction

          |
          v

    Move To Permanent Storage

          |
          v

    Create Dataset Record

          |
          v

    READY

------------------------------------------------------------------------

# Failure Handling

Because filesystem and database are separate systems, cleanup is
required.

Example:

    Upload
     |
     v
    Temporary File
     |
     v
    Processing Failure
     |
     v
    FAILED
     |
     v
    Cleanup Files

No orphan files should remain.

------------------------------------------------------------------------

# Dataset Versioning

Versions are generated by the backend.

The client never supplies datasetVersion.

Example:

    customers v1
    customers v2
    customers v3

Deleted versions are never reused.

Example:

    v1
    v2 deleted
    v3

Next:

    v4

This guarantees experiment reproducibility.

------------------------------------------------------------------------

# Final Architecture

                     Express API

                          |
            +-------------+-------------+
            |                           |
            v                           v

     File Storage Service       Dataset Processing Service

            |                           |
            v                           v

     Local Provider              Node Parser (V1)

            |
            v

     Cloudinary Provider
     (Production)


                          |
                          v

                     PostgreSQL

                  Dataset Metadata

------------------------------------------------------------------------

# Final Decisions Summary

  Area                  Decision
  --------------------- -------------------------------------------
  Upload handling       Multer
  Development storage   Local filesystem
  Production storage    Cloudinary initially
  Storage design        Provider abstraction
  Temporary storage     Dedicated temp directory
  File naming           Dataset ID based
  Validation            Extension + MIME + parser
  File limit            Environment configured, 100MB development
  Checksum              Node SHA-256
  Processing            Processing abstraction
  Current parser        Lightweight Node parser
  Future parser         FastAPI + pandas + pyarrow
  Metadata              Moderate structural metadata
  Versioning            Backend generated
  Failure handling      Cleanup + FAILED state
  File mutation         Original files remain immutable
