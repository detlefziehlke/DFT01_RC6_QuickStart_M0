import {Component} from "@angular/core";
import {ActivatedRoute} from "@angular/router";

@Component({
	selector: 'dz-booking-test',
	templateUrl: 'app/accounting/booking-test.html'
})

export class BookingTestComponent {

	message: string = '';

	constructor(aR: ActivatedRoute) {
		let konto = aR.snapshot.params['konto'];
		let mode = aR.snapshot.params['mode'];
		let id = aR.snapshot.params['id'];

/*
		console.log('konto', konto);
		console.log('mode', mode);
		console.log('id', id);
*/

		if (konto && konto == 0)
			konto = null;

		if (mode)
			this.onInit(mode, konto);
		else if (id)
			this.onLoad(id);

	}

	onInit(mode: string, konto?: number) {
		this.message = 'onInit(\'' + mode + '\'' + (!konto ? ')' : ', ' + konto + ')');
	}

	onLoad(id) {
		this.message = 'onLoad(' + id + ')';
	}

	onSave() {}

	onSaveContinue() {
		this.onInit('neu');
		this.message += ' ... after Saving';

	}

	onDelete() {
		this.message = 'onDelete()';
	}

}
