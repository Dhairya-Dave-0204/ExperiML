import { useMemo, useState } from "react";

import {
  FAQHero,
  FAQSearch,
  FAQCategoryTabs,
  FAQAccordion,
  FAQCTA,
} from "@/components/components.index";

import FAQ_DATA from "./faqMainLayoutData";

const TOTAL_QUESTIONS = FAQ_DATA.reduce(
  (sum, cat) => sum + cat.questions.length,
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

    const active =
      FAQ_DATA.find((category) => category.id === activeCategory) ??
      FAQ_DATA[0];
    return [{ ...active, showLabel: true }];
  }, [isSearching, searchQuery, activeCategory]);

  return (
    <>
      <FAQHero
        questionCount={TOTAL_QUESTIONS}
        categoryCount={FAQ_DATA.length}
      />

      <section className="py-16 border-t border-border md:py-24">
        <div className="container-custom">
          <div className="mb-8">
            <FAQSearch value={searchQuery} onChange={setSearchQuery} />
          </div>

          {!isSearching && (
            <div className="flex justify-center mb-8">
              <FAQCategoryTabs
                categories={FAQ_DATA}
                activeId={activeCategory}
                onSelect={setActiveCategory}
              />
            </div>
          )}

          <div className="max-w-3xl mx-auto">
            <FAQAccordion groups={groups} />
          </div>
        </div>
      </section>

      <FAQCTA />
    </>
  );
}

export default FaqMainLayout;
