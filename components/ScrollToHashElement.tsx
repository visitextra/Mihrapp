import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const ScrollToHashElement = () => {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (hash) {
      const targetId = hash.replace("#", "");
      const scrollToElement = () => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            inline: "nearest",
          });
        }
      };

      scrollToElement();
      const timer = setTimeout(scrollToElement, 150);
      return () => clearTimeout(timer);
    }
  }, [hash, pathname]);

  return null;
};
