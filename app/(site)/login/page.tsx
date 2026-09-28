import type { Metadata } from "next";
import { PageHeader } from "@/components/shop/page-header";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Sign In" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect = "/account" } = await searchParams;

  return (
    <>
      <PageHeader title="My Account" />
      <div className="container-page flex justify-center py-14">
        <div className="w-full max-w-sm">
          <LoginForm redirectTo={redirect} />
        </div>
      </div>
    </>
  );
}
