'use client'

import { useCallback,useState,SetStateAction } from "react";
import type { Database } from "../../../../lib/database.types";
import { deleteTodo } from "../../utils/suapbase_function";

type Props = {
    todos:Database['public']['Tables']['todos']['Row'][];
    setTodos: React.Dispatch<SetStateAction<Database['public']['Tables']['todos']['Row'][]>>;
  }

const TodoList = (props: Props) =>{
    const [message, setMessage] = useState("")
    const { todos, setTodos } = props

    const handleDelete = useCallback(async(id:number) =>{
        const updatedTodo = await deleteTodo(id);
        if(updatedTodo){
            setTodos((prevTodos) => prevTodos.filter(todos => todos.id !== id));
        }
    },[setTodos])

    return(
        <div>
            <ul className="max-w-[350px] m-auto">
                {todos.map((todo) => (
                    <li className="mb-2 border-b-2 flex justify-between" key={todo.id}>
                        <div className="text-base">
                            {todo.title}
                        </div>
                            <button
                                className="font-bold bg-red-500 hover:brightness-95 rounded-full p-2 text-white text-sm"
                                onClick={() => handleDelete(todo.id)}    
                            >
                                削除
                            </button>
                    </li>
                ))}
            </ul>
            {message && <div className="my-5 text-center text-sm text-red-500">{message}</div>}
        </div>
    )
}

export default TodoList