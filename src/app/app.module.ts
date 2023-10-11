import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DefaultMatCalendarRangeStrategy, MatDatepickerModule, MAT_DATE_RANGE_SELECTION_STRATEGY } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MaterialModule } from "./material/material.module";
// Material Navigation
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
// Material Layout
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTreeModule } from '@angular/material/tree';
// Material Buttons & Indicators
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRippleModule } from '@angular/material/core';
// Material Popups & Modals
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
// Material Data tables
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { TopNavComponent } from './layout/top-nav/top-nav.component';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CampaignComponent } from './campaigns/campaign/campaign.component';
import { MarketingViewComponent } from './campaigns/marketing-view/marketing-view.component';
import { LoginComponent } from './login/login.component';
import { MarketingLogsViewComponent } from './campaigns/marketing-logs-view/marketing-logs-view.component';
import { FullCalendarModule } from '@fullcalendar/angular';
// import {FullCalendarComponent} from '@fullcalendar/angular';
// import dayGridPlugin from '@fullcalendar/daygrid';
// import interactionPlugin from '@fullcalendar/interaction';
import { PreviewScreenComponent } from './campaigns/preview-screen/preview-screen.component';
import { CarouselComponent } from './carousel/carousel.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { SidenavComponent } from './layout/sidenav/sidenav.component';
import { CampaignApprovalsComponent } from './campaigns/campaign-approvals/campaign-approvals.component';
import { PreviewDialogComponent } from './campaigns/preview-dialog/preview-dialog.component';
import { MainComponent } from './dashboard/main/main.component';
import { TopWidgetsComponent } from './dashboard/top-widgets/top-widgets.component';
import { TraceabilityComponent } from './dashboard/traceability/traceability.component';
import { PerformanceComponent } from './dashboard/performance/performance.component';
import { MarketingScheduleComponent } from './dashboard/marketing-schedule/marketing-schedule.component';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ChartModule } from 'angular-highcharts';
import { DialogRef } from '@angular/cdk/dialog';
import { CampaignTargetedComponent } from './campaigns/marketing-view/campaign-targeted/campaign-targeted.component';
import { CaptureCampaignComponent } from './campaigns/marketing-view/capture-campaign/capture-campaign.component';
import { MarketingScreenComponent } from './campaigns/marketing-view/marketing-screen/marketing-screen.component';
import { EditDialogComponent } from './campaigns/edit-dialog/edit-dialog.component';
import { AtmDashboardComponent } from './campaigns/atm-dashboard/atm-dashboard.component';
import { DeleteDialogComponent } from './campaigns/delete-dialog/delete-dialog.component';
import { NetworkInterceptor } from './network.interceptor';
import {ToastrModule} from 'ngx-toastr';




@NgModule({
  declarations: [
    AppComponent,
    TopNavComponent,
    CampaignComponent,
    MarketingViewComponent,
    MarketingLogsViewComponent,
    LoginComponent,
    PreviewScreenComponent,
    CarouselComponent,
    PagenotfoundComponent,
    AdminDashboardComponent,
    SidenavComponent,
    CampaignApprovalsComponent,
    PreviewDialogComponent,
    MainComponent,
    TopWidgetsComponent,
    TraceabilityComponent,
    PerformanceComponent,
    MarketingScheduleComponent,
    CampaignTargetedComponent,
    CaptureCampaignComponent,
    MarketingScreenComponent,
    EditDialogComponent,
    AtmDashboardComponent,
    DeleteDialogComponent,
   
  ],
  imports: [
    
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatCardModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatListModule,
    MatStepperModule,
    MatTabsModule,
    MatTreeModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatBadgeModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatRippleModule,
    MatBottomSheetModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    HttpClientModule,
    MaterialModule,
    FullCalendarModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    ChartModule,
    ToastrModule.forRoot(),
    NgIdleKeepaliveModule.forRoot()
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [ {
    provide: [MAT_DATE_RANGE_SELECTION_STRATEGY, DialogRef],
    useClass: DefaultMatCalendarRangeStrategy,
    
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: NetworkInterceptor,
    multi: true,
  },
],
  bootstrap: [AppComponent]
})
export class AppModule { }
