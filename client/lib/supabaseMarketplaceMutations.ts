import type { PostgrestError } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabaseClient";

export type ProductInsertStatus = "draft" | "published";

export interface InsertProductOptions {
  userId?: string;
  status?: ProductInsertStatus;
}

const extractMissingColumns = (error: PostgrestError): string[] => {
  if (!error?.message) {
    return [];
  }

  const matches = Array.from(
    error.message.matchAll(/column\s+\"([^\"]+)\"\s+(?:of\s+relation\s+\"[^\"]+\"\s+)?does\s+not\s+exist/gi),
  );

  return matches.map((match) => match[1]).filter(Boolean);
};

const isDuplicateKeyError = (error: PostgrestError): boolean =>
  error?.code === "23505" || /duplicate key value/i.test(error?.message ?? "");

export class ProductInsertError extends Error {
  constructor(message: string, readonly cause?: PostgrestError) {
    super(message);
    this.name = "ProductInsertError";
  }
}

export const insertProductRecord = async <T extends Record<string, unknown>>(
  table: string,
  record: T,
  options: InsertProductOptions = {},
): Promise<T> => {
  if (!supabase) {
    throw new ProductInsertError("Supabase client is not configured");
  }

  const payload: Record<string, unknown> = { ...record };

  if (options.userId) {
    payload.user_id = options.userId;
  }
  if (options.status) {
    payload.status = options.status;
  }

  const attemptInsert = async (data: Record<string, unknown>) =>
    supabase.from(table).insert(data).select().single<T>();

  let { data, error } = await attemptInsert(payload);

  if (error) {
    if (isDuplicateKeyError(error)) {
      throw new ProductInsertError("A product with the same identifier already exists", error);
    }

    const missingColumns = extractMissingColumns(error);

    if (missingColumns.length > 0) {
      const fallbackPayload = { ...payload };
      missingColumns.forEach((column) => {
        delete fallbackPayload[column];
      });

      ({ data, error } = await attemptInsert(fallbackPayload));
    }
  }

  if (error) {
    throw new ProductInsertError(error.message, error);
  }

  if (!data) {
    throw new ProductInsertError("Product creation returned no data");
  }

  return data;
};
