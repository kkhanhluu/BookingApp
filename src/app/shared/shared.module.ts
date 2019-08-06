import { NgModule } from '@angular/core';
import { LocationPickerComponent } from './pickers/location-picker/location-picker.component';
import { CommonModule } from '@angular/common';
import { MapModalComponent } from './map-modal/map-modal.component';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [MapModalComponent, LocationPickerComponent],
  imports: [CommonModule, IonicModule, HttpClientModule],
  exports: [MapModalComponent, LocationPickerComponent],
  entryComponents: [MapModalComponent]
})
export class SharedModule {}
