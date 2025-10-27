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

const otherSchema = z.object({
  title: z.string().min(2, "Enter product title"),
  description: z.string().min(1, "Provide description"),
  image: z.string().url("Enter a valid image URL"),
  imageAlt: z.string().min(1, "Provide image alt"),
  label: z.string().min(1, "Provide label"),
  location: z.string().min(1, "Provide location"),
  rating: z.string().min(1, "Provide rating"),
  ratingTag: z.string().min(1, "Provide rating tag"),
  typeLabel: z.string().min(1, "Provide type"),
  industryLabel: z.string().min(1, "Provide industry"),
  compatibility: z.string().min(1, "Provide compatibility"),
  requirements: z.string().min(1, "Provide requirements"),
  price: z.string().optional(),
});

export type OtherProductFormValues = z.infer<typeof otherSchema>;

const defaultValues: OtherProductFormValues = {
  title: "",
  description: "",
  image: "",
  imageAlt: "Product preview",
  label: "Service",
  location: "Remote",
  rating: "4.8",
  ratingTag: "Top rated",
  typeLabel: "Consultancy",
  industryLabel: "Financial",
  compatibility: "Small business, Enterprise",
  requirements: "KYC, Onboarding call",
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

const OtherProductForm = ({
  onCreated,
}: {
  onCreated?: (id: string) => void;
}) => {
  const { form, publish, saveDraft, publishing, savingDraft } =
    useProductForm<OtherProductFormValues>({
      schema: otherSchema,
      defaultValues,
      table: "other_products",
      buildId: (values) =>
        `${toSlug(values.title || "product") || "product"}-${Math.random().toString(36).slice(2, 6)}`,
      buildPayload: (values) => ({
        title: values.title,
        description: values.description,
        image: values.image,
        image_alt: values.imageAlt,
        label: values.label,
        location: values.location,
        rating: values.rating,
        rating_tag: values.ratingTag,
        type_label: values.typeLabel,
        industry_label: values.industryLabel,
        compatibility: splitList(values.compatibility),
        requirements: splitList(values.requirements),
        price: values.price ?? null,
      }),
      onCreated,
      getDisplayName: (values) => values.title,
    });

  const values = form.watch();

  const previewData = useMemo(
    () => ({
      title: values.title || "Product title",
      label: values.label || "",
      rating: values.rating || "",
      ratingTag: values.ratingTag || "",
      type: values.typeLabel || "",
      industry: values.industryLabel || "",
      location: values.location || "",
      compatibility: splitList(values.compatibility),
    }),
    [values],
  );

  const textField = (
    name: keyof OtherProductFormValues,
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
              <span>{previewData.label}</span>
              <span>Rating: {previewData.rating}</span>
              <span>{previewData.ratingTag}</span>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-bold uppercase text-[#B0B0B0]">
              <span>Type: {previewData.type}</span>
              <span>Industry: {previewData.industry}</span>
              <span>Location: {previewData.location}</span>
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
          </div>
        </FormSection>

        <FormSection title="Product information">
          <div className="grid gap-4 md:grid-cols-2">
            {textField("title", "Title", "Full-service market research")}
            {textField("image", "Image URL", "https://")}
            {textField("imageAlt", "Image alt", "Service preview")}
            {textField("label", "Label", "Service")}
            {textField("location", "Location", "Remote")}
            {textField("rating", "Rating", "4.8")}
            {textField("ratingTag", "Rating tag", "Top rated")}
            {textField("typeLabel", "Type label", "Consultancy")}
            {textField("industryLabel", "Industry label", "Financial")}
          </div>
        </FormSection>

        <FormSection title="Description">
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
                    placeholder="Describe offering, target clients, value proposition"
                    className="min-h-[120px] rounded-2xl border border-[#181B22] bg-[#0C101480] p-4 text-sm text-white placeholder:text-[#B0B0B0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A06AFF]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        <FormSection title="Compatibility & requirements">
          {textField(
            "compatibility",
            "Compatibility (comma separated)",
            "Small business, Enterprise",
          )}
          {textField(
            "requirements",
            "Requirements (comma separated)",
            "KYC, Onboarding call",
          )}
        </FormSection>

        <FormSection title="Pricing">
          {textField("price", "Price", "$999")}
        </FormSection>

        <FormActions
          onPublish={publish}
          onSaveDraft={saveDraft}
          onPreview={() => {
            window.alert(
              `Product: ${previewData.title}\nRating: ${previewData.rating}\nType: ${previewData.type}`,
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

export default OtherProductForm;
