from typing import Any

import pandas as pd
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
)


class ClassificationEvaluator:
    def evaluate(
        self,
        model: Any,
        X_test: Any,
        y_test: pd.Series,
    ) -> dict[str, Any]:
        predictions = model.predict(X_test)

        return {
            "accuracy": float(
                accuracy_score(
                    y_test,
                    predictions,
                )
            ),
            "precision": float(
                precision_score(
                    y_test,
                    predictions,
                    zero_division=0,
                )
            ),
            "recall": float(
                recall_score(
                    y_test,
                    predictions,
                    zero_division=0,
                )
            ),
            "f1": float(
                f1_score(
                    y_test,
                    predictions,
                    zero_division=0,
                )
            ),
            "confusion_matrix": (
                confusion_matrix(
                    y_test,
                    predictions,
                ).tolist()
            ),
            "classification_report": (
                classification_report(
                    y_test,
                    predictions,
                    output_dict=True,
                    zero_division=0,
                )
            ),
        }