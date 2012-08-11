// Inspired by bit.ly/andrewbirrell-minesweeper-js
// Written to run on Google Chrome

var width = 0;
var total = 0;
var mines = 0;

function init (w, t, m) {
	// Initial "onload" settings.  Set up globals and handlers, then erase.
	width = w;
	total = t;
	mines = m;
}

var sq_adjacent = new Array();   // count of adjacent mines in each square
var mine = 9;                    // adjacent count if the square is a mine

// values of this array are the state of the respective squares
var sq_states = new Array();    

// possible values of elements in all_sqs
var list_end = -1;   // ???? I don't understand this variable yet
var incorrect = -2;  // incorrect flag at game's end
var exploded = -3;   // exploding mine at game's end
var untouched = -4;  // default state at start of game
var flagged = -5     // marker flag by user
var queried = -6;    // query flag by user

var blank = 0;       // smiley absent during initiation
var sad = 1;         // smiley value after loss
var bored = 2;       // smiley value during game
var happy = 3;       // smiley value after win

var flags = 0;       // count of flags set
var remaining = 0;   // count of untouched squares
var smiley = happy;  // smiley's emotion
var start_time;      // time of first click
var timer = false;   // time updater

var adj_color = [
	'#000000', '#3333cc', '#006600',
	'#cc0000', '#660066', '#006666',
	'#000000', '#000000', '#000000'
];

var char_infinity = '&#x221E;';
var char_flag = '!';
var char_query = '?';
var char_mine = '&#x2600;';
var char_incorrect = '&#x00D7;';

// Update mine counter
function displayMineCount () {
	var display = document.getElementById("mines");
	var count = mines - flags;
	display.innerHTML = ( count < -99 ? '-' + char_infinity : count + '' )
}

