import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MainPageComponent} from './main-page/main-page.component';
import {LoginPageComponent} from "./login-page/login-page.component";
import {MaterialPageComponent} from "./material-page/material-page.component";
import {OpenaiPageComponent} from "./openai-page/openai-page.component";
import {LoggingToolPageComponent} from "./logging-tool-page/logging-tool-page.component";
import {NeobankDashboardComponent} from "./neobank-dashboard/neobank-dashboard.component";


export const routes: Routes = [
  {path: '', redirectTo: 'main', pathMatch: 'full'},
  {path: 'main', component: MainPageComponent},
  {path: 'login', component: LoginPageComponent},
  {path: 'material', component: MaterialPageComponent},
  {path: 'openai', component: OpenaiPageComponent},
  {path: 'logging', component: LoggingToolPageComponent},
  {path: 'neobank', component: NeobankDashboardComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
