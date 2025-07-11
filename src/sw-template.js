// This script will be used by the PWA plugin to generate the service worker
// It's not used directly, but serves as a template for any custom logic

self.addEventListener('install', (event) => {
  console.log('Service worker installed');
});

self.addEventListener('activate', (event) => {
  console.log('Service worker activated');
});

// Custom handler for showing manual installation instructions
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CHECK_INSTALLABILITY') {
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => {
        client.postMessage({
          type: 'INSTALLABILITY_RESULT',
          canInstall: false, // This will be determined by the browser
          reason: 'Manual check triggered'
        });
      });
    });
  }
});
