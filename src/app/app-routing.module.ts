import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { GuardGuard } from './auth/guard.guard';
const routes: Routes = [
  { path: '', redirectTo: 'places', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: './auth/auth.module#AuthPageModule'
  },
  {
    path: 'places',
    loadChildren: './places/places.module#PlacesPageModule',
    canLoad: [GuardGuard]
  },
  {
    path: 'bookings',
    loadChildren: './bookings/bookings.module#BookingsPageModule',
    canLoad: [GuardGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
