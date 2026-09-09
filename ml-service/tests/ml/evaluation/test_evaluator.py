import pytest

from app.ml.evaluation.classification import (
    ClassificationEvaluator,
)
from app.ml.evaluation.evaluator import (
    EvaluatorSelector,
)
from app.ml.evaluation.regression import (
    RegressionEvaluator,
)
from app.schemas.experiment import ProblemType


def test_selector_returns_classification_evaluator():
    selector = EvaluatorSelector()

    evaluator = selector.select(
        ProblemType.CLASSIFICATION
    )

    assert isinstance(
        evaluator,
        ClassificationEvaluator,
    )


def test_selector_returns_regression_evaluator():
    selector = EvaluatorSelector()

    evaluator = selector.select(
        ProblemType.REGRESSION
    )

    assert isinstance(
        evaluator,
        RegressionEvaluator,
    )


def test_selector_rejects_unsupported_problem_type():
    selector = EvaluatorSelector()

    with pytest.raises(
        ValueError,
        match="Unsupported problem type for evaluation",
    ):
        selector.select(
            ProblemType.CLUSTERING
        )