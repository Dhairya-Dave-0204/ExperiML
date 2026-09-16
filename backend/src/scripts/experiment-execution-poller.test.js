import experimentExecutionPollerService from "#services/experiment-execution-poller.service";

const EXECUTION_ID = "b734df86-97b3-4b6d-8723-f1767408ed84";

async function main() {
  console.log("Starting experiment execution polling test...\n");

  console.log("Execution ID:");
  console.log(EXECUTION_ID);

  await experimentExecutionPollerService.start(EXECUTION_ID);

  console.log("\nPolling completed.");
}

main().catch((error) => {
  console.error("\nPolling test failed.");
  console.error(error);
  process.exitCode = 1;
});
