import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Password from "@/app/components/user/password"
import type { Database } from "../../../../lib/database.types";


const PasswordPage = async () => {
	const supabase = createServerComponentClient<Database>({
		cookies,
	})

	const {
		data: { session },
	} = await supabase.auth.getSession()

	if(!session){
		redirect('/auth/login')
	}

	return <Password />
}
export default PasswordPage