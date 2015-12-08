/**********************************************************************************
	Script Name: Insanity Jam Game Idea Generator
	Author: Robbie Antenesse, head developer of Alamantus
	Contact: gamedev@alamantus.com
	Purpose: Takes a seed and randomly generates a sentence by selecting random
			 words from several word lists and by randomly selecting a sentence
			 structure to place the words into.
			 This version splits the process into helper functions, which makes
			 it easier to add more sentence structures in the future.
	Dependencies: seedrandom.js
				  jquery-1.x.js  (Any jquery, basically. If unchanged, this folder
								  uses jquery-1.11.0.js or jquery-1.11.0.min.js)
				  values/wordlists.json
				  
**********************************************************************************/

var wordlists;
var generatedSeed = "0000000000";
var generatedidea = "";

var	genreLockedTo = "";
var ideaPositionOnPage = document.getElementById('ideatext'),
	seedBox = document.getElementById('seedbox'),
	lockGenre = document.getElementById('lock'),
	removeGenre = document.getElementById('remove'),
	lockOption = document.getElementById('lockoption'),
	genreSelect = document.getElementById('genredropdown');

//Make jquery calls to populate these array variables with all the words from the word lists
var wordlistsCall = $.getJSON("values/wordlists.json", function (json) {
	wordlists = json;
	//Trim whitespace from before/after noun lists to prevent odd spacing in generated sentences.
	TrimWhitespaceFromLists();

	for (var i = 0; i < wordlists.gametypes.length; i++) {
		var genreOption = document.createElement('option');
	    genreOption.appendChild(document.createTextNode(wordlists.gametypes[i]));
	    genreOption.value = wordlists.gametypes[i];
	    genreSelect.appendChild(genreOption);
	}
});

function PlaceIdeaOnPage(randomize, debug) {
	generatedSeed = Math.random().toString().substring(2,13);

	var genrePlaceholder = document.getElementById('genreplaceholder');

	//Prepare all the values from the page
	if (randomize || seedBox.value == '') {
		seedBox.value = generatedSeed;
	}
	
	//Use the seed given to seed the random numbers
	if (seedBox.value) {
		Math.seedrandom(seedBox.value);
	}
	//Give a failsafe in case a seed somehow doesn't come over.
	else {
		Math.seedrandom(generatedSeed);
	}
    
    if (!$('#genreoptions').is(':visible')) {  
        $('#genreoptions').show(700);  
    }
	
	$.when(wordlistsCall).done(function () {
		//Use jquery $.when to generate only after each of the word list arrays have been filled.
		generatedidea = GenerateIdea(removeGenre.checked);

		//Put the text in the designated area.
		ideaPositionOnPage.innerHTML = generatedidea;
		SetAndShowHistory(seedBox.value, genreSelect.value, removeGenre.checked);
		
		//Debug
		if (debug) {
			var debugpage = document.getElementById('details');
			debugpage.innerHTML = "gt: " + gt + "<br />n1: " + n1 + "<br />n2: " + n2 + "<br />n3: " + n3 + "<br />n4: " + n4 + "<br />c: " + c + "<br />l: " + l + "<br />v1: " + v1 + "<br />v2: " + v2 + "<br />vc: " + vc + "<br />a1: " + a1 + "<br />a2: " + a2 + "<br />a3: " + a3 + "<br />a4: " + a4 + "<br />d: " + d + "<br />o1: " + o1 + "<br />o2: " + o2 + "<br />o3: " + o3 + "<br />o4: " + o4 + "<br />structure: " + sentencestructure;
		}
	}).fail(function() {
		alert("Can't get word lists. Try again later.");
		//other stuff here
	});
}

function GenerateIdea(genreIsRemoved) {
	var generated = "";
	
	//Set the Genre. If no genre is provided (from genre lock), it is generated.
	generated += SetGenre(genreIsRemoved);

	//Select the sentence structure. The number is equal to the number of sentence structures there are to choose from.
	var sentenceStructures = [
		BuildSentence1,
		BuildSentence2,
		BuildSentence3,
		BuildSentence4,
		BuildSentence5
	];
	generated += sentenceStructures[RandomNumber(sentenceStructures.length)]();
	
	generated = generated.trim();

	if (CoinToss()) {
		generated += AddAddonPiece();
	} else {
		generated += ".";
	}
	generated += "<end />";

	return generated;
}

