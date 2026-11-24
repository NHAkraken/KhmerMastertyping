interface Window {
  PDFLib: any;
  pdfjsLib: any;
  Tesseract: any;
  mammoth: any;
  XLSX: any;
  [key: string]: any;
}

interface Navigator {
  standalone?: boolean;
  [key: string]: any;
}

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
  interface Element extends any {}
}

declare module 'react' {
  export = React;
  export as namespace React;
  namespace React {
    type ReactNode = any;
    type FC<P = {}> = any;
    type ComponentType<P = {}> = any;
    function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prev: T) => T)) => void];
    function useEffect(effect: () => void | (() => void), deps?: any[]): void;
    function useRef<T>(initialValue?: T): { current: T };
    function useCallback<T extends (...args: any[]) => any>(callback: T, deps: any[]): T;
    function useMemo<T>(factory: () => T, deps: any[]): T;
    function createElement(...args: any[]): any;
  }
}

declare module 'react/jsx-runtime' {
  export const jsx: any;
  export const jsxs: any;
  export const Fragment: any;
}

declare module 'lucide-react' {
  export const
  Activity: any,
  AlertCircle: any,
  ArrowUpRight: any,
  Award: any,
  Bell: any,
  Bookmark: any,
  Check: any,
  CheckCircle2: any,
  ChevronLeft: any,
  ChevronRight: any,
  Circle: any,
  Clock: any,
  Copy: any,
  Crown: any,
  Download: any,
  DownloadCloud: any,
  Droplet: any,
  Edit3: any,
  Eraser: any,
  Eye: any,
  EyeOff: any,
  FileCode: any,
  FileImage: any,
  FilePlus: any,
  FileSpreadsheet: any,
  FileText: any,
  Folder: any,
  FolderPlus: any,
  HardDrive: any,
  Highlighter: any,
  Image: any,
  Info: any,
  KeyRound: any,
  Layers: any,
  LayoutGrid: any,
  List: any,
  Lock: any,
  Maximize2: any,
  Menu: any,
  Merge: any,
  MessageSquare: any,
  Minimize: any,
  Minimize2: any,
  Minus: any,
  Moon: any,
  MoreVertical: any,
  MousePointer: any,
  Move: any,
  PenTool: any,
  Play: any,
  Plus: any,
  Presentation: any,
  Printer: any,
  Redo2: any,
  RefreshCw: any,
  RotateCcw: any,
  RotateCw: any,
  Save: any,
  ScanText: any,
  Scissors: any,
  Search: any,
  Settings: any,
  Share2: any,
  Shield: any,
  ShieldCheck: any,
  Sliders: any,
  Sparkles: any,
  Square: any,
  Star: any,
  Strikethrough: any,
  Sun: any,
  Trash2: any,
  Type: any,
  Underline: any,
  Undo2: any,
  Unlock: any,
  Upload: any,
  User: any,
  Users: any,
  X: any,
  ZoomIn: any,
  ZoomOut: any;
}
