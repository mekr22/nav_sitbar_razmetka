import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import type {
  DefaultValues,
  FieldValues,
  UseFormReturn,
} from "react-hook-form";
import { useForm } from "react-hook-form";
import type { ZodTypeAny } from "zod";

import { useToast } from "@/hooks/use-toast";
import { insertProductRecord, type ProductInsertStatus } from "@/lib/supabaseMarketplaceMutations";
import { useAuth } from "@/providers/AuthProvider";

type SubmitHandler<T extends FieldValues> = (
  values: T,
  status: ProductInsertStatus,
) => Promise<string | void>;

export interface UseProductFormOptions<T extends FieldValues> {
  schema: ZodTypeAny;
  defaultValues: DefaultValues<T>;
  table: string;
  buildPayload: (values: T) => Record<string, unknown>;
  buildId?: (values: T) => string;
  onCreated?: (id: string) => void;
  getDisplayName?: (values: T) => string;
}

export interface UseProductFormResult<T extends FieldValues> {
  form: UseFormReturn<T>;
  publish: () => void;
  saveDraft: () => void;
  publishing: boolean;
  savingDraft: boolean;
  submit: SubmitHandler<T>;
}

const DEFAULT_ID_BUILDER = () => Math.random().toString(36).slice(2, 10);

const useProductForm = <T extends FieldValues>(
  options: UseProductFormOptions<T>,
): UseProductFormResult<T> => {
  const {
    schema,
    defaultValues,
    table,
    buildPayload,
    buildId = DEFAULT_ID_BUILDER,
    onCreated,
    getDisplayName,
  } = options;

  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const { user } = useAuth();
  const toastApi = useToast();
  const [publishing, setPublishing] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);

  const submit: SubmitHandler<T> = async (values, status) => {
    const id = buildId(values);
    const payload = { id, ...buildPayload(values) } as Record<string, unknown>;
    const activeSetter = status === "draft" ? setSavingDraft : setPublishing;

    try {
      activeSetter(true);
      const created = await insertProductRecord(table, payload, {
        status,
        userId: user?.id,
      });

      const displayName = getDisplayName ? getDisplayName(values) : "Product";

      toastApi.toast({
        title: status === "draft" ? "Draft saved" : "Product published",
        description: `${displayName} successfully saved`,
      });

      form.reset(defaultValues);
      const createdId = (created as { id?: string }).id ?? id;
      onCreated?.(createdId);
      return createdId;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unexpected error while saving product";
      toastApi.toast({
        title: "Unable to save product",
        description: message,
      });
      throw error;
    } finally {
      activeSetter(false);
    }
  };

  const publish = form.handleSubmit((data) => {
    void submit(data, "published");
  });

  const saveDraft = form.handleSubmit((data) => {
    void submit(data, "draft");
  });

  return {
    form,
    publish,
    saveDraft,
    publishing,
    savingDraft,
    submit,
  };
};

export default useProductForm;
