import { redirect } from "next/navigation";

// /about used to be the portfolio. Send people to /portfolio now.
export default function AboutRedirect() {
  redirect("/portfolio");
}
