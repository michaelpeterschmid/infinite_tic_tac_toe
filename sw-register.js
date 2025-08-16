/* This registers service worker with a scope that 
matches site folder (root or /repo/).*/

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const swUrl = new URL('./sw.js', location.href);
    navigator.serviceWorker.register(swUrl.href).catch(console.error);
  });
}
