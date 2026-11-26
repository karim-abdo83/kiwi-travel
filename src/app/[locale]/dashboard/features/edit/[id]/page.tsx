import { PageHeader } from "@/components/dashboard/page-header";
import { PageParams } from "@/types/page-params";
import { TripFeatureForm } from "../../_components/trip-feature-form";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";

export default async function EditTripPage({
  params,
}: PageParams<{ id: string }>) {
  const { id } = await params;

  const feature = await api.tripFeature.adminView(Number(id));

  if (!feature) notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Feature"
        description="Update trip feature information"
        backButtonLink="/dashboard/features"
      />
      <TripFeatureForm
        id={Number(id)}
        initialData={{ ...feature, contentDe: feature.contentDe ?? "" }}
      />
    </div>
  );
}
