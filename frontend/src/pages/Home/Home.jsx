import React from 'react'

import { Hero, Narrative, Capabilities, Reproducibility, ExperimentLineage } from "@/components/components.index"

function Home() {
  return (
    <>
      <Hero />
      <Narrative />
      <Capabilities />
      <Reproducibility />
      <ExperimentLineage />
    </>
  )
}

export default Home