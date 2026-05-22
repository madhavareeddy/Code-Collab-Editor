import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';

import { provideMonacoEditor } from 'ngx-monaco-editor-v2';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {

  providers: [

    provideRouter(routes),

    importProvidersFrom(FormsModule),

    provideHttpClient(),

    // 🔥 MONACO EDITOR
    provideMonacoEditor()

  ]
};