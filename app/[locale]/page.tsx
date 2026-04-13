import Component from "@/components/pages/HomePage";
import { getPageData } from "@/lib/getPageData";

export default async function Page() {
  const pageData = await getPageData("home");

  return <Component pageData={pageData} />;
}
