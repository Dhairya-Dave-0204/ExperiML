import {
  HelpCircle,
  Rocket,
  FolderKanban,
  Database,
  FlaskConical,
  Boxes,
  Target,
  FileText,
  UserCircle,
  ShieldCheck,
  Cpu,
  Sparkles,
} from "lucide-react";

const FAQ_DATA = [
  {
    id: "general",
    label: "General",
    icon: HelpCircle,
    questions: [
      {
        q: "What is ExperiML?",
        a: "ExperiML is a machine learning experiment management platform. It gives you one workspace to upload datasets, run and track experiments, compare models, generate predictions, and keep a clear record of what produced every result — instead of spreading that work across notebooks, folders, and memory.",
      },
      {
        q: "Why was it built?",
        a: "ML work is naturally iterative, but most tooling treats every run as a disposable script. Hyperparameters get forgotten, datasets get overwritten, and reproducing last month's best result turns into guesswork. ExperiML exists to make organization and reproducibility the default, not an afterthought.",
      },
      {
        q: "Who is it for?",
        a: "Students learning ML, developers building models into products, data scientists comparing approaches, researchers who need defensible results, and anyone experimenting with AI who wants their work to stay organized as it grows.",
      },
      {
        q: "Is it free?",
        a: "Yes — ExperiML is free for individuals and students. If team features or hosted infrastructure are introduced later, they'll be additive, not a paywall on the core experiment-tracking experience.",
      },
      {
        q: "Do I need ML experience to use it?",
        a: "No. ExperiML manages the organizational side of ML work — datasets, runs, comparisons, artifacts — rather than requiring you to already know a specific framework or workflow. It's a reasonable place to learn good experiment habits early.",
      },
    ],
  },
  {
    id: "getting-started",
    label: "Getting Started",
    icon: Rocket,
    questions: [
      {
        q: "How do I create my first project?",
        a: "From your dashboard, create a new project and give it a name that reflects what you're building — a project is simply a container for the datasets, experiments, and models that belong to one goal. From there you can upload a dataset and start your first experiment.",
      },
      {
        q: "What is the recommended workflow?",
        a: "Upload and version a dataset, define an experiment against it, run training, evaluate the result, and let the best-performing run produce your stored artifact and model. Predictions and reports build on top of whichever model you promote from that process.",
      },
      {
        q: "Can I organize multiple projects?",
        a: "Yes. Projects are independent — you can run a coursework project, a personal experiment, and a work-related one side by side, each with its own datasets, experiments, and models, without them interfering with each other.",
      },
      {
        q: "What if I'm not sure how to structure my first experiment?",
        a: "Start small — one dataset, one baseline model, one set of parameters. ExperiML is built to make iteration cheap, so refining your approach across several small runs is usually more productive than trying to design the perfect experiment up front.",
      },
    ],
  },
  {
    id: "projects",
    label: "Projects",
    icon: FolderKanban,
    questions: [
      {
        q: "What exactly is a project in ExperiML?",
        a: "A project groups everything related to one piece of work — its datasets, experiments, trained models, predictions, and reports — under a single, organized workspace.",
      },
      {
        q: "Can I have more than one active project at a time?",
        a: "Yes, there's no limit on how many projects you can maintain. Each one keeps its own history and structure, so switching between them doesn't create any cross-contamination of results.",
      },
      {
        q: "Can I archive or remove a project?",
        a: "Yes. Projects can be archived to keep your workspace focused on active work, or removed entirely if you no longer need them. Archiving is the safer option if you might want to reference the work later.",
      },
    ],
  },
  {
    id: "datasets",
    label: "Datasets",
    icon: Database,
    questions: [
      {
        q: "What is dataset versioning?",
        a: "Every time you upload a meaningfully different version of a dataset, ExperiML keeps it as a distinct, locked version rather than overwriting the previous one. This means a run from three weeks ago can always be traced back to the exact data it used.",
      },
      {
        q: "Can datasets be reused across experiments?",
        a: "Yes — a single dataset version can be attached to as many experiments as you like. Reusing the same version is exactly what makes comparisons between experiments meaningful.",
      },
      {
        q: "Can a dataset be replaced?",
        a: "You can upload a new version of a dataset, but existing versions aren't silently overwritten. This protects any experiment that already depends on the original version from breaking or silently changing meaning.",
      },
      {
        q: "What dataset formats are supported?",
        a: "Common tabular and file-based formats used in everyday ML work are supported. The focus is on making upload and versioning simple rather than requiring a specific pipeline or preprocessing step before data reaches the platform.",
      },
    ],
  },
  {
    id: "experiments",
    label: "Experiments",
    icon: FlaskConical,
    questions: [
      {
        q: "What is an experiment, exactly?",
        a: "An experiment is a single, defined attempt at a task — a specific dataset version, a specific set of parameters, and the training run that comes from combining them. It's the fundamental unit of work that ExperiML tracks.",
      },
      {
        q: "What information is stored for each experiment?",
        a: "Parameters, metrics, training progress, the dataset version used, and any artifacts the run produces are all logged automatically as the experiment executes — so nothing has to be manually written down afterward.",
      },
      {
        q: "Can experiments be compared side by side?",
        a: "Yes — comparing metrics, parameters, and outcomes across multiple runs is one of the platform's core features, so you can see exactly what changed between a baseline and an improved version.",
      },
      {
        q: "Can experiments actually be reproduced?",
        a: "Yes. Because the dataset version, parameters, and environment details are tied to each run, you can recreate the conditions that produced a given result rather than relying on memory or guesswork.",
      },
    ],
  },
  {
    id: "models",
    label: "Models",
    icon: Boxes,
    questions: [
      {
        q: "How are trained models managed?",
        a: "Every trained model is versioned and linked back to the experiment and dataset that produced it, so you always know exactly how a given model came to exist.",
      },
      {
        q: "Can I download trained models?",
        a: "Yes — model weights and associated artifacts can be downloaded directly from the platform for use outside of ExperiML, such as local inference or deployment elsewhere.",
      },
      {
        q: "Can I keep multiple versions of the same model?",
        a: "Yes. Model versioning is designed for exactly this — you can keep a baseline, an improved version, and a production candidate side by side without losing track of which is which.",
      },
    ],
  },
  {
    id: "predictions",
    label: "Predictions",
    icon: Target,
    questions: [
      {
        q: "How do predictions work?",
        a: "Select a trained model from your project, provide input data, and generate predictions directly within the platform — no separate deployment step required for basic inference.",
      },
      {
        q: "Can I run batch predictions?",
        a: "Yes — you can generate predictions across an entire dataset at once rather than one input at a time, which is useful for evaluating a model against a full validation or test set.",
      },
      {
        q: "Is prediction history stored?",
        a: "Yes. Every prediction run is recorded, including which model and inputs produced it, so past predictions remain reviewable rather than disappearing after you generate them.",
      },
    ],
  },
  {
    id: "reports",
    label: "Reports",
    icon: FileText,
    questions: [
      {
        q: "What kind of reports does ExperiML generate?",
        a: "Reports summarize an experiment or project — metrics, comparisons, and key findings — into a format that's easy to read or share, without needing to dig back through raw run data.",
      },
      {
        q: "Can reports be exported?",
        a: "Yes, reports are designed to be exported so you can share results with a supervisor, collaborator, or teammate who doesn't need direct access to the platform itself.",
      },
    ],
  },
  {
    id: "account",
    label: "Account",
    icon: UserCircle,
    questions: [
      {
        q: "How is my account data managed?",
        a: "Your account data — profile details, projects, and associated content — is tied to your account alone and stays under your control. There's no sharing of account data with third parties.",
      },
      {
        q: "Can I update my profile information?",
        a: "Yes, profile details can be updated at any time from your account settings, including basic information and preferences.",
      },
    ],
  },
  {
    id: "privacy",
    label: "Privacy",
    icon: ShieldCheck,
    questions: [
      {
        q: "Who owns the datasets I upload?",
        a: "You do, entirely. Uploading a dataset to ExperiML doesn't transfer ownership or grant any usage rights beyond storing and processing it so the platform can function for you.",
      },
      {
        q: "Is my data shared with anyone else?",
        a: "No. Your datasets, experiments, and models are private to your account by default and are not shared, sold, or used to train anything outside of your own workspace.",
      },
      {
        q: "Is ExperiML cloud-based?",
        a: "ExperiML runs as a web application with cloud-hosted infrastructure for storage and compute. The specifics of hosting may evolve, but the privacy commitment — your data stays yours — does not change.",
      },
    ],
  },
  {
    id: "technical",
    label: "Technical",
    icon: Cpu,
    questions: [
      {
        q: "Which technologies power ExperiML?",
        a: "The frontend is built with React and Tailwind CSS, the backend runs on Node.js and Express, and the machine learning service is powered by FastAPI and Python, with PostgreSQL handling persistent data.",
      },
      {
        q: "Which ML frameworks are supported?",
        a: "ExperiML is designed to work with common Python-based ML frameworks rather than locking you into one. The platform focuses on tracking and organizing your work, not replacing the framework you already use to build models.",
      },
      {
        q: "Does ExperiML work on mobile?",
        a: "The interface is responsive and usable on mobile browsers for reviewing experiments and results, though the primary workflow — uploading datasets and configuring runs — is built with desktop use in mind.",
      },
      {
        q: "Which browsers are supported?",
        a: "ExperiML works on current versions of Chrome, Firefox, Safari, and Edge. Using an up-to-date browser is recommended for the best experience.",
      },
    ],
  },
  {
    id: "future",
    label: "Future Plans",
    icon: Sparkles,
    questions: [
      {
        q: "What features are planned next?",
        a: "Deeper metrics visualization, expanded model comparison tooling, and more flexible reporting are all on the roadmap, alongside general polish based on how people actually use the platform.",
      },
      {
        q: "Will team collaboration be supported?",
        a: "Team-based workspaces are planned as a future addition, allowing shared projects and visibility across collaborators, building on the same structure individual projects already use.",
      },
      {
        q: "Will managed cloud deployment be available?",
        a: "Expanded hosted deployment options are being considered as the platform matures. Nothing is locked in yet, but the goal is to make moving from experimentation to production feel like a natural next step rather than a separate tool.",
      },
    ],
  },
];

export default FAQ_DATA;
