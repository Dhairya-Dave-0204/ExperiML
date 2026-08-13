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
  });

  return projects;
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

export {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
