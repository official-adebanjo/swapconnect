export const DEFAULT_USER_ICON = "/images/user-icon.webp";

/**
 * Validates and sanitizes an avatar URL.
 * Returns a default icon if the URL is invalid or problematic.
 */
export const getValidAvatarUrl = (
  avatarUrl: string | null | undefined,
): string => {
  // Return default if no avatar or invalid avatar
  if (!avatarUrl || typeof avatarUrl !== "string" || avatarUrl.trim() === "") {
    return DEFAULT_USER_ICON;
  }

  // Check if it's a problematic external URL
  const problematicDomains = ["vectorstock.com", "placeholder"];
  if (problematicDomains.some((domain) => avatarUrl.includes(domain))) {
    return DEFAULT_USER_ICON;
  }

  // If it's a relative path, ensure it starts with /
  if (!avatarUrl.startsWith("http") && !avatarUrl.startsWith("/")) {
    return `/${avatarUrl}`;
  }

  return avatarUrl;
};
