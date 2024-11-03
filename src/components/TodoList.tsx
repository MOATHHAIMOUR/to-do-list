import { useEffect, useState } from "react";
import { IUser } from "../interfaces/IUser";
import useCustomQuery from "./hooks/useCustomQuery";
import Modal from "./ui/Modal";
import { ITodo } from "../interfaces/ITodo";
import { IFormField, TodoFormFields } from "../interfaces/IForms";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { todoSchema } from "../validations";
import ErrorMsg from "./ErrorMsg";
import axiosInstance from "../config/axios.config";
import Button from "./ui/Button";
import Input from "./ui/Input";
import { faker } from "@faker-js/faker";

const TodoList = () => {
  const toDosInputs: IFormField<TodoFormFields>[] = [
    {
      name: "title",
      placeholder: " enter your title",
      type: "text",
    },
    {
      name: "description",
      placeholder: "enter your description",
      type: "text",
    },
  ];
  const defaultTodo: ITodo = {
    title: "",
    description: "",
  };

  const userData = JSON.parse(localStorage.getItem("loggedInUser")!);

  /* ────────────── state  ────────────── */
  const [queryVersion, setQueryVersion] = useState(1);

  const { data: UserToDo, isLoading } = useCustomQuery<IUser>({
    queryKey: ["to-dos", `${queryVersion}`],
    url: "/users/me?populate=todos",
    config: {
      headers: {
        Authorization: `Bearer ${userData.jwt}`,
      },
    },
  });

  const [isSaveOpen, setIsOpenSaveModal] = useState(false);

  const [isSaving, setIsSaving] = useState(false);

  const [mode, setMode] = useState<"Add" | "Update">("Add");

  const [selectedTodo, setSelectedTodo] = useState<ITodo>(defaultTodo);

  const [isDeleting, setIsDeleting] = useState(false);

  const [isDeleteOpen, setIsDeleteModal] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm<TodoFormFields>({
    resolver: yupResolver(todoSchema),
    defaultValues: {
      title: selectedTodo?.title,
      description: selectedTodo?.description,
    },
  });

  useEffect(() => {
    reset({
      title: selectedTodo?.title,
      description: selectedTodo?.description,
    });
  }, [selectedTodo?.description, selectedTodo?.title, reset]);

  /* ────────────── Handlers  ────────────── */

  const onSubmit: SubmitHandler<TodoFormFields> = async (data) => {
    setIsSaving(true);
    try {
      if (mode === "Add") {
        console.log("add new ");
        await axiosInstance.post(
          "/todos",
          {
            data: {
              title: getValues("title"),
              description: getValues("description"),
              users: [UserToDo?.id],
            },
          },
          {
            headers: {
              Authorization: `Bearer ${userData.jwt}`,
            },
          }
        );
      } else {
        await axiosInstance.put(
          `/todos/${selectedTodo?.documentId}`,
          {
            data: { title: data.title, description: data.description },
          },
          {
            headers: {
              Authorization: `Bearer ${userData.jwt}`,
            },
          }
        );
      }
      setQueryVersion((prev) => prev + 1);
      onCloseSaveModal();
    } catch (err) {
      console.log(err);
    } finally {
      setIsSaving(false);
    }
  };

  const onOpenSaveModal = (todo?: ITodo) => {
    setIsOpenSaveModal(true);
    if (mode === "Add") {
      setSelectedTodo(defaultTodo);
    } else {
      setSelectedTodo(todo!);
    }
  };

  const onOpenAddNewModal = () => {
    setMode("Add");
    onOpenSaveModal();
  };

  const onCloseSaveModal = () => {
    setIsOpenSaveModal(false);
    setSelectedTodo(defaultTodo);
  };

  const onOpenDeleteModal = (toDo: ITodo) => {
    setIsDeleteModal(true);
    setSelectedTodo(toDo);
  };

  const onCloseDeleteModal = () => {
    setIsDeleteModal(false);
  };

  const DeleteToDoHandler = async () => {
    try {
      setIsDeleting(true);
      const res = await axiosInstance.delete(
        `/todos/${selectedTodo?.documentId}`,
        {
          headers: {
            Authorization: `Bearer ${userData.jwt}`,
          },
        }
      );
      console.log(res);
      setQueryVersion((prev) => prev + 1);
      onCloseDeleteModal();
    } catch (err) {
      console.log(err);
    } finally {
      setIsDeleting(false);
      setIsDeleteModal(false);
    }
  };

  const onGenerateTodos = async () => {
    for (let i = 0; i < 200; i++) {
      await axiosInstance.post(
        "/todos",
        {
          data: {
            title: faker.word.words(5),
            description: faker.word.words(5),
            users: [UserToDo?.id],
          },
        },
        {
          headers: {
            Authorization: `Bearer ${userData.jwt}`,
          },
        }
      );
    }
  };

  /* ────────────── Render  ────────────── */
  const renderTodos =
    UserToDo?.todos.length === 0 ? (
      <p>no todos for this user</p>
    ) : (
      UserToDo?.todos?.map((todo, i) => {
        return (
          <div
            key={i}
            className="flex items-center justify-between p-4 bg-white border rounded shadow-md"
          >
            <span className="text-lg font-medium">{todo.title}</span>
            <div className="flex space-x-2">
              <Button onClick={() => onOpenSaveModal(todo)}>Edit</Button>
              <Button
                onClick={() => onOpenDeleteModal(todo)}
                variant={"danger"}
              >
                Remove
              </Button>
            </div>
          </div>
        );
      })
    );

  const renderTodosInputs = toDosInputs.map((input, i) => {
    return (
      <div key={i}>
        <Input
          {...register(input.name, {})}
          type="text"
          placeholder={input.placeholder}
          className="mt-5 w-full  px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        {errors?.[input.name]?.message && (
          <ErrorMsg msg={errors[input.name]?.message ?? ""} />
        )}
      </div>
    );
  });

  if (isLoading)
    return (
      <div
        role="status"
        className=" p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-300 w-24 mb-2.5"></div>
          </div>
          <div className="flex  gap-3">
            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-300 w-12"></div>
            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-300 w-12"></div>
          </div>
        </div>
      </div>
    );
  return (
    <div>
      <div className="w-fit mx-auto flex gap-8">
        <Button variant={"default"} onClick={onGenerateTodos}>
          Generate To-Dos
        </Button>
        <Button onClick={onOpenAddNewModal}>Add To-Do</Button>
      </div>
      {renderTodos}

      {/* SAVE TODO */}
      <Modal
        closeModal={onCloseSaveModal}
        title={mode === "Add" ? "Add New To-Do" : "Edit To-DO"}
        isOpen={isSaveOpen}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          {renderTodosInputs}
          <div className="flex mt-8 gap-6">
            <Button isLoading={isSaving} variant={"default"} type="submit">
              Save
            </Button>
            <Button type="button" onClick={onCloseSaveModal} variant={"danger"}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete TODO */}
      <Modal
        closeModal={onCloseDeleteModal}
        title="Are you sure you want to remove this Todo from your Store?"
        isOpen={isDeleteOpen}
      >
        <p className="mt-4 text-gray-600">
          Deleting this Todo will remove it permanently from your inventory. Any
          associated data, sales history, and other related information will
          also be deleted. Please make sure this is the intended action.
        </p>
        <div className="flex mt-6 gap-4">
          <Button onClick={DeleteToDoHandler} isLoading={isDeleting}>
            Yes, remove
          </Button>
          <button className="px-6 py-2 font-semibold text-gray-700 bg-gray-200 rounded hover:bg-gray-300">
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default TodoList;
