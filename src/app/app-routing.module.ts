import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AirplanesComponent } from './Components/airplanes/airplanes.component';

import { PassengersComponent } from './Components/passengers/passengers.component';
import { CostsComponent } from './Components/costs/costs.component';
import { CrewsComponent } from './Components/crews/crews.component';
import { FlightsComponent } from './Components/flights/flights.component';
import { OperatorsComponent } from './Components/operators/operators.component';
import { LoginComponent } from './Common/login/login.component';
import { RegisterComponent } from './Common/register/register.component';
import { FlightDetailsComponent } from './Components/flight-details/flight-details.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'airplanes', component: AirplanesComponent },
  { path: 'passengers', component: PassengersComponent },
  { path: 'costs', component: CostsComponent },
  { path: 'crews', component: CrewsComponent },
  { path: 'flights', component: FlightsComponent },
  { path: 'operators', component: OperatorsComponent },
  { path: 'flight/:id', component: FlightDetailsComponent },
  { path: 'flights/:id/details', component: FlightDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule { }
