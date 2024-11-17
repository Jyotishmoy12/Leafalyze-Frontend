export const registerPWA = () => {
  if ('serviceWorker' in navigator) {
    // Use dynamic import for the registration
    import('virtual:pwa-register').then(({ registerSW }) => {
      const updateSW = registerSW({
        onNeedRefresh() {
          if (confirm('New content available. Reload?')) {
            updateSW(true)
          }
        },
        onRegistered(registration) {
          console.log('Service Worker registered:', registration)
        },
        onRegisterError(error) {
          console.error('Service Worker registration failed:', error)
        }
      })
    })
  }
}
