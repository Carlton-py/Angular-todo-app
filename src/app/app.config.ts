// import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
// import { provideRouter } from '@angular/router';

// import { routes } from './app.routes';
// import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

// export const appConfig: ApplicationConfig = {
//   providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideClientHydration(withEventReplay())]
// };
import type { ApplicationConfig } from "@angular/core"
import { provideRouter } from "@angular/router"
import { routes } from "./app.routes"

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // We don't need provideHttpClient() anymore since we're not making HTTP requests
  ],
}