import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterFormComponent } from './profile/components/register-form/register-form.component';
import { LoginFormComponent } from "./profile/components/login-form/login-form.component";
import { RecoveryPasswordFormComponent } from './profile/components/recovery-password-form/recovery-password-form.component';
import { DashboardComponent } from './band/components/dashboard/dashboard.component';
import { BandConfigurationComponent } from './band/components/band-configuration/band-configuration.component';
import { HistoryComponent } from './band/components/history/history.component';
import { PatientsComponent } from './band/components/patients/patients.component';
import { SettingsComponent } from './band/components/settings/settings.component';
import { SidenavComponent } from "./public/components/sidenav/sidenav.component";
import { AuthGuard } from "./iam/services/auth.guard";

const routes: Routes = [
  { path: 'register', component: RegisterFormComponent },
  { path: 'login', component: LoginFormComponent},
  { path: 'recovery-password', component: RecoveryPasswordFormComponent},
  
  {
    path: 'MIAM',
    component: SidenavComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'band-configuration', component: BandConfigurationComponent },
      { path: 'history', component: HistoryComponent },
      { path: 'patients', component: PatientsComponent },
      { path: 'configuration', component: SettingsComponent }
    ]
  },
  { path: '', pathMatch: 'full', redirectTo: '/login'},
  { path: '**', redirectTo: '/login', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
