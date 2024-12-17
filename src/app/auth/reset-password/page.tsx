import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ResetPassword from "@/app/components/user/reset-password";
import type { Database } from "../../../../lib/database.types";

const ResetPasswordPage = async () => {
  const supabase = createServerComponentClient<Database>({
    cookies,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/");
  }

  return <ResetPassword />;
};

export default ResetPasswordPage;
