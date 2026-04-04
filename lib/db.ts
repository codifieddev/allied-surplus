import { MongoClient, Db } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;
const TENANT_DB_NAME = process.env.TENANT_DB_NAME;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env"
  );
}

if (!TENANT_DB_NAME) {
  throw new Error(
    "Please define the TENANT_DB_NAME environment variable inside .env"
  );
}

let cachedClient = (global as any).mongoClient;

if (!cachedClient) {
  cachedClient = (global as any).mongoClient = { conn: null, promise: null };
}

export async function connectClient(): Promise<MongoClient> {
  if (cachedClient.conn) return cachedClient.conn;

  if (!cachedClient.promise) {
    cachedClient.promise = MongoClient.connect(MONGODB_URI as string);
  }
  
  try {
    cachedClient.conn = await cachedClient.promise;
  } catch (e) {
    cachedClient.promise = null;
    throw e;
  }

  return cachedClient.conn;
}

export async function connectMasterDB(): Promise<Db> {
  const client = await connectClient();
  return client.db("kalp_master");
}

export async function connectTenantDB(): Promise<Db> {
  const client = await connectClient();
  return client.db(TENANT_DB_NAME);
}
