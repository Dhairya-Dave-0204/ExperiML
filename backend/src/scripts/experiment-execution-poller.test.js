import experimentExecutionPollerService from "#services/experiment-execution-poller.service";

const EXECUTION_ID = "8e9331d2-fb6a-4a5a-b752-881f6de30d03";

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
