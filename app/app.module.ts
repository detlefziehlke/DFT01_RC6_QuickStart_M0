import {BrowserModule, Title} from '@angular/platform-browser';
import {NgModule, ApplicationRef} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppComponent} from './app.component';
import {DashboardComponent} from './dashboard.component';
import {PagenotfoundComponent} from './pagenotfound.component';
import {BalancesComponent} from './accounting/balances.component';
import {routing, appRoutingProviders} from "./app.routing";
import {HttpService} from "./accounting/services/http.service";
import {HttpModule} from "@angular/http";
import {AppService} from "./accounting/services/app.service";
import {DzCurrencyPipe} from './accounting/dz-currency.pipe';
import {AccountBookingsComponent} from './accounting/account-bookings.component';
import {DzDatePipe} from './accounting/dz-date.pipe';
import {DzLeadingZerosPipe} from './accounting/dz-leading-zeros.pipe';
import {BookingEditComponent} from './accounting/booking-edit.component';
import {CurrencyEdit} from './ui-core/currency-edit.directive';
import {DateEdit} from './ui-core/date-edit.directive';
import {MainCatFilterPipe, SubCatFilterPipe, DifferentAccountPipe} from "./accounting/booking.pipes";
import {BookingTestComponent} from "./accounting/booking-test";

@NgModule({
	declarations: [
		AppComponent,
		DashboardComponent,
		PagenotfoundComponent,
		BalancesComponent,
		DzCurrencyPipe,
		AccountBookingsComponent,
		DzDatePipe,
		BookingEditComponent,
		BookingTestComponent,
		DzLeadingZerosPipe,
		DateEdit,
		MainCatFilterPipe,
		SubCatFilterPipe,
		DifferentAccountPipe,
		CurrencyEdit
	],
	imports: [
		BrowserModule,
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		HttpModule,
		routing
	],
	providers: [
		appRoutingProviders,
		HttpService,
		AppService,
		Title
	],
	entryComponents: [AppComponent],
	bootstrap: [AppComponent]
})
export class AppModule {

}
