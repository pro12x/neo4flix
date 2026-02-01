declare global {
  interface Window {
    __env?: {
      apiBaseUrl?: string;
    };
  }
}

export const environment = {
  production: true,
  /**
   * Base URL of the API Gateway.
   * In production with Nginx proxy, leave empty to use /api (proxied to gateway).
   * Nginx handles forwarding to backend internally, avoiding CORS.
   */
  apiBaseUrl: window.__env?.apiBaseUrl ?? '',
};
