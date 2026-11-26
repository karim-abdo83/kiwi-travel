import { PageHeader } from "@/components/dashboard/page-header";
import { CountryForm } from "../../_components/country-form";
import { PageParams } from "@/types/page-params";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";

export default async function EditCountryPage({
  params,
}: PageParams<{ id: string }>) {
  const { id } = await params;

  const country = await api.country.adminView(Number(id));

  if (!country) notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Country"
        description="Update country information"
        backButtonLink="/dashboard/countries"
      />
      <CountryForm
        id={Number(id)}
        initialData={{ ...country, nameDe: country.nameDe ?? "" }}
      />
    </div>
  );
}
