import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DronesComponent } from './drones/drones.component';

const routes: Routes = [
  {path: '', redirectTo: '/drones', pathMatch: 'full'},
  {path: 'drones', component: DronesComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
