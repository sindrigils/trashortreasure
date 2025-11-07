import avatarMapping from './avatars.json';

const PLACEHOLDER_AVATAR = '/avatars/placeholder.png';

/**
 * Normalize a name by removing accents, converting to lowercase, and removing special characters
 */
function slugifyName(name: string): string {
  return name
    .normalize('NFD') // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ''); // Remove non-alphanumeric
}

/**
 * Extract first name from a full name (before any spaces)
 */
function getFirstName(name: string): string {
  return name.trim().split(/\s+/)[0];
}

/**
 * Get the avatar URL for a given voter name
 * Falls back to placeholder if no avatar is found
 */
export function getAvatarUrl(voterName: string): string {
  // If name has spaces, use only first name
  const searchName = getFirstName(voterName);

  // Try exact match first
  if (searchName in avatarMapping) {
    return avatarMapping[searchName as keyof typeof avatarMapping];
  }

  // Try case-insensitive match
  const lowerName = searchName.toLowerCase();
  const matchedKey = Object.keys(avatarMapping).find(
    (key) => key.toLowerCase() === lowerName
  );

  if (matchedKey) {
    return avatarMapping[matchedKey as keyof typeof avatarMapping];
  }

  // Try slugified match (handles accents, special characters)
  const slugifiedSearch = slugifyName(searchName);
  const slugMatchedKey = Object.keys(avatarMapping).find(
    (key) => slugifyName(key) === slugifiedSearch
  );

  if (slugMatchedKey) {
    return avatarMapping[slugMatchedKey as keyof typeof avatarMapping];
  }

  // Return placeholder if no match found
  return PLACEHOLDER_AVATAR;
}

/**
 * Get all voters and their avatar URLs from the mapping
 */
export function getAllVoters(): Array<{ name: string; avatarUrl: string }> {
  return Object.keys(avatarMapping).map((name) => ({
    name,
    avatarUrl: avatarMapping[name as keyof typeof avatarMapping],
  }));
}
