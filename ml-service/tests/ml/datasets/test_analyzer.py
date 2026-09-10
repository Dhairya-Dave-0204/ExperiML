import pandas as pd

from app.ml.datasets.analyzer import DatasetAnalyzer
from app.schemas.experiment import DatasetFormat


def test_analyze_dataset():
    dataframe = pd.DataFrame(
        {
            "age": [21, 25, 21, None],
            "city": ["Ahmedabad", "Surat", "Ahmedabad", "Mumbai"],
            "salary": [30000, 40000, 30000, 50000],
        }
    )

    analyzer = DatasetAnalyzer()

    result = analyzer.analyze(
        dataframe=dataframe,
        dataset_format=DatasetFormat.CSV,
    )

    assert result.row_count == 4
    assert result.column_count == 3
    assert result.format == DatasetFormat.CSV

    assert result.duplicate_row_count == 1
    assert result.duplicate_row_percentage == 25.0

    assert len(result.columns) == 3

    age_analysis = next(
        column for column in result.columns
        if column.name == "age"
    )

    assert age_analysis.data_type == "float64"
    assert age_analysis.non_null_count == 3
    assert age_analysis.missing_count == 1
    assert age_analysis.missing_percentage == 25.0
    assert age_analysis.unique_count == 2


def test_analyze_duplicate_rows():
    dataframe = pd.DataFrame(
        {
            "name": ["A", "B", "A", "C"],
            "score": [10, 20, 10, 30],
        }
    )

    analyzer = DatasetAnalyzer()

    result = analyzer.analyze(
        dataframe=dataframe,
        dataset_format=DatasetFormat.CSV,
    )

    assert result.row_count == 4
    assert result.column_count == 2
    assert result.duplicate_row_count == 1
    assert result.duplicate_row_percentage == 25.0


def test_analyze_without_missing_values():
    dataframe = pd.DataFrame(
        {
            "age": [21, 25, 30],
            "city": ["Ahmedabad", "Surat", "Mumbai"],
        }
    )

    analyzer = DatasetAnalyzer()

    result = analyzer.analyze(
        dataframe=dataframe,
        dataset_format=DatasetFormat.XLSX,
    )

    assert result.format == DatasetFormat.XLSX

    for column in result.columns:
        assert column.missing_count == 0
        assert column.missing_percentage == 0.0


def test_analyze_empty_dataset():
    dataframe = pd.DataFrame(
        columns=["age", "city"]
    )

    analyzer = DatasetAnalyzer()

    result = analyzer.analyze(
        dataframe=dataframe,
        dataset_format=DatasetFormat.PARQUET,
    )

    assert result.row_count == 0
    assert result.column_count == 2
    assert result.duplicate_row_count == 0
    assert result.duplicate_row_percentage == 0.0

    for column in result.columns:
        assert column.missing_count == 0
        assert column.missing_percentage == 0.0


def test_analysis_does_not_modify_dataframe():
    dataframe = pd.DataFrame(
        {
            "age": [21, None, 30],
            "city": ["Ahmedabad", "Surat", "Mumbai"],
        }
    )

    original_dataframe = dataframe.copy(deep=True)

    analyzer = DatasetAnalyzer()

    analyzer.analyze(
        dataframe=dataframe,
        dataset_format=DatasetFormat.CSV,
    )

    pd.testing.assert_frame_equal(
        dataframe,
        original_dataframe,
    )