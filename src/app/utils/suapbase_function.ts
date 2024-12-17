import { supabase } from "./supabase";
import type { Database } from "../../../lib/database.types";

type Todo = Database["public"]["Tables"]["todos"]["Row"]

interface userTodos {
  data: Todo[] | null;
  error: Error | null;
}

export const getUserTodos = async (userId: string) : Promise<userTodos>=> {
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .eq("user_id", userId)
    .order("id");
  if (error) {
    return { data: null, error };
  }
  return { data, error: null };
};

export const addTodo = async (title: string, userId: string): Promise<Todo> => {
  const { data, error } = await supabase
    .from("todos")
    .insert({
      title,
      user_id: userId,
    })
    .select();
  if (error) {
    throw new Error("データ追加のエラー");
  }
  return data[0];
};

export const deleteTodo = async (id: number): Promise<Todo[]>=> {
  const { data, error} = await supabase
    .from("todos")
    .delete()
    .eq("id", id)
    .select();
  if (error) {
    throw new Error("削除のエラー");
  }
  return data;
};
