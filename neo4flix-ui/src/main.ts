// Disable frontend console output to avoid leaking sensitive data
(function () {
  try {
    const WIN: any = window as any;
    // runtime flag (optional): window.__env.disableLogs = 'false' to allow logs
    const disableLogs = WIN.__env?.disableLogs !== 'false';
    if (disableLogs) {
      ['log', 'debug', 'info', 'warn', 'error', 'trace'].forEach((m) => {
        // keep type compatible
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        console[m] = () => {};
      });
    }
  } catch (e) {
    // If overriding fails, do nothing (no crash)
  }
})();

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch(() => {
    // Bootstrap failed - intentionally silent to avoid leaking info to console
  });
