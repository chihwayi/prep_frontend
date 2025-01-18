export { AppServerModule as default } from './app/app.module.server';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { EnvironmentProviders } from '@angular/core';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withFetch()), // Enable fetch API here
  ],
}).then(() => {
  console.log('Bootstrap successful');
}).catch((err) => console.error(err));

function bootstrapApplication(AppComponent: any, arg1: { providers: EnvironmentProviders[]; }): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      // Simulate bootstrap logic
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

