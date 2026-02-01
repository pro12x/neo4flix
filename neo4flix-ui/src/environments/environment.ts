declare global {
  interface Window {
    __env?: {
      apiBaseUrl?: string;
    };
  }
}

export const environment = {
  production: false,
  /**
   * Base URL of the API Gateway.
   * When served via Nginx (Docker), leave empty to use /api proxy (no CORS).
   * For local dev server (ng serve), use full URL (e.g. http://localhost:1111).
   */
  apiBaseUrl: window.__env?.apiBaseUrl ?? '',
  // For local Angular dev server without Nginx, uncomment and use:
  // apiBaseUrl: window.__env?.apiBaseUrl ?? 'http://localhost:1111',
};
