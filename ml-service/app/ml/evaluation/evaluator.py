from app.ml.evaluation.classification import (
    ClassificationEvaluator,
)
from app.ml.evaluation.regression import (
    RegressionEvaluator,
)
from app.schemas.experiment import ProblemType


class EvaluatorSelector:
    def select(
        self,
        problem_type: ProblemType,
    ):
        if problem_type == ProblemType.CLASSIFICATION:
            return ClassificationEvaluator()

        if problem_type == ProblemType.REGRESSION:
            return RegressionEvaluator()

        raise ValueError(
            f"Unsupported problem type for evaluation: "
            f"{problem_type}"
        )


evaluator_selector = EvaluatorSelector()