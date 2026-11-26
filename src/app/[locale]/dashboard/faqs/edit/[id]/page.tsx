import { PageHeader } from "@/components/dashboard/page-header";
import { FAQForm } from "../../_components/faq-form";
import { PageParams } from "@/types/page-params";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";

export default async function EditCountryPage({
  params,
}: PageParams<{ id: string }>) {
  const { id } = await params;

  const question = await api.faq.adminView(Number(id));

  if (!question) notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Question"
        description="Update question information"
        backButtonLink="/dashboard/faqs"
      />
      <FAQForm
        id={Number(id)}
        initialData={{
          ...question,
          questionDe: question.questionDe ?? "",
          answerDe: question.answerDe ?? "",
        }}
      />
    </div>
  );
}
