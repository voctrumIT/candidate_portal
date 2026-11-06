import { redirect } from "next/navigation";

export default async function DashboardViewJobWithIdRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/dashboard/jobs/${id || "1"}`);
}

