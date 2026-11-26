import { PageHeader } from "@/components/dashboard/page-header";
import { PageParams } from "@/types/page-params";
import { TripTypeForm } from "../../_components/trip-type-form";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";

export default async function EditTripPage({
  params,
}: PageParams<{ id: string }>) {
  const { id } = await params;

  const feature = await api.tripType.adminView(Number(id));

  if (!feature) notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Trip Type"
        description="Update trip type information"
        backButtonLink="/dashboard/types"
      />
      <TripTypeForm
        id={Number(id)}
        initialData={{ ...feature, nameDe: feature.nameDe ?? "" }}
      />
    </div>
  );
}
