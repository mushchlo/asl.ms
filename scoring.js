var word = "";
var i = 0;
var j = 0;
var speed = new Array();
var used_words = new Array();
var score = 0;
// boolean switches to control playback
var newpage = false; // autostart first word (false = don't autostart)
var playing;
var iscorrect;
var ischecked;
speed[0] = 1000; // 1 second
speed[1] = 666; // 2/3 second
speed[2] = 333; // 1/3 second
speed[3] = 200; // 1/5 second
// default speed is medium
speed_val = 1;
var new_speed = speed[speed_val];
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
			eval("document.images['ASLalphabet'].src='images/" + word.charAt(i) + word.charAt(i++) + ".gif'");
		} else {
			eval("document.images['ASLalphabet'].src='images/" + word.charAt(i++) + ".gif'");
		}
	} else {
		document.images['ASLalphabet'].src = "images/blank.gif";
		i++;
	}
	setTimeout("update_letter()", new_speed);
}

function set_speed(speed_val_arg) {
	new_speed = speed[speed_val_arg];
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
		new_speed *= 1.3;
	} else if (speed_val_arg == 1) {
		new_speed /= 1.3;
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
	ischecked = true;
	if(document.forms[0].input.value.toLowerCase() == word) {
		iscorrect = true;
		document.images['ASLalphabet'].src = "images/goodjob.png";
		playing = false;
		score++;
		document.getElementById('scoretxt').innerHTML = String(score);
	} else {
		if(document.forms[0].input.value == "") {
			play();
		} else {
			document.images['ASLalphabet'].src = "images/tryagain.png";
			playing = false;
			score--;
			document.getElementById('scoretxt').innerHTML = String(score);
		}
	}
	document.asl_words.input.select();
	return false;
}

function new_word() {
	var isUsed = false;
	var k;
	while (true) {
		var rand = Math.random();
		var randNum = Math.floor(rand * maxindex+1);
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
