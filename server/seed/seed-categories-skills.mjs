import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) { console.error('DATABASE_URL not set'); process.exit(1); }

const conn = await mysql.createConnection(DATABASE_URL);

// ============================================================================
// 50 PROFESSIONAL DOMAINS with hierarchical sub-categories
// ============================================================================
const domains = [
  { name: "Web Development", slug: "web-development", icon: "Globe", color: "#3B82F6",
    subs: [
      { name: "Frontend Frameworks", slug: "frontend-frameworks", subs: ["React Development", "Vue.js Development", "Angular Development", "Svelte Development"] },
      { name: "Backend Development", slug: "backend-development", subs: ["Node.js APIs", "Python Web", "Go Services", "Java Spring"] },
      { name: "Full-Stack", slug: "full-stack", subs: ["Next.js Apps", "Nuxt.js Apps", "Remix Apps"] },
      { name: "CSS & Styling", slug: "css-styling", subs: ["Tailwind CSS", "CSS Animations", "Responsive Design"] }
    ]},
  { name: "Mobile App Development", slug: "mobile-app-development", icon: "Smartphone", color: "#8B5CF6",
    subs: [
      { name: "Cross-Platform", slug: "cross-platform-mobile", subs: ["React Native", "Flutter", "Ionic"] },
      { name: "iOS Development", slug: "ios-development", subs: ["Swift UI", "UIKit", "iOS Animations"] },
      { name: "Android Development", slug: "android-development", subs: ["Kotlin", "Jetpack Compose", "Android UI"] }
    ]},
  { name: "Office Productivity", slug: "office-productivity", icon: "Briefcase", color: "#F59E0B",
    subs: [
      { name: "Document Processing", slug: "document-processing", subs: ["Word Automation", "PDF Generation", "Template Engine"] },
      { name: "Spreadsheet & Data", slug: "spreadsheet-data", subs: ["Excel Automation", "Data Analysis", "Report Generation"] },
      { name: "Presentation", slug: "presentation-tools", subs: ["Slide Generation", "Visual Design", "Data Visualization"] }
    ]},
  { name: "Video Production", slug: "video-production", icon: "Video", color: "#EF4444",
    subs: [
      { name: "Video Editing", slug: "video-editing", subs: ["Cut & Trim", "Color Grading", "Transitions"] },
      { name: "Motion Graphics", slug: "motion-graphics", subs: ["After Effects", "Title Animation", "Logo Animation"] },
      { name: "Video Generation", slug: "video-generation", subs: ["AI Video", "Text-to-Video", "Video Enhancement"] }
    ]},
  { name: "Image Creation", slug: "image-creation", icon: "Image", color: "#EC4899",
    subs: [
      { name: "AI Image Generation", slug: "ai-image-generation", subs: ["Stable Diffusion", "DALL-E", "Midjourney Prompts"] },
      { name: "Photo Editing", slug: "photo-editing", subs: ["Retouching", "Background Removal", "Color Correction"] },
      { name: "Graphic Design", slug: "graphic-design", subs: ["Logo Design", "Banner Design", "Social Media Graphics"] }
    ]},
  { name: "Academic Writing", slug: "academic-writing", icon: "GraduationCap", color: "#6366F1",
    subs: [
      { name: "Research Papers", slug: "research-papers", subs: ["Literature Review", "Methodology", "Data Analysis Writing"] },
      { name: "Thesis & Dissertation", slug: "thesis-dissertation", subs: ["Proposal Writing", "Chapter Structure", "Defense Prep"] },
      { name: "Citation & Format", slug: "citation-format", subs: ["APA Style", "MLA Style", "Chicago Style"] }
    ]},
  { name: "Official Document Writing", slug: "official-document-writing", icon: "FileText", color: "#14B8A6",
    subs: [
      { name: "Government Documents", slug: "government-documents", subs: ["Policy Drafting", "Official Reports", "Regulatory Documents"] },
      { name: "Business Documents", slug: "business-documents", subs: ["Business Plans", "Proposals", "Meeting Minutes"] },
      { name: "Administrative", slug: "administrative-docs", subs: ["Notices", "Announcements", "Internal Memos"] }
    ]},
  { name: "Legal Domain", slug: "legal-domain", icon: "Scale", color: "#F97316",
    subs: [
      { name: "Criminal Law", slug: "criminal-law", subs: ["Defense Strategy", "Case Analysis", "Sentencing Guidelines"] },
      { name: "Civil Law", slug: "civil-law", subs: ["Contract Disputes", "Property Law", "Family Law"] },
      { name: "Corporate Law", slug: "corporate-law", subs: ["Company Formation", "M&A", "Compliance"] },
      { name: "International Law", slug: "international-law", subs: ["Trade Law", "Human Rights", "Treaty Analysis"] }
    ]},
  { name: "Animation Production", slug: "animation-production", icon: "Film", color: "#A855F7",
    subs: [
      { name: "2D Animation", slug: "2d-animation", subs: ["Character Animation", "Frame-by-Frame", "Cutout Animation"] },
      { name: "3D Animation", slug: "3d-animation", subs: ["3D Modeling", "Rigging", "Rendering"] },
      { name: "AI Animation", slug: "ai-animation", subs: ["AI Motion Capture", "Style Transfer", "Auto In-between"] }
    ]},
  { name: "Entrepreneurship", slug: "entrepreneurship", icon: "Rocket", color: "#10B981",
    subs: [
      { name: "Business Planning", slug: "business-planning", subs: ["Market Analysis", "Financial Modeling", "Pitch Deck"] },
      { name: "Fundraising", slug: "fundraising", subs: ["Investor Outreach", "Term Sheet", "Due Diligence"] },
      { name: "Growth Strategy", slug: "growth-strategy", subs: ["Product-Market Fit", "Scaling", "User Acquisition"] }
    ]},
  { name: "Data Science", slug: "data-science", icon: "BarChart3", color: "#0EA5E9",
    subs: [
      { name: "Machine Learning", slug: "machine-learning", subs: ["Supervised Learning", "Unsupervised Learning", "Deep Learning"] },
      { name: "Data Engineering", slug: "data-engineering", subs: ["ETL Pipelines", "Data Warehousing", "Stream Processing"] },
      { name: "Statistical Analysis", slug: "statistical-analysis", subs: ["Hypothesis Testing", "Regression", "Time Series"] }
    ]},
  { name: "Cybersecurity", slug: "cybersecurity", icon: "Shield", color: "#DC2626",
    subs: [
      { name: "Penetration Testing", slug: "penetration-testing", subs: ["Web App Testing", "Network Testing", "Social Engineering"] },
      { name: "Security Auditing", slug: "security-auditing", subs: ["Code Review", "Compliance Check", "Vulnerability Assessment"] },
      { name: "Incident Response", slug: "incident-response", subs: ["Forensics", "Malware Analysis", "Recovery Planning"] }
    ]},
  { name: "DevOps & Cloud", slug: "devops-cloud", icon: "Cloud", color: "#2563EB",
    subs: [
      { name: "CI/CD", slug: "ci-cd", subs: ["GitHub Actions", "Jenkins", "GitLab CI"] },
      { name: "Container Orchestration", slug: "container-orchestration", subs: ["Docker", "Kubernetes", "Helm Charts"] },
      { name: "Cloud Infrastructure", slug: "cloud-infrastructure", subs: ["AWS", "Azure", "GCP"] }
    ]},
  { name: "AI & Machine Learning", slug: "ai-machine-learning", icon: "Brain", color: "#7C3AED",
    subs: [
      { name: "NLP", slug: "nlp", subs: ["Text Classification", "Sentiment Analysis", "Named Entity Recognition"] },
      { name: "Computer Vision", slug: "computer-vision", subs: ["Object Detection", "Image Segmentation", "OCR"] },
      { name: "LLM Applications", slug: "llm-applications", subs: ["Prompt Engineering", "RAG Systems", "Fine-tuning"] }
    ]},
  { name: "Marketing & SEO", slug: "marketing-seo", icon: "TrendingUp", color: "#F43F5E",
    subs: [
      { name: "Content Marketing", slug: "content-marketing", subs: ["Blog Writing", "Social Media", "Email Campaigns"] },
      { name: "SEO Optimization", slug: "seo-optimization", subs: ["On-Page SEO", "Technical SEO", "Link Building"] },
      { name: "Analytics", slug: "marketing-analytics", subs: ["Google Analytics", "A/B Testing", "Conversion Optimization"] }
    ]},
  { name: "E-Commerce", slug: "e-commerce", icon: "ShoppingCart", color: "#EA580C",
    subs: [
      { name: "Store Setup", slug: "store-setup", subs: ["Shopify", "WooCommerce", "Custom Stores"] },
      { name: "Product Management", slug: "product-management-ecom", subs: ["Catalog", "Pricing Strategy", "Inventory"] },
      { name: "Payment Integration", slug: "payment-integration", subs: ["Stripe", "PayPal", "Crypto Payments"] }
    ]},
  { name: "Education & Training", slug: "education-training", icon: "BookOpen", color: "#0D9488",
    subs: [
      { name: "Course Creation", slug: "course-creation", subs: ["Curriculum Design", "Quiz Generation", "Interactive Content"] },
      { name: "Tutoring", slug: "tutoring", subs: ["Math Tutor", "Language Tutor", "Science Tutor"] },
      { name: "Assessment", slug: "assessment", subs: ["Exam Generation", "Grading", "Feedback"] }
    ]},
  { name: "Healthcare & Medical", slug: "healthcare-medical", icon: "Heart", color: "#E11D48",
    subs: [
      { name: "Clinical Support", slug: "clinical-support", subs: ["Diagnosis Assist", "Treatment Planning", "Drug Interaction"] },
      { name: "Medical Records", slug: "medical-records", subs: ["EHR Management", "Patient Notes", "Lab Reports"] },
      { name: "Health Research", slug: "health-research", subs: ["Clinical Trials", "Epidemiology", "Biostatistics"] }
    ]},
  { name: "Finance & Accounting", slug: "finance-accounting", icon: "DollarSign", color: "#059669",
    subs: [
      { name: "Financial Analysis", slug: "financial-analysis", subs: ["Valuation", "Risk Assessment", "Portfolio Management"] },
      { name: "Accounting", slug: "accounting", subs: ["Bookkeeping", "Tax Preparation", "Audit Support"] },
      { name: "Trading", slug: "trading", subs: ["Technical Analysis", "Algorithmic Trading", "Market Research"] }
    ]},
  { name: "Human Resources", slug: "human-resources", icon: "Users", color: "#7C3AED",
    subs: [
      { name: "Recruitment", slug: "recruitment", subs: ["Resume Screening", "Interview Questions", "Job Descriptions"] },
      { name: "Employee Management", slug: "employee-management", subs: ["Performance Review", "Onboarding", "Training Plans"] },
      { name: "Compensation", slug: "compensation", subs: ["Salary Benchmarking", "Benefits Design", "Payroll"] }
    ]},
  { name: "Project Management", slug: "project-management", icon: "Kanban", color: "#2563EB",
    subs: [
      { name: "Agile", slug: "agile", subs: ["Scrum Master", "Sprint Planning", "Retrospective"] },
      { name: "Planning", slug: "pm-planning", subs: ["Gantt Charts", "Resource Allocation", "Risk Management"] },
      { name: "Reporting", slug: "pm-reporting", subs: ["Status Reports", "KPI Dashboards", "Stakeholder Updates"] }
    ]},
  { name: "Customer Service", slug: "customer-service", icon: "Headphones", color: "#F59E0B",
    subs: [
      { name: "Chatbot", slug: "chatbot", subs: ["FAQ Bot", "Support Agent", "Escalation Handler"] },
      { name: "Ticket Management", slug: "ticket-management", subs: ["Auto-Classification", "Priority Routing", "SLA Tracking"] },
      { name: "Knowledge Base", slug: "knowledge-base", subs: ["Article Generation", "Search Optimization", "Self-Service"] }
    ]},
  { name: "Translation & Localization", slug: "translation-localization", icon: "Languages", color: "#8B5CF6",
    subs: [
      { name: "Document Translation", slug: "document-translation", subs: ["Technical Translation", "Legal Translation", "Medical Translation"] },
      { name: "Localization", slug: "localization", subs: ["UI Localization", "Cultural Adaptation", "i18n Tools"] },
      { name: "Language Learning", slug: "language-learning", subs: ["Grammar Check", "Vocabulary Builder", "Conversation Practice"] }
    ]},
  { name: "Music & Audio", slug: "music-audio", icon: "Music", color: "#EC4899",
    subs: [
      { name: "Music Generation", slug: "music-generation", subs: ["AI Composition", "Beat Making", "Melody Generation"] },
      { name: "Audio Processing", slug: "audio-processing", subs: ["Noise Reduction", "Voice Enhancement", "Audio Mixing"] },
      { name: "Podcast", slug: "podcast", subs: ["Script Writing", "Editing", "Show Notes"] }
    ]},
  { name: "Game Development", slug: "game-development", icon: "Gamepad2", color: "#6366F1",
    subs: [
      { name: "Game Design", slug: "game-design", subs: ["Level Design", "Game Mechanics", "Narrative Design"] },
      { name: "Game Programming", slug: "game-programming", subs: ["Unity Scripts", "Unreal Blueprints", "Godot GDScript"] },
      { name: "Game Art", slug: "game-art", subs: ["Pixel Art", "3D Assets", "UI Design"] }
    ]},
  { name: "Architecture & Design", slug: "architecture-design", icon: "Building2", color: "#0EA5E9",
    subs: [
      { name: "Architectural Design", slug: "architectural-design", subs: ["Floor Plans", "3D Rendering", "Structural Analysis"] },
      { name: "Interior Design", slug: "interior-design", subs: ["Space Planning", "Material Selection", "Lighting Design"] },
      { name: "Urban Planning", slug: "urban-planning", subs: ["Zoning Analysis", "Traffic Flow", "Environmental Impact"] }
    ]},
  { name: "Journalism & Media", slug: "journalism-media", icon: "Newspaper", color: "#14B8A6",
    subs: [
      { name: "News Writing", slug: "news-writing", subs: ["Breaking News", "Feature Stories", "Investigative"] },
      { name: "Media Production", slug: "media-production", subs: ["Broadcast Scripts", "Documentary", "Social Media Content"] },
      { name: "Fact-Checking", slug: "fact-checking", subs: ["Source Verification", "Claim Analysis", "Bias Detection"] }
    ]},
  { name: "Real Estate", slug: "real-estate", icon: "Home", color: "#F97316",
    subs: [
      { name: "Property Analysis", slug: "property-analysis", subs: ["Valuation", "Market Comparison", "Investment Analysis"] },
      { name: "Listing Management", slug: "listing-management", subs: ["Description Writing", "Photo Enhancement", "Virtual Tours"] },
      { name: "Legal & Contracts", slug: "real-estate-legal", subs: ["Lease Agreements", "Purchase Contracts", "Compliance"] }
    ]},
  { name: "Supply Chain & Logistics", slug: "supply-chain-logistics", icon: "Truck", color: "#A855F7",
    subs: [
      { name: "Inventory Management", slug: "inventory-management", subs: ["Demand Forecasting", "Stock Optimization", "Warehouse Layout"] },
      { name: "Route Optimization", slug: "route-optimization", subs: ["Delivery Planning", "Fleet Management", "Last Mile"] },
      { name: "Procurement", slug: "procurement", subs: ["Vendor Selection", "Contract Negotiation", "Cost Analysis"] }
    ]},
  { name: "Environmental Science", slug: "environmental-science", icon: "Leaf", color: "#22C55E",
    subs: [
      { name: "Climate Analysis", slug: "climate-analysis", subs: ["Carbon Footprint", "Weather Modeling", "Impact Assessment"] },
      { name: "Sustainability", slug: "sustainability", subs: ["ESG Reporting", "Green Energy", "Waste Management"] },
      { name: "Conservation", slug: "conservation", subs: ["Biodiversity", "Habitat Mapping", "Species Monitoring"] }
    ]},
  { name: "Robotics & IoT", slug: "robotics-iot", icon: "Cpu", color: "#64748B",
    subs: [
      { name: "Robot Programming", slug: "robot-programming", subs: ["ROS", "Path Planning", "Sensor Fusion"] },
      { name: "IoT Systems", slug: "iot-systems", subs: ["Device Management", "Edge Computing", "MQTT"] },
      { name: "Automation", slug: "industrial-automation", subs: ["PLC Programming", "SCADA", "Digital Twin"] }
    ]},
  { name: "Blockchain & Web3", slug: "blockchain-web3", icon: "Link", color: "#F59E0B",
    subs: [
      { name: "Smart Contracts", slug: "smart-contracts", subs: ["Solidity", "Rust Contracts", "Auditing"] },
      { name: "DeFi", slug: "defi", subs: ["Yield Farming", "Liquidity Pools", "Token Economics"] },
      { name: "NFT & Digital Assets", slug: "nft-digital-assets", subs: ["NFT Creation", "Marketplace", "Metadata"] }
    ]},
  { name: "Social Media Management", slug: "social-media-management", icon: "Share2", color: "#3B82F6",
    subs: [
      { name: "Content Creation", slug: "social-content-creation", subs: ["Post Writing", "Hashtag Strategy", "Visual Content"] },
      { name: "Community Management", slug: "community-management", subs: ["Engagement", "Moderation", "Crisis Management"] },
      { name: "Analytics & Growth", slug: "social-analytics", subs: ["Performance Tracking", "Audience Insights", "Growth Hacking"] }
    ]},
  { name: "Technical Writing", slug: "technical-writing", icon: "PenTool", color: "#6366F1",
    subs: [
      { name: "API Documentation", slug: "api-documentation", subs: ["OpenAPI Specs", "SDK Guides", "Code Examples"] },
      { name: "User Guides", slug: "user-guides", subs: ["Getting Started", "Tutorials", "Troubleshooting"] },
      { name: "Release Notes", slug: "release-notes", subs: ["Changelogs", "Migration Guides", "Breaking Changes"] }
    ]},
  { name: "Automotive Engineering", slug: "automotive-engineering", icon: "Car", color: "#DC2626",
    subs: [
      { name: "Vehicle Design", slug: "vehicle-design", subs: ["CAD Modeling", "Aerodynamics", "Safety Analysis"] },
      { name: "Autonomous Driving", slug: "autonomous-driving", subs: ["Perception", "Planning", "Control Systems"] },
      { name: "EV Technology", slug: "ev-technology", subs: ["Battery Management", "Charging Systems", "Motor Control"] }
    ]},
  { name: "Aerospace", slug: "aerospace", icon: "Plane", color: "#0EA5E9",
    subs: [
      { name: "Flight Systems", slug: "flight-systems", subs: ["Navigation", "Avionics", "Flight Control"] },
      { name: "Space Technology", slug: "space-technology", subs: ["Orbital Mechanics", "Satellite Design", "Mission Planning"] },
      { name: "Drone Technology", slug: "drone-technology", subs: ["Flight Planning", "Payload Management", "Swarm Control"] }
    ]},
  { name: "Biotechnology", slug: "biotechnology", icon: "Dna", color: "#10B981",
    subs: [
      { name: "Genomics", slug: "genomics", subs: ["Sequence Analysis", "Gene Expression", "CRISPR Design"] },
      { name: "Drug Discovery", slug: "drug-discovery", subs: ["Molecular Docking", "ADMET Prediction", "Clinical Trials"] },
      { name: "Bioinformatics", slug: "bioinformatics", subs: ["Protein Structure", "Pathway Analysis", "Phylogenetics"] }
    ]},
  { name: "Psychology & Counseling", slug: "psychology-counseling", icon: "HeartHandshake", color: "#EC4899",
    subs: [
      { name: "Clinical Psychology", slug: "clinical-psychology", subs: ["Assessment Tools", "Treatment Plans", "Progress Notes"] },
      { name: "Counseling", slug: "counseling", subs: ["CBT Worksheets", "Mindfulness Exercises", "Group Therapy"] },
      { name: "Research Methods", slug: "psych-research", subs: ["Survey Design", "Data Collection", "Statistical Analysis"] }
    ]},
  { name: "Food & Agriculture", slug: "food-agriculture", icon: "Wheat", color: "#F97316",
    subs: [
      { name: "Crop Management", slug: "crop-management", subs: ["Precision Agriculture", "Pest Detection", "Yield Prediction"] },
      { name: "Food Science", slug: "food-science", subs: ["Recipe Generation", "Nutrition Analysis", "Food Safety"] },
      { name: "Agri-Tech", slug: "agri-tech", subs: ["Smart Farming", "Drone Monitoring", "Soil Analysis"] }
    ]},
  { name: "Fashion & Textile", slug: "fashion-textile", icon: "Shirt", color: "#A855F7",
    subs: [
      { name: "Fashion Design", slug: "fashion-design", subs: ["Trend Forecasting", "Pattern Making", "Color Palettes"] },
      { name: "Textile Technology", slug: "textile-technology", subs: ["Fabric Analysis", "Dyeing Process", "Quality Control"] },
      { name: "Retail & Merchandising", slug: "retail-merchandising", subs: ["Visual Merchandising", "Pricing Strategy", "Inventory Planning"] }
    ]},
  { name: "Sports & Fitness", slug: "sports-fitness", icon: "Dumbbell", color: "#EF4444",
    subs: [
      { name: "Training Plans", slug: "training-plans", subs: ["Workout Generation", "Periodization", "Recovery Planning"] },
      { name: "Performance Analysis", slug: "performance-analysis", subs: ["Video Analysis", "Statistics", "Biomechanics"] },
      { name: "Nutrition", slug: "sports-nutrition", subs: ["Meal Planning", "Supplement Guide", "Calorie Tracking"] }
    ]},
  { name: "Travel & Hospitality", slug: "travel-hospitality", icon: "MapPin", color: "#14B8A6",
    subs: [
      { name: "Trip Planning", slug: "trip-planning", subs: ["Itinerary Generation", "Budget Planning", "Visa Guide"] },
      { name: "Hotel Management", slug: "hotel-management", subs: ["Booking Systems", "Guest Services", "Revenue Management"] },
      { name: "Tourism Marketing", slug: "tourism-marketing", subs: ["Destination Branding", "Review Management", "Content Creation"] }
    ]},
  { name: "Insurance", slug: "insurance", icon: "ShieldCheck", color: "#2563EB",
    subs: [
      { name: "Underwriting", slug: "underwriting", subs: ["Risk Assessment", "Policy Pricing", "Claims Analysis"] },
      { name: "Claims Processing", slug: "claims-processing", subs: ["Fraud Detection", "Document Verification", "Settlement Calculation"] },
      { name: "Compliance", slug: "insurance-compliance", subs: ["Regulatory Reporting", "Audit Preparation", "Policy Review"] }
    ]},
  { name: "Mining & Energy", slug: "mining-energy", icon: "Zap", color: "#F59E0B",
    subs: [
      { name: "Resource Exploration", slug: "resource-exploration", subs: ["Geological Survey", "Mineral Analysis", "Site Assessment"] },
      { name: "Energy Management", slug: "energy-management", subs: ["Grid Optimization", "Demand Forecasting", "Renewable Integration"] },
      { name: "Safety & Compliance", slug: "mining-safety", subs: ["Safety Protocols", "Environmental Monitoring", "Regulatory Compliance"] }
    ]},
  { name: "Telecommunications", slug: "telecommunications", icon: "Radio", color: "#7C3AED",
    subs: [
      { name: "Network Design", slug: "network-design", subs: ["5G Planning", "Fiber Optics", "Capacity Planning"] },
      { name: "Signal Processing", slug: "signal-processing", subs: ["Modulation", "Noise Filtering", "Spectrum Analysis"] },
      { name: "Service Management", slug: "telecom-service", subs: ["SLA Management", "Billing Systems", "Customer Provisioning"] }
    ]},
  { name: "Pharmaceutical", slug: "pharmaceutical", icon: "Pill", color: "#E11D48",
    subs: [
      { name: "Drug Development", slug: "drug-development", subs: ["Formulation", "Stability Testing", "Bioequivalence"] },
      { name: "Regulatory Affairs", slug: "regulatory-affairs", subs: ["FDA Submissions", "Clinical Documentation", "GMP Compliance"] },
      { name: "Pharmacovigilance", slug: "pharmacovigilance", subs: ["Adverse Event Reporting", "Signal Detection", "Risk Management"] }
    ]},
  { name: "Construction & Engineering", slug: "construction-engineering", icon: "HardHat", color: "#EA580C",
    subs: [
      { name: "Structural Engineering", slug: "structural-engineering", subs: ["Load Analysis", "Material Selection", "Seismic Design"] },
      { name: "Project Estimation", slug: "project-estimation", subs: ["Cost Estimation", "Timeline Planning", "Resource Scheduling"] },
      { name: "BIM", slug: "bim", subs: ["3D Modeling", "Clash Detection", "As-Built Documentation"] }
    ]},
  { name: "Non-Profit & NGO", slug: "non-profit-ngo", icon: "HandHeart", color: "#10B981",
    subs: [
      { name: "Grant Writing", slug: "grant-writing", subs: ["Proposal Templates", "Budget Justification", "Impact Metrics"] },
      { name: "Fundraising", slug: "ngo-fundraising", subs: ["Campaign Strategy", "Donor Management", "Event Planning"] },
      { name: "Impact Assessment", slug: "impact-assessment", subs: ["Program Evaluation", "Outcome Measurement", "Reporting"] }
    ]},
  { name: "Publishing & Editing", slug: "publishing-editing", icon: "BookMarked", color: "#6366F1",
    subs: [
      { name: "Book Publishing", slug: "book-publishing", subs: ["Manuscript Editing", "Cover Design", "ISBN & Distribution"] },
      { name: "Content Editing", slug: "content-editing", subs: ["Copyediting", "Proofreading", "Style Guide"] },
      { name: "Digital Publishing", slug: "digital-publishing", subs: ["E-book Formatting", "Blog Platforms", "Newsletter"] }
    ]},
  { name: "Quality Assurance", slug: "quality-assurance", icon: "CheckCircle", color: "#0D9488",
    subs: [
      { name: "Software Testing", slug: "software-testing", subs: ["Unit Testing", "Integration Testing", "E2E Testing"] },
      { name: "Test Automation", slug: "test-automation", subs: ["Selenium", "Cypress", "Playwright"] },
      { name: "Performance Testing", slug: "performance-testing", subs: ["Load Testing", "Stress Testing", "Benchmarking"] }
    ]},
  { name: "Intellectual Property", slug: "intellectual-property", icon: "Copyright", color: "#F43F5E",
    subs: [
      { name: "Patent", slug: "patent", subs: ["Patent Search", "Claim Drafting", "Prior Art Analysis"] },
      { name: "Trademark", slug: "trademark", subs: ["Trademark Search", "Registration", "Infringement Analysis"] },
      { name: "Copyright", slug: "copyright-law", subs: ["Registration", "Fair Use Analysis", "Licensing"] }
    ]},
];

