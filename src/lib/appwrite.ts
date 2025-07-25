import { Client, Account, Databases, Storage, ID, Query } from "appwrite";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
export const COLLECTION_TRANSACTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_TRANSACTION_COLLECTION!;
export const COLLECTION_CATEGORY_ID =
  process.env.NEXT_PUBLIC_APPWRITE_CATEGORY_COLLECTION!;
export const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!;
export const COLLECTION_PRODUCT_ID =
  process.env.NEXT_PUBLIC_APPWRITE_PRODUCT_COLLECTION!;
export const COLLECTION_PRODUCT_CATEGORY_ID =
  process.env.NEXT_PUBLIC_APPWRITE_PRODUCT_CATEGORY_COLLECTION!;

export { ID, Query };
