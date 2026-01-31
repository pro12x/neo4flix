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
   * En production VPS, utiliser l'adresse publique du backend
   */
  // apiBaseUrl: window.__env?.apiBaseUrl ?? 'http://vps-665ee063.vps.ovh.ca:1111',
  apiBaseUrl: window.__env?.apiBaseUrl ?? 'http://localhost:1111',
};
