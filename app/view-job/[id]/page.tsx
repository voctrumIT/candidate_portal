import { redirect } from "next/navigation";

export default async function ViewJobWithIdRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/jobs/${id || "1"}`);
}

