'use strict';

var unitConverter = {};

unitConverter.switchKeypads = function () {
	$('.switch-input, .switch-output').click(function () {
		var keypad = $(this).parent().parent().find('.keypad');
		var siblingKeypad = $('.keypad').not(keypad);
		$(keypad).toggleClass('hidden');
		$(siblingKeypad).addClass('hidden');
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

			$('.key').each(function () {
				var label = $(this).text();
				$(this).removeClass('inactive');
				if (label == selectedCurrency) {
					$(this).addClass('inactive');
				}
			});

			if ($('.switch-input').text() == $('.switch-output').text()) {
				unitConverter.handleErrors(2);
			} else {
				unitConverter.handleErrors(0);
			}
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
unitConverter.handleInput = function (min, max) {
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

			if (inputCode == 46) // Conditions for a period (decimal point)
				{

					//Disallows more than one decimal point.
					if (currentValue.match(/[.]/)) return false;
				} else if (inputCode == 8 || inputCode == 67 || inputCode == 86) // Allows backspace , ctrl+c ,ctrl+v (copy & paste)
				return true;else // Disallow non-numeric
				return false;
		}
	});

	$('#numericinput').keyup(function (event) {
		console.log('Caret at: ', event.target.selectionStart);
		var currentValue = $(this).val();
		var result = 0;
		if (!isNaN(currentValue) && currentValue != '') {
			result = parseFloat(currentValue) * 1200;
		} else {
			result = 0;
		}

		$('.result').text(result);
		unitConverter.fitNumbers('.result');
	});

	$('.period').click(function () {
		$('#numericinput').sendkeys('.');
	});
};

unitConverter.fitNumbers = function (element) {
	var w = $(element).width();
	var symbolsCount = $(element).text().length;
	var fontSize = parseInt($(element).css('font-size'), 10);

	var tempSize = 1.75 * w / symbolsCount;
	fontSize = tempSize > 32 ? 32 : tempSize;

	$(element).css('font-size', fontSize);
};

$(document).ready(function () {

	unitConverter.handleInput(0, 999999999.99);
	unitConverter.switchKeypads();
	unitConverter.selectCurrency();
});