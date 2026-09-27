import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PasswordRecoveryForm from "@/components/PasswordRecoveryForm";

export const dynamic = "force-dynamic";

export default async function ResetPasswordPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) redirect("/forgot-password?error=recovery");
  return <PasswordRecoveryForm mode="update" />;
}
