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
		$('.result div').text('0');
		$('.output-container__error p').text('').text(unknownError);
		$('.output-container__error').removeClass('hidden');
	}
}

//Largely based on numericInput.js by Joshua De Leon
unitConverter.handleInput = function(min, max) {
	$('#numericinput').keypress(function(event) {
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


			if (inputCode == 46)	// Conditions for a period (decimal point)
			{
				
				//Disallows more than one decimal point.
				if (currentValue.match(/[.]/)) 
					return false; 
			}

			else if (inputCode == 8 || inputCode == 67 || inputCode == 86) 	// Allows backspace , ctrl+c ,ctrl+v (copy & paste)
				return true; 

			else								// Disallow non-numeric
				return false; 


		}

	});

	$('#numericinput').keyup(function(event) {
		var currentValue = $(this).val();
		var result = 0;
		if (!isNaN(currentValue) && currentValue != '') {
			result = parseFloat(currentValue) * 1200;
		} else {
			result = 0;
		}
		fitty('.result div', { maxSize: 32 });
		$('.result div').text(result);
	});

	$('.period').click(function() {
		console.log('simpress');
		var e = jQuery.Event('keydown');
		e.which = 190;
		e.keycode = 190;
		$('#numericinput').focus().trigger(e);
		// simulateKeyPress('.');
	});

	function simulateKeyPress(character) {
	  // jQuery.event.trigger({ type : 'keypress', which : character.charCodeAt(0) });
	}

}

// Private function for selecting cursor position. Makes IE play nice.
// http://stackoverflow.com/questions/263743/how-to-get-caret-position-in-textarea
unitConverter.getCaret = function(element) {
	if (element.selectionStart) {
		return element.selectionStart; 
	}

	else if (document.selection) //IE specific
	{ 
		element.focus(); 

		var r = document.selection.createRange(); 
		if (r == null) 
			return 0; 

		var re = element.createTextRange(), 
		rc = re.duplicate(); 
		re.moveToBookmark(r.getBookmark()); 
		rc.setEndPoint('EndToStart', re); 
		return rc.text.length; 
	}  

	return 0;

}

$(document).ready(function() {
	
	unitConverter.handleInput(0, 999999999.99);
	unitConverter.switchKeypads();
	unitConverter.selectCurrency();
});