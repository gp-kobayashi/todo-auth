"use client";

import { useState, useEffect, useCallback } from "react";
import useStore from "store";
import type { Database } from "lib/database.types";
import TodoList from "@/app/components/todo/todoList";
import { getUserTodos, addTodo } from "@/app/utils/suapbase_function";

const TodoApp = () => {
  const [todos, setTodos] = useState<
    Database["public"]["Tables"]["todos"]["Row"][]
  >([]);
  const [title, setTitle] = useState<string>("");
  const [message, setMessage] = useState("");
  const { user } = useStore();
  const userId = user.id;

  useEffect(() => {
    if (!user.id) return;
    const getTodos = async () => {
      const { data, error } = await getUserTodos(userId);
      if (error) {
        setMessage("エラーが発生しました" + error.message);
        return;
      }
      setTodos(data || []);
    };
    getTodos();
  }, [user.id]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (title === "") return;
      const { data: updatedTodo, error } = await addTodo(title, userId);

      if (error) {
        setMessage("エラーが発生しました。");
        return;
      }

      if (updatedTodo) {
        setTodos((prevTodos) => [...prevTodos, updatedTodo]);
      }

      setTitle("");
      setMessage("");
    },
    [title, user.id],
  );

  return (
    <div>
      <div>
        <form className="mb-5" onSubmit={(e) => handleSubmit(e)}>
          <input
            type="text"
            placeholder="やること…"
            className="border rounded-md py-2 px-3 focus:outline-none focus:border-sky-500"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
          <button className="font-bold bg-sky-500 hover:brightness-95 rounded-full p-2 text-white text-sm">
            記入
          </button>
        </form>
        <TodoList todos={todos} setTodos={setTodos} />
      </div>
      {message && (
        <div className="my-5 text-center text-sm text-red-500">{message}</div>
      )}
    </div>
  );
};
export default TodoApp;
