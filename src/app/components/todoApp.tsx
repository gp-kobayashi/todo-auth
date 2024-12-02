'use client'

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useState, useEffect, useCallback } from "react"
import useStore from "../../../store"
import type { Database } from "../../../lib/database.types"
import TodoList from "@/app/components/todoList"

const TodoApp = () =>{
    const supabase = createClientComponentClient<Database>()
    const [todos, setTodos] = useState<Database['public']['Tables']['todos']['Row'][]>([])
    const [title, setTitle] = useState<string>("")
    const [message, setMessage] = useState("")
    const { user } = useStore()
    
    const getUserTodos = async () => {
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

    const addTodo = async (title:string) => {
        const {data, error: addTodoError} = await supabase
            .from('todos')
            .insert({
                title,
                user_id: user.id,
            })
            .select();
        if(addTodoError){
            return { data: null, addTodoError };
        }
        return { data, addTodoError: null };
    };    

        useEffect(() => {
            const getTodos = async () =>{
                const {data, getUserTodosError} = await getUserTodos()
                if(getUserTodosError){
                    setMessage("エラーが発生しました" + getUserTodosError.message)
                    return;
                }
                setTodos(data || []);
            };
            getTodos();    
        }, [user.id]); 

        const handleSubmit = useCallback(async (e : React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            if (title === "") return;
            const updatedTodo = await addTodo(title);
            if (updatedTodo) {
                setTodos((prevTodos) => [...prevTodos, updatedTodo]);
            }
            setTitle("");
            },[title, user.id]);
    
        return(
            <div>
                <div>
                    <form className="mb-5" onSubmit={(e) => handleSubmit(e)}>
                        <input type="text"
                            placeholder="やること…"
                            className="border rounded-md py-2 px-3 focus:outline-none focus:border-sky-500"
                            onChange={(e) => setTitle(e.target.value)}
                            value={title}
                        />
                        <button className="font-bold bg-sky-500 hover:brightness-95 rounded-full p-2 text-white text-sm">
                            記入
                        </button>
                    </form>
                    <TodoList todos={todos} setTodos={setTodos}/>
                </div>
                {message && <div className="my-5 text-center text-sm text-red-500">{message}</div>}
            </div>
        )
}
export default TodoApp