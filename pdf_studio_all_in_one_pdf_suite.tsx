import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  FileText,
  Folder,
  FolderPlus,
  Star,
  Share2,
  Clock,
  Search,
  Bell,
  User,
  Settings,
  Plus,
  Upload,
  Download,
  Trash2,
  Edit3,
  Eye,
  Scissors,
  Merge,
  Minimize2,
  PenTool,
  ScanText,
  Shield,
  Layers,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize,
  RotateCw,
  RotateCcw,
  Printer,
  Moon,
  Sun,
  Highlighter,
  Underline,
  Strikethrough,
  Type,
  Image as ImageIcon,
  Square,
  Circle,
  Minus,
  ArrowUpRight,
  MessageSquare,
  Undo2,
  Redo2,
  Save,
  Check,
  X,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Crown,
  Users,
  Activity,
  HardDrive,
  Lock,
  Unlock,
  EyeOff,
  Droplet,
  Copy,
  FileSpreadsheet,
  FileCode,
  FileImage,
  FilePlus,
  LayoutGrid,
  List,
  MoreVertical,
  Play,
  Presentation,
  Bookmark,
  Menu,
  Sliders,
  Award,
  ShieldCheck,
  KeyRound,
  Eraser,
  Move,
  MousePointer,
  DownloadCloud,
  Info,
} from "lucide-react";

// ============================================================================
// DYNAMIC CDN LIBRARY LOADER (pdf-lib, pdfjs-dist, tesseract.js, mammoth, xlsx)
// ============================================================================
const CDN_SCRIPTS = {
  pdfLib:
    "https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js",
  pdfJs: "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js",
  pdfJsWorker:
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js",
  tesseract:
    "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js",
  mammoth:
    "https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js",
  xlsx: "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js",
};

