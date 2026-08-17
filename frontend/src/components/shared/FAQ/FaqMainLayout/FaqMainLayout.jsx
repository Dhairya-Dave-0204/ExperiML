import { useMemo, useState } from "react";
import { motion } from "framer-motion";

import {
  FaqHero,
  FaqSearch,
  FaqCategoryTabs,
  FaqAccordion,
  FaqCta,
} from "@/components/components.index";

import FAQ_DATA from "./faqMainLayoutData";

import {
  sectionReveal,
  fadeLeft,
  fadeRight,
  defaultViewport,
  sectionViewport,
} from "@/animations/animations.index";

const TOTAL_QUESTIONS = FAQ_DATA.reduce(
  (sum, category) => sum + category.questions.length,
  0,
);

function FaqMainLayout() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(FAQ_DATA[0].id);

  const isSearching = searchQuery.trim().length > 0;

  const groups = useMemo(() => {
    if (isSearching) {
      const query = searchQuery.trim().toLowerCase();

      return FAQ_DATA.map((category) => ({
        ...category,
        showLabel: true,
        questions: category.questions.filter(
          (item) =>
            item.q.toLowerCase().includes(query) ||
            item.a.toLowerCase().includes(query),
        ),
      })).filter((category) => category.questions.length > 0);
    }

    const activeCategoryData =
      FAQ_DATA.find((category) => category.id === activeCategory) ??
      FAQ_DATA[0];

    return [
      {
        ...activeCategoryData,
        showLabel: true,
      },
    ];
  }, [searchQuery, activeCategory, isSearching]);

  const resultCount = useMemo(
    () => groups.reduce((sum, group) => sum + group.questions.length, 0),
    [groups],
  );

  // Picking a category always exits search mode, so the sidebar selection
  // and the content pane never disagree about what's being shown.
  function handleSelectCategory(id) {
    setActiveCategory(id);
    setSearchQuery("");
  }

  return (
    <>
      <FaqHero
        questionCount={TOTAL_QUESTIONS}
        categoryCount={FAQ_DATA.length}
      />

      <motion.section
        className="border-t border-border py-14 md:py-20"
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={sectionViewport}
      >
        <div className="container-custom">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr] lg:gap-10 xl:grid-cols-[320px_1fr]">
            {/* Sidebar: search + category navigation, sticky on desktop */}
            <motion.aside
              variants={fadeLeft}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              className="lg:sticky lg:top-24 lg:self-start"
            >
              <div className="p-4 border rounded-2xl border-border bg-surface sm:p-5">
                <FaqSearch value={searchQuery} onChange={setSearchQuery} />

                <div className="hidden h-px mt-4 mb-3 bg-border lg:block" />

                <p className="hidden mb-3 text-xs font-semibold tracking-wider uppercase text-text-secondary lg:block">
                  Categories
                </p>

                <div className="mt-3 lg:mt-0">
                  <FaqCategoryTabs
                    categories={FAQ_DATA}
                    activeId={isSearching ? null : activeCategory}
                    onSelect={handleSelectCategory}
                  />
                </div>
              </div>
            </motion.aside>

            {/* Content pane */}
            <motion.div
              variants={fadeRight}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              className="min-w-0"
            >
              {isSearching && (
                <p className="mb-6 text-sm text-text-secondary">
                  {resultCount} {resultCount === 1 ? "result" : "results"} for{" "}
                  <span className="font-semibold text-text">
                    &ldquo;{searchQuery}&rdquo;
                  </span>
                </p>
              )}

              <FaqAccordion
                groups={groups}
                isSearching={isSearching}
                searchQuery={searchQuery}
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      <FaqCta />
    </>
  );
}

export default FaqMainLayout;
