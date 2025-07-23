import { useState, useCallback } from "react";

let toastCounter = 0;

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((props) => {
    const { duration = 5000, ...rest } = props;
    const id = (++toastCounter).toString();
    const newToast = { ...rest, id, duration };

    setToasts((currentToasts) => [...currentToasts, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((currentToasts) =>
          currentToasts.filter((toast) => toast.id !== id)
        );
      }, duration);
    }

    return {
      id,
      dismiss: () => {
        setToasts((currentToasts) =>
          currentToasts.filter((toast) => toast.id !== id)
        );
      },
      update: (newProps) => {
        setToasts((currentToasts) =>
          currentToasts.map((toast) =>
            toast.id === id ? { ...toast, ...newProps } : toast
          )
        );
      },
    };
  }, []);

  const dismiss = useCallback((toastId) => {
    setToasts((currentToasts) =>
      toastId
        ? currentToasts.filter((toast) => toast.id !== toastId)
        : []
    );
  }, []);

  return {
    toast,
    dismiss,
    toasts,
  };
}
