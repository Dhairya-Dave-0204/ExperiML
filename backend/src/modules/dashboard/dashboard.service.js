import { prisma } from "#clients/prisma.client";

/*
 * ===============================================
 * Dashboard Configuration
 * ===============================================
 */

/*
 * Number of records displayed in the dashboard's recent sections.
 * 
 *
 * This is intentionally kept internal to the dashboard service because it is a presentation/
 * aggregation concern rather than a database rule.
 */
const RECENT_PROJECTS_LIMIT = 5;
const RECENT_EXPERIMENTS_LIMIT = 5;

/*
 * ===============================================
 * Dashboard Service
 * ===============================================
 */

class DashboardService {
  /**
   * Retrieves all data required by the authenticated user's dashboard.
   *
   * The dashboard is a read-only aggregation of existing domain entities.
   *
   * No Dashboard or Workspace database entity exists.
   *
   * @param {object} data
   * @param {string} data.userId
   * @returns {Promise<object>}
   */
  async getDashboard({ userId }) {
    /*
     * The three independent dashboard operations can execute concurrently.
     *
     * Recent Work is derived from recentExperiments, so it does not require another database query.
     * 
     */
    const [recentProjects, recentExperiments, workspaceSummary] =
      await Promise.all([
        this.getRecentProjects(userId),
        this.getRecentExperiments(userId),
        this.getWorkspaceSummary(userId),
      ]);

    /*
     * hasWorkspace is explicitly derived from the number of non-deleted projects.
     *
     * It is NOT inferred from recentProjects because the recent-project query is intentionally limited.
     */
    const hasWorkspace = workspaceSummary.projects > 0;

    /*
     * The most recently created experiment represents Recent Work.
     * 
     * If the user has no experiments, recentWork is explicitly null.
     */
    const recentWork = recentExperiments.length
      ? this.transformRecentWork(recentExperiments[0])
      : null;

    return {
      hasWorkspace,

      recentWork,

      recentExperiments: recentExperiments.map((experiment) =>
        this.transformRecentExperiment(experiment),
      ),

      recentProjects: recentProjects.map((project) =>
        this.transformRecentProject(project),
      ),

      workspaceSummary,
    };
  }

  /*
   * ===============================================
   * Recent Projects
   * ===============================================
   */

  /**
   * Retrieves the most recently created, non-deleted projects belonging to the authenticated user.
   *
   * Project-level experiment and dataset counts are retrieved through Prisma relation counts rather
   * than loading all child records.
   *
   * @param {string} userId
   * @returns {Promise<Array>}
   */
  async getRecentProjects(userId) {
    return prisma.project.findMany({
      where: {
        userId,
        deletedAt: null,
      },

      orderBy: {
        createdAt: "desc",
      },

      take: RECENT_PROJECTS_LIMIT,

      select: {
        id: true,
        name: true,

        _count: {
          select: {
            experiments: {
              where: {
                deletedAt: null,
              },
            },

            datasets: {
              where: {
                deletedAt: null,
              },
            },
          },
        },
      },
    });
  }

  /*
   * ===============================================
   * Recent Experiments
   * ===============================================
   */

  /**
   * Retrieves the most recently created, non-deleted experiments accessible to the authenticated user.
   *
   * The ownership chain is enforced through:
   * Experiment
   *      ↓
   * Project
   *      ↓
   * User
   *
   * Both the Experiment and its parent Project must be non-deleted.
   *
   * The associated Dataset is included because Recent Work requires the exact Dataset referenced
   * by the Experiment.
   *
   * @param {string} userId
   * @returns {Promise<Array>}
   */
  async getRecentExperiments(userId) {
    return prisma.experiment.findMany({
      where: {
        deletedAt: null,

        project: {
          userId,
          deletedAt: null,
        },
      },

      orderBy: {
        createdAt: "desc",
      },

      take: RECENT_EXPERIMENTS_LIMIT,

      select: {
        id: true,
        name: true,
        experimentStatus: true,
        updatedAt: true,

        project: {
          select: {
            id: true,
            name: true,
          },
        },

        dataset: {
          select: {
            id: true,
            name: true,
            datasetVersion: true,
            deletedAt: true,
          },
        },
      },
    });
  }

  /*
   * ===============================================
   * Workspace Summary
   * ===============================================
   */

  /**
   * Retrieves aggregate counts for the authenticated user's workspace.
   *
   * The three counts execute concurrently because they are independent database operations. 
   *
   * @param {string} userId
   * @returns {Promise<object>}
   */
  async getWorkspaceSummary(userId) {
    const [projectCount, experimentCount, datasetCount] = await Promise.all([
      prisma.project.count({
        where: {
          userId,
          deletedAt: null,
        },
      }),

      prisma.experiment.count({
        where: {
          deletedAt: null,

          project: {
            userId,
            deletedAt: null,
          },
        },
      }),

      prisma.dataset.count({
        where: {
          deletedAt: null,

          project: {
            userId,
            deletedAt: null,
          },
        },
      }),
    ]);

    return {
      projects: projectCount,
      experiments: experimentCount,
      datasets: datasetCount,
    };
  }

  /*
   * ===============================================
   * Response Transformers
   * ===============================================
   */

  /**
   * Converts a Project database record into the dashboard Project representation.
   *
   * @param {object} project
   * @returns {object}
   */
  transformRecentProject(project) {
    return {
      id: project.id,
      name: project.name,

      experiments: project._count.experiments,
      datasets: project._count.datasets,
    };
  }

  /**
   * Converts an Experiment database record into the dashboard Recent Experiment representation.
   *
   * Metrics are intentionally omitted.
   *
   * @param {object} experiment
   * @returns {object}
   */
  transformRecentExperiment(experiment) {
    return {
      id: experiment.id,

      name: experiment.name,

      project: {
        id: experiment.project.id,
        name: experiment.project.name,
      },

      status: experiment.experimentStatus,

      updatedAt: experiment.updatedAt,
    };
  }

  /**
   * Converts the latest Experiment into the dashboard Recent Work representation.
   * No runId or metrics are fabricated.
   *
   * @param {object} experiment
   * @returns {object}
   */
  transformRecentWork(experiment) {
    return {
      project: {
        id: experiment.project.id,
        name: experiment.project.name,
      },

      experiment: {
        id: experiment.id,
        name: experiment.name,
        status: experiment.experimentStatus,
      },

      /*
       * A Dataset referenced by an Experiment should normally exist because of the foreign key.
       *
       * We still handle a soft-deleted Dataset safely rather than exposing it as an active resource.
       */
      dataset: experiment.dataset?.deletedAt
        ? null
        : {
            id: experiment.dataset.id,
            name: experiment.dataset.name,
            version: experiment.dataset.datasetVersion,
          },

      updatedAt: experiment.updatedAt,
    };
  }
}

/*
 * Export a single service instance, following the same service pattern used throughout the backend.
 */
export default new DashboardService();
