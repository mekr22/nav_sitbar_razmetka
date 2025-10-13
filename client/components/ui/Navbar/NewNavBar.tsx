import { FC, useState } from "react";
import { useState } from "react";
import type { FC } from "react";
import { NavLink } from "react-router-dom";
import { X } from "lucide-react";
import { LayoutVariant } from "../AppBackground/AppBackground";
import { cn } from "@/lib/utils";
import { navElements, NavElementProps } from "./constants";
import { ChevronDown, DoubleArrow } from "./icons";

interface Props {
  variant?: LayoutVariant;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const NewNavBar: FC<Props> = ({
  variant = "primal",
  mobileOpen = false,
  onMobileClose,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  const toggleGroup = (title: string) =>
    setOpenGroup(openGroup === title ? null : title);

  const renderElement = (
    el: NavElementProps,
    options?: { onNavigate?: () => void },
  ) => {
    if (el.children && el.children.length > 0) {
      const isOpen = openGroup === el.title;
      return (
        <div key={el.title}>
          <button
            onClick={() => toggleGroup(el.title)}
            className={cn(
              "flex items-center justify-between w-full px-3 py-[14px] rounded-lg transition",
            )}
            aria-expanded={isOpen}
            aria-controls={`${el.title}-submenu`}
          >
            <div
              className={cn(
                "flex items-center gap-2 pl-2 hover:text-white hover:border-l-[2px] hover:border-purple overflow-hidden",
                {
                  "text-white border-l-[2px] border-purple": isOpen,
                  "text-[#B0B0B0]": !isOpen,
                  "ml-[5px]": isCollapsed,
                },
              )}
            >
              <div className="size-5 flex-shrink-0">{el.icon}</div>
              <span
                className={cn(
                  "text-[15px] font-semibold whitespace-nowrap transition-all duration-300",
                  {
                    "opacity-0 w-0": isCollapsed,
                    "opacity-100 w-auto": !isCollapsed,
                  },
                )}
              >
                {el.title}
              </span>
            </div>
            {!isCollapsed && (
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform flex-shrink-0",
                  isOpen && "rotate-180",
                )}
              />
            )}
          </button>
          {isOpen && !isCollapsed && (
            <div
              id={`${el.title}-submenu`}
              className="ml-6 flex flex-col gap-1"
            >
              {el.children.map((child) => (
                <NavLink
                  key={child.title}
                  to={child.route ?? "#"}
                  className={cn("px-3")}
                  onClick={options?.onNavigate}
                >
                  {({ isActive }) => (
                    <div
                      className={cn(
                        "flex items-center gap-2 pl-2 py-2 hover:custom-bg-blur hover:text-white hover:border-l-[2px] hover:border-purple overflow-hidden",
                        isActive ? "text-white" : "text-[#B0B0B0]",
                      )}
                    >
                      <div className="size-5 flex-shrink-0">{child.icon}</div>
                      <span
                        className={cn(
                          "text-[15px] font-semibold whitespace-nowrap transition-all duration-300",
                          {
                            "opacity-0 w-0": isCollapsed,
                            "opacity-100 w-auto": !isCollapsed,
                          },
                        )}
                      >
                        {child.title}
                      </span>
                    </div>
                  )}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (el.route) {
      return (
        <NavLink
          key={el.title}
          to={el.route}
          className={cn("px-3 py-[14px]", { "ml-[5px]": isCollapsed })}
          onClick={options?.onNavigate}
        >
          {({ isActive }) => (
            <div
              className={cn(
                "flex items-center gap-2 pl-2 transition hover:text-white hover:border-l-[2px] hover:border-purple overflow-hidden",
                isActive ? "text-white" : "text-[#B0B0B0]",
              )}
            >
              <div className="size-5 flex-shrink-0">{el.icon}</div>
              <span
                className={cn(
                  "text-[15px] font-semibold whitespace-nowrap transition-all duration-300",
                  {
                    "opacity-0 w-0": isCollapsed,
                    "opacity-100 w-auto": !isCollapsed,
                  },
                )}
              >
                {el.title}
              </span>
            </div>
          )}
        </NavLink>
      );
    }

    return (
      <div
        key={el.title}
        className={cn("px-3 py-[14px]", { "ml-[5px]": isCollapsed })}
      >
        <div className="flex items-center gap-2 pl-2 text-[#B0B0B0] hover:text-white hover:border-l-[2px] hover:border-purple overflow-hidden">
          <div className="size-5 flex-shrink-0">{el.icon}</div>
          <span
            className={cn(
              "text-[15px] font-semibold whitespace-nowrap transition-all duration-300",
              {
                "opacity-0 w-0": isCollapsed,
                "opacity-100 w-auto": !isCollapsed,
              },
            )}
          >
            {el.title}
          </span>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="relative mt-8 ml-8 hidden lg:block">
        <div
          className={cn(
            "bg-transparent relative h-fit rounded-[12px] p-[1px] w-fit",
            `bg-[linear-gradient(170.22deg,#523A83_0.01%,rgba(82,58,131,0)_8.28%),linear-gradient(350.89deg,#523A83_0%,rgba(82,58,131,0)_8.04%)]`,
          )}
        >
          <div
            className={cn(
              "flex flex-col py-4 transition-all duration-300 custom-bg-blur rounded-[12px]",
              isCollapsed ? "w-[72px]" : "w-[222px]",
            )}
          >
            <div className="absolute right-[-12px] top-[14px]">
              <button
                className="w-[26px] h-[26px] rounded-[12px] border border-[#181B22] custom-bg-blur hover:bg-[#1E1E1E] flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-md z-20"
                onClick={() => setIsCollapsed(!isCollapsed)}
                aria-label="Toggle compact menu"
                aria-pressed={isCollapsed}
              >
                <DoubleArrow
                  className={cn(
                    "h-4 w-4 transition-transform duration-300",
                    isCollapsed ? "" : "rotate-180",
                  )}
                />
              </button>
            </div>

            <div className="flex flex-col gap-1">
              {navElements.slice(0, 1).map((el) => renderElement(el))}
              <div
                className={cn(
                  "my-[14px] bg-[linear-gradient(90deg,rgba(82,58,131,0)_0%,#523A83_50%,rgba(82,58,131,0)_100%)] mx-auto h-[2px] transition-all duration-300",
                  {
                    "w-[190px]": !isCollapsed,
                    "w-[40px]": isCollapsed,
                  },
                )}
              />
              {navElements.slice(1).map((el) => renderElement(el))}
            </div>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "fixed inset-0 z-40 flex lg:hidden",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-black/60 transition-opacity",
            mobileOpen ? "opacity-100" : "opacity-0",
          )}
          onClick={onMobileClose}
        />
        <div
          id="mobile-navigation"
          className={cn(
            "relative z-10 flex h-full w-[280px] max-w-[85%] flex-col gap-5 bg-[#0C1014]/95 p-5 backdrop-blur-xl transition-transform duration-300 ease-in-out",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold uppercase text-[#B0B0B0]">
              Menu
            </span>
            <button
              type="button"
              onClick={onMobileClose}
              aria-label="Close navigation"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#181B22] bg-[#0C1014]/60 text-white transition-colors hover:border-[#1F2230]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="h-px w-full bg-[#181B22]" />
          <div className="flex-1 overflow-y-auto pr-2">
            <div className="flex flex-col gap-1">
              {navElements.map((el) =>
                renderElement(el, { onNavigate: onMobileClose }),
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewNavBar;
