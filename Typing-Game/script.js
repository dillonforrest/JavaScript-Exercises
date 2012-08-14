window.onload = function () {

var document = window.document
function $ (id) {
	return document.getElementById(id);
}

function doKey (keyPressed) {
	if (window.event.keyCode === 13) {
		var submittedLetter = $('inputbox').value;
		if ( isCorrectLetter(submittedLetter) ) {
			increaseScore('correct_count');
		} else {
			increaseScore('wrong_count');
		}
		$('inputbox').value = '';
		createCommand();
	}
}

function isCorrectLetter (letter) {
	var original = $('command').firstChild.textContent.substring(
			"Type this: ".length);
	if ( letter == original ) {
		return true;
	} else {
		return false;
	}
}

function increaseScore (id) {
	if ( $(id).firstChild ) {
		var count = $(id).firstChild.textContent;
		$(id).removeChild( $(id).firstChild );
	} else {
		var count = 0;
	}
	count++; // add the point
	$(id).appendChild( document.createTextNode(count) );
}

function getLetter () {
	var letters = 'abcdefghijklmnopqrstuvwxyz';
	var i = Math.floor( Math.random() * 27 );
	var randomLetter = letters.substring(i, i + 1);
	return randomLetter;
}

function createCommand () {
	if ( $('command').firstChild ) {
		$('command').removeChild( $('command').firstChild );
	}
	var randomLetter = getLetter();
	var command = "Type this: " + randomLetter;
	$('command').appendChild( document.createTextNode(command) );
}

// register event
document.getElementsByTagName("body")[0].onkeypress = doKey;

// onload
createCommand();

}
