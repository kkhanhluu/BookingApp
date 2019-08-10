import { NgModule } from '@angular/core';
import { LocationPickerComponent } from './pickers/location-picker/location-picker.component';
import { CommonModule } from '@angular/common';
import { MapModalComponent } from './map-modal/map-modal.component';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { ImagePickerComponent } from './pickers/image-picker/image-picker.component';

@NgModule({
  declarations: [
    MapModalComponent,
    LocationPickerComponent,
    ImagePickerComponent
  ],
  imports: [CommonModule, IonicModule, HttpClientModule],
  exports: [MapModalComponent, LocationPickerComponent, ImagePickerComponent],
  entryComponents: [MapModalComponent]
})
export class SharedModule {}
