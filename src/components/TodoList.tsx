import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../config/axios.config";
import useAuthenticatedQuery from "./hooks/useAuthenticatedQuery";

const TodoList = () => {
  const userData = JSON.parse(localStorage.getItem("loggedInUser")!);
  const { isLoading, data, error } = useAuthenticatedQuery({
    queryKey: ["to-dos"],
    url: "/users/me?populate=todos",
    config: {
      headers: {
        Authorization: `Bearer  ${userData.jwt}`,
      },
    },
  });

  /* ────────────── Render  ────────────── */

  return <p>lion</p>;
};

export default TodoList;
