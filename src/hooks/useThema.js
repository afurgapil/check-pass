import { useSelector } from "react-redux";

export const useThema = () => {
  const thema = useSelector((state) => state.data.thema);
  return thema;
};
