import pandas as pd
import pytest

from app.ml.preprocessing.target import TargetHandler


@pytest.fixture
def target_handler():
    return TargetHandler()


def test_remove_missing_target(
    target_handler,
):
    features = pd.DataFrame(
        {
            "age": [22, 38, 26, 35],
            "fare": [7.25, 71.28, 7.92, 53.10],
        }
    )

    target = pd.Series(
        ["S", "C", None, "Q"],
        name="Embarked",
    )

    result = target_handler.remove_missing_target(
        features=features,
        target=target,
    )

    assert result.removed_row_count == 1
    assert len(result.features) == 3
    assert len(result.target) == 3

    assert result.target.tolist() == [
        "S",
        "C",
        "Q",
    ]

    assert result.features["age"].tolist() == [
        22,
        38,
        35,
    ]


def test_no_missing_target(
    target_handler,
):
    features = pd.DataFrame(
        {
            "age": [22, 38, 26],
            "fare": [7.25, 71.28, 7.92],
        }
    )

    target = pd.Series(
        ["S", "C", "Q"],
        name="Embarked",
    )

    result = target_handler.remove_missing_target(
        features=features,
        target=target,
    )

    assert result.removed_row_count == 0
    assert len(result.features) == 3
    assert len(result.target) == 3

    pd.testing.assert_frame_equal(
        result.features,
        features,
    )

    pd.testing.assert_series_equal(
        result.target,
        target,
    )


def test_all_targets_missing(
    target_handler,
):
    features = pd.DataFrame(
        {
            "age": [22, 38],
            "fare": [7.25, 71.28],
        }
    )

    target = pd.Series(
        [None, None],
        name="Embarked",
    )

    result = target_handler.remove_missing_target(
        features=features,
        target=target,
    )

    assert result.removed_row_count == 2
    assert result.features.empty
    assert result.target.empty


def test_mismatched_row_counts(
    target_handler,
):
    features = pd.DataFrame(
        {
            "age": [22, 38, 26],
        }
    )

    target = pd.Series(
        ["S", "C"],
        name="Embarked",
    )

    with pytest.raises(
        ValueError,
        match="Features and target must contain the same number of rows",
    ):
        target_handler.remove_missing_target(
            features=features,
            target=target,
        )


def test_empty_input(
    target_handler,
):
    features = pd.DataFrame(
        columns=["age"])

    target = pd.Series(
        dtype="object",
        name="Embarked",
    )

    with pytest.raises(
        ValueError,
        match="Features and target cannot be empty",
    ):
        target_handler.remove_missing_target(
            features=features,
            target=target,
        )