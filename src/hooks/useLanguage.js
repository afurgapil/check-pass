import { useSelector } from "react-redux";

export const useLanguage = () => {
  const lang = useSelector((state) => state.data.lang);
  return lang;
};
