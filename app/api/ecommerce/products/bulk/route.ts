import { connectTenantDB } from "@/lib/db";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { authenticateAdmin } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const auth = await authenticateAdmin();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const db = await connectTenantDB();
    const productColl = db.collection("products");
    const attributeSetColl = db.collection("attribute_sets");
    const body = await request.json();

    if (!Array.isArray(body)) {
      return NextResponse.json({ error: "Payload must be an array" }, { status: 400 });
    }

    const newProductArray: any[] = [];

    for (let product of body) {
      const variants = product.variants || [];
      const incomingProduct = { ...product };
      delete incomingProduct.variants;

      // Handle attribute sets and options mapping if needed from reference logic
      // In reference it maps option keys to attribute set options
      // Here we keep it flexible but port the core bulk insert logic
      
      const attributeSetIds = await attributeSetColl
        .find({
          key: { $in: incomingProduct.attributeSetIds || [] },
        })
        .toArray();

      const mappedAttributes = attributeSetIds
        .map((attrset: any) => {
          return (attrset.attributes || []).map((d: any) => {
            return {
              ...d,
              attributeSetId: attrset.key,
            };
          });
        })
        .flat();

      const options = (incomingProduct.options || []).map((option: any) => {
        const singleOption = mappedAttributes.find(
          (opt: any) => opt.key === option.key,
        );

        return {
          attributeSetId: singleOption?.attributeSetId,
          values:
            singleOption && singleOption.options
              ? singleOption.options
              : option.values,
          selectedValues: option.values,
          useForVariants: option.useForVariants,
          label: option?.label,
          key: option.key,
        };
      });

      const result = await productColl.insertOne({
        ...incomingProduct,
        options,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const variantWithId = variants.map((variant: any) => ({
        ...variant,
        productId: result.insertedId,
        _id: new ObjectId(),
        createdAt: new Date(),
        updatedAt: new Date()
      }));

      if (variantWithId.length > 0) {
        const variantColl = db.collection("variants");
        await variantColl.insertMany(variantWithId);
      }

      newProductArray.push({
        ...incomingProduct,
        _id: result.insertedId,
        variants: variantWithId,
      });
    }

    return NextResponse.json(
      {
        message: `${newProductArray.length} products created successfully`,
        data: newProductArray,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message, status: 500 },
      { status: 500 },
    );
  }
}
