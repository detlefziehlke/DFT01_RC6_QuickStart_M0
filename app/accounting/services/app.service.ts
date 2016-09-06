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

export class TableData<T> {
	updateEvent = new EventEmitter<T[]>();
	private tableData: T[];

	constructor(private tableName: string, private http: HttpService) {}

	getTableData(): void {

		if (this.tableData && this.tableData.length >= 0) {
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

	balancesUpdate = new EventEmitter<Balance[]>();
	totalSaldoUpdate = new EventEmitter<number>();

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

	balances: Balance[] = [];
	totalSaldo: number = 0;


	tableData: {[key: string]: TableData<any>} = {
		categories: new TableData<Category>('categories', this.http),
		partners: new TableData<Partner>('partners', this.http),
		infotypes: new TableData<Infotype>('infotypes', this.http),
		accounts: new TableData<Account>('accounts', this.http),
	};

	categoriesTableData = new TableData('categories', this.http);

	constructor(private http: HttpService) {}

	getBalances(): void {
		this.http.getBalances().subscribe((balances: Balance[]) => {

			this.balances = balances;
			this.balancesUpdate.emit(this.balances);

			this.totalSaldo = balances.reduce((sum: number, balance: Balance) => sum + balance.saldo, 0);
			this.totalSaldoUpdate.emit(this.totalSaldo);
		});
	}

	testUpdate(id: number, amount: number): void {
		this.balances.forEach((x: Balance) => {
			if (x.id == id) x.saldo += amount;
		});
		this.balancesUpdate.emit(this.balances);
		this.totalSaldo += amount;
		this.totalSaldoUpdate.emit(this.totalSaldo);
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

/*
	getInfotypes(): void {

		if (this.infotypes && this.infotypes.length >= 0) {
			this.infotypesUpdated.emit(this.infotypes);
			return;
		}

		this.http.getInfotypes().subscribe(
				(data) => {
					if (data.length == 0) {
						console.log('Keine Budgets gefunden');
						this.infotypes = [];
					}
					else {
						this.infotypes = data;
						this.infotypesUpdated.emit(this.infotypes);
					}
				},
				error => console.log('error:', error)
		);
	}
*/

/*
	getPartners(): void {

		if (this.partners && this.partners.length >= 0) {
			this.partnersUpdated.emit(this.partners);
			return;
		}

		this.http.getPartners().subscribe(
				(data) => {
					if (data.length == 0) {
						console.log('Keine Partner gefunden');
						this.partners = [];
					}
					else {
						this.partners = data;
						this.partnersUpdated.emit(this.partners);
					}
				},
				error => console.log('error:', error)
		);
	}
*/

/*
	getAccounts(): void {

		if (this.accounts && this.accounts.length >= 0) {
			this.accountsUpdated.emit(this.accounts);
			return;
		}

		this.http.getAccounts().subscribe(
				(data) => {
					if (data.length == 0) {
						console.log('Keine Konten gefunden');
						this.accounts = [];
					}
					else {
						this.accounts = data;
						this.accountsUpdated.emit(this.accounts);
					}
				},
				error => console.log('error:', error)
		);
	}
*/

	/*
	 getCategories(): void {

	 if (this.categories && this.categories.length >= 0) {
	 this.categoriesUpdated.emit(this.categories);
	 return;
	 }

	 // this.http.getCategories().subscribe(
	 this.http.getTableData<Category>('categories').subscribe(
	 (data) => {
	 if (data.length == 0) {
	 console.log('Keine Kategorien gefunden');
	 this.categories = [];
	 }
	 else {
	 this.categories = data;
	 this.categoriesUpdated.emit(this.categories);
	 }
	 },
	 error => console.log('error:', error)
	 );
	 }
	 */

}

