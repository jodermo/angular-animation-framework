import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DemosComponent } from './demos/demos.component';


const routes: Routes = [
  {path: ':animation', component: DemosComponent},
  {path: '**', component: DemosComponent}
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

