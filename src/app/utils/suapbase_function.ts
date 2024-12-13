import useStore from "../../../store";
import { supabase } from "./supabase";

const { user } = useStore()


export const getUserTodos = async () => {
    const {data, error :getUserTodosError} = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', user.id)
        .order('id');
        if (getUserTodosError) {
            return { data: null, getUserTodosError };
        }
        return { data, getUserTodosError: null };
    }

export const addTodo = async (title:string) => {
    const {data, error: addTodoError} = await supabase
        .from('todos')
        .insert({
            title,
            user_id: user.id,
        })
        .select();
    if(addTodoError){
        throw new Error("データ追加のエラー")
    }
    return data[0];
};

export const deleteTodo =(async(id:number) =>{
    const { data, error: deleteTodoError } = await supabase
        .from("todos")
        .delete()
        .eq('id', id)
        .select()
    if(deleteTodoError){
        throw new Error("削除のエラー"); 
    };
    return data;
});