function TrimWhitespaceFromLists() {
	var lists = Object.getOwnPropertyNames(wordlists);
	for (var list = 0; list < lists.length; list++) {
		for (var word = 0; word < wordlists[lists[list]].length; word++) {
			if (typeof wordlists[lists[list]][word] === 'string') {
				if (typeof wordlists[lists[list]][word] === 'string') {
					wordlists[lists[list]][word] = wordlists[lists[list]][word].trim();
				}
			} else {
				if (typeof wordlists[lists[list]][word][0] === 'string') {
					wordlists[lists[list]][word][0] = wordlists[lists[list]][word][0].trim();
				}
				if (typeof wordlists[lists[list]][word][1] === 'string') {
					wordlists[lists[list]][word][1] = wordlists[lists[list]][word][1].trim();
				}
			}
		}
	}
}

function SetGenre(genreIsRemoved) {
	var genrePiece = "";

	var genre = genreSelect.value;
	var gametype = RandomNumber(wordlists.gametypes.length);	//Selecting RandomNumber here ensures that it will generate a consistent sentence.

	if (genreIsRemoved) {
		genrePiece += "A ";
	} else {
		if (typeof genre !== 'undefined' && genre != "") {
			genrePiece += GetArticle(genre, true);
			genrePiece += genre;
		} else {
			genrePiece += GetArticle(wordlists.gametypes[gametype], true);
			genrePiece += wordlists.gametypes[gametype];
		}
	}
	genrePiece += " game where ";

	return genrePiece;
}

function SetAndShowHistory(seed, genre, genreIsRemoved) {
	$.when(wordlistsCall).done(function () {
		var genHistory = [];
		var histCookie = getCookie("history");
		var currentIdea = "";
		if (histCookie != "") {
			genHistory = histCookie.split("<end />,");
		}
		for (var i = 0; i < genHistory.length; i++) {
			if (genHistory[i].indexOf("<end />") == -1) {
				genHistory[i] += "<end />";
			}
		}
		if (generatedidea != null && generatedidea != "") {
			currentIdea = "Seed: " + htmlspecialchars(seed);
			if (genre != '') {
				currentIdea += ' -- (Genre Locked to "' + genre.trim().replace("A ", "").replace("An ", "") + '")';
			}
			if (genreIsRemoved) {
				currentIdea += ' -- (Genre Removed)';
			}
			currentIdea += '<br />' + generatedidea.replace("<div id='genre'>", "").replace("</div>", "");
			genHistory.unshift(currentIdea);
		}
		//Restrict to last 6 generated ideas, including the current idea.
		if (genHistory.length > 6) {
			genHistory = genHistory.slice(0, 6);
		}
		setCookie("history",genHistory,-1);
		var historySection = document.getElementById('history');
		var historyParagraphs = "";
		for(var i = (generatedidea == "") ? 0 : 1; i < genHistory.length - ((generatedidea == "") ? 1 : 0); i++) {	//Shows last 5 ideas (excluding current idea--starts at genHistory[1])
			if (genHistory[i] != "") {
				var idText = 'history' + i;
				historyParagraphs += '<p id="' + idText + '" class="clickable" title="Click to Highlight for easy copying" onclick="selectText(\'' + idText + '\');">' + genHistory[i] + '</p>';
			}
		}
		historySection.innerHTML = historyParagraphs;
	});
}

function BuildSentence1() {
/* "A ([superlative]) [adj] [noun] [verb] a ([superlative]) [adj] [noun] (in a [desc] [loc]) (while a ([superlative]) [adj] [noun] [verb] a ([superlative]) [adj] [noun])." */
	var sentence = "";
	var includeLocation = CoinToss();
	var includeSecondHalf = CoinToss();

	sentence += AddNounPiece(CoinToss(), true);
	sentence += AddNounPiece(CoinToss(), false);

	if (includeLocation) {
		sentence += AddLocationPiece();
	}
	
	if (includeSecondHalf) {
		sentence += AddConnectorPiece();
		sentence += AddNounPiece(CoinToss(), true);
		sentence += AddNounPiece(CoinToss(), false);
	}

	return sentence;
}

