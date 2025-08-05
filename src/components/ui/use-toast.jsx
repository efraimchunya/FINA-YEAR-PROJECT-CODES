import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function useToast() {
  return {
    toast: ({ title, description, variant }) => {
      const message = title ? `${title}: ${description}` : description;

      if (variant === "destructive") {
        toast.error(message);
      } else {
        toast.success(message); // default to success
      }
    },
  };
}
