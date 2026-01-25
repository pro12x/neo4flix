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
   * For production deployments, replace with your real domain.
   */
  apiBaseUrl: window.__env?.apiBaseUrl ?? 'http://0.0.0.0:1111',
};