function BuildSentence2() {
/* "you [verb2a] a ([superlative]) [adj] [noun] (in a [desc] [loc]) (while you [verb2a] a [adj] [noun])." */
	var sentence = "";
	var includeLocation = CoinToss();
	var includeSecondHalf = CoinToss();

	var noun = RandomNumber(wordlists.nouns.length);
	var reiterateNoun = (includeSecondHalf && CoinToss());
	var isPlural = CoinToss();

	sentence += AddSecondPersonPiece();
	sentence += AddNounPiece(CoinToss(), false, noun, false, isPlural);

	if (includeLocation) {
		sentence += AddLocationPiece();
	}
	
	if (includeSecondHalf) {
		sentence += AddConnectorPiece();
		if (!reiterateNoun) {
			sentence += AddSecondPersonPiece();
			sentence += AddNounPiece(CoinToss(), false);
		} else {
			sentence += AddNounPiece(!reiterateNoun, true, noun, reiterateNoun, isPlural);
			sentence += "you";
		}
	}

	return sentence;
}

function BuildSentence3() {
/* "you [verb] a [adj] [noun] (in a [desc] [location]) to win a [adj] [noun]." */
	var sentence = "";
	var includeLocation = CoinToss();

	sentence += AddSecondPersonPiece();
	sentence += AddNounPiece(CoinToss(), false);

	if (includeLocation) {
		sentence += AddLocationPiece();
	}

	sentence += " " + wordlists.reasons[RandomNumber(wordlists.reasons.length)] + " ";
	sentence += AddNounPiece(CoinToss(), false);

	return sentence;
}

function BuildSentence4() {
/* "you [verb(concept)] [concept] (and (you [verb2] a [adj] [noun])/(a [adj] [noun] [verb3] you))/(with a [adj] [noun])." */
	var sentence = "";
	var includeSecondHalf = CoinToss();

	sentence += AddConceptPiece();
	
	if (includeSecondHalf) {
		if (CoinToss()) {
			sentence += AddConnectorPiece();
			if (CoinToss()) {
				sentence += AddSecondPersonPiece();
				sentence += AddNounPiece(CoinToss(), false);
			} else {
				sentence += AddNounPiece(CoinToss(), true);
				sentence += (CoinToss()) ? "you" : AddNounPiece(CoinToss(), false);
			}
		} else {
			sentence += " " + wordlists.reasons[RandomNumber(wordlists.reasons.length)] + " ";
			sentence += AddNounPiece(CoinToss(), false);
		}
	}

	return sentence;
}

function BuildSentence5() {
/* "you explore a [desc] [location] with a [adj] [noun]." */
	var sentence = "";

	if (CoinToss()) {
		sentence += "you explore ";
	} else {
		sentence += AddNounPiece(false, false, RandomNumber(wordlists.nouns.length), false, false);
		sentence += " explores ";
	}

	sentence += AddLocationPiece(false);
	
	if (CoinToss()) {
		sentence += AddConnectorPiece();
		if (CoinToss()) {
			sentence += AddSecondPersonPiece();
			sentence += AddNounPiece(CoinToss(), false);
		} else {
			sentence += AddNounPiece(CoinToss(), true);
			sentence += (CoinToss()) ? "you" : AddNounPiece(CoinToss(), false);
		}
	} else {
		sentence += " " + wordlists.reasons[RandomNumber(wordlists.reasons.length)] + " ";
		sentence += AddNounPiece(CoinToss(), false);
	}

	return sentence;
}

