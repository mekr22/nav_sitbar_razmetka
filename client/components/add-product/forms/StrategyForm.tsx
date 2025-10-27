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

const strategySchema = z.object({
  name: z.string().min(2, "Enter a strategy name"),
  icon: z.string().url("Enter a valid image URL"),
  users: z.string().min(1, "Specify number of investors"),
  riskLevel: z.string().min(1, "Specify risk level"),
  profitSharing: z.string().min(1, "Add profit sharing details"),
  exchanges: z.string().min(1, "Provide supported exchanges"),
  exchangesCount: z.coerce.number().min(0, "Enter a positive number"),
  assets: z.string().min(1, "List supported assets"),
  strategy: z.string().min(1, "Describe strategy"),
  maxDrawdown: z.string().min(1, "Specify maximum drawdown"),
  minCapital: z.string().min(1, "Specify minimum capital"),
  roi30d: z.string().min(1, "Provide 30 day ROI"),
  roi1y: z.string().min(1, "Provide annual ROI"),
  description: z.string().optional(),
  price: z.string().optional(),
});

export type StrategyFormValues = z.infer<typeof strategySchema>;

const defaultValues: StrategyFormValues = {
  name: "",
  icon: "",
  users: "",
  riskLevel: "MEDIUM",
  profitSharing: "20% Profit Sharing",
  exchanges: "Binance, NYSE",
  exchangesCount: 12,
  assets: "Stocks, ETFs",
  strategy: "Momentum breakout",
  maxDrawdown: "10%",
  minCapital: "$1,000",
  roi30d: "+5%",
  roi1y: "+35%",
  description: "",
  price: "",
};

const splitList = (value: string): string[] =>
  value
    .split(",")
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

const buildStrategyId = (values: StrategyFormValues) =>
  `${toSlug(values.name || "strategy") || "strategy"}-${Math.random().toString(36).slice(2, 6)}`;

