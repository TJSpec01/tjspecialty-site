/* Site-wide configuration: business details, navigation, form endpoint. */

module.exports = {
  name: "TJ Specialty Construction, LLC",
  shortName: "TJ Specialty Construction",
  domain: "https://www.tjspecialty.com",
  license: "MN License No. BC636178",
  phone: "218-829-8024",
  phoneHref: "tel:+12188298024",
  fax: "218-270-2368",
  email: "info@tjspecialty.com",
  address: {
    street: "12803 Alfalfa Lane SW",
    city: "Pillager",
    state: "MN",
    zip: "56473",
  },
  facebook: "https://www.facebook.com/tjspecialty",
  founded: 1985,

  /* FormSubmit.co endpoint — see README for activation + swapping in the
     hashed endpoint so the address is not exposed in the markup. */
  formAction: "https://formsubmit.co/info@tjspecialty.com",

  services: [
    ["new-home-construction", "New Home Construction"],
    ["kitchens", "Kitchens"],
    ["bathrooms", "Bathrooms"],
    ["exteriors", "Exteriors"],
    ["decks-porches-patios", "Decks, Porches & Patios"],
    ["steel-frame-buildings", "Steel Frame Buildings"],
    ["commercial-spaces", "Commercial Spaces"],
    ["fire-storm-flood-restoration", "Fire, Storm & Water Damage Repair"],
  ],

  nav: [
    { label: "Home", slug: "" },
    { label: "About", slug: "about-us" },
    {
      label: "Services",
      slug: "services",
      children: [
        ["services", "All Services"],
        ["new-home-construction", "New Home Construction"],
        ["kitchens", "Kitchens"],
        ["bathrooms", "Bathrooms"],
        ["exteriors", "Exteriors"],
        ["decks-porches-patios", "Decks, Porches & Patios"],
        ["steel-frame-buildings", "Steel Frame Buildings"],
        ["commercial-spaces", "Commercial Spaces"],
        ["fire-storm-flood-restoration", "Fire, Storm & Water Damage Repair"],
      ],
    },
    { label: "Projects", slug: "kavanaugh-project" },
    { label: "Financing", slug: "financing" },
    { label: "Careers", slug: "careers" },
    { label: "Contact", slug: "contact-us" },
  ],
};
