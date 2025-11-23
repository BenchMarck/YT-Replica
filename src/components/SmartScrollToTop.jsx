import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function SmartScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    if (pathname.includes("/search-advanced")) return;

    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, [pathname, search]);

  return null;
}
