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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const tradingRobotSchema = z.object({
  name: z.string().min(2, "Enter a robot name"),
  icon: z.string().url("Enter a valid image URL"),
  users: z.string().min(1, "Specify number of users"),
  accuracyLabel: z.string().min(1, "Provide accuracy label"),
  accuracyLevel: z.enum(["LOW", "MEDIUM", "HIGH"]),
  profitSharing: z.string().min(1, "Set profit sharing"),
  exchangesInput: z.string().min(1, "Provide exchanges"),
  pair: z.string().min(1, "Provide trading pair"),
  maxDrawdown: z.string().min(1, "Specify max drawdown"),
  market: z.string().min(1, "Specify market"),
  assetTags: z.string().min(1, "List asset tags"),
  strategy: z.string().min(1, "Describe strategy"),
  settingsTag: z.string().min(1, "Provide settings tag"),
  roi30d: z.string().min(1, "Provide 30 day ROI"),
  roi90d: z.string().min(1, "Provide 90 day ROI"),
  roi1y: z.string().min(1, "Provide 1 year ROI"),
  automationStyle: z.enum(["trend", "grid", "arbitrage", "scalping"]),
  marketCategory: z.enum(["spot", "futures", "derivatives"]),
  leverageCategory: z.enum(["low", "moderate", "high"]),
  description: z.string().optional(),
  price: z.string().optional(),
});

export type TradingRobotFormValues = z.infer<typeof tradingRobotSchema>;

const defaultValues: TradingRobotFormValues = {
  name: "",
  icon: "",
  users: "",
  accuracyLabel: "90% accuracy",
  accuracyLevel: "HIGH",
  profitSharing: "20% Profit Sharing",
  exchangesInput: "Binance|https://example.com/binance.png",
  pair: "BTC/USDT",
  maxDrawdown: "12%",
  market: "crypto",
  assetTags: "BTC, ETH",
  strategy: "Momentum grid",
  settingsTag: "Aggressive",
  roi30d: "+25%",
  roi90d: "+78%",
  roi1y: "+210%",
  automationStyle: "trend",
  marketCategory: "spot",
  leverageCategory: "moderate",
  description: "",
  price: "",
};

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

const splitList = (value: string): string[] =>
  value
    .split(/[,\n]/)
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);

const parseExchanges = (value: string) =>
  value
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, icon] = line.split("|").map((part) => part.trim());
      if (!name) {
        return null;
      }
      return {
        id: toSlug(name),
        name,
        icon: icon || "",
      };
    })
    .filter(
      (entry): entry is { id: string; name: string; icon: string } =>
        entry !== null,
    );

const buildTradingRobotId = (values: TradingRobotFormValues) =>
  `${toSlug(values.name || "trading-robot") || "trading-robot"}-${Math.random().toString(36).slice(2, 6)}`;

