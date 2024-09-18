import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

(async () => {
  const app = await bootstrapApplication(AppComponent, appConfig)
    .catch((err) => console.error(err));
})();