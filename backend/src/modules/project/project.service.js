import { prisma } from "#clients/prisma.client";

import { ApiError } from "#utils/ApiError";

/*
 * ===============================================
 * Create Project
 * ===============================================
 */

const createProject = async (userId, projectData) => {
  const { name, description } = projectData;

  /*
   * Check duplicate project name
   *
   * Unique constraint: userId + name
   */
  const existingProject = await prisma.project.findFirst({
    where: {
      userId,
      name,
      deletedAt: null,
    },
  });

  if (existingProject) {
    throw new ApiError(409, "A project with this name already exists.");
  }

  const project = await prisma.project.create({
    data: {
      userId,
      name,
      description,
    },
  });

  return project;
};

/*
 * ===============================================
 * Get All Projects
 * ===============================================
 */

const getProjects = async (userId) => {
  const projects = await prisma.project.findMany({
    where: {
      userId,
      deletedAt: null,
    },

    orderBy: {
      createdAt: "desc",
    },

    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      updatedAt: true,

      _count: {
        select: {
          datasets: {
            where: {
              deletedAt: null,
            },
          },
          experiments: {
            where: {
              deletedAt: null,
            },
          },
        },
      },
    },
  });

  const projectsWithStats = await Promise.all(
    projects.map(async (project) => {
      const modelCount = await prisma.artifact.count({
        where: {
          artifactType: "MODEL",
          artifactStatus: "AVAILABLE",
          deletedAt: null,
          experiment: {
            projectId: project.id,
            deletedAt: null,
          },
        },
      });

      return {
        id: project.id,
        name: project.name,
        description: project.description,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        datasets: project._count.datasets,
        experiments: project._count.experiments,
        models: modelCount,
      };
    }),
  );

  return projectsWithStats;
};

/*
 * ===============================================
 * Get Single Project
 * ===============================================
 */

const getProjectById = async (userId, projectId) => {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      userId,
      deletedAt: null,
    },
  });

  /*
   * We intentionally return 404 instead of
   * 403.
   *
   * This prevents leaking whether a project
   * belongs to another user.
   */
  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  return project;
};

/*
 * ===============================================
 * Update Project
 * ===============================================
 */

const updateProject = async (userId, projectId, updateData) => {
  /*
   * First verify ownership
   */
  const existingProject = await prisma.project.findFirst({
    where: {
      id: projectId,
      userId,
      deletedAt: null,
    },
  });

  if (!existingProject) {
    throw new ApiError(404, "Project not found.");
  }

  /*
   * If name is being changed,
   * check duplicate names.
   */
  if (updateData.name && updateData.name !== existingProject.name) {
    const duplicateProject = await prisma.project.findFirst({
      where: {
        userId,
        name: updateData.name,
        deletedAt: null,
      },
    });

    if (duplicateProject) {
      throw new ApiError(409, "A project with this name already exists.");
    }
  }

  const updatedProject = await prisma.project.update({
    where: {
      id: projectId,
    },

    data: updateData,
  });

  return updatedProject;
};

/*
 * ===============================================
 * Delete Project
 * ===============================================
 *
 * Soft delete.
 *
 */

const deleteProject = async (userId, projectId) => {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      userId,
      deletedAt: null,
    },
  });

  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  const deletedProject = await prisma.project.update({
    where: {
      id: projectId,
    },

    data: {
      deletedAt: new Date(),
    },
  });

  return deletedProject;
};

/*
 * ===============================================
 * Get Project Overview
 * ===============================================
 */

const getProjectOverview = async (userId, projectId) => {
  /*
   * Verify project ownership first.
   *
   * This also prevents exposing information about
   * projects belonging to another user.
   */
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      userId,
      deletedAt: null,
    },
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  /*
   * Fetch all overview information in parallel.
   */
  const [
    datasetCount,
    experimentCount,
    modelCount,
    predictionCount,
    currentExperiment,
  ] = await Promise.all([
    /*
     * Total active datasets belonging to this project.
     */
    prisma.dataset.count({
      where: {
        projectId,
        deletedAt: null,
      },
    }),

    /*
     * Total active experiments belonging to this project.
     */
    prisma.experiment.count({
      where: {
        projectId,
        deletedAt: null,
      },
    }),

    /*
     * Models are represented by MODEL artifacts.
     *
     * Only available, non-deleted model artifacts
     * belonging to active experiments are counted.
     */
    prisma.artifact.count({
      where: {
        artifactType: "MODEL",
        artifactStatus: "AVAILABLE",
        deletedAt: null,
        experiment: {
          projectId,
          deletedAt: null,
        },
      },
    }),

    /*
     * Total active predictions belonging to
     * experiments in this project.
     */
    prisma.prediction.count({
      where: {
        deletedAt: null,
        experiment: {
          projectId,
          deletedAt: null,
        },
      },
    }),

    /*
     * Current experiment:
     * latest active experiment by creation time.
     */
    prisma.experiment.findFirst({
      where: {
        projectId,
        deletedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        problemType: true,
        algorithmName: true,
        experimentStatus: true,
        startedAt: true,
        dataset: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    }),
  ]);

  return {
    project,

    summary: {
      datasets: datasetCount,
      experiments: experimentCount,
      models: modelCount,
      predictions: predictionCount,
    },

    currentExperiment,

    workflow: {
      datasets: datasetCount > 0,
      experiments: experimentCount > 0,
      models: modelCount > 0,
      predictions: predictionCount > 0,
    },
  };
};

export {
  createProject,
  getProjects,
  getProjectById,
  getProjectOverview,
  updateProject,
  deleteProject,
};
