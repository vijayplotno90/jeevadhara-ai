import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import ListForm from "./ListForm";

export default async function FarmerListPage() {
  const session = await getSession();
  if (!session) {
    redirect("/auth");
  }
  if (session.role !== "farmer") {
    redirect("/marketplace");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl font-bold text-gray-900">List a product</h1>
      <p className="mt-2 text-gray-500">
        Add a photo and a short note — the AI agents draft the listing and suggest a fair
        price. You can edit anything before it goes live.
      </p>
      <ListForm />
    </div>
  );
}
