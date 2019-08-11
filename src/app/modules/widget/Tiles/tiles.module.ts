import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Tiles } from './components/tiles.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  exports:[
    CommonModule,
    Tiles
  ],
  declarations: [
    Tiles
  ],
  providers: [

  ]
})
export class TilesModule { }
