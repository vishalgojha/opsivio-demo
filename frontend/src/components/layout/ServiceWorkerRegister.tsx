"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    void navigator.serviceWorker
      .getRegistrations()
      .then(async (registrations) => {
        // Use a versioned script URL while migrating from the old white-label
        // app. A same-path worker can otherwise remain active in an existing
        // browser profile and keep serving the previous brand shell.
        const workerUrl = new URL("/sw.js?v=opsivio-v19", window.location.origin).href;
        await Promise.all(
          registrations
            .filter((registration) => {
              const scriptUrl = registration.active?.scriptURL || registration.waiting?.scriptURL;
              return scriptUrl && scriptUrl !== workerUrl;
            })
            .map((registration) => registration.unregister())
        );

        const registration = await navigator.serviceWorker.register("/sw.js?v=opsivio-v19", { scope: "/" });
        await registration.update().catch(() => undefined);
      })
      .catch((error) => {
        console.warn("[SW] Registration failed:", error);
      });
  }, []);

  return null;
}
