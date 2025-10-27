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

const consultantSchema = z.object({
  name: z.string().min(2, "Enter consultant name"),
  credentials: z.string().min(1, "Provide credentials"),
  avatar: z.string().url("Enter a valid avatar URL"),
  company: z.string().min(1, "Specify company"),
  location: z.string().min(1, "Provide location"),
  nationwide: z.boolean().default(false),
  description: z.string().min(1, "Describe services"),
  clients: z.string().min(1, "Enter number of clients"),
  riskLevel: z.string().min(1, "Provide risk level"),
  aum: z.string().min(1, "Provide assets under management"),
  portfolioReturn: z.string().min(1, "Provide portfolio return"),
  featured: z.boolean().default(false),
  offer: z.string().optional(),
  price: z.string().optional(),
});

export type InvestmentConsultantFormValues = z.infer<typeof consultantSchema>;

const defaultValues: InvestmentConsultantFormValues = {
  name: "",
  credentials: "CFA",
  avatar: "",
  company: "",
  location: "New York, USA",
  nationwide: true,
  description: "",
  clients: "120",
  riskLevel: "Balanced",
  aum: "$50M",
  portfolioReturn: "+18%",
  featured: false,
  offer: "",
  price: "",
};

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

const InvestmentConsultantForm = ({
  onCreated,
}: {
  onCreated?: (id: string) => void;
}) => {
  const { form, publish, saveDraft, publishing, savingDraft } =
    useProductForm<InvestmentConsultantFormValues>({
      schema: consultantSchema,
      defaultValues,
      table: "investment_consultants",
      buildId: (values) =>
        `${toSlug(values.name || "consultant") || "consultant"}-${Math.random().toString(36).slice(2, 6)}`,
      buildPayload: (values) => ({
        name: values.name,
        credentials: values.credentials,
        avatar: values.avatar,
        company: values.company,
        location: values.location,
        nationwide: values.nationwide,
        description: values.description,
        clients: values.clients,
        risk_level: values.riskLevel,
        aum: values.aum,
        portfolio_return: values.portfolioReturn,
        featured: values.featured,
        offer: values.offer ?? null,
        price: values.price ?? null,
      }),
      onCreated,
      getDisplayName: (values) => values.name,
    });

  const values = form.watch();

  const previewData = useMemo(
    () => ({
      name: values.name || "Consultant name",
      company: values.company || "",
      credentials: values.credentials || "",
      location: values.location || "",
      clients: values.clients || "",
      risk: values.riskLevel || "",
      aum: values.aum || "",
      portfolioReturn: values.portfolioReturn || "",
      featured: values.featured,
      nationwide: values.nationwide,
    }),
    [values],
  );

  type ConsultantTextFieldName = Exclude<
    keyof InvestmentConsultantFormValues,
    "nationwide" | "featured"
  >;

  const textField = (
    name: ConsultantTextFieldName,
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
                <p className="text-xs font-bold uppercase text-[#B0B0B0]">Consultant preview</p>
                <h3 className="text-lg font-bold text-white">{previewData.name}</h3>
                <p className="text-sm font-medium text-[#B0B0B0]">
                  {previewData.credentials} · {previewData.company}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-[#2E2744] px-3 py-1 text-xs font-bold text-white">
                  Clients: {previewData.clients}
                </span>
                <span className="rounded-full bg-[#1C3430] px-3 py-1 text-xs font-bold uppercase text-[#2EBD85]">
                  Portfolio: {previewData.portfolioReturn}
                </span>
              </div>
            </div>
            <div className="flex gap-2 text-xs font-bold uppercase text-[#B0B0B0]">
              <span>Location: {previewData.location}</span>
              {previewData.nationwide ? <span>Nationwide</span> : null}
            </div>
            <div className="flex gap-2 text-xs font-bold uppercase text-[#B0B0B0]">
              <span>Risk profile: {previewData.risk}</span>
              <span>AUM: {previewData.aum}</span>
            </div>
            {previewData.featured ? (
              <span className="w-fit rounded-full bg-[#523A83] px-3 py-1 text-xs font-bold text-white">
                Featured consultant
              </span>
            ) : null}
          </div>
        </FormSection>

        <FormSection title="Consultant profile">
          <div className="grid gap-4 md:grid-cols-2">
            {textField("name", "Full name", "Olivia Johnson")}
            {textField("credentials", "Credentials", "CFA, CFP")}
            {textField("avatar", "Avatar URL", "https://")}
            {textField("company", "Company", "Summit Advisors")}
            {textField("location", "Location", "New York, USA")}
            {textField("clients", "Clients", "120")}
            {textField("riskLevel", "Risk level", "Balanced")}
            {textField("aum", "Assets under management", "$50M")}
            {textField("portfolioReturn", "Portfolio return", "+18%")}
          </div>
        </FormSection>

        <FormSection title="Service description">
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
                    placeholder="Describe advisory services, investment focus, onboarding requirements"
                    className="min-h-[120px] rounded-2xl border border-[#181B22] bg-[#0C101480] p-4 text-sm text-white placeholder:text-[#B0B0B0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A06AFF]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {textField("offer", "Special offer", "Free portfolio audit")}
        </FormSection>

        <FormSection title="Visibility">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="nationwide"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between gap-2">
                  <div className="flex flex-col">
                    <FormLabel className="text-xs font-bold uppercase text-[#B0B0B0]">
                      Nationwide coverage
                    </FormLabel>
                    <span className="text-sm font-medium text-[#B0B0B0]">
                      Consultant works with clients across all regions
                    </span>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between gap-2">
                  <div className="flex flex-col">
                    <FormLabel className="text-xs font-bold uppercase text-[#B0B0B0]">
                      Featured consultant
                    </FormLabel>
                    <span className="text-sm font-medium text-[#B0B0B0]">
                      Highlight in marketplace listings
                    </span>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </FormSection>

        <FormSection title="Pricing">
          {textField("price", "Consultation price", "$249 / hour")}
        </FormSection>

        <FormActions
          onPublish={publish}
          onSaveDraft={saveDraft}
          onPreview={() => {
            window.alert(
              `Consultant: ${previewData.name}\nClients: ${previewData.clients}\nPortfolio return: ${previewData.portfolioReturn}`,
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

export default InvestmentConsultantForm;
