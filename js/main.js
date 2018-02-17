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

$(document).ready(function () {

	unitConverter.switchKeypads();
});