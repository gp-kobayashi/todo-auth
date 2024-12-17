import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Signup from "@/app/components/user/signup";
import type { Database } from "../../../../lib/database.types";

const SignupPage = async () => {
  const supabase = createServerComponentClient<Database>({
    cookies,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/");
  }

  return <Signup />;
};

export default SignupPage;
