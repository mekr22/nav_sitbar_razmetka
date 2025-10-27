import { useMemo } from "react";
import { z } from "zod";

import FormSection from "@/components/add-product/FormSection";
import FormActions from "@/components/add-product/FormActions";
import useProductForm from "@/components/add-product/useProductForm";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const DEFAULT_IMAGE = "https://cdn.builder.io/api/v1/image/assets/TEMP/placeholder-signal";

const signalFormSchema = z.object({
  name: z.string().min(2, "Enter a product title"),
  icon: z.string().url("Enter a valid image URL"),
  users: z.string().min(1, "Specify the number of subscribers"),
  riskLevel: z.string().min(1, "Select risk level"),
  platforms: z.string().min(1, "Provide at least one platform"),
  assets: z.string().min(1, "Provide at least one asset"),
  type: z.string().min(1, "Enter indicator type"),
  timeframes: z.string().min(1, "Provide at least one timeframe"),
  use: z.string().min(1, "Describe product usage"),
  accuracy: z.string().min(1, "Specify accuracy"),
  chartImage: z
    .string()
    .optional()
    .transform((value) => value?.trim() ?? "")
    .refine((value) => value.length === 0 || /^https?:\/\//.test(value), {
      message: "Enter a valid URL",
    }),
  description: z.string().optional(),
  price: z.string().optional(),
});

export type SignalFormValues = z.infer<typeof signalFormSchema>;

const defaultValues: SignalFormValues = {
  name: "",
  icon: "",
  users: "",
  riskLevel: "LOW",
  platforms: "Binance, Coinbase",
  assets: "BTC, ETH",
  type: "TREND",
  timeframes: "M15, H1",
  use: "TREND",
  accuracy: "75%",
  chartImage: "",
  description: "",
  price: "",
};

const splitList = (value: string): string[] =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
    .trim();

