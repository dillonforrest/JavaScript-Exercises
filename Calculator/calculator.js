var memory = '0';     // initialize memory
var current = '0';    // initialize current display
var operation = 0;    // records code for operations
var MAXLENGTH = 30;   // max number of digits before decimal

function displayDigit (d) {
	if (current.length > MAXLENGTH) {
		current = "Too many digits!";
	} else {
		if ( (eval(current) === 0) && (current.indexOf('.') === -1 ) ) {
			current = d;
		} else {
			current = current + d;
		};
	};
	document.Calculator.Display.value = current;
};

function displayDot () {
	if (current.length === 0) {
		current = "0.";
	} else {
		if (current.indexOf('.') === -1) {
			current = current + '.';
		};
	};
	document.Calculator.Display.value = current
};

function doExponent () {
	if (current.indexOf('e') == -1) {
		current = current + 'e0';
		document.Calculator.Display.value = current
	};
};

function changePlusMinus () {
	if (current.indexOf('e') !== -1) { // if there is an exponent
		var epos = current.indexOf('e-');
			if (epos !== -1) {
				current = current.substring(0,1+epos) +
					current.substring(2+epos); // remove the minus sign
			} else {
				epos = current.indexOf('e');
				current = current.substring(0,1+epos) + '-' +
					current.substring(2+epos); // insert the minus sign
			};
	} else { // if there is NO exponent
		if (current.indexOf('-') === 0) {
			current = current.substring(1); // remove the minus sign
		} else {
			current = '-' + current; // insert the minus sign
		};
	};
	document.Calculator.Display.value = current;
};

function clear () {
	current = '0'
	document.Calculator.Display.value = current;
};

function allClear () {
	current = '0';
	operation = 0;
	memory = '0';
	document.Calculator.Display.value = current;
};

function operate (op) {
	if (op.indexOf('*') > -1) { operation = 1; };
	if (op.indexOf('/') > -1) { operation = 2; };
	if (op.indexOf('+') > -1) { operation = 3; };
	if (op.indexOf('-') > -1) { operation = 4; };

	memory = current;
	current = '';
	document.Calculator.Display.value = current;
};

function calculate () {
	if (operation === 1) { current = eval(memory) * eval(current); };
	if (operation === 2) { current = eval(memory) / eval(current); };
	if (operation === 3) { current = eval(memory) + eval(current); };
	if (operation === 4) { current = eval(memory) - eval(current); };
	operation = 0;
	memory = '0';
	document.Calculator.Display.value = current;
};

function fixCurrent () {
	current = docment.Calculator.Display.value;
	current = '' + parseFloat(current);
	if (current.indexOf('NaN') !== -1) { // if there are non-numbers
		current = "Please enter only digits.";
	};
	document.Calculator.Display.value = current;
};
