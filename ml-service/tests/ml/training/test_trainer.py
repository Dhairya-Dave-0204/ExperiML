import pandas as pd
from sklearn.linear_model import LogisticRegression

from app.ml.training.trainer import ModelTrainer


def test_train_logistic_regression():
    X_train = pd.DataFrame(
        {
            "age": [20, 21, 22, 23, 24, 25],
            "income": [
                30000,
                32000,
                34000,
                36000,
                38000,
                40000,
            ],
        }
    )

    y_train = pd.Series(
        [0, 0, 0, 1, 1, 1]
    )

    model = LogisticRegression(
        max_iter=1000,
    )

    trainer = ModelTrainer()

    trained_model = trainer.train(
        model=model,
        X_train=X_train,
        y_train=y_train,
    )

    assert trained_model is model
    assert hasattr(trained_model, "coef_")
    assert hasattr(trained_model, "intercept_")
    assert hasattr(trained_model, "classes_")


def test_train_preserves_model_configuration():
    X_train = pd.DataFrame(
        {
            "feature": [1, 2, 3, 4, 5, 6],
        }
    )

    y_train = pd.Series(
        [0, 0, 0, 1, 1, 1]
    )

    model = LogisticRegression(
        C=0.5,
        max_iter=500,
    )

    trainer = ModelTrainer()

    trained_model = trainer.train(
        model=model,
        X_train=X_train,
        y_train=y_train,
    )

    assert trained_model.C == 0.5
    assert trained_model.max_iter == 500