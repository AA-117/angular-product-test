import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { MaterialModule } from './material/material.module';
import {LoginPageComponent} from "./login-page/login-page.component";
import {MainPageComponent} from "./main-page/main-page.component";
import {AppRoutingModule} from "./app-routing.module";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MaterialPageComponent} from "./material-page/material-page.component";
import {OpenaiPageComponent} from "./openai-page/openai-page.component";
import {LoggingToolPageComponent} from "./logging-tool-page/logging-tool-page.component";
import {provideLumberjack} from "@ngworker/lumberjack";
import {provideLumberjackHttpDriver, withHttpConfig} from "@ngworker/lumberjack/http-driver";
import {provideLumberjackConsoleDriver} from "@ngworker/lumberjack/console-driver";
import {NeobankDashboardComponent} from "./neobank-dashboard/neobank-dashboard.component";
import {NgOptimizedImage, registerLocaleData} from "@angular/common";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {MatTabHeader} from "@angular/material/tabs";
import {MatFormField, MatInput, MatInputModule, MatLabel} from "@angular/material/input";
import {MatSelect} from "@angular/material/select";
import {MAT_DATE_LOCALE, MatNativeDateModule, MatOption} from "@angular/material/core";
import {
  MatDatepickerModule,
  MatDatepickerToggle
} from "@angular/material/datepicker";
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import localeDe from "@angular/common/locales/de";
import {MatTableModule} from "@angular/material/table";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatTooltip} from "@angular/material/tooltip";
import {MatProgressBar} from "@angular/material/progress-bar";
import {AddGoalDialogComponent} from "./add-goal-dialog/add-goal-dialog.component";
import {MatDialogActions, MatDialogContent, MatDialogModule} from "@angular/material/dialog";
import {GoalTransactionDialogComponent} from "./goal-transaction-dialog/goal-transaction-dialog.component";
import {MonthlySummaryComponent} from "./monthly-summary/monthly-summary.component";

registerLocaleData(localeDe, 'de-DE');

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    MainPageComponent,
    MaterialPageComponent,
    OpenaiPageComponent,
    LoggingToolPageComponent,
    NeobankDashboardComponent,
    AddGoalDialogComponent,
    GoalTransactionDialogComponent,
    MonthlySummaryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    NgOptimizedImage,
    MatSlideToggle,
    MatTabHeader,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatInput,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatDatepickerToggle,
    MatNativeDateModule,
    MatIconModule,
    MatTableModule,
    MatButtonToggleModule,
    MatTooltip,
    MatProgressBar,
    MatDialogModule,
    MatDialogContent,
    MatDialogActions
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'de'},
    provideLumberjack(),
    provideLumberjackConsoleDriver(),
    provideLumberjackHttpDriver(
      withHttpConfig({
        origin: 'angular-product-test',
        storeUrl: 'https://backend-service.api/logs',
        retryOptions: {
          maxRetries: 5,
          delayMs: 250
        },
        levels: ["critical", "debug", "error", "info", "warn"]
      })
    )
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
