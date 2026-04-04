import { NextResponse } from 'next/server';
import { getProductModel, getCategoryModel, getVariantModel } from '@/models';
import { scrapeAlliedSurplus } from '@/lib/scrapers/alliedSurplus';
import { connectTenantDB } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const products = await scrapeAlliedSurplus(50); // Increased limit to 50
    const db = await connectTenantDB();
    const productCollection = db.collection("products");
    const categoryCollection = db.collection("categories");
    const variantCollection = db.collection("variants");

    console.log(`Starting sync for ${products.length} products found from Allied Surplus...`);

    let itemsSynced = 0;
    const now = new Date();

    for (const p of products) {
      // 1. Ensure categories exist and get their IDs
      const categoryIds: any[] = [];
      for (const catName of p.categoryNames) {
        const slug = catName.toLowerCase().replace(/\s+/g, '-');
        const cat = await categoryCollection.findOneAndUpdate(
          { slug },
          { 
            $set: { name: catName, updatedAt: now },
            $setOnInsert: { description: `Imported category: ${catName}`, type: "product", createdAt: now }
          },
          { upsert: true, returnDocument: 'after' }
        );
        if (cat) {
          categoryIds.push(cat._id);
          console.log(`- Categorized as: ${catName}`);
        }
      }

      // 2. Upsert product
      const productDoc = {
        name: p.name,
        slug: p.slug,
        sku: p.sku,
        type: "physical",
        status: "active",
        price: p.price,
        description: p.description,
        categoryIds,
        primaryCategoryId: categoryIds[0] || null,
        primaryImageId: p.primaryImage,
        pricing: {
          price: p.price,
          compareAtPrice: p.compareAtPrice || p.price * 1.2, // Default markup reference
          costPerItem: Math.round(p.price * 0.6), // Estimated cost
          chargeTax: true,
          trackQuantity: true
        },
        metadata: {
           source: "alliedsurplus.com",
           lastSynced: now
        },
        updatedAt: now,
      };

      const result = await productCollection.findOneAndUpdate(
         { sku: p.sku },
         { 
           $set: productDoc,
           $setOnInsert: { createdAt: now } 
         },
         { upsert: true, returnDocument: 'after' }
      );

      if (result) {
        // 3. Ensure a default variant exists for storefront compatibility
        await variantCollection.updateOne(
          { productId: result._id },
          {
            $set: {
               productId: result._id,
               sku: `${p.sku}-DEF`,
               title: "Default",
               price: p.price,
               stock: 50,
               status: "active",
               updatedAt: now
            },
            $setOnInsert: { createdAt: now }
          },
          { upsert: true }
        );
        itemsSynced++;
        console.log(`Synced: ${p.name} [SKU: ${p.sku}]`);
      }
    }

    console.log(`Sync complete. Total synced items: ${itemsSynced}`);

    return NextResponse.json({ 
       success: true, 
       message: `Successfully synced ${itemsSynced} products and categories from Allied Surplus node.`,
       count: itemsSynced
    });
  } catch (error: any) {
    console.error('Manual sync failed:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
