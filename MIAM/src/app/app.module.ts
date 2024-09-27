import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MatIconModule } from "@angular/material/icon";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatListModule } from "@angular/material/list";
import { MatTableModule } from "@angular/material/table";

import { FormsModule} from "@angular/forms";
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from "@angular/common/http";
import { AppComponent } from './app.component';
import { RegisterFormComponent } from './profile/components/register-form/register-form.component';
import { LoginFormComponent } from './profile/components/login-form/login-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RecoveryPasswordFormComponent } from './profile/components/recovery-password-form/recovery-password-form.component';
import { DashboardComponent } from './band/components/dashboard/dashboard.component';
import { SidenavComponent } from './public/components/sidenav/sidenav.component';
import { SettingsComponent } from './band/components/settings/settings.component';
import { PatientsComponent } from './band/components/patients/patients.component';
import { HistoryComponent } from './band/components/history/history.component';
import { BandConfigurationComponent } from './band/components/band-configuration/band-configuration.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterFormComponent,
    LoginFormComponent,
    RecoveryPasswordFormComponent,
    DashboardComponent,
    SidenavComponent,
    SettingsComponent,
    PatientsComponent,
    HistoryComponent,
    BandConfigurationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    MatIconModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatTableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
