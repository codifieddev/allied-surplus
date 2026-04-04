const fs = require("fs");
const path = require("path");
const { MongoClient } = require("mongodb");

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

const categories = [
  // APPAREL
  { name: "Apparel & Uniforms", slug: "apparel-uniforms", parent: null },
  { name: "ABU'S", slug: "abus", parent: "apparel-uniforms" },
  { name: "ACU's", slug: "acus", parent: "apparel-uniforms" },
  { name: "BDU's", slug: "bdus", parent: "apparel-uniforms" },
  { name: "Belts", slug: "belts", parent: "apparel-uniforms" },
  { name: "Children & Infants", slug: "children-infants", parent: "apparel-uniforms" },
  { name: "Outerwear - New!", slug: "outerwear-new", parent: "apparel-uniforms" },
  { name: "Shorts", slug: "shorts", parent: "apparel-uniforms" },
  { name: "Tactical Pants", slug: "tactical-pants", parent: "apparel-uniforms" },
  { name: "Tactical Shirts", slug: "tactical-shirts", parent: "apparel-uniforms" },
  { name: "T-Shirts", slug: "t-shirts", parent: "apparel-uniforms" },

  // BACKPACKS
  { name: "Backpacks & Bags", slug: "backpacks-bags", parent: null },
  { name: "Ammo", slug: "ammo", parent: "backpacks-bags" },
  { name: "Pouches", slug: "pouches", parent: "backpacks-bags" },
  { name: "Backpacks", slug: "backpacks-sub", parent: "backpacks-bags" },
  { name: "Bail Out Etc.", slug: "bail-out-etc", parent: "backpacks-bags" },
  { name: "Duffle Bags & Carry-Ons", slug: "duffle-bags", parent: "backpacks-bags" },
  { name: "Gun & Range", slug: "gun-range", parent: "backpacks-bags" },

  // BRANDS
  { name: "Shop By Brand", slug: "shop-by-brand", parent: null },
  { name: "5.11 Tactical", slug: "5-11-tactical", parent: "shop-by-brand" },
  { name: "Bates Footwear", slug: "bates-footwear", parent: "shop-by-brand" },
  { name: "Belleville", slug: "belleville", parent: "shop-by-brand" },
  { name: "Condor", slug: "condor", parent: "shop-by-brand" },
  { name: "Erazor Bits Military T-Shirts", slug: "erazor-bits", parent: "shop-by-brand" },
  { name: "Grunt Style Military T-Shirts", slug: "grunt-style", parent: "shop-by-brand" },
  { name: "Propper", slug: "propper", parent: "shop-by-brand" },
  { name: "Rapid Dominance", slug: "rapid-dominance", parent: "shop-by-brand" },
  { name: "Reebok", slug: "reebok", parent: "shop-by-brand" },
  { name: "Rothco", slug: "rothco", parent: "shop-by-brand" },
  { name: "Tru Spec", slug: "tru-spec", parent: "shop-by-brand" },
  { name: "Trooper", slug: "trooper", parent: "shop-by-brand" },

  // OTHERS
  { name: "Custom Dog Tags", slug: "custom-dog-tags", parent: null },
  { name: "Emergency Supplies", slug: "emergency-supplies", parent: null },
  { name: "Footwear's", slug: "footwears", parent: null },
  { name: "Genuine Military Surplus", slug: "genuine-military-surplus", parent: null },
  { name: "Gifts & Novelties", slug: "gifts-novelties", parent: null },
  { name: "Headwear", slug: "headwear", parent: null },
  { name: "Tactical & Law Enforc.", slug: "tactical-law-enforc", parent: null },
];

