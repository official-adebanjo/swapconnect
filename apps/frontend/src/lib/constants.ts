/**
 * Application Constants
 */

export const APP_NAME = "SwapConnect";

export const CLOUDINARY_BASE_URL =
  "https://res.cloudinary.com/ds83mhjcm/image/upload";

export const ASSETS = {
  LOGO: `${CLOUDINARY_BASE_URL}/v1769164250/SwapConnect/logo_b4jtho.webp`,
  FAVICON: `${CLOUDINARY_BASE_URL}/v1719573356/SwapConnect/favicon-logo_bci2ur.png`,
  MENU_ICON: `${CLOUDINARY_BASE_URL}/v1747647290/SwapConnect/menu-icon_hh6lo7.svg`,
  CANCEL_ICON: `${CLOUDINARY_BASE_URL}/v1747647290/SwapConnect/menu-cancel-icon_mzesfv.svg`,
  SIGNUP_IMG: `${CLOUDINARY_BASE_URL}/v1720707824/SwapConnect/auth/signup_img_bty689.png`,
  LOGIN_IMG: `${CLOUDINARY_BASE_URL}/v1720707824/SwapConnect/auth/login-img_brscfh.png`,
  LOGO_WHITE: `${CLOUDINARY_BASE_URL}/v1720710233/SwapConnect/swapconnect-full-logo-trans_lodvax.png`,
  FULL_LOGO_TRANS: `${CLOUDINARY_BASE_URL}/v1720710233/SwapConnect/swapconnect-full-logo-trans_lodvax.png`,
  GOOGLE_ICON:
    "https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg",
  HERO: {
    GAMEPAD: `${CLOUDINARY_BASE_URL}/v1719573352/SwapConnect/home/hero_carousel/gamepad_hero_esmyyq.png`,
    PHONE: `${CLOUDINARY_BASE_URL}/v1719573353/SwapConnect/home/hero_carousel/landing_phone_bg_ugdnrm.png`,
    ANDROID: `${CLOUDINARY_BASE_URL}/v1719573353/SwapConnect/home/hero_carousel/Android_phone_hero_tsjtwy.png`,
  },
};

export const SOCIAL_LINKS = [
  {
    id: "whatsapp",
    href: "https://wa.me/2348101641196",
    label: "WhatsApp",
  },
  {
    id: "facebook",
    href: "https://www.facebook.com/SwapConnect",
    label: "Facebook",
  },
  {
    id: "instagram",
    href: "https://www.instagram.com/swap_connect",
    label: "Instagram",
  },
  {
    id: "email",
    href: "mailto:swapconnecttech@gmail.com",
    label: "Email",
  },
];

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/swap", label: "Swap" },
  { href: "/about", label: "About Us" },
  { href: "/shop", label: "Shop" },
];

export const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/swap", label: "Swap" },
  { href: "/about", label: "About Us" },
  { href: "/shop", label: "Shop" },
  { href: "/blog", label: "Blog" },
];

export const CATEGORIES = [
  { href: "/category/ios", label: "iOS" },
  { href: "/category/bluetooth", label: "Bluetooths" },
  { href: "/category/watches", label: "Watches" },
  { href: "/category/accessories", label: "Accessories" },
  { href: "/category/androids", label: "Androids" },
  { href: "/category/laptops", label: "Laptops" },
];
