import { PageHeader } from "@/components/dashboard/page-header";
import { DestinationForm } from "../../_components/destination-form";
import { PageParams } from "@/types/page-params";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";

export default async function EditDestinationPage({
  params,
}: PageParams<{ id: string }>) {
  const { id } = await params;

  const destination = await api.destination.adminView(Number(id));

  if (!destination) notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Destination"
        description="Update destination information"
        backButtonLink="/dashboard/destinations"
      />
      <DestinationForm
        id={Number(id)}
        initialData={{ ...destination, nameDe: destination.nameDe ?? "" }}
      />
    </div>
  );
}
