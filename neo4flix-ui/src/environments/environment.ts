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
   * In dev with Docker, this is typically http://localhost:1111
   */
  apiBaseUrl: window.__env?.apiBaseUrl ?? 'http://localhost:1111',
};
