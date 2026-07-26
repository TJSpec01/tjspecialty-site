/* Page content. Copy is carried over from the previous tjspecialty.com site. */

const site = require("./site");

const TESTIMONIALS = [
  {
    text:
      "We appreciate the wonderful job you did in building our house. You've been really great to work with. " +
      "We couldn't have asked for a better contractor. Thank you!",
    cite: "Rick & Donna C.",
  },
  {
    text: "Thank you very much for the fine job you did. We're very pleased. Your crew is to be commended.",
    cite: "Doreen E.",
  },
  {
    text:
      "I wanted to let you know what a positive experience my bathroom project was. The entire process was " +
      "incredibly simple. The workers were friendly and courteous. They did beautiful work. I'm so pleased with " +
      "how everything turned out. I'll be glad to recommend your company to others.",
    cite: "Leslie Z.",
  },
];

const SERVICE_CARDS = [
  {
    href: "new-home-construction",
    img: "card-newhome",
    title: "New Home Construction",
    text: "From the first consultation through move-in day, we build custom homes that stand the test of time.",
  },
  {
    href: "kitchens",
    img: "card-kitchens",
    title: "Kitchens",
    text: "The heart of every home — beauty and function, built around how you actually live.",
  },
  {
    href: "bathrooms",
    img: "card-bathrooms",
    title: "Bathrooms",
    text: "Grand master spa or compact powder room, the beauty is in the details.",
  },
  {
    href: "exteriors",
    img: "card-exteriors",
    title: "Exteriors",
    text: "Siding, roofing, windows, masonry and stone — lasting curb appeal and protection.",
  },
  {
    href: "decks-porches-patios",
    img: "card-decks",
    title: "Decks, Porches & Patios",
    text: "Extend your living space into the beauty and serenity of the outdoors.",
  },
  {
    href: "steel-frame-buildings",
    img: "card-steel",
    title: "Steel Frame Buildings",
    text: "Custom pre-engineered steel buildings — versatile, economical and built to last.",
  },
  {
    href: "commercial-spaces",
    img: "card-commercial",
    title: "Commercial Spaces",
    text: "New construction, remodeling and build-out for offices, hotels, churches and retail.",
  },
  {
    href: "fire-storm-flood-restoration",
    img: "card-restoration",
    title: "Fire, Storm & Water Damage Repair",
    text: "We work directly with your insurance company to put things right, fast.",
  },
];

const ESTIMATE_CTA = {
  type: "ctaBand",
  h2: "Ready to start your project?",
  text: "Contact us today for a free estimate. We'd love to hear what you have in mind.",
  buttons: [
    { label: "Get a Free Estimate", href: "contact-us" },
    { label: "Call " + site.phone, href: site.phoneHref },
  ],
};

/* ---------- shared form partials ---------- */

const formTop = (subject) => `<input type="hidden" name="_subject" value="${subject}">
      <input type="hidden" name="_template" value="table">
      <input type="hidden" name="_captcha" value="false">
      <input type="hidden" name="_next" data-path="../thank-you/" value="https://www.tjspecialty.com/thank-you/">
      <input type="text" name="_honey" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px" aria-hidden="true">`;

/* ==========================================================================
   Pages
   ========================================================================== */

