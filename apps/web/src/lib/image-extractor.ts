const IMAGE_EXCLUSIONS = [
  'icon',
  'emoji',
  'arrow',
  'heart',
  'comment',
  'share',
  'note',
  'publish-button',
  'email',
  'img/email',
  'w_36',
  'w_72',
  'w_270',
  '504x540',
  'facebook.com',
  'analytics.twitter.com',
  't.co',
  'noscript',
  'display:none',
  'height="1"',
  'width="1"',
];

// Constants for image size thresholds
const MIN_BASE64_SIZE = 5000; // Increased from 2000 to filter out small logos
const MIN_ICON_SIZE = 2000; // Increased from 1000
const MIN_CONTENT_BASE64_SIZE = 10_000; // New threshold for content images

// Function to extract the first meaningful image from HTML content
export function extractFirstImage(htmlContent: string): string | null {
  // Look for the first img tag with a meaningful src (not icons or small images)
  const imgRegex = /<img[^>]+src="([^"]+)"[^>]*>/gi;
  const matches = [...htmlContent.matchAll(imgRegex)];

  // First pass: look for high-quality content images
  const highQualityImage = findHighQualityImage(matches);
  if (highQualityImage) return highQualityImage;

  // Second pass: look for any acceptable content image if no high-quality one found
  return findAnyContentImage(matches);
}

// Helper function to find high-quality content images
function findHighQualityImage(matches: RegExpMatchArray[]): string | null {
  for (const match of matches) {
    let src = match[1];

    // Handle Google proxy URLs - extract the actual URL after the # symbol
    if (src?.includes('googleusercontent.com') && src.includes('#')) {
      const hashIndex = src.lastIndexOf('#');
      if (hashIndex !== -1) {
        src = src.substring(hashIndex + 1);
      }
    }

    // Skip UI elements, icons, and small images, then check if it's a content image
    if (
      src &&
      !IMAGE_EXCLUSIONS.some((exclusion) => src.includes(exclusion)) &&
      isHighQualityContentImage(src)
    ) {
      return src;
    }
  }

  return null;
}

// Helper function to find any acceptable content image
function findAnyContentImage(matches: RegExpMatchArray[]): string | null {
  for (const match of matches) {
    let src = match[1];

    // Handle Google proxy URLs - extract the actual URL after the # symbol
    if (src?.includes('googleusercontent.com') && src.includes('#')) {
      const hashIndex = src.lastIndexOf('#');
      if (hashIndex !== -1) {
        src = src.substring(hashIndex + 1);
      }
    }

    // Skip UI elements, icons, and small images, then check if it's a content image
    if (
      src &&
      !IMAGE_EXCLUSIONS.some((exclusion) => src.includes(exclusion)) &&
      isContentImage(src)
    ) {
      return src;
    }
  }

  return null;
}

// Function to check if an image is a high-quality content image
function isHighQualityContentImage(src: string): boolean {
  // External URLs - check for content indicators
  if (src.startsWith('http')) {
    return (
      src.includes('substackcdn.com') &&
      (src.includes('public/images') ||
        src.includes('c_limit') ||
        src.includes('w_1100') ||
        src.includes('w_2912') ||
        src.includes('w_1938') ||
        src.includes('w_2250'))
    );
  }

  // Base64 images - these are usually content images from saved HTML
  if (src.startsWith('data:image/')) {
    // Skip very small base64 images (likely icons)
    if (src.includes('base64,UklGR') && src.length < MIN_ICON_SIZE) {
      return false;
    }
    // Only accept large base64 images as high-quality content
    return src.length > MIN_CONTENT_BASE64_SIZE;
  }

  return false;
}

// Function to check if an image is a content image (not UI element)
function isContentImage(src: string): boolean {
  // External URLs - check for content indicators
  if (src.startsWith('http')) {
    return (
      src.includes('substackcdn.com') &&
      (src.includes('public/images') ||
        src.includes('c_limit') ||
        src.includes('w_1100') ||
        src.includes('w_2912') ||
        src.includes('w_1938') ||
        src.includes('w_2250'))
    );
  }

  // Base64 images - these are usually content images from saved HTML
  if (src.startsWith('data:image/')) {
    // Skip very small base64 images (likely icons)
    if (src.includes('base64,UklGR') && src.length < MIN_ICON_SIZE) {
      return false;
    }
    // Accept larger base64 images as they're likely content
    return src.length > MIN_BASE64_SIZE;
  }

  return false;
}

// Function to fetch HTML content and extract image
export async function getBlogImage(blogPath: string): Promise<string | null> {
  try {
    const response = await fetch(blogPath);
    if (!response.ok) return null;

    const htmlContent = await response.text();
    return extractFirstImage(htmlContent);
  } catch {
    // Silently handle errors
    return null;
  }
}
