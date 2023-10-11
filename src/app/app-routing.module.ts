import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AtmDashboardComponent } from './campaigns/atm-dashboard/atm-dashboard.component';
import { CampaignApprovalsComponent } from './campaigns/campaign-approvals/campaign-approvals.component';
import { CampaignComponent } from './campaigns/campaign/campaign.component';
import { MarketingLogsViewComponent } from './campaigns/marketing-logs-view/marketing-logs-view.component';
import { MarketingViewComponent } from './campaigns/marketing-view/marketing-view.component';
import { PreviewScreenComponent } from './campaigns/preview-screen/preview-screen.component';
import { MainComponent } from './dashboard/main/main.component';
import { TopNavComponent } from './layout/top-nav/top-nav.component';
import { LoginComponent } from './login/login.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';

import {AuthGuard} from './services/auth.guard'

const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'campaign',
    canActivate: [AuthGuard],
    component: CampaignComponent
  },
  {
    path: 'login',
    component: LoginComponent,
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'campaign/:id',
    canActivate: [AuthGuard],
    component: MarketingViewComponent
  }
  ,
  {
    path: 'view',
    canActivate: [AuthGuard],
    component: MarketingLogsViewComponent,
    runGuardsAndResolvers: 'always'
  }
  ,
  {
    path: 'atm-dashboard',
    canActivate: [AuthGuard],
    component: AtmDashboardComponent
  }
  ,
  {
    path: 'preview',
    canActivate: [AuthGuard],
    component: PreviewScreenComponent
  },
  {
    path: 'admin',
    canActivate: [AuthGuard],
    loadChildren: () => import('./admin/admin.module').then((m) => m.AdminModule),
  },
  // {
  //   path: 'dashboard',
  //   canActivate: [AuthGuard],
  //   component: MainComponent
  // },
  {
    path: 'preview/:id',
    canActivate: [AuthGuard],
    component: PreviewScreenComponent
  },
  {
    path: 'user',
    canActivate: [AuthGuard],
    component: CampaignApprovalsComponent,
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'approvals',
    canActivate: [AuthGuard],
    component: CampaignApprovalsComponent,
    runGuardsAndResolvers: 'always'
  },
  {
    path: '**',
    component: PagenotfoundComponent
  },
  {
    path: 'nav' ,
    canActivate: [AuthGuard],
    component: TopNavComponent,
    runGuardsAndResolvers: 'always'
  }
  ,
  {
    path: '',
    redirectTo:'/login', pathMatch: 'full',
    runGuardsAndResolvers: 'always'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
