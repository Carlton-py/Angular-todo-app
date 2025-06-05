import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';

// bootstrapApplication(AppComponent, appConfig)
//   .catch((err) => console.error(err));
// Create a new config that includes both your existing config and HTTP support
const configWithHttp = {
  providers: [...(appConfig.providers || []), provideHttpClient()],
}

bootstrapApplication(AppComponent, configWithHttp).catch((err) => console.error(err))