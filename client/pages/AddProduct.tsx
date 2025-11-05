import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  PRODUCT_TYPE_OPTIONS,
  type ProductFormKey,
} from "@/components/add-product/productTypeOptions";
import SignalForm from "@/components/add-product/forms/SignalForm";
import StrategyForm from "@/components/add-product/forms/StrategyForm";
import TradingRobotForm from "@/components/add-product/forms/TradingRobotForm";
import AnalystForm from "@/components/add-product/forms/AnalystForm";
import InvestmentConsultantForm from "@/components/add-product/forms/InvestmentConsultantForm";
import TraderForm from "@/components/add-product/forms/TraderForm";
import CourseForm from "@/components/add-product/forms/CourseForm";
import ScriptProductForm from "@/components/add-product/forms/ScriptProductForm";
import OtherProductForm from "@/components/add-product/forms/OtherProductForm";
import { cn } from "@/lib/utils";

const FORM_COMPONENTS: Record<
  ProductFormKey,
  (props: { onCreated?: (id: string) => void }) => JSX.Element
> = {
  signal: SignalForm,
  strategy: StrategyForm,
  "trading-robot": TradingRobotForm,
  analyst: AnalystForm,
  "investment-consultant": InvestmentConsultantForm,
  trader: TraderForm,
  course: CourseForm,
  script: ScriptProductForm,
  other: OtherProductForm,
};

const AddProduct = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<ProductFormKey>("signal");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [lastCreatedId, setLastCreatedId] = useState<string | null>(null);

  const SelectedForm = FORM_COMPONENTS[selectedType];
  const selectedOption = PRODUCT_TYPE_OPTIONS.find(
    (option) => option.value === selectedType,
  );

  return (
    <div className="mx-auto flex w-full max-w-[1075px] flex-col gap-6 px-3 pb-20 sm:px-4">
      <div className="flex items-center gap-2 text-[15px]">
        <button
          type="button"
          onClick={() => navigate("/marketplace/my-products")}
          className="font-medium text-[#B0B0B0] hover:text-white"
        >
          Marketplace
        </button>
        <span className="font-bold text-[#808283]">/</span>
        <span className="font-bold text-white">Creating new product</span>
      </div>

      <div className="relative">
        <div
          className={cn(
            "relative flex flex-col gap-4 rounded-3xl border border-[#181B22] bg-[#0C101480] p-4 backdrop-blur-[50px]",
            dropdownOpen && "z-20",
          )}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-white">
                Creating new product
              </h1>
              {selectedOption?.description ? (
                <p className="text-sm font-medium text-[#B0B0B0]">
                  {selectedOption.description}
                </p>
              ) : null}
            </div>
            {lastCreatedId ? (
              <span className="rounded-full bg-[#1C3430] px-3 py-1 text-xs font-bold uppercase text-[#2EBD85]">
                Last created ID: {lastCreatedId}
              </span>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase text-[#B0B0B0]">
              Choose product type
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex h-11 w-full items-center justify-between rounded-full border border-[#181B22] bg-[#0C101480] px-6 text-left text-[15px] font-bold text-white backdrop-blur-[50px]"
              >
                <span>{selectedOption?.label ?? "Select"}</span>
                <ChevronDown className="h-6 w-6 text-white" />
              </button>
              {dropdownOpen ? (
                <div className="absolute left-0 right-0 top-full mt-2 flex max-h-[360px] flex-col gap-0 overflow-hidden overflow-y-auto rounded-[26px] border border-[#181B22] bg-[#0B0E11]/95 p-3 shadow-[24px_48px_48px_0_rgba(0,0,0,0.64)] backdrop-blur-[50px]">
                  {PRODUCT_TYPE_OPTIONS.map((option) => {
                    const isActive = option.value === selectedType;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setSelectedType(option.value);
                          setDropdownOpen(false);
                        }}
                        className={cn(
                          "flex items-center justify-between gap-3 rounded-full px-5 py-3 text-left text-[15px] font-bold text-white transition-colors",
                          isActive ? "bg-[#523A83]" : "hover:bg-[#523A83]",
                        )}
                      >
                        <span>{option.label}</span>
                        {isActive ? <Check className="h-4 w-4" /> : null}
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <SelectedForm
        onCreated={(id) => {
          setLastCreatedId(id);
        }}
      />
    </div>
  );
};

export default AddProduct;
