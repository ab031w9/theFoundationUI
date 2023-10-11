import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';



@NgModule({
  declarations: [],
  imports: [ MatIconModule ], 
exports: [ MatIconModule ], 
providers: [MatIconRegistry] }) 
export class MaterialModule {}
