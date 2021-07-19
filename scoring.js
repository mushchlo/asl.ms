var word = "";
var used_words = new Array();

// boolean switches to control playback
var autostart = true; // autostart first word (false = don't autostart)
var newpage = true;
var play_id;
var iscorrect;
var ischecked;

var length_lim = 99;
var speedvals = [ 1000, 666, 333, 200 ];
var play_speed = speedvals[1];
// in ms, default speed is medium


// sort by word length
// if you don't like the delay then sort the list in the words.js file and remove this sort
words.sort((a,b) => a.length - b.length);
var maxindex = count_available(words, length_lim);


function inalphabet(character)
{
	return (/[a-zA-Z]/).test(character);
}

function updateScore(func)
{
	document.getElementById('scoretxt').innerHTML =
		String(func(Number(document.getElementById('scoretxt').innerHTML)));
}

// returns the number of words with word length <= maxlength
// assumes wordlist is sorted by length, shortest words first
function count_available(wordlist, maxlength)
{
	var i = 0;

	while(i < wordlist.length && wordlist[i].length <= maxlength)
		i++;
	return Math.max(0, i - 1);
}

function clear_used()
{
	delete used_words;
	used_words = new Array();
}

function showLetter(str, l)
{
	var toplay;

	clearTimeout(play_id);
	if(l >= str.length){
		document.images["ASLalphabet"].src = "images/blank.gif";
		return;
	}

	toplay = word.charAt(l);
	if(!inalphabet(toplay))
		toplay = "blank";
	else if(toplay === word.charAt(l-1))
		toplay = toplay + toplay;

	document.images["ASLalphabet"].src = "images/" + toplay + ".gif";

	play_id = setTimeout(showLetter, play_speed, str, l+1);
}

function play()
{
	document.asl_words.input.focus();
	showLetter(word, 0);
}

function change_speed(speedFunc)
{
	play_speed = speedFunc(play_speed);
	updateScore(() => 0);
	play();
}

function set_speed(speed_val_arg)
{
	play_speed = speedvals[speed_val_arg];
	updateScore(() => 0);
	play();
}

function set_length_lim(length_lim)
{
	maxindex = count_available(words, length_lim);
	clear_used();
	document.asl_words.input.focus();

	updateScore(() => 0);
	new_word();
}

function check_word()
{
	if(ischecked && iscorrect)
		return;
	if(document.forms[0].input.value == ""){
		play();
		return;
	}

	if(document.forms[0].input.value.toLowerCase() == word){
		iscorrect = true;
		document.images['ASLalphabet'].src = "images/goodjob.png";
		updateScore((s) => s+1);
		setTimeout(new_word, play_speed);
	} else {
		iscorrect = false;
		document.images['ASLalphabet'].src = "images/tryagain.png";
		updateScore((s) => s-1);
	}

	ischecked = true;
	document.asl_words.input.select();
	document.forms[0].input.value = "";
}

function new_word()
{
	var randNum;

	while(true){
		randNum = Math.floor(Math.random() * maxindex+1);

		if (used_words.length >= maxindex)
			clear_used();
		if(!used_words.includes(randNum)){
			used_words.push(randNum);
			word = words[randNum].toLowerCase();
			document.asl_words.input.focus();
			document.forms[0].input.value = "";
			break;
		}
	}
	if(newpage && !autostart){
		newpage = false;
	} else {
		ischecked = false;
		iscorrect = false;
		play();
	}
}