function AddNounPiece(isSuperlative, includeVerb, specificNoun, doReiterate, isPlural) {
	// Allows this function to be provided with a noun and its plural or to choose its own.
	isSuperlative = (typeof isSuperlative !== 'undefined') ? isSuperlative : CoinToss();	// Include verb by default.
	includeVerb = (typeof includeVerb !== 'undefined') ? includeVerb : true;	// Include verb by default.
	noun = (typeof specificNoun !== 'undefined') ? specificNoun : RandomNumber(wordlists.nouns.length);
	doReiterate = (typeof doReiterate !== 'undefined') ? doReiterate : false;
	isPlural = (typeof isPlural !== 'undefined') ? isPlural : CoinToss();		//Select Plural or Single noun again.

	var nounPiece = "";


	var hasAdjective = CoinToss();
	var adjective = RandomNumber(wordlists.adjectives.length);
	
	if (!doReiterate) {
		// Add article if not plural.
		if (!isPlural && !isSuperlative) {
			nounPiece += (hasAdjective) ? GetArticle(wordlists.adjectives[adjective]) : GetArticle(wordlists.nouns[noun][0]);
		}

		if (isSuperlative) {
			nounPiece += wordlists.superlatives[RandomNumber(wordlists.superlatives.length)] + " ";
		}

		if (hasAdjective && !doReiterate) {
			nounPiece += wordlists.adjectives[adjective] + " ";
		}
	} else {
		nounPiece += "the same ";
	}

	nounPiece += (isPlural) ? wordlists.nouns[noun][1] : wordlists.nouns[noun][0];	// Does not include a space after noun in case an addition is needed.

	if (includeVerb) {
		nounPiece += " " + ((isPlural) ? wordlists.verbs2nd[RandomNumber(wordlists.verbs2nd.length)] : wordlists.verbs3rd[RandomNumber(wordlists.verbs3rd.length)]) + " ";
	}

	return nounPiece;
}

function AddLocationPiece(includePreposition) {
	includePreposition = (typeof includePreposition !== 'undefined') ? includePreposition : true;
	var locationPiece = " ";

	var hasDescription = CoinToss();
	var description = RandomNumber(wordlists.descriptions.length);
	var location = RandomNumber(wordlists.locations.length);
	
	if (includePreposition) {
		switch (RandomNumber(10)) {
			case 0: locationPiece += "near ";
				break;
			case 1: locationPiece += "under ";
				break;
			case 2: locationPiece += "around ";
				break;
			case 3: locationPiece += "to win ";
				break;
			case 4: locationPiece += "beside ";
				break;
			case 5: locationPiece += "to destroy ";
				break;
			case 6: locationPiece += "above ";
				break;
			default: locationPiece += "in ";
				break;
		}
	}

	if (hasDescription) {
		locationPiece += GetArticle(wordlists.descriptions[description]);
		locationPiece += wordlists.descriptions[description] + " ";
	} else {
		locationPiece += GetArticle(wordlists.locations[location]);
	}

	locationPiece += wordlists.locations[location];

	return locationPiece;
}

function AddSecondPersonPiece() {
	var secondPersonPiece = "you ";
	secondPersonPiece += wordlists.verbs2nd[RandomNumber(wordlists.verbs2nd.length)] + " ";
	return secondPersonPiece;
}

function AddConceptPiece() {
	var conceptPiece = "you ";
	conceptPiece += wordlists.verbs2ndConcepts[RandomNumber(wordlists.verbs2ndConcepts.length)] + " ";
	conceptPiece += wordlists.concepts[RandomNumber(wordlists.concepts.length)];
	return conceptPiece;
}

function AddConnectorPiece() {
	var connectorPiece = "";

	var connection = RandomNumber(wordlists.connections.length);

	if (['.', ','].indexOf(wordlists.connections[connection].substr(0,1)) < 0) {
		connectorPiece += " ";
	}

	connectorPiece += wordlists.connections[connection] + " ";

	return connectorPiece;
}

function AddAddonPiece() {
	var addonPiece = "";

	var addon = RandomNumber(wordlists.addons.length);

	if (['.', ','].indexOf(wordlists.addons[addon].substr(0,1)) < 0) {
		addonPiece += " ";
	}

	addonPiece += wordlists.addons[addon];

	return addonPiece;
}

function GetArticle (word, capitalize) {
	word = word.trim();
	if (word.toLowerCase().substr(0,1)==="a" || word.toLowerCase().substr(0,1)==="e" || word.toLowerCase().substr(0,1)==="i" || word.toLowerCase().substr(0,1)==="o" || word.toLowerCase().substr(0,1)==="u") {
		return ((capitalize) ? "A" : "a") + "n ";
	} else {
		return ((capitalize) ? "A" : "a") + " ";
	}
}

function RandomNumber(maxPlusOne) {
	// Returns random number from 0 to maxPlusOne. Good for arrays (just put array.length).
	return Math.floor(Math.random() * maxPlusOne);
}

function CoinToss() {
	return RandomNumber(2) == 1;
}