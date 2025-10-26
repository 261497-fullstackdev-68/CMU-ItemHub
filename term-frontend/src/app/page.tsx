import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token");

  if (refreshToken) {
    redirect("/home");
  } else {
    redirect("/login");
  }
}
