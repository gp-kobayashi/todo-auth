import { supabase } from "@/app/utils/supabase";
import type { Database } from "lib/database.types";

type Todo = Database["public"]["Tables"]["todos"]["Row"];

type SupabaseResponse<T> = {
  data: T | null;
  error: Error | null;
};

export const getUserTodos = async (
  userId: string,
): Promise<SupabaseResponse<Todo[]>> => {
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

export const addTodo = async (
  title: string,
  userId: string,
): Promise<SupabaseResponse<Todo>> => {
  const { data, error } = await supabase
    .from("todos")
    .insert({
      title,
      user_id: userId,
    })
    .select()
    .single();
  return { data, error };
};

export const deleteTodo = async (
  id: number,
): Promise<SupabaseResponse<number>> => {
  const { data, error } = await supabase
    .from("todos")
    .delete()
    .eq("id", id)
    .select("id")
    .single();
  return { data: data?.id, error };
};
