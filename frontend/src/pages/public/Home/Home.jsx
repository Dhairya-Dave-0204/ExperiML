import React from "react";

import {
  Hero,
  Narrative,
  Capabilities,
  Reproducibility,
  ExperimentLineage,
  Workspace,
  CTA
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
      <CTA />
    </>
  );
}

export default Home;
