import { PersonEditView } from "./PersonEditView";

interface PersonDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ mode?: string }>;
}

export default async function PersonDetailPage({ params, searchParams }: PersonDetailPageProps) {
  const { id } = await params;
  const { mode } = await searchParams;
  return <PersonEditView id={id} readOnly={mode === "view"} />;
}
