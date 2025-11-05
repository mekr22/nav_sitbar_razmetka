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

const scriptSchema = z.object({
  title: z.string().min(2, "Enter product title"),
  description: z.string().min(1, "Provide description"),
  heroImage: z.string().url("Enter a valid image URL"),
  heroAlt: z.string().min(1, "Provide image alt"),
  typeLabel: z.string().min(1, "Provide type"),
  industryLabel: z.string().min(1, "Provide industry"),
  revenueLabel: z.string().min(1, "Provide revenue label"),
  purchases: z.string().min(1, "Provide purchases"),
  views: z.string().min(1, "Provide views"),
  creatorName: z.string().min(1, "Provide creator name"),
  creatorAvatar: z.string().url("Enter creator avatar URL"),
  creatorFollowers: z.string().min(1, "Provide creator followers"),
  creatorTags: z.string().min(1, "Provide creator tags"),
  location: z.string().min(1, "Provide location"),
  verificationLabel: z.string().min(1, "Provide verification label"),
  compatibility: z.string().min(1, "Provide compatibility"),
  requirements: z.string().min(1, "Provide requirements"),
  ratingScore: z.string().min(1, "Provide rating"),
  price: z.string().optional(),
});

export type ScriptProductFormValues = z.infer<typeof scriptSchema>;

const defaultValues: ScriptProductFormValues = {
  title: "",
  description: "",
  heroImage: "",
  heroAlt: "Trading script preview",
  typeLabel: "Algorithm",
  industryLabel: "Crypto",
  revenueLabel: "$12k / month",
  purchases: "320",
  views: "4,500",
  creatorName: "",
  creatorAvatar: "",
  creatorFollowers: "8,200",
  creatorTags: "quant, python",
  location: "Remote",
  verificationLabel: "Verified seller",
  compatibility: "TradingView, MetaTrader",
  requirements: "Pro subscription, API access",
  ratingScore: "4.7",
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
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

const ScriptProductForm = ({
  onCreated,
}: {
  onCreated?: (id: string) => void;
}) => {
  const { form, publish, saveDraft, publishing, savingDraft } =
    useProductForm<ScriptProductFormValues>({
      schema: scriptSchema,
      defaultValues,
      table: "script_products",
      buildId: (values) =>
        `${toSlug(values.title || "script") || "script"}-${Math.random().toString(36).slice(2, 6)}`,
      buildPayload: (values) => ({
        title: values.title,
        description: values.description,
        hero_image: values.heroImage,
        hero_alt: values.heroAlt,
        type_label: values.typeLabel,
        industry_label: values.industryLabel,
        revenue_label: values.revenueLabel,
        purchases: values.purchases,
        views: values.views,
        creator_name: values.creatorName,
        creator_avatar: values.creatorAvatar,
        creator_followers: values.creatorFollowers,
        creator_tags: splitList(values.creatorTags),
        location: values.location,
        verification_label: values.verificationLabel,
        compatibility: splitList(values.compatibility),
        requirements: splitList(values.requirements),
        rating_score: values.ratingScore,
        price: values.price ?? null,
      }),
      onCreated,
      getDisplayName: (values) => values.title,
    });

  const values = form.watch();

  const previewData = useMemo(
    () => ({
      title: values.title || "Script title",
      type: values.typeLabel || "",
      revenue: values.revenueLabel || "",
      purchases: values.purchases || "",
      rating: values.ratingScore || "",
      compatibility: splitList(values.compatibility),
      requirements: splitList(values.requirements),
      creator: {
        name: values.creatorName || "Creator",
        followers: values.creatorFollowers || "",
        tags: splitList(values.creatorTags),
      },
    }),
    [values],
  );

  const textField = (
    name: keyof ScriptProductFormValues,
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
            <h3 className="text-lg font-bold text-white">
              {previewData.title}
            </h3>
            <div className="flex flex-wrap gap-2 text-xs font-bold uppercase text-[#B0B0B0]">
              <span>Type: {previewData.type}</span>
              <span>Revenue: {previewData.revenue}</span>
              <span>Purchases: {previewData.purchases}</span>
              <span>Rating: {previewData.rating}</span>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-bold uppercase text-[#B0B0B0]">
              <span>Compatibility:</span>
              {previewData.compatibility.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-[#2E2744] px-2 py-0.5 text-white"
                >
                  {item}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-bold uppercase text-[#B0B0B0]">
              <span>Creator:</span>
              <span className="rounded-full bg-[#2E2744] px-2 py-0.5 text-white">
                {previewData.creator.name}
              </span>
              <span>Followers: {previewData.creator.followers}</span>
            </div>
          </div>
        </FormSection>

        <FormSection title="Product details">
          <div className="grid gap-4 md:grid-cols-2">
            {textField("title", "Product title", "Alpha Grid Bot")}
            {textField("heroImage", "Hero image URL", "https://")}
            {textField("heroAlt", "Hero image alt", "Script preview")}
            {textField("typeLabel", "Type label", "Algorithm")}
            {textField("industryLabel", "Industry label", "Crypto")}
            {textField("revenueLabel", "Revenue label", "$12k / month")}
            {textField("purchases", "Purchases", "320")}
            {textField("views", "Views", "4,500")}
            {textField("ratingScore", "Rating score", "4.7")}
          </div>
        </FormSection>

        <FormSection title="Creator information">
          <div className="grid gap-4 md:grid-cols-2">
            {textField("creatorName", "Creator name", "Alex Morgan")}
            {textField("creatorAvatar", "Creator avatar URL", "https://")}
            {textField("creatorFollowers", "Creator followers", "8,200")}
            {textField("creatorTags", "Creator tags", "quant, python")}
            {textField("location", "Location", "Remote")}
            {textField(
              "verificationLabel",
              "Verification label",
              "Verified seller",
            )}
          </div>
        </FormSection>

        <FormSection title="Content specifics">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase text-[#B0B0B0]">
                  Product description
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Describe functionality, datasets used, outputs, and use cases"
                    className="min-h-[120px] rounded-2xl border border-[#181B22] bg-[#0C101480] p-4 text-sm text-white placeholder:text-[#B0B0B0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A06AFF]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {textField(
            "compatibility",
            "Compatibility (comma separated)",
            "TradingView, MetaTrader",
          )}
          {textField(
            "requirements",
            "Requirements (comma separated)",
            "Pro subscription, API access",
          )}
        </FormSection>

        <FormSection title="Pricing">
          {textField("price", "License price", "$499")}
        </FormSection>

        <FormActions
          onPublish={publish}
          onSaveDraft={saveDraft}
          onPreview={() => {
            window.alert(
              `Script: ${previewData.title}\nRevenue: ${previewData.revenue}\nRating: ${previewData.rating}`,
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

export default ScriptProductForm;
