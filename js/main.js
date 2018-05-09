'use strict';

var unitConverter = {};
unitConverter.fromCurrency = 'RUB';
unitConverter.toCurrency = 'USD';
unitConverter.updated = new Date();
unitConverter.monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
unitConverter.hideKeypad = false;

fx.settings = {
	from: "RUB",
	to: "USD"
};
fx.rates = {};
fx.base = 'EUR';
var result = 0;

unitConverter.switchKeypads = function () {
	$('.switch-input, .switch-output').click(function () {
		var keypad = $(this).parent().parent().find('.keypad');
		var siblingKeypad = $('.keypad').not(keypad);
		$(keypad).toggleClass('hidden');
		$(siblingKeypad).addClass('hidden');
		unitConverter.hideKeypad = false;
	});
};

unitConverter.selectCurrency = function () {
	$('.key').not('.period').click(function () {

		if (!$(this).hasClass('inactive')) {

			var selectedCurrency = $(this).text();
			var button = $(this).parent().parent().find('button');
			var buttonCurrency = $(button).text();
			//take label from key 
			//and put it in an input
			$(button).text(selectedCurrency);
			//take label from input 
			//and put it on a key
			$(this).text(buttonCurrency);

			if ($(this).parent().parent().hasClass('input-container')) {
				unitConverter.fromCurrency = selectedCurrency;
			} else {
				unitConverter.toCurrency = selectedCurrency;
			}

			$('.key').each(function () {
				if (!unitConverter.hideKeypad) {
					$('.keypad').addClass('hidden');
					unitConverter.hideKeypad = !unitConverter.hideKeypad;
				}
				var label = $(this).text();
				$(this).removeClass('inactive');
				if (label == selectedCurrency || label == $('.switch-input').text() || label == $('.switch-output').text()) {
					$(this).addClass('inactive');
				}
			});

			if ($('.switch-input').text() == $('.switch-output').text()) {
				unitConverter.handleErrors(2);
			} else {
				unitConverter.handleErrors(0);
			}

			var currentValue = $('input').val();
			unitConverter.handleValues(currentValue, unitConverter.fromCurrency, unitConverter.toCurrency);
		}
	});
};

unitConverter.handleErrors = function (mode) {
	var unknownError = '';
	if (mode == 0) {
		$('.output-container__error').addClass('hidden');
	} else {
		if (mode == 1) {
			unknownError = 'Can’t convert. Try to reload';
		} else {
			unknownError = 'Wrong input';
		}
		$('.result').text('0');
		$('.output-container__error p').text('').text(unknownError);
		$('.output-container__error').removeClass('hidden');
	}
};

//Largely based on numericInput.js by Joshua De Leon
unitConverter.handleInput = function (tp, min, max) {



	// Check money.js has finished loading:
	if (typeof fx !== "undefined" && fx.rates) {
		fx.rates = tp[0];
		fx.base = tp[1];
	} else {
		// If not, apply to fxSetup global:
		var fxSetup = {
			rates: tp[0],
			base: tp[1]
		};
	}

	$('#numericinput').keypress(function (event) {
		var inputCode = event.which;
		var currentValue = $(this).val();
		
		//If the value isn't empty
		if (currentValue.length > 0) {
			//Get the float value, even if we're not using floats this will be ok
			var floatValue = parseFloat(currentValue);

			//If min is specified and the value is less set the value to min
			if (min !== undefined && floatValue < min) {
				$(this).blur().val(min);
			}

			//If max is specified and the value is less set the value to max
			if (max !== undefined && floatValue > max) {
				$(this).blur().val(max);
			}
		}

		if (inputCode > 0 && (inputCode < 48 || inputCode > 57)) {
			// Conditions for a period (decimal point)
			if (inputCode == 46) {

				//Disallows more than one decimal point.
				if (currentValue.match(/[.]/)) return false;
			}

			// Allows backspace , ctrl+c ,ctrl+v (copy & paste)
			else if (inputCode == 8 || inputCode == 67 || inputCode == 86) return true;
				// Disallow non-numeric
				else return false;
		}
	});

	$('#numericinput').keyup(function (event) {
		var currentValue = $(this).val();
		unitConverter.handleValues(currentValue, unitConverter.fromCurrency, unitConverter.toCurrency);
	});

	$('.period').click(function () {
		$('#numericinput').sendkeys('.');
	});
};

unitConverter.handleValues = function (v, fc, tc) {
	var r = 0;
	if (!isNaN(v) && v != '') {
		r = fx.convert(v, { from: fc, to: tc }).toFixed(2);
	} else {
		r = 0;
	}
	$('.result').text(unitConverter.numberWithSpaces(r));
	unitConverter.fitNumbers('.result');
};

unitConverter.getRates = function (caller) {
	unitConverter.temp = {};
	$.getJSON(
	'https://api.fixer.io/latest', function (data) {
		unitConverter.temp = [data.rates, data.base];
		$('.date').text(unitConverter.monthNames[unitConverter.updated.getMonth()] + ' ' + unitConverter.updated.getDate() + ' ' + unitConverter.updated.getHours() + ':' + (parseInt(unitConverter.updated.getMinutes()) < 10 ? '0'+unitConverter.updated.getMinutes() : unitConverter.updated.getMinutes())); //show the actual date for rates
		caller(unitConverter.temp);
	}).fail(function () {
		unitConverter.handleErrors('1');
	});
};

 unitConverter.numberWithSpaces = function (x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u0020');
}

unitConverter.fitNumbers = function (element) {
	var w = $(element).width();
	var symbolsCount = $(element).text().length;
	var fontSize = parseInt($(element).css('font-size'), 10);

	var tempSize = 1.75 * w / symbolsCount;
	fontSize = tempSize > 32 ? 32 : tempSize;

	$(element).css('font-size', fontSize);
};

$(document).ready(function () {
	unitConverter.getRates(function (temp) {
		unitConverter.handleInput(temp, 0, 999999999.99);
	});
	unitConverter.switchKeypads();
	unitConverter.selectCurrency();
});