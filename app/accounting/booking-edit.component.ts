import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AppService} from "./services/app.service";
import {FormBuilder, FormGroup, Validators, FormControl} from "@angular/forms";
import {DzUtil} from "./dz-utils";
import {Booking} from "./data/booking";
import {Observable} from "rxjs";
import {Infotype} from "./data/infotype";
import {Partner} from "./data/partner";
import {Account} from "./data/account";
import {Category} from "./data/category";
import {Title} from "@angular/platform-browser";

@Component({
	selector: 'dz-booking-edit',
	templateUrl: 'app/accounting/booking-edit.component.html'
})

export class BookingEditComponent implements OnInit {

	myForm: FormGroup;
	loading = false;
	id: number = 0;
	konto: number = 0;
	budget: number = 0;

	buchungtyp = [
		{id: -1, name: 'Ausgaben'},
		{id: 0, name: 'Umbuchung'},
		{id: 1, name: 'Einnahme'}
	];

	infotypes: Infotype[];
	partners: Partner[];
	accounts: Account[];
	categories: Category[];

	constructor(private aR: ActivatedRoute, private appService: AppService, private formBuilder: FormBuilder, title: Title) {
		this.id = aR.snapshot.params['id'];
		let _title = aR.snapshot.data['title'] || 'DFT Balances';
		title.setTitle(_title + ' ' + this.id);


		// console.log('BookingEditComponent#constructor', this.id);

		this.myForm = this.formBuilder.group({
			'buchung-id': [{value: '', disabled: true}],
			'buchung-typ': ['-1', Validators.required],
			'konten': ['-1', Validators.required],
			'gegenkonten': ['-1', Validators.required],
			'partners': ['', Validators.required],
			'datum': ['', [Validators.required, (c: FormControl) => this.validate_date(c)]],
			'categories': ['', Validators.required],
			'subcats': ['', Validators.required],
			'betrag': ['', [Validators.required, (c: FormControl) => this.validate_currency(c)]],
			'text': [''],
			'infotypes': ['22', Validators.required],
			'kandidate': ['']
		});

		if (this.id) // onLoad
			appService.getBookingById(this.id).subscribe((x: Booking) => {
						this.loading = true;
						// Wenn Ausgabe Betrag positiv machen
						let buchung_typ = x.type;
						var betrag = x.betrag
						betrag = buchung_typ < 0 ? -betrag : betrag;

						this.getControl('buchung-id').setValue(DzUtil.padZeroLeft(5, '' + x.buchung_id));
						this.getControl('buchung-typ').setValue(x.type);
						this.getControl('konten').setValue(x.konto_id);
						this.getControl('gegenkonten').setValue(x.gegenkonto_id);
						this.getControl('partners').setValue(x.empfaenger_id);
						this.getControl('datum').setValue(DzUtil.format_date(new Date(x.datum)));
						this.getControl('categories').setValue(x.main_categorie_id);
						this.getControl('subcats').setValue(x.sub_categorie_id);
						this.getControl('betrag').setValue(DzUtil.format_currency('' + betrag));
						this.getControl('text').setValue(x.memo);
						this.getControl('infotypes').setValue(x.infotype_id);
						this.getControl('kandidate').setValue(x.Kandidate);

						this.konto = x.konto_id;
						this.budget = x.infotype_id;
					}
			);

/*
		this.appService.infotypesUpdated.subscribe(x => this.infotypes = x);
		this.appService.partnersUpdated.subscribe(x => this.partners = x);
		this.appService.accountsUpdated.subscribe(x => this.accounts = x);
		this.appService.categoriesUpdated.subscribe(x => this.categories = x);

		this.appService.getInfotypes();
		this.appService.getPartners();
		this.appService.getAccounts();
		this.appService.getCategories();

		this.appService.categoriesTableData.updateEvent.subscribe((x: Category[]) => this.categories = x);
		this.appService.categoriesTableData.getTableData();
*/

		this.appService.tableData['infotypes'].updateEvent.subscribe((x: Infotype[]) => this.infotypes = x);
		this.appService.tableData['infotypes'].getTableData();

		this.appService.tableData['accounts'].updateEvent.subscribe((x: Account[]) => this.accounts = x);
		this.appService.tableData['accounts'].getTableData();

		this.appService.tableData['partners'].updateEvent.subscribe((x: Partner[]) => this.partners = x);
		this.appService.tableData['partners'].getTableData();

		this.appService.tableData['categories'].updateEvent.subscribe((x: Category[]) => this.categories = x);
		this.appService.tableData['categories'].getTableData();

	}

	ngOnInit() {
	}

	validate_currency(control: FormControl): {[s: string]: boolean} {
		let value = control.value;
		if (!value) return;

		let v = DzUtil.parse_currency(value);
		if (isNaN(v)) return {'not-number': true};

		return null;
	}

	validate_date(control: FormControl): {[s: string]: boolean} {
		let value = control.value;          // display-value
		if (!value) return;
		let v1 = DzUtil.parse_date(value);  // edit-value

		if (!DzUtil.isDate(v1) && !this.loading) {
			let l = v1.length;
			if (l > 0 && l < 8 && !isNaN(+v1)) {
				let v2 = DzUtil.autocompleteDate(v1);
				if (!v2) {
					control['_hint'] = '';
					return {'not-date': true};
				}
				control['_hint'] = DzUtil.format_date(v2);
				return;
			}
			control['_hint'] = '';
			return {'not-date': true};

		}

		if (this.loading)
			this.loading = !this.loading;
		else
			control['_hint'] = DzUtil.dateDiffString(v1);

		return null;
	}

	getControl(name: string): FormControl {
		let c = this.myForm.controls[name] as FormControl;
		if (!c) {
			console.log('Control', name, 'not found');
			return null;
		}
		return c;
	}

	getControlValue(name: string): string {
		return this.getControl(name).value;
	}

	getCurrency(field: string): number {
		let result = DzUtil.parse_currency(this.getControl(field).value) || 0;
		return result;
	}

	onChangeBuchungsTyp() {
		// console.log('onChangeBuchungsTyp');
		this.getControl('categories').setValue('');
		this.getControl('subcats').setValue('');
	}

}

