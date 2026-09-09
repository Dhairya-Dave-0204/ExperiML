from typing import Callable

from app.schemas.experiment import ProblemType
from app.ml.algorithms.classification.logistic_regression import (
    create_logistic_regression,
)
from app.ml.algorithms.classification.decision_tree import (
    create_decision_tree_classifier,
)
from app.ml.algorithms.classification.random_forest import (
    create_random_forest_classifier
)


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