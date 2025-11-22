/**
 * Security utilities cho Game Hub
 * - Origin validation
 * - CSP helpers
 * - Token validation
 */

/**
 * Lấy allowed origins từ env hoặc manifest
 */
export function getAllowedOrigins(): string[] {
  const envOrigins = process.env.NEXT_PUBLIC_ALLOWED_GAME_ORIGINS || '';
  return envOrigins.split(',').filter(Boolean);
}

/**
 * Kiểm tra origin có trong whitelist không
 */
export function isOriginAllowed(origin: string, allowedOrigins?: string[]): boolean {
  const allowed = allowedOrigins || getAllowedOrigins();

  // Dev mode: cho phép localhost
  if (process.env.NODE_ENV === 'development' && origin.includes('localhost')) {
    return true;
  }

  return allowed.some((allowed) => {
    // Exact match
    if (allowed === origin) {
      return true;
    }

    // Wildcard subdomain: *.example.com
    if (allowed.startsWith('*.')) {
      const domain = allowed.slice(2);
      return origin.endsWith(domain);
    }

    return false;
  });
}

/**
 * Extract origin từ URL
 */
export function extractOrigin(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.origin;
  } catch {
    return '';
  }
}

/**
 * Validate game manifest origin
 */
export function validateManifestOrigin(entryUrl: string): boolean {
  const origin = extractOrigin(entryUrl);
  return isOriginAllowed(origin);
}

/**
 * Tạo sandbox attributes cho iframe
 */
export function getSandboxAttributes(capabilities?: string[]): string[] {
  const base = [
    'allow-scripts',
    'allow-pointer-lock',
  ];

  // Thêm capabilities theo yêu cầu
  if (capabilities?.includes('audio')) {
    base.push('allow-autoplay');
  }

  // CẢNH BÁO: allow-same-origin chỉ nên bật nếu origin được tin cậy tuyệt đối
  // base.push('allow-same-origin');

  return base;
}

/**
 * Tạo allow attributes cho iframe
 */
export function getAllowAttributes(capabilities?: string[]): string {
  const features = ['fullscreen', 'gamepad'];

  if (capabilities?.includes('audio')) {
    features.push('autoplay');
  }

  return features.join('; ');
}

/**
 * Validate JWT token (basic check - thực tế nên dùng lib như jose)
 */
export function isTokenExpired(expiry: string): boolean {
  try {
    const expiryTime = new Date(expiry).getTime();
    return Date.now() > expiryTime;
  } catch {
    return true;
  }
}

/**
 * Tạo CSP header value
 */
export function getCSPHeader(): string {
  const allowedOrigins = getAllowedOrigins().join(' ');

  return [
    'default-src \'self\'',
    `frame-src 'self' ${allowedOrigins}`,
    `script-src 'self' 'unsafe-inline' ${allowedOrigins}`,
    `connect-src 'self' ${process.env.NEXT_PUBLIC_API_BASE_URL || ''}`,
    `img-src 'self' data: ${allowedOrigins}`,
    'style-src \'self\' \'unsafe-inline\'',
  ].join('; ');
}
