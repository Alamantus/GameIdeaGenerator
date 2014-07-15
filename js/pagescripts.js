function selectText(containerid) {
	if (document.selection) {
		var range = document.body.createTextRange();
		range.moveToElementText(document.getElementById(containerid));
		range.select();
	} else if (window.getSelection) {
		var range = document.createRange();
		range.selectNode(document.getElementById(containerid));
		window.getSelection().addRange(range);
	}
}

function htmlspecialchars(str) {
	if (typeof(str) == "string") {
		str = str.replace(/&/g, "&amp;");
		str = str.replace(/"/g, "&quot;");
		str = str.replace(/'/g, "&#039;");
		str = str.replace(/</g, "&lt;");
		str = str.replace(/>/g, "&gt;");
	}
	return str;
}

var hints = [];
var h = 0;
var hintsCall = $.get("values/hints.txt", function (data) { hints = data.split("\n"); });

function getNewHint() {
	$.when(hintsCall).done(function () {
		h = Math.floor(Math.random() * hints.length);
		document.getElementById('hinttext').innerHTML = hints[h];
	});
}

function addGenreDropdown() {		//Doesn't seem to work from this file
	var genres = [];
	var typesCall = $.get("values/gametypes.txt", function (data) { genres = data.split("\n"); });
	var dropdownbox = '<select name="genres"><option value=""></option>';
	$.when(typesCall).done(function () {
		for (var i = 0; i < genres.length; i++) {
			dropdownbox += '<option value="' + genres[i] + '">' + genres[i] + '</option>';
		}
		dropdownbox += '</select>';
		document.getElementById('genreselect').innerHTML = dropdownbox;
	});
}

function doLockGenreCheckboxStuff () {
	if (this.checked) {
		var genre = document.getElementById('genre').innerHTML;
		document.getElementById('genreplaceholder').innerHTML = '<input type=\'hidden\' id=\'genrefield\' name=\'lockedgenre\' value=\'' + genre + '\' />';
	} else {
		document.getElementById('genreplaceholder').innerHTML = '';
	}
	//Uncheck Remove Box is This box is Checked
	var removeCheckbox = document.getElementById('remove').checked;
	if(document.getElementById('remove').checked){document.getElementById('remove').checked=false;
	}
}

// function removeGenre() {
	// if (document.getElementById('genre') == null) {
		// setTimeout(removeGenre, 10);
	// } else {
		// document.getElementById('genre').innerHTML = "A ";
	// }
// }

function setCookie(cname,cvalue,exdays)
{
	if (exdays > 0) {
		var d = new Date();
		d.setTime(d.getTime()+(exdays*24*60*60*1000));
		var expires = "expires="+d.toGMTString();
		document.cookie = cname + "=" + cvalue + "; " + expires;
	} else {
		document.cookie = cname + "=" + cvalue;
	}
}
function getCookie(cname)
{
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for(var i=0; i<ca.length; i++) 
	{
		var c = ca[i].trim();
		if (c.indexOf(name)==0) return c.substring(name.length,c.length);
	}
	return "";
}

function lockTheGenre() {
	if (document.getElementById('lock').checked) {
		document.getElementById('remove').checked = false;
		var g = document.getElementById('genre').innerHTML;
		if (g != null) {
			document.getElementById('genreplaceholder').innerHTML = g;
		}
	} else {
		document.getElementById('genreplaceholder').innerHTML = '';
	}
}

function removeTheGenre() {
	if (document.getElementById('remove').checked) {
		document.getElementById('lock').checked = false;
		document.getElementById('genreplaceholder').innerHTML = '';
	}
}

function pageLoadFunctions(lock, genre, remove) {
	if (lock == 'on') {
		document.getElementById('lock').checked = "true";
		document.getElementById('genreplaceholder').innerHTML = "<input type='hidden' id='genrefield' name='lockedgenre' value='"+genre+"' />";
	}
	
	if (remove == 'on') {
		document.getElementById('remove').checked = "true";
		document.getElementById('lockoption').innerHTML = "<span title='There is no genre to lock.\nUncheck &ldquo;Remove Genre&rdquo; and Generate or Re-Roll to get a genre.' style='color:gray;'>Lock Genre <span class='glyphicon glyphicon-remove-circle' style='font-size:80%;'></span></span>";
		document.getElementById('genreplaceholder').innerHTML = "";
		// removeGenre();
	}
	
	$.when(hintsCall).done(function () {
		getNewHint();
	});
}