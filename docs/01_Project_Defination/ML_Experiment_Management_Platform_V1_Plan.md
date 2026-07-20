# ML Experiment Management Platform (Version 1 Planning Document)

## Product Name Ideas

1.  ModelForge ⭐
2.  ExperiML
3.  TrainDock
4.  ModelNest
5.  DataPilot
6.  ForgeML
7.  NexModel
8.  LaboraML
9.  ModelVerse
10. TrainHub
11. StudioML
12. ModelStack
13. InsightForge
14. NovaML
15. CraftML

> **Recommended choices** - ModelForge (my top recommendation) -
> ExperiML - ForgeML - TrainDock - ModelNest

------------------------------------------------------------------------

# Project Vision

**Working Category:** ML Experiment Management Platform

**Vision Statement**

Build a production-inspired web application that enables users to create
ML projects, upload datasets, train and compare machine learning models,
manage experiments, make predictions, and generate reports from a
browser.

The emphasis is on **experiment management**, **reproducibility**, and
**production-grade workflow**, rather than building one domain-specific
prediction model.

------------------------------------------------------------------------

# Core Philosophy

-   One user owns all of their data.
-   No collaboration or role-based access.
-   One Project contains multiple datasets, experiments, models,
    predictions, and reports.
-   Every experiment is reproducible.
-   Saved models and preprocessing pipelines are downloadable.
-   React is the only frontend.
-   FastAPI acts as the ML service.
-   Node.js manages the application logic.

------------------------------------------------------------------------

# Final Technology Stack

## Frontend

-   React
-   Tailwind CSS
-   React Router
-   Axios
-   React Hook Form
-   Recharts

## Backend

-   Node.js
-   Express
-   JWT Authentication
-   HTTP-only Cookies
-   Multer
-   bcrypt
-   Validation (Zod or express-validator)

## ML Service

-   FastAPI
-   Pydantic
-   pandas
-   NumPy
-   scikit-learn
-   XGBoost
-   joblib

## Database

-   PostgreSQL
-   Prisma ORM (recommended)

## Development Tools

-   Git
-   GitHub
-   Postman
-   Swagger/OpenAPI
-   ESLint
-   Prettier
-   Black
-   Ruff

## Deployment

-   Frontend → Vercel
-   Backend → Render
-   FastAPI → Render/Railway
-   Database → Neon PostgreSQL

------------------------------------------------------------------------

# High-Level Architecture

React + Tailwind

↓

Node/Express

-   Authentication
-   Project Management
-   File Management
-   Database Operations

↓

FastAPI

-   Preprocessing
-   Training
-   Evaluation
-   Prediction
-   Model Loading

↓

Saved Artifacts

-   Models
-   Pipelines
-   Reports

------------------------------------------------------------------------

# Version 1 Scope

## Authentication

-   Register
-   Login
-   Logout
-   Change Password
-   Profile
-   Delete Account

------------------------------------------------------------------------

## Dashboard

-   Overview
-   Recent Projects
-   Recent Experiments
-   Statistics

------------------------------------------------------------------------

## Project Management

Each project acts as a workspace.

Contains:

-   Datasets
-   Experiments
-   Saved Models
-   Predictions
-   Reports
-   History

------------------------------------------------------------------------

## Dataset Management

-   Upload CSV
-   Dataset Preview
-   Dataset Statistics
-   Delete Dataset
-   Dataset Metadata

------------------------------------------------------------------------

## Data Profiling

-   Rows
-   Columns
-   Missing Values
-   Duplicate Rows
-   Feature Types
-   Correlation
-   Basic Visualizations

------------------------------------------------------------------------

## Preprocessing

-   Missing Value Handling
-   Encoding
-   Feature Scaling
-   Train/Test Split

------------------------------------------------------------------------

## Model Training

Initial algorithms:

-   Linear Regression
-   Logistic Regression
-   Decision Tree
-   Random Forest
-   KNN
-   SVM
-   XGBoost

Features:

-   Select Target Column
-   Choose Algorithm
-   Configure Hyperparameters
-   Train Model
-   Evaluate Model

------------------------------------------------------------------------

## Experiment Tracking

Store:

-   Algorithm
-   Parameters
-   Dataset Used
-   Metrics
-   Timestamp
-   Feature List
-   Training Configuration

------------------------------------------------------------------------

## Model Management

Save:

-   model.pkl
-   preprocessing_pipeline.pkl
-   metrics.json
-   experiment_config.json

Allow users to download these artifacts.

------------------------------------------------------------------------

## Predictions

Version 1

-   Single Prediction

Version 1.5

-   Batch Prediction
-   Upload CSV
-   Download prediction results

------------------------------------------------------------------------

## Report Generation

Generate PDF containing:

-   Dataset Summary
-   Model Summary
-   Hyperparameters
-   Evaluation Metrics
-   Confusion Matrix / Regression Metrics
-   Feature Importance (when applicable)
-   Generation Time

------------------------------------------------------------------------

## Settings

-   Profile
-   Change Password
-   Delete Account
-   Logout

------------------------------------------------------------------------

# File Storage Strategy

Store metadata in PostgreSQL.

Store uploaded/generated files on the server filesystem.

Example layout:

uploads/

user_x/

project_y/

datasets/

models/

reports/

predictions/

Database stores only references (path, size, owner, timestamps).

------------------------------------------------------------------------

# Project Structure

ml-platform/

client/

server/

ml-service/

docs/

------------------------------------------------------------------------

# Version 2 Ideas

-   AI Dataset Assistant
-   AI EDA Explanation
-   AI Model Recommendation
-   SHAP Explainability
-   Batch Prediction Improvements
-   Experiment Comparison Dashboard
-   Automated Hyperparameter Search
-   Export ZIP of Experiment
-   Cloud Object Storage (S3/GCS)
-   Notifications
-   Dataset Versioning
-   Advanced Analytics

------------------------------------------------------------------------

# Development Roadmap

1.  Finalize product vision and scope.
2.  Design PostgreSQL schema.
3.  Design folder structure.
4.  Define REST API contracts.
5.  Design UI/UX.
6.  Design ML workflow and experiment lifecycle.
7.  Implement in phases.

------------------------------------------------------------------------

# Success Criteria

A successful Version 1 should demonstrate:

-   Production-style architecture.
-   Clean full-stack engineering.
-   Reproducible ML experiments.
-   Proper project organization.
-   Downloadable ML artifacts.
-   Professional UI.
-   Clear documentation.
-   Ready for future AI-powered enhancements.
