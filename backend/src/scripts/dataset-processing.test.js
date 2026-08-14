import datasetProcessingService from "#infra-services/dataset-processing/dataset-processing.service";

const runProcessingTest = async () => {
  try {
    console.log("🚀 Starting dataset processing abstraction test...\n");

    const result = await datasetProcessingService.analyzeDataset({
      filePath: "./uploads/temp/sample-dataset.csv",

      datasetFormat: "CSV",
    });

    console.log("✅ Processing completed\n");

    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("❌ Dataset processing failed");

    console.error(error);

    process.exit(1);
  }
};

runProcessingTest();
