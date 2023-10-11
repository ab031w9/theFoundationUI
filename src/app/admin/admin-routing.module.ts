import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { CampaignApprovalsComponent } from '../campaigns/campaign-approvals/campaign-approvals.component';
import { AuthGuard } from '../services/auth.guard';

const routes: Routes = [
  {path: '',  canActivate: [AuthGuard], component: AdminDashboardComponent},
  {path: 'approvals', canActivate: [AuthGuard], component: CampaignApprovalsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
