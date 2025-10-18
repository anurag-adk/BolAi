import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/actions/auth.action";
import NotFoundPage from "@/components/custom/NotFoundPage";

export default async function NotFound() {
  // Check auth
  const userIsAuthenticated = await isAuthenticated();

  // If user is not authenticated redirect to landing page
  if (!userIsAuthenticated) {
    redirect("/");
  }

  // If authenticated render 404 page
  return <NotFoundPage />;
}
