import { useSelector } from "react-redux";

export const useToken = () => {
  const token = useSelector((state) => state.user.token);
  return token;
};
