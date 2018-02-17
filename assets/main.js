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
	$('.key').not('.inactive').click(
		function() {
			var selectedCurrency = $(this).text();
			var button = $(this).parent().parent().find('button');
			var buttonCurrency = $(button).text();

			$(button).text(selectedCurrency);
			$(this).text(buttonCurrency);
		}
	);
}

$(document).ready(function() {

	unitConverter.switchKeypads();
	unitConverter.selectCurrency();

});