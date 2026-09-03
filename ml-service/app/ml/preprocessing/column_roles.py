from dataclasses import dataclass

import pandas as pd


@dataclass
class ColumnRoles:
    target: str
    identifiers: list[str]
    datetime: list[str]
    features: list[str]


class ColumnRoleResolver:
    def resolve(
        self,
        dataframe: pd.DataFrame,
        target_column: str,
        identifier_columns: list[str] | None = None,
        datetime_columns: list[str] | None = None,
    ) -> ColumnRoles:
        identifier_columns = identifier_columns or []
        datetime_columns = datetime_columns or []

        self._validate_columns_exist(
            dataframe,
            target_column,
            identifier_columns,
            datetime_columns,
        )

        self._validate_no_role_conflicts(
            target_column,
            identifier_columns,
            datetime_columns,
        )

        excluded_columns = {
            target_column,
            *identifier_columns,
            *datetime_columns,
        }

        feature_columns = [
            column
            for column in dataframe.columns
            if column not in excluded_columns
        ]

        return ColumnRoles(
            target=target_column,
            identifiers=identifier_columns,
            datetime=datetime_columns,
            features=feature_columns,
        )

    def _validate_columns_exist(
        self,
        dataframe: pd.DataFrame,
        target_column: str,
        identifier_columns: list[str],
        datetime_columns: list[str],
    ) -> None:
        columns = set(dataframe.columns)

        requested_columns = {
            target_column,
            *identifier_columns,
            *datetime_columns,
        }

        missing_columns = requested_columns - columns

        if missing_columns:
            raise ValueError(
                f"Columns not found in dataframe: "
                f"{sorted(missing_columns)}"
            )

    def _validate_no_role_conflicts(
        self,
        target_column: str,
        identifier_columns: list[str],
        datetime_columns: list[str],
    ) -> None:
        identifier_set = set(identifier_columns)
        datetime_set = set(datetime_columns)

        if target_column in identifier_set:
            raise ValueError(
                "Target column cannot also be an identifier"
            )

        if target_column in datetime_set:
            raise ValueError(
                "Target column cannot also be a datetime column"
            )

        conflicts = identifier_set & datetime_set

        if conflicts:
            raise ValueError(
                "A column cannot be both an identifier "
                f"and a datetime column: {sorted(conflicts)}"
            )