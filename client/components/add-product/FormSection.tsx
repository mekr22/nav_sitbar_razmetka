import { type FC, type ReactNode } from "react";

import { cn } from "@/lib/utils";

interface FormSectionProps {
  title: string;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
  headerActions?: ReactNode;
}

const FormSection: FC<FormSectionProps> = ({
  title,
  description,
  children,
  className,
  headerActions,
}) => {
  return (
    <section
      className={cn(
        "flex flex-col overflow-hidden rounded-3xl border border-[#181B22] bg-[#0C101480] backdrop-blur-[50px]",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3 border-b border-[#181B22] p-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-[19px] font-bold text-white">{title}</h2>
          {description ? (
            <p className="text-sm font-medium text-[#B0B0B0]">{description}</p>
          ) : null}
        </div>
        {headerActions ? (
          <div className="flex items-center gap-2">{headerActions}</div>
        ) : null}
      </div>
      <div className="flex flex-col gap-4 p-4">{children}</div>
    </section>
  );
};

export default FormSection;
