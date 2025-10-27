import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import FormSection from "@/components/add-product/FormSection";
import FormActions from "@/components/add-product/FormActions";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { insertProductRecord, type ProductInsertStatus } from "@/lib/supabaseMarketplaceMutations";

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

const buildStrategyId = (name: string) => `${toSlug(name || "strategy")}-${Math.random().toString(36).slice(2, 6)}`;

const StrategyForm = ({ onCreated }: { onCreated?: (id: string) => void }) => {
  const form = useForm<StrategyFormValues>({
    resolver: zodResolver(strategySchema),
    defaultValues,
  });
  const { user } = useAuth();
  const { toast } = useToast();
  const [publishing, setPublishing] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);

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

  const handleSubmit = async (
    submitValues: StrategyFormValues,
    status: ProductInsertStatus,
  ) => {
    const payload = {
      id: buildStrategyId(submitValues.name),
      name: submitValues.name,
      icon: submitValues.icon,
      users: submitValues.users,
      risk_level: submitValues.riskLevel.toUpperCase(),
      profit_sharing: submitValues.profitSharing,
      exchanges: splitList(submitValues.exchanges).map((exchange) => toSlug(exchange)),
      exchanges_count: submitValues.exchangesCount,
      assets: splitList(submitValues.assets).map((asset) => asset.toUpperCase()),
      strategy: submitValues.strategy,
      max_drawdown: submitValues.maxDrawdown,
      min_capital: submitValues.minCapital,
      roi_30d: submitValues.roi30d,
      roi_1y: submitValues.roi1y,
      description: submitValues.description ?? null,
      price: submitValues.price ?? null,
    } as Record<string, unknown>;

    const activeSetter = status === "draft" ? setSavingDraft : setPublishing;

    try {
      activeSetter(true);
      const created = await insertProductRecord("strategies", payload, {
        status,
        userId: user?.id,
      });
      toast.toast({
        title: status === "draft" ? "Draft saved" : "Product published",
        description: `${submitValues.name} is now available in strategies`,
      });
      form.reset(defaultValues);
      onCreated?.((created as { id?: string }).id ?? payload.id);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unexpected error while saving strategy";
      toast.toast({
        title: "Unable to save strategy",
        description: message,
      });
    } finally {
      activeSetter(false);
    }
  };

  const publish = form.handleSubmit((data) => handleSubmit(data, "published"));
  const saveDraft = form.handleSubmit((data) => handleSubmit(data, "draft"));

  return (
    <Form {...form}>
      <form className="flex flex-col gap-6">
        <FormSection title="Preview">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase text-[#B0B0B0]">Strategy preview</p>
                <h3 className="text-lg font-bold text-white">{previewData.title}</h3>
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
            <p className="text-sm font-medium text-[#B0B0B0]">{previewData.description}</p>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-[#181B22] bg-[#0C101480] p-3">
                <p className="text-xs font-bold uppercase text-[#B0B0B0]">Profit sharing</p>
                <p className="text-[15px] font-bold text-white">{previewData.profitSharing}</p>
              </div>
              <div className="rounded-2xl border border-[#181B22] bg-[#0C101480] p-3">
                <p className="text-xs font-bold uppercase text-[#B0B0B0]">ROI 30d</p>
                <p className="text-[15px] font-bold text-[#2EBD85]">{previewData.roi30d}</p>
              </div>
              <div className="rounded-2xl border border-[#181B22] bg-[#0C101480] p-3">
                <p className="text-xs font-bold uppercase text-[#B0B0B0]">ROI 1y</p>
                <p className="text-[15px] font-bold text-[#2EBD85]">{previewData.roi1y}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 text-xs font-bold uppercase text-[#B0B0B0]">
              <span>Exchanges:</span>
              <div className="flex flex-wrap gap-2">
                {previewData.exchanges.map((exchange) => (
                  <span key={exchange} className="rounded-full bg-[#2E2744] px-2 py-0.5 text-white">
                    {exchange}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2 text-xs font-bold uppercase text-[#B0B0B0]">
              <span>Assets:</span>
              <div className="flex flex-wrap gap-2">
                {previewData.assets.map((asset) => (
                  <span key={asset} className="rounded-full bg-[#2E2744] px-2 py-0.5 text-white">
                    {asset}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </FormSection>

        <FormSection title="Strategy details">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase text-[#B0B0B0]">
                    Strategy name
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Momentum Alpha"
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
                    Subscribers / investors
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="320"
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
                      placeholder="MEDIUM"
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
          <FormField
            control={form.control}
            name="profitSharing"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase text-[#B0B0B0]">
                  Profit sharing
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="20% Profit Sharing"
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
              name="exchanges"
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
              name="exchangesCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase text-[#B0B0B0]">
                    Total exchanges available
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      placeholder="30"
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
            name="assets"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase text-[#B0B0B0]">
                  Assets (comma separated)
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Stocks, Crypto, ETFs"
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
              name="strategy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase text-[#B0B0B0]">
                    Strategy style
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Momentum breakout"
                      className="h-11 rounded-full border border-[#181B22] bg-[#0C101480] px-6 text-[15px] text-white placeholder:text-[#B0B0B0]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maxDrawdown"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase text-[#B0B0B0]">
                    Maximum drawdown
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="15%"
                      className="h-11 rounded-full border border-[#181B22] bg-[#0C101480] px-6 text-[15px] text-white placeholder:text-[#B0B0B0]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="minCapital"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase text-[#B0B0B0]">
                    Minimum capital
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="$1,000"
                      className="h-11 rounded-full border border-[#181B22] bg-[#0C101480] px-6 text-[15px] text-white placeholder:text-[#B0B0B0]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="roi30d"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase text-[#B0B0B0]">
                    ROI 30 days
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="+12.4%"
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
            name="roi1y"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase text-[#B0B0B0]">
                  ROI 1 year
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="+68.3%"
                    className="h-11 rounded-full border border-[#181B22] bg-[#0C101480] px-6 text-[15px] text-white placeholder:text-[#B0B0B0]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        <FormSection title="Monetization">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase text-[#B0B0B0]">
                  Management fee / subscription price
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="$99 / month"
                    className="h-11 rounded-full border border-[#181B22] bg-[#0C101480] px-6 text-[15px] text-white placeholder:text-[#B0B0B0]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
