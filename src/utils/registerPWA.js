export const registerPWA = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const { registerSW } = await import('virtual:pwa-register');
        const updateSW = registerSW({
          immediate: true,
          onNeedRefresh() {
            if (confirm('New content available. Reload?')) {
              updateSW(true);
            }
          },
          onRegistered(registration) {
            console.log('Service Worker registered:', registration);
          },
          onRegisterError(error) {
            console.error('Service Worker registration failed:', error);
          }
        });
      } catch (error) {
        console.error('Error registering service worker:', error);
      }
    }
  };