import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import routes  from './app.routes.module';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimations(),provideHttpClient(withFetch()), provideAnimationsAsync(), provideAnimationsAsync()]
};
