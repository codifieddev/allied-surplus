import Component from "@/components/pages/CategoryPage";
import GetProductCategoryWise from "@/lib/GetAllDetails/GetProductCategoryWise";

export default async function Page() {
  return (
    <>
      <GetProductCategoryWise />
      <Component />
    </>
  );
}
