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
  '504x540', // This specific dimension pattern
  // Remove '$s_!' as it's too broad and excludes good content images
];

// Function to extract the first meaningful image from HTML content
export function extractFirstImage(htmlContent: string): string | null {
  // Look for the first img tag with a meaningful src (not icons or small images)
  const imgRegex = /<img[^>]+src="([^"]+)"[^>]*>/gi;
  const matches = [...htmlContent.matchAll(imgRegex)];

  for (const match of matches) {
    let src = match[1];

    // Handle Google proxy URLs - extract the actual URL after the # symbol
    if (src?.includes('googleusercontent.com') && src.includes('#')) {
      const hashIndex = src.lastIndexOf('#');
      if (hashIndex !== -1) {
        src = src.substring(hashIndex + 1);
      }
    }

    // Skip UI elements, icons, and small images
    if (
      src &&
      // Check if the URL contains any exclusion terms
      !IMAGE_EXCLUSIONS.some((exclusion) => src.includes(exclusion)) &&
      src.includes('substackcdn.com') &&
      // Look for images that are likely content images (larger dimensions)
      (src.includes('w_2912') ||
        src.includes('w_1100') ||
        src.includes('504x540') ||
        src.includes('w_1938') ||
        src.includes('w_2250') ||
        src.includes('c_limit') ||
        src.includes('public/images') ||
        src.includes('1600x1596') ||
        src.includes('f_auto,q_auto:good'))
    ) {
      return src;
    }
  }

  return null;
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
