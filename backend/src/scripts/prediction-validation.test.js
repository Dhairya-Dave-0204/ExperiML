import assert from "assert";
import { createPredictionSchema } from "#prediction/prediction.validation";
import { PREDICTION_TYPE } from "#prediction/prediction.constants";

const run = () => {
  // SINGLE should be accepted
  const singleResult = createPredictionSchema.safeParse({
    name: "Test Prediction",
    predictionType: PREDICTION_TYPE.SINGLE,
  });

  assert.strictEqual(singleResult.success, true);
  assert.strictEqual(singleResult.data.predictionType, PREDICTION_TYPE.SINGLE);

  // predictionType should default to SINGLE
  const defaultResult = createPredictionSchema.safeParse({
    name: "Default Prediction",
  });

  assert.strictEqual(defaultResult.success, true);
  assert.strictEqual(defaultResult.data.predictionType, PREDICTION_TYPE.SINGLE);

  // BATCH should be rejected in V1
  const batchResult = createPredictionSchema.safeParse({
    name: "Batch Prediction",
    predictionType: PREDICTION_TYPE.BATCH,
  });

  assert.strictEqual(batchResult.success, false);

  // Empty name should still be rejected
  const emptyNameResult = createPredictionSchema.safeParse({
    name: "",
    predictionType: PREDICTION_TYPE.SINGLE,
  });

  assert.strictEqual(emptyNameResult.success, false);

  console.log("Prediction validation tests passed.");
};

run();
