import { FC } from 'react';
import { Database, TrendingUp, MessageCircle, Video, ShoppingCart, Briefcase, Sparkles, BarChart3 } from 'lucide-react';

const Footer: FC = () => {
  return (
    <footer className="mx-[38px] rounded-t-[48px] border-t-2 border-r-2 border-l-2 border-[#181B22] bg-[#0C101480] px-6 pb-12 pt-12 backdrop-blur-[32px] sm:px-12 lg:px-[310px] lg:pt-12">
      <div className="flex w-full flex-col gap-6">
        {/* Logo and Title */}
        <div className="flex items-center gap-2">
          <svg width="28" height="33" viewBox="0 0 28 33" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_footer)">
              <path fillRule="evenodd" clipRule="evenodd" d="M0 16.4905L0.0012947 16.5883C3.08952 15.955 6.19422 15.2936 9.30464 14.6309L9.31038 30.3517L19.7747 32.5C19.7747 29.0478 19.7423 19.3225 19.7765 15.8712L12.4543 14.3681L11.4797 14.1682C16.955 13.0046 22.4401 11.8564 27.876 10.8678L27.8742 0.5C18.6809 2.38675 9.22271 4.61696 0 6.22091L0 16.4905Z" fill="url(#paint0_linear_footer)"/>
            </g>
            <defs>
              <linearGradient id="paint0_linear_footer" x1="6.76989" y1="34.9" x2="18.8103" y2="2.53481" gradientUnits="userSpaceOnUse">
                <stop stopColor="#181A20"/>
                <stop offset="1" stopColor="#A06AFF"/>
              </linearGradient>
              <clipPath id="clip0_footer">
                <rect width="27.876" height="32" fill="white" transform="translate(0 0.5)"/>
              </clipPath>
            </defs>
          </svg>
          <h3 className="text-2xl font-bold text-white">Tyrian Trade</h3>
        </div>

        {/* Main Content Grid */}
        <div className="flex flex-col gap-12 xl:grid xl:grid-cols-[minmax(0,2fr)_minmax(220px,1fr)_minmax(220px,1fr)] xl:items-start xl:gap-12">
          {/* Products Section */}
          <div className="flex min-w-full flex-col gap-2.5 xl:min-w-[360px] xl:flex-[1.5]">
            <h4 className="text-lg font-bold text-[#A06AFF] sm:text-[19px]">Products</h4>
            <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              <a href="#" className="flex items-center gap-2.5 rounded py-2 text-sm font-bold text-white transition-colors hover:text-[#A06AFF] sm:text-[15px]">
                <Database className="h-6 w-6" />
                <span>Cryptocurrency</span>
              </a>
              <a href="#" className="flex items-center gap-2.5 rounded py-2 text-sm font-bold text-white transition-colors hover:text-[#A06AFF] sm:text-[15px]">
                <TrendingUp className="h-6 w-6" />
                <span>Trading Terminal</span>
              </a>
              <a href="#" className="flex items-center gap-2.5 rounded py-2 text-sm font-bold text-white transition-colors hover:text-[#A06AFF] sm:text-[15px]">
                <MessageCircle className="h-6 w-6" />
                <span>Social Network</span>
              </a>
              <a href="#" className="flex items-center gap-2.5 rounded py-2 text-sm font-bold text-white transition-colors hover:text-[#A06AFF] sm:text-[15px]">
                <Video className="h-6 w-6" />
                <span>Live Streaming</span>
              </a>
              <a href="#" className="flex items-center gap-2.5 rounded py-2 text-sm font-bold text-white transition-colors hover:text-[#A06AFF] sm:text-[15px]">
                <ShoppingCart className="h-6 w-6" />
                <span>Marketplace</span>
              </a>
              <a href="#" className="flex items-center gap-2.5 rounded py-2 text-sm font-bold text-white transition-colors hover:text-[#A06AFF] sm:text-[15px]">
                <Briefcase className="h-6 w-6" />
                <span>Portfolios</span>
              </a>
              <a href="#" className="flex items-center gap-2.5 rounded py-2 text-sm font-bold text-white transition-colors hover:text-[#A06AFF] sm:text-[15px]">
                <Sparkles className="h-6 w-6" />
                <span>AI Assistant</span>
              </a>
              <a href="#" className="flex items-center gap-2.5 rounded py-2 text-sm font-bold text-white transition-colors hover:text-[#A06AFF] sm:text-[15px]">
                <BarChart3 className="h-6 w-6" />
                <span>Stock Market</span>
              </a>
            </div>
          </div>

          {/* Resources Section */}
          <div className="flex w-full flex-col gap-5 xl:flex-1 xl:min-w-[240px] xl:max-w-[320px]">
            <h4 className="text-lg font-bold text-[#A06AFF] sm:text-[19px]">Resources</h4>
            <a href="#" className="text-sm font-bold text-white transition-colors hover:text-[#A06AFF] sm:text-[15px]">
              AI
            </a>
          </div>

          {/* Social Section */}
          <div className="flex w-full flex-col gap-5 xl:min-w-[220px]">
            <h4 className="text-lg font-bold text-[#A06AFF] sm:text-[19px]">Social</h4>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <a href="#" className="text-sm font-bold text-white transition-colors hover:text-[#A06AFF] sm:text-[15px]">
                X/Twitter
              </a>
              <a href="#" className="text-sm font-bold text-white transition-colors hover:text-[#A06AFF] sm:text-[15px]">
                LinkedIn
              </a>
              <a href="#" className="text-sm font-bold text-white transition-colors hover:text-[#A06AFF] sm:text-[15px]">
                Instagram
              </a>
              <a href="#" className="text-sm font-bold text-white transition-colors hover:text-[#A06AFF] sm:text-[15px]">
                Youtube
              </a>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="flex items-start justify-start">
          <p className="text-left text-sm font-normal leading-normal text-[#B0B0B0] sm:text-[15px]">
            Trading cryptocurrencies and financial instruments involves high risk and may result in losses exceeding your initial investment. All content on this website is for informational and educational purposes only and does not constitute financial advice. Prices and data may be inaccurate or delayed. TTYRIAN TRADE and its partners are not liable for any losses from using this website. Always do your own research and consult a professional if needed. Past performance is not a guarantee of future results. Trading on margin increases risk. Use of site content is prohibited without prior written consent. TTYRIAN TRADE may receive compensation from advertisers.
          </p>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-[#181B22]" />

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm font-bold text-[#B0B0B0] sm:text-[15px]">
            © 2025 - TTYRIAN TRADE - FZCO. All Rights Reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="#" className="text-sm font-bold text-[#B0B0B0] transition-colors hover:text-white sm:text-[15px]">
              House Rules
            </a>
            <div className="h-5 w-px bg-[#313338]" />
            <a href="#" className="text-sm font-bold text-[#B0B0B0] transition-colors hover:text-white sm:text-[15px]">
              Terms and Conditions
            </a>
            <div className="h-5 w-px bg-[#313338]" />
            <a href="#" className="text-sm font-bold text-[#B0B0B0] transition-colors hover:text-white sm:text-[15px]">
              Privacy Policy
            </a>
            <div className="h-5 w-px bg-[#313338]" />
            <a href="#" className="text-sm font-bold text-[#B0B0B0] transition-colors hover:text-white sm:text-[15px]">
              Risk Warning
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
