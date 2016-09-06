let MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

export class DzUtil {

	static test(s: string): string {
		return 'Detti ' + s;
	}

	static format_currency(value: string): string {
		if (value == null)
			return value;

		/*
		 let val: number = parseFloat(value);

		 if (isNaN(val))
		 return value;
		 */
		var val = Number(value);

		if (isNaN(val))
			return value;

		// Jetzt haben wir ein gültige number
		let cur_regex = /(\d)(?=(\d\d\d)+(?!\d))/g; // Dreiergruppen Ziffern ohne Look Behind

		// Runden zwei Stellen hinter dem Komma
		val = Math.round(val * 100) / 100;
		let sval = val.toString();

		// Auffüllen fehlende Nachkommastellen
		var vals = sval.split('.');
		if (!vals[1])
			vals[1] = '00';
		else if (vals[1].length < 2)
			vals[1] = vals[1] + '00'.substr(0, 2 - vals[1].length);

		// Tausenderpunkte einfügen
		vals[0] = vals[0].replace('.', ',').replace(cur_regex, "$1.");

		// Vorkommastellen, Dezimalpunkt, Nachkommastellen und € Symbol zusammenfügen
		return vals[0] + ',' + vals[1] + " €";
	}

	static parse_currency(value) {
		if (!value) return value;

		return value
				.replace(/\./g, '')
				.replace(',', '.')
				.replace('€', '')
				.replace(/\s/g, '');

	}

	static keyvalid_decimal(key): boolean {
		if (key >= 48 && key <= 57)       // ziffern
			return true;
		else if (
				key == 37 || key == 39    		// pfeile rechts / links
				|| key == 13                  // enter
				|| key == 8                   // backspace
				|| key == 9                   // tab
				|| key == 46                  // delete
				|| key == 188 || key == 110		// (dezimal) komma
		)
			return true;
		else
			return false;

	}

	static keyvalid_integer(key): boolean {
		if (key >= 48 && key <= 57)       // ziffern
			return true;
		else if (
				key == 37 || key == 39  		  // pfeile rechts / links
				|| key == 13                  // enter
				|| key == 8                   // backspace
				|| key == 9                   // tab
				|| key == 46                  // delete
		)
			return true;
		else
			return false;

	}

	// ------------------------------
	// Date
	// ------------------------------

	static format_date(d: Date): string {

		if (!d) return '';

		return DzUtil.pz2(d.getDate()) + '.' + DzUtil.pz2(d.getMonth() + 1) + '.' + DzUtil.pz2(d.getFullYear());
	}

	static format_date2(d: string): string | Date {

		if (!d) return d;

		return d.substr(0, 2) + '.' + d.substr(2, 2) + '.' + d.substr(4, 4);
	}

	static format_date_json(dateEdit: string): string {
		if (!dateEdit) return dateEdit;
		dateEdit = dateEdit.replace(/\./g, '');
		return dateEdit.substr(4, 4) + '-' + dateEdit.substr(2, 2) + '-' + dateEdit.substr(0, 2) + ' 00:00:00';
	}

	static format_date_json_to_display(json_date: string): string {
		//2016-08-29 00:00:00 -> 29.08.2016
		if (!json_date || json_date.length != '2016-08-29 00:00:00'.length) return json_date;
		return json_date.substr(8, 2) + '.' + json_date.substr(5, 2) + '.' +  json_date.substr(0, 4);
}

	static parse_date(value: string): string {
		if (!value) return value;
		return value.replace(/\./g, '');

	}

	static isDate(dateEdit: string): boolean | string {
		if (!dateEdit) return dateEdit;

		let d = new Date(Number(dateEdit.substr(4, 4)), Number(dateEdit.substr(2, 2)) - 1, Number(dateEdit.substr(0, 2)));
		let test = DzUtil.pz2(d.getDate()) + '' + DzUtil.pz2(d.getMonth() + 1) + '' + d.getFullYear();

		return test === dateEdit;
	}

	static dateDiffString(dateEdit: string): string {
		if (!dateEdit) return dateEdit;

		let d = new Date(Number(dateEdit.substr(4, 4)), Number(dateEdit.substr(2, 2)) - 1, Number(dateEdit.substr(0, 2)));
		let test = DzUtil.pz2(d.getDate()) + '' + DzUtil.pz2(d.getMonth() + 1) + '' + d.getFullYear();

		if (test != dateEdit)
			return '';

		let diff = DzUtil.dateDiff(d);
		if (diff == 0)
			return 'Heute';
		else if (diff == -1)
			return 'Gestern';
		else if (diff == 1)
			return 'Morgen';

		else if (diff > 0)
			return 'in ' + diff + ' Tagen';
		else if (diff < 0)
			return 'vor ' + -diff + ' Tagen';

		return '';
	}

	static parse2Date(dateEdit: string): Date {
		if (!dateEdit) return null;
		return new Date(Number(dateEdit.substr(4, 4)), Number(dateEdit.substr(2, 2)) - 1, Number(dateEdit.substr(0, 2)));
	}

	// ------------------------------
	// Universal methods
	// ------------------------------

	static pz2(s: number): string | number {

		if (isNaN(Number(s))) return s;

		return '00'.substr(0, 2 - s.toString().length) + s;
	}

	static padZeroLeft(width: number, value: string) {
		if (!value || value.length === 0) return value;
		//noinspection TypeScriptUnresolvedFunction
		return '0'.repeat(width).substr(0, width - value.toString().length) + value;
	}

	static autocompleteDate(n: string): Date {

		let heuteD = new Date();
		heuteD.setHours(0, 0, 0, 0);
		let heute = {monat: (heuteD.getMonth() + 1).toString(), jahr: heuteD.getFullYear().toString()};

		if (n.length == 1)
			n = '0' + n;
		if (n.length == 2)
			n += heute.monat;
		if (n.length == 3)
			n = n.substr(0, 2) + '0' + n.substr(2);
		if (n.length == 4)
			n = n.substr(0, 4) + heute.jahr;
		if (n.length == 5)
			n = n.substr(0, 4) + heute.jahr.substr(0, 3) + n.substr(4);
		if (n.length == 6)
			n = n.substr(0, 4) + '20' + n.substr(4);

		let result = new Date(+n.substr(4, 4), +n.substr(2, 2) - 1, +n.substr(0, 2));

		let val = DzUtil.parse_date(DzUtil.format_date(result));
		if (val === n)
			return result;
		else
			return null;
	}

	static dateDiff(date: Date): number {
		let today = new Date();
		today.setHours(0, 0, 0, 0);
		// let diff =
		return Math.round((+date - +today) / MILLISECONDS_PER_DAY);
	}

}
