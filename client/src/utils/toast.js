import { toast } from "react-toastify";

// Central helper so all API error toasts read a message consistently
// from common backend error shapes, with a sensible fallback.
export const getErrorMessage = (err, fallback = "Something went wrong. Please try again.") => {
  return (
    err?.response?.data?.error ||
    err?.response?.data?.message ||
    err?.response?.data?.details?.error ||
    err?.message ||
    fallback
  );
};

export const notifySuccess = (message) => toast.success(message);
export const notifyError = (message) => toast.error(message);
export const notifyInfo = (message) => toast.info(message);
export const notifyWarning = (message) => toast.warning(message);
