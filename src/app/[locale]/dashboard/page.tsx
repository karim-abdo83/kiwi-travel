import { redirect } from "next/navigation"
import { PageParams } from "@/types/page-params"

export default async function DashboardPage({
  params,
}: PageParams<{ locale: string }>) {
  const { locale } = await params
  redirect(`/${locale}/dashboard/trips`)
}
