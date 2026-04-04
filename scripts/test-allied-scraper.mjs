import { scrapeAlliedSurplus } from '../lib/scrapers/alliedSurplus.ts';

async function test() {
  console.log("Starting test for Allied Surplus scraper...");
  const products = await scrapeAlliedSurplus(5);
  console.log("Scraped products:", JSON.stringify(products, null, 2));
  if (products.length === 0) {
    console.error("Warning: No products found. Scraper might be failing to parse the HTML.");
  }
}

test().catch(console.error);
