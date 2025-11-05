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
import { Switch } from "@/components/ui/switch";

const analystSchema = z.object({
  name: z.string().min(2, "Enter analyst name"),
  avatar: z.string().url("Enter a valid avatar URL"),
  company: z.string().min(1, "Specify company"),
  role: z.string().min(1, "Specify role"),
  rating: z.string().min(1, "Provide rating"),
  followers: z.string().min(1, "Enter followers"),
  publications: z.string().min(1, "Enter publications count"),
  markets: z.string().min(1, "List markets"),
  assets: z.string().min(1, "List assets"),
  analysis: z.string().min(1, "Provide analysis type"),
  forecastAccuracy: z.string().min(1, "Provide forecast accuracy"),
  featured: z.boolean().default(false),
  bio: z.string().optional(),
  price: z.string().optional(),
});

export type AnalystFormValues = z.infer<typeof analystSchema>;

const defaultValues: AnalystFormValues = {
  name: "",
  avatar: "",
  company: "",
  role: "",
  rating: "5.0",
  followers: "12,500",
  publications: "820",
  markets: "NASDAQ, NYSE",
  assets: "AAPL, NVDA, BTC",
  analysis: "TECHNICAL & ANALYSIS",
  forecastAccuracy: "68%",
  featured: false,
  bio: "",
  price: "",
};

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

const AnalystForm = ({ onCreated }: { onCreated?: (id: string) => void }) => {
  const { form, publish, saveDraft, publishing, savingDraft } =
    useProductForm<AnalystFormValues>({
      schema: analystSchema,
      defaultValues,
      table: "analysts",
      buildId: (values) =>
        `${toSlug(values.name || "analyst") || "analyst"}-${Math.random().toString(36).slice(2, 6)}`,
      buildPayload: (values) => ({
        name: values.name,
        avatar: values.avatar,
        company: values.company,
        role: values.role,
        rating: values.rating,
        followers: values.followers,
        publications: values.publications,
        markets: values.markets,
        assets: values.assets,
        analysis: values.analysis,
        forecast_accuracy: values.forecastAccuracy,
        featured: values.featured,
        bio: values.bio ?? null,
        price: values.price ?? null,
      }),
      onCreated,
      getDisplayName: (values) => values.name,
    });

  const values = form.watch();

  const previewData = useMemo(
    () => ({
      name: values.name || "Analyst name",
      role: values.role || "",
      company: values.company || "",
      rating: values.rating || "",
      followers: values.followers || "",
      publications: values.publications || "",
      markets: values.markets,
      assets: values.assets,
      analysis: values.analysis,
      forecastAccuracy: values.forecastAccuracy,
      featured: values.featured,
    }),
    [values],
  );

  type AnalystTextFieldName = Exclude<keyof AnalystFormValues, "featured">;

  const textField = (
    name: AnalystTextFieldName,
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
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase text-[#B0B0B0]">
                  Analyst preview
                </p>
                <h3 className="text-lg font-bold text-white">
                  {previewData.name}
                </h3>
                <p className="text-sm font-medium text-[#B0B0B0]">
                  {previewData.role} · {previewData.company}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-[#2E2744] px-3 py-1 text-xs font-bold text-white">
                  Rating: {previewData.rating}
                </span>
                <span className="rounded-full bg-[#1C3430] px-3 py-1 text-xs font-bold uppercase text-[#2EBD85]">
                  Forecast: {previewData.forecastAccuracy}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-bold uppercase text-[#B0B0B0]">
              <span>Markets:</span>
              <span className="rounded-full bg-[#2E2744] px-2 py-0.5 text-white">
                {previewData.markets}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-bold uppercase text-[#B0B0B0]">
              <span>Assets:</span>
              <span className="rounded-full bg-[#2E2744] px-2 py-0.5 text-white">
                {previewData.assets}
              </span>
            </div>
            <p className="text-xs font-bold uppercase text-[#B0B0B0]">
              Analysis:{" "}
              <span className="text-white normal-case">
                {previewData.analysis}
              </span>
            </p>
            <div className="flex gap-2 text-xs font-bold uppercase text-[#B0B0B0]">
              <span>Followers: {previewData.followers}</span>
              <span>Publications: {previewData.publications}</span>
            </div>
            {previewData.featured ? (
              <span className="w-fit rounded-full bg-[#523A83] px-3 py-1 text-xs font-bold text-white">
                Featured
              </span>
            ) : null}
          </div>
        </FormSection>

        <FormSection title="Profile">
          <div className="grid gap-4 md:grid-cols-2">
            {textField("name", "Full name", "Sarah Lee")}
            {textField("avatar", "Avatar URL", "https://")}
            {textField("company", "Company", "Berkshire Hathaway")}
            {textField("role", "Role", "Hedge fund manager")}
            {textField("rating", "Rating", "5.0")}
            {textField("followers", "Followers", "12,500")}
            {textField("publications", "Publications", "820")}
            {textField("markets", "Markets", "NASDAQ, NYSE")}
            {textField("assets", "Assets", "AAPL, NVDA, BTC")}
            {textField("analysis", "Analysis type", "TECHNICAL & ANALYSIS")}
            {textField("forecastAccuracy", "Forecast accuracy", "68%")}
          </div>
        </FormSection>

        <FormSection title="Narrative">
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase text-[#B0B0B0]">
                  Biography / description
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Share analyst background, specializations, and achievements"
                    className="min-h-[120px] rounded-2xl border border-[#181B22] bg-[#0C101480] p-4 text-sm text-white placeholder:text-[#B0B0B0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A06AFF]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        <FormSection title="Visibility">
          <FormField
            control={form.control}
            name="featured"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between gap-2">
                <div className="flex flex-col">
                  <FormLabel className="text-xs font-bold uppercase text-[#B0B0B0]">
                    Featured profile
                  </FormLabel>
                  <span className="text-sm font-medium text-[#B0B0B0]">
                    Highlight analyst in marketplace listings
                  </span>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </FormSection>

        <FormSection title="Monetization">
          {textField("price", "Consultation price", "$199 / hour")}
        </FormSection>

        <FormActions
          onPublish={publish}
          onSaveDraft={saveDraft}
          onPreview={() => {
            window.alert(
              `Analyst: ${previewData.name}\nForecast accuracy: ${previewData.forecastAccuracy}\nRating: ${previewData.rating}`,
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

export default AnalystForm;
