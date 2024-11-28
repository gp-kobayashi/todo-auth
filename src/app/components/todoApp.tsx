'use client'

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useState, useEffect, useCallback } from "react"
import useStore from "../../../store"
import type { Database } from "../../../lib/database.types"
import { number, string } from "zod"

const todoApp = () =>{
    const supabase = createClientComponentClient<Database>()
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
            const addTodo = async () => {
                const {data, error: addTodoError} = await supabase
                    .from('todos')
                    .insert({
                        title: title,
                        user_id: user.id,
                    })
                    .select();
                if(addTodoError){
                    setMessage("エラーが発生しました" + addTodoError.message)
                    return;
                }

                return data[0];
            };
            const updatedTodo = await addTodo();
            setTodos((prevTodos) => [...prevTodos, { ...updatedTodo, user_id:user.id , title, completed:false }]);
            setTitle("");
            },[title, user.id]);
    
        return(
            <div>
                <div>
      <form className="" onSubmit={(e) => handleSubmit(e)}>
        <input type="text"
          placeholder="やること…"
          className=""
          onChange={(e) => setTitle(e.target.value)}
          value={title}/>
        <button className="">
            記入
        </button>
      </form>
    </div>
            </div>
        )
}
export default todoApp