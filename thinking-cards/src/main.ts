import { bootstrapApplication } from '@angular/platform-browser';
import { initializeApp } from 'firebase/app';
import { environment } from './environments/environment';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// Initialize Firebase before Angular boots
initializeApp(environment.firebaseConfig);

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
