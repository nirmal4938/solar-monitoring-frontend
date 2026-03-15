import { useEffect } from "react";
import { useLoader } from "../context/LoadingContext";

export const usePageLoader = (loading) => {
  const { showLoader, hideLoader } = useLoader();

  useEffect(() => {
    if (loading) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [loading]);
};