const products = [
  {
    name: "20 LITER (5 GAL.) FUEL CANISTER – 08-31910",
    slug: "fuel-canister-20l",
    sku: "AL-FUEL-20L",
    price: 58.90,
    categorySlug: "emergency-supplies",
    primaryImage: "https://alliedsurplus.com/wp-content/uploads/2018/03/canister_group.jpg",
    variants: [
      { title: "Standard", sku: "AL-FUEL-20L-S", price: 58.90, stock: 15 },
      { title: "Reinforced", sku: "AL-FUEL-20L-R", price: 79.90, stock: 5 },
    ],
  },
  {
    name: "20mm Ammo Can – Military Surplus",
    slug: "20mm-ammo-can",
    sku: "AL-AMMO-20MM",
    price: 29.95,
    categorySlug: "genuine-military-surplus",
    primaryImage: "https://alliedsurplus.com/wp-content/uploads/2018/03/product-ammo-can-20mm-1.jpg",
    variants: [{ title: "Standard", sku: "AL-AMMO-20MM-S", price: 29.95, stock: 50 }],
  },
  {
    name: "30 Caliber Ammo Can – Military Surplus",
    slug: "30-cal-ammo-can",
    sku: "AL-AMMO-30CAL",
    price: 12.95,
    categorySlug: "genuine-military-surplus",
    primaryImage: "https://alliedsurplus.com/wp-content/uploads/2018/03/product-ammo-can-30cal-1.jpg",
    variants: [{ title: "Standard", sku: "AL-AMMO-30CAL-S", price: 12.95, stock: 80 }],
  },
  {
    name: "40mm Ammo Can – Military Surplus",
    slug: "40mm-ammo-can",
    sku: "AL-AMMO-40MM",
    price: 18.95,
    categorySlug: "genuine-military-surplus",
    primaryImage: "https://alliedsurplus.com/wp-content/uploads/2018/03/product-ammo-can-40mm-1.jpg",
    variants: [{ title: "Standard", sku: "AL-AMMO-40MM-S", price: 18.95, stock: 35 }],
  },
  {
    name: "5.11 A.T.A.C® 2.0 8″ SIDE ZIP BOOT",
    slug: "5-11-atac-boot",
    sku: "AL-511-ATAC",
    price: 119.95,
    categorySlug: "5-11-tactical",
    primaryImage: "https://alliedsurplus.com/wp-content/uploads/2021/04/5.11-Tactical-ATAC-2.0-8.jpg",
    variants: [{ title: "Black", sku: "AL-511-ATAC-B", price: 119.95, stock: 22 }],
  },
  {
    name: "5.11 Daily Deploy Backpack",
    slug: "5-11-daily-deploy",
    sku: "AL-511-DEPLOY",
    price: 124.95,
    categorySlug: "5-11-tactical",
    primaryImage: "https://alliedsurplus.com/wp-content/uploads/2022/02/5.11-Tactical-Daily-Deploy-Backpack.jpg",
    variants: [{ title: "Standard", sku: "AL-511-DEPLOY-S", price: 124.95, stock: 12 }],
  },
  {
    name: "5.11 Operator Belt (59405)",
    slug: "5-11-operator-belt",
    sku: "AL-511-BELT",
    price: 47.99,
    categorySlug: "5-11-tactical",
    primaryImage: "https://alliedsurplus.com/wp-content/uploads/2018/12/5.11-Operator-Belt-OD-Green.jpg",
    variants: [
      { title: "Standard", sku: "AL-511-BELT-S", price: 47.99, stock: 40 },
      { title: "XL", sku: "AL-511-BELT-XL", price: 53.99, stock: 15 },
    ],
  },
  {
    name: "5.11 PUSH PACK 56037",
    slug: "5-11-push-pack",
    sku: "AL-511-PUSH",
    price: 61.95,
    categorySlug: "5-11-tactical",
    primaryImage: "https://alliedsurplus.com/wp-content/uploads/2020/03/5.11-Tactical-Push-Pack-Dark-Earth.jpg",
    variants: [{ title: "Dark Earth", sku: "AL-511-PUSH-DE", price: 61.95, stock: 8 }],
  },
  {
    name: "5.11 RUSH 100 6L BACKPACK",
    slug: "5-11-rush-100",
    sku: "AL-511-RUSH-100",
    price: 259.95,
    categorySlug: "5-11-tactical",
    primaryImage: "https://alliedsurplus.com/wp-content/uploads/2020/03/5.11-Tactical-Rush-100-Backpack-Black.jpg",
    variants: [{ title: "Black", sku: "AL-511-RUSH-100-B", price: 259.95, stock: 4 }],
  },
];

async function main() {
  loadEnv();
  const uri = process.env.MONGODB_URI;
  const tenantDb = process.env.TENANT_DB_NAME;

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(tenantDb);

  const categoriesCol = db.collection("categories");
  const productsCol = db.collection("products");
  const variantsCol = db.collection("variants");

  // Reset core data (Optional but recommended for clean re-sync)
  // await categoriesCol.deleteMany({});
  // await productsCol.deleteMany({});
  // await variantsCol.deleteMany({});

  const now = new Date();
  const categoryMap = {};

  console.log("--- Syncing Categories ---");
  // 1. Process Roots first, then children
  const roots = categories.filter(c => !c.parent);
  const children = categories.filter(c => c.parent);

  for (const cat of roots) {
    const res = await categoriesCol.findOneAndUpdate(
      { slug: cat.slug },
      { $set: { name: cat.name, updatedAt: now }, $setOnInsert: { type: "product", parentId: null, createdAt: now } },
      { upsert: true, returnDocument: "after" }
    );
    categoryMap[cat.slug] = res._id || res.value?._id;
  }

  for (const cat of children) {
    const parentId = categoryMap[cat.parent];
    const res = await categoriesCol.findOneAndUpdate(
      { slug: cat.slug },
      { $set: { name: cat.name, parentId, updatedAt: now }, $setOnInsert: { type: "product", createdAt: now } },
      { upsert: true, returnDocument: "after" }
    );
    categoryMap[cat.slug] = res._id || res.value?._id;
  }

  console.log("--- Syncing Products ---");
  for (const prog of products) {
    const catId = categoryMap[prog.categorySlug];
    const pDoc = {
      name: prog.name,
      sku: prog.sku,
      slug: prog.slug,
      type: "physical",
      status: "active",
      price: prog.price,
      primaryCategoryId: catId,
      categoryIds: [catId],
      primaryImageId: prog.primaryImage,
      pricing: { price: prog.price, compareAtPrice: prog.price * 1.1, chargeTax: true, trackQuantity: true },
      updatedAt: now
    };

    const existing = await productsCol.findOne({ sku: prog.sku });
    if (!existing) {
      pDoc.createdAt = now;
      const insert = await productsCol.insertOne(pDoc);
      const productId = insert.insertedId;
      
      const vObjs = prog.variants.map(v => ({
        productId,
        sku: v.sku,
        title: v.title,
        price: v.price,
        stock: v.stock,
        status: "active",
        createdAt: now,
        updatedAt: now
      }));
      await variantsCol.insertMany(vObjs);
    } else {
      await productsCol.updateOne({ sku: prog.sku }, { $set: pDoc });
      // Update variants if needed (omitted for speed unless required)
    }
  }

  console.log("Database successfully populated with Allied Surplus catalog.");
  await client.close();
}

main().catch(console.error);
