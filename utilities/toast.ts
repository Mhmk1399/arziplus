import toast from 'react-hot-toast';

// Custom toast styles that match the project's design patterns
const toastStyles = {
  success: {
    background: 'rgba(34, 197, 94, 0.1)',
    backdropFilter: 'blur(12px)',
    color: '#000000',
    border: '1px solid rgba(34, 197, 94, 0.3)',
    borderRadius: '16px',
    fontSize: '14px',
    fontWeight: '500',
    boxShadow: '0 8px 32px rgba(34, 197, 94, 0.2)',
  },
  error: {
    background: 'rgba(239, 68, 68, 0.1)',
    backdropFilter: 'blur(12px)',
    color: '#000000',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '16px',
    fontSize: '14px',
    fontWeight: '500',
    boxShadow: '0 8px 32px rgba(239, 68, 68, 0.2)',
  },
  warning: {
    background: 'rgba(245, 158, 11, 0.1)',
    backdropFilter: 'blur(12px)',
    color: '#000000',
    border: '1px solid rgba(245, 158, 11, 0.3)',
    borderRadius: '16px',
    fontSize: '14px',
    fontWeight: '500',
    boxShadow: '0 8px 32px rgba(245, 158, 11, 0.2)',
  },
  info: {
    background: 'rgba(77, 191, 240, 0.1)',
    backdropFilter: 'blur(12px)',
    color: '#000000',
    border: '1px solid rgba(77, 191, 240, 0.3)',
    borderRadius: '16px',
    fontSize: '14px',
    fontWeight: '500',
    boxShadow: '0 8px 32px rgba(77, 191, 240, 0.2)',
  },
  loading: {
    background: 'rgba(156, 163, 175, 0.1)',
    backdropFilter: 'blur(12px)',
    color: '#000000',
    border: '1px solid rgba(156, 163, 175, 0.3)',
    borderRadius: '16px',
    fontSize: '14px',
    fontWeight: '500',
    boxShadow: '0 8px 32px rgba(156, 163, 175, 0.2)',
  }
};

// Custom toast functions that match project design
export const showToast = {
  success: (message: string, options?: any) => {
    return toast.success(message, {
      duration: 4000,
      position: 'top-center',
      style: toastStyles.success,
      icon: '✅',
      ...options,
    });
  },

  error: (message: string, options?: any) => {
    return toast.error(message, {
      duration: 5000,
      position: 'top-center',
      style: toastStyles.error,
      icon: '❌',
      ...options,
    });
  },

  warning: (message: string, options?: any) => {
    return toast(message, {
      duration: 4000,
      position: 'top-center',
      style: toastStyles.warning,
      icon: '⚠️',
      ...options,
    });
  },

  info: (message: string, options?: any) => {
    return toast(message, {
      duration: 4000,
      position: 'top-center',
      style: toastStyles.info,
      icon: 'ℹ️',
      ...options,
    });
  },

  loading: (message: string, options?: any) => {
    return toast.loading(message, {
      position: 'top-center',
      style: toastStyles.loading,
      ...options,
    });
  },

  promise: (
    promise: Promise<string>,
    messages: {
      loading: string;
      success: string;
      error: string;
    },
    options?: any
  ) => {
    return toast.promise(promise, messages, {
      loading: {
        style: toastStyles.loading,
      },
      success: {
        style: toastStyles.success,
        icon: '✅',
      },
      error: {
        style: toastStyles.error,
        icon: '❌',
      },
      position: 'top-center',
      ...options,
    });
  },

  // Custom validation error handler for forms
  validationError: (errors: string[]) => {
    if (errors.length === 1) {
      return showToast.error(errors[0]);
    }

    // Show main error
    showToast.error('خطاهایی در فرم وجود دارد', {
      icon: '📝',
    });

    // Show detailed errors with staggered animation
    errors.forEach((error, index) => {
      setTimeout(() => {
        toast.error(error, {
          duration: 4000,
          position: 'top-center',
          style: {
            ...toastStyles.error,
            background: 'rgba(239, 68, 68, 0.05)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            fontSize: '13px',
            fontWeight: '400',
          },
          icon: '🔸',
        });
      }, (index + 1) * 400);
    });
  },

  // Service-specific toasts
  service: {
    created: (serviceName: string) => {
      return showToast.success(`سرویس "${serviceName}" با موفقیت ایجاد شد! 🎉`, {
        duration: 6000,
        icon: '🚀',
      });
    },

    updated: (serviceName: string) => {
      return showToast.success(`سرویس "${serviceName}" با موفقیت بروزرسانی شد! ✨`, {
        duration: 5000,
        icon: '📝',
      });
    },

    deleted: (serviceName: string) => {
      return showToast.success(`سرویس "${serviceName}" با موفقیت حذف شد`, {
        duration: 4000,
        icon: '🗑️',
      });
    },

    statusChanged: (serviceName: string, status: string) => {
      const statusText = status === 'active' ? 'فعال' : status === 'inactive' ? 'غیرفعال' : 'پیش‌نویس';
      return showToast.info(`وضعیت سرویس "${serviceName}" به "${statusText}" تغییر یافت`, {
        duration: 4000,
        icon: status === 'active' ? '🟢' : status === 'inactive' ? '🔴' : '🟡',
      });
    },

    requestSubmitted: (serviceName: string) => {
      return showToast.success(`درخواست سرویس "${serviceName}" با موفقیت ثبت شد! 📋`, {
        duration: 6000,
        icon: '📨',
      });
    },
  },
};

// Utility function to dismiss all toasts
export const dismissAllToasts = () => {
  toast.dismiss();
};

export default showToast;