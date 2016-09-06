import {Injectable, EventEmitter} from '@angular/core';
import {HttpService} from "./http.service";
import {Observable} from "rxjs";
import 'rxjs/add/operator/map';
import {Balance} from "../data/balance";
import {Booking} from "../data/booking";
import {Infotype} from "../data/infotype";
import {Partner} from "../data/partner";
import {Account} from "../data/account";
import {Category} from "../data/category";

export type BookingPredicate = (e: Booking) => boolean;
function and(predicates: BookingPredicate[]): BookingPredicate {
	return (e) => predicates.every(p => p(e));
}

export class TableData<T> {
	updateEvent = new EventEmitter<T[]>();
	private tableData: T[];

	constructor(private tableName: string, private http: HttpService) {}

	getTableData(): void {

		if (this.tableData && this.tableData.length > 0) {
			this.updateEvent.emit(this.tableData);
			return;
		}

		this.http.getTableData<T>(this.tableName).subscribe((data: T[]) => {
					if (data.length == 0) {
						console.log('Keine', this.tableName, 'Daten gefunden');
						this.tableData = [];
					}
					else {
						this.tableData = data;
						this.updateEvent.emit(this.tableData);
					}
				},
				error => console.log('error:', error)
		);
	}
}

@Injectable()
export class AppService {


	/*
	 infotypes: Infotype[];
	 infotypesUpdated = new EventEmitter<Infotype[]>();

	 partners: Partner[];
	 partnersUpdated = new EventEmitter<Partner[]>();

	 accounts: Account[];
	 accountsUpdated = new EventEmitter<Account[]>();

	 categories: Category[];
	 categoriesUpdated = new EventEmitter<Category[]>();
	 */

	balancesUpdate = new EventEmitter<Balance[]>();
	totalSaldoUpdate = new EventEmitter<number>();

	balances: Balance[] = [];
	totalSaldo: number = 0;

	bookings: Booking[] = [];
	bookingsUpdate = new EventEmitter<Booking[]>();

	tableData: {[key: string]: TableData<any>} = {
		categories: new TableData<Category>('categories', this.http),
		partners: new TableData<Partner>('partners', this.http),
		infotypes: new TableData<Infotype>('infotypes', this.http),
		accounts: new TableData<Account>('accounts', this.http),
	};

	categoriesTableData = new TableData('categories', this.http);

	constructor(private http: HttpService) {
		console.log(11);
		this.http.getBookingsAll().subscribe((data: Booking[]) => {
					console.log(9);
					if (data.length == 0) {
						console.log('Keine Buchungen gefunden');
						this.bookings = [];
					}
					else {
						this.bookings = data;
						console.log(10);
					}
				},
				error => console.log('error:', error)
		);
	}

	getBookings(filter?: BookingPredicate | BookingPredicate[]): void {

		var f: BookingPredicate[] = [];
		if (filter)
			if (Array.isArray(filter))
				f = filter;
			else
				f.push(filter);

		console.log(0, this.bookings, this.bookings.length);

		if (this.bookings && this.bookings.length > 0) {
			console.log(1);
			if (f.length)
				this.bookings = this.bookings.filter(and(f));

			this.bookingsUpdate.emit(this.bookings);
			return;
		}

		this.http.getBookingsAll().subscribe((data: Booking[]) => {
					console.log(2);
					if (data.length == 0) {
						console.log('Keine Buchungen gefunden');
						this.bookings = [];
					}
					else {
						this.bookings = data;
						console.log(3, this.bookings);
						if (f.length)
							this.bookings = this.bookings.filter(and(f));
						console.log('3a', this.bookings);
						this.bookingsUpdate.emit(this.bookings);
					}
				},
				error => console.log('error:', error)
		);
	}

	getBalances(): void {
		this.http.getBalances().subscribe((balances: Balance[]) => {

			this.balances = balances;
			this.balancesUpdate.emit(this.balances);

			this.totalSaldo = balances.reduce((sum: number, balance: Balance) => sum + balance.saldo, 0);
			this.totalSaldoUpdate.emit(this.totalSaldo);
		});
	}

	balancesSumIsCredit(): boolean {
		return this.totalSaldo > 0;
	}

	getBookingByAccountId(accountId: number): Observable<Booking[]> {
		return this.http.getBookingByAccountId(accountId);
	}

	getBookingById(id: number): Observable<Booking> {
		return this.http.getBookingById(id).map((x: Booking[]) => x[0]);
	}

}

