import { FC, Dispatch, SetStateAction } from "react";
import { Menu } from "lucide-react";
import RightBarButton from "../RightBar/RightBarButton";
import { AnimatedLogo } from "../AnimatedLogo/AnimatedLogo";
import { AvatarDropdown } from "../AvatarDropdown/AvatarDropdown";

interface HeaderProps {
  rightMenuOpen?: boolean;
  setRightMenuOpen?: Dispatch<SetStateAction<boolean>>;
  onMobileNavToggle?: () => void;
  mobileNavOpen?: boolean;
}

export const Header: FC<HeaderProps> = ({
  rightMenuOpen = false,
  setRightMenuOpen,
  onMobileNavToggle,
  mobileNavOpen = false,
}) => {
  return (
    <header className="mb-6 flex w-full items-center justify-between gap-2 bg-background pb-1 pl-5 pr-5 pt-3 sm:pl-6 sm:pr-6 md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:justify-between md:pl-[30px] md:pr-[24px]">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMobileNavToggle}
          aria-label="Open navigation"
          aria-expanded={mobileNavOpen}
          aria-controls="mobile-navigation"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#181B22] bg-[#0C1014]/60 text-white transition-colors hover:border-[#1F2230] md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="shrink md:min-w-[230px] md:justify-self-start">
          <AnimatedLogo />
        </div>
      </div>

      {/* Center: Search + Assistant (desktop) */}
      <div className="hidden items-center gap-4 justify-self-center md:flex">
        <div className="flex items-center gap-2 h-10 px-4 rounded-3xl border border-[#A06AFFCC] backdrop-blur-[50px] w-full max-w-[256px]">
          <svg
            className="w-6 h-6 flex-shrink-0"
            width="25"
            height="24"
            viewBox="0 0 25 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 21C17.2467 21 21.5 16.7467 21.5 11.5C21.5 6.25329 17.2467 2 12 2C6.75329 2 2.5 6.25329 2.5 11.5C2.5 16.7467 6.75329 21 12 21Z"
              stroke="#C2C2C2"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M22.5 22L20.5 20"
              stroke="#C2C2C2"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <input
            className="bg-transparent text-[#C2C2C2] text-[15px] font-bold placeholder:text-[#C2C2C2] outline-none w-full"
            placeholder="Search (Ctrl + K)"
          />
        </div>
        <a
          href={"https://aihelp.tyriantrade.com/"}
          target="_blank"
          rel="noreferrer"
          className="flex gap-[6px] items-center"
          aria-label="Open AI Assistant"
        >
          <div className="p-[1px] rounded-[4px] bg-gradient-to-r from-[#A06AFF] via-[#9155FF] to-[#482090] size-[32px] flex items-center justify-center">
            <div className="bg-black rounded-[4px] size-[30px] flex items-center justify-center">
              <div className="rounded-[3px] bg-background text-white flex items-center justify-center text-sm font-bold w-full h-full">
                AI
              </div>
            </div>
          </div>
          <span className="font-medium text-[15px] text-white">Assistant</span>
        </a>
      </div>

      {/* Right actions */}
      <div className="ml-auto flex items-center gap-4 justify-end md:ml-0 md:max-w-[350px] md:justify-self-end">
        <AvatarDropdown />
        {setRightMenuOpen && (
          <RightBarButton
            isCollapsed={rightMenuOpen}
            setIsCollapsed={setRightMenuOpen}
          />
        )}
      </div>
    </header>
  );
};