module.exports = [
  /* ------------------------------------------------------------------ HOME */
  {
    slug: "",
    title: "TJ Specialty Construction | Custom Home Builder | Brainerd MN",
    description:
      "Custom residential and commercial design, building and remodeling contractor in the Brainerd Lakes area. " +
      "Custom home builder, kitchens, bathrooms and hand-crafted design-build remodeling. Family-owned since 1985.",
    ogImage: "hero-home",
    blocks: [
      {
        type: "hero",
        tall: true,
        img: "hero-home",
        kicker: site.license,
        h1: "Superior Construction Is Our Specialty.",
        sub:
          "Family-owned custom home builder and remodeling contractor serving the Brainerd Lakes area since 1985. " +
          "Quality craftsmanship, on schedule and on budget — without the surprises.",
        buttons: [
          { label: "Get a Free Estimate", href: "contact-us" },
          { label: "View Our Services", href: "services" },
        ],
      },
      {
        type: "stats",
        bg: "mist",
        items: [
          { n: "1985", l: "Family owned since" },
          { n: "40+", l: "Years of experience" },
          { n: "100%", l: "Turn-key service" },
          { n: "BC636178", l: "MN license no." },
        ],
      },
      {
        type: "cards",
        kicker: "What We Build",
        h2: "One contractor, start to finish",
        lede:
          "We're your one-stop source for complete, turn-key construction services — managed from the first " +
          "drawing to the final walkthrough.",
        items: SERVICE_CARDS,
      },
      {
        type: "split",
        bg: "mist",
        kicker: "About TJ Specialty",
        h2: "Experience, dedication and integrity",
        img: "about-team",
        media: "natural",
        alt: "The Kleinschmidt family — three generations of TJ Specialty Construction",
        html:
          "<p>TJ Specialty Construction has been family-owned and operated since 1985, when Jim Kleinschmidt " +
          "started the company with his wife, Sherry, and son, Kevin. What began as a small home-based business " +
          "has grown into a thriving company with several dedicated and talented employees.</p>" +
          "<p>In our experience, construction is made up of two processes: first, building your project, and " +
          "secondly, building relationships during the project. Our dedication to client satisfaction — and to " +
          "projects completed on schedule and on budget — explains why so many new customers come from referrals.</p>",
        button: { label: "Read Our Story", href: "about-us" },
      },
      {
        type: "features",
        kicker: "Our Commitment",
        h2: "Ultimately, our goal is to over-deliver",
        items: [
          { title: "A clean work site", text: "We keep an orderly, respectful job site from the first day to the last." },
          { title: "No budget surprises", text: "We stick to the budget. Nobody likes surprises." },
          { title: "Subs handled for you", text: "We manage and pay subcontractors, so you don't deal with the hassle." },
          { title: "Built to last", text: "Newest processes and materials for long-term satisfaction, value and savings." },
        ],
      },
      {
        type: "quotes",
        kicker: "Client Feedback",
        h2: "What our clients say",
        items: TESTIMONIALS,
      },
      {
        type: "logos",
        bg: "mist",
        kicker: "Proud Members",
        h2: "Associations & accreditations",
        items: [
          { img: "logo-mnba", alt: "Mid-Minnesota Builders Association" },
          { img: "logo-nahb", alt: "National Association of Home Builders" },
          { img: "logo-bam", alt: "Builders Association of Minnesota" },
        ],
      },
      ESTIMATE_CTA,
    ],
  },

  /* -------------------------------------------------------------- ABOUT US */
  {
    slug: "about-us",
    title: "About Us | TJ Specialty Construction, LLC | Brainerd, MN",
    description:
      "Quality, dedication and integrity are our core values — building projects and building relationships with " +
      "our clients, community and local builders. Over 35 years of experience in the Brainerd Lakes area.",
    ogImage: "about-hero",
    blocks: [
      {
        type: "hero",
        img: "about-hero",
        kicker: "About Us",
        h1: "Experience, Dedication and Integrity",
        sub: "Family-owned and operated in the Brainerd Lakes area since 1985.",
      },
      {
        type: "split",
        kicker: "Our Story",
        h2: "Three generations, one standard",
        img: "about-team",
        media: "natural",
        alt: "Jim, Jayme and Kevin Kleinschmidt of TJ Specialty Construction",
        html:
          "<p>TJ Specialty Construction has been family-owned and operated since 1985. Jim Kleinschmidt started " +
          "the company in 1985 with his wife, Sherry, and son, Kevin. What started as a small home-based business " +
          "has grown into a thriving company with several dedicated and talented employees.</p>" +
          "<p>We are proud members of the Mid-Minnesota Builders Association, the National Association of Home " +
          "Builders, and a Home Advisor Top-Rated Elite Service Provider.</p>" +
          "<p>TJ Specialty Construction is involved with our community by contributing to local charities, " +
          "sponsoring local events, and supporting local subcontractors and businesses.</p>" +
          "<p>Together, our team has constructed a wide variety of projects through the years, often hearing that " +
          "we have fulfilled our goal to exceed our clients' expectations.</p>",
      },
      {
        type: "prose",
        bg: "mist",
        kicker: "Our Approach",
        h2: "We build projects — and relationships",
        html:
          "<p>In our experience, construction is made up of two processes: first, building your project, and " +
          "secondly, building relationships during the project.</p>" +
          "<p>We recognize that whether you're building a custom home, a commercial building or undergoing a " +
          "remodeling project, it becomes a very personal thing. We work closely with you to ensure that you get " +
          "exactly what you want. Our dedication to client satisfaction, projects completed on schedule and on " +
          "budget explains why so many new customers are from referrals from past happy ones.</p>" +
          "<p>Outstanding service, quality craftsmanship, and attention to detail are the keys to our success. " +
          "Our projects stand the test of time.</p>",
      },
      {
        type: "features",
        kicker: "Our Commitment To You",
        h2: "Ultimately, our goal is to over-deliver",
        items: [
          { title: "A clean, orderly site", text: "We keep a clean and orderly work site throughout your project." },
          { title: "We stick to the budget", text: "Nobody likes surprises — so we don't create any." },
          { title: "Subcontractors managed", text: "We'll manage and pay subcontractors, so you don't have to deal with the hassle." },
          { title: "Modern methods", text: "We use the newest processes and materials for long-term satisfaction, value and savings." },
          { title: "Superior craftsmanship", text: "We offer superior quality craftsmanship on every project we take on." },
          { title: "Time and money saved", text: "Careful planning and coordination save you both." },
        ],
      },
      {
        type: "logos",
        kicker: "Proud Members",
        h2: "Associations & accreditations",
        items: [
          { img: "logo-mnba", alt: "Mid-Minnesota Builders Association" },
          { img: "logo-nahb", alt: "National Association of Home Builders" },
          { img: "logo-bam", alt: "Builders Association of Minnesota" },
        ],
      },
      ESTIMATE_CTA,
    ],
  },

  /* -------------------------------------------------------------- SERVICES */
  {
    slug: "services",
    title: "Services | TJ Specialty Construction | Brainerd, MN",
    description:
      "Complete turn-key construction services: new home construction, remodeling and additions, kitchens, " +
      "bathrooms, decks, steel frame buildings, commercial spaces and restoration in the Brainerd Lakes area.",
    ogImage: "services-hero",
    blocks: [
      {
        type: "hero",
        img: "services-hero",
        kicker: "Our Services",
        h1: "Turn-key, start to finish",
        sub:
          "We're your one-stop source for complete construction services that are completed on time and on " +
          "budget, without surprises.",
        buttons: [{ label: "Get a Free Estimate", href: "contact-us" }],
      },
      {
        type: "prose",
        html:
          "<p>We work closely with top-notch, reliable subcontractors in order to manage your entire project from " +
          "start to finish. We keep you informed each step of the way.</p>" +
          "<p>We will design, or work from your existing floor plans, to bring your vision to life. We pride " +
          "ourselves on being a specialty construction company, so when it comes to unique floor plans and ideas, " +
          "we have the expertise to meet your building expectations. Our job is not done until you are satisfied.</p>",
      },
      {
        type: "cards",
        bg: "mist",
        kicker: "Explore",
        h2: "What we build",
        items: SERVICE_CARDS,
      },
      {
        type: "prose",
        kicker: "Full Capability List",
        h2: "Our services include",
        html:
          "<ul>" +
          "<li>Commercial and residential new construction</li>" +
          "<li>Commercial and residential remodeling and additions</li>" +
          "<li>Kitchens and bathrooms</li>" +
          "<li>Screened porches, decks, patios, gazebos</li>" +
          "<li>Custom fireplaces</li>" +
          "<li>Custom tiling — floors, countertops, backsplashes, showers and more</li>" +
          "<li>Siding, soffit, fascia, windows and doors</li>" +
          "<li>Steel frame &amp; post frame buildings</li>" +
          "<li>Boat houses, workshops, garden sheds, outdoor kitchens and other specialty outbuildings</li>" +
          "<li>Home movie theaters</li>" +
          "<li>Handicap, ADA, and special needs renovations</li>" +
          "<li>Fire, storm and flood restoration</li>" +
          "<li>Integrating green, eco-conscious and energy-efficient building methods and materials</li>" +
          "</ul>",
      },
      ESTIMATE_CTA,
    ],
  },

  /* --------------------------------------------------- NEW HOME CONSTRUCTION */
  {
    slug: "new-home-construction",
    title: "New Home Construction | TJ Specialty Construction | Brainerd, MN",
    description:
      "Custom home builder in the Brainerd Lakes area. We're with you from initial consultation through move-in " +
      "day — working with your plans or creating a floor plan around your lifestyle and budget.",
    ogImage: "newhome-hero",
    blocks: [
      {
        type: "hero",
        img: "newhome-hero",
        kicker: "New Home Construction",
        h1: "Your new home.",
        sub:
          "Grand and expansive, quaint and cozy, or somewhere in between — you need a contractor that's going to " +
          "get it right.",
        buttons: [{ label: "Start Your Build", href: "contact-us" }],
      },
      {
        type: "prose",
        html:
          "<p>A person's home is likely one of the largest investments they'll ever make. We are there with you " +
          "from the initial consultation, through move-in day, and beyond. We will work with your building plans. " +
          "We can also incorporate your dreams, vision, and needs to create a floor plan that will work with your " +
          "lifestyle and budget.</p>" +
          "<p>Coordinating new construction can be overwhelming for homeowners. Not to worry — TJ Specialty " +
          "Construction is your one-stop, full-service contractor. We will guide you through the process of " +
          "selecting materials, appliances, and finishes. We use a network of top-notch local subcontractors to " +
          "offer you quality options, and keep your project on time and on budget.</p>" +
          "<p>If you are financing your home with a construction loan, TJ Specialty Construction works directly " +
          "with your financial institution and title company for seamless transactions. Effective communication is " +
          "key to the home building process. Our project managers will keep you updated during all phases of " +
          "construction, so there are no surprises.</p>" +
          "<p>We want your experience to be exciting, enjoyable and hassle-free. In the end, our goal is to build " +
          "you a home that will exceed your expectations, with quality craftsmanship that will stand the test of time.</p>",
      },
      {
        type: "gallery",
        bg: "mist",
        kicker: "Recent Work",
        h2: "New home projects",
        center: true,
        images: [
          { img: "newhome-1", alt: "Custom lakeside home exterior" },
          { img: "newhome-2", alt: "Craftsman-style custom home with stone detailing" },
          { img: "newhome-3", alt: "Open great room with stone fireplace and vaulted ceiling" },
          { img: "newhome-4", alt: "Custom staircase with painted millwork" },
          { img: "newhome-5", alt: "Custom mudroom with built-in lockers" },
          { img: "newhome-6", alt: "Finished lower-level rec room" },
        ],
      },
      ESTIMATE_CTA,
    ],
  },

  /* -------------------------------------------------------------- KITCHENS */
  {
    slug: "kitchens",
    title: "Kitchens | TJ Specialty Construction | Brainerd, MN",
    description:
      "Custom kitchen design and remodeling in the Brainerd Lakes area. Cabinetry, fixtures, appliances, " +
      "flooring, lighting and tile — one contractor managing the whole project.",
    ogImage: "kitchens-hero",
    blocks: [
      {
        type: "hero",
        img: "kitchens-hero",
        kicker: "Kitchens",
        h1: "The heart of every home",
        sub:
          "Our goal is to meld beauty and function to create a space that will serve you well for years to come.",
        buttons: [{ label: "Plan Your Kitchen", href: "contact-us" }],
      },
      {
        type: "prose",
        html:
          "<p>Whether you already have blueprints, or if you are looking for help to create your dream kitchen, we " +
          "will assist you through the process of selecting fixtures and finishes that reflect your personality " +
          "and tastes, as well as function with maximum efficiency.</p>" +
          "<p>Whether you're building new construction or remodeling an existing kitchen, we are your one-stop " +
          "contractor that will make the process enjoyable and stress-free. Fixtures, appliances, flooring, " +
          "cabinetry, paint, lighting, sound and technology all play a part in how your finished kitchen will come " +
          "together.</p>" +
          "<p>TJ Specialty Construction works closely with top-notch, trusted subcontractors to ensure that your " +
          "project stays on time and on budget. The end result is a kitchen that will be the heart of your home.</p>",
      },
      {
        type: "gallery",
        bg: "mist",
        kicker: "Recent Work",
        h2: "Kitchen projects",
        center: true,
        images: [
          { img: "kitchens-1", alt: "Custom kitchen with white cabinetry and island seating" },
          { img: "kitchens-2", alt: "Kitchen with navy island and pendant lighting" },
          { img: "kitchens-3", alt: "White kitchen with herringbone tile backsplash" },
          { img: "kitchens-4", alt: "Walk-in pantry with custom shelving" },
          { img: "kitchens-5", alt: "Built-in bar area with stone surround" },
          { img: "kitchens-6", alt: "Kitchen island with waterfall countertop" },
        ],
      },
      ESTIMATE_CTA,
    ],
  },

  /* ------------------------------------------------------------- BATHROOMS */
  {
    slug: "bathrooms",
    title: "Bathrooms | TJ Specialty Construction | Brainerd, MN",
    description:
      "Bathroom remodeling and new construction in the Brainerd Lakes area — master bath spas, powder rooms, " +
      "heated floors, steam showers, custom tile and expert plumbing coordination.",
    ogImage: "bathrooms-hero",
    blocks: [
      {
        type: "hero",
        img: "bathrooms-hero",
        kicker: "Bathrooms",
        h1: "Your personal oasis",
        sub:
          "Whether it's a grand master bath spa or a small powder room, when it comes to bathrooms the beauty is " +
          "in the details.",
        buttons: [{ label: "Plan Your Bathroom", href: "contact-us" }],
      },
      {
        type: "prose",
        html:
          "<p>There are many elements and components to consider when creating your ideal bathroom. Lighting, " +
          "storage, fixtures, and of course plumbing are critical, but each can also add an element of luxury. " +
          "Heated floors, towel bars, steam showers, jet tubs, multiple faucets or shower heads are examples of " +
          "ways that your bathroom can become a spa-like oasis.</p>" +
          "<p>However, equally important are correctly designed and installed ventilation, water flow, water " +
          "heating, electrical outlets and ease of access &amp; space requirements.</p>" +
          "<p>TJ Specialty Construction can help coordinate all of it with you. Whether we are working from your " +
          "existing plan, or if you are in need of our design expertise, we've got you covered. Bathroom " +
          "remodeling, or new construction, we are the contractor that will give you a unique bathroom that " +
          "pampers you every day.</p>",
      },
      {
        type: "gallery",
        bg: "mist",
        kicker: "Recent Work",
        h2: "Bathroom projects",
        center: true,
        images: [
          { img: "bathrooms-1", alt: "Master bathroom with freestanding tub and round mirror" },
          { img: "bathrooms-2", alt: "Master bathroom with tiled walk-in shower" },
          { img: "bathrooms-3", alt: "Guest bath with custom vanity" },
          { img: "bathrooms-4", alt: "Full bath with tile surround and glass enclosure" },
          { img: "bathrooms-5", alt: "Bathroom with soaking tub and patterned floor tile" },
          { img: "bathrooms-6", alt: "Laundry room with built-in cabinetry" },
        ],
      },
      ESTIMATE_CTA,
    ],
  },

  /* ------------------------------------------------------------- EXTERIORS */
  {
    slug: "exteriors",
    title: "Exteriors | TJ Specialty Construction | Brainerd, MN",
    description:
      "Siding, roofing, windows, soffit, fascia, gutters, exterior doors, masonry, stone, retaining walls, " +
      "sidewalks and driveways — lasting curb appeal for your home or business.",
    ogImage: "exteriors-hero",
    blocks: [
      {
        type: "hero",
        img: "exteriors-hero",
        kicker: "Exteriors",
        h1: "It's about curb appeal.",
        sub: "First impressions. Exteriors set the tone, and tell a story about your style.",
        buttons: [{ label: "Get a Free Estimate", href: "contact-us" }],
      },
      {
        type: "prose",
        html:
          "<p>Siding, roofing, windows, soffit, fascia, gutters, exterior doors, masonry, stone, retaining walls, " +
          "sidewalks and driveways all combine to create a beautiful and unique exterior look.</p>" +
          "<p>TJ Specialty Construction has access to endless options from a wide variety of trusted suppliers. " +
          "Lasting beauty and protection for your home are our main goals when it comes to the exterior of your " +
          "home or business.</p>" +
          "<p>Remodeling projects or additions to existing structures often require a fusion of old and new to " +
          "create a cohesive end result. You can trust us to source materials that meld together or match as " +
          "closely as possible with your existing finishes to create a look that you'll love.</p>",
      },
      {
        type: "gallery",
        bg: "mist",
        kicker: "Recent Work",
        h2: "Exterior projects",
        center: true,
        images: [
          { img: "exteriors-1", alt: "Craftsman home exterior with stone columns" },
          { img: "exteriors-2", alt: "Timber-framed entry with cedar accents" },
          { img: "exteriors-3", alt: "Lakeside home with wraparound deck" },
          { img: "exteriors-4", alt: "Two-storey home with mixed siding and stone" },
          { img: "exteriors-5", alt: "Custom garage with carriage-style doors" },
          { img: "exteriors-6", alt: "Modern lake home exterior" },
          { img: "exteriors-7", alt: "Wide exterior elevation of a custom build" },
          { img: "exteriors-8", alt: "New home exterior with covered porch" },
        ],
      },
      ESTIMATE_CTA,
    ],
  },

  /* ------------------------------------------------- DECKS PORCHES PATIOS */
  {
    slug: "decks-porches-patios",
    title: "Decks, Porches & Patios | TJ Specialty Construction | Brainerd, MN",
    description:
      "Custom decks, screened porches and patios in the Brainerd Lakes area. Traditional or composite materials " +
      "that extend your living space and add value to your home.",
    ogImage: "decks-hero",
    blocks: [
      {
        type: "hero",
        img: "decks-hero",
        kicker: "Decks, Porches & Patios",
        h1: "Fresh air",
        sub:
          "A well-designed and crafted deck, porch or patio can extend the square footage of your home to include " +
          "the beauty and serenity of the outdoors.",
        buttons: [{ label: "Get a Free Estimate", href: "contact-us" }],
      },
      {
        type: "prose",
        html:
          "<p>Entertain a crowd or enjoy your morning coffee in your favorite outdoor space. Traditional " +
          "materials, modern composite materials, or a combination of both can provide a space that will enhance " +
          "the beauty of your home, while adding value at the same time.</p>",
      },
      {
        type: "gallery",
        bg: "mist",
        kicker: "Recent Work",
        h2: "Outdoor living projects",
        center: true,
        images: [
          { img: "decks-1", alt: "Multi-level deck overlooking the lake" },
          { img: "decks-2", alt: "Composite deck with cable railing" },
          { img: "decks-3", alt: "Glass panel deck railing" },
          { img: "decks-4", alt: "Screened porch with vaulted wood ceiling" },
        ],
      },
      ESTIMATE_CTA,
    ],
  },

  /* -------------------------------------------------- STEEL FRAME BUILDINGS */
  {
    slug: "steel-frame-buildings",
    title: "Steel Frame Buildings | TJ Specialty Construction | Brainerd, MN",
    description:
      "Custom pre-engineered steel buildings — commercial, industrial, retail, worship, recreational, storage and " +
      "office. Engineered to your local building and environmental code requirements.",
    ogImage: "steel-hero",
    blocks: [
      {
        type: "hero",
        img: "steel-hero",
        kicker: "Steel Frame Buildings",
        h1: "Versatile, Economical, and Built to Last",
        sub:
          "Custom pre-engineered steel buildings save you time and money — large or small, from a commercial metal " +
          "building to a basic shop or utility structure.",
        buttons: [{ label: "Explore Your Options", href: "contact-us" }],
      },
      {
        type: "prose",
        html:
          "<p>Experienced designers will develop and produce the building that will meet your needs and your local " +
          "code requirements.</p>" +
          "<ul>" +
          "<li>The design of your unique building is engineered to your specific local building &amp; environmental code requirements.</li>" +
          "<li>Your pre-engineered steel building is pre-punched, pre-cut, pre-drilled, pre-welded, pre-fitted and prepared to be assembled at your location.</li>" +
          "<li>Each building is custom designed to meet your particular design, unique exterior colors, needs and wants.</li>" +
          "<li>Pre-engineered steel buildings are less labor intensive, saving you substantial construction costs.</li>" +
          "<li>Steel is the least expensive of all the available construction materials.</li>" +
          "<li>Steel is impervious to all types of weather elements and is fire-resistant.</li>" +
          "<li>Compared to other building construction, pre-engineered steel buildings will be up to 30% less to insure.</li>" +
          "<li>Many exterior options to make your steel building look like stone, brick or stucco, if desired.</li>" +
          "<li>Many unique doors, windows and other accessories are available to customize your building for your specific style and application.</li>" +
          "<li>Pre-engineered steel buildings are considered to be lifetime buildings; they require very low maintenance and upkeep.</li>" +
          "</ul>" +
          "<p>Commercial, industrial, community, retail, worship, recreational, storage, mini-storage, office, and " +
          "strip-mall style buildings are just a few of the possibilities that abound with pre-engineered steel " +
          "buildings.</p>",
      },
      {
        type: "gallery",
        bg: "mist",
        kicker: "Recent Work",
        h2: "Steel frame projects",
        center: true,
        images: [
          { img: "steel-1", alt: "Steel frame shop building with overhead doors" },
          { img: "steel-2", alt: "Commercial steel building exterior" },
          { img: "steel-3", alt: "Steel building interior with clear span" },
          { img: "steel-4", alt: "Utility steel building" },
          { img: "steel-5", alt: "Steel storage building" },
        ],
      },
      ESTIMATE_CTA,
    ],
  },

  /* ----------------------------------------------------- COMMERCIAL SPACES */
  {
    slug: "commercial-spaces",
    title: "Commercial Spaces | TJ Specialty Construction | Brainerd, MN",
    description:
      "Commercial new construction, remodeling and build-out for office buildings and suites, hotels, churches, " +
      "restaurants, banks, retailers and entertainment venues in the Brainerd Lakes area.",
    ogImage: "commercial-hero",
    blocks: [
      {
        type: "hero",
        img: "commercial-hero",
        kicker: "Commercial Spaces",
        h1: "Set up for success.",
        sub:
          "We understand that your commercial space is a reflection of your business — and that it has to work as " +
          "hard as you do.",
        buttons: [{ label: "Discuss Your Project", href: "contact-us" }],
      },
      {
        type: "prose",
        html:
          "<p>It must meet the demands of your clientele and workforce, while being energy- and space-efficient. " +
          "It should also convey a message about your brand or business culture.</p>" +
          "<p>TJ Specialty Construction provides new construction as well as remodeling and build-out services. " +
          "We've completed commercial spaces for a wide variety of businesses, including office buildings and " +
          "suites, hotels, churches, restaurants, banks, retailers, and entertainment venues. We offer several " +
          "options, ranging from post-frame, brick and mortar, ICF, to traditional stick-built construction.</p>" +
          "<p>You can trust TJ Specialty Construction to make the process a smooth, timely, and efficient " +
          "transition for your business. Contact us today to see how we can help take your commercial space to the " +
          "next level.</p>",
      },
      {
        type: "gallery",
        bg: "mist",
        kicker: "Recent Work",
        h2: "Commercial projects",
        center: true,
        images: [
          { img: "commercial-1", alt: "Commercial office building exterior" },
          { img: "commercial-2", alt: "Conference room with floor-to-ceiling glazing" },
          { img: "commercial-3", alt: "Modern commercial building facade" },
          { img: "commercial-4", alt: "Restaurant interior with booth seating" },
        ],
      },
      ESTIMATE_CTA,
    ],
  },

  /* --------------------------------------------------------- RESTORATION */
  {
    slug: "fire-storm-flood-restoration",
    title: "Fire, Storm & Water Damage Repair | TJ Specialty Construction | Brainerd, MN",
    description:
      "Fire, storm and water damage restoration in the Brainerd Lakes area. We work directly with your insurance " +
      "company to repair the damage and get you back into your home or business quickly.",
    ogImage: "restoration-hero",
    blocks: [
      {
        type: "hero",
        img: "restoration-hero",
        kicker: "Fire, Storm & Water Damage Repair",
        h1: "It's an upsetting sight.",
        sub: "A tree that smashed the roof. Fire damage. A wet basement. A leaking roof.",
        buttons: [
          { label: "Call " + site.phone, href: site.phoneHref },
          { label: "Contact Us", href: "contact-us" },
        ],
      },
      {
        type: "prose",
        html:
          "<p>The effects of damage to your home or business caused by these forces can cause mold and bacteria " +
          "growth, poor air quality, or leave you at risk of further property damage. It can be daunting to begin " +
          "the restoration process.</p>" +
          "<p>Rest easy, knowing that TJ Specialty Construction has your back. We have years of experience in this " +
          "area. We work directly with your insurance company to right the damage as quickly as possible.</p>" +
          "<p>Getting you back into your home, or back to business with quality repairs and restoration is our top " +
          "priority.</p>",
      },
      {
        type: "gallery",
        bg: "mist",
        kicker: "Restoration Work",
        h2: "Damage repair projects",
        center: true,
        images: [
          { img: "restoration-1", alt: "Storm-damaged roof awaiting repair" },
          { img: "restoration-2", alt: "Water-damaged lower level during restoration" },
        ],
      },
      ESTIMATE_CTA,
    ],
  },

  /* ------------------------------------------------------- KAVANAUGH PROJECT */
  {
    slug: "kavanaugh-project",
    title: "Kavanaugh Resort Project | TJ Specialty Construction | Brainerd, MN",
    description:
      "TJ Specialty Construction is building 23 units on Galway Lane at the Kavanaugh Resort — Galway on Sylvan " +
      "Lake, in one of the best resorts in the Brainerd Lakes Area.",
    ogImage: "kavanaugh-hero",
    blocks: [
      {
        type: "hero",
        img: "kavanaugh-hero",
        kicker: "Featured Project",
        h1: "Galway on Sylvan Lake",
        sub: "23 units on Galway Lane at the Kavanaugh Resort.",
        buttons: [{ label: "Enquire About a Unit", href: "contact-us" }],
      },
      {
        type: "prose",
        html:
          "<p>We are excited to announce that we are now building 23 units on Galway Lane in the Kavanaugh Resort. " +
          "We have partnered with some of the best in the business. Each unit comes standard with the design " +
          "services of Katie Kottke Interiors.</p>" +
          "<p>Check out the website for this development at " +
          '<a href="https://www.galwayonsylvan.com" rel="noopener">galwayonsylvan.com</a>. Units are moving fast, ' +
          "so don't miss out on this opportunity to be within one of the best resorts in the Brainerd Lakes Area.</p>",
      },
      {
        type: "gallery",
        bg: "mist",
        kicker: "The Development",
        h2: "Galway on Sylvan",
        center: true,
        images: [
          { img: "kavanaugh-1", alt: "Galway on Sylvan units under construction" },
          { img: "kavanaugh-2", alt: "Exterior rendering of a Galway on Sylvan unit" },
          { img: "kavanaugh-3", alt: "Rendering of the Galway on Sylvan development" },
          { img: "kavanaugh-4", alt: "Open-plan kitchen and living area" },
          { img: "kavanaugh-5", alt: "Interior finishes and lighting" },
          { img: "kavanaugh-6", alt: "Living room with fireplace" },
          { img: "kavanaugh-7", alt: "Site plan for Galway on Sylvan" },
        ],
      },
      ESTIMATE_CTA,
    ],
  },

  /* ------------------------------------------------------------- FINANCING */
  {
    slug: "financing",
    title: "Financing | TJ Specialty Construction | Brainerd, MN",
    description:
      "TJ Specialty Construction works with trusted lenders offering conventional construction loans and online " +
      "financing — solutions for every budget.",
    ogImage: "financing-hero",
    blocks: [
      {
        type: "hero",
        img: "financing-hero",
        kicker: "Financing",
        h1: "Options for every budget",
        sub: "TJ Specialty Construction is proud to recommend trusted lenders who work with you to make your dreams possible.",
        buttons: [{ label: "Ask About Financing", href: "contact-us" }],
      },
      {
        type: "prose",
        html:
          "<p>You have options. Whether it be a conventional construction loan, or online financing, we have the " +
          "resources to offer financing solutions for every budget. Just ask — we'll gladly point you toward a " +
          "lender that's right for you.</p>" +
          "<p>If you are financing your home with a construction loan, TJ Specialty Construction works directly " +
          "with your financial institution and title company for seamless transactions.</p>",
      },
      ESTIMATE_CTA,
    ],
  },

  /* --------------------------------------------------------------- CAREERS */
  {
    slug: "careers",
    title: "Careers | TJ Specialty Construction | Brainerd, MN",
    description:
      "Join a crew that will appreciate you. TJ Specialty Construction is hiring experienced carpenters and " +
      "foremen for steady, full-time, year-round work in the Brainerd Lakes area.",
    ogImage: "careers-hero",
    blocks: [
      {
        type: "hero",
        img: "careers-hero",
        kicker: "Careers",
        h1: "Join a crew that will appreciate you",
        sub:
          "Steady, full-time, year-round work in the Brainerd Lakes area — with competitive pay, real benefits and " +
          "room to advance.",
        buttons: [{ label: "Apply Now", href: "careers#apply" }],
      },
      {
        type: "cards",
        kicker: "Open Positions",
        h2: "Career opportunities",
        items: [
          {
            href: "carpenter",
            img: "card-newhome",
            title: "Carpenter",
            text: "Full-time, experienced carpenter. Framing and finish carpentry, $17–$35/hour plus a $1,000 hiring bonus.",
            more: "View position",
          },
          {
            href: "foreman",
            img: "card-exteriors",
            title: "Construction Crew Foreman",
            text: "Lead and manage crews of 4–6 carpenters on residential and light commercial projects.",
            more: "View position",
          },
        ],
      },
      {
        type: "raw",
        html: careersForm(),
      },
    ],
  },

  /* ------------------------------------------------------------- CARPENTER */
  {
    slug: "carpenter",
    title: "Carpenter | Careers | TJ Specialty Construction | Brainerd, MN",
    description:
      "Full-time experienced carpenter wanted in the Brainerd Lakes area. $17–$35/hour, $1,000 hiring bonus, " +
      "401K matching, vision and dental insurance, holiday, vacation and sick pay.",
    ogImage: "careers-hero",
    blocks: [
      {
        type: "hero",
        img: "careers-hero",
        kicker: "Now Hiring",
        h1: "Full-Time, Experienced Carpenter",
        sub: "Join a crew that will appreciate YOU.",
        buttons: [{ label: "Apply Now", href: "careers#apply" }],
      },
      {
        type: "prose",
        html:
          '<p class="lede">We are seeking experienced, motivated carpenters for our busy, well-established ' +
          "construction company. Join our fast-paced, positive work environment. Position includes framing and " +
          "finish carpentry for residential and light commercial new construction and remodeling.</p>" +
          "<h2>Benefits include</h2>" +
          "<ul>" +
          "<li>Very competitive hourly pay ($17&ndash;$35/hour)</li>" +
          "<li>$1,000.00 hiring bonus, plus incentive bonuses and opportunities for advancement</li>" +
          "<li>Steady, full-time, year-round work in the Brainerd Lakes area</li>" +
          "<li>Holiday, vacation, and sick pay</li>" +
          "<li>401K matching</li>" +
          "<li>Vision and dental insurance</li>" +
          "</ul>" +
          "<h2>Requirements for this position</h2>" +
          "<ul>" +
          "<li>A minimum of two years of proven, hands-on carpentry experience</li>" +
          "<li>Excellent understanding of carpentry techniques and methods of installation and construction</li>" +
          "<li>Tool belt and basic carpentry tools</li>" +
          "<li>Proficient in using electrical and manual equipment and measurement tools</li>" +
          "<li>Ability to read blueprints</li>" +
          "<li>Willingness to follow safety guidelines</li>" +
          "<li>Positive, cooperative attitude</li>" +
          "<li>Basic math and English skills</li>" +
          "<li>Good physical condition and endurance, with ability to lift and climb</li>" +
          "<li>Have valid driver's license and reliable transportation</li>" +
          "<li>Pass drug screening and criminal background check</li>" +
          "</ul>",
      },
      {
        type: "ctaBand",
        h2: "Ready to apply?",
        text: "Complete the online employment application — it takes about ten minutes.",
        buttons: [
          { label: "Apply Now", href: "careers#apply" },
          { label: "Call " + site.phone, href: site.phoneHref },
        ],
      },
    ],
  },

  /* --------------------------------------------------------------- FOREMAN */
  {
    slug: "foreman",
    title: "Construction Crew Foreman | Careers | TJ Specialty Construction | Brainerd, MN",
    description:
      "Experienced construction crew foreman wanted in the Brainerd Lakes area. Lead crews of 4–6 carpenters on " +
      "residential and light commercial new construction and remodeling.",
    ogImage: "careers-hero",
    blocks: [
      {
        type: "hero",
        img: "careers-hero",
        kicker: "Now Hiring",
        h1: "Construction Crew Foreman",
        sub: "Play a key role in our daily operations.",
        buttons: [{ label: "Apply Now", href: "careers#apply" }],
      },
      {
        type: "prose",
        html:
          '<p class="lede">We are seeking experienced, motivated foremen to lead and manage crews of 4&ndash;6 ' +
          "carpenters in framing and finish carpentry for residential and light commercial new construction and " +
          "remodeling.</p>" +
          "<h2>Benefits include</h2>" +
          "<ul>" +
          "<li>Very competitive pay</li>" +
          "<li>Hiring bonus, plus incentive bonuses and opportunities for advancement</li>" +
          "<li>Steady, full-time, year-round work in the Brainerd Lakes area</li>" +
          "<li>Holiday, vacation, and sick pay</li>" +
          "<li>Vision and dental insurance</li>" +
          "</ul>" +
          "<h2>Requirements for this position</h2>" +
          "<ul>" +
          "<li>At least 3 years experience managing a construction site and/or leading a construction crew</li>" +
          "<li>Working knowledge of all phases of residential and light commercial construction processes and procedures</li>" +
          "<li>Strong leadership qualities and high standard of integrity and reliability</li>" +
          "<li>Communicating with, and coordinating jobs with the project manager</li>" +
          "<li>Ensuring safety standards are met and enforced on the job site</li>" +
          "<li>Pass drug screening and criminal background check</li>" +
          "</ul>",
      },
      {
        type: "ctaBand",
        h2: "Ready to apply?",
        text: "Complete the online employment application — it takes about ten minutes.",
        buttons: [
          { label: "Apply Now", href: "careers#apply" },
          { label: "Call " + site.phone, href: site.phoneHref },
        ],
      },
    ],
  },

  /* ------------------------------------------------------------ CONTACT US */
  {
    slug: "contact-us",
    title: "Contact Us | TJ Specialty Construction | Brainerd, MN",
    description:
      "Get in touch for a free estimate. TJ Specialty Construction, 12803 Alfalfa Lane SW, Pillager, MN 56473. " +
      "Office 218-829-8024, info@tjspecialty.com.",
    ogImage: "contact-hero",
    blocks: [
      {
        type: "hero",
        img: "contact-hero",
        kicker: "Contact Us",
        h1: "Get in touch. Get a free estimate.",
        sub: "We'd love to hear from you.",
      },
      { type: "raw", html: contactSection() },
      {
        type: "prose",
        bg: "mist",
        wide: true,
        kicker: "Our Network",
        h2: "Valued suppliers, subcontractors and associates",
        html:
          "<ul>" +
          "<li>Vision Electrical Services &mdash; Electrician</li>" +
          "<li>Vision Technologies &mdash; Security systems, home automation, A/V systems</li>" +
          "<li>Superior Mechanical &mdash; HVAC</li>" +
          "<li>Marvin Windows</li>" +
          "<li>Andersen Windows</li>" +
          "<li>Logix ICF Foundations</li>" +
          "<li>GAF Roofing</li>" +
          "<li>James Hardie Siding</li>" +
          "<li>Gary's Painting</li>" +
          "<li>Gull Lake Glass</li>" +
          "</ul>",
      },
    ],
  },

  /* ---------------------------------------------------------- PRIVACY POLICY */
  {
    slug: "privacypolicy",
    title: "Privacy Policy | TJ Specialty Construction",
    description:
      "How TJ Specialty Construction collects, uses and protects the personal information you provide through our " +
      "website and SMS campaigns.",
    blocks: [
      {
        type: "prose",
        html:
          "<h1>TJ Specialty Construction Privacy Policy</h1>" +
          "<p><strong>Effective Date: 10/01/2024</strong></p>" +
          "<p>At TJ Specialty Construction, we value your privacy and are committed to protecting your personal " +
          "information. This Privacy Policy outlines how we collect, use, and protect the information you provide " +
          "to us, including through our website and SMS campaigns.</p>" +
          "<h2>1. Information We Collect</h2>" +
          "<p>We may collect the following types of personal information:</p>" +
          "<ul>" +
          "<li><strong>Contact Information:</strong> This includes your name, phone number, and email address, " +
          "which you provide when you fill out a contact form on our website or sign up for our SMS campaigns.</li>" +
          "<li><strong>SMS Opt-In Information:</strong> When you sign up to receive SMS messages from us, we " +
          "collect and store your phone number and your consent to receive such messages.</li>" +
          "</ul>" +
          "<h2>2. Use of Collected Information</h2>" +
          "<p>We use the information you provide for the following purposes:</p>" +
          "<ul>" +
          "<li>To respond to inquiries or requests made through our website or SMS system.</li>" +
          "<li>To send promotional and informational SMS messages to those who have opted in to receive such communications.</li>" +
          "</ul>" +
          "<h2>3. Data Sharing</h2>" +
          "<p>No mobile information will be shared with third parties/affiliates for marketing/promotional " +
          "purposes. All other categories exclude text messaging originator opt-in data and consent; this " +
          "information will not be shared with any third parties.</p>" +
          "<p>We do not share your personal information, including your phone number or SMS opt-in data, with " +
          "third-party providers for marketing or promotional purposes.</p>" +
          "<p>If we share other categories of data with third parties, we ensure that all categories exclude text " +
          "messaging opt-in data and consent. No mobile information collected through SMS campaigns will be shared " +
          "with third parties.</p>" +
          "<h2>4. Consent and Opt-Out</h2>" +
          "<p>By providing your phone number and opting into SMS messages, you consent to receiving text messages " +
          'from TJ Specialty Construction. You may opt out of receiving these messages at any time by replying ' +
          '"STOP" to any SMS message you receive from us.</p>' +
          "<h2>5. Security of Your Information</h2>" +
          "<p>We take reasonable measures to protect the personal information you provide to us from unauthorized " +
          "access, use, or disclosure. However, no internet or email transmission is completely secure, and we " +
          "cannot guarantee the security of your information.</p>" +
          "<h2>6. Changes to This Privacy Policy</h2>" +
          "<p>We may update this Privacy Policy from time to time to reflect changes in our practices or for other " +
          "operational, legal, or regulatory reasons. When we make changes, we will post the updated policy on our " +
          "website and update the effective date.</p>" +
          "<h2>7. Contact Us</h2>" +
          "<p>If you have any questions about this Privacy Policy or how we handle your personal information, " +
          "please contact us at:</p>" +
          `<p>Email: <a href="mailto:${site.email}">${site.email}</a><br>Phone: <a href="${site.phoneHref}">${site.phone}</a></p>`,
      },
    ],
  },

  /* ------------------------------------------------------------- THANK YOU */
  {
    slug: "thank-you",
    title: "Thank You | TJ Specialty Construction",
    description: "Thanks for getting in touch with TJ Specialty Construction. We'll be in contact shortly.",
    noindex: true,
    blocks: [
      {
        type: "prose",
        center: true,
        kicker: "Message Sent",
        h2: "Thanks for reaching out.",
        html:
          "<p>We've received your message and someone from our team will be in touch shortly. If your enquiry is " +
          `urgent, give us a call at <a href="${site.phoneHref}">${site.phone}</a>.</p>` +
          '<p><a class="btn btn--primary" href="../">Back to Home</a></p>',
      },
    ],
  },
];

