var unitConverter = {};

unitConverter.switchKeypads = function() {
	$('.switch-input, .switch-output').click(
		function() {
			var keypad = $(this).parent().parent().find('.keypad');
			var siblingKeypad = $('.keypad').not(keypad);
			$(keypad).toggleClass('hidden');
			$(siblingKeypad).addClass('hidden');
		}
	);
}

unitConverter.selectCurrency = function() {
	$('.key').not('.period').click(
		function() {
			
			if ( !$(this).hasClass('inactive') ) {

				var selectedCurrency = $(this).text();
				var button = $(this).parent().parent().find('button');
				var buttonCurrency = $(button).text();
				console.log(selectedCurrency);
				//take label from key 
				//and put it in an input
				$(button).text(selectedCurrency);
				//take label from input 
				//and put it on a key
				$(this).text(buttonCurrency);

				$('.key').each(function() {
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


		}
	);
}

unitConverter.handleErrors = function(mode) {
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
}

$(document).ready(function() {

	unitConverter.switchKeypads();
	unitConverter.selectCurrency();

});