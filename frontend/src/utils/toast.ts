import { toast } from 'react-hot-toast';

// Success toast
export const showSuccess = (message: string) => {
  toast.success(message, {
    duration: 3000,
    position: 'top-right',
  });
};

// Error toast
export const showError = (message: string) => {
  toast.error(message, {
    duration: 5000,
    position: 'top-right',
  });
};

// Loading toast (returns toastId for dismissal)
export const showLoading = (message: string): string => {
  return toast.loading(message, {
    position: 'top-right',
  });
};

// Promise toast (for async operations)
export const showPromise = (
  promise: Promise<unknown>,
  messages: {
    loading: string;
    success: string;
    error: string;
  }
) => {
  return toast.promise(
    promise,
    {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
    },
    {
      position: 'top-right',
    }
  );
};

// Dismiss specific toast
export const dismissToast = (toastId?: string) => {
  if (toastId) {
    toast.dismiss(toastId);
  } else {
    toast.dismiss();
  }
};

// Close/dismiss toast (alias for dismissToast)
export const closeToast = (toastId?: string) => {
  dismissToast(toastId);
};

// Close all toasts
export const closeAllToasts = () => {
  toast.dismiss();
};

// Custom toast
export const showCustom = (
  message: string,
  type: 'success' | 'error' | 'default' = 'default',
  icon?: string
) => {
  const options = {
    duration: 3000,
    position: 'top-right' as const,
  };

  switch (type) {
    case 'success':
      return toast.success(message, options);
    case 'error':
      return toast.error(message, options);
    default:
      return toast(message, { ...options, icon });
  }
};

// File upload specific toasts
export const fileToasts = {
  invalidType: () => showError('Please select a valid image file (JPEG, PNG, WebP, etc.)'),
  tooLarge: (maxSizeMB: number = 10) => showError(`File size too large. Please select an image under ${maxSizeMB}MB.`),
  selected: (fileName: string) => showSuccess(`Selected: ${fileName}`),
  dropped: (fileName: string) => showSuccess(`Dropped: ${fileName}`),
  removed: () => showSuccess('File removed'),
  uploadSuccess: () => showSuccess('Image uploaded successfully! Model training started.'),
  uploadError: (error?: string) => showError(error || 'Upload failed. Please try again.'),
  noFile: () => showError('Please select an image file first'),
  noLabel: () => showError('Please enter a label for the image'),
  networkError: () => showError('Network error. Please check if the backend server is running.'),
  close: (toastId?: string) => closeToast(toastId),
  closeAll: () => closeAllToasts(),
};

// Model specific toasts
export const modelToasts = {
  loadError: () => showError('Failed to load models. Please try again.'),
  trainingStarted: () => showSuccess('Model training started successfully!'),
  trainingError: () => showError('Model training failed. Please check your data.'),
  close: (toastId?: string) => closeToast(toastId),
  closeAll: () => closeAllToasts(),
};

// Generic toasts
export const genericToasts = {
  success: (message: string) => showSuccess(message),
  error: (message: string) => showError(message),
  loading: (message: string) => showLoading(message),
  close: (toastId?: string) => closeToast(toastId),
  closeAll: () => closeAllToasts(),
};

// Authentication toasts
export const authToasts = {
  loginSuccess: () => showSuccess('Login successful! Welcome back.'),
  loginError: (error?: string) => showError(error || 'Login failed. Please check your credentials.'),
  signupSuccess: () => showSuccess('Account created successfully! Welcome aboard.'),
  signupError: (error?: string) => showError(error || 'Signup failed. Please try again.'),
  logoutSuccess: () => showSuccess('Logged out successfully. See you soon!'),
  invalidCredentials: () => showError('Invalid email or password. Please try again.'),
  passwordMismatch: () => showError('Passwords do not match. Please check and try again.'),
  weakPassword: () => showError('Password must be at least 6 characters long.'),
  emailRequired: () => showError('Please enter a valid email address.'),
  fieldsRequired: () => showError('Please fill in all required fields.'),
  success: (message: string) => showSuccess(message),
  close: (toastId?: string) => closeToast(toastId),
  closeAll: () => closeAllToasts(),
};