// ============================================================================
// SKILL TEMPLATES per domain - 10 skills each
// ============================================================================
function generateSkillsForDomain(domain, categoryId, subCategories) {
  const skillTemplates = {
    "web-development": [
      { name: "React Component Generator", slug: "react-component-generator", type: "tool", desc: "Automatically generates React components with TypeScript, proper props interfaces, hooks integration, and Storybook stories. Supports functional components with useState, useEffect, useContext, and custom hooks.", readme: "# React Component Generator\n\nA comprehensive tool for generating production-ready React components.\n\n## Features\n- TypeScript support with proper type inference\n- Automatic prop interface generation\n- Hook integration (useState, useEffect, useContext)\n- Storybook story generation\n- Unit test scaffolding with React Testing Library\n\n## Usage\n```\nskillshub install skillsai/react-component-generator\n```\n\n## Configuration\n```json\n{\n  \"style\": \"functional\",\n  \"typescript\": true,\n  \"storybook\": true,\n  \"testing\": \"rtl\"\n}\n```", tags: ["react", "typescript", "components", "code-generation"] },
      { name: "Next.js Full-Stack Scaffold", slug: "nextjs-fullstack-scaffold", type: "template", desc: "Complete Next.js 14+ application scaffold with App Router, Server Components, API routes, Prisma ORM, authentication, and deployment configuration.", readme: "# Next.js Full-Stack Scaffold\n\nProduction-ready Next.js application template.\n\n## Stack\n- Next.js 14 with App Router\n- TypeScript\n- Prisma ORM\n- NextAuth.js\n- Tailwind CSS\n- Vercel deployment\n\n## Getting Started\n```bash\nskillshub create my-app --template nextjs-fullstack\ncd my-app && npm install\n```", tags: ["nextjs", "fullstack", "prisma", "auth"] },
      { name: "REST API Builder", slug: "rest-api-builder", type: "tool", desc: "Generates RESTful API endpoints with Express.js, including validation, error handling, authentication middleware, and OpenAPI documentation.", readme: "# REST API Builder\n\nAutomate REST API development with best practices.\n\n## Features\n- Express.js route generation\n- Zod validation schemas\n- JWT authentication middleware\n- OpenAPI 3.0 spec generation\n- Error handling middleware\n- Rate limiting\n\n## Usage\n```yaml\nresources:\n  - name: users\n    fields:\n      - name: string\n      - email: string:unique\n    auth: required\n```", tags: ["api", "rest", "express", "openapi"] },
      { name: "CSS-to-Tailwind Converter", slug: "css-to-tailwind-converter", type: "tool", desc: "Converts traditional CSS stylesheets to Tailwind CSS utility classes. Handles complex selectors, media queries, animations, and custom properties.", readme: "# CSS-to-Tailwind Converter\n\nMigrate your CSS codebase to Tailwind CSS.\n\n## Features\n- Handles complex CSS selectors\n- Media query to responsive prefix conversion\n- Animation to Tailwind animation mapping\n- Custom property preservation\n- Batch file processing", tags: ["css", "tailwind", "migration", "conversion"] },
      { name: "GraphQL Schema Designer", slug: "graphql-schema-designer", type: "tool", desc: "Visual GraphQL schema design tool that generates type definitions, resolvers, and client queries with full TypeScript support.", readme: "# GraphQL Schema Designer\n\nDesign and generate GraphQL schemas visually.\n\n## Features\n- Visual schema editor\n- Auto-generated TypeScript types\n- Resolver scaffolding\n- Client query generation\n- Subscription support", tags: ["graphql", "schema", "typescript", "api"] },
      { name: "Responsive Layout Generator", slug: "responsive-layout-generator", type: "prompt", desc: "AI-powered responsive layout generation from wireframes or descriptions. Produces clean HTML/CSS with mobile-first approach and accessibility compliance.", readme: "# Responsive Layout Generator\n\nGenerate responsive layouts from natural language descriptions.\n\n## Capabilities\n- Mobile-first responsive design\n- WCAG 2.1 AA compliance\n- Semantic HTML5 structure\n- CSS Grid and Flexbox layouts\n- Dark mode support", tags: ["responsive", "layout", "accessibility", "html"] },
      { name: "Vue.js Composition API Migrator", slug: "vuejs-composition-api-migrator", type: "tool", desc: "Automatically migrates Vue.js Options API components to Composition API with script setup syntax, preserving all functionality and reactivity.", readme: "# Vue.js Composition API Migrator\n\nSeamlessly migrate from Options API to Composition API.\n\n## Features\n- Automatic conversion of data, methods, computed, watch\n- Script setup syntax\n- Composable extraction\n- TypeScript type inference\n- Preserves template and style blocks", tags: ["vue", "migration", "composition-api", "refactoring"] },
      { name: "Web Performance Optimizer", slug: "web-performance-optimizer", type: "agent", desc: "Analyzes web applications for performance bottlenecks and automatically applies optimizations including code splitting, lazy loading, image optimization, and caching strategies.", readme: "# Web Performance Optimizer\n\nAutomated web performance optimization agent.\n\n## Optimizations\n- Code splitting and tree shaking\n- Image format conversion (WebP, AVIF)\n- Lazy loading implementation\n- Critical CSS extraction\n- Service worker caching\n- Bundle analysis and reduction", tags: ["performance", "optimization", "lighthouse", "core-web-vitals"] },
      { name: "Accessibility Auditor", slug: "accessibility-auditor", type: "agent", desc: "Comprehensive accessibility audit tool that scans web pages for WCAG 2.1 compliance issues and generates detailed reports with fix suggestions.", readme: "# Accessibility Auditor\n\nEnsure your web applications are accessible to everyone.\n\n## Features\n- WCAG 2.1 Level AA compliance checking\n- ARIA attribute validation\n- Color contrast analysis\n- Keyboard navigation testing\n- Screen reader compatibility\n- Automated fix suggestions", tags: ["accessibility", "wcag", "a11y", "audit"] },
      { name: "Full-Stack Auth System", slug: "fullstack-auth-system", type: "template", desc: "Complete authentication system with OAuth 2.0, JWT tokens, role-based access control, two-factor authentication, and session management.", readme: "# Full-Stack Auth System\n\nEnterprise-grade authentication template.\n\n## Features\n- OAuth 2.0 (Google, GitHub, Microsoft)\n- JWT with refresh tokens\n- Role-based access control (RBAC)\n- Two-factor authentication (TOTP)\n- Session management\n- Password reset flow\n- Account lockout protection", tags: ["auth", "oauth", "jwt", "security"] }
    ],
    "mobile-app-development": [
      { name: "React Native UI Kit", slug: "react-native-ui-kit", type: "template", desc: "Comprehensive React Native UI component library with 50+ customizable components, dark mode support, and platform-specific adaptations.", tags: ["react-native", "ui-kit", "components", "mobile"] },
      { name: "Flutter State Manager", slug: "flutter-state-manager", type: "tool", desc: "Intelligent state management solution for Flutter apps using Riverpod with automatic code generation and DevTools integration.", tags: ["flutter", "state-management", "riverpod", "dart"] },
      { name: "Mobile App Prototyper", slug: "mobile-app-prototyper", type: "prompt", desc: "Generate interactive mobile app prototypes from natural language descriptions with navigation flows, animations, and gesture support.", tags: ["prototype", "mobile", "design", "wireframe"] },
      { name: "Push Notification System", slug: "push-notification-system", type: "template", desc: "Cross-platform push notification system with Firebase Cloud Messaging, rich notifications, deep linking, and analytics.", tags: ["push-notifications", "firebase", "fcm", "mobile"] },
      { name: "Mobile Analytics Dashboard", slug: "mobile-analytics-dashboard", type: "tool", desc: "Real-time mobile app analytics with crash reporting, user flow tracking, performance monitoring, and A/B testing integration.", tags: ["analytics", "crash-reporting", "monitoring", "mobile"] },
      { name: "App Store Optimizer", slug: "app-store-optimizer", type: "agent", desc: "AI-powered App Store Optimization tool that analyzes keywords, generates descriptions, and suggests screenshot strategies for iOS and Android.", tags: ["aso", "app-store", "optimization", "marketing"] },
      { name: "Cross-Platform Navigation", slug: "cross-platform-navigation", type: "template", desc: "Unified navigation system for React Native with deep linking, tab navigation, drawer navigation, and authentication flow handling.", tags: ["navigation", "react-native", "deep-linking", "routing"] },
      { name: "Mobile Payment Integration", slug: "mobile-payment-integration", type: "template", desc: "Complete mobile payment solution supporting Apple Pay, Google Pay, Stripe, and in-app purchases with receipt validation.", tags: ["payment", "apple-pay", "google-pay", "stripe"] },
      { name: "Offline-First Data Sync", slug: "offline-first-data-sync", type: "tool", desc: "Offline-first data synchronization engine with conflict resolution, background sync, and optimistic updates for mobile apps.", tags: ["offline", "sync", "data", "mobile"] },
      { name: "Mobile Security Scanner", slug: "mobile-security-scanner", type: "agent", desc: "Automated security scanning for mobile applications detecting vulnerabilities in code, dependencies, API calls, and data storage.", tags: ["security", "scanning", "vulnerability", "mobile"] }
    ],
    "legal-domain": [
      { name: "Contract Analyzer", slug: "contract-analyzer", type: "agent", desc: "AI-powered contract analysis tool that identifies key clauses, potential risks, missing provisions, and compliance issues across jurisdictions including US, EU, UK, and China law.", readme: "# Contract Analyzer\n\nIntelligent contract analysis for legal professionals.\n\n## Jurisdictions\n- United States (Federal & State)\n- European Union (GDPR, Consumer Rights)\n- United Kingdom (Common Law)\n- China (PRC Contract Law)\n\n## Features\n- Key clause identification\n- Risk assessment scoring\n- Missing provision detection\n- Cross-jurisdiction compliance check\n- Plain language summaries", tags: ["contract", "legal-analysis", "compliance", "multi-jurisdiction"] },
      { name: "Legal Brief Writer", slug: "legal-brief-writer", type: "prompt", desc: "Generates comprehensive legal briefs with proper citation format (Bluebook, OSCOLA), argument structure, and case law references for criminal and civil matters.", tags: ["legal-brief", "citation", "bluebook", "litigation"] },
      { name: "Case Law Research Agent", slug: "case-law-research-agent", type: "agent", desc: "Searches and analyzes case law databases to find relevant precedents, distinguishing factors, and judicial reasoning patterns across common law jurisdictions.", tags: ["case-law", "research", "precedent", "common-law"] },
      { name: "Criminal Defense Strategist", slug: "criminal-defense-strategist", type: "agent", desc: "Assists criminal defense attorneys with case strategy development, evidence analysis, motion drafting, and sentencing guideline calculations.", tags: ["criminal-law", "defense", "strategy", "sentencing"] },
      { name: "Corporate Compliance Checker", slug: "corporate-compliance-checker", type: "tool", desc: "Automated compliance checking tool for corporate governance, SEC filings, SOX compliance, and international regulatory requirements.", tags: ["compliance", "corporate", "sec", "governance"] },
      { name: "IP Patent Drafter", slug: "ip-patent-drafter", type: "prompt", desc: "Generates patent application drafts with claims, specifications, and drawings descriptions following USPTO, EPO, and CNIPA guidelines.", tags: ["patent", "ip", "claims", "drafting"] },
      { name: "Family Law Document Generator", slug: "family-law-document-generator", type: "tool", desc: "Generates family law documents including divorce petitions, custody agreements, prenuptial agreements, and child support calculations.", tags: ["family-law", "divorce", "custody", "documents"] },
      { name: "International Trade Law Advisor", slug: "international-trade-law-advisor", type: "agent", desc: "Advises on international trade regulations, tariff classifications, sanctions compliance, and cross-border transaction requirements.", tags: ["trade-law", "international", "tariffs", "sanctions"] },
      { name: "Legal Document Translator", slug: "legal-document-translator", type: "tool", desc: "Specialized legal document translation maintaining legal terminology accuracy across English, Chinese, French, German, and Spanish.", tags: ["translation", "legal", "multilingual", "terminology"] },
      { name: "Regulatory Change Monitor", slug: "regulatory-change-monitor", type: "agent", desc: "Monitors regulatory changes across jurisdictions, analyzes impact on business operations, and generates compliance action plans.", tags: ["regulatory", "monitoring", "compliance", "alerts"] }
    ],
  };

  // Generate default skills for domains without specific templates
  function generateDefaultSkills(domainName, domainSlug) {
    const types = ["prompt", "agent", "tool", "template", "workflow", "rpa"];
    const skills = [];
    const actions = ["Generator", "Analyzer", "Optimizer", "Automator", "Assistant", "Builder", "Reviewer", "Planner", "Tracker", "Reporter"];
    
    for (let i = 0; i < 10; i++) {
      const action = actions[i];
      const type = types[i % types.length];
      const skillName = `${domainName} ${action}`;
      const skillSlug = `${domainSlug}-${action.toLowerCase()}`;
      
      skills.push({
        name: skillName,
        slug: skillSlug,
        type,
        desc: `Professional AI-powered ${action.toLowerCase()} for ${domainName.toLowerCase()}. Automates complex ${domainName.toLowerCase()} tasks with enterprise-grade accuracy and comprehensive output.`,
        readme: `# ${skillName}\n\nA professional ${type} for ${domainName.toLowerCase()} workflows.\n\n## Features\n- Automated ${domainName.toLowerCase()} ${action.toLowerCase()} capabilities\n- Enterprise-grade accuracy and reliability\n- Customizable output formats\n- Integration with popular ${domainName.toLowerCase()} tools\n- Multi-language support\n\n## Usage\n\`\`\`\nskillshub install skillsai/${skillSlug}\n\`\`\`\n\n## Configuration\nConfigure through the settings panel or via JSON config file.\n\n## Examples\nSee the \`examples/\` directory for usage examples.`,
        tags: [domainSlug, action.toLowerCase(), type, "ai-powered"]
      });
    }
    return skills;
  }

  const specificSkills = skillTemplates[domain.slug];
  const skillsData = specificSkills || generateDefaultSkills(domain.name, domain.slug);
  
  return skillsData.map((s, idx) => ({
    ...s,
    categoryId,
    author: "skillsai",
    readme: s.readme || `# ${s.name}\n\nA professional ${s.type || 'tool'} for ${domain.name.toLowerCase()}.\n\n## Features\n- Enterprise-grade ${domain.name.toLowerCase()} capabilities\n- Customizable configuration\n- Multi-format output support\n\n## Usage\n\`\`\`\nskillshub install skillsai/${s.slug}\n\`\`\``,
    downloads: Math.floor(Math.random() * 200000) + 5000,
    likes: Math.floor(Math.random() * 5000) + 100,
    forks: Math.floor(Math.random() * 500) + 10,
    stars: Math.floor(Math.random() * 3000) + 50,
    version: `${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
    compatibleModels: ["gpt-4o", "claude-3.5-sonnet", "gemini-pro", "llama-3.1"].slice(0, Math.floor(Math.random() * 3) + 2),
  }));
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================
async function main() {
  console.log("🗑️  Clearing existing data...");
  await conn.query("DELETE FROM skill_files");
  await conn.query("DELETE FROM skill_commits");
  await conn.query("DELETE FROM discussions");
  await conn.query("DELETE FROM discussion_replies");
  await conn.query("DELETE FROM likes");
  await conn.query("DELETE FROM skills");
  await conn.query("DELETE FROM categories");

  console.log("📁 Inserting 50 domains with hierarchical sub-categories...");
  
  let totalSkills = 0;
  let categoryOrder = 0;

  for (const domain of domains) {
    categoryOrder++;
    // Insert top-level category
    const [topResult] = await conn.query(
      "INSERT INTO categories (name, slug, description, icon, color, parentId, level, sortOrder) VALUES (?, ?, ?, ?, ?, NULL, 0, ?)",
      [domain.name, domain.slug, `Professional AI skills for ${domain.name.toLowerCase()}`, domain.icon, domain.color, categoryOrder]
    );
    const topId = topResult.insertId;

    // Insert sub-categories (level 1)
    for (const sub of (domain.subs || [])) {
      const [subResult] = await conn.query(
        "INSERT INTO categories (name, slug, description, icon, color, parentId, level, sortOrder) VALUES (?, ?, ?, ?, ?, ?, 1, ?)",
        [sub.name, sub.slug, `${sub.name} skills and tools`, domain.icon, domain.color, topId, categoryOrder]
      );
      const subId = subResult.insertId;

      // Insert sub-sub-categories (level 2)
      for (const subSub of (sub.subs || [])) {
        const subSubSlug = subSub.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        await conn.query(
          "INSERT INTO categories (name, slug, description, icon, color, parentId, level, sortOrder) VALUES (?, ?, ?, ?, ?, ?, 2, ?)",
          [subSub, `${sub.slug}-${subSubSlug}`, `${subSub} specialized skills`, domain.icon, domain.color, subId, categoryOrder]
        );
      }
    }

    // Generate and insert 10 skills for this domain
    const skillsData = generateSkillsForDomain(domain, topId, domain.subs);
    
    for (const skill of skillsData) {
      await conn.query(
        `INSERT INTO skills (name, slug, author, description, readme, type, categoryId, tags, license, version, downloads, likes, forks, stars, isPublic, isFeatured, compatibleModels) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'MIT', ?, ?, ?, ?, ?, 1, ?, ?)`,
        [
          skill.name, skill.slug, skill.author, skill.desc, skill.readme,
          skill.type || 'prompt', skill.categoryId,
          JSON.stringify(skill.tags || []),
          skill.version, skill.downloads, skill.likes, skill.forks, skill.stars,
          Math.random() > 0.8 ? 1 : 0,
          JSON.stringify(skill.compatibleModels || [])
        ]
      );
      totalSkills++;
    }

    // Update skill count for top-level category
    await conn.query("UPDATE categories SET skillCount = ? WHERE id = ?", [skillsData.length, topId]);
    
    console.log(`  ✅ ${domain.name}: ${skillsData.length} skills, ${(domain.subs || []).length} sub-categories`);
  }

  // Generate skill files for each skill
  console.log("\n📄 Generating skill files...");
  const [allSkills] = await conn.query("SELECT id, name, slug, author, description, readme, type, tags FROM skills");
  
  for (const skill of allSkills) {
    const files = [
      { path: "/", name: "README.md", content: skill.readme || `# ${skill.name}\n\n${skill.description}`, mimeType: "text/markdown", isDir: false },
      { path: "/", name: "skill.json", content: JSON.stringify({
        name: skill.name,
        version: "1.0.0",
        description: skill.description,
        author: skill.author,
        type: skill.type,
        tags: typeof skill.tags === 'string' ? JSON.parse(skill.tags) : skill.tags,
        license: "MIT",
        main: "index.js",
        engines: { skillshub: ">=1.0.0" }
      }, null, 2), mimeType: "application/json", isDir: false },
      { path: "/", name: "index.js", content: `/**\n * ${skill.name}\n * ${skill.description}\n */\n\nexport default async function execute(input, context) {\n  // Skill implementation\n  const result = await context.llm.invoke({\n    messages: [\n      { role: "system", content: "You are a professional ${skill.type} assistant." },\n      { role: "user", content: input.prompt }\n    ]\n  });\n  return { output: result.content };\n}\n`, mimeType: "application/javascript", isDir: false },
      { path: "/", name: "config.yaml", content: `name: ${skill.name}\nversion: 1.0.0\ntype: ${skill.type}\ninput:\n  - name: prompt\n    type: string\n    required: true\noutput:\n  - name: output\n    type: string\n`, mimeType: "text/yaml", isDir: false },
      { path: "/", name: "examples", content: null, mimeType: null, isDir: true },
      { path: "/examples", name: "basic.json", content: JSON.stringify({ input: { prompt: `Example usage of ${skill.name}` }, expected_output: { output: "Example result" } }, null, 2), mimeType: "application/json", isDir: false },
      { path: "/", name: "tests", content: null, mimeType: null, isDir: true },
      { path: "/tests", name: "test.js", content: `import { describe, it, expect } from 'vitest';\nimport execute from '../index.js';\n\ndescribe('${skill.name}', () => {\n  it('should execute successfully', async () => {\n    const result = await execute({ prompt: 'test' }, { llm: { invoke: async () => ({ content: 'test result' }) } });\n    expect(result.output).toBeDefined();\n  });\n});\n`, mimeType: "application/javascript", isDir: false },
    ];

    for (const f of files) {
      await conn.query(
        "INSERT INTO skill_files (skillId, path, name, content, size, mimeType, isDirectory) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [skill.id, f.path, f.name, f.content, f.content ? f.content.length : 0, f.mimeType, f.isDir ? 1 : 0]
      );
    }
  }

  // Generate commit history for each skill
  console.log("📜 Generating commit history...");
  const commitMessages = [
    "Initial commit", "Add README documentation", "Update configuration",
    "Fix input validation", "Add examples", "Improve error handling",
    "Update dependencies", "Add unit tests", "Performance optimization",
    "Version bump", "Add multi-language support", "Fix edge cases"
  ];

  for (const skill of allSkills) {
    const numCommits = Math.floor(Math.random() * 8) + 3;
    for (let i = 0; i < numCommits; i++) {
      const hash = Array.from({length: 40}, () => '0123456789abcdef'[Math.floor(Math.random()*16)]).join('');
      const daysAgo = Math.floor(Math.random() * 365);
      const date = new Date(Date.now() - daysAgo * 86400000);
      await conn.query(
        "INSERT INTO skill_commits (skillId, hash, message, authorName, additions, deletions, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [skill.id, hash, commitMessages[i % commitMessages.length], skill.author, Math.floor(Math.random() * 100) + 1, Math.floor(Math.random() * 30), date]
      );
    }
  }

  // Generate some discussions
  console.log("💬 Generating discussions...");
  const discussionTitles = [
    "How to configure for production use?",
    "Feature request: Add batch processing",
    "Bug: Output format incorrect for edge cases",
    "Integration with other skills",
    "Performance benchmarks and comparison"
  ];

  for (const skill of allSkills.slice(0, 100)) {
    const numDiscussions = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < numDiscussions; i++) {
      await conn.query(
        "INSERT INTO discussions (title, content, status, targetType, targetId, replyCount) VALUES (?, ?, ?, 'skill', ?, ?)",
        [
          discussionTitles[i % discussionTitles.length],
          `This is a discussion about ${skill.name}. Looking for help with configuration and best practices.`,
          ['open', 'resolved', 'closed'][Math.floor(Math.random() * 3)],
          skill.id,
          Math.floor(Math.random() * 10)
        ]
      );
    }
  }

  console.log(`\n✅ Seed complete!`);
  console.log(`   📁 ${domains.length} top-level domains`);
  console.log(`   📂 ${domains.reduce((sum, d) => sum + (d.subs || []).length, 0)} sub-categories`);
  console.log(`   📂 ${domains.reduce((sum, d) => sum + (d.subs || []).reduce((s, sub) => s + (sub.subs || []).length, 0), 0)} sub-sub-categories`);
  console.log(`   🔧 ${totalSkills} skills`);
  console.log(`   📄 ${allSkills.length * 8} skill files`);
  
  await conn.end();
}

main().catch(err => { console.error(err); process.exit(1); });
