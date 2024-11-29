'use client'

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useState, useEffect, useCallback } from "react"
import useStore from "../../../store"
import type { Database } from "../../../lib/database.types"
import TodoList from "@/app/components/todoList"

const TodoApp = () =>{
    const supabase = createClientComponentClient<Database['public']['Tables']['todos']['Row'][]>()
    const [todos, setTodos] = useState<Database['public']['Tables']['todos']['Row'][]>([])
    const [title, setTitle] = useState<string>("")
    const [message, setMessage] = useState("")
    const { user } = useStore()
    

        useEffect(() => {
            const getUserTodos = async () => {
                const {data, error: getUserTodosError} = await supabase
                    .from('todos')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('id');

                if (getUserTodosError) {
                    setMessage("エラーが発生しました" + getUserTodosError.message)
                    return;
                }
                setTodos(data || []);
            };
            getUserTodos();
        }, [user.id]); 

        const handleSubmit = useCallback(async (e : React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            if (title === "") return;
            const addTodo = async (title:string) => {
                const {data, error: addTodoError} = await supabase
                    .from('todos')
                    .insert({
                        title,
                        user_id: user.id,
                    })
                    .select();
                if(addTodoError){
                    setMessage("エラーが発生しました" + addTodoError.message)
                    return;
                }
                return data[0];
            };
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
            </div>
        )
}
export default TodoApp