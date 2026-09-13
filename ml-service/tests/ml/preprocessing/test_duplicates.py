import pandas as pd

from app.ml.preprocessing.duplicates import DuplicateHandler


def test_remove_duplicates_removes_duplicate_rows():
    dataframe = pd.DataFrame(
        {
            "name": ["Alice", "Bob", "Alice"],
            "age": [25, 30, 25],
        }
    )

    handler = DuplicateHandler()

    result = handler.remove_duplicates(dataframe)

    expected = pd.DataFrame(
        {
            "name": ["Alice", "Bob"],
            "age": [25, 30],
        },
        index=[0, 1],
    )

    pd.testing.assert_frame_equal(result, expected)


def test_remove_duplicates_keeps_dataframe_without_duplicates_unchanged():
    dataframe = pd.DataFrame(
        {
            "name": ["Alice", "Bob", "Charlie"],
            "age": [25, 30, 35],
        }
    )

    handler = DuplicateHandler()

    result = handler.remove_duplicates(dataframe)

    pd.testing.assert_frame_equal(result, dataframe)


def test_remove_duplicates_keeps_one_row_when_all_rows_are_duplicates():
    dataframe = pd.DataFrame(
        {
            "name": ["Alice", "Alice", "Alice"],
            "age": [25, 25, 25],
        }
    )

    handler = DuplicateHandler()

    result = handler.remove_duplicates(dataframe)

    expected = pd.DataFrame(
        {
            "name": ["Alice"],
            "age": [25],
        },
        index=[0],
    )

    pd.testing.assert_frame_equal(result, expected)


def test_remove_duplicates_handles_empty_dataframe():
    dataframe = pd.DataFrame(
        {
            "name": pd.Series(dtype="object"),
            "age": pd.Series(dtype="int64"),
        }
    )

    handler = DuplicateHandler()

    result = handler.remove_duplicates(dataframe)

    pd.testing.assert_frame_equal(result, dataframe)