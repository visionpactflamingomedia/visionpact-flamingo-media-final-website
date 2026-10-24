export type ServiceOffer = [
  name: string,
  price: number,
  unit: string,
  scope: string,
];
export type ServiceCategory = {
  name: string;
  short: string;
  detail: string;
  tags: string[];
  offers: ServiceOffer[];
};
export const services: ServiceCategory[] = [
  {
    name: "Branding & Graphic Design",
    short: "Build recognition, one touchpoint at a time.",
    detail:
      "A consistent visual identity across your everyday content and your biggest campaigns. We design social media posts for LinkedIn, Instagram, Facebook and X, alongside logos, posters, banners, brochures, flyers and ad creatives.",
    offers: [
      [
        "Logo & visual identity",
        7999,
        "project",
        "One logo direction, colour palette and type pairing.",
      ],
      [
        "Social media post design",
        799,
        "design",
        "One static creative in one platform size; supplied copy.",
      ],
      [
        "Posters, banners & flyers",
        1199,
        "design",
        "One single-sided layout; print-ready or digital export.",
      ],
      [
        "Brochure design",
        3999,
        "project",
        "Up to four pages with supplied text and images.",
      ],
      [
        "Branding, copywriting & content creation",
        2999,
        "brief",
        "One brand messaging sheet with tagline and a 300-word introduction.",
      ],
    ],
    tags: [
      "Logo & visual identity",
      "Social media post design",
      "Posters, banners & flyers",
      "Brochure design",
      "Branding, copywriting & content creation",
    ],
  },
  {
    name: "Social Media & Digital Marketing",
    short: "Stay consistent. Reach the right people.",
    detail:
      "Content planning and account management for LinkedIn, Instagram, Facebook and Twitter/X, with audience engagement and growth strategies. Campaign support spans Google Ads, Meta Ads, LinkedIn Ads and Amazon Ads; LinkedIn lead generation starts with a focused audience and message.",
    offers: [
      [
        "Social media account management",
        11999,
        "month",
        "One platform: eight static posts, captions, scheduling and monthly summary.",
      ],
      [
        "LinkedIn management & lead generation",
        14999,
        "month",
        "Eight posts, profile upkeep and a targeted lead-generation plan; outreach volume scoped separately.",
      ],
      [
        "Instagram management & content planning",
        11999,
        "month",
        "Eight feed posts, captions, scheduling and a content calendar for one account.",
      ],
      [
        "Twitter/X management & audience engagement",
        8999,
        "month",
        "Twelve short posts and up to two hours of community engagement per month.",
      ],
      [
        "Google / Meta / LinkedIn / Amazon Ads",
        12999,
        "month",
        "Management of one platform, one campaign and up to two ad groups. Ad spend and creatives excluded.",
      ],
      [
        "Content & growth strategy",
        4999,
        "plan",
        "One audience review and a 30-day content plan for one platform.",
      ],
    ],
    tags: [
      "Social media account management",
      "LinkedIn management & lead generation",
      "Instagram management & content planning",
      "Twitter/X management & audience engagement",
      "Google / Meta / LinkedIn / Amazon Ads",
      "Content & growth strategy",
    ],
  },
  {
    name: "Websites & Digital Experiences",
    short: "Make your next click count.",
    detail:
      "Every type of website your business needs: business and corporate sites, landing pages, portfolios, e-commerce stores, dashboards and admin panels, blogs, booking, education, real estate, restaurant and event websites. From structure and visual design to development, we build fast, responsive sites that make your message clear, plus redesigns and ongoing maintenance.",
    offers: [
      [
        "Landing page design & development",
        23000,
        "project",
        "One responsive page with up to six sections and one inquiry form.",
      ],
      [
        "Business website design & development",
        28000,
        "project",
        "Up to five responsive pages, one inquiry form and basic page metadata.",
      ],
      [
        "Portfolio website",
        23000,
        "project",
        "One responsive portfolio page with up to six work entries.",
      ],
      [
        "AI dashboard & admin panel",
        50000,
        "project",
        "A responsive web dashboard with secure login, up to five data views, charts, tables and AI summaries of your data; data integrations scoped separately.",
      ],
      [
        "E-commerce website",
        45000,
        "project",
        "Online store with up to 25 products, cart, checkout and one payment-gateway integration; gateway fees separate.",
      ],
      [
        "Blog & news website",
        32000,
        "project",
        "Home, listing and article templates with categories, search and an easy content editor.",
      ],
      [
        "Booking & appointment website",
        36000,
        "project",
        "Service pages with an online booking calendar and confirmation emails for one location.",
      ],
      [
        "Educational & course website",
        50000,
        "project",
        "Course pages, student login and up to 10 lessons with video embeds; course payments scoped separately.",
      ],
      [
        "Real estate & listing website",
        40000,
        "project",
        "Property or listing pages with filters, image galleries and an inquiry form per listing.",
      ],
      [
        "Restaurant & hotel website",
        30000,
        "project",
        "Up to five pages with menu or rooms, gallery, location map and a reservation inquiry form.",
      ],
      [
        "NGO & event website",
        25000,
        "project",
        "Up to five pages for a cause or event, with registration or donation-link section.",
      ],
      [
        "Website redesign",
        26000,
        "project",
        "Refresh of up to five existing pages with a modern layout, better speed and mobile experience.",
      ],
      [
        "Website maintenance & support",
        3999,
        "month",
        "Updates, backups, security checks and up to two hours of content changes per month.",
      ],
    ],
    tags: [
      "Landing page design & development",
      "Business website design & development",
      "Portfolio website",
      "AI dashboard & admin panel",
      "E-commerce website",
      "Blog & news website",
      "Booking & appointment website",
      "Educational & course website",
      "Real estate & listing website",
      "Restaurant & hotel website",
      "NGO & event website",
      "Website redesign",
      "Website maintenance & support",
    ],
  },
  {
    name: "Business Platforms & Apps",
    short: "Tools that help the business run better.",
    detail:
      "We plan and build practical company-management platforms and mobile apps around your team's daily work. Start with a focused MVP for operations, customer management, inventory, bookings or internal workflows; integrations, hosting and app-store costs are scoped separately.",
    offers: [
      [
        "Business management platform (MVP)",
        60000,
        "project",
        "A responsive admin dashboard with up to three agreed modules and basic user roles.",
      ],
      [
        "Business mobile app (MVP)",
        199999,
        "project",
        "A cross-platform app prototype/build with up to five core screens and one main workflow.",
      ],
      [
        "App UI/UX design",
        24999,
        "project",
        "User flows and polished designs for up to five mobile app screens.",
      ],
    ],
    tags: [
      "Business management platforms",
      "Business mobile apps",
      "App UI/UX design",
    ],
  },
  {
    name: "Video Editing & Motion",
    short: "Make every frame earn its place.",
    detail:
      "Video editing for Reels, Shorts, YouTube and promotional videos. We shape supplied footage into a clear story with considered pacing, sound, captions and channel-ready exports.",
    offers: [
      [
        "Reels & Shorts editing",
        2499,
        "video",
        "One edit up to 60 seconds from up to 10 minutes of supplied footage.",
      ],
      [
        "YouTube video editing",
        5999,
        "video",
        "One edit up to 10 minutes from up to 45 minutes of supplied footage.",
      ],
      [
        "Promotional video",
        9999,
        "video",
        "One edit up to 90 seconds, using supplied footage and a simple motion treatment.",
      ],
    ],
    tags: [
      "Reels & Shorts editing",
      "YouTube video editing",
      "Promotional video",
    ],
  },
  {
    name: "Resumes & Personal Branding",
    short: "Present your experience with confidence.",
    detail:
      "Professional resume, CV, cover letter and portfolio design, with LinkedIn profile optimisation and personal branding. We help make your strengths easy to understand without adding experience or achievements you have not earned.",
    offers: [
      [
        "Resume & CV design",
        1499,
        "document",
        "Up to two pages, editable file and PDF; based on your supplied career information.",
      ],
      [
        "Cover letter",
        799,
        "letter",
        "One tailored letter, up to one page, for a supplied role description.",
      ],
      [
        "LinkedIn profile optimisation",
        2999,
        "profile",
        "Headline, About section and suggested experience edits for one profile.",
      ],
      [
        "Personal portfolio design",
        3999,
        "document",
        "Up to eight presentation or PDF pages using supplied work and copy.",
      ],
    ],
    tags: [
      "Resume & CV design",
      "Cover letter",
      "LinkedIn profile optimisation",
      "Personal portfolio design",
    ],
  },
  {
    name: "Invitations & Celebration Design",
    short: "A thoughtful start to a special occasion.",
    detail:
      "Wedding invitations, digital marriage cards, birthday cards, event invitations and celebration designs. Choose a beautifully crafted static invitation or an animated story to share with your guests.",
    offers: [
      [
        "Wedding invitation & digital marriage card",
        1499,
        "design",
        "One static invitation, up to two sides, in one language.",
      ],
      [
        "Animated wedding invitation",
        3999,
        "video",
        "One animated digital invitation up to 30 seconds in one language.",
      ],
      [
        "Birthday cards & event invitations",
        999,
        "design",
        "One static birthday, event or celebration invitation in one size.",
      ],
    ],
    tags: [
      "Wedding invitation & digital marriage card",
      "Animated wedding invitation",
      "Birthday cards & event invitations",
    ],
  },
  {
    name: "AI-Powered Creative Production",
    short: "Explore more. Keep the craft.",
    detail:
      "AI-centric social posts and advertising creatives, AI-generated videos, reels, animations and product promotions. We also create avatars, digital presenters and talking-head videos, voiceovers, dubbing, transcription, subtitles, enhanced images and e-commerce mockups, with human review before delivery.",
    offers: [
      [
        "AI social posts & advertising creatives",
        999,
        "creative",
        "One AI-assisted visual with a finished static layout and supplied copy.",
      ],
      [
        "AI videos, reels & product promotions",
        5999,
        "video",
        "One video concept up to 20 seconds; simple generated scenes and edit.",
      ],
      [
        "AI avatars & digital presenters",
        4999,
        "video",
        "One talking-head video up to 60 seconds using an authorised avatar and supplied script.",
      ],
      [
        "AI voiceovers & dubbing",
        1499,
        "minute",
        "Up to one finished minute in one language from an approved script and authorised voice.",
      ],
      [
        "Transcription & subtitles",
        999,
        "batch",
        "Up to 10 minutes of clear audio, transcript and one-language subtitle file.",
      ],
      [
        "AI image generation & enhancement",
        999,
        "image",
        "One final image: generation, enhancement or background replacement.",
      ],
      [
        "AI product photography & e-commerce mockups",
        3999,
        "set",
        "Three product visuals using supplied product references; one visual direction.",
      ],
      [
        "AI-assisted blogs, captions & ad copy",
        1499,
        "brief",
        "One article up to 500 words or five captions or three ad-copy variations.",
      ],
      [
        "AI training materials & presentations",
        5999,
        "project",
        "Up to 10 slides, using your approved source material.",
      ],
      [
        "AI explainer videos",
        9999,
        "video",
        "Up to 60 seconds with supplied script, simple visuals and one voiceover.",
      ],
    ],
    tags: [
      "AI social posts & advertising creatives",
      "AI videos, reels & product promotions",
      "AI avatars & digital presenters",
      "AI voiceovers & dubbing",
      "Transcription & subtitles",
      "AI image generation & enhancement",
      "AI product photography & e-commerce mockups",
      "AI-assisted blogs, captions & ad copy",
      "AI training materials & presentations",
      "AI explainer videos",
    ],
  },
  {
    name: "AI Websites, Automation & Consultation",
    short: "Useful intelligence, built around your work.",
    detail:
      "AI-powered websites, customer-support assistants, website chatbots and smart web experiences. We develop custom prompts and workflow automation, and offer AI-based content strategies, marketing insights and consultation for businesses, creators and personal brands.",
    offers: [
      [
        "Website chatbot & customer-support assistant",
        24999,
        "setup",
        "One website FAQ assistant using up to 20 approved pages; no CRM integration.",
      ],
      [
        "AI-powered website experience",
        55000,
        "project",
        "One landing page with one scoped AI text interaction; usage fees separate.",
      ],
      [
        "Custom AI prompts",
        3999,
        "pack",
        "Five reusable prompts for one agreed business workflow, with usage notes.",
      ],
      [
        "Workflow automation",
        12999,
        "workflow",
        "One trigger and up to three actions across two supported tools; subscriptions excluded.",
      ],
      [
        "AI content strategy & marketing insights",
        6999,
        "review",
        "One review of supplied content and data with a prioritised recommendations document.",
      ],
      [
        "AI consultation",
        2999,
        "session",
        "One 60-minute session for a business, creator or personal brand.",
      ],
    ],
    tags: [
      "Website chatbot & customer-support assistant",
      "AI-powered website experience",
      "Custom AI prompts",
      "Workflow automation",
      "AI content strategy & marketing insights",
      "AI consultation",
    ],
  },
];
// Packages on the Pricing page. The service-request API also uses this list to
// look up the starting price of a package chosen there.
export const packages = [
  {
    name: "Brand essentials",
    label: "A confident first impression",
    price: 12999,
    unit: "one-time project",
    description: "A focused identity kit for a new business or personal brand.",
    items: [
      "One logo direction + colour and type sheet",
      "Five static social creatives in one size",
      "Two rounds of consolidated revisions",
      "Editable design files + final exports",
    ],
    note: "Copy and brand brief supplied by you. Additional logo directions are quoted separately.",
  },
  {
    name: "Social studio",
    label: "For consistent content",
    price: 19999,
    unit: "per month",
    description: "A considered mix of content to keep your brand showing up.",
    items: [
      "12 static posts + four reels up to 30 seconds",
      "Captions + one monthly content calendar",
      "Scheduling to Instagram and Facebook",
      "One revision round per asset + monthly summary",
    ],
    note: "Reels use your supplied footage. Community management, shoots and ad spend are separate.",
  },
  {
    name: "Website launch",
    label: "Your next digital chapter",
    price: 23000,
    unit: "one-time project",
    description: "A clear, responsive website built around your business.",
    items: [
      "Landing page, portfolio or business website",
      "Mobile layouts + basic SEO metadata",
      "Inquiry form + WhatsApp button",
      "Two rounds of consolidated revisions",
    ],
    note: "From ₹23,000 for a one-page website. Bigger sites and online stores go up to ₹50,000; AI dashboards and platforms are ₹50,000–60,000.",
    // Linked from the package card: every website type with its price.
    details: "/pricing/website-launch",
  },
];
// Brief details for each website type and platform on /pricing/website-launch.
// Keys must match an offer name above; the price and unit always come from
// that offer. Timelines are typical, not guaranteed:
// the quote confirms the schedule once the brief and content are ready.
export type WebsiteTypeDetail = {
  title: string;
  bestFor: string;
  includes: string[];
  timeline: string;
};
export const websiteTypeDetails: Record<string, WebsiteTypeDetail> = {
  "Landing page design & development": {
    title: "Landing page",
    bestFor: "Ad campaigns, product launches, events and single offers",
    includes: [
      "One page with up to six sections",
      "Inquiry form and WhatsApp button",
      "Mobile layout and basic SEO tags",
      "Fast-loading, compressed images",
    ],
    timeline: "5–7 working days",
  },
  "Portfolio website": {
    title: "Portfolio website",
    bestFor: "Photographers, designers, freelancers and job seekers",
    includes: [
      "One page with up to six work entries",
      "About, skills and contact sections",
      "Image gallery that opens full screen",
      "Mobile layout and basic SEO tags",
    ],
    timeline: "5–7 working days",
  },
  "NGO & event website": {
    title: "NGO & event website",
    bestFor: "Charities, community groups and event organisers",
    includes: [
      "Up to five pages for a cause or event",
      "Registration or donation-link section",
      "Event schedule or impact stories",
      "Mobile layout and basic SEO tags",
    ],
    timeline: "About 2 weeks",
  },
  "Blog & news website": {
    title: "Blog & news website",
    bestFor: "Writers, publishers, schools and companies sharing updates",
    includes: [
      "Home, listing and article templates",
      "Categories, tags and search",
      "Easy editor to publish posts yourself",
      "Share previews for every article",
    ],
    timeline: "2–3 weeks",
  },
  "Restaurant & hotel website": {
    title: "Restaurant & hotel website",
    bestFor: "Restaurants, cafés, hotels and homestays",
    includes: [
      "Up to five pages with menu or rooms",
      "Photo gallery and Google Maps location",
      "Reservation inquiry form",
      "Call and WhatsApp buttons",
    ],
    timeline: "2–3 weeks",
  },
  "Website redesign": {
    title: "Website redesign",
    bestFor: "Businesses whose current website looks dated or loads slowly",
    includes: [
      "Up to five existing pages redesigned",
      "Faster loading and a better mobile layout",
      "Your existing content moved across",
      "Old page links redirected to the new ones",
    ],
    timeline: "2–3 weeks",
  },
  "Business website design & development": {
    title: "Business website",
    bestFor: "Shops, clinics, consultants and local service businesses",
    includes: [
      "Up to five pages: Home, About, Services, Gallery, Contact",
      "Inquiry form, Google Maps and WhatsApp button",
      "Mobile layouts and basic SEO for every page",
      "Source handover and 14 days of bug fixes",
    ],
    timeline: "2–3 weeks",
  },
  "Booking & appointment website": {
    title: "Booking & appointment website",
    bestFor: "Clinics, salons, coaches, studios and consultants",
    includes: [
      "Service pages with prices",
      "Online booking calendar for one location",
      "Confirmation emails to you and the customer",
      "Online payment for bookings quoted separately",
    ],
    timeline: "3–4 weeks",
  },
  "Real estate & listing website": {
    title: "Real estate & listing website",
    bestFor: "Builders, brokers and listing businesses",
    includes: [
      "Property or listing pages with photo galleries",
      "Filters by location, price and type",
      "Inquiry form on every listing",
      "Easy editor to add or update listings",
    ],
    timeline: "3–4 weeks",
  },
  "E-commerce website": {
    title: "E-commerce website",
    bestFor: "D2C brands, retailers and home businesses selling online",
    includes: [
      "Up to 25 products with categories",
      "Cart, checkout and one payment gateway",
      "Order emails and a simple product admin",
      "Payment-gateway fees paid separately",
    ],
    timeline: "3–5 weeks",
  },
  "Educational & course website": {
    title: "Educational & course website",
    bestFor: "Coaching institutes, trainers and course creators",
    includes: [
      "Course pages and student login",
      "Up to 10 lessons with video embeds",
      "Enrolment inquiry form",
      "Course payments quoted separately",
    ],
    timeline: "4–6 weeks",
  },
  "AI dashboard & admin panel": {
    title: "AI dashboard & admin panel",
    bestFor: "Teams that track sales, stock, leads or operations",
    includes: [
      "Secure login with user roles",
      "Up to five data views with charts and tables",
      "AI summaries that explain what changed in your numbers",
      "Connections to other software quoted separately",
    ],
    timeline: "4–6 weeks",
  },
  "AI-powered website experience": {
    title: "AI-powered website",
    bestFor: "Brands that want visitors to ask, search or get suggestions",
    includes: [
      "A landing page designed around one AI feature",
      "AI answers, search or product suggestions from your content",
      "Usage limits and a fallback when the AI is unsure",
      "AI usage fees billed by the provider, separately",
    ],
    timeline: "4–5 weeks",
  },
  "Business management platform (MVP)": {
    title: "Business management platform",
    bestFor: "Companies replacing spreadsheets and WhatsApp follow-ups",
    includes: [
      "Up to three modules: CRM, HR, inventory or bookings",
      "Logins and roles for owners, managers and staff",
      "Reports and data export",
      "An AI assistant for one workflow quoted separately",
    ],
    timeline: "6–8 weeks",
  },
  "Website maintenance & support": {
    title: "Website maintenance & support",
    bestFor: "Any website that needs regular care after launch",
    includes: [
      "Software updates and backups",
      "Security and uptime checks",
      "Up to two hours of content changes a month",
    ],
    timeline: "Monthly",
  },
};
// Shown together as "AI dashboards & platforms" on /pricing/website-launch,
// in this order; every other website offer is listed as a website type.
export const platformOffers = [
  "AI dashboard & admin panel",
  "AI-powered website experience",
  "Business management platform (MVP)",
];
export const websiteIncluded = [
  "Design that works on phones, tablets and desktops",
  "Basic SEO: page titles, descriptions and share previews",
  "Contact or inquiry form that reaches your inbox",
  "Help connecting your domain and setting up SSL",
  "A walkthrough of how to update the site",
];
export const websiteSeparate = [
  "Domain name, usually ₹800–1,500 a year",
  "Hosting and business email",
  "Payment-gateway charges and paid plugins",
  "Copywriting and photography, unless added to the quote",
];
export const websiteFaqs = [
  [
    "Which type of website do I need?",
    "If you run ads or sell one offer, a landing page is enough. Most local businesses that explain several services need the five-page business website, which is the Website launch package. Choose an online store, booking site or course site when you need payments, logins or bookings, and an AI dashboard or platform when your team needs to manage data every day.",
  ],
  [
    "Is the price fixed?",
    "The price shown is the starting price for the scope on each card. We confirm a fixed price, schedule and deliverables in your quote before work begins. Extra pages, languages or features are quoted up front, never added later without your approval.",
  ],
  [
    "Can I update the website myself?",
    "Yes. You receive the source and a walkthrough. Blog, listing and store websites include an editor for posts, listings or products. If you prefer us to handle changes, the maintenance plan covers them every month.",
  ],
  [
    "Are domain and hosting included?",
    "No. They are bought in your name so you always own them. We help you choose a plan and connect everything.",
  ],
] as const;
// Starting price of a package or service chosen on the Pricing page, which
// arrives as "Name — from ₹… / unit". The longest matching name wins, so a
// name that is the start of another (e.g. "Logo" and "Logo design") can't
// shadow it. Returns null for a custom quote or an unknown selection.
export function priceForSelection(selection: string) {
  let best: { name: string; price: number; unit: string } | null = null;
  const candidates = [
    ...packages.map(({ name, price, unit }) => ({ name, price, unit })),
    ...services.flatMap((s) => s.offers.map(([name, price, unit]) => ({ name, price, unit }))),
  ];
  for (const c of candidates)
    if (selection.startsWith(c.name) && (!best || c.name.length > best.name.length)) best = c;
  return best;
}
// Studio contact details, used on the contact page, in the footer and for
// inquiry emails. The LinkedIn and Instagram URLs are the studio's real profiles.
export const contact = {
  email: "visionpactflamingomedia@gmail.com",
  phones: [
    { label: "+91 76890 03646", href: "tel:+917689003646" },
    { label: "+91 96361 70333", href: "tel:+919636170333" },
  ],
  linkedin: "https://www.linkedin.com/in/visionpact-flamingo-media-3a99b1440/",
  instagram: "https://www.instagram.com/visionpact.digital",
};
// Brands shown in the "Trusted by" logo strips. Edit this list to match the
// companies you have worked with; each name needs a matching logo in
// app/client-logos.tsx. Leave it empty (`[] as const`) and the home page shows
// a moving line of the platforms you work on instead.
export const clients = [
  "Google",
  "Amazon",
  "Microsoft",
  "Meta",
  "Netflix",
  "Adobe",
  "Spotify",
  "Flipkart",
  "Zomato",
  "Swiggy",
] as const;
export type Client = (typeof clients)[number];
export const steps = [
  {
    title: "Discover",
    line: "First, we listen.",
    body: "We get clear on your audience, business goals and the problem the work needs to solve.",
    output: "A shared brief and clear goals",
    tags: ["Your brief", "Audience", "Direction"],
  },
  {
    title: "Define",
    line: "Find the right idea.",
    body: "We turn the brief into a creative direction, a focused scope and a shared plan for delivery.",
    output: "Creative direction, scope and plan",
    tags: ["Positioning", "Creative routes", "Scope"],
  },
  {
    title: "Create",
    line: "Make it unmistakable.",
    body: "Design, content and development come together. You see the thinking and the work as it takes shape.",
    output: "Work in progress you can review",
    tags: ["Design", "Content", "Build"],
  },
  {
    title: "Refine",
    line: "The details make it.",
    body: "We use feedback to sharpen the message, refine the experience and check the final deliverables.",
    output: "Polished, checked deliverables",
    tags: ["Feedback", "Quality review", "Final checks"],
  },
  {
    title: "Launch",
    line: "Ready for the real world.",
    body: "Your approved assets are prepared for their intended channels, with a clear handover and agreed next steps.",
    output: "Final files, handover and next steps",
    tags: ["Delivery", "Handover", "Next steps"],
  },
];
// Process page: what clients provide, and common questions. Answers restate
// the scope rules already shown on the Pricing page and in the website terms.
export const clientNeeds = [
  "Your goals, audience and what success looks like",
  "Brand assets you already have: logo, colours, fonts",
  "Text, images or footage the work should include",
  "One point of contact to approve each stage",
  "Feedback collected into one list per revision round",
];
// Pricing page questions (also published as FAQ structured data).
export const pricingFaqs = [
  [
    "What is included in a starting rate?",
    "The scope listed beside each service and one round of consolidated revisions, unless a package specifies otherwise. Additional concepts, formats, languages and revisions are scoped separately. Project timing is agreed after the brief and materials are ready.",
  ],
  [
    "Are ads, hosting and AI subscriptions included?",
    "Ad spend, printing, shoots, stock licenses, domain and hosting charges, and third-party software or AI usage fees are separate. Taxes, if applicable, will be stated in your quote. There is no checkout or automatic payment on this website.",
  ],
  [
    "Can you combine services or tailor a package?",
    "Yes. Tell us your goals, channels and required deliverables. We will scope the combination before confirming a price. Marketing support does not promise a fixed number of leads, followers, sales or job offers.",
  ],
] as const;
export const processFaqs = [
  [
    "How long does a project take?",
    "It depends on the scope. Timing is agreed once the brief and materials are ready, and you get a schedule before any work begins.",
  ],
  [
    "How many revisions are included?",
    "Individual services include one round of consolidated revisions. Packages state their own rounds; Brand essentials and Website launch include two. Extra rounds are scoped separately.",
  ],
  [
    "Do you use AI in the process?",
    "Yes, to explore ideas and speed up production. A person reviews every output for accuracy, originality and brand fit before anything is delivered.",
  ],
  [
    "What do I receive at the end?",
    "Final exports for the agreed channels, plus editable source files where your scope includes them. Website projects include a source handover and 14 days of bug fixes.",
  ],
  [
    "Does sending an inquiry commit me to anything?",
    "No. An inquiry is free and creates no agreement or payment. Scope, fees, schedule and usage rights are confirmed separately before work starts.",
  ],
] as const;
export type Concept = {
  title: string;
  type: "Branding" | "Digital" | "AI & Motion";
  label: string;
  // Either a picture, or a live HTML/CSS visual drawn in app/concept-visuals.tsx.
  image: string | null;
  visual?: "interaction" | "presenter" | "brandboard" | "dashboard";
  desc: string;
  // Three short points shown under the card image.
  highlights: string[];
  tags: string[];
};
export const concepts: Concept[] = [
  {
    title: "Form / Field",
    type: "Branding",
    label: "An identity system, carried across social.",
    image: "/images/dm-social-brand-kit.webp",
    desc: "A self-initiated social brand-kit concept showing how a consistent identity can move across profiles, posts and campaign assets.",
    highlights: [
      "Identity system & monogram",
      "Social grid and story templates",
      "Print and stationery set",
    ],
    tags: ["Visual identity", "Art direction", "Print design"],
  },
  {
    title: "Campaign, in motion",
    type: "AI & Motion",
    label: "One idea, ready for every screen.",
    image: "/images/dm-video-campaign.webp",
    desc: "A self-initiated video-campaign editing concept for preparing branded launch content across social channels.",
    highlights: [
      "One edit, resized to four formats",
      "Auto captions with the brand kit",
      "Launch-ready for every channel",
    ],
    tags: ["Video production", "Campaign editing", "Multichannel content"],
  },
  {
    title: "Make your next move",
    type: "Digital",
    label: "An interactive typographic experiment.",
    image: null,
    visual: "interaction",
    desc: "A self-initiated digital interaction study built for this website. Responsive typography and subtle movement explore how a simple call to action can become a memorable moment.",
    highlights: [
      "Responsive type that scales",
      "Micro-interactions on hover",
      "Built for speed and accessibility",
    ],
    tags: ["Interaction design", "Responsive UI", "Frontend development"],
  },
  {
    title: "Pulse dashboard",
    type: "Digital",
    label: "A sales dashboard a busy team can read at a glance.",
    image: null,
    visual: "dashboard",
    desc: "A self-initiated admin dashboard concept: secure login, headline numbers, sales trends and a live order list, laid out so the important figures stand out on a laptop or a phone.",
    highlights: [
      "KPI cards and trend charts",
      "Responsive admin layout",
      "Order list with clear status labels",
    ],
    tags: ["Dashboard UI", "Data visualisation", "Web app design"],
  },
  {
    title: "One voice, every language",
    type: "AI & Motion",
    label: "An AI presenter, dubbed for every audience.",
    image: null,
    visual: "presenter",
    desc: "A self-initiated AI presenter concept: one approved script becomes a talking-head video, then is dubbed, lip-synced and subtitled in English, Hindi, Spanish and French. Every version is reviewed by a person before release.",
    highlights: [
      "Script to presenter video",
      "Dubbed and lip-synced in 4 languages",
      "Human review before release",
    ],
    tags: ["AI avatars & presenters", "Voiceover & dubbing", "Subtitles"],
  },
  {
    title: "Saffron & Co.",
    type: "Branding",
    label: "A warm identity for a modern chai house.",
    image: null,
    visual: "brandboard",
    desc: "A self-initiated identity concept for a modern chai café: logo and monogram, colour palette, typography, cups and signage, designed to feel warm, rooted and contemporary.",
    highlights: [
      "Logo, monogram & seal",
      "Colour palette and typography",
      "Cups, packaging and signage",
    ],
    tags: ["Logo & monogram", "Packaging", "Brand guidelines"],
  },
];
