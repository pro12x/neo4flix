// This file is overwritten at container startup by docker/entrypoint.sh.
// It must exist in source so Angular includes it in the build output.
window.__env = window.__env || { apiBaseUrl: 'http://localhost:1111' };
