import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import type { Database } from "../../lib/database.types";
import { redirect } from "next/navigation";

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
        <div>Your todo</div>    
    </div>
  );
}

export default  Home