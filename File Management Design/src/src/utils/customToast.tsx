/**
 * Custom Toast Notifications
 * Reusable toast notifications with custom icons, colors, and styling
 * Built on top of Sonner for consistent UX across the app
 */

import { toast } from "sonner@2.0.3";
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Info,
  AlertTriangle,
  Loader2,
  LucideIcon
} from "lucide-react";

interface ToastOptions {
  title: string;
  description?: string;
  icon?: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  duration?: number;
}

// Success Toast - Green theme
export const showSuccessToast = (options: ToastOptions | string) => {
  if (typeof options === "string") {
    options = { title: options };
  }

  const { 
    title, 
    description, 
    icon: Icon = CheckCircle,
    iconColor = "text-green-600",
    iconBgColor = "bg-green-100",
    duration = 3000 
  } = options;

  toast.custom(
    (t) => (
      <div className="bg-white border-2 border-green-200 rounded-xl shadow-lg p-4 flex items-start gap-3 max-w-md animate-in slide-in-from-top-5">
        <div className={`${iconBgColor} rounded-full p-2 flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900">{title}</p>
          {description && (
            <p className="text-sm text-gray-600 mt-0.5">{description}</p>
          )}
        </div>
        <button
          onClick={() => toast.dismiss(t)}
          className="text-gray-400 hover:text-gray-600 flex-shrink-0"
        >
          <XCircle className="w-4 h-4" />
        </button>
      </div>
    ),
    { duration }
  );
};

// Error Toast - Red theme
export const showErrorToast = (options: ToastOptions | string) => {
  if (typeof options === "string") {
    options = { title: options };
  }

  const { 
    title, 
    description, 
    icon: Icon = XCircle,
    iconColor = "text-red-600",
    iconBgColor = "bg-red-100",
    duration = 4000 
  } = options;

  toast.custom(
    (t) => (
      <div className="bg-white border-2 border-red-200 rounded-xl shadow-lg p-4 flex items-start gap-3 max-w-md animate-in slide-in-from-top-5">
        <div className={`${iconBgColor} rounded-full p-2 flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900">{title}</p>
          {description && (
            <p className="text-sm text-gray-600 mt-0.5">{description}</p>
          )}
        </div>
        <button
          onClick={() => toast.dismiss(t)}
          className="text-gray-400 hover:text-gray-600 flex-shrink-0"
        >
          <XCircle className="w-4 h-4" />
        </button>
      </div>
    ),
    { duration }
  );
};

// Warning Toast - Orange/Yellow theme
export const showWarningToast = (options: ToastOptions | string) => {
  if (typeof options === "string") {
    options = { title: options };
  }

  const { 
    title, 
    description, 
    icon: Icon = AlertTriangle,
    iconColor = "text-orange-600",
    iconBgColor = "bg-orange-100",
    duration = 4000 
  } = options;

  toast.custom(
    (t) => (
      <div className="bg-white border-2 border-orange-200 rounded-xl shadow-lg p-4 flex items-start gap-3 max-w-md animate-in slide-in-from-top-5">
        <div className={`${iconBgColor} rounded-full p-2 flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900">{title}</p>
          {description && (
            <p className="text-sm text-gray-600 mt-0.5">{description}</p>
          )}
        </div>
        <button
          onClick={() => toast.dismiss(t)}
          className="text-gray-400 hover:text-gray-600 flex-shrink-0"
        >
          <XCircle className="w-4 h-4" />
        </button>
      </div>
    ),
    { duration }
  );
};

// Info Toast - Blue theme
export const showInfoToast = (options: ToastOptions | string) => {
  if (typeof options === "string") {
    options = { title: options };
  }

  const { 
    title, 
    description, 
    icon: Icon = Info,
    iconColor = "text-blue-600",
    iconBgColor = "bg-blue-100",
    duration = 3000 
  } = options;

  toast.custom(
    (t) => (
      <div className="bg-white border-2 border-blue-200 rounded-xl shadow-lg p-4 flex items-start gap-3 max-w-md animate-in slide-in-from-top-5">
        <div className={`${iconBgColor} rounded-full p-2 flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900">{title}</p>
          {description && (
            <p className="text-sm text-gray-600 mt-0.5">{description}</p>
          )}
        </div>
        <button
          onClick={() => toast.dismiss(t)}
          className="text-gray-400 hover:text-gray-600 flex-shrink-0"
        >
          <XCircle className="w-4 h-4" />
        </button>
      </div>
    ),
    { duration }
  );
};

// Loading Toast - Purple theme (for processing)
export const showLoadingToast = (options: ToastOptions | string) => {
  if (typeof options === "string") {
    options = { title: options };
  }

  const { 
    title, 
    description, 
    icon: Icon = Loader2,
    iconColor = "text-purple-600",
    iconBgColor = "bg-purple-100",
    duration = Infinity // Don't auto-dismiss loading toasts
  } = options;

  return toast.custom(
    (t) => (
      <div className="bg-white border-2 border-purple-200 rounded-xl shadow-lg p-4 flex items-start gap-3 max-w-md animate-in slide-in-from-top-5">
        <div className={`${iconBgColor} rounded-full p-2 flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${iconColor} animate-spin`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900">{title}</p>
          {description && (
            <p className="text-sm text-gray-600 mt-0.5">{description}</p>
          )}
        </div>
      </div>
    ),
    { duration }
  );
};

// Input Required Toast - Purple theme with specific icon
export const showInputRequiredToast = (options: ToastOptions | string) => {
  if (typeof options === "string") {
    options = { title: options };
  }

  const { 
    title, 
    description, 
    icon: Icon = AlertCircle,
    iconColor = "text-purple-600",
    iconBgColor = "bg-purple-100",
    duration = 4000 
  } = options;

  toast.custom(
    (t) => (
      <div className="bg-white border-2 border-purple-200 rounded-xl shadow-lg p-4 flex items-start gap-3 max-w-md animate-in slide-in-from-top-5">
        <div className={`${iconBgColor} rounded-full p-2 flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900">{title}</p>
          {description && (
            <p className="text-sm text-gray-600 mt-0.5">{description}</p>
          )}
        </div>
        <button
          onClick={() => toast.dismiss(t)}
          className="text-gray-400 hover:text-gray-600 flex-shrink-0"
        >
          <XCircle className="w-4 h-4" />
        </button>
      </div>
    ),
    { duration }
  );
};

// Custom Toast with full control
export const showCustomToast = (options: ToastOptions & {
  borderColor?: string;
  textColor?: string;
}) => {
  const { 
    title, 
    description, 
    icon: Icon = Info,
    iconColor = "text-gray-600",
    iconBgColor = "bg-gray-100",
    borderColor = "border-gray-200",
    textColor = "text-gray-900",
    duration = 3000 
  } = options;

  toast.custom(
    (t) => (
      <div className={`bg-white border-2 ${borderColor} rounded-xl shadow-lg p-4 flex items-start gap-3 max-w-md animate-in slide-in-from-top-5`}>
        <div className={`${iconBgColor} rounded-full p-2 flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`font-medium ${textColor}`}>{title}</p>
          {description && (
            <p className="text-sm text-gray-600 mt-0.5">{description}</p>
          )}
        </div>
        <button
          onClick={() => toast.dismiss(t)}
          className="text-gray-400 hover:text-gray-600 flex-shrink-0"
        >
          <XCircle className="w-4 h-4" />
        </button>
      </div>
    ),
    { duration }
  );
};
