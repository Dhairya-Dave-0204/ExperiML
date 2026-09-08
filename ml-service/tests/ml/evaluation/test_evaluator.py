from app.ml.evaluation.classification import (
    ClassificationEvaluator,
)
from app.ml.evaluation.evaluator import EvaluatorSelector
from app.schemas.experiment import ProblemType


def test_select_classification_evaluator():
    selector = EvaluatorSelector()

    evaluator = selector.select(
        ProblemType.CLASSIFICATION
    )

    assert isinstance(
        evaluator,
        ClassificationEvaluator,
    )


def test_select_unsupported_problem_type_raises_error():
    selector = EvaluatorSelector()

    try:
        selector.select(
            ProblemType.REGRESSION
        )
    except ValueError as error:
        assert "Unsupported problem type for evaluation" in str(
            error
        )
    else:
        raise AssertionError(
            "Expected ValueError for unsupported problem type"
        )