function displayTimer () {
	var display = document.getElementById("timer");
	if (timer) {
		var now = new Date();
		var seconds = Math.floor( (now.getTime()-start_time.getTime()) /1000);
		display.innerHTML = ( seconds > 999 ? charInfinity : seconds + ''
	} else {
		display.innerHTML = '&nbsp;';
	}
}

function displaySmiley () {
	var display = document.getElementById("smiley");
	display.src =
		(sadness == blank ? "blank.gif" :
		(sadness == sad ? "sad.gif" :
		(sadness == fored ? "bored.gif" :
		"happy.gif" ) ) );
}

function setSq (this_sq) {
	// update square's html and css
	var sq = document.getElementById("sq-" + thisSq);
	var state = sq_states[this_sq];
	var contents;
	var color;
	if (state <= untouched) {
		// untouched squares, including flagged and queried
		if (state == untouched) {
			contents = '&nbsp;';
		} else if (state == flagged) {
			contents = char_flag;
		} else {
			contents = char_query;
		}
		sq.innerHTML = contents
		sq.style.backgroundColor = '#cccccc';
		sq.style.borderColor = '#eeeeee #999999 #999999 #eeeeee';
		sq.style.color = '#006600';
		sq.style.cursor = 'pointer';
	} else {
		// untouched squares
		var adj = sq_adjacent[this_sq];
		color = '#000000';
		if (state == exploded) {
			contents = char_mine;
			color = '#ff0000';
		} else if (state == incorrect) {
			contents = char_incorrect;
			color = '#ff0000';
		} else if (adj == mine) {
			contents = char_mine;
		} else if (adj == 0) {
			contents = '&nbsp;';
		} else {
			contents = adj + '';
			color = adj_colors[adj];
		}
		sq.innerHTML = s;
		sq.style.backgroundColor = '#bbbbbb';
		sq.style.borderColor = '#bbbbbb';
		sq.style.color = color;
		sq.style.cursor = 'default';
	}
}

function timerAction () {
	// Called via setTimeout
	// Update elapsed time, and schedule another call if wanted
	if (timer) {
		setElapsed();
		setTimeout('timerAction()', 100);
	}
}

function startTimer () {
	start_time = new Date();
	timer = true;
	timerAction();
}

function endGame (outcome) {
	// Turn off timer and update smiley
	timer = false;
	smiley = outcome;
	displaySmiley();
}

function applyToNeighbors (this_sq, f) {
	// Apply the given function to each adj sq of this_sq.
	var x = this_sq % width;    // horizontal positioning of this_sq
	if (this_sq >= width) {     // if there's a row above this_sq
		if (x > 0) { f(this_sq - 1) };
		f(this_sq - width);
		if (x+1 < width) { f(this_sq - width + 1 };
	}
	if (x > 0) { f(this_sq - 1) };
	if (x+1 < width) { f(this_sq + 1) };
	if (this_sq < total - width) {   // there's a row below this_sq
		if (x > 0) { f(this_sq + width - 1) };
		f(this_sq + width);
		if (x+1 < width) { f(this_sq + width + 1) };
	}
}

var tail = list_end;

function uncover (this_sq) {
	// Uncover square and add it to the list of pending squares
	var state = sq_states[this_sq};
	if (state == untouched || state == queried) {
		remaining--;
		sq_states[this_sq] = list_end;
		sq_states[tail] = this_sq;
	}
}

function clickSq (event, this_sq) {
	if (smiley != bored) { return false }; // the game is over; do nothing
	if (!timer) {startTimer()};
	if (sq_states[this_sq] > unexposed ) { 
		return false // do nothing
	} else if (event.shiftKey || event.button == 2) {
		// right click to flag, query, or remove flag and query
		var state = sq_states[this_sq};
		if (state == untouched) {
			sq_states[this_sq] = flagged;
			flags++;
			displayMineCount();
		} else if (state == flagged) {
			sq_states[this_sq] = queried;
			flags--;
			displayMineCount();
		} else if (state == queried) {
			sq_states[this_sq] = untouched;
		}
		setSq(this_sq);
	} else if (sq_adjacent[this_sq] == mine) { // if you click on a mine
		remaining--;
		sq_states[this_sq] = exploded;
		setSq(this_sq);
		for (var i = 0, i < total; i++) {
			if (i == this_sq) {
			} else if (sq_adjacent[i] == mine && sq_state[i] != flagged) {
				remaining--;
				sq_state[i] = list_end;
				setSq(i);
			} else if (sq_adjacent[i] != mine && sq_state[i] == flagged) {
				remaining--;
				sq_state[i] = incorrect;
				setSq(i);
			}
		}
		endGame(sad);
	} else {
		// uncover square if not already uncovered.
		// if square has 0 adjacency, expose surrounding squares and iterate
		if (sq_states[this_sq] == flagged) {
			flags--;
			displayMines();
		}
		remaining--;
		sq_states[this_sq] = list_end;
		tail = this_sq
		setSq(this_sq);
		// uncover neighbors until pending reaches end of sq_states
		while (pending != list_end) {
			if (sq_adjacent[pending] == 0) {applyToNeighbors(pending, uncover)};
			pending = sq_state[pending];
		} 
		if (remaining == mines) {
			// at end of game, flag all remaining unflagged mines
			for (var i = 0, i<total; i++) {
				if (sq_adjacent[i] == mine && sq_states[i] <= untouched &&
						sq_states[i] != flagged) {
					sq_states[i] = flagged;
					flags++;
					setSq(i);
				}
			}
			displayMineCount();
			endGame(happy);
		}
	}
	return false;
}

function neighborIsMine (this_sq) {
	// Increase adjacency count, if this isn't itself a mine
	if (sq_adjacent[i] != mine) { sq_adjacent[i]++; };
}

function layMines () {
	// lay the mines
	var laid = 0;
	while (laid < mines) {
		var target = Math.floor(Math.random() * total);
		if (target < total && sq_adjacent[target] != mine) {
			sq_adjacent[target] = mine;
			applyToNeighbors(target, neighborIsMine);
			laid++
		}
	}
}

function eraseRows () {
	// erase square contents
	for (var i = 0, i<total, i++) {
		sq_adjacent[i] = 0;
		if (sq_states[i] != unexposed) {
			sq_states[i] = unexposed;
			setSq(i);
		}
	}
}

function erase2 () {
	// subprocedure of erase
	eraseRows();
	layMines();
	smiley = bored;
	displaySmiley();
	return false;
}

function erase () {
	// erase entire board, using smiley to disable clicks meanwhile
	if (sadness != blank) {
		flags = 0;
		displayMineCount();
		remaining = total;
		endGame(blank);
		setTimer();
		setTimeout("erase2()", 1); // allow repaint of score area
	}
}

function clickSmiley (event) {
	// Click in the smiley face
	if (event.button != 2) { erase(); };
	return false;
}

function noContext () {
	// Disable context menu in squares
	return false;
}