/* ==========================================================================
   Larger raw blocks
   ========================================================================== */

function contactSection() {
  return `<section class="section">
      <div class="wrap">
        <div class="contact-grid">
          <div>
            <div class="section-head">
              <p class="kicker">Send a Message</p>
              <h2>Tell us about your project</h2>
            </div>

            <form action="${site.formAction}" method="POST">
              ${formTop("Website enquiry — tjspecialty.com")}

              <div class="field-row">
                <div class="field">
                  <label for="c-name">Name <span class="req">*</span></label>
                  <input id="c-name" name="Name" type="text" required autocomplete="name">
                </div>
                <div class="field">
                  <label for="c-phone">Phone <span class="req">*</span></label>
                  <input id="c-phone" name="Phone" type="tel" required autocomplete="tel">
                </div>
              </div>

              <div class="field">
                <label for="c-email">Email <span class="req">*</span></label>
                <input id="c-email" name="Email" type="email" required autocomplete="email">
              </div>

              <div class="field">
                <label for="c-type">Project type</label>
                <select id="c-type" name="Project type">
                  <option value="">Please select&hellip;</option>
                  ${site.services.map(([, label]) => `<option>${label}</option>`).join("\n                  ")}
                  <option>Other / not sure yet</option>
                </select>
              </div>

              <div class="field">
                <label for="c-message">How can we help? <span class="req">*</span></label>
                <textarea id="c-message" name="Message" required placeholder="Tell us a bit about what you have in mind, and when you'd like to start."></textarea>
              </div>

              <div class="btn-row">
                <button class="btn btn--primary" type="submit">Send Message</button>
              </div>

              <p class="form-note" style="margin-top:20px">
                By providing a telephone number and submitting this form you are consenting to be contacted by SMS
                text message. Message &amp; data rates may apply. You can reply STOP to opt out of further
                messaging. See our <a href="../privacypolicy/">Privacy Policy</a>.
              </p>
            </form>
          </div>

          <aside class="info-card">
            <h3>Contact details</h3>
            <ul class="info-list">
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .4 1.9.7 2.8a2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.3-1.2a2 2 0 012.1-.5c.9.3 1.8.6 2.8.7a2 2 0 011.7 2z"/></svg>
                <span><b>Office</b><a href="${site.phoneHref}">${site.phone}</a></span>
              </li>
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 4h16v6H4zM6 14h12v6H6zM6 2h12v2H6z"/></svg>
                <span><b>Fax</b>${site.fax}</span>
              </li>
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 4h16v16H4z"/><path d="M4 6l8 6 8-6"/></svg>
                <span><b>Email</b><a href="mailto:${site.email}">${site.email}</a></span>
              </li>
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span><b>Office address</b>${site.address.street}<br>${site.address.city}, ${site.address.state} ${site.address.zip}</span>
              </li>
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="9"/></svg>
                <span><b>License</b>${site.license}</span>
              </li>
            </ul>

            <div class="btn-row" style="margin-top:26px">
              <a class="btn btn--primary" href="${site.phoneHref}">Call ${site.phone}</a>
            </div>
          </aside>
        </div>
      </div>
    </section>`;
}

