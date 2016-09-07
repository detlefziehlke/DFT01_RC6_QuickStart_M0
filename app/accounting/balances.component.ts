import {Component, OnInit} from "@angular/core";
import {AppService} from "./services/app.service";
import {Title} from "@angular/platform-browser";
import {ActivatedRoute} from "@angular/router";

@Component({
	selector: 'dz-balances',
	templateUrl: 'app/accounting/balances.component.html'
})

export class BalancesComponent implements OnInit {

	 balances = this.appServive.balancesUpdate;
	 balancesSum = this.appServive.totalSaldoUpdate;

	constructor(private appServive: AppService, title: Title, aR: ActivatedRoute) {
		this.appServive.getBalances();
		let _title = aR.snapshot.data['title'] || 'DFT Balances';
		title.setTitle(_title);
	}

	ngOnInit() {}

	onTestUpdate(text: string) {
		var konto = 7;
		var amount: number = 0;

		let val = text.split(';');
		if (val.length == 2) {
			konto = +val[0];
			amount = +val[1];
		}
		else
			amount = +val[0];

		console.log(konto, amount);
	}

	balancesSumIsCredit(): boolean {
		return this.appServive.balancesSumIsCredit();
	}

}
