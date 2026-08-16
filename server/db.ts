import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import type { CatalogProduct } from "../shared/catalog";
import {
  catalogProducts,
  type CatalogProductRow,
  type InsertCatalogProduct,
  InsertUser,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

function parseTags(value: string): string[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((tag): tag is string => typeof tag === "string")
      : [];
  } catch {
    return [];
  }
}

function toCatalogProduct(row: CatalogProductRow): CatalogProduct {
  return {
    id: row.id,
    handle: row.handle,
    title: row.title,
    category: row.category,
    description: row.description,
    price: { amount: row.price, currencyCode: "EGP" },
    image: {
      url: row.imageUrl,
      altText: row.imageAltText ?? row.title,
    },
    tags: parseTags(row.tagsJson),
    available: row.available === 1,
  };
}

export type CatalogProductWrite = Omit<CatalogProduct, "id">;

function toCatalogValues(
  product: CatalogProductWrite
): Omit<InsertCatalogProduct, "id"> {
  return {
    handle: product.handle,
    title: product.title,
    category: product.category,
    description: product.description,
    price: product.price.amount,
    imageUrl: product.image.url,
    imageAltText: product.image.altText,
    tagsJson: JSON.stringify(product.tags),
    available: product.available ? 1 : 0,
  };
}

export async function listCatalogProducts(): Promise<CatalogProduct[]> {
  const db = await getDb();
  if (!db) throw new Error("قاعدة بيانات الكتالوج غير متاحة حاليًا.");

  const rows = await db.select().from(catalogProducts);
  return rows.map(toCatalogProduct);
}

export async function getCatalogProductByHandle(handle: string) {
  const db = await getDb();
  if (!db) throw new Error("قاعدة بيانات الكتالوج غير متاحة حاليًا.");

  const rows = await db
    .select()
    .from(catalogProducts)
    .where(eq(catalogProducts.handle, handle))
    .limit(1);
  return rows[0] ? toCatalogProduct(rows[0]) : undefined;
}

export async function createCatalogProduct(
  id: string,
  product: CatalogProductWrite
) {
  const db = await getDb();
  if (!db) throw new Error("قاعدة بيانات الكتالوج غير متاحة حاليًا.");

  await db.insert(catalogProducts).values({ id, ...toCatalogValues(product) });
  return getCatalogProductByHandle(product.handle);
}

export async function updateCatalogProduct(
  id: string,
  product: CatalogProductWrite
) {
  const db = await getDb();
  if (!db) throw new Error("قاعدة بيانات الكتالوج غير متاحة حاليًا.");

  await db
    .update(catalogProducts)
    .set(toCatalogValues(product))
    .where(eq(catalogProducts.id, id));

  const rows = await db
    .select()
    .from(catalogProducts)
    .where(eq(catalogProducts.id, id))
    .limit(1);
  return rows[0] ? toCatalogProduct(rows[0]) : undefined;
}

export async function deleteCatalogProduct(id: string) {
  const db = await getDb();
  if (!db) throw new Error("قاعدة بيانات الكتالوج غير متاحة حاليًا.");

  await db.delete(catalogProducts).where(eq(catalogProducts.id, id));
}
