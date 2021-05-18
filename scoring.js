var word = "";
var j = 0;
var used_words = new Array();
var score = 0;

// boolean switches to control playback
var newpage = true; // autostart first word (false = don't autostart)
var playing;
var iscorrect;
var ischecked;

var speedvals = [ 1000, 666, 333, 200 ];
var play_speed = speedvals[1];
// in ms, default speed is medium

length_lim = 99;

// sort by word length
// if you don't like the delay then sort the list in the words.js file and remove this sort
words.sort((a,b) => a.length - b.length);
var maxindex = count_available(words, length_lim);

function inalphabet(character) {
	return (/[a-zA-Z]/).test(character);
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function updateScore() {
	document.getElementById('scoretxt').innerHTML = String(score);
}

// returns the number of words with word length <= maxlength
// assumes wordlist is sorted by length, shortest words first
function count_available(wordlist, maxlength) {
	for (var i = 0; i < wordlist.length && wordlist[i].length <= maxlength; i++) {}
	return Math.max(0, i - 1);
}


function clear_used() {
	delete used_words;
	used_words = new Array();
	j = 0;
}

async function play() {
	var toplay;

	if(playing)
		return;

	playing = true;
	document.asl_words.input.focus();
	for(var i = 0; i < word.length; i++){
		toplay = word.charAt(i);
		if(word.charAt(i) === word.charAt(i-1))
			toplay = toplay + toplay;
		if(!inalphabet(toplay))
			toplay = "blank";

		document.images['ASLalphabet'].src = "images/" + toplay + ".gif";
		await sleep(play_speed);
	}
	document.images['ASLalphabet'].src = "images/blank.gif";
	playing = false;
}

function change_speed(speed_val_arg) {
	if (speed_val_arg == 0)
		play_speed *= 1.3;
	else if (speed_val_arg == 1)
		play_speed /= 1.3;

	score = 0;
	updateScore();
	play();
}

function set_speed(speed_val_arg) {
	play_speed = speedvals[speed_val_arg];
	play();
}

function set_length_lim(length_lim_arg) {
	iscorrect = false;
	ischecked = false;
	length_lim = length_lim_arg;
	maxindex = count_available(words, length_lim);
	clear_used();
	document.asl_words.input.focus();

	score = 0;
	updateScore();
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
	updateScore();
	document.asl_words.input.select();
	document.forms[0].input.value = "";

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
			word = words[randNum].toLowerCase();
			document.asl_words.input.focus();
			document.forms[0].input.value = "";
			break;
		}
	}
	if (newpage) {
		newpage = false;
		return;
	} else {
		ischecked = false;
		iscorrect = false;
		play();
	}
}
