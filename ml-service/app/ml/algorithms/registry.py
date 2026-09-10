from typing import Callable

from app.schemas.experiment import ProblemType
from app.ml.algorithms.classification.logistic_regression import ( create_logistic_regression )
from app.ml.algorithms.classification.decision_tree import ( create_decision_tree_classifier )
from app.ml.algorithms.classification.random_forest import ( create_random_forest_classifier )
from app.ml.algorithms.classification.knn import ( create_knn_classifier )
from app.ml.algorithms.classification.svm import ( create_svm_classifier )
from app.ml.algorithms.classification.naive_bayes import ( create_naive_bayes_classifier )
from app.ml.algorithms.classification.xgboost_classifier import ( create_xgboost_classifier )
from app.ml.algorithms.regression.linear_regression import ( create_linear_regression )
from app.ml.algorithms.regression.ridge import ( create_ridge_regression )


class AlgorithmRegistry:
    def __init__(self):
        self._algorithms: dict[
            ProblemType,
            dict[str, Callable],
        ] = {
            ProblemType.CLASSIFICATION: {},
            ProblemType.REGRESSION: {},
        }

    def register(
        self,
        problem_type: ProblemType,
        name: str,
        factory: Callable,
    ) -> None:
        if name in self._algorithms[problem_type]:
            raise ValueError(
                f"Algorithm already registered: "
                f"{problem_type} / {name}"
            )

        self._algorithms[problem_type][name] = factory

    def create(
        self,
        problem_type: ProblemType,
        name: str,
        **kwargs,
    ):
        algorithms = self._algorithms.get(problem_type)

        if algorithms is None:
            raise ValueError(
                f"Unsupported problem type: {problem_type}"
            )

        factory = algorithms.get(name)

        if factory is None:
            raise ValueError(
                f"Algorithm not found: "
                f"{problem_type} / {name}"
            )

        return factory(**kwargs)


algorithm_registry = AlgorithmRegistry()

# ---------- Registry of classification algorithms ----------
algorithm_registry.register(
    problem_type=ProblemType.CLASSIFICATION,
    name="logistic_regression",
    factory=create_logistic_regression,
)

algorithm_registry.register(
    problem_type=ProblemType.CLASSIFICATION,
    name="decision_tree_classifier",
    factory=create_decision_tree_classifier,
)

algorithm_registry.register(
    problem_type=ProblemType.CLASSIFICATION,
    name="random_forest_classifier",
    factory=create_random_forest_classifier,
)

algorithm_registry.register(
    problem_type=ProblemType.CLASSIFICATION,
    name="knn_classifier",
    factory=create_knn_classifier,
)

algorithm_registry.register(
    problem_type=ProblemType.CLASSIFICATION,
    name="svm_classifier",
    factory=create_svm_classifier,
)

algorithm_registry.register(
    problem_type=ProblemType.CLASSIFICATION,
    name="naive_bayes",
    factory=create_naive_bayes_classifier,
)

algorithm_registry.register(
    problem_type=ProblemType.CLASSIFICATION,
    name="xgboost_classifier",
    factory=create_xgboost_classifier,
)

# ---------- Registry of regression algorithms ----------
algorithm_registry.register(
    problem_type=ProblemType.REGRESSION,
    name="linear_regression",
    factory=create_linear_regression,
)

algorithm_registry.register(
    problem_type=ProblemType.REGRESSION,
    name="ridge",
    factory=create_ridge_regression,
)