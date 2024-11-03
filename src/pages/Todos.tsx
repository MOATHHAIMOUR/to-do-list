import { useEffect, useReducer } from "react";
import useCustomQuery from "../components/hooks/useCustomQuery";
import Paginator from "../components/Paginator";
import { IPaginatedResult } from "../interfaces/IPaginated";
import { ITodo } from "../interfaces/ITodo";

interface IState {
  CurrentPageNumber: number;
  TotalPageNumber: number;
  pageSize: number;
  sortType: string;
}

type Action =
  | { type: "nextPage" }
  | { type: "PrevPage" }
  | {
      type: "ready";
      payload: number;
    }
  | { type: "onPageSizeChanged"; payload: number }
  | { type: "onSortByChanged"; payload: string };

const initialState: IState = {
  CurrentPageNumber: 1,
  TotalPageNumber: 1,
  pageSize: 1,
  sortType: "ASC",
};

function reducer(state: IState, action: Action): IState {
  switch (action.type) {
    case "ready":
      return {
        ...state,
        TotalPageNumber: action.payload,
      };
    case "nextPage":
      return { ...state, CurrentPageNumber: state.CurrentPageNumber + 1 };
    case "PrevPage":
      return { ...state, CurrentPageNumber: state.CurrentPageNumber - 1 };
    case "onPageSizeChanged":
      return { ...state, pageSize: action.payload };
    case "onSortByChanged":
      return { ...state, sortType: action.payload };

    default:
      throw new Error(`Unknown action type`);
  }
}

const Todos = () => {
  const userData = JSON.parse(localStorage.getItem("loggedInUser")!);

  /* ────────────── State  ────────────── */
  const [{ CurrentPageNumber, TotalPageNumber, pageSize, sortType }, dispatch] =
    useReducer(reducer, initialState);

  const {
    data: UserToDo,
    isLoading,
    isFetching,
  } = useCustomQuery<IPaginatedResult<ITodo>>({
    queryKey: [`to-dos-paginated ${sortType} ${pageSize} ${CurrentPageNumber}`],
    url: `/todos?pagination[pageSize]=${pageSize}&pagination[page]=${CurrentPageNumber}&sort=createdAt:${sortType}`,
    config: {
      headers: {
        Authorization: `Bearer ${userData.jwt}`,
      },
    },
  });

  useEffect(() => {
    console.log("here");
    console.log("total: " + UserToDo?.meta.pagination.total);
    if (UserToDo !== undefined)
      dispatch({
        type: "ready",
        payload: UserToDo.meta.pagination.pageCount,
      });
  }, [UserToDo]);

  /* ────────────── Handlers  ────────────── */
  const onNextPage = () => {
    dispatch({ type: "nextPage" });
  };
  const onPrevPage = () => {
    dispatch({ type: "PrevPage" });
  };

  /* ────────────── Render  ────────────── */
  const renderTodos =
    UserToDo?.data?.length === 0 ? (
      <p>no todos for this user</p>
    ) : (
      UserToDo?.data?.map((todo, i) => {
        return (
          <div
            key={i}
            className="flex items-center justify-between p-4 bg-white border rounded shadow-md"
          >
            <span className="text-lg font-medium">{todo.title}</span>
          </div>
        );
      })
    );

  return (
    <div className="container flex flex-col">
      <div className=" flex items-center ml-auto gap-4">
        <select
          value={sortType}
          onChange={(e) =>
            dispatch({ type: "onSortByChanged", payload: e.target.value })
          }
          className="border-2 border-indigo-600 rounded-md p-2"
        >
          <option disabled>Sort Type</option>
          <option value="ASC">ASC</option>
          <option value="DESC">DESC</option>{" "}
        </select>
        <select
          value={pageSize}
          onChange={(e) =>
            dispatch({ type: "onPageSizeChanged", payload: +e.target.value })
          }
          className="border-2 border-indigo-600 rounded-md p-2"
        >
          <option disabled>Page size</option>
          <option value={10}>10</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
          <option value={150}>150</option>
        </select>
      </div>
      <div className="flex  flex-col gap-5">
        {isLoading ? (
          <div className="  p-4 flex-col  border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700">
            <div className=" p-4 bg-gray-300 rounded-full dark:bg-gray-300 w-full mb-4"></div>
            <div className=" p-4 bg-gray-300 rounded-full dark:bg-gray-300 w-full mb-4"></div>
            <div className=" p-4 bg-gray-300 rounded-full dark:bg-gray-300 w-full mb-4"></div>
            <div className=" p-4 bg-gray-300 rounded-full dark:bg-gray-300 w-full mb-4"></div>
            <div className=" p-4 bg-gray-300 rounded-full dark:bg-gray-300 w-full mb-0"></div>
          </div>
        ) : (
          renderTodos
        )}
      </div>
      <div className="w-fit mx-auto">
        <Paginator
          isFetching={isFetching}
          isLoading={isLoading}
          pageNumber={CurrentPageNumber}
          nextPage={onNextPage}
          prevPage={onPrevPage}
          totalPages={TotalPageNumber}
        />
      </div>
    </div>
  );
};

export default Todos;