const buildSignalId = (values: SignalFormValues) => {
  const base = toSlug(values.name || "signal") || "signal";
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${base}-${suffix}`;
};

const SignalForm = ({ onCreated }: { onCreated?: (id: string) => void }) => {
  const { form, publish, saveDraft, publishing, savingDraft } = useProductForm<SignalFormValues>(
    {
      schema: signalFormSchema,
      defaultValues,
      table: "signals",
      buildId: buildSignalId,
      buildPayload: (values) => ({
        name: values.name,
        icon: values.icon,
        users: values.users,
        risk_level: values.riskLevel.toUpperCase(),
        platforms: splitList(values.platforms),
        assets: splitList(values.assets),
        type: values.type,
        timeframes: splitList(values.timeframes),
        use: values.use,
        accuracy: values.accuracy,
        chart_image: values.chartImage ? values.chartImage : null,
        description: values.description ?? null,
        price: values.price ?? null,
      }),
      onCreated,
      getDisplayName: (values) => values.name,
    },
  );

  const values = form.watch();
  const previewData = useMemo(
    () => ({
      name: values.name || "Your product's title",
      riskLevel: values.riskLevel || "LOW",
      users: values.users || "0",
      price: values.price || "$10 / month",
      description:
        values.description ||
        "Describe how your signal works, what assets it covers, and why traders should subscribe.",
      platforms: splitList(values.platforms),
      assets: splitList(values.assets),
      timeframes: splitList(values.timeframes),
      accuracy: values.accuracy || "0%",
      icon: values.icon || DEFAULT_IMAGE,
      chartImage: values.chartImage ? values.chartImage : DEFAULT_IMAGE,
    }),
    [values],
  );

  return (
    <Form {...form}>
      <form className="flex flex-col gap-6">
        <FormSection title="Preview">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs font-bold uppercase text-[#B0B0B0]">Preview</p>
                <h3 className="text-lg font-bold text-white">{previewData.name}</h3>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded bg-[#1C3430] px-2 py-1 text-xs font-bold uppercase text-[#2EBD85]">
                  Risk: {previewData.riskLevel}
                </span>
                <span className="rounded bg-[#2E2744] px-2 py-1 text-xs font-bold text-white">
                  Subscribers: {previewData.users}
                </span>
              </div>
            </div>
            <p className="text-sm font-medium text-[#B0B0B0]">{previewData.description}</p>
            <div className="flex flex-wrap gap-2 text-xs font-bold uppercase text-[#B0B0B0]">
              <span>Platforms:</span>
              {previewData.platforms.map((platform) => (
                <span key={platform} className="rounded-full bg-[#2E2744] px-2 py-0.5 text-white">
                  {platform}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-bold uppercase text-[#B0B0B0]">
              <span>Assets:</span>
              {previewData.assets.map((asset) => (
                <span key={asset} className="rounded-full bg-[#2E2744] px-2 py-0.5 text-white">
                  {asset}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-bold uppercase text-[#B0B0B0]">
              <span>Timeframes:</span>
              {previewData.timeframes.map((tf) => (
                <span key={tf} className="rounded-full bg-[#2E2744] px-2 py-0.5 text-[#6AA5FF]">
                  {tf}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#B0B0B0]">
              <span>Accuracy:</span>
              <span className="text-[#2EBD85]">{previewData.accuracy}</span>
            </div>
          </div>
        </FormSection>

        <FormSection title="Product information">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase text-[#B0B0B0]">
                    Product title
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter product title"
                      className="h-11 rounded-full border border-[#181B22] bg-[#0C101480] px-6 text-[15px] text-white placeholder:text-[#B0B0B0]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase text-[#B0B0B0]">
                    Icon URL
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="https://"
                      className="h-11 rounded-full border border-[#181B22] bg-[#0C101480] px-6 text-[15px] text-white placeholder:text-[#B0B0B0]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="users"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase text-[#B0B0B0]">
                    Subscribers
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="1,500"
                      className="h-11 rounded-full border border-[#181B22] bg-[#0C101480] px-6 text-[15px] text-white placeholder:text-[#B0B0B0]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="riskLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase text-[#B0B0B0]">
                    Risk level
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="LOW"
                      className="h-11 rounded-full border border-[#181B22] bg-[#0C101480] px-6 text-[15px] text-white placeholder:text-[#B0B0B0]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase text-[#B0B0B0]">
                  Short description
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Explain what your product offers"
                    className={cn(
                      "min-h-[120px] rounded-2xl border border-[#181B22] bg-[#0C101480] p-4 text-sm text-white placeholder:text-[#B0B0B0]",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A06AFF]",
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        <FormSection title="Trading parameters">
          <FormField
            control={form.control}
            name="platforms"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase text-[#B0B0B0]">
                  Exchanges (comma separated)
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Binance, Coinbase, NYSE"
                    className="h-11 rounded-full border border-[#181B22] bg-[#0C101480] px-6 text-[15px] text-white placeholder:text-[#B0B0B0]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="assets"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase text-[#B0B0B0]">
                  Assets (comma separated)
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="BTC, ETH, EUR/USD"
                    className="h-11 rounded-full border border-[#181B22] bg-[#0C101480] px-6 text-[15px] text-white placeholder:text-[#B0B0B0]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase text-[#B0B0B0]">
                    Indicator type
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="TREND"
                      className="h-11 rounded-full border border-[#181B22] bg-[#0C101480] px-6 text-[15px] text-white placeholder:text-[#B0B0B0]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="timeframes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase text-[#B0B0B0]">
                    Timeframes (comma separated)
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="M15, H1, D1"
                      className="h-11 rounded-full border border-[#181B22] bg-[#0C101480] px-6 text-[15px] text-white placeholder:text-[#B0B0B0]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="use"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase text-[#B0B0B0]">
                  Use case
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="TREND / REVERSAL"
                    className="h-11 rounded-full border border-[#181B22] bg-[#0C101480] px-6 text-[15px] text-white placeholder:text-[#B0B0B0]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="accuracy"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase text-[#B0B0B0]">
                  Accuracy
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="75%"
                    className="h-11 rounded-full border border-[#181B22] bg-[#0C101480] px-6 text-[15px] text-white placeholder:text-[#B0B0B0]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        <FormSection title="Media and pricing">
          <FormField
            control={form.control}
            name="chartImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase text-[#B0B0B0]">
                  Chart or demo image URL
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="https://"
                    className="h-11 rounded-full border border-[#181B22] bg-[#0C101480] px-6 text-[15px] text-white placeholder:text-[#B0B0B0]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase text-[#B0B0B0]">
                  Subscription price
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="$19 / month"
                    className="h-11 rounded-full border border-[#181B22] bg-[#0C101480] px-6 text-[15px] text-white placeholder:text-[#B0B0B0]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        <FormActions
          onSaveDraft={saveDraft}
          onPublish={publish}
          onPreview={() => {
            const url = previewData.chartImage || DEFAULT_IMAGE;
            window.open(url, "_blank", "noopener,noreferrer");
          }}
          disabled={publishing || savingDraft}
          savingDraft={savingDraft}
          publishing={publishing}
        />
      </form>
    </Form>
  );
};

export default SignalForm;
