import {Directive, HostListener, Input, ElementRef, Renderer, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {DzUtil} from "../accounting/dz-utils";

@Directive({
	selector: '[currency-edit]'
})

export class CurrencyEdit implements OnInit {

	private control: FormControl;
	private formControlName: string;

	private nokey: boolean = false;
	private flummy: boolean = false; // eher experimentell

	@Input('currency-edit') form: FormGroup;
	@Input('no-keypress') noKeypress: boolean = false;

	@HostListener('focus') onFocus() {
		let val = this.ele.nativeElement.value;
		val = val.replace(' €', '');

		this.ele.nativeElement.value = val;

	}

	@HostListener('keydown') onKeyDown($event: KeyboardEvent) {
		let keyboardEvent = event as KeyboardEvent;

		if (this.noKeypress || this.nokey) {
			this.onKeyDown2(keyboardEvent.keyCode);
			return;
		}

		if (keyboardEvent.metaKey || keyboardEvent.ctrlKey || keyboardEvent.altKey)
			return;
		let key = keyboardEvent.keyCode;

		if (key == 109 || key == 189) { // Minus Key
			// var val = this.control.value;
			var val = this.ele.nativeElement.value;
			if (val.startsWith('-'))
				val = val.substr(1);
			else {
				val = '-' + val;
			}
			event.preventDefault();
			this.control.setValue(val);
			// this.ele.nativeElement.value = val;
			this.form['_pristine'] = false;

			return;
		}

		if (!DzUtil.keyvalid_decimal(key)) {
			event.preventDefault();
			return;
		}
	}

	onKeyDown2(key) {
		if (key == 109 || key == 189) {
			var val = this.control.value;
			if (val.startsWith('-'))
				val = val.substr(1);
			else {
				val = '-' + val;
			}
			this.control.setValue(val);
			event.preventDefault();
			return;
		}
		else return;

	}

	@HostListener('blur') onBlur() {
		let val = this.control.value;
		let nval = DzUtil.parse_currency(val);

		if (this.flummy && val.substr(0, 1) == '2') {
			let message = 'Feld darf nicht mit \'2\' anfangen - just for fun';
			this.control.setErrors({'flummy': message});
			return;
		}

		if (isNaN(nval)) {
			console.log('Format ungültig');
			this.control.setValue(val);
			return;
		}

		if (nval < 0)
			this.renderer.setElementClass(this.ele.nativeElement, 'currency-minus', true);
		else
			this.renderer.setElementClass(this.ele.nativeElement, 'currency-plus', true);

		this.control.setValue(DzUtil.format_currency(nval));
		// this.renderer.setElementStyle(this.ele.nativeElement, 'text-align', 'right');
	}

	constructor(private ele: ElementRef, private renderer: Renderer) {
		this.formControlName = this.ele.nativeElement.attributes['formControlName'].value
	}

	ngOnInit(): any {
		this.control = this.form.controls[this.formControlName] as FormControl;

		// this.renderer.setElementStyle(this.ele.nativeElement, 'text-align', 'right');
		this.nokey = this.ele.nativeElement.hasAttribute('nokey')
		this.flummy = this.ele.nativeElement.hasAttribute('flummy')
		// this.onBlur();
	}

}
