import crypto from "crypto";

import { prisma } from "#clients/prisma.client";

import { ApiError } from "#utils/ApiError";

import {
  EXPERIMENT_STATUSES,
  EXPERIMENT_ERRORS,
} from "#experiment/experiment.constants";

import { DATASET_STATUSES } from "#dataset/dataset.constants";

import fastApiExecutionService from "#services/fastapi-execution.service";

class ExperimentService {
  /*
   * ============================================================
   * CREATE EXPERIMENT
   * ============================================================
   *
   * Creates an Experiment definition and submits its execution
   * to the ML/FastAPI service.
   *
   * Current V1 behavior:
   * - The Project must belong to the authenticated user.
   * - The Dataset must belong to the Project.
   * - The Dataset must not be soft deleted.
   * - The Dataset must be READY.
   * - Node generates and owns the execution ID.
   * - The Experiment is persisted in QUEUED state.
   * - FastAPI receives the execution request asynchronously.
   * - If FastAPI submission fails, the Experiment is marked FAILED.
   */

  async createExperiment({
    projectId,
    userId,
    name,
    datasetId,
    problemType,
    algorithmName,
    configuration,
    hyperparameters,
  }) {
    /*
     * 1. Verify Project ownership
     */

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId,
        deletedAt: null,
      },
    });

    if (!project) {
      throw new ApiError(404, EXPERIMENT_ERRORS.PROJECT_NOT_FOUND);
    }

    /*
     * 2. Verify Dataset
     *
     * The Dataset must:
     * - exist
     * - belong to this Project
     * - not be soft deleted
     */

    const dataset = await prisma.dataset.findFirst({
      where: {
        id: datasetId,
        projectId,
        deletedAt: null,
      },
    });

    if (!dataset) {
      throw new ApiError(404, EXPERIMENT_ERRORS.DATASET_NOT_FOUND);
    }

    /*
     * 3. Dataset must be READY
     *
     * Experiments can only be created against a Dataset that
     * has completed its processing lifecycle.
     */

    if (dataset.datasetStatus !== DATASET_STATUSES.READY) {
      throw new ApiError(409, EXPERIMENT_ERRORS.DATASET_NOT_READY);
    }

    /*
     * 4. Generate execution ID
     *
     * Node owns the execution identity because Node owns the
     * Experiment lifecycle and persistence.
     */

    const executionId = crypto.randomUUID();

    /*
     * 5. Create Experiment
     *
     * The Experiment is persisted before FastAPI is called.
     *
     * This ensures that:
     * - the Experiment exists before execution starts
     * - the execution ID is persisted
     * - Node remains authoritative for the Experiment record
     */

    const experiment = await prisma.experiment.create({
      data: {
        projectId,
        datasetId,
        name,
        problemType,
        algorithmName,
        configuration,
        hyperparameters,
        executionId,
        experimentStatus: EXPERIMENT_STATUSES.QUEUED,
      },
    });

    /*
     * 6. Submit execution to FastAPI
     *
     * FastAPI handles the ML execution asynchronously.
     *
     * A successful submission returns 202 / QUEUED.
     */

    try {
      await fastApiExecutionService.createExecution({
        executionId,
        projectId,
        experimentId: experiment.id,
        dataset,
        problemType,
        algorithmName,
        configuration,
        hyperparameters,
      });
    } catch (error) {
      /*
       * FastAPI submission failed.
       *
       * Node remains authoritative, so mark the Experiment
       * as FAILED before propagating the error.
       */

      await prisma.experiment.update({
        where: {
          id: experiment.id,
        },
        data: {
          experimentStatus: EXPERIMENT_STATUSES.FAILED,
        },
      });

      throw error;
    }

    return experiment;
  }

  /*
   * ============================================================
   * GET PROJECT EXPERIMENTS
   * ============================================================
   *
   * Retrieves all non-deleted Experiments belonging to a Project owned by the authenticated user.
   */

  async getProjectExperiments({ projectId, userId }) {
    /*
     * 1. Verify Project ownership
     */

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId,
        deletedAt: null,
      },
    });

    if (!project) {
      throw new ApiError(404, EXPERIMENT_ERRORS.PROJECT_NOT_FOUND);
    }

    /*
     * 2. Retrieve non-deleted Experiments
     */

    return prisma.experiment.findMany({
      where: {
        projectId,
        deletedAt: null,
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /*
   * ============================================================
   * GET EXPERIMENT BY ID
   * ============================================================
   *
   * Retrieves one Experiment while simultaneously verifying:
   * - Experiment belongs to the requested Project.
   * - Project belongs to the authenticated user.
   * - Experiment is not soft deleted.
   */

  async getExperimentById({ projectId, experimentId, userId }) {
    const experiment = await prisma.experiment.findFirst({
      where: {
        id: experimentId,

        projectId,

        deletedAt: null,

        project: {
          userId,
          deletedAt: null,
        },
      },
    });

    if (!experiment) {
      throw new ApiError(404, EXPERIMENT_ERRORS.EXPERIMENT_NOT_FOUND);
    }

    return experiment;
  }

  /*
   * ============================================================
   * UPDATE EXPERIMENT
   * ============================================================
   *
   * D8-B:
   * CREATED -> execution definition can be modified
   *
   * QUEUED / TRAINING / COMPLETED / FAILED / CANCELLED -> only the name may be modified
   *
   * The execution definition consists of:
   * - datasetId
   * - problemType
   * - algorithmName
   * - configuration
   * - hyperparameters
   *
   * Name remains editable after execution starts because changing it does not alter what was executed
   */

  async updateExperiment({
    projectId,
    experimentId,
    userId,
    name,
    datasetId,
    problemType,
    algorithmName,
    configuration,
    hyperparameters,
  }) {
    /*
     * 1. Retrieve the accessible Experiment
     */

    const experiment = await this.getExperimentById({
      projectId,
      experimentId,
      userId,
    });

    /*
     * 2. Make sure at least one field was supplied
     */

    const updateData = {};

    if (name !== undefined) {
      updateData.name = name;
    }

    if (datasetId !== undefined) {
      updateData.datasetId = datasetId;
    }

    if (problemType !== undefined) {
      updateData.problemType = problemType;
    }

    if (algorithmName !== undefined) {
      updateData.algorithmName = algorithmName;
    }

    if (configuration !== undefined) {
      updateData.configuration = configuration;
    }

    if (hyperparameters !== undefined) {
      updateData.hyperparameters = hyperparameters;
    }

    if (Object.keys(updateData).length === 0) {
      throw new ApiError(400, "At least one field is required for update");
    }

    /*
     * 3. D8-B lifecycle protection
     * Once execution has started, only `name` remains editable.
     */

    if (experiment.experimentStatus !== EXPERIMENT_STATUSES.CREATED) {
      const hasExecutionDefinitionChanges =
        datasetId !== undefined ||
        problemType !== undefined ||
        algorithmName !== undefined ||
        configuration !== undefined ||
        hyperparameters !== undefined;

      if (hasExecutionDefinitionChanges) {
        throw new ApiError(
          409,
          EXPERIMENT_ERRORS.EXPERIMENT_UPDATE_NOT_ALLOWED,
        );
      }
    }

    /*
     * 4. If Dataset is being changed, validate the new Dataset
     *
     * The new Dataset must:
     * - belong to the same Project
     * - not be soft deleted
     * - be READY
     */

    if (datasetId !== undefined && datasetId !== experiment.datasetId) {
      const dataset = await prisma.dataset.findFirst({
        where: {
          id: datasetId,
          projectId,
          deletedAt: null,
        },
      });

      if (!dataset) {
        throw new ApiError(404, EXPERIMENT_ERRORS.DATASET_NOT_FOUND);
      }

      if (dataset.datasetStatus !== DATASET_STATUSES.READY) {
        throw new ApiError(409, EXPERIMENT_ERRORS.DATASET_NOT_READY);
      }
    }

    /*
     * 5. Update Experiment
     */

    return prisma.experiment.update({
      where: {
        id: experimentId,
      },

      data: updateData,
    });
  }

  /*
   * ============================================================
   * DELETE EXPERIMENT
   * ============================================================
   *
   * Experiments use soft deletion.
   *
   * Physical database record remains available so that historical experiment relationships remain intact
   */

  async deleteExperiment({ projectId, experimentId, userId }) {
    /*
     * 1. Verify Experiment ownership/access
     */

    const experiment = await this.getExperimentById({
      projectId,
      experimentId,
      userId,
    });

    /*
     * 2. Soft delete
     */

    await prisma.experiment.update({
      where: {
        id: experiment.id,
      },

      data: {
        deletedAt: new Date(),
      },
    });

    return true;
  }
}

export default new ExperimentService();
