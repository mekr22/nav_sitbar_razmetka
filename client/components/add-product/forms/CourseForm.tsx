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

const courseSchema = z.object({
  title: z.string().min(2, "Enter course title"),
  subtitle: z.string().min(2, "Provide subtitle"),
  image: z.string().url("Enter a valid image URL"),
  host: z.string().min(1, "Provide host name"),
  students: z.string().min(1, "Provide student count"),
  rating: z.string().min(1, "Provide rating"),
  duration: z.string().min(1, "Provide duration"),
  lectures: z.string().min(1, "Provide number of lectures"),
  level: z.string().min(1, "Provide level"),
  levelCategory: z.enum(["beginner", "intermediate", "advanced", "all"]),
  materialType: z.enum(["course", "training"]),
  releaseWindow: z.enum(["24h", "7d", "30d"]),
  format: z.enum(["video", "ebook", "live"]),
  focusArea: z.enum(["stocks", "forex", "crypto", "options", "macro", "futures"]),
  language: z.enum(["english", "spanish", "german"]),
  description: z.string().optional(),
  price: z.string().optional(),
});

export type CourseFormValues = z.infer<typeof courseSchema>;

const defaultValues: CourseFormValues = {
  title: "",
  subtitle: "",
  image: "",
  host: "",
  students: "1,200",
  rating: "4.8",
  duration: "12h",
  lectures: "42",
  level: "Intermediate",
  levelCategory: "intermediate",
  materialType: "course",
  releaseWindow: "7d",
  format: "video",
  focusArea: "stocks",
  language: "english",
  description: "",
  price: "",
};

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

const CourseForm = ({ onCreated }: { onCreated?: (id: string) => void }) => {
  const { form, publish, saveDraft, publishing, savingDraft } = useProductForm<CourseFormValues>({
    schema: courseSchema,
    defaultValues,
    table: "courses",
    buildId: (values) => `${toSlug(values.title || "course") || "course"}-${Math.random().toString(36).slice(2, 6)}`,
    buildPayload: (values) => ({
      title: values.title,
      subtitle: values.subtitle,
      image: values.image,
      host: values.host,
      students: values.students,
      rating: values.rating,
      duration: values.duration,
      lectures: values.lectures,
      level: values.level,
      level_category: values.levelCategory,
      material_type: values.materialType,
      release_window: values.releaseWindow,
      format: values.format,
      focus_area: values.focusArea,
      language: values.language,
      description: values.description ?? null,
      price: values.price ?? null,
    }),
    onCreated,
    getDisplayName: (values) => values.title,
  });

  const values = form.watch();

  const previewData = useMemo(
    () => ({
      title: values.title || "Course title",
      subtitle: values.subtitle || "Subheading",
      host: values.host || "",
      rating: values.rating || "",
      students: values.students || "",
      duration: values.duration || "",
      lectures: values.lectures || "",
      level: values.level || "",
      format: values.format,
    }),
    [values],
  );

  const textField = (
    name: keyof CourseFormValues,
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

  const selectField = <K extends keyof CourseFormValues>(
    name: K,
    label: string,
    options: ReadonlyArray<CourseFormValues[K]>,
  ) => (
    <FormField
      key={name as string}
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-xs font-bold uppercase text-[#B0B0B0]">{label}</FormLabel>
          <Select onValueChange={field.onChange} value={field.value as string}>
            <FormControl>
              <SelectTrigger className="h-11 rounded-full border border-[#181B22] bg-[#0C101480] px-6 text-[15px] text-white">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="bg-[#0C1014] text-white">
              {options.map((option) => (
                <SelectItem key={String(option)} value={String(option)}>
                  {String(option)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
            <h3 className="text-lg font-bold text-white">{previewData.title}</h3>
            <p className="text-sm font-medium text-[#B0B0B0]">{previewData.subtitle}</p>
            <div className="flex flex-wrap gap-2 text-xs font-bold uppercase text-[#B0B0B0]">
              <span>Host: {previewData.host}</span>
              <span>Students: {previewData.students}</span>
              <span>Rating: {previewData.rating}</span>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-bold uppercase text-[#B0B0B0]">
              <span>Duration: {previewData.duration}</span>
              <span>Lectures: {previewData.lectures}</span>
              <span>Level: {previewData.level}</span>
              <span>Format: {previewData.format}</span>
            </div>
          </div>
        </FormSection>

        <FormSection title="Course basics">
          <div className="grid gap-4 md:grid-cols-2">
            {textField("title", "Course title", "Complete Options Trading Bootcamp")}
            {textField("subtitle", "Subtitle", "Master options strategies in 30 days")}
            {textField("image", "Hero image URL", "https://")}
            {textField("host", "Host", "Olivia Harris")}
            {textField("students", "Students", "1,200")}
            {textField("rating", "Rating", "4.8")}
            {textField("duration", "Duration", "12h")}
            {textField("lectures", "Lectures", "42")}
            {textField("level", "Level", "Intermediate")}
          </div>
        </FormSection>

        <FormSection title="Categorization">
          <div className="grid gap-4 md:grid-cols-2">
            {selectField("levelCategory", "Level category", ["beginner", "intermediate", "advanced", "all"])}
            {selectField("materialType", "Material type", ["course", "training"])}
            {selectField("releaseWindow", "Release window", ["24h", "7d", "30d"])}
            {selectField("format", "Format", ["video", "ebook", "live"])}
            {selectField("focusArea", "Focus area", ["stocks", "forex", "crypto", "options", "macro", "futures"])}
            {selectField("language", "Language", ["english", "spanish", "german"])}
          </div>
        </FormSection>

        <FormSection title="Description">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase text-[#B0B0B0]">
                  Course description
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Explain course outcomes, modules, and requirements"
                    className="min-h-[120px] rounded-2xl border border-[#181B22] bg-[#0C101480] p-4 text-sm text-white placeholder:text-[#B0B0B0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A06AFF]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        <FormSection title="Pricing">
          {textField("price", "Enrollment price", "$249")}
        </FormSection>

        <FormActions
          onPublish={publish}
          onSaveDraft={saveDraft}
          onPreview={() => {
            window.alert(
              `Course: ${previewData.title}\nDuration: ${previewData.duration}\nRating: ${previewData.rating}`,
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

export default CourseForm;
