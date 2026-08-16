import { COOKIE_NAME } from "@shared/const";
import { PRODUCT_CATEGORIES } from "@shared/catalog";
import { nanoid } from "nanoid";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import {
  createCatalogProduct,
  deleteCatalogProduct,
  getCatalogProductByHandle,
  listCatalogProducts,
  updateCatalogProduct,
} from "./db";
import { storagePut } from "./storage";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";

const productInput = z.object({
  handle: z
    .string()
    .trim()
    .min(3, "استخدم رابطًا مختصرًا من 3 أحرف على الأقل.")
    .max(160)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "استخدم أحرفًا إنجليزية صغيرة وأرقامًا وشرطة فقط في رابط المنتج."
    ),
  title: z.string().trim().min(2).max(255),
  category: z.enum(PRODUCT_CATEGORIES),
  description: z.string().trim().min(10).max(5000),
  price: z.coerce.number().positive().max(999999),
  imageUrl: z.string().trim().min(1).max(2000),
  imageAltText: z.string().trim().max(255).optional(),
  tags: z.array(z.string().trim().min(1).max(50)).max(12),
  available: z.boolean(),
});

const imageUploadInput = z.object({
  fileName: z.string().trim().min(1).max(160),
  contentType: z.enum(["image/jpeg", "image/png", "image/webp"]),
  base64: z.string().min(1).max(8_500_000),
});

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  catalog: router({
    list: publicProcedure.query(() => listCatalogProducts()),
    getByHandle: publicProcedure
      .input(z.object({ handle: z.string().min(1) }))
      .query(({ input }) => getCatalogProductByHandle(input.handle)),
    create: adminProcedure.input(productInput).mutation(async ({ input }) => {
      const product = await createCatalogProduct(nanoid(), {
        handle: input.handle,
        title: input.title,
        category: input.category,
        description: input.description,
        price: { amount: String(input.price), currencyCode: "EGP" },
        image: {
          url: input.imageUrl,
          altText: input.imageAltText || input.title,
        },
        tags: input.tags,
        available: input.available,
      });

      if (!product) throw new Error("تعذر إنشاء المنتج.");
      return product;
    }),
    update: adminProcedure
      .input(z.object({ id: z.string().min(1), product: productInput }))
      .mutation(async ({ input }) => {
        const product = await updateCatalogProduct(input.id, {
          handle: input.product.handle,
          title: input.product.title,
          category: input.product.category,
          description: input.product.description,
          price: { amount: String(input.product.price), currencyCode: "EGP" },
          image: {
            url: input.product.imageUrl,
            altText: input.product.imageAltText || input.product.title,
          },
          tags: input.product.tags,
          available: input.product.available,
        });

        if (!product) throw new Error("المنتج غير موجود.");
        return product;
      }),
    remove: adminProcedure
      .input(z.object({ id: z.string().min(1) }))
      .mutation(({ input }) => deleteCatalogProduct(input.id)),
    uploadImage: adminProcedure
      .input(imageUploadInput)
      .mutation(async ({ input, ctx }) => {
        const bytes = Buffer.from(input.base64, "base64");
        const extension = input.contentType.split("/")[1];
        const safeName = input.fileName
          .replace(/[^a-zA-Z0-9._-]/g, "-")
          .replace(/-+/g, "-");
        const { url } = await storagePut(
          `catalog/${ctx.user.id}/${Date.now()}-${safeName}.${extension}`,
          bytes,
          input.contentType
        );
        return { url };
      }),
  }),
});

export type AppRouter = typeof appRouter;
