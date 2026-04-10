import { cache } from "react";
import { connectTenantDB } from "./db";
import { ObjectId } from "mongodb";
import { getVariantModel } from "@/models";

function serialize(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}

export const getProductWithCategory = cache(async (id: string) => {
  const db = await connectTenantDB();
  const productColl = db.collection("products");
  const categoryColl = db.collection("categories");

  const category = await categoryColl.findOne({ slug: id });

  const Variant = await getVariantModel();
  const products = await productColl
    .find({
      categoryIds: { $in: [id] },
    })
    .toArray();

  // Enrich with variants
  const enriched = await Promise.all(
    products.map(async (p: any) => {
      const variants = await Variant.find({ productId: p._id }).toArray();
      return {
        ...p,
        variantCount: variants.length,
        totalStock: variants.reduce(
          (acc: number, v: any) => acc + (v.stock || 0),
          0,
        ),
        variants,
      };
    }),
  );

  const final = {
    category,
    product: enriched,
  };

  return serialize(final);
});
