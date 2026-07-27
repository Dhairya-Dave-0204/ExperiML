import { useMemo, useState } from "react";

import {
  FaqHero,
  FaqSearch,
  FaqCategoryTabs,
  FaqAccordion,
  FaqCta,
} from "@/components/components.index";

import FAQ_DATA from "./faqMainLayoutData";

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

  return (
    <>
      <FaqHero
        questionCount={TOTAL_QUESTIONS}
        categoryCount={FAQ_DATA.length}
      />

      <section className="border-t border-border py-14 md:py-20">
        <div className="container-custom">
          {/* Search */}
          <div className="max-w-6xl mx-auto">
            <div className="p-6 border rounded-3xl border-border bg-surface md:p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold font-heading text-text">
                  Browse Questions
                </h2>

                <p className="mt-2 max-w-2xl text-[15px] leading-7 text-text-secondary">
                  Search the documentation or browse questions by category.
                  Everything is organized to help you find answers quickly.
                </p>
              </div>

              <FaqSearch value={searchQuery} onChange={setSearchQuery} />
            </div>
          </div>

          {/* Categories */}
          {!isSearching && (
            <div className="max-w-6xl mx-auto mt-10">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-xl font-semibold font-heading text-text">
                    Browse by Category
                  </h3>

                  <p className="mt-1 text-sm text-text-secondary">
                    Select a category to view its frequently asked questions.
                  </p>
                </div>
              </div>

              <FaqCategoryTabs
                categories={FAQ_DATA}
                activeId={activeCategory}
                onSelect={setActiveCategory}
              />
            </div>
          )}

          {/* Accordion */}
          <div className="max-w-6xl mx-auto mt-12">
            <FaqAccordion groups={groups} />
          </div>
        </div>
      </section>

      <FaqCta />
    </>
  );
}

export default FaqMainLayout;
