import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import type { Database } from "../../lib/database.types";
import { redirect } from "next/navigation";
import TodoApp from "./components/todoApp";

const Home = async () => {
	const supabase = createServerComponentClient<Database>({
		cookies,
	})

	const{
		data:{ session },
	} = await supabase.auth.getSession()

	if(!session){
    	redirect("/auth/login")
  	}

	return (
		<div className="text-center text-xl">
        	<div className="mb-5">Your todo</div>
        	<TodoApp />
    	</div>
	);
}

export default  Home