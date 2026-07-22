import React from 'react'

import { Hero, Narrative, Capabilities, Reproducibility } from "@/components/components.index"

function Home() {
  return (
    <>
      <Hero />
      <Narrative />
      <Capabilities />
      <Reproducibility />
    </>
  )
}

export default Home