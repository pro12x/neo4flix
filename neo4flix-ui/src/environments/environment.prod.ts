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
  apiBaseUrl: window.__env?.apiBaseUrl ?? 'http://vps-665ee063.vps.ovh.ca:1111',
  // apiBaseUrl: window.__env?.apiBaseUrl ?? 'http://localhost:1111',
};
