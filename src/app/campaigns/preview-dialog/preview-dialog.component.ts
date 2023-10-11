import { Component, OnInit, Inject } from '@angular/core';
import { Campaign } from 'src/app/models/ui-models/campaign.model';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-preview-dialog',
  templateUrl: './preview-dialog.component.html',
  styleUrls: ['./preview-dialog.component.css']
})
export class PreviewDialogComponent implements OnInit {

  campaignName: any = '';
  editMode: boolean = true;
  constructor(private dialogRef: MatDialogRef<PreviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Campaign, private sharedService: SharedService) { 
        
        this.sharedService.updatePreviewCaptureValue(this.data);
    }

  ngOnInit(): void {
  }

}
