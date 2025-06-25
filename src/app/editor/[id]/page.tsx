"use client";

import { ReportEditor } from "@/components/report-editor/ReportEditor";

interface EditorPageProps {
  params: {
    id: string; // This is actually the slug
  };
}

export default function EditorPage({ params }: EditorPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <ReportEditor reportId={params.id} />
    </div>
  );
}