const StrategyForm = ({ onCreated }: { onCreated?: (id: string) => void }) => {
  const { form, publish, saveDraft, publishing, savingDraft } =
    useProductForm<StrategyFormValues>({
      schema: strategySchema,
      defaultValues,
      table: "strategies",
      buildId: buildStrategyId,
      buildPayload: (values) => ({
        name: values.name,
        icon: values.icon,
        users: values.users,
        risk_level: values.riskLevel.toUpperCase(),
        profit_sharing: values.profitSharing,
        exchanges: splitList(values.exchanges).map((exchange) =>
          toSlug(exchange),
        ),
        exchanges_count: values.exchangesCount,
        assets: splitList(values.assets).map((asset) => asset.toUpperCase()),
        strategy: values.strategy,
        max_drawdown: values.maxDrawdown,
        min_capital: values.minCapital,
        roi_30d: values.roi30d,
        roi_1y: values.roi1y,
        description: values.description ?? null,
        price: values.price ?? null,
      }),
      onCreated,
      getDisplayName: (values) => values.name,
    });

  const values = form.watch();

  const previewData = useMemo(
    () => ({
      title: values.name || "Strategy name",
      risk: values.riskLevel || "MEDIUM",
      investors: values.users || "0",
      profitSharing: values.profitSharing || "",
      roi30d: values.roi30d || "+0%",
      roi1y: values.roi1y || "+0%",
      description:
        values.description ||
        "Explain the methodology, risk management, and signal generation specific to your strategy.",
      exchanges: splitList(values.exchanges),
      assets: splitList(values.assets),
    }),
    [values],
  );

  const textField = (
    name: keyof StrategyFormValues,
    label: string,
    placeholder?: string,
    type: React.HTMLInputTypeAttribute = "text",
  ) => (
    <FormField
      key={name as string}
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-xs font-bold uppercase text-[#B0B0B0]">
            {label}
          </FormLabel>
          <FormControl>
            <Input
              {...field}
              type={type}
              placeholder={placeholder}
              className="h-11 rounded-full border border-[#181B22] bg-[#0C101480] px-6 text-[15px] text-white placeholder:text-[#B0B0B0]"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <Form {...form}>
      <form className="flex flex-col gap-6">
        <FormSection title="Preview">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase text-[#B0B0B0]">
                  Strategy preview
                </p>
                <h3 className="text-lg font-bold text-white">
                  {previewData.title}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-[#1C3430] px-3 py-1 text-xs font-bold uppercase text-[#2EBD85]">
                  Risk: {previewData.risk}
                </span>
                <span className="rounded-full bg-[#2E2744] px-3 py-1 text-xs font-bold text-white">
                  Investors: {previewData.investors}
                </span>
              </div>
            </div>
            <p className="text-sm font-medium text-[#B0B0B0]">
              {previewData.description}
            </p>
            <div className="grid gap-3 md:grid-cols-3">
              {["Profit sharing", "ROI 30d", "ROI 1y"].map((label, index) => (
                <div
                  key={label}
                  className="rounded-2xl border border-[#181B22] bg-[#0C101480] p-3"
                >
                  <p className="text-xs font-bold uppercase text-[#B0B0B0]">
                    {label}
                  </p>
                  <p className="text-[15px] font-bold text-white">
                    {index === 0
                      ? previewData.profitSharing
                      : index === 1
                        ? previewData.roi30d
                        : previewData.roi1y}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2 text-xs font-bold uppercase text-[#B0B0B0]">
              <span>Exchanges:</span>
              <div className="flex flex-wrap gap-2">
                {previewData.exchanges.map((exchange) => (
                  <span
                    key={exchange}
                    className="rounded-full bg-[#2E2744] px-2 py-0.5 text-white"
                  >
                    {exchange}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2 text-xs font-bold uppercase text-[#B0B0B0]">
              <span>Assets:</span>
              <div className="flex flex-wrap gap-2">
                {previewData.assets.map((asset) => (
                  <span
                    key={asset}
                    className="rounded-full bg-[#2E2744] px-2 py-0.5 text-white"
                  >
                    {asset}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </FormSection>

        <FormSection title="Strategy details">
          <div className="grid gap-4 md:grid-cols-2">
            {textField("name", "Strategy name", "Momentum Alpha")}
            {textField("icon", "Icon URL", "https://")}
            {textField("users", "Subscribers / investors", "320")}
            {textField("riskLevel", "Risk level", "MEDIUM")}
          </div>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase text-[#B0B0B0]">
                  Description
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Summarize methodology, trade frequency, and risk management approach"
                    className="min-h-[120px] rounded-2xl border border-[#181B22] bg-[#0C101480] p-4 text-sm text-white placeholder:text-[#B0B0B0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A06AFF]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        <FormSection title="Trading parameters">
          {textField("profitSharing", "Profit sharing", "20% Profit Sharing")}
          <div className="grid gap-4 md:grid-cols-2">
            {textField(
              "exchanges",
              "Exchanges (comma separated)",
              "Binance, Coinbase, NYSE",
            )}
            {textField(
              "exchangesCount",
              "Total exchanges available",
              "30",
              "number",
            )}
          </div>
          {textField(
            "assets",
            "Assets (comma separated)",
            "Stocks, Crypto, ETFs",
          )}
          <div className="grid gap-4 md:grid-cols-2">
            {textField("strategy", "Strategy style", "Momentum breakout")}
            {textField("maxDrawdown", "Maximum drawdown", "15%")}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {textField("minCapital", "Minimum capital", "$1,000")}
            {textField("roi30d", "ROI 30 days", "+12.4%")}
          </div>
          {textField("roi1y", "ROI 1 year", "+68.3%")}
        </FormSection>

        <FormSection title="Monetization">
          {textField(
            "price",
            "Management fee / subscription price",
            "$99 / month",
          )}
        </FormSection>

        <FormActions
          onPublish={publish}
          onSaveDraft={saveDraft}
          onPreview={() => {
            window.alert(
              `Strategy: ${previewData.title}\nRisk: ${previewData.risk}\nROI 30d: ${previewData.roi30d}\nROI 1y: ${previewData.roi1y}`,
            );
          }}
          disabled={publishing || savingDraft}
          publishing={publishing}
          savingDraft={savingDraft}
        />
      </form>
    </Form>
  );
};

export default StrategyForm;
