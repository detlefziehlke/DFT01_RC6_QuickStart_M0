import {Injectable} from '@angular/core';
import {Http, Response} from "@angular/http";
import 'rxjs/add/operator/map';
import {Observable} from "rxjs";
import {Balance} from "../data/balance";
import {Booking} from "../data/booking";

@Injectable()
export class HttpService {

	private sqlconf = {
		partners: {
			url: 'http://macbook-pro:8080/finance/api/getPartners/'
		},
		categories: {
			url: 'http://macbook-pro:8080/finance/api/getCategories/'
		},
		infotypes: {
			url: 'http://macbook-pro:8080/finance/api/getInfotypes/'
		},
		accounts: {
			url: 'http://macbook-pro:8080/finance/api/getAccounts/'
		},
	}

	constructor(private http: Http) {

	}

	getBookingsAll(): Observable<Booking[]> {
		return this.http.get('http://localhost:8080/finance/api/getEntriesAll')
				.map(response => response.json());
	}

	getBalances(): Observable<Balance[]> {
		let url = "http://macbook-pro:8080/finance/api/getBalances";
		return this.http.get(url).map(response => response.json());
	}

	getBookingByAccountId(accountId: number): Observable<Booking[]> {
		let url = 'http://macbook-pro:8080/finance/api/getEntriesByAccount/';
		return this.http.get(url + accountId).map(response => response.json());
	}

	getBookingById(id: number): Observable<Booking[]> {
		let url = 'http://macbook-pro:8080/finance/api/getEntriesById/' + id;
		return this.http.get(url)
				.map((response: Response) => response.json());
	}

	getTableData<T>(table: string): Observable<T[]> {
		let url = this.sqlconf[table].url;
		if (!url) {
			console.log('url for', table, 'not found');
			return;
		}

		return this.http.get(url)
				.map((response: Response) => response.json());

	}

}
