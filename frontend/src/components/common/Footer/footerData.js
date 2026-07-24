import { ROUTES } from "@/constants/routes"

export const FOOTER_CONTENT = {
  description:
    "The disciplined experiment management platform for data scientists and ML engineers.",

  copyright: "© 2026 ExperiML.",

  status: "All systems operational",
};

export const FOOTER_LINK_GROUPS = [
  {
    id: "platform",
    title: "Platform",
    links: [
      {
        id: "Home",
        label: "Home",
        href: ROUTES.HOME,
      },
      {
        id: "About",
        label: "About",
        href: ROUTES.ABOUT,
      },
      {
        id: "Contact",
        label: "Contact",
        href: ROUTES.CONTACT,
      },
      {
        id: "FAQ",
        label: "FAQ",
        href: ROUTES.FAQ,
      },
    ],
  },

  {
    id: "resources",
    title: "Resources",
    links: [
      {
        id: "Documentation",
        label: "Documentation",
        href: ROUTES.DOCS,
      },
      {
        id: "Data",
        label: "Data Policies",
        href: ROUTES.DATA_POLICY,
      },
      {
        id: "Privacy",
        label: "Privacy Policies",
        href: ROUTES.PRIVACY_POLICY,
      },
      {
        id: "Cookie",
        label: "Cookies Policies",
        href: ROUTES.COOKIE_POLICY,
      },
    ],
  },
];
