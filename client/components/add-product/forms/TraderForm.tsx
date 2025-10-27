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

const traderSchema = z.object({
  name: z.string().min(2, "Enter trader name"),
  avatar: z.string().url("Enter a valid avatar URL"),
  badge: z.string().min(1, "Provide badge"),
  followers: z.string().min(1, "Enter followers"),
  publications: z.string().min(1, "Enter publications count"),
  trades30Days: z.string().min(1, "Provide trades in 30 days"),
  experience: z.string().min(1, "Provide experience"),
  roiMonth: z.string().min(1, "Provide monthly ROI"),
  roiQuarter: z.string().min(1, "Provide quarterly ROI"),
  avgProfitability: z.string().min(1, "Provide average profitability"),
  accuracy: z.string().min(1, "Provide accuracy"),
  certification: z.string().min(1, "Provide certification"),
  rating: z.string().min(1, "Provide rating"),
  bio: z.string().optional(),
  price: z.string().optional(),
});

export type TraderFormValues = z.infer<typeof traderSchema>;

const defaultValues: TraderFormValues = {
  name: "",
  avatar: "",
  badge: "Top Trader",
  followers: "18,500",
  publications: "320",
  trades30Days: "120",
  experience: "8 years",
  roiMonth: "+12%",
  roiQuarter: "+38%",
  avgProfitability: "68%",
  accuracy: "74%",
  certification: "FINRA",
  rating: "4.9",
  bio: "",
  price: "",
};

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

const TraderForm = ({ onCreated }: { onCreated?: (id: string) => void }) => {
  const { form, publish, saveDraft, publishing, savingDraft } = useProductForm<TraderFormValues>({
    schema: traderSchema,
    defaultValues,
    table: "traders",
    buildId: (values) => `${toSlug(values.name || "trader") || "trader"}-${Math.random().toString(36).slice(2, 6)}`,
    buildPayload: (values) => ({
      name: values.name,
      avatar: values.avatar,
      badge: values.badge,
      followers: values.followers,
      publications: values.publications,
      trades_30_days: values.trades30Days,
      experience: values.experience,
      roi_month: values.roiMonth,
      roi_quarter: values.roiQuarter,
      avg_profitability: values.avgProfitability,
      accuracy: values.accuracy,
      certification: values.certification,
      rating: values.rating,
      bio: values.bio ?? null,
      price: values.price ?? null,
    }),
    onCreated,
    getDisplayName: (values) => values.name,
  });

  const values = form.watch();

  const previewData = useMemo(
    () => ({
      name: values.name || "Trader name",
      badge: values.badge || "",
      followers: values.followers || "",
      trades30Days: values.trades30Days || "",
      roiMonth: values.roiMonth || "",
      roiQuarter: values.roiQuarter || "",
      avgProfitability: values.avgProfitability || "",
      accuracy: values.accuracy || "",
    }),
    [values],
  );

  const textField = (
    name: keyof TraderFormValues,
    label: string,
    placeholder?: string,
  ) => (
    <FormField
      key={name as string}
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-xs font-bold uppercase text-[#B0B0B0]">{label}</FormLabel>
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
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase text-[#B0B0B0]">Trader preview</p>
                <h3 className="text-lg font-bold text-white">{previewData.name}</h3>
                <span className="rounded-full bg-[#523A83] px-3 py-1 text-xs font-bold text-white">
                  {previewData.badge}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-[#2E2744] px-3 py-1 text-xs font-bold text-white">
                  Followers: {previewData.followers}
                </span>
                <span className="rounded-full bg-[#1C3430] px-3 py-1 text-xs font-bold uppercase text-[#2EBD85]">
                  Accuracy: {previewData.accuracy}
                </span>
              </div>
            </div>
            <div className="flex gap-2 text-xs font-bold uppercase text-[#B0B0B0]">
              <span>Trades 30 days: {previewData.trades30Days}</span>
              <span>Avg profitability: {previewData.avgProfitability}</span>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-[#181B22] bg-[#0C101480] p-3 text-sm font-bold text-white">
                ROI month: {previewData.roiMonth}
              </div>
              <div className="rounded-2xl border border-[#181B22] bg-[#0C101480] p-3 text-sm font-bold text-white">
                ROI quarter: {previewData.roiQuarter}
              </div>
            </div>
          </div>
        </FormSection>

        <FormSection title="Trader profile">
          <div className="grid gap-4 md:grid-cols-2">
            {textField("name", "Full name", "Daniel Carter")}
            {textField("avatar", "Avatar URL", "https://")}
            {textField("badge", "Badge", "Top Trader")}
            {textField("followers", "Followers", "18,500")}
            {textField("publications", "Publications", "320")}
            {textField("trades30Days", "Trades in 30 days", "120")}
            {textField("experience", "Experience", "8 years")}
            {textField("roiMonth", "ROI month", "+12%")}
            {textField("roiQuarter", "ROI quarter", "+38%")}
            {textField("avgProfitability", "Average profitability", "68%")}
            {textField("accuracy", "Accuracy", "74%")}
            {textField("certification", "Certification", "FINRA")}
            {textField("rating", "Rating", "4.9")}
          </div>
        </FormSection>

        <FormSection title="Narrative">
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase text-[#B0B0B0]">
                  Biography / strategy description
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Describe trading style, assets, and risk management"
                    className="min-h-[120px] rounded-2xl border border-[#181B22] bg-[#0C101480] p-4 text-sm text-white placeholder:text-[#B0B0B0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A06AFF]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        <FormSection title="Pricing">
          {textField("price", "Monthly subscription", "$149 / month")}
        </FormSection>

        <FormActions
          onPublish={publish}
          onSaveDraft={saveDraft}
          onPreview={() => {
            window.alert(
              `Trader: ${previewData.name}\nROI month: ${previewData.roiMonth}\nROI quarter: ${previewData.roiQuarter}`,
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

export default TraderForm;
