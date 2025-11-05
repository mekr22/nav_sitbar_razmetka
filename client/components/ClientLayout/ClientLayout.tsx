import { FC, ReactNode, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { AppBackground } from "../ui/AppBackground/AppBackground";
import { Header } from "../ui/Header/Header";
import ContentWrapper from "../ui/ContentWrapper/ContentWrapper";
import Footer from "../ui/Footer/Footer";
import { LayoutVariant } from "../ui/AppBackground/AppBackground";
import NewNavBar from "../ui/Navbar/NewNavBar";
import { RightMenu } from "../ui/RightMenu/RightMenu";

const PagesBg: Record<LayoutVariant, string[]> = {
  primal: [""],
  secondary: [
    "settings",
    "dashboard",
    "security",
    "notifications",
    "kyc",
    "billing",
    "referrals",
    "api",
    "profile_settings",
  ],
};

interface Props {
  children: ReactNode;
  contentWrapperClassname?: string;
}

export const ClientLayout: FC<Props> = ({
  children,
  contentWrapperClassname,
}) => {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);
  const currentPage = segments[segments.length - 1] || "";
  const layoutVariant: LayoutVariant = PagesBg.secondary.includes(currentPage)
    ? "secondary"
    : "primal";
  const [rightMenuOpen, setRightMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const shouldLockScroll =
      window.innerWidth < 1024 && (mobileNavOpen || rightMenuOpen);
    document.body.style.overflow = shouldLockScroll ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileNavOpen, rightMenuOpen]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (rightMenuOpen && window.innerWidth < 1024) {
      setMobileNavOpen(false);
    }
  }, [rightMenuOpen]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (mobileNavOpen && window.innerWidth < 1024) {
      setRightMenuOpen(false);
    }
  }, [mobileNavOpen]);

  useEffect(() => {
    const handleTouchStart = (event: TouchEvent) => {
      if (window.innerWidth > 640 || event.touches.length !== 1) {
        touchStartRef.current = null;
        return;
      }

      const touch = event.touches[0];

      if (!mobileNavOpen && touch.clientX > 32) {
        touchStartRef.current = null;
        return;
      }

      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (window.innerWidth > 640 || event.touches.length !== 1) {
        return;
      }

      if (!touchStartRef.current) {
        return;
      }

      const touch = event.touches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);

      if (deltaY > 40) {
        touchStartRef.current = null;
        return;
      }

      if (!mobileNavOpen && touchStartRef.current.x <= 32 && deltaX > 70) {
        setMobileNavOpen(true);
        touchStartRef.current = null;
      } else if (mobileNavOpen && deltaX < -70) {
        setMobileNavOpen(false);
        touchStartRef.current = null;
      }
    };

    const handleTouchEnd = () => {
      touchStartRef.current = null;
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [mobileNavOpen]);

  return (
    <AppBackground variant={layoutVariant}>
      <Header
        rightMenuOpen={rightMenuOpen}
        setRightMenuOpen={setRightMenuOpen}
        onMobileNavToggle={() => setMobileNavOpen(true)}
        mobileNavOpen={mobileNavOpen}
      />
      <div className="flex justify-start gap-6">
        <NewNavBar
          variant={layoutVariant}
          mobileOpen={mobileNavOpen}
          onMobileClose={() => setMobileNavOpen(false)}
        />
        <main className="flex-1">
          <ContentWrapper className={contentWrapperClassname}>
            {children}
          </ContentWrapper>
        </main>
        <RightMenu
          isCollapsed={rightMenuOpen}
          onClose={() => setRightMenuOpen(false)}
        />
      </div>
      <Footer />
    </AppBackground>
  );
};
