import React from "react";

import DagNode from "./DagNode";
import { LINEAGE, LINEAGE_CONTENT } from "./lineageData";

function ExperimentLineage() {
  return (
    <section id="signature" className="section-padding bg-surface">
      <div className="container-custom">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <h2 className="text-4xl font-extrabold leading-tight font-heading text-text lg:text-5xl">
            {LINEAGE_CONTENT.title}
          </h2>

          <p className="mt-5 text-lg leading-8 text-text-secondary">
            {LINEAGE_CONTENT.description}
          </p>
        </div>

        {/* DAG */}
        <div className="relative px-4 py-10 overflow-x-auto border shadow-sm rounded-3xl border-border bg-surface md:px-8 md:py-14 lg:px-10 lg:py-20">
          {/* Background Pattern */}
          <div
            className="
              pointer-events-none
              absolute
              inset-0
              opacity-40
              bg-[radial-gradient(var(--color-border)_1px,transparent_1px)]
              bg-size-[24px_24px]
            "
          />

          <div className="relative z-10 flex flex-col items-center min-w-190">
            {/* Level 1 */}
            <div className="flex justify-center w-full gap-8">
              {LINEAGE.level1.map((node) => (
                <DagNode key={node.id} {...node} />
              ))}
            </div>

            {/* Vertical */}
            <div className="w-px h-8 my-2 bg-border" />

            {/* Level 2 */}
            <div className="flex justify-center w-full">
              {LINEAGE.level2.map((node) => (
                <DagNode key={node.id} {...node} />
              ))}
            </div>

            {/* Branch */}
            <div className="relative w-full h-8 max-w-120">
              <div className="absolute top-0 w-px h-4 -translate-x-1/2 left-1/2 bg-border" />
              <div className="absolute left-[10%] right-[10%] top-4 h-px bg-border" />
            </div>

            {/* Drops */}
            <div className="flex h-4 w-full max-w-120 justify-between px-[10%]">
              <div className="w-px bg-border" />
              <div className="w-px bg-border" />
              <div className="w-px bg-border" />
            </div>

            {/* Level 3 */}
            <div className="flex justify-center w-full gap-4 mt-2">
              {LINEAGE.level3.map((node) => (
                <DagNode key={node.id} {...node} />
              ))}
            </div>

            {/* Merge */}
            <div className="relative w-full h-8 max-w-120">
              <div className="absolute bottom-0 w-px h-4 -translate-x-1/2 left-1/2 bg-border" />
              <div className="absolute bottom-4 left-[10%] right-[10%] h-px bg-border" />
            </div>

            {/* Level 4 */}
            <div className="flex justify-center w-full">
              {LINEAGE.level4.map((node) => (
                <DagNode key={node.id} {...node} />
              ))}
            </div>

            {/* Vertical */}
            <div className="w-px h-8 my-2 bg-border" />

            {/* Level 5 */}
            <div className="flex justify-center w-full">
              {LINEAGE.level5.map((node) => (
                <DagNode key={node.id} {...node} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ExperimentLineage;
