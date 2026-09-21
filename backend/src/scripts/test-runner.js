import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const unitTests = [
  "prediction-validation.test.js",
  "prediction-service-storage.test.js",
  "prediction-service-checksum.test.js",
  "fastapi-prediction-execution.test.js",
  "prediction-execution-sync.test.js",
  "prediction-execution-poller.test.js",
  "storage.test.js",
  "storage-abstraction.test.js",
];

const integrationTests = [
  "test-prisma.test.js",
  "artifact-execution.test.js",
  "artifact-lifecycle.test.js",
  "dataset-processing.test.js",
  "experiment-artifact-sync.test.js",
  "experiment-execution-poller.test.js",
  "experiment-execution-sync.test.js",
  "fastapi-execution.test.js",
];

const testSuites = {
  unit: unitTests,
  integration: integrationTests,
  all: [...unitTests, ...integrationTests],
};

const suite = process.argv[2] || "unit";

if (!testSuites[suite]) {
  console.error(`Unknown test suite: "${suite}"`);
  console.error("Available suites: unit, integration, all");
  process.exit(1);
}

const tests = testSuites[suite];

const runTest = (testFile) => {
  return new Promise((resolve) => {
    const testPath = path.join(__dirname, testFile);

    console.log("\n" + "=".repeat(70));
    console.log(`Running: ${testFile}`);
    console.log("=".repeat(70) + "\n");

    const child = spawn(process.execPath, [testPath], {
      stdio: "inherit",
      env: process.env,
    });

    child.on("close", (code) => {
      resolve({
        testFile,
        passed: code === 0,
        code,
      });
    });

    child.on("error", (error) => {
      console.error(`Failed to start ${testFile}:`, error);

      resolve({
        testFile,
        passed: false,
        code: 1,
      });
    });
  });
};

const runSuite = async () => {
  console.log(`\nRunning ${suite} test suite...`);
  console.log(`Tests to run: ${tests.length}`);

  const results = [];

  for (const testFile of tests) {
    const result = await runTest(testFile);
    results.push(result);

    if (!result.passed) {
      console.error(`\n❌ Test failed: ${testFile}`);
      console.error("Stopping test suite.");
      break;
    }

    console.log(`\n✅ Test passed: ${testFile}`);
  }

  const passed = results.filter((result) => result.passed).length;
  const failed = results.filter((result) => !result.passed).length;

  console.log("\n" + "=".repeat(70));
  console.log(`${suite.toUpperCase()} TEST SUMMARY`);
  console.log("=".repeat(70));

  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total run: ${results.length}/${tests.length}`);

  if (failed > 0) {
    console.log("\n❌ Test suite failed.");
    process.exit(1);
  }

  console.log("\n🎉 Test suite passed successfully.");
};

runSuite().catch((error) => {
  console.error("\n❌ Test runner failed:");
  console.error(error);
  process.exit(1);
});
