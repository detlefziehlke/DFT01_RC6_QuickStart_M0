import {Routes, RouterModule} from "@angular/router";
import {ModuleWithProviders} from "@angular/core";
import {DashboardComponent} from "./dashboard.component";
import {PagenotfoundComponent} from "./pagenotfound.component";
import {BalancesComponent} from "./accounting/balances.component";
import {AccountBookingsComponent} from "./accounting/account-bookings.component";
import {BookingEditComponent} from "./accounting/booking-edit.component";

const appRoutes: Routes = [
	{path: 'dashboard', component: DashboardComponent},
	{path: 'balances', component: BalancesComponent},
	{path: 'account/:id', component: AccountBookingsComponent},
	{path: 'booking/:id', component: BookingEditComponent},
	{path: 'booking', component: BookingEditComponent},
	{path: '', component: DashboardComponent},
	{path: '**', component: PagenotfoundComponent}

];

export const appRoutingProviders: any[] = [];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