function careersForm() {
  const jobRefBlock = (n) => `<div class="form-block">
        <h3>Previous employer ${n}</h3>
        <div class="field-row">
          <div class="field"><label for="e${n}-co">Company</label><input id="e${n}-co" name="Employer ${n} — company" type="text"></div>
          <div class="field"><label for="e${n}-phone">Phone</label><input id="e${n}-phone" name="Employer ${n} — phone" type="tel"></div>
        </div>
        <div class="field-row">
          <div class="field"><label for="e${n}-title">Job title</label><input id="e${n}-title" name="Employer ${n} — job title" type="text"></div>
          <div class="field"><label for="e${n}-super">Supervisor</label><input id="e${n}-super" name="Employer ${n} — supervisor" type="text"></div>
        </div>
        <div class="field-row">
          <div class="field"><label for="e${n}-from">From</label><input id="e${n}-from" name="Employer ${n} — from" type="text" placeholder="MM/YYYY"></div>
          <div class="field"><label for="e${n}-to">To</label><input id="e${n}-to" name="Employer ${n} — to" type="text" placeholder="MM/YYYY"></div>
        </div>
        <div class="field">
          <label for="e${n}-reason">Reason for leaving</label>
          <input id="e${n}-reason" name="Employer ${n} — reason for leaving" type="text">
        </div>
        <div class="field">
          <label>May we contact this supervisor for a reference?</label>
          <div class="radio-row">
            <label><input type="radio" name="Employer ${n} — may contact" value="Yes"> Yes</label>
            <label><input type="radio" name="Employer ${n} — may contact" value="No"> No</label>
          </div>
        </div>
      </div>`;

  const referenceBlock = (n) => `<div class="field-row field-row--3">
          <div class="field"><label for="r${n}-name">Reference ${n} — name</label><input id="r${n}-name" name="Reference ${n} — name" type="text"></div>
          <div class="field"><label for="r${n}-rel">Relationship</label><input id="r${n}-rel" name="Reference ${n} — relationship" type="text"></div>
          <div class="field"><label for="r${n}-phone">Phone</label><input id="r${n}-phone" name="Reference ${n} — phone" type="tel"></div>
        </div>`;

  const yesNo = (id, label, required) => `<div class="field">
          <label>${label} ${required ? '<span class="req">*</span>' : ""}</label>
          <div class="radio-row">
            <label><input type="radio" name="${label}" value="Yes"${required ? " required" : ""}> Yes</label>
            <label><input type="radio" name="${label}" value="No"> No</label>
          </div>
        </div>`;

  return `<section class="section section--mist" id="apply">
      <div class="wrap-narrow">
        <div class="section-head">
          <p class="kicker">Online Employment Application</p>
          <h2>Apply to join the crew</h2>
          <p class="lede">Fields marked <span class="req">*</span> are required. Your application goes straight to
          our office — we'll be in touch.</p>
        </div>

        <form action="${site.formAction}" method="POST" enctype="multipart/form-data">
          ${formTop("Employment application — tjspecialty.com")}

          <div class="form-block">
            <h3>Position</h3>
            <div class="field">
              <label for="a-position">Position applying for <span class="req">*</span></label>
              <select id="a-position" name="Position applying for" required>
                <option value="">Please select&hellip;</option>
                <option>Carpenter</option>
                <option>Construction Crew Foreman</option>
                <option>Other</option>
              </select>
            </div>
            <div class="field-row">
              <div class="field"><label for="a-date">Date available</label><input id="a-date" name="Date available" type="date"></div>
              <div class="field"><label for="a-wage">Desired wage</label><input id="a-wage" name="Desired wage" type="text"></div>
            </div>
          </div>

          <div class="form-block">
            <h3>Applicant information</h3>
            <div class="field-row">
              <div class="field"><label for="a-first">First name <span class="req">*</span></label><input id="a-first" name="First name" type="text" required autocomplete="given-name"></div>
              <div class="field"><label for="a-last">Last name <span class="req">*</span></label><input id="a-last" name="Last name" type="text" required autocomplete="family-name"></div>
            </div>
            <div class="field"><label for="a-street">Street address</label><input id="a-street" name="Street address" type="text" autocomplete="street-address"></div>
            <div class="field-row field-row--3">
              <div class="field"><label for="a-city">City</label><input id="a-city" name="City" type="text" autocomplete="address-level2"></div>
              <div class="field"><label for="a-state">State</label><input id="a-state" name="State" type="text" autocomplete="address-level1"></div>
              <div class="field"><label for="a-zip">ZIP</label><input id="a-zip" name="ZIP" type="text" autocomplete="postal-code"></div>
            </div>
            <div class="field-row">
              <div class="field"><label for="a-phone">Phone <span class="req">*</span></label><input id="a-phone" name="Phone" type="tel" required autocomplete="tel"></div>
              <div class="field"><label for="a-email">Email <span class="req">*</span></label><input id="a-email" name="Email" type="email" required autocomplete="email"></div>
            </div>
          </div>

          <div class="form-block">
            <h3>Education</h3>
            <div class="field-row">
              <div class="field"><label for="a-hs">High school</label><input id="a-hs" name="High school" type="text"></div>
              <div class="field"><label for="a-hs-loc">Location</label><input id="a-hs-loc" name="High school location" type="text"></div>
            </div>
            ${yesNo("a-hs-grad", "Did you graduate high school?", true)}
            <div class="field-row">
              <div class="field"><label for="a-college">College / trade school</label><input id="a-college" name="College or trade school" type="text"></div>
              <div class="field"><label for="a-degree">Degree / certification</label><input id="a-degree" name="Degree or certification" type="text"></div>
            </div>
            ${yesNo("a-col-grad", "Did you graduate college or trade school?", false)}
          </div>

          <div class="form-block">
            <h3>Previous employment</h3>
            <p class="form-note" style="margin-top:-6px">Please list in chronological order, beginning with the most recent.</p>
          </div>
          ${jobRefBlock(1)}
          ${jobRefBlock(2)}
          ${jobRefBlock(3)}

          <div class="form-block">
            <h3>References</h3>
            <p class="form-note" style="margin:-6px 0 18px">Please list three professional references.</p>
            ${referenceBlock(1)}
            ${referenceBlock(2)}
            ${referenceBlock(3)}
          </div>

          <div class="form-block">
            <h3>Military service</h3>
            <div class="field-row">
              <div class="field"><label for="a-branch">Branch</label><input id="a-branch" name="Military branch" type="text"></div>
              <div class="field"><label for="a-rank">Rank at discharge</label><input id="a-rank" name="Rank at discharge" type="text"></div>
            </div>
            <div class="field"><label for="a-mil-notes">Type of discharge / notes</label><input id="a-mil-notes" name="Military notes" type="text"></div>
          </div>

          <div class="form-block">
            <h3>Background</h3>
            ${yesNo("a-cit", "Are you a citizen of the United States?", true)}
            ${yesNo("a-auth", "Are you authorized to work in the U.S.?", true)}
            ${yesNo("a-prev", "Have you ever worked for this company?", true)}
            ${yesNo("a-felony", "Have you ever been convicted of a felony?", true)}
            <div class="field">
              <label for="a-felony-detail">If yes, please explain</label>
              <input id="a-felony-detail" name="Felony explanation" type="text">
            </div>
          </div>

          <div class="form-block">
            <h3>Resume</h3>
            <div class="field">
              <label for="a-resume">Upload resume</label>
              <input id="a-resume" name="attachment" type="file" accept=".pdf,.doc,.docx,.rtf,.txt,.jpg,.png">
              <p class="field-hint">PDF or Word document. Max file size 15&nbsp;MB.</p>
            </div>
          </div>

          <div class="form-block">
            <h3>Verification and signature</h3>
            <p>I certify that my answers are true and complete to the best of my knowledge. If this application
            leads to employment, I understand that false or misleading information in my application or interview
            may result in my release.</p>
            <div class="field-row">
              <div class="field"><label for="a-sign">Signature (type your full name) <span class="req">*</span></label><input id="a-sign" name="Signature" type="text" required></div>
              <div class="field"><label for="a-sign-date">Date <span class="req">*</span></label><input id="a-sign-date" name="Signature date" type="date" required></div>
            </div>
          </div>

          <div class="btn-row">
            <button class="btn btn--primary" type="submit">Submit Application</button>
          </div>
        </form>
      </div>
    </section>`;
}
