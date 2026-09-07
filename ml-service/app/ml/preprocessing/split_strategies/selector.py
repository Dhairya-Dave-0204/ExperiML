from app.ml.preprocessing.split_strategies.classification import (
    ClassificationSplitStrategy,
)
from app.ml.preprocessing.split_strategies.regression import (
    RegressionSplitStrategy,
)
from app.schemas.experiment import ProblemType


class SplitStrategySelector:
    def select(
        self,
        problem_type: ProblemType,
    ):
        if problem_type == ProblemType.CLASSIFICATION:
            return ClassificationSplitStrategy()

        if problem_type == ProblemType.REGRESSION:
            return RegressionSplitStrategy()

        raise ValueError(
            f"Unsupported problem type for train/test split: "
            f"{problem_type}"
        )


split_strategy_selector = SplitStrategySelector()