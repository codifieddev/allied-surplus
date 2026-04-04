const fs = require("fs");
const path = require("path");
const { MongoClient } = require("mongodb");
const cheerio = require("cheerio");

// Load Environment Variables
function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, "utf-8").split(/\r?\n/);
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const [key, ...rest] = trimmed.split("=");
    if (!key) return;
    let value = rest.join("=").trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  });
}

async function scrapePage(url) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    return cheerio.load(html);
  } catch (error) {
    console.error(`Failed to fetch ${url}:`, error.message);
    return null;
  }
}

async function main() {
  loadEnv();
  const uri = process.env.MONGODB_URI;
  const tenantDb = process.env.TENANT_DB_NAME;

  if (!uri || !tenantDb) {
    console.error("Missing MONGODB_URI or TENANT_DB_NAME");
    process.exit(1);
  }

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(tenantDb);
  const categoriesCol = db.collection("categories");
  const productsCol = db.collection("products");
  const variantsCol = db.collection("variants");

  console.log("--- STARTING LIVE SYNC FROM ALLIED SURPLUS ---");

  // 1. Scrape Categories
  const $shop = await scrapePage("https://alliedsurplus.com/shop/");
  if (!$shop) return;

  const categoryLinks = [];
  $shop(".product-category a").each((_, el) => {
    const name = $shop(el).find("h2").text().trim().replace(/\s*\(\d+\)$/, "");
    const url = $shop(el).attr("href");
    const slug = url.split("/").filter(Boolean).pop();
    if (name && url) categoryLinks.push({ name, url, slug });
  });

  console.log(`Found ${categoryLinks.length} categories.`);

  const categoryMap = {};
  for (const cat of categoryLinks) {
    const now = new Date();
    const result = await categoriesCol.findOneAndUpdate(
      { slug: cat.slug },
      { 
        $set: { name: cat.name, updatedAt: now },
        $setOnInsert: { type: "product", createdAt: now } 
      },
      { upsert: true, returnDocument: "after" }
    );
    categoryMap[cat.slug] = result._id;
  }

  // 2. Scrape Products for each category (limiting to first 3 for speed in this demo)
  for (const cat of categoryLinks.slice(0, 5)) {
    console.log(`Scraping category: ${cat.name}...`);
    const $cat = await scrapePage(cat.url);
    if (!$cat) continue;

    const products = [];
    $cat(".product").each((_, el) => {
      const name = $cat(el).find(".woocommerce-loop-product__title").text().trim();
      const priceText = $cat(el).find(".price").text().trim();
      const image = $cat(el).find("img").attr("src");
      const url = $cat(el).find("a").first().attr("href");
      const sku = $cat(el).attr("class").match(/post-(\d+)/)?.[1] || cat.slug + "-" + _;

      if (name && priceText) {
        // Parse price (handle ranges)
        const prices = priceText.match(/\d+(\.\d+)?/g);
        const price = prices ? parseFloat(prices[0]) : 0;

        products.push({
          name,
          sku: "AL-" + sku,
          slug: url.split("/").filter(Boolean).pop(),
          price,
          image,
          categorySlug: cat.slug
        });
      }
    });

    console.log(`Found ${products.length} products in ${cat.name}.`);

    for (const prod of products) {
      const now = new Date();
      const catId = categoryMap[prod.categorySlug];

      const productDoc = {
        name: prod.name,
        sku: prod.sku,
        slug: prod.slug,
        type: "physical",
        status: "active",
        price: prod.price,
        categoryIds: [catId],
        primaryCategoryId: catId,
        primaryImageId: prod.image,
        pricing: {
          price: prod.price,
          compareAtPrice: prod.price * 1.2,
          chargeTax: true,
          trackQuantity: true
        },
        updatedAt: now
      };

      const existing = await productsCol.findOne({ sku: prod.sku });
      if (!existing) {
        productDoc.createdAt = now;
        const insertRes = await productsCol.insertOne(productDoc);
        const productId = insertRes.insertedId;

        // Create default variant
        await variantsCol.insertOne({
          productId,
          sku: prod.sku + "-OS",
          title: "One Size / Default",
          price: prod.price,
          stock: Math.floor(Math.random() * 50) + 10,
          status: "active",
          createdAt: now,
          updatedAt: now
        });
      } else {
        await productsCol.updateOne({ sku: prod.sku }, { $set: productDoc });
      }
    }
  }

  console.log("--- SYNC COMPLETE ---");
  await client.close();
}

main().catch(console.error);
