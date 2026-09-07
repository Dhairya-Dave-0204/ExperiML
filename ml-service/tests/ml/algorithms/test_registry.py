from sklearn.linear_model import LogisticRegression

from app.ml.algorithms.registry import (
    AlgorithmRegistry,
    algorithm_registry,
)
from app.schemas.experiment import ProblemType


class FakeModel:
    def __init__(self, **kwargs):
        self.kwargs = kwargs


def test_register_and_create_algorithm():
    registry = AlgorithmRegistry()

    registry.register(
        problem_type=ProblemType.CLASSIFICATION,
        name="fake_model",
        factory=FakeModel,
    )

    model = registry.create(
        problem_type=ProblemType.CLASSIFICATION,
        name="fake_model",
        test_value=123,
    )

    assert isinstance(model, FakeModel)
    assert model.kwargs == {"test_value": 123}


def test_create_unknown_algorithm_raises_error():
    registry = AlgorithmRegistry()

    try:
        registry.create(
            problem_type=ProblemType.CLASSIFICATION,
            name="unknown",
        )
    except ValueError as error:
        assert "Algorithm not found" in str(error)
    else:
        raise AssertionError(
            "Expected ValueError for unknown algorithm"
        )


def test_duplicate_algorithm_registration_raises_error():
    registry = AlgorithmRegistry()

    registry.register(
        problem_type=ProblemType.CLASSIFICATION,
        name="fake_model",
        factory=FakeModel,
    )

    try:
        registry.register(
            problem_type=ProblemType.CLASSIFICATION,
            name="fake_model",
            factory=FakeModel,
        )
    except ValueError as error:
        assert "Algorithm already registered" in str(error)
    else:
        raise AssertionError(
            "Expected ValueError for duplicate algorithm"
        )


def test_unsupported_problem_type_raises_error():
    registry = AlgorithmRegistry()

    try:
        registry.create(
            problem_type=ProblemType.CLUSTERING,
            name="fake_model",
        )
    except ValueError as error:
        assert "Unsupported problem type" in str(error)
    else:
        raise AssertionError(
            "Expected ValueError for unsupported problem type"
        )


def test_global_registry_creates_logistic_regression():
    model = algorithm_registry.create(
        problem_type=ProblemType.CLASSIFICATION,
        name="logistic_regression",
    )

    assert isinstance(model, LogisticRegression)