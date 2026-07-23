import React from "react";

import {
  Hero,
  Narrative,
  Capabilities,
  Reproducibility,
  ExperimentLineage,
  Workspace,
} from "@/components/components.index";

function Home() {
  return (
    <>
      <Hero />
      <Narrative />
      <Capabilities />
      <Reproducibility />
      <ExperimentLineage />
      <Workspace />
    </>
  );
}

export default Home;
