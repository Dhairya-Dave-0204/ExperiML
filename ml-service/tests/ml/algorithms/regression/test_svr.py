from sklearn.svm import SVR

from app.ml.algorithms.regression.svr import (
    create_svr,
)


def test_create_svr():
    model = create_svr()

    assert isinstance(model, SVR)


def test_create_svr_with_hyperparameters():
    model = create_svr(
        C=2.0,
        kernel="linear",
        epsilon=0.2,
    )

    assert isinstance(model, SVR)
    assert model.C == 2.0
    assert model.kernel == "linear"
    assert model.epsilon == 0.2