const TradingRobotForm = ({
  onCreated,
}: {
  onCreated?: (id: string) => void;
}) => {
  const { form, publish, saveDraft, publishing, savingDraft } =
    useProductForm<TradingRobotFormValues>({
      schema: tradingRobotSchema,
      defaultValues,
      table: "trading_robots",
      buildId: buildTradingRobotId,
      buildPayload: (values) => ({
        name: values.name,
        icon: values.icon,
        users: values.users,
        accuracy_label: values.accuracyLabel,
        accuracy_level: values.accuracyLevel,
        profit_sharing: values.profitSharing,
        exchanges: parseExchanges(values.exchangesInput),
        pair: values.pair,
        max_drawdown: values.maxDrawdown,
        market: values.market,
        asset_tags: splitList(values.assetTags),
        strategy: values.strategy,
        settings_tag: values.settingsTag,
        roi_30d: values.roi30d,
        roi_90d: values.roi90d,
        roi_1y: values.roi1y,
        automation_style: values.automationStyle,
        market_category: values.marketCategory,
        leverage_category: values.leverageCategory,
        description: values.description ?? null,
        price: values.price ?? null,
      }),
      onCreated,
      getDisplayName: (values) => values.name,
    });

  const values = form.watch();

  const previewData = useMemo(
    () => ({
      title: values.name || "Trading robot",
      pair: values.pair || "BTC/USDT",
      accuracy: values.accuracyLabel || "",
      roi30d: values.roi30d || "+0%",
      roi1y: values.roi1y || "+0%",
      exchanges: parseExchanges(values.exchangesInput),
      assetTags: splitList(values.assetTags),
      automationStyle: values.automationStyle,
    }),
    [values],
  );

  const textField = (
    name: keyof TradingRobotFormValues,
    label: string,
    placeholder?: string,
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
                  Robot preview
                </p>
                <h3 className="text-lg font-bold text-white">
                  {previewData.title}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-[#2E2744] px-3 py-1 text-xs font-bold uppercase text-white">
                  Pair: {previewData.pair}
                </span>
                <span className="rounded-full bg-[#1C3430] px-3 py-1 text-xs font-bold uppercase text-[#2EBD85]">
                  {previewData.accuracy}
                </span>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-[#181B22] bg-[#0C101480] p-3 text-sm font-bold text-white">
                ROI 30d: {previewData.roi30d}
              </div>
              <div className="rounded-2xl border border-[#181B22] bg-[#0C101480] p-3 text-sm font-bold text-white">
                ROI 1y: {previewData.roi1y}
              </div>
              <div className="rounded-2xl border border-[#181B22] bg-[#0C101480] p-3 text-sm font-bold text-white">
                Automation: {previewData.automationStyle}
              </div>
            </div>
            <div className="flex flex-col gap-2 text-xs font-bold uppercase text-[#B0B0B0]">
              <span>Exchanges:</span>
              <div className="flex flex-wrap gap-2">
                {previewData.exchanges.map((exchange) => (
                  <span
                    key={exchange.id}
                    className="rounded-full bg-[#2E2744] px-2 py-0.5 text-white"
                  >
                    {exchange.name}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-bold uppercase text-[#B0B0B0]">
              <span>Assets:</span>
              {previewData.assetTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-[#2E2744] px-2 py-0.5 text-white"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </FormSection>

        <FormSection title="Robot basics">
          <div className="grid gap-4 md:grid-cols-2">
            {textField("name", "Robot name", "AlphaGrid Bot")}
            {textField("icon", "Icon URL", "https://")}
            {textField("users", "Users", "250")}
            {textField("accuracyLabel", "Accuracy label", "92% accuracy")}
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <FormField
              control={form.control}
              name="accuracyLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase text-[#B0B0B0]">
                    Accuracy level
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-11 rounded-full border border-[#181B22] bg-[#0C101480] px-6 text-[15px] text-white">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-[#0C1014] text-white">
                      {(["LOW", "MEDIUM", "HIGH"] as const).map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="automationStyle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase text-[#B0B0B0]">
                    Automation style
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-11 rounded-full border border-[#181B22] bg-[#0C101480] px-6 text-[15px] text-white">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-[#0C1014] text-white">
                      {(
                        ["trend", "grid", "arbitrage", "scalping"] as const
                      ).map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="marketCategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase text-[#B0B0B0]">
                    Market category
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-11 rounded-full border border-[#181B22] bg-[#0C101480] px-6 text-[15px] text-white">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-[#0C1014] text-white">
                      {(["spot", "futures", "derivatives"] as const).map(
                        (option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </FormSection>

        <FormSection title="Trading parameters">
          {textField("profitSharing", "Profit sharing", "20% Profit Sharing")}
          {textField(
            "exchangesInput",
            "Exchanges (each on new line as Name|Icon URL)",
            "Binance|https://example.com/binance.png",
          )}
          <div className="grid gap-4 md:grid-cols-2">
            {textField("pair", "Trading pair", "BTC/USDT")}
            {textField("maxDrawdown", "Maximum drawdown", "12%")}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {textField("market", "Market", "crypto")}
            {textField("assetTags", "Asset tags", "BTC, ETH")}
          </div>
          {textField("strategy", "Strategy", "Momentum grid")}
          {textField("settingsTag", "Settings tag", "Aggressive")}
          <div className="grid gap-4 md:grid-cols-3">
            {textField("roi30d", "ROI 30 days", "+25%")}
            {textField("roi90d", "ROI 90 days", "+78%")}
            {textField("roi1y", "ROI 1 year", "+210%")}
          </div>
        </FormSection>

        <FormSection title="Additional details">
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
                    placeholder="Share how the automation works, platform integrations, and requirements"
                    className="min-h-[120px] rounded-2xl border border-[#181B22] bg-[#0C101480] p-4 text-sm text-white placeholder:text-[#B0B0B0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A06AFF]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {textField("price", "Subscription price", "$149 / month")}
        </FormSection>

        <FormField
          control={form.control}
          name="leverageCategory"
          render={({ field }) => (
            <FormSection title="Risk profile">
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase text-[#B0B0B0]">
                  Leverage category
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-11 rounded-full border border-[#181B22] bg-[#0C101480] px-6 text-[15px] text-white">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-[#0C1014] text-white">
                    {(["low", "moderate", "high"] as const).map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            </FormSection>
          )}
        />

        <FormActions
          onPublish={publish}
          onSaveDraft={saveDraft}
          onPreview={() => {
            window.alert(
              `Robot: ${previewData.title}\nPair: ${previewData.pair}\nROI 30d: ${previewData.roi30d}\nROI 1y: ${previewData.roi1y}`,
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

export default TradingRobotForm;
