import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';


bootstrapApplication(AppComponent, 
//  { providers: [
//     provideAnimations() // או provideNoopAnimations() אם רוצים להשבית אנימציות
//   ]
// }, 
 appConfig
)
  .catch((err) => console.error(err));