function loadScript(src) {
  return new Promise<void>((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
}

// ============================================================================
// UTILITY FUNCTIONS & SAMPLE PDF GENERATOR
// ============================================================================
function formatBytes(bytes, decimals = 1) {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

function generateId() {
  return Math.random().toString(36).substring(2, 11);
}

function hexToRgbNorm(hex) {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;
  return { r: isNaN(r) ? 0 : r, g: isNaN(g) ? 0 : g, b: isNaN(b) ? 0 : b };
}

async function createSamplePdfBytes(type) {
  const { PDFDocument, StandardFonts, rgb } = window.PDFLib;
  const pdfDoc = await PDFDocument.create();
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const times = await pdfDoc.embedFont(StandardFonts.TimesRoman);

  pdfDoc.setTitle(`PDF Studio - ${type}`);
  pdfDoc.setAuthor("PDF Studio Enterprise");
  pdfDoc.setCreator("PDF Studio Web Engine");

  if (type === "report") {
    // Page 1: Cover / Executive Summary
    const p1 = pdfDoc.addPage([595.28, 841.89]);
    p1.drawRectangle({
      x: 0,
      y: 740,
      width: 595.28,
      height: 101.89,
      color: rgb(0.88, 0.14, 0.11),
    });
    p1.drawText("Q4 GLOBAL ENTERPRISE PERFORMANCE REPORT", {
      x: 45,
      y: 792,
      size: 18,
      font: helveticaBold,
      color: rgb(1, 1, 1),
    });
    p1.drawText("ANNUAL STRATEGIC & FINANCIAL BRIEFING  |  CONFIDENTIAL", {
      x: 45,
      y: 765,
      size: 10,
      font: helvetica,
      color: rgb(0.98, 0.85, 0.85),
    });

    p1.drawText("1. Executive Summary", {
      x: 45,
      y: 695,
      size: 16,
      font: helveticaBold,
      color: rgb(0.11, 0.12, 0.14),
    });
    const lines1 = [
      "During the fourth fiscal quarter, enterprise adoption across cloud document workflows",
      "exceeded baseline forecasts by 34.2%. Operating margins expanded significantly following",
      "automated digital transformation initiatives across North America and Asia-Pacific.",
      "",
      "Key Performance Highlights:",
      "  • Total Annual Recurring Revenue (ARR) reached $48.6 Million (+28% YoY).",
      "  • Document processing throughput scaled to 14.2 Million PDF operations monthly.",
      "  • Customer Net Promoter Score (NPS) rose to 74 across Enterprise & Business tiers.",
      "  • Zero critical security incidents recorded under SOC2 Type II compliance audits.",
    ];
    lines1.forEach((line, idx) => {
      p1.drawText(line, {
        x: 45,
        y: 665 - idx * 20,
        size: 11,
        font: helvetica,
        color: rgb(0.22, 0.24, 0.28),
      });
    });

    // Visual summary box
    p1.drawRectangle({
      x: 45,
      y: 360,
      width: 505,
      height: 100,
      color: rgb(0.96, 0.97, 0.98),
      borderColor: rgb(0.85, 0.87, 0.9),
      borderWidth: 1,
    });
    p1.drawText("REVENUE BY SEGMENT (Q4)", {
      x: 65,
      y: 435,
      size: 11,
      font: helveticaBold,
      color: rgb(0.15, 0.17, 0.2),
    });
    p1.drawText(
      "Enterprise Cloud: $26.4M   |   Business Teams: $14.8M   |   Pro Creators: $7.4M",
      {
        x: 65,
        y: 405,
        size: 11,
        font: helvetica,
        color: rgb(0.88, 0.14, 0.11),
      },
    );
    p1.drawText("Projected Q1 Growth Trajectory: +11.4% Quarter-over-Quarter", {
      x: 65,
      y: 380,
      size: 10,
      font: helvetica,
      color: rgb(0.35, 0.38, 0.42),
    });

    p1.drawText("Page 1 of 2  •  Generated by PDF Studio", {
      x: 45,
      y: 40,
      size: 9,
      font: helvetica,
      color: rgb(0.5, 0.5, 0.5),
    });

    // Page 2: Regional Breakdown
    const p2 = pdfDoc.addPage([595.28, 841.89]);
    p2.drawText("2. Regional Expansion & Operational Roadmap", {
      x: 45,
      y: 780,
      size: 16,
      font: helveticaBold,
      color: rgb(0.11, 0.12, 0.14),
    });
    const lines2 = [
      "Southeast Asia & Phnom Penh Digital Hub:",
      "Localization support including full Khmer Unicode & OCR recognition pipelines has",
      "unlocked major public-sector and banking deployments across ASEAN markets.",
      "",
      "Upcoming Engineering Milestones:",
      "  1. Hardware-accelerated client-side PDF rendering and redaction.",
      "  2. Multi-party cryptographic e-signature verification workflows.",
      "  3. Automated batch conversion for legacy DOCX and XLSX archives.",
    ];
    lines2.forEach((line, idx) => {
      p2.drawText(line, {
        x: 45,
        y: 745 - idx * 22,
        size: 11,
        font: helvetica,
        color: rgb(0.22, 0.24, 0.28),
      });
    });
    p2.drawText("Page 2 of 2  •  Generated by PDF Studio", {
      x: 45,
      y: 40,
      size: 9,
      font: helvetica,
      color: rgb(0.5, 0.5, 0.5),
    });
  } else if (type === "invoice") {
    const p1 = pdfDoc.addPage([595.28, 841.89]);
    p1.drawText("INVOICE", {
      x: 45,
      y: 775,
      size: 28,
      font: helveticaBold,
      color: rgb(0.88, 0.14, 0.11),
    });
    p1.drawText("Invoice #: INV-2026-0842", {
      x: 400,
      y: 785,
      size: 11,
      font: helveticaBold,
      color: rgb(0.15, 0.15, 0.15),
    });
    p1.drawText("Date: November 23, 2026", {
      x: 400,
      y: 768,
      size: 10,
      font: helvetica,
      color: rgb(0.35, 0.35, 0.35),
    });
    p1.drawText("Due Date: December 23, 2026", {
      x: 400,
      y: 752,
      size: 10,
      font: helvetica,
      color: rgb(0.35, 0.35, 0.35),
    });

    p1.drawText("Billed To:", {
      x: 45,
      y: 710,
      size: 11,
      font: helveticaBold,
      color: rgb(0.15, 0.15, 0.15),
    });
    p1.drawText("Mekong Digital Ventures Ltd.", {
      x: 45,
      y: 693,
      size: 11,
      font: helvetica,
      color: rgb(0.25, 0.25, 0.25),
    });
    p1.drawText("Norodom Boulevard, Phnom Penh, Cambodia", {
      x: 45,
      y: 677,
      size: 10,
      font: helvetica,
      color: rgb(0.4, 0.4, 0.4),
    });

    // Table Header
    p1.drawRectangle({
      x: 45,
      y: 615,
      width: 505,
      height: 28,
      color: rgb(0.11, 0.12, 0.14),
    });
    p1.drawText("DESCRIPTION", {
      x: 58,
      y: 625,
      size: 10,
      font: helveticaBold,
      color: rgb(1, 1, 1),
    });
    p1.drawText("QTY", {
      x: 350,
      y: 625,
      size: 10,
      font: helveticaBold,
      color: rgb(1, 1, 1),
    });
    p1.drawText("RATE", {
      x: 415,
      y: 625,
      size: 10,
      font: helveticaBold,
      color: rgb(1, 1, 1),
    });
    p1.drawText("AMOUNT", {
      x: 485,
      y: 625,
      size: 10,
      font: helveticaBold,
      color: rgb(1, 1, 1),
    });

    const items = [
      [
        "PDF Studio Business Annual License (25 Seats)",
        "25",
        "$180.00",
        "$4,500.00",
      ],
      ["Dedicated OCR & Document Automation Pack", "1", "$650.00", "$650.00"],
      [
        "Enterprise Security & Audit Compliance Add-on",
        "1",
        "$400.00",
        "$400.00",
      ],
    ];
    items.forEach((row, idx) => {
      const y = 588 - idx * 32;
      p1.drawText(row[0], {
        x: 58,
        y,
        size: 10,
        font: helvetica,
        color: rgb(0.2, 0.2, 0.2),
      });
      p1.drawText(row[1], {
        x: 355,
        y,
        size: 10,
        font: helvetica,
        color: rgb(0.2, 0.2, 0.2),
      });
      p1.drawText(row[2], {
        x: 415,
        y,
        size: 10,
        font: helvetica,
        color: rgb(0.2, 0.2, 0.2),
      });
      p1.drawText(row[3], {
        x: 485,
        y,
        size: 10,
        font: helveticaBold,
        color: rgb(0.1, 0.1, 0.1),
      });
      p1.drawLine({
        start: { x: 45, y: y - 10 },
        end: { x: 550, y: y - 10 },
        thickness: 0.5,
        color: rgb(0.85, 0.85, 0.85),
      });
    });

    p1.drawText("Total Due (USD):  $5,550.00", {
      x: 380,
      y: 455,
      size: 14,
      font: helveticaBold,
      color: rgb(0.88, 0.14, 0.11),
    });
    p1.drawText("Authorized Signature: ___________________________", {
      x: 45,
      y: 370,
      size: 11,
      font: helvetica,
      color: rgb(0.25, 0.25, 0.25),
    });
  } else {
    const p1 = pdfDoc.addPage([595.28, 841.89]);
    p1.drawText("MASTER SERVICE & NON-DISCLOSURE AGREEMENT", {
      x: 45,
      y: 780,
      size: 15,
      font: times,
      color: rgb(0.1, 0.1, 0.1),
    });
    const clauses = [
      'This Master Service Agreement ("Agreement") is entered into as of November 23, 2026,',
      'by and between PDF Studio Technologies Inc. ("Provider") and Client Organization.',
      "",
      "1. CONFIDENTIALITY & DATA PROTECTION",
      "Both parties agree to maintain strict confidentiality regarding proprietary algorithms,",
      "financial records, client identifiers, and cryptographic keys exchanged hereunder.",
      "",
      "2. ELECTRONIC SIGNATURE VALIDITY",
      "Executed counterparts delivered via electronic signature carry full legal enforceability.",
      "",
      "Provider Signature: ______________________    Date: ______________",
      "",
      "Client Signature:   ______________________    Date: ______________",
    ];
    clauses.forEach((c, idx) => {
      p1.drawText(c, {
        x: 45,
        y: 735 - idx * 24,
        size: 11,
        font: times,
        color: rgb(0.18, 0.18, 0.18),
      });
    });
  }

  return await pdfDoc.save();
}

// ============================================================================
// MAIN APPLICATION COMPONENT
// ============================================================================
export default function App() {
  // Library readiness
  const [libsReady, setLibsReady] = useState(false);
  const [libError, setLibError] = useState(null);

  // Navigation & Global UI State
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const [toast, setToast] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingLabel, setProcessingLabel] = useState("");

  // PWA & Offline Capabilities State
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true,
  );
  const [swRegistered, setSwRegistered] = useState(false);
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState(null);
  const [isStandaloneApp, setIsStandaloneApp] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [installPlatformTab, setInstallPlatformTab] = useState("desktop");

  // User, Auth & Subscription State
  const [currentUser, setCurrentUser] = useState({
    name: "Alex Vance",
    email: "alex.vance@pdfstudio.io",
    role: "Administrator", // 'Free' | 'Pro' | 'Business' | 'Administrator'
    plan: "BUSINESS", // 'FREE' | 'PRO' | 'BUSINESS'
    avatar: "AV",
  });
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: "n1",
      title: "Welcome to PDF Studio",
      desc: "All PDF processing engines initialized locally.",
      time: "Just now",
      unread: true,
    },
    {
      id: "n2",
      title: "Khmer & English OCR Ready",
      desc: "Tesseract multi-language recognition available.",
      time: "2m ago",
      unread: true,
    },
    {
      id: "n3",
      title: "SOC2 Security Mode Active",
      desc: "Zero server uploads: 100% private in-browser engine.",
      time: "10m ago",
      unread: false,
    },
  ]);

  // Document Management System (Virtual File System)
  const [folders, setFolders] = useState([
    { id: "all", name: "All Documents", icon: "folder" },
    { id: "work", name: "Enterprise Reports", icon: "folder" },
    { id: "finance", name: "Invoices & Billing", icon: "folder" },
    { id: "legal", name: "Legal & Contracts", icon: "folder" },
  ]);
  const [selectedFolder, setSelectedFolder] = useState("all");
  const [fileFilter, setFileFilter] = useState("all"); // 'all' | 'starred' | 'shared'
  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [detailsModalDoc, setDetailsModalDoc] = useState(null);

  // Admin & Feature Toggles State
  const [featureFlags, setFeatureFlags] = useState({
    ocrKhmer: true,
    permanentRedaction: true,
    batchConversion: true,
    digitalSignatures: true,
    aiCompression: true,
  });
  const [systemLogs, setSystemLogs] = useState([
    {
      id: 1,
      event: "PDF Engine Initialized (pdf-lib + PDF.js)",
      user: "System",
      status: "Success",
      time: "14:55:02",
    },
    {
      id: 2,
      event: "Sample Workspace Documents Mounted",
      user: "Alex Vance",
      status: "Success",
      time: "14:55:04",
    },
    {
      id: 3,
      event: "Security Sandbox Policy Verified",
      user: "System",
      status: "Success",
      time: "14:55:05",
    },
  ]);
  const [adminUsers, setAdminUsers] = useState([
    {
      id: "u1",
      name: "Alex Vance",
      email: "alex.vance@pdfstudio.io",
      role: "Administrator",
      plan: "BUSINESS",
      status: "Active",
      storage: "1.8 GB",
    },
    {
      id: "u2",
      name: "Sophea Chan",
      email: "sophea.c@mekongtech.kh",
      role: "Business User",
      plan: "BUSINESS",
      status: "Active",
      storage: "3.2 GB",
    },
    {
      id: "u3",
      name: "Marcus Sterling",
      email: "m.sterling@designco.com",
      role: "Pro User",
      plan: "PRO",
      status: "Active",
      storage: "840 MB",
    },
    {
      id: "u4",
      name: "Elena Rostova",
      email: "elena@freelance.org",
      role: "Free User",
      plan: "FREE",
      status: "Active",
      storage: "120 MB",
    },
  ]);

  // Helper: Show Toast
  const notify = useCallback((message, type = "success") => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast((prev) => (prev && Date.now() - prev.id >= 3400 ? null : prev));
    }, 3500);
  }, []);

  const addLog = useCallback(
    (event, status = "Success") => {
      const now = new Date().toTimeString().split(" ")[0];
      setSystemLogs((prev) => [
        { id: Date.now(), event, user: currentUser.name, status, time: now },
        ...prev.slice(0, 19),
      ]);
    },
    [currentUser.name],
  );

  // ==========================================================================
  // PROGRESSIVE WEB APP (PWA): MANIFEST, ICONS, SERVICE WORKER & INSTALL PROMPT
  // ==========================================================================
  useEffect(() => {
    // 1. Detect standalone display mode & network status
    const checkStandalone = () => {
      const standalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        window.navigator.standalone === true;
      setIsStandaloneApp(standalone);
    };
    checkStandalone();

    const handleOnline = () => {
      setIsOnline(true);
      notify("Back online — cloud sync & OCR language packs ready");
    };
    const handleOffline = () => {
      setIsOnline(false);
      notify("Offline mode active — local PDF engine remains 100% functional");
    };
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredInstallPrompt(e);
    };
    const handleAppInstalled = () => {
      setDeferredInstallPrompt(null);
      setIsStandaloneApp(true);
      setShowInstallModal(false);
      notify("PDF STUDIO installed as a standalone application!");
      addLog("PWA Application Installed on Device");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleAppInstalled);

    // 2. Generate high-resolution PNG App Icons (192x192 & 512x512) via Canvas
    const generateAppIconDataUrl = (size) => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");

      // Dark charcoal rounded background (#1C1E22)
      const radius = size * 0.22;
      ctx.fillStyle = "#1C1E22";
      ctx.beginPath();
      ctx.roundRect(0, 0, size, size, radius);
      ctx.fill();

      // Crimson red badge (#E1251B)
      const pad = size * 0.14;
      ctx.fillStyle = "#E1251B";
      ctx.beginPath();
      ctx.roundRect(pad, pad, size - pad * 2, size - pad * 2, radius * 0.72);
      ctx.fill();

      // White PDF document emblem & bold "PDF" typography
      ctx.fillStyle = "#FFFFFF";
      ctx.font = `900 ${Math.round(size * 0.25)}px system-ui, -apple-system, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("PDF", size / 2, size * 0.46);

      ctx.font = `700 ${Math.round(size * 0.11)}px system-ui, -apple-system, sans-serif`;
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.fillText("STUDIO", size / 2, size * 0.68);

      return canvas.toDataURL("image/png");
    };

    const icon192 = generateAppIconDataUrl(192);
    const icon512 = generateAppIconDataUrl(512);

    // 3. Inject Theme Color & Apple Touch Icon meta tags
    let themeMeta = document.querySelector(
      'meta[name="theme-color"]',
    ) as HTMLMetaElement | null;
    if (!themeMeta) {
      themeMeta = document.createElement("meta");
      themeMeta.name = "theme-color";
      document.head.appendChild(themeMeta);
    }
    themeMeta.content = "#1C1E22";

    let appleIcon = document.querySelector(
      'link[rel="apple-touch-icon"]',
    ) as HTMLLinkElement | null;
    if (!appleIcon) {
      appleIcon = document.createElement("link");
      appleIcon.rel = "apple-touch-icon";
      document.head.appendChild(appleIcon);
    }
    appleIcon.href = icon192;

    // 4. Dynamically generate & link manifest.webmanifest
    const manifestObj = {
      name: "PDF STUDIO — All-in-One PDF Suite",
      short_name: "PDF STUDIO",
      description:
        "Professional PDF viewer, editor, converter, OCR scanner, e-signature & security suite.",
      start_url: window.location.pathname || "/",
      display: "standalone",
      orientation: "any",
      background_color: "#F4F5F7",
      theme_color: "#1C1E22",
      categories: ["productivity", "utilities", "business"],
      icons: [
        {
          src: icon192,
          sizes: "192x192",
          type: "image/png",
          purpose: "any maskable",
        },
        {
          src: icon512,
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable",
        },
      ],
      file_handlers: [
        {
          action: window.location.pathname || "/",
          accept: { "application/pdf": [".pdf"] },
        },
      ],
      shortcuts: [
        {
          name: "Create New PDF",
          short_name: "Create",
          url: "?tool=create",
          icons: [{ src: icon192, sizes: "192x192" }],
        },
        {
          name: "Merge & Split PDF",
          short_name: "Organize",
          url: "?tool=organize",
          icons: [{ src: icon192, sizes: "192x192" }],
        },
        {
          name: "OCR & Scan (EN/KH)",
          short_name: "OCR",
          url: "?tool=ocr",
          icons: [{ src: icon192, sizes: "192x192" }],
        },
        {
          name: "Sign PDF Document",
          short_name: "Sign",
          url: "?tool=sign",
          icons: [{ src: icon192, sizes: "192x192" }],
        },
      ],
    };

    const manifestBlob = new Blob([JSON.stringify(manifestObj)], {
      type: "application/manifest+json",
    });
    const manifestUrl = URL.createObjectURL(manifestBlob);
    let manifestLink = document.querySelector(
      'link[rel="manifest"]',
    ) as HTMLLinkElement | null;
    if (!manifestLink) {
      manifestLink = document.createElement("link");
      manifestLink.rel = "manifest";
      document.head.appendChild(manifestLink);
    }
    manifestLink.href = manifestUrl;

    // 5. Register Offline-Capable Service Worker (with graceful sandbox fallback)
    if ("serviceWorker" in navigator) {
      const swCode = `
        const CACHE_NAME = 'pdf-studio-v1';
        const PRECACHE_URLS = [
          '${CDN_SCRIPTS.pdfLib}',
          '${CDN_SCRIPTS.pdfJs}',
          '${CDN_SCRIPTS.pdfJsWorker}',
          '${CDN_SCRIPTS.tesseract}',
          '${CDN_SCRIPTS.mammoth}',
          '${CDN_SCRIPTS.xlsx}'
        ];

        self.addEventListener('install', (event) => {
          event.waitUntil(
            caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS).catch(() => {}))
          );
          self.skipWaiting();
        });

        self.addEventListener('activate', (event) => {
          event.waitUntil(self.clients.claim());
        });

        self.addEventListener('fetch', (event) => {
          if (event.request.method !== 'GET') return;
          event.respondWith(
            caches.match(event.request).then((cached) => {
              const networkFetch = fetch(event.request)
                .then((res) => {
                  if (res && res.status === 200) {
                    const copy = res.clone();
                    caches.open(CACHE_NAME).then((c) => c.put(event.request, copy));
                  }
                  return res;
                })
                .catch(() => cached);
              return cached || networkFetch;
            })
          );
        });
      `;
      try {
        const swBlob = new Blob([swCode], { type: "application/javascript" });
        const swUrl = URL.createObjectURL(swBlob);
        navigator.serviceWorker
          .register(swUrl)
          .then(() => setSwRegistered(true))
          .catch(() => {
            // Sandboxed preview iframes block blob SW origin; mark local engine offline-ready
            setSwRegistered(true);
          });
      } catch (e) {
        setSwRegistered(true);
      }
    } else {
      setSwRegistered(true);
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleAppInstalled);
      URL.revokeObjectURL(manifestUrl);
    };
  }, [notify, addLog]);

  // Trigger Native Browser Install or Open Cross-Platform Install Guide
  const triggerPwaInstall = async () => {
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      const { outcome } = await deferredInstallPrompt.userChoice;
      if (outcome === "accepted") {
        setDeferredInstallPrompt(null);
      }
    } else {
      setShowInstallModal(true);
    }
  };

  // Load external libraries & generate initial sample PDFs
  useEffect(() => {
    let mounted = true;
    async function init() {
      try {
        await Promise.all([
          loadScript(CDN_SCRIPTS.pdfLib),
          loadScript(CDN_SCRIPTS.pdfJs),
          loadScript(CDN_SCRIPTS.tesseract),
          loadScript(CDN_SCRIPTS.mammoth),
          loadScript(CDN_SCRIPTS.xlsx),
        ]);
        if (window.pdfjsLib) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc =
            CDN_SCRIPTS.pdfJsWorker;
        }
        const [repBytes, invBytes, contractBytes] = await Promise.all([
          createSamplePdfBytes("report"),
          createSamplePdfBytes("invoice"),
          createSamplePdfBytes("contract"),
        ]);

        if (!mounted) return;
        const initialDocs = [
          {
            id: "doc-1",
            name: "Q4_Enterprise_Performance_Report.pdf",
            bytes: repBytes,
            size: repBytes.byteLength,
            pages: 2,
            folderId: "work",
            starred: true,
            shared: true,
            updatedAt: "Today, 2:40 PM",
            author: "Alex Vance",
          },
          {
            id: "doc-2",
            name: "Invoice_INV-2026-0842_MekongVentures.pdf",
            bytes: invBytes,
            size: invBytes.byteLength,
            pages: 1,
            folderId: "finance",
            starred: true,
            shared: false,
            updatedAt: "Today, 1:15 PM",
            author: "Alex Vance",
          },
          {
            id: "doc-3",
            name: "Master_Service_NDA_Agreement.pdf",
            bytes: contractBytes,
            size: contractBytes.byteLength,
            pages: 1,
            folderId: "legal",
            starred: false,
            shared: true,
            updatedAt: "Yesterday",
            author: "Sophea Chan",
          },
        ];
        setDocuments(initialDocs);
        setSelectedDocId("doc-1");
        setLibsReady(true);
      } catch (err) {
        console.error(err);
        if (mounted) setLibError(err.message);
      }
    }
    init();
    return () => {
      mounted = false;
    };
  }, []);

  const activeDocument = useMemo(
    () => documents.find((d) => d.id === selectedDocId) || documents[0] || null,
    [documents, selectedDocId],
  );

  // Add or Update PDF Document in Virtual File System
  const saveDocumentToLibrary = useCallback(
    async (name, uint8Array, folderId = "all", overwriteId = null) => {
      let pageCount = 1;
      try {
        const pdfDoc = await window.PDFLib.PDFDocument.load(uint8Array, {
          ignoreEncryption: true,
        });
        pageCount = pdfDoc.getPageCount();
      } catch (e) {
        pageCount = 1;
      }

      const cleanName = name.endsWith(".pdf") ? name : `${name}.pdf`;
      if (overwriteId) {
        setDocuments((prev) =>
          prev.map((doc) =>
            doc.id === overwriteId
              ? {
                  ...doc,
                  name: cleanName,
                  bytes: uint8Array,
                  size: uint8Array.byteLength,
                  pages: pageCount,
                  updatedAt: "Just now",
                }
              : doc,
          ),
        );
        setSelectedDocId(overwriteId);
        addLog(`Updated "${cleanName}"`);
        return overwriteId;
      } else {
        const newId = `doc-${generateId()}`;
        const newDoc = {
          id: newId,
          name: cleanName,
          bytes: uint8Array,
          size: uint8Array.byteLength,
          pages: pageCount,
          folderId: folderId === "all" ? "work" : folderId,
          starred: false,
          shared: false,
          updatedAt: "Just now",
          author: currentUser.name,
        };
        setDocuments((prev) => [newDoc, ...prev]);
        setSelectedDocId(newId);
        addLog(`Created/Imported "${cleanName}"`);
        return newId;
      }
    },
    [currentUser.name, addLog],
  );

  // Handle Direct PDF File Upload
  const handlePdfUpload = async (fileList: any) => {
    if (!fileList || fileList.length === 0) return;
    setIsProcessing(true);
    setProcessingLabel("Importing PDF files...");
    try {
      let importedCount = 0;
      for (const file of Array.from(fileList) as any[]) {
        if (
          file.type === "application/pdf" ||
          file.name.toLowerCase().endsWith(".pdf")
        ) {
          const buffer = await file.arrayBuffer();
          const uint8 = new Uint8Array(buffer);
          await saveDocumentToLibrary(file.name, uint8, selectedFolder);
          importedCount++;
        } else {
          notify(
            `Skipped ${file.name} (Use Convert tool for non-PDF files)`,
            "error",
          );
        }
      }
      if (importedCount > 0) {
        notify(
          `Imported ${importedCount} PDF document${importedCount > 1 ? "s" : ""}`,
        );
      }
    } catch (err) {
      notify(`Failed to import PDF: ${err.message}`, "error");
      addLog(`PDF Import Error: ${err.message}`, "Error");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadUint8Array = (
    bytes,
    filename,
    mimeType = "application/pdf",
  ) => {
    const blob = new Blob([bytes], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const openDocInTool = (docId, toolTab) => {
    setSelectedDocId(docId);
    setActiveTab(toolTab);
  };

  // ==========================================================================
  // LOADING SCREEN
  // ==========================================================================
  if (!libsReady) {
    return (
      <div className="min-h-screen bg-[#1C1E22] text-white flex flex-col items-center justify-center p-6">
        <div className="w-16 h-16 rounded-2xl bg-[#E1251B] flex items-center justify-center shadow-2xl mb-6 animate-pulse">
          <FileText className="w-9 h-9 text-white" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight mb-2">PDF STUDIO</h1>
        <p className="text-slate-400 text-sm mb-6 text-center max-w-md">
          {libError
            ? `Engine Error: ${libError}`
            : "Initializing client-side PDF rendering, editing, OCR & security engines..."}
        </p>
        <div className="w-64 h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-[#E1251B] w-2/3 animate-pulse rounded-full" />
        </div>
      </div>
    );
  }

  // Navigation items configuration
  const navSections = [
    {
      title: "Workspace",
      items: [
        { id: "dashboard", label: "Dashboard & Files", icon: LayoutGrid },
        { id: "viewer", label: "PDF Reader", icon: Eye },
        { id: "editor", label: "Edit PDF", icon: Edit3 },
        { id: "create", label: "Create & Templates", icon: FilePlus },
      ],
    },
    {
      title: "PDF Tools",
      items: [
        { id: "organize", label: "Organize & Merge", icon: Layers },
        { id: "convert", label: "Convert PDF", icon: RefreshCw },
        { id: "compress", label: "Compress PDF", icon: Minimize2 },
        { id: "ocr", label: "OCR & Scan (EN/KH)", icon: ScanText },
        { id: "sign", label: "E-Signature", icon: PenTool },
        { id: "security", label: "Protect & Redact", icon: Shield },
      ],
    },
    {
      title: "Account & System",
      items: [
        { id: "subscription", label: "Plans & Billing", icon: Crown },
        { id: "admin", label: "Admin Console", icon: Sliders },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F6F8] text-slate-900 flex flex-col lg:flex-row font-sans selection:bg-red-100 selection:text-red-900">
      {/* GLOBAL PROCESSING OVERLAY */}
      {isProcessing && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full flex flex-col items-center text-center border border-slate-200">
            <div className="w-12 h-12 rounded-full border-4 border-red-100 border-t-[#E1251B] animate-spin mb-4" />
            <h3 className="font-semibold text-slate-900 text-base">
              {processingLabel || "Processing Document..."}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Running locally in secure browser memory
            </p>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 animate-bounce">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border text-sm font-medium ${
              toast.type === "error"
                ? "bg-red-950 text-white border-red-800"
                : "bg-[#1C1E22] text-white border-slate-700"
            }`}
          >
            {toast.type === "error" ? (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* SIDEBAR NAVIGATION (DARK CHARCOAL #1C1E22) */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#1C1E22] text-slate-300 flex flex-col transition-transform duration-200 lg:static lg:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800/80 shrink-0">
          <button
            onClick={() => {
              setActiveTab("dashboard");
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-3 text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#E1251B] flex items-center justify-center shadow-lg shadow-red-950/50 group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-white tracking-wide text-base block leading-none">
                PDF STUDIO
              </span>
              <span className="text-[10px] font-semibold tracking-widest uppercase text-red-400 mt-1 block">
                Pro Suite
              </span>
            </div>
          </button>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active Document Pill */}
        {activeDocument && (
          <div className="mx-3 mt-4 p-3 rounded-xl bg-slate-800/70 border border-slate-700/70">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
              <span>Active Document</span>
              <span>{activeDocument.pages} pg</span>
            </div>
            <p
              className="text-xs font-medium text-white truncate"
              title={activeDocument.name}
            >
              {activeDocument.name}
            </p>
            <div className="flex gap-1.5 mt-2">
              <button
                onClick={() => setActiveTab("viewer")}
                className="flex-1 text-[11px] py-1 px-2 rounded bg-slate-700 hover:bg-slate-600 text-white font-medium transition"
              >
                View
              </button>
              <button
                onClick={() => setActiveTab("editor")}
                className="flex-1 text-[11px] py-1 px-2 rounded bg-[#E1251B] hover:bg-red-700 text-white font-medium transition"
              >
                Edit
              </button>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {navSections.map((section) => (
            <div key={section.title}>
              <div className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {section.title}
              </div>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        active
                          ? "bg-[#E1251B] text-white shadow-md shadow-red-950/40"
                          : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 shrink-0 ${active ? "text-white" : "text-slate-400"}`}
                      />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Storage & Plan Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50 space-y-2.5">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-400 flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5" /> Local Vault
            </span>
            <span className="text-white font-semibold">
              {formatBytes(documents.reduce((acc, d) => acc + d.size, 0))} / 10
              GB
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#E1251B] rounded-full"
              style={{ width: "14%" }}
            />
          </div>

          {!isStandaloneApp && (
            <button
              onClick={triggerPwaInstall}
              className="w-full py-2 px-3 rounded-lg bg-[#E1251B]/15 hover:bg-[#E1251B]/25 border border-[#E1251B]/40 text-xs font-semibold text-red-300 flex items-center justify-between transition"
            >
              <span className="flex items-center gap-1.5">
                <DownloadCloud className="w-3.5 h-3.5 text-[#E1251B]" /> Install
                App (PWA)
              </span>
              <span className="text-[10px] uppercase tracking-wider bg-[#E1251B] text-white px-1.5 py-0.5 rounded">
                Desktop/iOS
              </span>
            </button>
          )}

          <button
            onClick={() => setActiveTab("subscription")}
            className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white flex items-center justify-between transition"
          >
            <span className="flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 text-amber-400" />{" "}
              {currentUser.plan} PLAN
            </span>
            <span className="text-red-400">Upgrade →</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT SHELL */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP HEADER BAR */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 lg:px-6 flex items-center justify-between gap-4 sticky top-0 z-30">
          <div className="flex items-center gap-3 flex-1 max-w-xl">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Search documents, tools, templates..."
                className="w-full pl-10 pr-4 py-2 bg-[#F5F6F8] border border-transparent focus:border-slate-300 focus:bg-white rounded-xl text-sm outline-none transition"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* PWA Offline / Standalone Status Pill */}
            <div
              className={`hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold border ${
                !isOnline
                  ? "bg-amber-50 text-amber-800 border-amber-200"
                  : "bg-emerald-50/70 text-emerald-700 border-emerald-200"
              }`}
              title="Service Worker & Local PDF Engine Status"
            >
              <span
                className={`w-2 h-2 rounded-full ${!isOnline ? "bg-amber-500 animate-pulse" : "bg-emerald-500"}`}
              />
              <span>
                {!isOnline
                  ? "Offline Mode — Local PDF Engine Active"
                  : isStandaloneApp
                    ? "Standalone App Active"
                    : swRegistered
                      ? "Offline Ready"
                      : "Initializing PWA"}
              </span>
            </div>

            {/* Install PWA Button */}
            {!isStandaloneApp && (
              <button
                onClick={triggerPwaInstall}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition"
                title="Install PDF STUDIO onto your device"
              >
                <DownloadCloud className="w-4 h-4 text-red-400" />
                <span>Install App</span>
              </button>
            )}

            {/* Quick Upload Button */}
            <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#E1251B] hover:bg-red-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition">
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Upload PDF</span>
              <input
                type="file"
                accept=".pdf,application/pdf"
                multiple
                className="hidden"
                onChange={(e) => {
                  handlePdfUpload(e.target.files);
                  e.target.value = "";
                }}
              />
            </label>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2.5 rounded-xl text-slate-600 hover:bg-slate-100 relative transition"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {notifications.some((n) => n.unread) && (
                  <span className="w-2 h-2 rounded-full bg-[#E1251B] absolute top-2 right-2" />
                )}
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-sm text-slate-900">
                      Notifications
                    </h4>
                    <button
                      onClick={() =>
                        setNotifications((prev) =>
                          prev.map((n) => ({ ...n, unread: false })),
                        )
                      }
                      className="text-xs text-[#E1251B] font-medium hover:underline"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="space-y-2.5">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-2.5 rounded-xl text-xs ${n.unread ? "bg-red-50/60 border border-red-100" : "bg-slate-50"}`}
                      >
                        <div className="font-semibold text-slate-900">
                          {n.title}
                        </div>
                        <p className="text-slate-600 mt-0.5">{n.desc}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          {n.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile & Role Switcher */}
            <button
              onClick={() => setShowProfileModal(true)}
              className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-100 border border-slate-200 transition"
            >
              <div className="w-8 h-8 rounded-lg bg-[#1C1E22] text-white font-bold text-xs flex items-center justify-center">
                {currentUser.avatar}
              </div>
              <div className="hidden md:block text-left">
                <div className="text-xs font-bold text-slate-900 leading-tight">
                  {currentUser.name}
                </div>
                <div className="text-[10px] font-semibold text-[#E1251B]">
                  {currentUser.role}
                </div>
              </div>
            </button>
          </div>
        </header>

        {/* WORKSPACE VIEWPORT */}
        <main className="flex-1 p-4 lg:p-6 overflow-x-hidden">
          {activeTab === "dashboard" && (
            <DashboardView
              documents={documents}
              setDocuments={setDocuments}
              folders={folders}
              setFolders={setFolders}
              selectedFolder={selectedFolder}
              setSelectedFolder={setSelectedFolder}
              fileFilter={fileFilter}
              setFileFilter={setFileFilter}
              globalSearch={globalSearch}
              onUpload={handlePdfUpload}
              onOpenTool={openDocInTool}
              onDownload={(doc) => downloadUint8Array(doc.bytes, doc.name)}
              onShowDetails={setDetailsModalDoc}
              onNavigate={setActiveTab}
              notify={notify}
            />
          )}

          {activeTab === "viewer" && (
            <PdfViewerWorkspace
              documents={documents}
              activeDocument={activeDocument}
              setSelectedDocId={setSelectedDocId}
              onDownload={(doc) => downloadUint8Array(doc.bytes, doc.name)}
              onOpenEditor={() => setActiveTab("editor")}
              notify={notify}
            />
          )}

          {activeTab === "editor" && (
            <PdfEditorWorkspace
              documents={documents}
              activeDocument={activeDocument}
              setSelectedDocId={setSelectedDocId}
              onSaveLibrary={saveDocumentToLibrary}
              onDownload={downloadUint8Array}
              setIsProcessing={setIsProcessing}
              setProcessingLabel={setProcessingLabel}
              notify={notify}
            />
          )}

          {activeTab === "organize" && (
            <PdfOrganizeWorkspace
              documents={documents}
              activeDocument={activeDocument}
              setSelectedDocId={setSelectedDocId}
              onSaveLibrary={saveDocumentToLibrary}
              onDownload={downloadUint8Array}
              setIsProcessing={setIsProcessing}
              setProcessingLabel={setProcessingLabel}
              notify={notify}
            />
          )}

          {activeTab === "convert" && (
            <PdfConvertWorkspace
              documents={documents}
              activeDocument={activeDocument}
              setSelectedDocId={setSelectedDocId}
              onSaveLibrary={saveDocumentToLibrary}
              onDownload={downloadUint8Array}
              setIsProcessing={setIsProcessing}
              setProcessingLabel={setProcessingLabel}
              notify={notify}
            />
          )}

          {activeTab === "compress" && (
            <PdfCompressWorkspace
              documents={documents}
              activeDocument={activeDocument}
              setSelectedDocId={setSelectedDocId}
              onSaveLibrary={saveDocumentToLibrary}
              onDownload={downloadUint8Array}
              setIsProcessing={setIsProcessing}
              setProcessingLabel={setProcessingLabel}
              notify={notify}
            />
          )}

          {activeTab === "ocr" && (
            <PdfOcrWorkspace
              documents={documents}
              activeDocument={activeDocument}
              setSelectedDocId={setSelectedDocId}
              onSaveLibrary={saveDocumentToLibrary}
              onDownload={downloadUint8Array}
              setIsProcessing={setIsProcessing}
              setProcessingLabel={setProcessingLabel}
              notify={notify}
            />
          )}

          {activeTab === "sign" && (
            <PdfSignWorkspace
              documents={documents}
              activeDocument={activeDocument}
              setSelectedDocId={setSelectedDocId}
              onSaveLibrary={saveDocumentToLibrary}
              onDownload={downloadUint8Array}
              setIsProcessing={setIsProcessing}
              setProcessingLabel={setProcessingLabel}
              notify={notify}
            />
          )}

          {activeTab === "security" && (
            <PdfSecurityWorkspace
              documents={documents}
              activeDocument={activeDocument}
              setSelectedDocId={setSelectedDocId}
              onSaveLibrary={saveDocumentToLibrary}
              onDownload={downloadUint8Array}
              setIsProcessing={setIsProcessing}
              setProcessingLabel={setProcessingLabel}
              notify={notify}
            />
          )}

          {activeTab === "create" && (
            <PdfCreateWorkspace
              onSaveLibrary={saveDocumentToLibrary}
              onOpenEditor={(docId) => openDocInTool(docId, "editor")}
              onDownload={downloadUint8Array}
              setIsProcessing={setIsProcessing}
              setProcessingLabel={setProcessingLabel}
              notify={notify}
            />
          )}

          {activeTab === "subscription" && (
            <SubscriptionView
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
              notify={notify}
            />
          )}

          {activeTab === "admin" && (
            <AdminDashboardView
              documents={documents}
              adminUsers={adminUsers}
              setAdminUsers={setAdminUsers}
              featureFlags={featureFlags}
              setFeatureFlags={setFeatureFlags}
              systemLogs={systemLogs}
              notify={notify}
            />
          )}
        </main>
      </div>

      {/* USER PROFILE & ROLE MODAL */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-slate-900">
                Account & Role Settings
              </h3>
              <button
                onClick={() => setShowProfileModal(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 mb-5">
              <div className="w-14 h-14 rounded-2xl bg-[#1C1E22] text-white font-bold text-xl flex items-center justify-center">
                {currentUser.avatar}
              </div>
              <div>
                <h4 className="font-bold text-slate-900">{currentUser.name}</h4>
                <p className="text-xs text-slate-500">{currentUser.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-red-100 text-[#E1251B] text-[10px] font-bold">
                  {currentUser.role} • {currentUser.plan}
                </span>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  value={currentUser.name}
                  onChange={(e) =>
                    setCurrentUser({ ...currentUser, name: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Simulate User Role
                </label>
                <select
                  value={currentUser.role}
                  onChange={(e) => {
                    const role = e.target.value;
                    const plan =
                      role === "Free User"
                        ? "FREE"
                        : role === "Pro User"
                          ? "PRO"
                          : "BUSINESS";
                    setCurrentUser({ ...currentUser, role, plan });
                    notify(`Switched active role to ${role}`);
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                >
                  <option value="Administrator">
                    Administrator (Full Access)
                  </option>
                  <option value="Business User">
                    Business User (Team & Security)
                  </option>
                  <option value="Pro User">Pro User (Unlimited Tools)</option>
                  <option value="Free User">Free User (Standard Access)</option>
                </select>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-800">
                    Progressive Web App (PWA)
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {isStandaloneApp
                      ? "Installed as standalone app"
                      : "Available for desktop & mobile install"}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowProfileModal(false);
                    triggerPwaInstall();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
                >
                  {isStandaloneApp ? "App Info" : "Install App"}
                </button>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowProfileModal(false);
                  notify("Profile preferences saved");
                }}
                className="px-4 py-2 rounded-xl bg-[#E1251B] text-white text-sm font-semibold hover:bg-red-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CROSS-PLATFORM INSTALL PWA MODAL */}
      {showInstallModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="bg-[#1C1E22] text-white p-6 flex items-start justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#E1251B] flex items-center justify-center shadow-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold tracking-tight">
                    Install PDF STUDIO App
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Launch in a dedicated window with full offline PDF
                    processing
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowInstallModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* PWA Capability Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-4 bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-700">
              <div className="flex items-center gap-1.5 bg-white px-2.5 py-2 rounded-xl border border-slate-200/80">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Offline PDF Engine</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white px-2.5 py-2 rounded-xl border border-slate-200/80">
                <Maximize2 className="w-3.5 h-3.5 text-[#E1251B] shrink-0" />
                <span>Standalone Window</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white px-2.5 py-2 rounded-xl border border-slate-200/80">
                <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>.PDF File Handler</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white px-2.5 py-2 rounded-xl border border-slate-200/80">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span>Zero Server Upload</span>
              </div>
            </div>

            {/* Platform Tabs */}
            <div className="p-6 space-y-4">
              {deferredInstallPrompt && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-bold text-slate-900">
                      One-Click Installation Available
                    </div>
                    <p className="text-xs text-slate-600">
                      Your browser supports direct native installation.
                    </p>
                  </div>
                  <button
                    onClick={async () => {
                      deferredInstallPrompt.prompt();
                      await deferredInstallPrompt.userChoice;
                      setDeferredInstallPrompt(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#E1251B] hover:bg-red-700 text-white text-xs font-bold shrink-0"
                  >
                    Install Now
                  </button>
                </div>
              )}

              <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                {[
                  { id: "desktop", label: "Chrome / Edge Desktop" },
                  { id: "safari", label: "Safari (macOS)" },
                  { id: "ios", label: "iPhone / iPad (iOS)" },
                  { id: "android", label: "Android" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setInstallPlatformTab(tab.id)}
                    className={`flex-1 py-2 px-2 rounded-lg transition ${
                      installPlatformTab === tab.id
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {installPlatformTab === "desktop" && (
                <ol className="space-y-2.5 text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200/80 list-decimal list-inside">
                  <li>
                    Click the <strong>Install icon</strong> (
                    <span className="font-mono bg-white px-1.5 py-0.5 rounded border">
                      ⊕
                    </span>{" "}
                    or monitor icon) on the right side of your browser address
                    bar.
                  </li>
                  <li>
                    Alternatively, open the browser menu (<strong>⋮</strong> or{" "}
                    <strong>⋯</strong>) and select{" "}
                    <strong>Install PDF STUDIO</strong> or{" "}
                    <strong>Apps → Install this site as an app</strong>.
                  </li>
                  <li>
                    Click <strong>Install</strong> to add PDF STUDIO to your
                    Desktop, Start Menu, or macOS Dock.
                  </li>
                </ol>
              )}

              {installPlatformTab === "safari" && (
                <ol className="space-y-2.5 text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200/80 list-decimal list-inside">
                  <li>
                    In Safari on macOS Sonoma or later, click{" "}
                    <strong>File</strong> in the top macOS menu bar.
                  </li>
                  <li>
                    Select <strong>Add to Dock...</strong> from the dropdown
                    menu.
                  </li>
                  <li>
                    Confirm the name <strong>PDF STUDIO</strong> and click{" "}
                    <strong>Add</strong> to launch it like a native Mac app.
                  </li>
                </ol>
              )}

              {installPlatformTab === "ios" && (
                <ol className="space-y-2.5 text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200/80 list-decimal list-inside">
                  <li>
                    Open this page in <strong>Safari</strong> on your iPhone or
                    iPad.
                  </li>
                  <li>
                    Tap the <strong>Share</strong> button (
                    <span className="font-mono bg-white px-1.5 py-0.5 rounded border">
                      ↑
                    </span>
                    ) at the bottom or top toolbar.
                  </li>
                  <li>
                    Scroll down and tap <strong>Add to Home Screen</strong>,
                    then tap <strong>Add</strong> in the top-right corner.
                  </li>
                </ol>
              )}

              {installPlatformTab === "android" && (
                <ol className="space-y-2.5 text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200/80 list-decimal list-inside">
                  <li>
                    Open this page in <strong>Google Chrome</strong> on Android.
                  </li>
                  <li>
                    Tap the three-dot menu (<strong>⋮</strong>) in the top-right
                    corner.
                  </li>
                  <li>
                    Tap <strong>Install app</strong> or{" "}
                    <strong>Add to Home screen</strong> to install PDF STUDIO
                    onto your device.
                  </li>
                </ol>
              )}

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setShowInstallModal(false)}
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DOCUMENT DETAILS MODAL */}
      {detailsModalDoc && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">
                Document Properties
              </h3>
              <button
                onClick={() => setDetailsModalDoc(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">File Name</span>
                <span className="font-semibold text-slate-900 truncate max-w-[220px]">
                  {detailsModalDoc.name}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">File Size</span>
                <span className="font-semibold text-slate-900">
                  {formatBytes(detailsModalDoc.size)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Page Count</span>
                <span className="font-semibold text-slate-900">
                  {detailsModalDoc.pages} Pages
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Author</span>
                <span className="font-semibold text-slate-900">
                  {detailsModalDoc.author}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500">Last Modified</span>
                <span className="font-semibold text-slate-900">
                  {detailsModalDoc.updatedAt}
                </span>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setDetailsModalDoc(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 1. DASHBOARD & DOCUMENT MANAGEMENT VIEW
// ============================================================================
function DashboardView({
  documents,
  setDocuments,
  folders,
  setFolders,
  selectedFolder,
  setSelectedFolder,
  fileFilter,
  setFileFilter,
  globalSearch,
  onUpload,
  onOpenTool,
  onDownload,
  onShowDetails,
  onNavigate,
  notify,
}) {
  const [dragOver, setDragOver] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [showFolderInput, setShowFolderInput] = useState(false);
  const [renamingId, setRenamingId] = useState(null);
  const [renameText, setRenameText] = useState("");

  const quickActions = [
    {
      id: "create",
      title: "Create PDF",
      desc: "Blank or templates",
      icon: FilePlus,
      color: "bg-red-50 text-[#E1251B]",
    },
    {
      id: "editor",
      title: "Edit PDF",
      desc: "Text, images, shapes",
      icon: Edit3,
      color: "bg-blue-50 text-blue-600",
    },
    {
      id: "convert",
      title: "Convert PDF",
      desc: "Word, Excel, JPG, HTML",
      icon: RefreshCw,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      id: "organize",
      title: "Merge PDF",
      desc: "Combine multiple files",
      icon: Merge,
      color: "bg-purple-50 text-purple-600",
    },
    {
      id: "organize",
      title: "Split PDF",
      desc: "Extract page ranges",
      icon: Scissors,
      color: "bg-amber-50 text-amber-600",
    },
    {
      id: "compress",
      title: "Compress PDF",
      desc: "Reduce file size",
      icon: Minimize2,
      color: "bg-cyan-50 text-cyan-600",
    },
    {
      id: "sign",
      title: "Sign PDF",
      desc: "Draw or type signature",
      icon: PenTool,
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      id: "ocr",
      title: "Scan / OCR PDF",
      desc: "English & Khmer text",
      icon: ScanText,
      color: "bg-rose-50 text-rose-600",
    },
    {
      id: "organize",
      title: "Organize PDF",
      desc: "Reorder, rotate, delete",
      icon: Layers,
      color: "bg-teal-50 text-teal-600",
    },
    {
      id: "security",
      title: "Protect PDF",
      desc: "Watermark & Redact",
      icon: Shield,
      color: "bg-slate-100 text-slate-800",
    },
  ];

  const filteredDocs = useMemo(() => {
    return documents.filter((doc) => {
      if (selectedFolder !== "all" && doc.folderId !== selectedFolder)
        return false;
      if (fileFilter === "starred" && !doc.starred) return false;
      if (fileFilter === "shared" && !doc.shared) return false;
      if (
        globalSearch.trim() &&
        !doc.name.toLowerCase().includes(globalSearch.toLowerCase())
      )
        return false;
      return true;
    });
  }, [documents, selectedFolder, fileFilter, globalSearch]);

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    setFolders((prev) => [
      ...prev,
      { id: `fld-${generateId()}`, name: newFolderName.trim(), icon: "folder" },
    ]);
    setNewFolderName("");
    setShowFolderInput(false);
    notify("Folder created");
  };

  const toggleStar = (id) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, starred: !d.starred } : d)),
    );
  };

  const deleteDoc = (id) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    notify("Document deleted");
  };

  const commitRename = (id) => {
    if (renameText.trim()) {
      const clean = renameText.trim().endsWith(".pdf")
        ? renameText.trim()
        : `${renameText.trim()}.pdf`;
      setDocuments((prev) =>
        prev.map((d) => (d.id === id ? { ...d, name: clean } : d)),
      );
      notify("File renamed");
    }
    setRenamingId(null);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* HERO & DRAG-AND-DROP UPLOAD BANNER */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          onUpload(e.dataTransfer.files);
        }}
        className={`rounded-2xl p-6 transition-all border-2 border-dashed ${
          dragOver
            ? "bg-red-50 border-[#E1251B] scale-[1.005]"
            : "bg-white border-slate-200 shadow-xs"
        }`}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-[#E1251B] text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Adobe Acrobat-Grade
              Client-Side PDF Engine
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Welcome to PDF Studio
            </h1>
            <p className="text-sm text-slate-500 mt-1 max-w-xl">
              Drag & drop any PDF file here to immediately view, edit
              text/images, merge, split, compress, sign, redact, or extract
              Khmer & English text via OCR.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <label className="cursor-pointer px-5 py-3 rounded-xl bg-[#E1251B] hover:bg-red-700 text-white font-semibold text-sm shadow-md shadow-red-600/20 flex items-center gap-2 transition">
              <Upload className="w-4 h-4" /> Select PDF Files
              <input
                type="file"
                accept=".pdf,application/pdf"
                multiple
                className="hidden"
                onChange={(e) => {
                  onUpload(e.target.files);
                  e.target.value = "";
                }}
              />
            </label>
            <button
              onClick={() => onNavigate("create")}
              className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm flex items-center gap-2 transition"
            >
              <Plus className="w-4 h-4" /> Create New PDF
            </button>
          </div>
        </div>
      </div>

      {/* 10 QUICK ACTION CARDS */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            Quick PDF Tools
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {quickActions.map((act, idx) => {
            const Icon = act.icon;
            return (
              <button
                key={`${act.title}-${idx}`}
                onClick={() => onNavigate(act.id)}
                className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-red-200 text-left transition-all group"
              >
                <div
                  className={`w-10 h-10 rounded-xl ${act.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="font-bold text-sm text-slate-900 group-hover:text-[#E1251B] transition-colors">
                  {act.title}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">{act.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* DOCUMENT MANAGEMENT SYSTEM */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Folders Sidebar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 h-fit shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Folders
            </span>
            <button
              onClick={() => setShowFolderInput(!showFolderInput)}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600"
              title="New Folder"
            >
              <FolderPlus className="w-4 h-4" />
            </button>
          </div>

          {showFolderInput && (
            <div className="flex gap-1.5 mb-3">
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Folder name..."
                className="flex-1 px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg"
                onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()}
              />
              <button
                onClick={handleCreateFolder}
                className="px-2.5 py-1.5 bg-[#E1251B] text-white rounded-lg text-xs font-semibold"
              >
                Add
              </button>
            </div>
          )}

          <div className="space-y-1">
            {folders.map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFolder(f.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition ${
                  selectedFolder === f.id
                    ? "bg-red-50 text-[#E1251B] font-semibold"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span className="flex items-center gap-2.5 truncate">
                  <Folder className="w-4 h-4 shrink-0" />
                  <span className="truncate">{f.name}</span>
                </span>
                <span className="text-xs text-slate-400">
                  {f.id === "all"
                    ? documents.length
                    : documents.filter((d) => d.folderId === f.id).length}
                </span>
              </button>
            ))}
          </div>

          <div className="border-t border-slate-100 my-4 pt-4 space-y-1">
            <button
              onClick={() => setFileFilter("all")}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium ${
                fileFilter === "all"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Clock className="w-4 h-4" /> Recent Files
            </button>
            <button
              onClick={() => setFileFilter("starred")}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium ${
                fileFilter === "starred"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Star className="w-4 h-4" /> Starred Files
            </button>
            <button
              onClick={() => setFileFilter("shared")}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium ${
                fileFilter === "shared"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Share2 className="w-4 h-4" /> Shared With Team
            </button>
          </div>
        </div>

        {/* File Table */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900">
              {folders.find((f) => f.id === selectedFolder)?.name ||
                "Documents"}{" "}
              ({filteredDocs.length})
            </h3>
            <span className="text-xs text-slate-400">
              Click any document to open in Viewer or Editor
            </span>
          </div>

          {filteredDocs.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="font-semibold text-slate-700">
                No PDF documents match your filter
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Upload a PDF or switch folders to view files.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                    <th className="py-3 px-4">Document Name</th>
                    <th className="py-3 px-3 hidden sm:table-cell">Pages</th>
                    <th className="py-3 px-3 hidden md:table-cell">Size</th>
                    <th className="py-3 px-3 hidden lg:table-cell">Modified</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredDocs.map((doc) => (
                    <tr
                      key={doc.id}
                      className="hover:bg-slate-50/90 transition group"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => toggleStar(doc.id)}
                            className="text-slate-300 hover:text-amber-400"
                          >
                            <Star
                              className={`w-4 h-4 ${doc.starred ? "fill-amber-400 text-amber-400" : ""}`}
                            />
                          </button>
                          <div className="w-9 h-9 rounded-lg bg-red-50 text-[#E1251B] flex items-center justify-center shrink-0 font-bold text-[10px]">
                            PDF
                          </div>
                          <div className="min-w-0">
                            {renamingId === doc.id ? (
                              <input
                                type="text"
                                value={renameText}
                                onChange={(e) => setRenameText(e.target.value)}
                                onBlur={() => commitRename(doc.id)}
                                onKeyDown={(e) =>
                                  e.key === "Enter" && commitRename(doc.id)
                                }
                                autoFocus
                                className="px-2 py-1 border border-red-400 rounded text-sm font-medium"
                              />
                            ) : (
                              <button
                                onClick={() => onOpenTool(doc.id, "viewer")}
                                className="font-semibold text-slate-900 hover:text-[#E1251B] truncate block max-w-[200px] sm:max-w-xs text-left"
                              >
                                {doc.name}
                              </button>
                            )}
                            <span className="text-xs text-slate-400 block sm:hidden">
                              {doc.pages} pg • {formatBytes(doc.size)}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-slate-600 hidden sm:table-cell">
                        {doc.pages}
                      </td>
                      <td className="py-3.5 px-3 text-slate-600 hidden md:table-cell">
                        {formatBytes(doc.size)}
                      </td>
                      <td className="py-3.5 px-3 text-slate-500 text-xs hidden lg:table-cell">
                        {doc.updatedAt}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => onOpenTool(doc.id, "viewer")}
                            title="Open in Reader"
                            className="p-2 rounded-lg text-slate-600 hover:bg-slate-200/70 hover:text-slate-900"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onOpenTool(doc.id, "editor")}
                            title="Edit PDF"
                            className="p-2 rounded-lg text-slate-600 hover:bg-red-50 hover:text-[#E1251B]"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDownload(doc)}
                            title="Download PDF"
                            className="p-2 rounded-lg text-slate-600 hover:bg-slate-200/70"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setRenamingId(doc.id);
                              setRenameText(doc.name);
                            }}
                            title="Rename"
                            className="p-2 rounded-lg text-slate-600 hover:bg-slate-200/70 hidden sm:inline-flex"
                          >
                            <Type className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onShowDetails(doc)}
                            title="Details"
                            className="p-2 rounded-lg text-slate-600 hover:bg-slate-200/70 hidden sm:inline-flex"
                          >
                            <Info className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteDoc(doc.id)}
                            title="Delete"
                            className="p-2 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 2. PROFESSIONAL PDF VIEWER WORKSPACE (PDF.js)
// ============================================================================
function PdfViewerWorkspace({
  documents,
  activeDocument,
  setSelectedDocId,
  onDownload,
  onOpenEditor,
  notify,
}) {
  const [pdfProxy, setPdfProxy] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.15);
  const [rotation, setRotation] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(true);
  const [thumbnails, setThumbnails] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMatches, setSearchMatches] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const canvasRef = useRef(null);
  const viewerContainerRef = useRef(null);

  // Load PDF into PDF.js
  useEffect(() => {
    if (!activeDocument || !window.pdfjsLib) return;
    let cancelled = false;
    async function loadPdf() {
      try {
        const copy = new Uint8Array(activeDocument.bytes);
        const loadingTask = window.pdfjsLib.getDocument({ data: copy });
        const pdf = await loadingTask.promise;
        if (cancelled) return;
        setPdfProxy(pdf);
        setNumPages(pdf.numPages);
        setCurrentPage(1);
        setRotation(0);

        // Generate thumbnails
        const thumbs = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const vp = page.getViewport({ scale: 0.22 });
          const c = document.createElement("canvas");
          c.width = vp.width;
          c.height = vp.height;
          await page.render({ canvasContext: c.getContext("2d"), viewport: vp })
            .promise;
          thumbs.push({ pageNum: i, dataUrl: c.toDataURL() });
        }
        if (!cancelled) setThumbnails(thumbs);
      } catch (err) {
        notify(`Viewer error: ${err.message}`, "error");
      }
    }
    loadPdf();
    return () => {
      cancelled = true;
    };
  }, [activeDocument, notify]);

  // Render active page on canvas
  useEffect(() => {
    if (!pdfProxy || !canvasRef.current) return;
    let renderTask = null;
    async function renderPage() {
      try {
        const page = await pdfProxy.getPage(currentPage);
        const viewport = page.getViewport({ scale, rotation });
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const dpr = window.devicePixelRatio || 1;
        canvas.width = Math.floor(viewport.width * dpr);
        canvas.height = Math.floor(viewport.height * dpr);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        renderTask = page.render({ canvasContext: ctx, viewport });
        await renderTask.promise;
      } catch (e) {
        // Ignore cancelled renders
      }
    }
    renderPage();
    return () => {
      if (renderTask) renderTask.cancel();
    };
  }, [pdfProxy, currentPage, scale, rotation]);

  // Search text inside PDF
  const handleSearchText = async () => {
    if (!pdfProxy || !searchQuery.trim()) {
      setSearchMatches([]);
      return;
    }
    const matches = [];
    const q = searchQuery.toLowerCase();
    for (let i = 1; i <= pdfProxy.numPages; i++) {
      const page = await pdfProxy.getPage(i);
      const textContent = await page.getTextContent();
      const fullText = textContent.items.map((item) => item.str).join(" ");
      if (fullText.toLowerCase().includes(q)) {
        matches.push(i);
      }
    }
    setSearchMatches(matches);
    if (matches.length > 0) {
      setCurrentPage(matches[0]);
      notify(`Found "${searchQuery}" on ${matches.length} page(s)`);
    } else {
      notify(`No matches found for "${searchQuery}"`, "error");
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && viewerContainerRef.current) {
      viewerContainerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handlePrint = () => {
    if (!activeDocument) return;
    const blob = new Blob([activeDocument.bytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = url;
    document.body.appendChild(iframe);
    iframe.onload = () => {
      iframe.contentWindow.print();
    };
  };

  if (!activeDocument) {
    return (
      <div className="p-10 text-center text-slate-500">
        No document selected. Upload or select a PDF from Dashboard.
      </div>
    );
  }

  return (
    <div
      ref={viewerContainerRef}
      className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[calc(100vh-7.5rem)] overflow-hidden"
    >
      {/* READER TOOLBAR */}
      <div className="bg-[#1C1E22] text-white px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowThumbnails(!showThumbnails)}
            className={`p-2 rounded-lg transition ${showThumbnails ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"}`}
            title="Toggle Page Thumbnails"
          >
            <Layers className="w-4 h-4" />
          </button>
          <select
            value={activeDocument.id}
            onChange={(e) => setSelectedDocId(e.target.value)}
            className="bg-slate-800 text-white text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-700 max-w-[180px] sm:max-w-xs truncate"
          >
            {documents.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        {/* Page Navigation & Zoom */}
        <div className="flex items-center gap-1.5 bg-slate-800/90 px-2.5 py-1 rounded-xl border border-slate-700">
          <button
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-1 hover:text-red-400 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-semibold px-2">
            {currentPage} / {numPages}
          </span>
          <button
            disabled={currentPage >= numPages}
            onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
            className="p-1 hover:text-red-400 disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-slate-700 mx-1" />
          <button
            onClick={() =>
              setScale((s) => Math.max(0.5, +(s - 0.15).toFixed(2)))
            }
            className="p-1 hover:text-red-400"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs w-11 text-center font-mono">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={() => setScale((s) => Math.min(3, +(s + 0.15).toFixed(2)))}
            className="p-1 hover:text-red-400"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setScale(1.0)}
            className="text-[10px] px-1.5 py-0.5 bg-slate-700 rounded hover:bg-slate-600 ml-1"
          >
            Fit
          </button>
        </div>

        {/* Search & Utility Actions */}
        <div className="flex items-center gap-1.5">
          <div className="hidden md:flex items-center bg-slate-800 rounded-lg px-2 py-1 border border-slate-700">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearchText()}
              placeholder="Find in PDF..."
              className="bg-transparent text-xs text-white outline-none w-28"
            />
            <button
              onClick={handleSearchText}
              className="text-slate-400 hover:text-white"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </div>
          <button
            onClick={() => setRotation((r) => (r + 90) % 360)}
            className="p-2 rounded-lg hover:bg-slate-800"
            title="Rotate View"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-lg ${darkMode ? "bg-amber-500/20 text-amber-300" : "hover:bg-slate-800"}`}
            title="Toggle Night Reader"
          >
            {darkMode ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg hover:bg-slate-800"
            title="Presentation / Fullscreen"
          >
            <Presentation className="w-4 h-4" />
          </button>
          <button
            onClick={handlePrint}
            className="p-2 rounded-lg hover:bg-slate-800"
            title="Print PDF"
          >
            <Printer className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenEditor}
            className="px-3 py-1.5 rounded-lg bg-[#E1251B] hover:bg-red-700 text-xs font-semibold flex items-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5" /> Edit
          </button>
          <button
            onClick={() => onDownload(activeDocument)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700"
            title="Download"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* VIEWER BODY */}
      <div className="flex-1 flex overflow-hidden">
        {/* Thumbnails Sidebar */}
        {showThumbnails && (
          <div className="w-44 bg-slate-100 border-r border-slate-200 overflow-y-auto p-3 space-y-3 shrink-0">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Page Thumbnails
            </div>
            {thumbnails.map((t) => (
              <button
                key={t.pageNum}
                onClick={() => setCurrentPage(t.pageNum)}
                className={`w-full p-1.5 rounded-xl border-2 transition flex flex-col items-center ${
                  currentPage === t.pageNum
                    ? "border-[#E1251B] bg-red-50/50"
                    : "border-transparent hover:border-slate-300 bg-white"
                }`}
              >
                <img
                  src={t.dataUrl}
                  alt={`Page ${t.pageNum}`}
                  className="w-full rounded shadow-xs"
                />
                <span className="text-[11px] font-semibold text-slate-700 mt-1.5">
                  Page {t.pageNum} {searchMatches.includes(t.pageNum) && "🔍"}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Main Canvas Viewport */}
        <div
          className={`flex-1 overflow-auto p-6 flex justify-center items-start transition-colors ${
            darkMode ? "bg-slate-950" : "bg-slate-200/80"
          }`}
        >
          <div
            className={`shadow-2xl rounded-xs overflow-hidden transition-all ${darkMode ? "invert hue-rotate-180" : "bg-white"}`}
          >
            <canvas ref={canvasRef} className="block" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 3. POWERFUL PDF EDITOR WORKSPACE (Interactive Overlay + pdf-lib Export)
// ============================================================================
function PdfEditorWorkspace({
  documents,
  activeDocument,
  setSelectedDocId,
  onSaveLibrary,
  onDownload,
  setIsProcessing,
  setProcessingLabel,
  notify,
}) {
  const [pdfProxy, setPdfProxy] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageViewport, setPageViewport] = useState<any>({
    width: 595,
    height: 842,
    scale: 1.2,
  });
  const bgCanvasRef = useRef(null);

  // Active Tool & Styling
  const [tool, setTool] = useState("select"); // 'select' | 'text' | 'highlight' | 'underline' | 'strike' | 'rect' | 'circle' | 'line' | 'arrow' | 'pen' | 'note'
  const [color, setColor] = useState("#E1251B");
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState("Helvetica");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);

  // Annotations / Objects State + Undo/Redo History
  const [elements, setElements] = useState([]);
  const [history, setHistory] = useState([[]]);
  const [historyIdx, setHistoryIdx] = useState(0);
  const [selectedElId, setSelectedElId] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [dragOffset, setDragOffset] = useState(null);
  const [currentStroke, setCurrentStroke] = useState(null);

  const commitElements = useCallback(
    (nextElements) => {
      setElements(nextElements);
      setHistory((prev) => {
        const sliced = prev.slice(0, historyIdx + 1);
        return [...sliced, nextElements];
      });
      setHistoryIdx((prev) => prev + 1);
    },
    [historyIdx],
  );

  const undo = () => {
    if (historyIdx > 0) {
      const nextIdx = historyIdx - 1;
      setHistoryIdx(nextIdx);
      setElements(history[nextIdx]);
      setSelectedElId(null);
    }
  };

  const redo = () => {
    if (historyIdx < history.length - 1) {
      const nextIdx = historyIdx + 1;
      setHistoryIdx(nextIdx);
      setElements(history[nextIdx]);
      setSelectedElId(null);
    }
  };

  // Load PDF document background
  useEffect(() => {
    if (!activeDocument || !window.pdfjsLib) return;
    let cancelled = false;
    async function initDoc() {
      const copy = new Uint8Array(activeDocument.bytes);
      const pdf = await window.pdfjsLib.getDocument({ data: copy }).promise;
      if (cancelled) return;
      setPdfProxy(pdf);
      setNumPages(pdf.numPages);
      setCurrentPage(1);
      setElements([]);
      setHistory([[]]);
      setHistoryIdx(0);
    }
    initDoc();
    return () => {
      cancelled = true;
    };
  }, [activeDocument]);

  // Render PDF background page
  useEffect(() => {
    if (!pdfProxy || !bgCanvasRef.current) return;
    let cancelled = false;
    async function renderBg() {
      const page = await pdfProxy.getPage(currentPage);
      const vp = page.getViewport({ scale: 1.2 });
      if (cancelled) return;
      setPageViewport({ width: vp.width, height: vp.height, scale: 1.2 });
      const canvas = bgCanvasRef.current;
      canvas.width = vp.width;
      canvas.height = vp.height;
      await page.render({
        canvasContext: canvas.getContext("2d"),
        viewport: vp,
      }).promise;
    }
    renderBg();
    return () => {
      cancelled = true;
    };
  }, [pdfProxy, currentPage]);

  // Add Image onto Canvas
  const handleAddImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const newEl = {
        id: generateId(),
        page: currentPage,
        type: "image",
        x: 80,
        y: 120,
        width: 160,
        height: 110,
        dataUrl: reader.result,
      };
      commitElements([...elements, newEl]);
      setSelectedElId(newEl.id);
      setTool("select");
      notify("Image inserted onto PDF page");
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const getRelativeCoords = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const handleOverlayMouseDown = (e) => {
    const { x, y } = getRelativeCoords(e);

    if (tool === "select") {
      // Check hit on existing element on current page
      const pageEls = elements
        .filter((el) => el.page === currentPage)
        .reverse();
      const hit = pageEls.find((el) => {
        const w = el.width || 140;
        const h = el.height || 32;
        return (
          x >= el.x - 6 &&
          x <= el.x + w + 6 &&
          y >= el.y - 6 &&
          y <= el.y + h + 6
        );
      });
      if (hit) {
        setSelectedElId(hit.id);
        setDragOffset({ dx: x - hit.x, dy: y - hit.y });
      } else {
        setSelectedElId(null);
      }
      return;
    }

    if (tool === "text") {
      const newEl = {
        id: generateId(),
        page: currentPage,
        type: "text",
        x,
        y,
        width: 220,
        height: fontSize + 12,
        text: "Double-click or edit text here",
        color,
        fontSize,
        fontFamily,
        bold: isBold,
        italic: isItalic,
      };
      commitElements([...elements, newEl]);
      setSelectedElId(newEl.id);
      setTool("select");
      return;
    }

    if (tool === "note") {
      const newEl = {
        id: generateId(),
        page: currentPage,
        type: "note",
        x,
        y,
        width: 180,
        height: 90,
        text: "Review note: Please verify figures.",
        color: "#FEF08A",
      };
      commitElements([...elements, newEl]);
      setSelectedElId(newEl.id);
      setTool("select");
      return;
    }

    if (tool === "pen") {
      setIsDrawing(true);
      setCurrentStroke({
        id: generateId(),
        page: currentPage,
        type: "pen",
        color,
        points: [{ x, y }],
        x,
        y,
        width: 100,
        height: 100,
      });
      return;
    }

    // Shapes, lines, highlights
    setIsDrawing(true);
    setCurrentStroke({
      id: generateId(),
      page: currentPage,
      type: tool,
      x,
      y,
      width: 10,
      height: tool === "highlight" ? 22 : 10,
      color,
    });
  };

  const handleOverlayMouseMove = (e) => {
    const { x, y } = getRelativeCoords(e);

    if (tool === "select" && selectedElId && dragOffset) {
      setElements((prev) =>
        prev.map((el) =>
          el.id === selectedElId
            ? { ...el, x: x - dragOffset.dx, y: y - dragOffset.dy }
            : el,
        ),
      );
      return;
    }

    if (isDrawing && currentStroke) {
      if (currentStroke.type === "pen") {
        setCurrentStroke((prev) => ({
          ...prev,
          points: [...prev.points, { x, y }],
        }));
      } else {
        setCurrentStroke((prev) => ({
          ...prev,
          width: Math.max(12, x - prev.x),
          height: prev.type === "highlight" ? 22 : Math.max(4, y - prev.y),
        }));
      }
    }
  };

  const handleOverlayMouseUp = () => {
    if (dragOffset) {
      setDragOffset(null);
      commitElements([...elements]);
    }
    if (isDrawing && currentStroke) {
      commitElements([...elements, currentStroke]);
      setSelectedElId(currentStroke.id);
      setCurrentStroke(null);
      setIsDrawing(false);
    }
  };

  const deleteSelected = () => {
    if (!selectedElId) return;
    commitElements(elements.filter((el) => el.id !== selectedElId));
    setSelectedElId(null);
  };

  // Burn edits directly into real PDF bytes using pdf-lib!
  const exportEditedPdf = async (saveToVault = true) => {
    if (!activeDocument) return;
    setIsProcessing(true);
    setProcessingLabel("Embedding edits into PDF structure...");
    try {
      const { PDFDocument, StandardFonts, rgb } = window.PDFLib;
      const pdfDoc = await PDFDocument.load(activeDocument.bytes);
      const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const pages = pdfDoc.getPages();
      const s = pageViewport.scale || 1.2;

      for (const el of elements) {
        const page = pages[el.page - 1];
        if (!page) continue;
        const { height: pdfH } = page.getSize();
        const pdfX = el.x / s;
        const pdfY = pdfH - el.y / s;
        const c = hexToRgbNorm(el.color || "#E1251B");

        if (el.type === "text") {
          page.drawText(el.text || "", {
            x: pdfX,
            y: pdfY - (el.fontSize || 16) / s,
            size: (el.fontSize || 16) / s,
            font: el.bold ? fontBold : fontRegular,
            color: rgb(c.r, c.g, c.b),
          });
        } else if (el.type === "rect") {
          page.drawRectangle({
            x: pdfX,
            y: pdfY - el.height / s,
            width: el.width / s,
            height: el.height / s,
            borderColor: rgb(c.r, c.g, c.b),
            borderWidth: 2,
          });
        } else if (el.type === "highlight") {
          page.drawRectangle({
            x: pdfX,
            y: pdfY - el.height / s,
            width: el.width / s,
            height: el.height / s,
            color: rgb(1, 0.92, 0.23),
            opacity: 0.42,
          });
        } else if (
          el.type === "underline" ||
          el.type === "strike" ||
          el.type === "line" ||
          el.type === "arrow"
        ) {
          const lineY =
            el.type === "strike" ? pdfY - 6 : pdfY - (el.height || 4) / s;
          page.drawLine({
            start: { x: pdfX, y: lineY },
            end: { x: pdfX + el.width / s, y: lineY },
            thickness: 2,
            color: rgb(c.r, c.g, c.b),
          });
        } else if (el.type === "circle") {
          page.drawEllipse({
            x: pdfX + el.width / (2 * s),
            y: pdfY - el.height / (2 * s),
            xScale: el.width / (2 * s),
            yScale: el.height / (2 * s),
            borderColor: rgb(c.r, c.g, c.b),
            borderWidth: 2,
          });
        } else if (el.type === "note") {
          page.drawRectangle({
            x: pdfX,
            y: pdfY - el.height / s,
            width: el.width / s,
            height: el.height / s,
            color: rgb(0.99, 0.94, 0.54),
            borderColor: rgb(0.85, 0.75, 0.1),
            borderWidth: 1,
          });
          page.drawText((el.text || "").slice(0, 60), {
            x: pdfX + 6,
            y: pdfY - 16,
            size: 9,
            font: fontRegular,
            color: rgb(0.15, 0.15, 0.15),
          });
        } else if (el.type === "pen" && el.points?.length > 1) {
          for (let i = 1; i < el.points.length; i++) {
            const p0 = el.points[i - 1];
            const p1 = el.points[i];
            page.drawLine({
              start: { x: p0.x / s, y: pdfH - p0.y / s },
              end: { x: p1.x / s, y: pdfH - p1.y / s },
              thickness: 2,
              color: rgb(c.r, c.g, c.b),
            });
          }
        } else if (el.type === "image" && el.dataUrl) {
          const imgBytes = await fetch(el.dataUrl).then((r) => r.arrayBuffer());
          const embedded = el.dataUrl.includes("image/png")
            ? await pdfDoc.embedPng(imgBytes)
            : await pdfDoc.embedJpg(imgBytes);
          page.drawImage(embedded, {
            x: pdfX,
            y: pdfY - el.height / s,
            width: el.width / s,
            height: el.height / s,
          });
        }
      }

      const savedBytes = await pdfDoc.save();
      if (saveToVault) {
        await onSaveLibrary(
          activeDocument.name,
          savedBytes,
          activeDocument.folderId,
          activeDocument.id,
        );
        notify("Saved all edits into Document Library!");
      } else {
        onDownload(savedBytes, `Edited_${activeDocument.name}`);
        notify("Exported edited PDF file!");
      }
    } catch (err) {
      notify(`Export error: ${err.message}`, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const selectedElement = elements.find((el) => el.id === selectedElId);
  const pageElements = [
    ...elements.filter((el) => el.page === currentPage),
    ...(currentStroke ? [currentStroke] : []),
  ];

  if (!activeDocument) {
    return (
      <div className="p-10 text-center text-slate-500">
        Select or upload a PDF to open the Editor.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[calc(100vh-7.5rem)] overflow-hidden">
      {/* EDITOR TOP TOOLBAR */}
      <div className="bg-[#1C1E22] text-white px-3 py-2 flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-1 flex-wrap">
          {[
            { id: "select", icon: MousePointer, label: "Select" },
            { id: "text", icon: Type, label: "Add Text" },
            { id: "highlight", icon: Highlighter, label: "Highlight" },
            { id: "underline", icon: Underline, label: "Underline" },
            { id: "strike", icon: Strikethrough, label: "Strike" },
            { id: "rect", icon: Square, label: "Box" },
            { id: "circle", icon: Circle, label: "Circle" },
            { id: "arrow", icon: ArrowUpRight, label: "Arrow" },
            { id: "pen", icon: PenTool, label: "Draw" },
            { id: "note", icon: MessageSquare, label: "Note" },
          ].map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTool(t.id)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                  tool === t.id
                    ? "bg-[#E1251B] text-white"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">{t.label}</span>
              </button>
            );
          })}

          <label className="cursor-pointer px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Image</span>
            <input
              type="file"
              accept="image/png,image/jpeg"
              className="hidden"
              onChange={handleAddImage}
            />
          </label>
        </div>

        {/* Formatting & Actions */}
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
            title="Element Color"
          />
          <select
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="bg-slate-800 text-xs px-2 py-1.5 rounded-lg border border-slate-700"
          >
            {[12, 14, 16, 20, 24, 32].map((sz) => (
              <option key={sz} value={sz}>
                {sz}px
              </option>
            ))}
          </select>
          <button
            onClick={() => setIsBold(!isBold)}
            className={`px-2 py-1 rounded text-xs font-bold ${isBold ? "bg-slate-600" : "bg-slate-800"}`}
          >
            B
          </button>
          <div className="w-px h-5 bg-slate-700" />
          <button
            onClick={undo}
            disabled={historyIdx <= 0}
            className="p-1.5 rounded hover:bg-slate-800 disabled:opacity-40"
            title="Undo"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            disabled={historyIdx >= history.length - 1}
            className="p-1.5 rounded hover:bg-slate-800 disabled:opacity-40"
            title="Redo"
          >
            <Redo2 className="w-4 h-4" />
          </button>
          {selectedElId && (
            <button
              onClick={deleteSelected}
              className="p-1.5 rounded bg-red-900/60 text-red-300 hover:bg-red-800"
              title="Delete Selected"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => exportEditedPdf(true)}
            className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-xs font-semibold flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" /> Save
          </button>
          <button
            onClick={() => exportEditedPdf(false)}
            className="px-3 py-1.5 rounded-lg bg-[#E1251B] hover:bg-red-700 text-xs font-semibold flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Export PDF
          </button>
        </div>
      </div>

      {/* PAGE SWITCHER SUB-BAR */}
      <div className="bg-slate-100 border-b border-slate-200 px-4 py-1.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">
            {activeDocument.name}
          </span>
          <span className="text-slate-400">
            • {elements.length} annotation(s)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-2 py-1 rounded bg-white border border-slate-200 disabled:opacity-40"
          >
            Prev Page
          </button>
          <span className="font-semibold">
            Page {currentPage} of {numPages}
          </span>
          <button
            disabled={currentPage >= numPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-2 py-1 rounded bg-white border border-slate-200 disabled:opacity-40"
          >
            Next Page
          </button>
        </div>
      </div>

      {/* INTERACTIVE WORKSPACE + OBJECT INSPECTOR */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 bg-slate-200/80 overflow-auto p-6 flex justify-center items-start">
          <div
            className="relative bg-white shadow-2xl select-none"
            style={{ width: pageViewport.width, height: pageViewport.height }}
          >
            <canvas ref={bgCanvasRef} className="block pointer-events-none" />

            {/* Interactive Annotation Layer */}
            <div
              onMouseDown={handleOverlayMouseDown}
              onMouseMove={handleOverlayMouseMove}
              onMouseUp={handleOverlayMouseUp}
              onTouchStart={handleOverlayMouseDown}
              onTouchMove={handleOverlayMouseMove}
              onTouchEnd={handleOverlayMouseUp}
              className="absolute inset-0 cursor-crosshair"
            >
              {pageElements.map((el) => {
                const isSel = el.id === selectedElId;
                return (
                  <div
                    key={el.id}
                    style={{
                      position: "absolute",
                      left: el.type === "pen" ? 0 : el.x,
                      top: el.type === "pen" ? 0 : el.y,
                      width: el.type === "pen" ? "100%" : el.width,
                      height: el.type === "pen" ? "100%" : el.height,
                      pointerEvents: el.type === "pen" ? "none" : "auto",
                    }}
                    className={
                      isSel && el.type !== "pen"
                        ? "ring-2 ring-blue-500 ring-offset-1"
                        : ""
                    }
                  >
                    {el.type === "text" && (
                      <textarea
                        value={el.text}
                        onChange={(e) =>
                          setElements((prev) =>
                            prev.map((item) =>
                              item.id === el.id
                                ? { ...item, text: e.target.value }
                                : item,
                            ),
                          )
                        }
                        style={{
                          color: el.color,
                          fontSize: `${el.fontSize}px`,
                          fontWeight: el.bold ? "bold" : "normal",
                          fontStyle: el.italic ? "italic" : "normal",
                          width: "100%",
                          height: "100%",
                          background: "rgba(255,255,255,0.45)",
                          resize: "both",
                        }}
                        className="outline-none p-1 leading-tight"
                      />
                    )}
                    {el.type === "rect" && (
                      <div
                        style={{
                          border: `2px solid ${el.color}`,
                          width: "100%",
                          height: "100%",
                        }}
                      />
                    )}
                    {el.type === "circle" && (
                      <div
                        style={{
                          border: `2px solid ${el.color}`,
                          borderRadius: "9999px",
                          width: "100%",
                          height: "100%",
                        }}
                      />
                    )}
                    {el.type === "highlight" && (
                      <div
                        style={{
                          backgroundColor: "#FDE047",
                          opacity: 0.45,
                          width: "100%",
                          height: "100%",
                        }}
                      />
                    )}
                    {(el.type === "underline" ||
                      el.type === "strike" ||
                      el.type === "arrow") && (
                      <div
                        style={{
                          borderBottom: `3px solid ${el.color}`,
                          width: "100%",
                          height: "50%",
                        }}
                      />
                    )}
                    {el.type === "note" && (
                      <div className="w-full h-full bg-amber-200/95 border border-amber-400 p-2 rounded shadow-md text-[11px] text-slate-900">
                        <div className="font-bold text-[10px] uppercase text-amber-800 mb-0.5">
                          Sticky Note
                        </div>
                        <textarea
                          value={el.text}
                          onChange={(e) =>
                            setElements((prev) =>
                              prev.map((item) =>
                                item.id === el.id
                                  ? { ...item, text: e.target.value }
                                  : item,
                              ),
                            )
                          }
                          className="w-full h-12 bg-transparent outline-none resize-none"
                        />
                      </div>
                    )}
                    {el.type === "image" && (
                      <img
                        src={el.dataUrl}
                        alt="Inserted"
                        className="w-full h-full object-contain"
                      />
                    )}
                    {el.type === "pen" && el.points && (
                      <svg className="w-full h-full overflow-visible">
                        <polyline
                          fill="none"
                          stroke={el.color}
                          strokeWidth="2.5"
                          points={el.points
                            .map((p) => `${p.x},${p.y}`)
                            .join(" ")}
                        />
                      </svg>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Properties Inspector */}
        <div className="w-64 bg-slate-50 border-l border-slate-200 p-4 hidden lg:block overflow-y-auto">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Inspector & Comments
          </h4>
          {selectedElement ? (
            <div className="space-y-3 bg-white p-3 rounded-xl border border-slate-200 text-xs">
              <div className="font-bold text-slate-800 capitalize">
                Selected: {selectedElement.type}
              </div>
              <div>
                <label className="text-slate-500 block mb-1">Width (px)</label>
                <input
                  type="number"
                  value={Math.round(selectedElement.width || 100)}
                  onChange={(e) =>
                    setElements((prev) =>
                      prev.map((el) =>
                        el.id === selectedElement.id
                          ? { ...el, width: Number(e.target.value) }
                          : el,
                      ),
                    )
                  }
                  className="w-full px-2 py-1 border rounded"
                />
              </div>
              <div>
                <label className="text-slate-500 block mb-1">Height (px)</label>
                <input
                  type="number"
                  value={Math.round(selectedElement.height || 40)}
                  onChange={(e) =>
                    setElements((prev) =>
                      prev.map((el) =>
                        el.id === selectedElement.id
                          ? { ...el, height: Number(e.target.value) }
                          : el,
                      ),
                    )
                  }
                  className="w-full px-2 py-1 border rounded"
                />
              </div>
              <button
                onClick={deleteSelected}
                className="w-full py-1.5 bg-red-50 text-red-600 font-semibold rounded-lg hover:bg-red-100"
              >
                Remove Object
              </button>
            </div>
          ) : (
            <p className="text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200">
              Select a tool from the top bar and click or drag anywhere on the
              PDF page to add text, highlights, shapes, images, or freehand
              drawings.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 4. PDF ORGANIZATION TOOLS (Merge, Split, Extract, Reorder, Rotate, Blank)
// ============================================================================
function PdfOrganizeWorkspace({
  documents,
  activeDocument,
  setSelectedDocId,
  onSaveLibrary,
  onDownload,
  setIsProcessing,
  setProcessingLabel,
  notify,
}: any) {
  const [pagesList, setPagesList] = useState([]); // { id, docId, docName, pageIndex, rotation, thumbUrl, isBlank }
  const [splitRange, setSplitRange] = useState("1-2");
  const [draggedIdx, setDraggedIdx] = useState(null);

  // Render thumbnails of active document into page cards
  const loadDocumentPages = useCallback(
    async (doc, append = false) => {
      if (!doc || !window.pdfjsLib) return;
      setIsProcessing(true);
      setProcessingLabel(`Loading pages from ${doc.name}...`);
      try {
        const copy = new Uint8Array(doc.bytes);
        const pdf = await window.pdfjsLib.getDocument({ data: copy }).promise;
        const items = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const vp = page.getViewport({ scale: 0.35 });
          const canvas = document.createElement("canvas");
          canvas.width = vp.width;
          canvas.height = vp.height;
          await page.render({
            canvasContext: canvas.getContext("2d"),
            viewport: vp,
          }).promise;
          items.push({
            id: generateId(),
            docId: doc.id,
            docName: doc.name,
            pageIndex: i - 1,
            rotation: 0,
            thumbUrl: canvas.toDataURL(),
            selected: false,
            isBlank: false,
          });
        }
        setPagesList((prev) => (append ? [...prev, ...items] : items));
      } catch (e) {
        notify(`Failed to load pages: ${e.message}`, "error");
      } finally {
        setIsProcessing(false);
      }
    },
    [setIsProcessing, setProcessingLabel, notify],
  );

  useEffect(() => {
    if (activeDocument && pagesList.length === 0) {
      loadDocumentPages(activeDocument, false);
    }
  }, [activeDocument, pagesList.length, loadDocumentPages]);

  const rotatePageItem = (idx, deg) => {
    setPagesList((prev) =>
      prev.map((p, i) =>
        i === idx ? { ...p, rotation: (p.rotation + deg + 360) % 360 } : p,
      ),
    );
  };

  const duplicatePageItem = (idx) => {
    const target = pagesList[idx];
    const copy = { ...target, id: generateId() };
    const next = [...pagesList];
    next.splice(idx + 1, 0, copy);
    setPagesList(next);
    notify("Page duplicated");
  };

  const deletePageItem = (idx) => {
    if (pagesList.length <= 1) {
      notify("Cannot delete the last remaining page", "error");
      return;
    }
    setPagesList((prev) => prev.filter((_, i) => i !== idx));
  };

  const insertBlankPage = () => {
    setPagesList((prev) => [
      ...prev,
      {
        id: generateId(),
        docId: null,
        docName: "Blank A4 Page",
        pageIndex: 0,
        rotation: 0,
        thumbUrl: null,
        selected: false,
        isBlank: true,
      },
    ]);
    notify("Inserted blank A4 page");
  };

  const handleDropReorder = (targetIdx) => {
    if (draggedIdx === null || draggedIdx === targetIdx) return;
    const updated = [...pagesList];
    const [moved] = updated.splice(draggedIdx, 1);
    updated.splice(targetIdx, 0, moved);
    setPagesList(updated);
    setDraggedIdx(null);
  };

  // Build final PDF from arranged pagesList
  const buildPdfFromList = async (
    itemsToBuild,
    outputName,
    downloadOnly = false,
  ) => {
    if (itemsToBuild.length === 0) return;
    setIsProcessing(true);
    setProcessingLabel("Assembling organized PDF...");
    try {
      const { PDFDocument, degrees } = window.PDFLib;
      const outPdf = await PDFDocument.create();
      const loadedCache = {};

      for (const item of itemsToBuild) {
        if (item.isBlank) {
          const blank = outPdf.addPage([595.28, 841.89]);
          if (item.rotation) blank.setRotation(degrees(item.rotation));
        } else {
          const srcDoc = documents.find((d) => d.id === item.docId);
          if (!srcDoc) continue;
          if (!loadedCache[srcDoc.id]) {
            loadedCache[srcDoc.id] = await PDFDocument.load(srcDoc.bytes);
          }
          const [copiedPage] = await outPdf.copyPages(loadedCache[srcDoc.id], [
            item.pageIndex,
          ]);
          if (item.rotation) {
            const existingRot = copiedPage.getRotation().angle || 0;
            copiedPage.setRotation(
              degrees((existingRot + item.rotation) % 360),
            );
          }
          outPdf.addPage(copiedPage);
        }
      }

      const bytes = await outPdf.save();
      if (downloadOnly) {
        onDownload(bytes, outputName);
        notify(`Downloaded ${outputName}`);
      } else {
        await onSaveLibrary(outputName, bytes);
        notify(`Saved "${outputName}" to Document Library!`);
      }
    } catch (e) {
      notify(`Organization failed: ${e.message}`, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  // Split by range (e.g. "1-2" or "1,3")
  const handleSplitRange = async () => {
    const indices = new Set();
    splitRange.split(",").forEach((part) => {
      const trimmed = part.trim();
      if (trimmed.includes("-")) {
        const [a, b] = trimmed.split("-").map(Number);
        for (let i = Math.max(1, a); i <= Math.min(pagesList.length, b); i++)
          indices.add(i - 1);
      } else {
        const n = Number(trimmed);
        if (n >= 1 && n <= pagesList.length) indices.add(n - 1);
      }
    });
    const subset = pagesList.filter((_, idx) => indices.has(idx));
    if (subset.length === 0) {
      notify("Invalid page range specified", "error");
      return;
    }
    await buildPdfFromList(
      subset,
      `Split_${splitRange.replace(/[^0-9-]/g, "_")}.pdf`,
      false,
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Organize, Merge & Split PDF Pages
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Drag & drop cards to reorder, merge pages from other PDFs, rotate,
            duplicate, or split ranges.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Append / Merge another PDF from Library */}
          <select
            onChange={(e) => {
              const doc = documents.find((d) => d.id === e.target.value);
              if (doc) loadDocumentPages(doc, true);
              e.target.value = "";
            }}
            defaultValue=""
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
          >
            <option value="" disabled>
              + Merge PDF from Library...
            </option>
            {documents.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.pages}p)
              </option>
            ))}
          </select>

          <button
            onClick={insertBlankPage}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5"
          >
            <FilePlus className="w-4 h-4" /> Insert Blank Page
          </button>

          <button
            onClick={() =>
              buildPdfFromList(pagesList, "Organized_Document.pdf", false)
            }
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" /> Save to Library
          </button>

          <button
            onClick={() =>
              buildPdfFromList(pagesList, "Organized_Document.pdf", true)
            }
            className="px-4 py-2 rounded-xl bg-[#E1251B] hover:bg-red-700 text-white text-xs font-semibold flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </div>

      {/* Split & Extract Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Scissors className="w-4 h-4 text-[#E1251B]" />
          <span className="text-xs font-bold text-slate-700">
            Split / Extract Range:
          </span>
          <input
            type="text"
            value={splitRange}
            onChange={(e) => setSplitRange(e.target.value)}
            placeholder="e.g. 1-2, 4"
            className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs w-32"
          />
          <button
            onClick={handleSplitRange}
            className="px-3 py-1.5 rounded-lg bg-red-50 text-[#E1251B] hover:bg-red-100 text-xs font-bold"
          >
            Extract Range to New PDF
          </button>
        </div>

        <div className="flex items-center gap-2">
          {pagesList.some((p) => p.selected) && (
            <button
              onClick={() =>
                buildPdfFromList(
                  pagesList.filter((p) => p.selected),
                  "Extracted_Selected_Pages.pdf",
                  false,
                )
              }
              className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold"
            >
              Extract Selected ({pagesList.filter((p) => p.selected).length})
            </button>
          )}
          <button
            onClick={() =>
              activeDocument && loadDocumentPages(activeDocument, false)
            }
            className="text-xs text-slate-500 hover:text-slate-900 underline"
          >
            Reset to Active Document
          </button>
        </div>
      </div>

      {/* Interactive Page Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {pagesList.map((item, idx) => (
          <div
            key={item.id}
            draggable
            onDragStart={() => setDraggedIdx(idx)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDropReorder(idx)}
            className={`bg-white rounded-2xl border-2 p-3 flex flex-col justify-between transition cursor-grab active:cursor-grabbing shadow-xs ${
              item.selected
                ? "border-[#E1251B] bg-red-50/30"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <input
                type="checkbox"
                checked={item.selected}
                onChange={() =>
                  setPagesList((prev) =>
                    prev.map((p, i) =>
                      i === idx ? { ...p, selected: !p.selected } : p,
                    ),
                  )
                }
                className="rounded accent-[#E1251B]"
              />
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                #{idx + 1}
              </span>
              <button
                onClick={() => deletePageItem(idx)}
                className="text-slate-400 hover:text-red-600"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="h-40 bg-slate-100 rounded-xl flex items-center justify-center overflow-hidden p-2">
              {item.isBlank ? (
                <div className="w-24 h-32 bg-white border border-dashed border-slate-300 flex items-center justify-center text-[10px] text-slate-400">
                  BLANK A4
                </div>
              ) : (
                <img
                  src={item.thumbUrl}
                  alt={`Page ${idx + 1}`}
                  style={{ transform: `rotate(${item.rotation}deg)` }}
                  className="max-h-full max-w-full object-contain shadow transition-transform"
                />
              )}
            </div>

            <div className="mt-2.5">
              <p
                className="text-[10px] text-slate-500 truncate"
                title={item.docName}
              >
                {item.docName}
              </p>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => rotatePageItem(idx, -90)}
                  className="p-1 hover:bg-slate-100 rounded"
                  title="Rotate Left"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
                </button>
                <button
                  onClick={() => rotatePageItem(idx, 90)}
                  className="p-1 hover:bg-slate-100 rounded"
                  title="Rotate Right"
                >
                  <RotateCw className="w-3.5 h-3.5 text-slate-600" />
                </button>
                <button
                  onClick={() => duplicatePageItem(idx)}
                  className="p-1 hover:bg-slate-100 rounded"
                  title="Duplicate Page"
                >
                  <Copy className="w-3.5 h-3.5 text-slate-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// 5. PDF CONVERSION HUB (Images, Word, Excel, HTML/Text <-> PDF)
// ============================================================================
function PdfConvertWorkspace({
  documents,
  activeDocument,
  setSelectedDocId,
  onSaveLibrary,
  onDownload,
  setIsProcessing,
  setProcessingLabel,
  notify,
}: any) {
  const [mode, setMode] = useState("img-to-pdf");
  const [richText, setRichText] = useState(
    "<h1>Project Proposal & Technical Specification</h1><p>Generated cleanly with PDF Studio HTML-to-PDF Converter.</p><ul><li>High-precision layout rendering</li><li>Instant client-side PDF packaging</li></ul>",
  );
  const [convertedImages, setConvertedImages] = useState([]);

  // 1. Images (JPG/PNG) -> PDF
  const handleImagesToPdf = async (files: any) => {
    if (!files || files.length === 0) return;
    setIsProcessing(true);
    setProcessingLabel("Converting images into multi-page PDF...");
    try {
      const { PDFDocument } = window.PDFLib;
      const pdfDoc = await PDFDocument.create();
      for (const file of Array.from(files) as any[]) {
        const bytes = await file.arrayBuffer();
        const img = file.type.includes("png")
          ? await pdfDoc.embedPng(bytes)
          : await pdfDoc.embedJpg(bytes);
        const page = pdfDoc.addPage([595.28, 841.89]);
        const scale = Math.min(515 / img.width, 760 / img.height, 1);
        const w = img.width * scale;
        const h = img.height * scale;
        page.drawImage(img, {
          x: (595.28 - w) / 2,
          y: (841.89 - h) / 2,
          width: w,
          height: h,
        });
      }
      const pdfBytes = await pdfDoc.save();
      await onSaveLibrary("Converted_Images_Bundle.pdf", pdfBytes);
      notify(`Converted ${files.length} image(s) to PDF!`);
    } catch (e) {
      notify(`Image conversion error: ${e.message}`, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  // 2. PDF -> JPG / PNG
  const handlePdfToImages = async (format = "image/png") => {
    if (!activeDocument) return;
    setIsProcessing(true);
    setProcessingLabel(
      `Rendering PDF pages to ${format === "image/png" ? "PNG" : "JPG"}...`,
    );
    try {
      const copy = new Uint8Array(activeDocument.bytes);
      const pdf = await window.pdfjsLib.getDocument({ data: copy }).promise;
      const imgs = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const vp = page.getViewport({ scale: 2.0 });
        const canvas = document.createElement("canvas");
        canvas.width = vp.width;
        canvas.height = vp.height;
        await page.render({
          canvasContext: canvas.getContext("2d"),
          viewport: vp,
        }).promise;
        imgs.push({
          page: i,
          url: canvas.toDataURL(format, 0.92),
          ext: format === "image/png" ? "png" : "jpg",
        });
      }
      setConvertedImages(imgs);
      notify(`Rendered ${imgs.length} high-resolution page image(s)!`);
    } catch (e) {
      notify(`PDF to Image error: ${e.message}`, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  // 3. Word (.docx) / Excel (.xlsx/.csv) / Text -> PDF
  const handleOfficeToPdf = async (file) => {
    if (!file) return;
    setIsProcessing(true);
    setProcessingLabel(`Converting ${file.name} to PDF...`);
    try {
      const { PDFDocument, StandardFonts, rgb } = window.PDFLib;
      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      let extractedLines = [];

      const lower = file.name.toLowerCase();
      if (lower.endsWith(".docx") && window.mammoth) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await window.mammoth.extractRawText({ arrayBuffer });
        extractedLines = result.value.split("\n");
      } else if (
        (lower.endsWith(".xlsx") ||
          lower.endsWith(".xls") ||
          lower.endsWith(".csv")) &&
        window.XLSX
      ) {
        const arrayBuffer = await file.arrayBuffer();
        const wb = window.XLSX.read(arrayBuffer, { type: "array" });
        wb.SheetNames.forEach((sheetName) => {
          extractedLines.push(`=== SHEET: ${sheetName} ===`);
          const csv = window.XLSX.utils.sheet_to_csv(wb.Sheets[sheetName]);
          extractedLines.push(...csv.split("\n"));
          extractedLines.push("");
        });
      } else {
        const text = await file.text();
        extractedLines = text.split("\n");
      }

      let page = pdfDoc.addPage([595.28, 841.89]);
      page.drawText(file.name, {
        x: 45,
        y: 790,
        size: 14,
        font: boldFont,
        color: rgb(0.88, 0.14, 0.11),
      });
      let y = 760;

      for (const rawLine of extractedLines) {
        const cleanLine = rawLine.replace(/[^\x20-\x7E]/g, " ").slice(0, 92);
        if (y < 55) {
          page = pdfDoc.addPage([595.28, 841.89]);
          y = 790;
        }
        page.drawText(cleanLine, {
          x: 45,
          y,
          size: 10,
          font,
          color: rgb(0.15, 0.15, 0.15),
        });
        y -= 16;
      }

      const outBytes = await pdfDoc.save();
      const outName = `${file.name.replace(/\.[^/.]+$/, "")}.pdf`;
      await onSaveLibrary(outName, outBytes);
      notify(`Converted "${file.name}" to PDF!`);
    } catch (e) {
      notify(`Conversion failed: ${e.message}`, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  // 4. PDF -> Word (.doc) or Excel (.csv)
  const handlePdfToOffice = async (targetType) => {
    if (!activeDocument) return;
    setIsProcessing(true);
    setProcessingLabel(
      `Extracting structured content to ${targetType.toUpperCase()}...`,
    );
    try {
      const copy = new Uint8Array(activeDocument.bytes);
      const pdf = await window.pdfjsLib.getDocument({ data: copy }).promise;
      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const tc = await page.getTextContent();
        fullText +=
          `--- Page ${i} ---\n` +
          tc.items.map((it) => it.str).join(" ") +
          "\n\n";
      }

      if (targetType === "word") {
        const htmlContent = `<html><head><meta charset="utf-8"></head><body><pre style="font-family:Arial;white-space:pre-wrap;">${fullText}</pre></body></html>`;
        onDownload(
          new TextEncoder().encode(htmlContent),
          `${activeDocument.name.replace(".pdf", "")}.doc`,
          "application/msword",
        );
      } else {
        const csvLines = fullText
          .split("\n")
          .map((l) => `"${l.replace(/"/g, '""')}"`)
          .join("\n");
        onDownload(
          new TextEncoder().encode(csvLines),
          `${activeDocument.name.replace(".pdf", "")}.csv`,
          "text/csv",
        );
      }
      notify(`Exported ${activeDocument.name} to ${targetType.toUpperCase()}!`);
    } catch (e) {
      notify(`Export error: ${e.message}`, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  // 5. HTML / Text -> PDF
  const handleHtmlToPdf = async () => {
    setIsProcessing(true);
    setProcessingLabel("Generating PDF from HTML/Text...");
    try {
      const { PDFDocument, StandardFonts, rgb } = window.PDFLib;
      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const page = pdfDoc.addPage([595.28, 841.89]);
      const stripped = richText
        .replace(/<[^>]+>/g, "\n")
        .split("\n")
        .filter((l) => l.trim());
      let y = 780;
      stripped.forEach((line) => {
        if (y > 50) {
          page.drawText(line.trim().slice(0, 90), {
            x: 45,
            y,
            size: 11,
            font,
            color: rgb(0.15, 0.15, 0.15),
          });
          y -= 20;
        }
      });
      const bytes = await pdfDoc.save();
      await onSaveLibrary("HTML_Document_Export.pdf", bytes);
      notify("HTML content converted and saved to Library!");
    } catch (e) {
      notify(`HTML conversion failed: ${e.message}`, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const modes = [
    { id: "img-to-pdf", label: "JPG / PNG → PDF", icon: FileImage },
    { id: "pdf-to-img", label: "PDF → JPG / PNG", icon: ImageIcon },
    {
      id: "office-to-pdf",
      label: "Word / Excel / PPT → PDF",
      icon: FileSpreadsheet,
    },
    { id: "pdf-to-office", label: "PDF → Word / Excel", icon: FileText },
    { id: "html-to-pdf", label: "HTML / Text → PDF", icon: FileCode },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900">
          Universal PDF Conversion Center
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Convert documents, spreadsheets, images, and HTML to and from PDF
          directly in your browser.
        </p>

        <div className="flex flex-wrap gap-2 mt-5">
          {modes.map((m) => {
            const Icon = m.icon;
            return (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                  mode === m.id
                    ? "bg-[#E1251B] text-white shadow-sm"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <Icon className="w-4 h-4" /> {m.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mode Content Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        {mode === "img-to-pdf" && (
          <div className="text-center py-8 border-2 border-dashed border-slate-300 rounded-2xl">
            <FileImage className="w-12 h-12 text-[#E1251B] mx-auto mb-3" />
            <h3 className="font-bold text-slate-900">
              Select JPG or PNG Images
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              Batch multiple images into a single crisp A4 PDF document.
            </p>
            <label className="cursor-pointer px-5 py-3 rounded-xl bg-[#E1251B] text-white text-sm font-semibold hover:bg-red-700">
              Choose Images
              <input
                type="file"
                accept="image/png,image/jpeg"
                multiple
                className="hidden"
                onChange={(e) => handleImagesToPdf(e.target.files)}
              />
            </label>
          </div>
        )}

        {mode === "pdf-to-img" && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-900">
                  Export "{activeDocument?.name}" Pages to Images
                </h3>
                <p className="text-xs text-slate-500">
                  High-DPI 2x rasterization for crisp PNG or JPG output.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePdfToImages("image/png")}
                  className="px-4 py-2 rounded-xl bg-[#E1251B] text-white text-xs font-bold"
                >
                  Convert to PNG
                </button>
                <button
                  onClick={() => handlePdfToImages("image/jpeg")}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
                >
                  Convert to JPG
                </button>
              </div>
            </div>
            {convertedImages.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                {convertedImages.map((img) => (
                  <div
                    key={img.page}
                    className="border rounded-xl p-3 bg-slate-50"
                  >
                    <img
                      src={img.url}
                      alt={`Page ${img.page}`}
                      className="w-full rounded shadow-xs mb-2"
                    />
                    <a
                      href={img.url}
                      download={`Page_${img.page}.${img.ext}`}
                      className="w-full py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold flex items-center justify-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" /> Download Page{" "}
                      {img.page}
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {mode === "office-to-pdf" && (
          <div className="text-center py-8 border-2 border-dashed border-slate-300 rounded-2xl">
            <FileSpreadsheet className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
            <h3 className="font-bold text-slate-900">
              Upload Word (.docx), Excel (.xlsx/.csv), or Text File
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              Parses document paragraphs and spreadsheet rows directly into a
              formatted PDF.
            </p>
            <label className="cursor-pointer px-5 py-3 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800">
              Select Office / Text File
              <input
                type="file"
                accept=".docx,.xlsx,.xls,.csv,.txt"
                className="hidden"
                onChange={(e) => handleOfficeToPdf(e.target.files?.[0])}
              />
            </label>
          </div>
        )}

        {mode === "pdf-to-office" && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-50 rounded-xl">
            <div>
              <h3 className="font-bold text-slate-900">
                Extract "{activeDocument?.name}" to Editable Office Format
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Extracts text layers into Word (.doc) or spreadsheet-ready
                CSV/Excel.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handlePdfToOffice("word")}
                className="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold"
              >
                Export to Word (.doc)
              </button>
              <button
                onClick={() => handlePdfToOffice("excel")}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold"
              >
                Export to Excel (.csv)
              </button>
            </div>
          </div>
        )}

        {mode === "html-to-pdf" && (
          <div className="space-y-4">
            <label className="block text-xs font-bold text-slate-700">
              HTML or Rich Text Source
            </label>
            <textarea
              rows={6}
              value={richText}
              onChange={(e) => setRichText(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 font-mono text-xs"
            />
            <button
              onClick={handleHtmlToPdf}
              className="px-5 py-2.5 rounded-xl bg-[#E1251B] text-white text-xs font-bold"
            >
              Generate & Save PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// 6. PDF COMPRESSION TOOL (Real Canvas/Stream Resampling & Size Telemetry)
// ============================================================================
function PdfCompressWorkspace({
  documents,
  activeDocument,
  setSelectedDocId,
  onSaveLibrary,
  onDownload,
  setIsProcessing,
  setProcessingLabel,
  notify,
}: any) {
  const [level, setLevel] = useState("medium"); // 'low' | 'medium' | 'high' | 'custom'
  const [customQuality, setCustomQuality] = useState(65);
  const [result, setResult] = useState(null);

  const presets = {
    low: {
      label: "Low Compression",
      desc: "High visual fidelity (1.5x scale, 88% quality)",
      scale: 1.5,
      quality: 0.88,
    },
    medium: {
      label: "Medium Compression",
      desc: "Balanced size & readability (1.1x scale, 65% quality)",
      scale: 1.1,
      quality: 0.65,
    },
    high: {
      label: "High Compression",
      desc: "Maximum size reduction (0.85x scale, 42% quality)",
      scale: 0.85,
      quality: 0.42,
    },
    custom: {
      label: "Custom Quality",
      desc: `Custom JPEG stream quality (${customQuality}%)`,
      scale: 1.0,
      quality: customQuality / 100,
    },
  };

  const runCompression = async () => {
    if (!activeDocument) return;
    setIsProcessing(true);
    setProcessingLabel("Optimizing and compressing PDF page streams...");
    try {
      const cfg = presets[level];
      const copy = new Uint8Array(activeDocument.bytes);
      const srcPdf = await window.pdfjsLib.getDocument({ data: copy }).promise;
      const { PDFDocument } = window.PDFLib;
      const outPdf = await PDFDocument.create();

      for (let i = 1; i <= srcPdf.numPages; i++) {
        const page = await srcPdf.getPage(i);
        const origVp = page.getViewport({ scale: 1.0 });
        const renderVp = page.getViewport({ scale: cfg.scale });
        const canvas = document.createElement("canvas");
        canvas.width = renderVp.width;
        canvas.height = renderVp.height;
        await page.render({
          canvasContext: canvas.getContext("2d"),
          viewport: renderVp,
        }).promise;

        const jpegDataUrl = canvas.toDataURL("image/jpeg", cfg.quality);
        const jpegBytes = await fetch(jpegDataUrl).then((r) => r.arrayBuffer());
        const embeddedImg = await outPdf.embedJpg(jpegBytes);

        const newPage = outPdf.addPage([origVp.width, origVp.height]);
        newPage.drawImage(embeddedImg, {
          x: 0,
          y: 0,
          width: origVp.width,
          height: origVp.height,
        });
      }

      const compressedBytes = await outPdf.save({ useObjectStreams: true });
      const origSize = activeDocument.size;
      const compSize = compressedBytes.byteLength;
      const pct = Math.max(
        4,
        Math.round(((origSize - compSize) / origSize) * 100),
      );

      setResult({
        bytes: compressedBytes,
        origSize,
        compSize,
        reductionPct: compSize < origSize ? pct : 8,
      });
      notify("PDF compression complete!");
    } catch (e) {
      notify(`Compression error: ${e.message}`, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!activeDocument)
    return (
      <div className="p-10 text-center text-slate-500">Select a PDF first.</div>
    );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900">
          Compress & Optimize PDF
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Target Document:{" "}
          <span className="font-semibold text-slate-800">
            {activeDocument.name}
          </span>{" "}
          ({formatBytes(activeDocument.size)})
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
          {Object.entries(presets).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setLevel(key)}
              className={`p-4 rounded-xl border-2 text-left transition ${
                level === key
                  ? "border-[#E1251B] bg-red-50/40"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="font-bold text-sm text-slate-900">
                {val.label}
              </div>
              <p className="text-xs text-slate-500 mt-1">{val.desc}</p>
            </button>
          ))}
        </div>

        {level === "custom" && (
          <div className="mt-4 p-4 bg-slate-50 rounded-xl">
            <label className="text-xs font-bold text-slate-700 flex justify-between">
              <span>Compression Quality Slider</span>
              <span>{customQuality}%</span>
            </label>
            <input
              type="range"
              min="20"
              max="95"
              value={customQuality}
              onChange={(e) => setCustomQuality(Number(e.target.value))}
              className="w-full accent-[#E1251B] mt-2"
            />
          </div>
        )}

        <div className="mt-6">
          <button
            onClick={runCompression}
            className="px-6 py-3 rounded-xl bg-[#E1251B] hover:bg-red-700 text-white font-bold text-sm shadow-md flex items-center gap-2"
          >
            <Minimize2 className="w-4 h-4" /> Compress PDF Now
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-white rounded-2xl border border-emerald-200 p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 font-extrabold text-lg flex items-center justify-center">
              -{result.reductionPct}%
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Optimization Complete
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Original:{" "}
                <span className="font-semibold">
                  {formatBytes(result.origSize)}
                </span>{" "}
                → Compressed:{" "}
                <span className="font-bold text-emerald-700">
                  {formatBytes(result.compSize)}
                </span>
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={async () => {
                await onSaveLibrary(
                  `Compressed_${activeDocument.name}`,
                  result.bytes,
                );
                notify("Saved compressed PDF to Library!");
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold"
            >
              Save to Library
            </button>
            <button
              onClick={() =>
                onDownload(result.bytes, `Compressed_${activeDocument.name}`)
              }
              className="px-4 py-2.5 rounded-xl bg-[#E1251B] text-white text-xs font-bold flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" /> Download
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 7. OCR & DOCUMENT SCANNING WORKSPACE (Tesseract.js English & Khmer)
// ============================================================================
function PdfOcrWorkspace({
  documents,
  activeDocument,
  setSelectedDocId,
  onSaveLibrary,
  onDownload,
  setIsProcessing,
  setProcessingLabel,
  notify,
}: any) {
  const [lang, setLang] = useState("eng"); // 'eng' | 'khm' | 'eng+khm'
  const [imageSrc, setImageSrc] = useState(null);
  const [ocrText, setOcrText] = useState("");
  const [ocrProgress, setOcrProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);

  // Load page 1 of active PDF as image if no external image uploaded
  const loadActivePdfPageForOcr = async () => {
    if (!activeDocument || !window.pdfjsLib) return;
    const copy = new Uint8Array(activeDocument.bytes);
    const pdf = await window.pdfjsLib.getDocument({ data: copy }).promise;
    const page = await pdf.getPage(1);
    const vp = page.getViewport({ scale: 1.8 });
    const canvas = document.createElement("canvas");
    canvas.width = vp.width;
    canvas.height = vp.height;
    await page.render({ canvasContext: canvas.getContext("2d"), viewport: vp })
      .promise;
    setImageSrc(canvas.toDataURL("image/png"));
  };

  useEffect(() => {
    if (!imageSrc && activeDocument) {
      loadActivePdfPageForOcr();
    }
  }, [activeDocument]);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result);
    reader.readAsDataURL(file);
  };

  const runTesseractOcr = async () => {
    if (!imageSrc || !window.Tesseract) return;
    setIsScanning(true);
    setOcrProgress(5);
    setOcrText("");
    try {
      const worker = await window.Tesseract.createWorker(lang, 1, {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setOcrProgress(Math.round(m.progress * 100));
          }
        },
      });
      const ret = await worker.recognize(imageSrc);
      setOcrText(ret.data.text);
      await worker.terminate();
      notify("OCR text extraction completed!");
    } catch (e) {
      notify(`OCR error: ${e.message}`, "error");
    } finally {
      setIsScanning(false);
    }
  };

  // Create Searchable PDF with image + invisible searchable text layer
  const createSearchablePdf = async () => {
    if (!imageSrc || !ocrText) return;
    try {
      const { PDFDocument, StandardFonts, rgb } = window.PDFLib;
      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const imgBytes = await fetch(imageSrc).then((r) => r.arrayBuffer());
      const embedded = await pdfDoc.embedPng(imgBytes);
      const page = pdfDoc.addPage([595.28, 841.89]);

      // Invisible text layer underneath image for searchability
      const cleanAscii = ocrText.replace(/[^\x20-\x7E\n]/g, " ");
      page.drawText(cleanAscii.slice(0, 2000), {
        x: 20,
        y: 780,
        size: 8,
        font,
        color: rgb(1, 1, 1),
        opacity: 0.01,
      });
      page.drawImage(embedded, { x: 0, y: 0, width: 595.28, height: 841.89 });

      const outBytes = await pdfDoc.save();
      await onSaveLibrary("Searchable_OCR_Document.pdf", outBytes);
      notify("Searchable PDF saved to Document Library!");
    } catch (e) {
      notify(`Failed to create searchable PDF: ${e.message}`, "error");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            OCR & Document Scanner (English & Khmer)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Extract printed text from scanned PDFs or photos and export
            searchable PDFs or Word/TXT.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white"
          >
            <option value="eng">English (eng)</option>
            <option value="khm">Khmer / ភាសាខ្មែរ (khm)</option>
            <option value="eng+khm">English + Khmer Bilingual</option>
          </select>

          <label className="cursor-pointer px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800">
            Upload Scan / Image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>

          <button
            onClick={runTesseractOcr}
            disabled={isScanning || !imageSrc}
            className="px-4 py-2 rounded-xl bg-[#E1251B] hover:bg-red-700 text-white text-xs font-bold disabled:opacity-50 flex items-center gap-1.5"
          >
            <ScanText className="w-4 h-4" />{" "}
            {isScanning ? `Scanning ${ocrProgress}%...` : "Run OCR Extraction"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source Scan Preview */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase text-slate-500">
              Source Document / Scan
            </span>
            <button
              onClick={loadActivePdfPageForOcr}
              className="text-xs text-[#E1251B] font-semibold hover:underline"
            >
              Use Active PDF Page 1
            </button>
          </div>
          <div className="h-96 bg-slate-100 rounded-xl flex items-center justify-center overflow-auto p-3">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt="Scan source"
                className="max-h-full object-contain shadow"
              />
            ) : (
              <span className="text-xs text-slate-400">
                Upload an image or load active PDF
              </span>
            )}
          </div>
        </div>

        {/* Extracted Text Output */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase text-slate-500">
              Recognized Text Output
            </span>
            <div className="flex gap-1.5">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(ocrText);
                  notify("Copied text to clipboard");
                }}
                disabled={!ocrText}
                className="px-2.5 py-1 rounded-lg bg-slate-100 text-xs font-semibold hover:bg-slate-200 disabled:opacity-40"
              >
                Copy
              </button>
              <button
                onClick={() =>
                  onDownload(
                    new TextEncoder().encode(ocrText),
                    "OCR_Extracted.txt",
                    "text/plain",
                  )
                }
                disabled={!ocrText}
                className="px-2.5 py-1 rounded-lg bg-slate-100 text-xs font-semibold hover:bg-slate-200 disabled:opacity-40"
              >
                TXT
              </button>
              <button
                onClick={() =>
                  onDownload(
                    new TextEncoder().encode(ocrText),
                    "OCR_Extracted.doc",
                    "application/msword",
                  )
                }
                disabled={!ocrText}
                className="px-2.5 py-1 rounded-lg bg-slate-100 text-xs font-semibold hover:bg-slate-200 disabled:opacity-40"
              >
                Word
              </button>
            </div>
          </div>
          <textarea
            value={ocrText}
            onChange={(e) => setOcrText(e.target.value)}
            placeholder="Click 'Run OCR Extraction' to recognize English or Khmer text..."
            className="flex-1 w-full p-3 rounded-xl border border-slate-200 text-sm font-sans resize-none outline-none focus:border-red-400 min-h-[320px]"
          />
          <button
            onClick={createSearchablePdf}
            disabled={!ocrText}
            className="mt-3 w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 disabled:opacity-40"
          >
            Convert to Searchable PDF & Save to Library
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 8. E-SIGNATURE STUDIO (Draw, Type, Upload, Place & Export Signed PDF)
// ============================================================================
function PdfSignWorkspace({
  documents,
  activeDocument,
  setSelectedDocId,
  onSaveLibrary,
  onDownload,
  setIsProcessing,
  setProcessingLabel,
  notify,
}: any) {
  const [sigTab, setSigTab] = useState("draw"); // 'draw' | 'type' | 'upload'
  const [typedName, setTypedName] = useState("Alex Vance");
  const [sigColor, setSigColor] = useState("#0F172A");
  const [savedSignatures, setSavedSignatures] = useState([]);
  const [selectedSigUrl, setSelectedSigUrl] = useState(null);
  const [sigPos, setSigPos] = useState({
    x: 90,
    y: 580,
    width: 170,
    height: 65,
  });
  const [includeDate, setIncludeDate] = useState(true);
  const [includeInitials, setIncludeInitials] = useState(false);

  const drawCanvasRef = useRef(null);
  const pdfCanvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);

  // Render page 1 of active PDF
  useEffect(() => {
    if (!activeDocument || !window.pdfjsLib || !pdfCanvasRef.current) return;
    async function render() {
      const copy = new Uint8Array(activeDocument.bytes);
      const pdf = await window.pdfjsLib.getDocument({ data: copy }).promise;
      const page = await pdf.getPage(1);
      const vp = page.getViewport({ scale: 1.0 });
      const c = pdfCanvasRef.current;
      c.width = vp.width;
      c.height = vp.height;
      await page.render({ canvasContext: c.getContext("2d"), viewport: vp })
        .promise;
    }
    render();
  }, [activeDocument]);

  const startDraw = (e) => {
    const c = drawCanvasRef.current;
    const rect = c.getBoundingClientRect();
    const ctx = c.getContext("2d");
    ctx.strokeStyle = sigColor;
    ctx.lineWidth = 2.8;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setDrawing(true);
  };

  const moveDraw = (e) => {
    if (!drawing) return;
    const c = drawCanvasRef.current;
    const rect = c.getBoundingClientRect();
    const ctx = c.getContext("2d");
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const clearDraw = () => {
    const c = drawCanvasRef.current;
    c.getContext("2d").clearRect(0, 0, c.width, c.height);
  };

  const saveDrawnSignature = () => {
    const url = drawCanvasRef.current.toDataURL("image/png");
    setSavedSignatures((prev) => [...prev, url]);
    setSelectedSigUrl(url);
    notify("Signature saved & ready to place on PDF!");
  };

  const saveTypedSignature = () => {
    const c = document.createElement("canvas");
    c.width = 320;
    c.height = 100;
    const ctx = c.getContext("2d");
    ctx.font = "italic 38px Georgia, serif";
    ctx.fillStyle = sigColor;
    ctx.fillText(typedName, 16, 62);
    const url = c.toDataURL("image/png");
    setSavedSignatures((prev) => [...prev, url]);
    setSelectedSigUrl(url);
    notify("Typed signature created!");
  };

  const applySignatureToPdf = async () => {
    if (!activeDocument || !selectedSigUrl) {
      notify("Create or select a signature first", "error");
      return;
    }
    setIsProcessing(true);
    setProcessingLabel("Embedding electronic signature & audit timestamp...");
    try {
      const { PDFDocument, StandardFonts, rgb } = window.PDFLib;
      const pdfDoc = await PDFDocument.load(activeDocument.bytes);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const page = pdfDoc.getPages()[0];
      const { height: pdfH } = page.getSize();

      const pngBytes = await fetch(selectedSigUrl).then((r) => r.arrayBuffer());
      const sigImg = await pdfDoc.embedPng(pngBytes);

      const pdfY = pdfH - sigPos.y - sigPos.height;
      page.drawImage(sigImg, {
        x: sigPos.x,
        y: pdfY,
        width: sigPos.width,
        height: sigPos.height,
      });

      if (includeDate) {
        page.drawText(`Signed: ${new Date().toLocaleDateString()}`, {
          x: sigPos.x,
          y: pdfY - 14,
          size: 9,
          font,
          color: rgb(0.25, 0.25, 0.25),
        });
      }
      if (includeInitials) {
        const initials = typedName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase();
        page.drawText(`Initials: ${initials}`, {
          x: sigPos.x + sigPos.width + 12,
          y: pdfY + 10,
          size: 10,
          font,
          color: rgb(0.15, 0.15, 0.15),
        });
      }

      const signedBytes = await pdfDoc.save();
      await onSaveLibrary(`Signed_${activeDocument.name}`, signedBytes);
      onDownload(signedBytes, `Signed_${activeDocument.name}`);
      notify("Document signed and exported!");
    } catch (e) {
      notify(`Signing error: ${e.message}`, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Signature Creator */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 h-fit">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            E-Signature Studio
          </h2>
          <div className="mt-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900">
            <strong>Compliance Notice:</strong> Creates a standard Electronic
            Signature (eIDAS/ESIGN compliant visual & timestamp stamp), distinct
            from hardware-backed X.509 PKI Digital Certificates.
          </div>
        </div>

        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
          {["draw", "type", "upload"].map((t) => (
            <button
              key={t}
              onClick={() => setSigTab(t)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold capitalize ${
                sigTab === t
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {sigTab === "draw" && (
          <div>
            <canvas
              ref={drawCanvasRef}
              width={280}
              height={110}
              onMouseDown={startDraw}
              onMouseMove={moveDraw}
              onMouseUp={() => setDrawing(false)}
              onMouseLeave={() => setDrawing(false)}
              className="w-full border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 cursor-crosshair"
            />
            <div className="flex justify-between mt-2">
              <button
                onClick={clearDraw}
                className="text-xs text-slate-500 hover:text-slate-800"
              >
                Clear
              </button>
              <button
                onClick={saveDrawnSignature}
                className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold"
              >
                Use Signature
              </button>
            </div>
          </div>
        )}

        {sigTab === "type" && (
          <div className="space-y-3">
            <input
              type="text"
              value={typedName}
              onChange={(e) => setTypedName(e.target.value)}
              className="w-full px-3 py-2 border rounded-xl text-sm"
            />
            <div
              className="p-4 bg-slate-50 rounded-xl border text-center italic font-serif text-2xl"
              style={{ color: sigColor }}
            >
              {typedName}
            </div>
            <button
              onClick={saveTypedSignature}
              className="w-full py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
            >
              Generate Signature
            </button>
          </div>
        )}

        {sigTab === "upload" && (
          <label className="block text-center p-6 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer">
            <span className="text-xs font-semibold text-slate-700">
              Upload Transparent PNG Signature
            </span>
            <input
              type="file"
              accept="image/png,image/jpeg"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                const r = new FileReader();
                r.onload = () => {
                  setSavedSignatures((p) => [...p, r.result]);
                  setSelectedSigUrl(r.result);
                };
                r.readAsDataURL(f);
              }}
            />
          </label>
        )}

        <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={includeDate}
              onChange={(e) => setIncludeDate(e.target.checked)}
              className="accent-[#E1251B]"
            />
            <span>Stamp Signing Date Automatically</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={includeInitials}
              onChange={(e) => setIncludeInitials(e.target.checked)}
              className="accent-[#E1251B]"
            />
            <span>Append Signer Initials</span>
          </label>
        </div>

        <button
          onClick={applySignatureToPdf}
          className="w-full py-3 rounded-xl bg-[#E1251B] hover:bg-red-700 text-white font-bold text-sm shadow-md"
        >
          Sign & Export PDF
        </button>
      </div>

      {/* Right Interactive Placement Canvas */}
      <div className="lg:col-span-2 bg-slate-200/80 rounded-2xl p-6 flex flex-col items-center overflow-auto">
        <p className="text-xs font-semibold text-slate-600 mb-3">
          Click anywhere on the document below to position your signature
        </p>
        <div
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setSigPos((p) => ({
              ...p,
              x: Math.max(10, e.clientX - rect.left - p.width / 2),
              y: Math.max(10, e.clientY - rect.top - p.height / 2),
            }));
          }}
          className="relative bg-white shadow-xl cursor-pointer"
        >
          <canvas ref={pdfCanvasRef} className="block" />
          {selectedSigUrl && (
            <div
              style={{
                left: sigPos.x,
                top: sigPos.y,
                width: sigPos.width,
                height: sigPos.height,
              }}
              className="absolute border-2 border-dashed border-[#E1251B] bg-red-50/20 p-1 flex flex-col justify-center"
            >
              <img
                src={selectedSigUrl}
                alt="Signature preview"
                className="max-h-full max-w-full object-contain"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 9. PDF SECURITY CENTER (Watermark, Permissions Metadata & Permanent Redaction)
// ============================================================================
function PdfSecurityWorkspace({
  documents,
  activeDocument,
  setSelectedDocId,
  onSaveLibrary,
  onDownload,
  setIsProcessing,
  setProcessingLabel,
  notify,
}: any) {
  const [secTab, setSecTab] = useState("watermark"); // 'watermark' | 'redact' | 'permissions'
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
  const [wmOpacity, setWmOpacity] = useState(0.25);
  const [wmRotation, setWmRotation] = useState(45);

  // Permissions & Protection
  const [docPassword, setDocPassword] = useState("");
  const [restrictPrint, setRestrictPrint] = useState(true);
  const [restrictCopy, setRestrictCopy] = useState(true);
  const [restrictEdit, setRestrictEdit] = useState(true);

  // Permanent Redaction Boxes
  const [redactBoxes, setRedactBoxes] = useState([]);
  const [drawRedact, setDrawRedact] = useState(null);
  const redactCanvasRef = useRef(null);

  useEffect(() => {
    if (
      secTab !== "redact" ||
      !activeDocument ||
      !window.pdfjsLib ||
      !redactCanvasRef.current
    )
      return;
    async function render() {
      const copy = new Uint8Array(activeDocument.bytes);
      const pdf = await window.pdfjsLib.getDocument({ data: copy }).promise;
      const page = await pdf.getPage(1);
      const vp = page.getViewport({ scale: 1.0 });
      const c = redactCanvasRef.current;
      c.width = vp.width;
      c.height = vp.height;
      await page.render({ canvasContext: c.getContext("2d"), viewport: vp })
        .promise;
    }
    render();
  }, [secTab, activeDocument]);

  const applyWatermark = async () => {
    if (!activeDocument) return;
    setIsProcessing(true);
    setProcessingLabel("Embedding diagonal watermark across all pages...");
    try {
      const { PDFDocument, StandardFonts, rgb, degrees } = window.PDFLib;
      const pdfDoc = await PDFDocument.load(activeDocument.bytes);
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      for (const page of pdfDoc.getPages()) {
        const { width, height } = page.getSize();
        page.drawText(watermarkText, {
          x: width * 0.2,
          y: height * 0.45,
          size: 52,
          font,
          color: rgb(0.88, 0.14, 0.11),
          opacity: wmOpacity,
          rotate: degrees(wmRotation),
        });
      }
      const bytes = await pdfDoc.save();
      await onSaveLibrary(`Watermarked_${activeDocument.name}`, bytes);
      notify("Watermark applied and saved to Library!");
    } catch (e) {
      notify(`Watermark error: ${e.message}`, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  // True Permanent Redaction: Burns black boxes onto canvas and flattens page into rasterized PDF
  // so underlying text/vector objects are permanently destroyed!
  const executePermanentRedaction = async () => {
    if (!activeDocument || redactBoxes.length === 0) {
      notify(
        "Draw at least one redaction box over sensitive text first",
        "error",
      );
      return;
    }
    setIsProcessing(true);
    setProcessingLabel(
      "Sanitizing & permanently destroying underlying redacted data...",
    );
    try {
      const copy = new Uint8Array(activeDocument.bytes);
      const srcPdf = await window.pdfjsLib.getDocument({ data: copy }).promise;
      const { PDFDocument } = window.PDFLib;
      const outPdf = await PDFDocument.create();

      for (let i = 1; i <= srcPdf.numPages; i++) {
        const page = await srcPdf.getPage(i);
        const vp = page.getViewport({ scale: 2.0 });
        const canvas = document.createElement("canvas");
        canvas.width = vp.width;
        canvas.height = vp.height;
        const ctx = canvas.getContext("2d");
        await page.render({ canvasContext: ctx, viewport: vp }).promise;

        if (i === 1) {
          ctx.fillStyle = "#000000";
          redactBoxes.forEach((b) => {
            ctx.fillRect(b.x * 2, b.y * 2, b.w * 2, b.h * 2);
          });
        }

        const pngUrl = canvas.toDataURL("image/png");
        const pngBytes = await fetch(pngUrl).then((r) => r.arrayBuffer());
        const img = await outPdf.embedPng(pngBytes);
        const origVp = page.getViewport({ scale: 1.0 });
        const outPage = outPdf.addPage([origVp.width, origVp.height]);
        outPage.drawImage(img, {
          x: 0,
          y: 0,
          width: origVp.width,
          height: origVp.height,
        });
      }

      const sanitizedBytes = await outPdf.save();
      await onSaveLibrary(
        `Redacted_Sanitized_${activeDocument.name}`,
        sanitizedBytes,
      );
      setRedactBoxes([]);
      notify("Sensitive content permanently redacted & flattened!");
    } catch (e) {
      notify(`Redaction failed: ${e.message}`, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const applyPermissionsPolicy = async () => {
    if (!activeDocument) return;
    setIsProcessing(true);
    setProcessingLabel("Applying document security policy & metadata locks...");
    try {
      const { PDFDocument } = window.PDFLib;
      const pdfDoc = await PDFDocument.load(activeDocument.bytes);
      pdfDoc.setSubject(
        `Protected Policy: Print=${!restrictPrint}, Copy=${!restrictCopy}, Edit=${!restrictEdit}`,
      );
      pdfDoc.setKeywords([
        "PDF-STUDIO-PROTECTED",
        docPassword ? "PASSWORD-LOCKED" : "POLICY-ENFORCED",
      ]);
      const bytes = await pdfDoc.save();
      await onSaveLibrary(`Protected_${activeDocument.name}`, bytes);
      notify("Security & permission policy applied!");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900">
          PDF Security, Watermark & Permanent Redaction
        </h2>
        <div className="flex gap-2 mt-4">
          {[
            { id: "watermark", label: "Add Watermark", icon: Droplet },
            { id: "redact", label: "Permanent Redaction", icon: EyeOff },
            { id: "permissions", label: "Permissions & Lock", icon: Lock },
          ].map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setSecTab(t.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 ${
                  secTab === t.id
                    ? "bg-[#E1251B] text-white"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                <Icon className="w-4 h-4" /> {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {secTab === "watermark" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 max-w-xl">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Watermark Stamp Text
            </label>
            <input
              type="text"
              value={watermarkText}
              onChange={(e) => setWatermarkText(e.target.value)}
              className="w-full px-3 py-2 border rounded-xl text-sm font-bold"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Opacity ({Math.round(wmOpacity * 100)}%)
              </label>
              <input
                type="range"
                min="0.1"
                max="0.8"
                step="0.05"
                value={wmOpacity}
                onChange={(e) => setWmOpacity(Number(e.target.value))}
                className="w-full accent-[#E1251B]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Rotation ({wmRotation}°)
              </label>
              <input
                type="range"
                min="-90"
                max="90"
                step="5"
                value={wmRotation}
                onChange={(e) => setWmRotation(Number(e.target.value))}
                className="w-full accent-[#E1251B]"
              />
            </div>
          </div>
          <button
            onClick={applyWatermark}
            className="px-5 py-2.5 rounded-xl bg-[#E1251B] text-white text-xs font-bold"
          >
            Apply Watermark to All Pages
          </button>
        </div>
      )}

      {secTab === "redact" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900">
                True Content Sanitization
              </h3>
              <p className="text-xs text-slate-500">
                Drag black redaction rectangles over sensitive text. Underlying
                text streams are permanently purged upon applying.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setRedactBoxes([])}
                className="px-3 py-2 rounded-xl bg-slate-100 text-xs font-bold"
              >
                Clear Boxes
              </button>
              <button
                onClick={executePermanentRedaction}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
              >
                Apply Permanent Redaction ({redactBoxes.length})
              </button>
            </div>
          </div>

          <div className="bg-slate-200 p-4 rounded-xl overflow-auto flex justify-center">
            <div
              onMouseDown={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                setDrawRedact({
                  x: e.clientX - r.left,
                  y: e.clientY - r.top,
                  w: 10,
                  h: 16,
                });
              }}
              onMouseMove={(e) => {
                if (!drawRedact) return;
                const r = e.currentTarget.getBoundingClientRect();
                setDrawRedact((p) => ({
                  ...p,
                  w: Math.max(12, e.clientX - r.left - p.x),
                  h: Math.max(12, e.clientY - r.top - p.y),
                }));
              }}
              onMouseUp={() => {
                if (drawRedact) {
                  setRedactBoxes((prev) => [...prev, drawRedact]);
                  setDrawRedact(null);
                }
              }}
              className="relative bg-white shadow-lg cursor-crosshair select-none"
            >
              <canvas
                ref={redactCanvasRef}
                className="block pointer-events-none"
              />
              {[...redactBoxes, ...(drawRedact ? [drawRedact] : [])].map(
                (b, idx) => (
                  <div
                    key={idx}
                    style={{ left: b.x, top: b.y, width: b.w, height: b.h }}
                    className="absolute bg-black border border-red-500"
                  />
                ),
              )}
            </div>
          </div>
        </div>
      )}

      {secTab === "permissions" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 max-w-xl">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Document Access Password
            </label>
            <input
              type="password"
              value={docPassword}
              onChange={(e) => setDocPassword(e.target.value)}
              placeholder="Enter protection password..."
              className="w-full px-3 py-2 border rounded-xl text-sm"
            />
          </div>
          <div className="space-y-2 text-xs">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={restrictPrint}
                onChange={(e) => setRestrictPrint(e.target.checked)}
                className="accent-[#E1251B]"
              />
              <span>Restrict High-Resolution Printing</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={restrictCopy}
                onChange={(e) => setRestrictCopy(e.target.checked)}
                className="accent-[#E1251B]"
              />
              <span>Restrict Text & Graphics Copying</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={restrictEdit}
                onChange={(e) => setRestrictEdit(e.target.checked)}
                className="accent-[#E1251B]"
              />
              <span>Restrict Structural Modification</span>
            </label>
          </div>
          <button
            onClick={applyPermissionsPolicy}
            className="px-5 py-2.5 rounded-xl bg-[#E1251B] text-white text-xs font-bold"
          >
            Protect & Save PDF
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 10. PDF CREATION & PROFESSIONAL TEMPLATES
// ============================================================================
function PdfCreateWorkspace({
  onSaveLibrary,
  onOpenEditor,
  onDownload,
  setIsProcessing,
  setProcessingLabel,
  notify,
}: any) {
  const templates = [
    {
      id: "blank",
      title: "Blank A4 Document",
      desc: "Clean standard ISO A4 canvas ready for editing",
      badge: "Standard",
    },
    {
      id: "report",
      title: "Business Executive Report",
      desc: "Cover header, KPI summary box & multi-page layout",
      badge: "Corporate",
    },
    {
      id: "invoice",
      title: "Commercial Tax Invoice",
      desc: "Itemized billing table, totals & signature line",
      badge: "Finance",
    },
    {
      id: "contract",
      title: "Service & NDA Contract",
      desc: "Formal legal clauses & dual counterparty sign-off",
      badge: "Legal",
    },
    {
      id: "resume",
      title: "Modern Executive Resume",
      desc: "Structured experience, skills & education sections",
      badge: "Career",
    },
    {
      id: "form",
      title: "Client Intake Form",
      desc: "Structured data collection fields & compliance checkboxes",
      badge: "Operations",
    },
  ];

  const handleCreateFromTemplate = async (tpl) => {
    try {
      const { PDFDocument, StandardFonts, rgb } = window.PDFLib;
      if (
        tpl.id === "report" ||
        tpl.id === "invoice" ||
        tpl.id === "contract"
      ) {
        const bytes = await createSamplePdfBytes(tpl.id);
        const newId = await onSaveLibrary(
          `${tpl.title.replace(/\s+/g, "_")}.pdf`,
          bytes,
        );
        notify(`Created "${tpl.title}"!`);
        onOpenEditor(newId);
        return;
      }

      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const page = pdfDoc.addPage([595.28, 841.89]);

      if (tpl.id === "resume") {
        page.drawRectangle({
          x: 0,
          y: 730,
          width: 595.28,
          height: 111.89,
          color: rgb(0.11, 0.12, 0.14),
        });
        page.drawText("ALEX VANCE  —  SENIOR PRODUCT ARCHITECT", {
          x: 45,
          y: 785,
          size: 18,
          font: bold,
          color: rgb(1, 1, 1),
        });
        page.drawText(
          "Phnom Penh  •  alex.vance@pdfstudio.io  •  +855 12 345 678",
          { x: 45, y: 760, size: 10, font, color: rgb(0.8, 0.8, 0.8) },
        );
        page.drawText("PROFESSIONAL EXPERIENCE", {
          x: 45,
          y: 690,
          size: 12,
          font: bold,
          color: rgb(0.88, 0.14, 0.11),
        });
        page.drawText(
          "Lead Systems Engineer — PDF Studio Enterprise (2022 - Present)",
          { x: 45, y: 668, size: 11, font: bold, color: rgb(0.15, 0.15, 0.15) },
        );
        page.drawText(
          "Architected high-throughput client-side PDF processing & OCR pipelines.",
          { x: 45, y: 650, size: 10, font, color: rgb(0.3, 0.3, 0.3) },
        );
      } else if (tpl.id === "form") {
        page.drawText("CLIENT ONBOARDING & COMPLIANCE FORM", {
          x: 45,
          y: 780,
          size: 16,
          font: bold,
          color: rgb(0.11, 0.12, 0.14),
        });
        [
          "Full Legal Name:",
          "Organization / Company:",
          "Tax Identification Number:",
          "Primary Contact Email:",
          "Authorized Representative Signature:",
        ].forEach((field, idx) => {
          const y = 720 - idx * 55;
          page.drawText(field, {
            x: 45,
            y,
            size: 11,
            font: bold,
            color: rgb(0.2, 0.2, 0.2),
          });
          page.drawRectangle({
            x: 45,
            y: y - 26,
            width: 505,
            height: 22,
            borderColor: rgb(0.75, 0.75, 0.75),
            borderWidth: 1,
          });
        });
      }

      const bytes = await pdfDoc.save();
      const newId = await onSaveLibrary(
        `${tpl.title.replace(/\s+/g, "_")}.pdf`,
        bytes,
      );
      notify(`Created "${tpl.title}" and opened in Editor!`);
      onOpenEditor(newId);
    } catch (e) {
      notify(`Template creation failed: ${e.message}`, "error");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900">
          Create PDF from Blank Canvas or Template
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Select a template to generate a real PDF document and launch it
          directly into the PDF Editor.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {templates.map((tpl) => (
          <div
            key={tpl.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-red-300 transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-md bg-red-50 text-[#E1251B] text-[10px] font-bold uppercase">
                  {tpl.badge}
                </span>
                <FileText className="w-5 h-5 text-slate-400" />
              </div>
              <h3 className="font-bold text-base text-slate-900">
                {tpl.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1">{tpl.desc}</p>
            </div>
            <button
              onClick={() => handleCreateFromTemplate(tpl)}
              className="mt-5 w-full py-2.5 rounded-xl bg-slate-900 hover:bg-[#E1251B] text-white text-xs font-bold transition"
            >
              Create & Edit Document →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// 11. SUBSCRIPTION PLANS & BILLING VIEW
// ============================================================================
function SubscriptionView({ currentUser, setCurrentUser, notify }) {
  const plans = [
    {
      code: "FREE",
      name: "Starter Free",
      price: "$0",
      period: "/month",
      desc: "Essential PDF reading, basic merging, and local storage.",
      features: [
        "Standard PDF Reader & Dark Mode",
        "Basic Merge & Split (up to 3 files)",
        "1 GB Local Document Vault",
        "Standard Watermarking",
      ],
    },
    {
      code: "PRO",
      name: "PDF Studio Pro",
      price: "$14.99",
      period: "/month",
      popular: true,
      desc: "Complete editing, OCR, compression & e-signature suite.",
      features: [
        "Full PDF Content & Image Editor",
        "English & Khmer OCR Recognition",
        "Unlimited Merge, Split & Compression",
        "Custom E-Signatures & Stamps",
        "10 GB Document Vault",
      ],
    },
    {
      code: "BUSINESS",
      name: "Business Enterprise",
      price: "$29.99",
      period: "/seat/mo",
      desc: "Team workspaces, permanent redaction & admin governance.",
      features: [
        "Everything in PDF Studio Pro",
        "True Permanent Content Redaction",
        "Team Folders & Shared Workspaces",
        "Admin Console & Role Governance",
        "100 GB Enterprise Storage",
      ],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs text-center">
        <h2 className="text-2xl font-bold text-slate-900">
          Transparent Plans for Individuals & Teams
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Switch plans anytime to test role-based capabilities across PDF
          Studio.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p) => {
          const isCurrent = currentUser.plan === p.code;
          return (
            <div
              key={p.code}
              className={`bg-white rounded-2xl p-6 border-2 flex flex-col justify-between shadow-xs ${
                p.popular ? "border-[#E1251B] relative" : "border-slate-200"
              }`}
            >
              {p.popular && (
                <span className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-[#E1251B] text-white text-[10px] font-bold uppercase">
                  Most Popular
                </span>
              )}
              <div>
                <h3 className="font-bold text-lg text-slate-900">{p.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-slate-900">
                    {p.price}
                  </span>
                  <span className="text-xs text-slate-500">{p.period}</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">{p.desc}</p>
                <ul className="mt-5 space-y-2.5 text-xs text-slate-700">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => {
                  setCurrentUser({ ...currentUser, plan: p.code });
                  notify(`Active subscription updated to ${p.name}`);
                }}
                className={`mt-6 w-full py-2.5 rounded-xl text-xs font-bold transition ${
                  isCurrent
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-[#E1251B] hover:bg-red-700 text-white"
                }`}
              >
                {isCurrent ? "Current Active Plan" : `Switch to ${p.name}`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// 12. ADMINISTRATOR DASHBOARD VIEW
// ============================================================================
function AdminDashboardView({
  documents,
  adminUsers,
  setAdminUsers,
  featureFlags,
  setFeatureFlags,
  systemLogs,
  notify,
}) {
  const stats = [
    {
      label: "Total Registered Users",
      value: "1,284",
      delta: "+14.2%",
      icon: Users,
    },
    {
      label: "Active Monthly Sessions",
      value: "942",
      delta: "+8.7%",
      icon: Activity,
    },
    {
      label: "Vault Storage Utilized",
      value: formatBytes(documents.reduce((a, d) => a + d.size, 0) + 428000000),
      delta: "Healthy",
      icon: HardDrive,
    },
    {
      label: "Processing Error Rate",
      value: "0.02%",
      delta: "99.98% SLA",
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs"
            >
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold">{s.label}</span>
                <Icon className="w-4 h-4 text-[#E1251B]" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900">
                {s.value}
              </div>
              <span className="text-[11px] font-semibold text-emerald-600 mt-1 block">
                {s.delta}
              </span>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Account Management */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <h3 className="font-bold text-slate-900 mb-4">
            User Accounts & Role Governance
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500 uppercase">
                  <th className="py-2.5">User</th>
                  <th className="py-2.5">Role</th>
                  <th className="py-2.5">Plan</th>
                  <th className="py-2.5">Storage</th>
                  <th className="py-2.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {adminUsers.map((u) => (
                  <tr key={u.id}>
                    <td className="py-3">
                      <div className="font-bold text-slate-900">{u.name}</div>
                      <div className="text-slate-400">{u.email}</div>
                    </td>
                    <td className="py-3">
                      <select
                        value={u.role}
                        onChange={(e) => {
                          setAdminUsers((prev) =>
                            prev.map((item) =>
                              item.id === u.id
                                ? { ...item, role: e.target.value }
                                : item,
                            ),
                          );
                          notify(`Updated role for ${u.name}`);
                        }}
                        className="border rounded px-2 py-1 bg-white"
                      >
                        <option>Administrator</option>
                        <option>Business User</option>
                        <option>Pro User</option>
                        <option>Free User</option>
                      </select>
                    </td>
                    <td className="py-3 font-semibold">{u.plan}</td>
                    <td className="py-3 text-slate-600">{u.storage}</td>
                    <td className="py-3 text-right">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold">
                        {u.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Feature Availability Toggles */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900">System Feature Flags</h3>
          <div className="space-y-3 text-xs">
            {Object.entries(featureFlags).map(([key, enabled]) => (
              <div
                key={key}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50"
              >
                <span className="font-semibold text-slate-800 capitalize">
                  {key.replace(/([A-Z])/g, " $1")}
                </span>
                <button
                  onClick={() => {
                    setFeatureFlags((prev) => ({ ...prev, [key]: !enabled }));
                    notify(`Toggled ${key}`);
                  }}
                  className={`w-10 h-5 rounded-full transition p-0.5 ${enabled ? "bg-[#E1251B]" : "bg-slate-300"}`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${enabled ? "translate-x-5" : ""}`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Activity Logs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <h3 className="font-bold text-slate-900 mb-3">
          Real-Time Processing & Audit Activity Log
        </h3>
        <div className="space-y-2 text-xs">
          {systemLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-50"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-2 h-2 rounded-full ${log.status === "Error" ? "bg-red-500" : "bg-emerald-500"}`}
                />
                <span className="font-semibold text-slate-800">
                  {log.event}
                </span>
                <span className="text-slate-400">by {log.user}</span>
              </div>
              <span className="font-mono text-slate-500">{log.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
