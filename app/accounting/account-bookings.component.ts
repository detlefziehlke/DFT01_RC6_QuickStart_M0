import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AppService} from "./services/app.service";
import {Observable} from "rxjs";
import {Booking} from "./data/booking";
import {Title} from "@angular/platform-browser";

@Component({
	selector: 'dz-account-bookings',
	templateUrl: 'app/accounting/account-bookings.component.html'

})
export class AccountBookingsComponent implements OnInit {

	id: number = 0;
	bookings: Booking[];
	konto_id: number;
	konto_name: string;

	constructor(private aR: ActivatedRoute, private appService: AppService, title:Title) {
		this.id = aR.snapshot.params['id'];
		this.appService.getBookingByAccountId(this.id).subscribe((b: Booking[]) => this.getBooking(b));
		let _title = aR.snapshot.data['title'] || 'DFT Kontobuchungen';
		title.setTitle(_title);
	}

	ngOnInit() {
	}

	onClickTest() {
		console.log('onClick');
		this.appService.getBookingByAccountId(7).subscribe((b: Booking[]) => {
			this.bookings = b;
			this.konto_id = b[0].konto_id;
			this.konto_name = b[0].konto_name;
		});
	}

	private getBooking(b: Booking[]) {
		this.bookings = b;
		this.konto_id = b[0].konto_id;
		this.konto_name = b[0].konto_name;
	}
}
