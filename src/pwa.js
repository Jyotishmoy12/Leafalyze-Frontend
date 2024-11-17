import { registerSW } from 'virtual:pwa-register';

export const registerPWA = () => {
  if ('serviceWorker' in navigator) {
    registerSW({
      onRegistered(registration) {
        console.log('Service Worker registered: ', registration);
      },
      onRegisterError(error) {
        console.log('Service Worker registration failed: ', error);
      }
    });
  }
};