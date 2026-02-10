import { Routes } from '@angular/router';
import { CodeInputComponent } from './components/code-input/code-input';

export const routes: Routes = [
  
  {path:'', redirectTo:'app-code-input', pathMatch:'full'},
  {path:'app-code-input', component: CodeInputComponent},
];