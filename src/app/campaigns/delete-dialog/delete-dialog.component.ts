import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Campaign } from 'src/app/models/ui-models/campaign.model';
import { apiCampaign } from 'src/app/models/api-models/campaign.model';
import { ApprovalService } from 'src/app/services/approval.service';
import { CampaignService } from 'src/app/services/campaign.service';
import { ImageRenderService } from 'src/app/services/imageRender.service';
import { SharedService } from 'src/app/services/shared.service';
import * as LZString from 'lz-string';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.css']
})
export class DeleteDialogComponent implements OnInit {

  campaignName: string = 'name';
  constructor(private dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: [Campaign, Number], private sharedService: SharedService,
    private readonly campaignService: CampaignService, private readonly sanitizer: DomSanitizer, private readonly imageRenderService: ImageRenderService,private previewDialog: MatDialog,private snackbar:MatSnackBar, private readonly router: Router) {
      
    }

  ngOnInit(): void {
    
  }

  deactivateCampaignStatus() {
       //Call service to Deactivate Campaign
       if (!!this.data[0].id) {
          this.campaignService.updateCampaign(this.data[0].id)
          .subscribe({
            next:(successResponse) => {
              localStorage.removeItem('campaigns');
              
              this.getAllCampaigns();
              // this.previewCampaign(successResponse.campaignId)
                          //Show toaster notification
              this.snackbar.open("ATM Marketing Campaign " + this.data[0].campaignName   + " Has Been Deactivated and will no longer appear on the calendar", undefined,
              {
              duration: 3000,
              panelClass: ['mat-toolbar', 'mat-primary']
              });
            },
            error: (errorResponse) => {
              
              
              if (errorResponse.status = 204) {
                localStorage.removeItem('campaigns');
                this.getAllCampaigns();
                          //Show toaster notification
              this.snackbar.open("ATM Marketing Campaign " + this.data[0].campaignName   + " Has Been Deactivated and will no longer appear on the calendar", undefined,
              {
              duration: 3000,
              panelClass: ['mat-toolbar', 'mat-primary']
              });
              }
              else {
                  this.snackbar.open("Failed to Deactivate ATM Campaign - " + errorResponse + " ", undefined,
                  {
                  duration: 3000
                  })
                }
              }
          });
        }
       }
 
       navigateToApprovals(){

        this.router.navigate(['/view']);
      } 

      getAllCampaigns(): void {
        // -> Get All Campaigns
      
        this.campaignService.getCampaigns()
        .subscribe({
         next: (successResponse) => {
                localStorage.setItem('campaigns', LZString.compress(JSON.stringify(successResponse)));
                this.sharedService.updateCreateCampaignValue(successResponse);
                
                this.navigateToApprovals();
             },
      
          error: (errorRespo) => {
            
          }
       });
      }
      
}
 

