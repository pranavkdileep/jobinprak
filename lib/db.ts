import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_DB!;

let client: MongoClient;
let db: Db;

declare global {
  var __mongoClient: MongoClient | undefined;
  var __mongoDb: Db | undefined;
}

export async function connectToDatabase(): Promise<Db> {
  if (global.__mongoDb) return global.__mongoDb;

  client = new MongoClient(uri);
  await client.connect();
  db = client.db(dbName);

  global.__mongoClient = client;
  global.__mongoDb = db;

  return db;
}
