import {Directive, OnInit, Input, ElementRef, Renderer, HostListener} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {DzUtil} from "../accounting/dz-utils";

@Directive({
  selector: '[date-edit]'
})

export class DateEdit implements OnInit {
  private control: FormControl;
  private formControlName: string;
  private nokey: boolean = false;

  @Input('date-edit') form: FormGroup;
  @Input('no-keypress') noKeypress: boolean = false;

  @HostListener('focus') onFocus() {
    let val = this.ele.nativeElement.value;
    let val1 = DzUtil.parse_date(val);
    this.ele.nativeElement.value = val1;
    this.control['_hint'] = DzUtil.dateDiffString(val1);
  }

  @HostListener('keydown') onKeyDown($event: KeyboardEvent) {

    let keyboardEvent = event as KeyboardEvent;

    if (this.nokey) return;

    if (keyboardEvent.metaKey || keyboardEvent.ctrlKey || keyboardEvent.altKey)
      return;

    let key = keyboardEvent.keyCode;
    let value = this.ele.nativeElement.value;

    // S = yesterday
    if (key == 83) {
      let d = new Date();
      d.setDate(d.getDate() - 1);
      let val1 = DzUtil.format_date(d);
      let val = DzUtil.parse_date(val1);
      this.control.setValue(val1);
      this.ele.nativeElement.value = val;
      this.form['_pristine'] = false;
    }

    // D = today
    if (key == 68) {
      let d = new Date();
      let val1 = DzUtil.format_date(d);
      let val = DzUtil.parse_date(val1);
      this.control.setValue(val1);
      this.ele.nativeElement.value = val;
      this.form['_pristine'] = false;
    }

    // F = tomorrow
    if (key == 70) {
      let d = new Date();
      d.setDate(d.getDate() + 1);
      let val1 = DzUtil.format_date(d);
      let val = DzUtil.parse_date(val1);
      this.control.setValue(val1);
      this.ele.nativeElement.value = val;
      this.form['_pristine'] = false;
    }

    if (key == 107 || key == 187) { 		// + = plus 1 day
      if (!DzUtil.isDate(value)) {
        event.preventDefault();
        return;
      }
      let d = DzUtil.parse2Date(value);
      d.setDate(d.getDate() + 1);
      let val1 = DzUtil.format_date(d);
      let val = DzUtil.parse_date(val1);
      this.control.setValue(val1);
      this.ele.nativeElement.value = val;
      this.form['_pristine'] = false;
    }
    if (key == 109 || key == 189) { 		// - = minus 1 day
      if (!DzUtil.isDate(value)) {
        event.preventDefault();
        return;
      }
      let d = DzUtil.parse2Date(value);
      d.setDate(d.getDate() - 1);
      let val1 = DzUtil.format_date(d);
      let val = DzUtil.parse_date(val1);
      this.control.setValue(val1);
      this.ele.nativeElement.value = val;
      this.form['_pristine'] = false;
    }

    if (key == 65) {										// A = Autocomplete
      let d = DzUtil.autocompleteDate(value);
      if (d) {
        let val1 = DzUtil.format_date(d);
        let val = DzUtil.parse_date(val1);
        this.control.setValue(val1);
        this.ele.nativeElement.value = val;
        this.form['_pristine'] = false;
      }
    }

    if (!DzUtil.keyvalid_integer(key)) {
      event.preventDefault();
      return;
    }
  }

  @HostListener('blur') onBlur() {
    var value = this.ele.nativeElement.value;
    if (!DzUtil.isDate(value)) {
      let d = DzUtil.autocompleteDate(value);
      if(d)
        value = DzUtil.parse_date(DzUtil.format_date(d));
      else
        return;
    }

    this.control.setValue(DzUtil.format_date2(value));
    this.control['_hint'] = '';
  }

  constructor(private ele: ElementRef/*, private renderer: Renderer*/) {
    this.formControlName = this.ele.nativeElement.attributes['formControlName'].value;
  }

  ngOnInit(): any {
		this.control = this.form.controls[this.formControlName] as FormControl;
  }
}

