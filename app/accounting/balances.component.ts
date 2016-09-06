import {Component, OnInit} from "@angular/core";
import {AppService} from "./services/app.service";

@Component({
	selector: 'dz-balances',
	templateUrl: 'app/accounting/balances.component.html'
})

export class BalancesComponent implements OnInit {

	 balances = this.appServive.balancesUpdate;
	 balancesSum = this.appServive.totalSaldoUpdate;

	constructor(private appServive: AppService) {
		this.appServive.getBalances();
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
		this.appServive.testUpdate(konto, amount);
	}

	balancesSumIsCredit(): boolean {
		return this.appServive.balancesSumIsCredit();
	}

}
