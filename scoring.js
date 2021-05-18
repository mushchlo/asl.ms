var word = "";
var i = 0;
var j = 0;
//var speedvals = new Array();
var used_words = new Array();
var score = 0;

// boolean switches to control playback
var newpage = false; // autostart first word (false = don't autostart)
var playing;
var iscorrect;
var ischecked;

var speedvals = [ 1000, 666, 333, 200 ];
var play_speed = speedvals[1];
// in ms, default speed is medium

length_lim = 99;
var all_letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

// returns the number of words with word length <= maxlength
// assumes wordlist is sorted by length, shortest words first
function count_available(wordlist, maxlength) {
	for (var i = 0; i < wordlist.length && wordlist[i].length <= maxlength; i++) {}
	return Math.max(0, i - 1);
}

function sortWordlength(a, b) {
	return a.length - b.length;
}

function clear_used() {
	delete used_words;
	used_words = new Array();
	j = 0;
}

// sort by word length
// if you don't like the delay then sort the list in the words.js file and remove this sort
words.sort(sortWordlength);
var maxindex = count_available(words, length_lim);

function update_letter() {
	if(!playing) {
		return;
	}
	if(i >= word.length) {
		document.images['ASLalphabet'].src = "images/blank.gif";
		return;
	}
	if(all_letters.indexOf(word.charAt(i)) >= 0) {
		// check for double letter
		if(word.charAt(i) == word.charAt(i - 1)) {
			document.images['ASLalphabet'].src = "images/" + word.charAt(i) + word.charAt(i++) + ".gif";
		} else {
			document.images['ASLalphabet'].src = "images/" + word.charAt(i++) + ".gif";
		}
	} else {
		document.images['ASLalphabet'].src = "images/blank.gif";
		i++;
	}
	setTimeout("update_letter()", play_speed);
}

function set_speed(speed_val_arg) {
	play_speed = speedvals[speed_val_arg];
	play();
}

function play() {
	playing = true;
	iscorrect = false;
	ischecked = false;
	i = 0;
	document.asl_words.input.focus();
	update_letter();
}

function change_speed(speed_val_arg) {
	if (speed_val_arg == 0) {
		play_speed *= 1.3;
	} else if (speed_val_arg == 1) {
		play_speed /= 1.3;
	}
	play();
}

function set_length_lim(length_lim_arg) {
	playing = true;
	iscorrect = false;
	ischecked = false;
	i = 0;
	length_lim = length_lim_arg;
	maxindex = count_available(words, length_lim);
	clear_used();
	document.asl_words.input.focus();
	new_word();
}

function check_word() {
	if(ischecked) {
		if(iscorrect) {
			new_word();
		} else {
			play();
		}
		return false;
	}

	if(document.forms[0].input.value == "") {
		return false;
	}

	if(document.forms[0].input.value.toLowerCase() == word) {
		iscorrect = true;
		document.images['ASLalphabet'].src = "images/goodjob.png";
		score++;
	} else {
		iscorrect = false;
		document.images['ASLalphabet'].src = "images/tryagain.png";
		score--;
	}

	ischecked = true;
	playing = false;
	document.getElementById('scoretxt').innerHTML = String(score);
	document.asl_words.input.select();

	return false;
}

function new_word() {
	var randNum;
	var isUsed;
	var k;

	while (true) {
		randNum = Math.floor(Math.random() * maxindex+1);
		isUsed = false;

		if (used_words.length >= maxindex) {
			clear_used();
		} else {
			for (k = 0; k < used_words.length; k++) {
				if (randNum == used_words[k]) {
					isUsed = true;
				}
			}
		}
		if (!isUsed) {
			used_words[j++] = randNum;
			word = words[randNum];
			document.forms[0].input.value = "";
			document.asl_words.input.focus();
			break;
		}
	}
	if (newpage) {
		newpage = false;
		return;
	} else {
		play();
	}
}
