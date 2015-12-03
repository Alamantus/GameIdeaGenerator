/**********************************************************************************
	Script Name: Insanity Jam Game Idea Generator
	Author: Robbie Antenesse, head developer of Alamantus Inc.
	Contact: gamedev@alamantus.com
	Purpose: Takes a seed and randomly generates a sentence by selecting random
			 words from several word lists and by randomly selecting a sentence
			 structure to place the words into.
			 This version splits the process into helper functions, which makes
			 it easier to add more sentence structures in the future.
	Dependencies: seedrandom.js
				  jquery-1.x.js  (Any jquery, basically. If unchanged, this folder
								  uses jquery-1.11.0.js or jquery-1.11.0.min.js)
				  Word Lists:
				  values/gametypes.txt
				  values/nouns.txt
				  values/pluralnouns.txt
				  values/concepts.txt
				  values/adjectives.txt
				  values/locations.txt
				  values/descriptions.txt
				  values/verbs2nd.txt
				  values/verbs2ndconcepts.txt
				  values/verbs3rd.txt
				  values/additions.txt
**********************************************************************************/

var gt = 0;	//game type
var n1 = n2 = n3 = n4 = c = l = 0;	//nouns
var v1 = v2 = vc = 0;	//verbs
var a1 = a2 = a3 = a4 = d = 0;	//adjectives and location description
var o1 = o2 = o3 = o4 = sentencestructure = 0;	//optional/chance additions
var types = nouns = pnouns = concepts = verbs2nd = verbs2ndconcepts = verbs3rd = adjectives = locations = descriptions = additions = [];
var generatedidea = "";

//Make jquery calls to populate these array variables with all the words from the word lists
var typesCall = $.get("values/gametypes.txt", function (data) { types = data.split("\n"); });
var nounsCall = $.get("values/nouns.txt", function (data) { nouns = data.split("\n"); });
var pluralnounsCall = $.get("values/pluralnouns.txt", function (data) { pnouns = data.split("\n"); });
var conceptsCall = $.get("values/concepts.txt", function (data) { concepts = data.split("\n"); });
var adjsCall = $.get("values/adjectives.txt", function (data) { adjectives = data.split("\n"); });
var locsCall = $.get("values/locations.txt", function (data) { locations = data.split("\n"); });
var descsCall = $.get("values/descriptions.txt", function (data) { descriptions = data.split("\n"); });
var verbs2ndCall = $.get("values/verbs2nd.txt", function (data) { verbs2nd = data.split("\n"); });
var verbs2ndconceptsCall = $.get("values/verbs2ndconcepts.txt", function (data) { verbs2ndconcepts = data.split("\n"); });
var verbs3rdCall = $.get("values/verbs3rd.txt", function (data) { verbs3rd = data.split("\n"); });
var additionsCall = $.get("values/additions.txt", function (data) { additions = data.split("\n"); });

var generatedSeed, ideaPositionOnPage, seedBox, lockGenre, genreLockedTo, removeGenre;

function PlaceIdeaOnPage(randomize, debug) {
	generatedSeed = Math.random().toString().substring(2,13);
	ideaPositionOnPage = document.getElementById('ideatext');
	seedBox = document.getElementById('seedbox');
	lockGenre = document.getElementById('lock');
	genreLockedTo = "";
	removeGenre = document.getElementById('remove');
	//Prepare all the values from the page
	if (randomize || seedBox.value == '') {
		seedBox.value = generatedSeed;
	}
    
    if (!$('#genreoptions').is(':visible')) {  
        $('#genreoptions').show(700);  
    };
	if (lockGenre.checked) {
		genreLockedTo = document.getElementById('genreplaceholder').innerHTML;
	} else {
		genreLockedTo = "";
	}
	if (removeGenre.checked) {
		document.getElementById('lockoption').innerHTML = "<span title='There is no genre to lock.\nUncheck &ldquo;Remove Genre&rdquo; and Generate or Re-Roll to get a genre.' style='color:gray;'>Lock Genre <span class='glyphicon glyphicon-remove-circle' style='font-size:80%;'><input name='genrelock' id='lock' type='checkbox' class='hidden' /></span></span>";
		document.getElementById('genreplaceholder').innerHTML = "";
	} else {
		if (!lockGenre.checked) {
			document.getElementById('lockoption').innerHTML = 'Lock Genre <input name="genrelock" id="lock" class="clickable" type="checkbox" onclick="lockTheGenre();" />';
		}
	}
	
	//Use the seed given to seed the random numbers
	if (seedBox.value) {
		Math.seedrandom(seedBox.value);
	}
	//Give a failsafe in case a seed somehow doesn't come over.
	else {
		Math.seedrandom(generatedSeed);
	}
	$.when(typesCall, nounsCall, pluralnounsCall, conceptsCall, verbs2ndCall, verbs2ndconceptsCall, verbs3rdCall, adjsCall, locsCall, descsCall, additionsCall).done(function () {
		//Use jquery $.when to generate only after each of the word list arrays have been filled.
		generatedidea = "";
		buildIdea(genreLockedTo, removeGenre.checked);
		// generatevalues(seed, genre, genreIsRemoved);
		//Put the text in the designated area.
		ideaPositionOnPage.innerHTML = generatedidea;
		setAndShowHistory(seedBox.value, genreLockedTo, removeGenre.checked);
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

function buildIdea(genre, genreIsRemoved) {
	//Trim whitespace from before/after noun lists to prevent odd spacing in generated sentences.
	trimWhitespaceFromLists(nouns, pnouns, locations, concepts);
	
	//Set the variables to their random values.
	generateRandomValues();
	
	//Set the Genre. If no genre is provided (from genre lock), it is generated.
	setGenre(genre, genreIsRemoved);
	
	switch (sentencestructure) {
		case 0:
			buildSentenceO();
			break;
		case 1:
			buildSentence1();
			break;
		case 2:
			buildSentence2();
			break;
		case 3:
			buildSentence3();
			break;
		case 4:
			buildSentence4();
			break;
		case 5:
			buildSentence5();
			break;
		case 6:
			buildSentence6();
			break;
		case 7:
			buildSentence7();
			break;
		case 8:
			buildSentence8();
			break;
		case 9:
			buildSentence9();
			break;
		case 10:
			buildSentence10();
			break;
		case 11:
			buildSentence11();
			break;
	}
	generatedidea = generatedidea.trim();
	o3=Math.floor(Math.random() * 10);		//Randomize if you get a sentence addition
	if (o3 < 5) {
		generatedidea += ".";
	} else {
		var add = Math.floor(Math.random() * additions.length);
		generatedidea += additions[add];
	}
	generatedidea += "<end />";
}

function trimWhitespaceFromLists(list1, list2, list3, list4) {
	if (list1 == undefined) {
		alert("No Lists Specified to trim whitespace.");
	}
	else {
		for (var i = 0; i < list1.length; i++) {
			list1[i] = list1[i].trim();
		}
	}
	if (list2 != undefined) {
		for (var i = 0; i < list2.length; i++) {
			list2[i] = list2[i].trim();
		}
	}
	if (list3 != undefined) {
		for (var i = 0; i < list3.length; i++) {
			list3[i] = list3[i].trim();
		}
	}
	if (list4 != undefined) {
		for (var i = 0; i < list4.length; i++) {
			list4[i] = list4[i].trim();
		}
	}
}

function generateRandomValues() {
	gt=Math.floor(Math.random() * types.length);	//Gives game type a value within the game types list.
	n1=Math.floor(Math.random() * nouns.length);	//Gives noun1 a value within the nouns list.
	n2=Math.floor(Math.random() * nouns.length);	//Gives noun2 a value within the nouns list.
	c=Math.floor(Math.random() * concepts.length);	//Gives concept a value within the concepts list.
	l=Math.floor(Math.random() * locations.length);	//Gives location a value within the locations list.
	v1=Math.floor(Math.random() * verbs3rd.length);	//Gives verb1 a value within the verbs list.
	vc=Math.floor(Math.random() * verbs2ndconcepts.length);	//Gives verb2 a value within the concepts verbs list.
	
	//Get Adjectives or decide if there will be adjectives
	o1=Math.floor(Math.random() * 5);
	if (o1 == 0) {
		a1 = a2 = d = -1;
	}
	if (o1 == 1) {
		a1 = Math.floor(Math.random() * adjectives.length);
		a2 = d = -1;
	}
	if (o1 == 2) {
		a2 = Math.floor(Math.random() * adjectives.length);
		d = Math.floor(Math.random() * descriptions.length);
		a1 = -1;
	}
	if (o1 == 3) {
		a1 = Math.floor(Math.random() * adjectives.length);
		a2 = Math.floor(Math.random() * adjectives.length);
		d = Math.floor(Math.random() * descriptions.length);
	}
	if (o1 == 4) {
		a2 = Math.floor(Math.random() * adjectives.length);
		d = Math.floor(Math.random() * descriptions.length);
		a1 = Math.floor(Math.random() * adjectives.length);
	}
	
	//Roll again for o1 to check for expanded sentences
	o1=Math.floor(Math.random() * 10);
	if (o1 < 5) {
		//remove the possibility of expanded sentences
		n3 = n4 = v2 = a3 = a4 = o2 = o3 = -1;
	}
	else {
		//Set up expanded sentence parts
		n3=Math.floor(Math.random() * nouns.length);	//Gives noun3 a value between 0 and 99, providing 100 noun options
		n4=Math.floor(Math.random() * nouns.length);	//Gives noun4 a value between 0 and 99, providing 100 noun options
		v2=Math.floor(Math.random() * verbs3rd.length);	//Gives verb2 a value between 0 and 99, providing 100 noun options
		
		//Get Adjectives or decide if there will be adjectives
		o2=Math.floor(Math.random() * 5);
		if (o2 == 0) {
			a3 = a4 = -1;
		}
		if (o2 == 1) {
			a3 = Math.floor(Math.random() * adjectives.length);
			a4 = -1;
		}
		if (o2 == 2) {
			a4 = Math.floor(Math.random() * adjectives.length);
			a3 = -1;
		}
		if (o2 == 3) {
			a3 = Math.floor(Math.random() * adjectives.length);
			a4 = Math.floor(Math.random() * adjectives.length);
		}
		if (o2 == 4) {
			a4 = Math.floor(Math.random() * adjectives.length);
			a3 = Math.floor(Math.random() * adjectives.length);
		}
		
		o3=Math.floor(Math.random() * 10);	//Select the connector word/phrase.
	}
	o4=Math.floor(Math.random() * 10);		//Select Plural or Single noun.
	
	//Select the sentence structure. The multiplier is equal to the number of sentence structures there are to choose from.
	sentencestructure=Math.floor(Math.random() * 11);
	/*	"A [type] game where..."
		0: "a [adj] [noun] [verb] a [adj] [noun] while a [adj] [noun] [verb] a [adj] [noun]."
		1: "a [adj] [noun] [verb] a [adj] [noun] in a [desc] [location] while a [adj] [noun] [verb] a [adj] [noun]."
		2: "you [verb2a] a [adj] [noun] while you [verb2act] a [adj] [noun]."
		3: "you [verb2a] a [adj] [noun] in a [desc] [location] while it [verb2act] you."
		4: "you [verb2a] a [adj] [noun] in a [desc] [location] while a you [verb2act] a [adj] [noun]."
		5: "you [verb] a [adj] [noun] over/because of a [adj] [noun]."
		6: "you [verb] a [adj] [noun] in a [desc] [location] to win a [adj] [noun]."
		7: "you [verb(concept)] [concept] ( while a [adj] [noun] [verb] a [adj] [noun])."
		8: "you [verb(concept)] [concept] with a [adj] [noun]."
		9: "you explore a [desc] [location] with a [adj] [noun]."
		10: "a [adj] [noun] explore a [desc] [location] with a [adj] [noun]."
	*/
}

function setGenre(genre, genreIsRemoved) {
	if (genreIsRemoved) {
		generatedidea += "A ";
	} else {
		generatedidea += "<div id='genre'>";
		if (genre == '') {
			if (types[gt].substr(0,1)==="a" || types[gt].substr(0,1)==="e" || types[gt].substr(0,1)==="i" || types[gt].substr(0,1)==="o" || types[gt].substr(0,1)==="u") {
				generatedidea += "An ";
			} else {
				generatedidea += "A ";
			}
			generatedidea += types[gt] + " </div>";
		} else {
			generatedidea += genre + " </div>";		//No need to add an article because it is already there.
		}
	}
	generatedidea += "game where ";
}

function setAndShowHistory(seed, genre, genreIsRemoved) {
	$.when(typesCall, nounsCall, pluralnounsCall, conceptsCall, verbs2ndCall, verbs2ndconceptsCall, verbs3rdCall, adjsCall, locsCall, descsCall, additionsCall).done(function () {
		var genHistory = [];
		var histCookie = getCookie("history");
		if (histCookie != "") {
			genHistory = histCookie.split("<end />,");
		}
		for (var i = 0; i < genHistory.length; i++) {
			if (genHistory[i].indexOf("<end />") == -1) {
				genHistory[i] += "<end />";
			}
		}
		var currentIdea = "Seed: " + htmlspecialchars(seed);
		if (genre != '') {
			currentIdea += ' -- (Genre Locked to "' + genre.trim().replace("A ", "").replace("An ", "") + '")';
		}
		if (genreIsRemoved) {
			currentIdea += ' -- (Genre Removed)';
		}
		currentIdea += '<br />' + generatedidea.replace("<div id='genre'>", "");
		currentIdea = currentIdea.replace("</div>", "");
		genHistory.unshift(currentIdea);
		//Restrict to last 6 generated ideas, including the current idea.
		if (genHistory.length > 6) {
				genHistory = genHistory.slice(0, 6);
			}
		setCookie("history",genHistory,-1);
		var historySection = document.getElementById('history');
		var historyParagraphs = "";
		for(var i = 1; i < genHistory.length; i++) {	//Shows last 5 ideas (excluding current idea--starts at genHistory[1])
			if (genHistory[i] != "") {
				var idText = 'history' + i;
				historyParagraphs += '<p id="' + idText + '" class="clickable" title="Click to Highlight for easy copying" onclick="selectText(\'' + idText + '\');">' + genHistory[i] + '</p>';
			}
		}
		historySection.innerHTML = historyParagraphs;
	});
}

function buildSentenceO() {
/* "A [adj] [noun] [verb] a [adj] [noun] while a [adj] [noun] [verb] a [adj] [noun]." */
	AddNounPiece(a1, n1, v1);
	
	AddNounPiece(a2, n2, -1);
	
	AddConnectorPiece();
	if (n3 >= 0) {
		AddNounPiece(a3, n3, v2);
	}
	if (n4 >= 0) {
		AddNounPiece(a4, n4, -1);
	}
}

function buildSentence1() {
/* "a [adj] [noun] [verb] a [adj] [noun] in a [desc] [location] while a [adj] [noun] [verb] a [adj] [noun]." */
	AddNounPiece(a1, n1, v1);
	
	AddNounPiece(a2, n2, -1);
	
	AddLocationPiece();
	
	AddConnectorPiece();
	if (n3 >= 0) {
		AddNounPiece(a3, n3, v2);
	}
	if (n4 >= 0) {
		AddNounPiece(a4, n4, -1);
	}
}

function buildSentence2() {
/* "you [verb2a] a [adj] [noun] in a [desc] [location] while you [verb2act] a [adj] [noun]." */
	generatedidea += "you ";
	generatedidea += verbs2nd[v1] + " ";
	
	AddNounPiece(a2, n2, -1);
	
	AddConnectorPiece();
	if (n3 >= 0) {
		generatedidea += "you ";
		generatedidea += verbs2nd[v2] + " ";
	}
	if (n4 >= 0) {
		AddNounPiece(a4, n4, -1);
	}
}

function buildSentence3() {
/* "you [verb2a] a [adj] [noun] in a [desc] [location] while it [verb2act] you." */
	generatedidea += "you ";
	
	generatedidea += verbs2nd[v1] + " ";
	
	AddNounPiece(a2, n2, -1);
	
	AddLocationPiece();
	
	AddConnectorPiece();
	
	if (n3 >= 0) {
		if (o4 < 5) {
			generatedidea += "the same " + nouns[n2] + " ";
			generatedidea += verbs3rd[v2] + " you";
		} else {
			generatedidea += "the same " + pnouns[n2] + " ";
			generatedidea += verbs2nd[v2] + " you";
		}
	}
}

function buildSentence4() {
/* "you [verb2a] a [adj] [noun] in a [desc] [location] while you [verb2act] a [adj] [noun]." */
	generatedidea += "you ";
	
	generatedidea += verbs2nd[v1] + " ";
	
	AddNounPiece(a2, n2, -1);

	AddLocationPiece();
	
	AddConnectorPiece();
	
	if (n3 >= 0) {
		generatedidea += "you ";
		generatedidea += verbs2nd[v2] + " ";
	}
	if (n4 >= 0) {
		AddNounPiece(a4, n4, -1);
	}
}

function buildSentence5() {
/* "you [verb] the [superlative] [adj] [noun]." */
	generatedidea += "you ";
	generatedidea += verbs2nd[v1] + " ";
	
	o3=Math.floor(Math.random() * 20);
	switch (o3) {
		case 0: generatedidea += " the most interesting ";
			break;
		case 1: generatedidea += " the best ";
			break;
		case 2: generatedidea += " the worst ";
			break;
		case 3: generatedidea += " the most powerful ";
			break;
		case 4: generatedidea += " the most ridiculous ";
			break;
		case 5: generatedidea += " the most unbelievable ";
			break;
		case 6: generatedidea += " the most frustrating ";
			break;
		case 7: generatedidea += " the calmest ";
			break;
		case 8: generatedidea += " the most peaceful ";
			break;
		case 9: generatedidea += " the most fearsome ";
			break;
		case 10: generatedidea += " the most ridiculous ";
			break;
		case 11: generatedidea += " the most infuriating ";
			break;
		case 12: generatedidea += " the loudest ";
			break;
		case 13: generatedidea += " the most beautiful ";
			break;
		case 14: generatedidea += " the softest ";
			break;
		case 15: generatedidea += " the shabbiest ";
			break;
		case 16: generatedidea += " the biggest ";
			break;
		case 17: generatedidea += " the longest ";
			break;
		case 18: generatedidea += " the sweetest ";
			break;
		case 19: generatedidea += " the coldest ";
			break;
	}
	
	o4=Math.floor(Math.random() * 10);		//Select Plural or Single noun again.
	if (a1 >= 0) {
		generatedidea += adjectives[a1] + " ";
	}
	if (o4 < 5) {
		generatedidea += nouns[n1];
	} else {
		generatedidea += pnouns[n1];
	}
}

function buildSentence6() {
/* "you [verb] a [adj] [noun] (in a [desc] [location]) to win a [adj] [noun]." */
	generatedidea += "you ";
	generatedidea += verbs2nd[v1] + " ";
	
	AddNounPiece(a1, n1, -1);
	
	o3=Math.floor(Math.random() * 10);
	if (o3 < 5) {
		AddLocationPiece();
	}
	
	o3=Math.floor(Math.random() * 10);
	switch (o3) {
		case 0: generatedidea += " because of ";
			break;
		case 1: generatedidea += " to get ";
			break;
		case 2: generatedidea += " to win ";
			break;
		case 3: generatedidea += " for the benefit of ";
			break;
		case 4: generatedidea += " for ";
			break;
		case 5: generatedidea += " to discover ";
			break;
		case 6: generatedidea += " to get ";
			break;
		case 7: generatedidea += " for ";
			break;
		case 8: generatedidea += " to find ";
			break;
		case 9: generatedidea += " to win ";
			break;
	}

	AddNounPiece(a2, n2, -1);
}

function buildSentence7() {
/* "you [verb(concept)] [concept]." */
	generatedidea += "you ";
	v1=Math.floor(Math.random() * verbs2ndconcepts.length);
	generatedidea += verbs2ndconcepts[vc] + " ";
	generatedidea += concepts[c];
	
	switch (o3) {
		case 0: generatedidea += " while ";
			break;
		case 1: generatedidea += " because ";
			break;
		case 2: generatedidea += ", and ";
			break;
		case 3: generatedidea += " even though ";
			break;
		case 4: generatedidea += ", but ";
			break;
		case 5: generatedidea += ", however ";
			break;
		case 6: generatedidea += ", and then ";
			break;
		case 7: generatedidea += ". At the same time, ";
			break;
		case 8: generatedidea += ", which means that ";
			break;
		case 9: generatedidea += " while ";
			break;
	}
	if (n3 >= 0) {
		o4=Math.floor(Math.random() * 10);		//Select Plural or Single noun again.
		if (a3 >= 0) {
			if (o4 < 5) {
				if (adjectives[a3].substr(0,1)==="a" || adjectives[a3].substr(0,1)==="e" || adjectives[a3].substr(0,1)==="i" || adjectives[a3].substr(0,1)==="o" || adjectives[a3].substr(0,1)==="u") {
					generatedidea += "an ";
				} else {
					generatedidea += "a ";
				}
			}
			generatedidea += adjectives[a3] + " ";
		} else {
			if (o4 < 5) {
				if (nouns[n3].substr(0,1)==="a" || nouns[n3].substr(0,1)==="e" || nouns[n3].substr(0,1)==="i" || nouns[n3].substr(0,1)==="o" || nouns[n3].substr(0,1)==="u") {
					generatedidea += "an ";
				} else {
					generatedidea += "a ";
				}
			}
		}
		if (o4 < 5) {
			generatedidea += nouns[n3] + " ";
			generatedidea += verbs3rd[v2] + " ";
		} else {
			generatedidea += pnouns[n3] + " ";
			generatedidea += verbs2nd[v2] + " ";
		}
	}
	if (n4 >= 0) {
		o4=Math.floor(Math.random() * 10);		//Select Plural or Single noun again.
		if (a4 >= 0) {
			if (o4 < 5) {
				if (adjectives[a4].substr(0,1)==="a" || adjectives[a4].substr(0,1)==="e" || adjectives[a4].substr(0,1)==="i" || adjectives[a4].substr(0,1)==="o" || adjectives[a4].substr(0,1)==="u") {
					generatedidea += "an ";
				} else {
					generatedidea += "a ";
				}
			}
			generatedidea += adjectives[a4] + " ";
		} else {
			if (o4 < 5) {
				if (nouns[n4].substr(0,1)==="a" || nouns[n4].substr(0,1)==="e" || nouns[n4].substr(0,1)==="i" || nouns[n4].substr(0,1)==="o" || nouns[n4].substr(0,1)==="u") {
					generatedidea += "an ";
				} else {
					generatedidea += "a ";
				}
			}
		}
		if (o4 < 5) {
			generatedidea += nouns[n4];
		} else {
			generatedidea += pnouns[n4];
		}
	}
}

function buildSentence8() {
/* "you [verb(concept)] [concept] with a [adj] [noun]." */
	generatedidea += "you ";
	v1=Math.floor(Math.random() * verbs2ndconcepts.length);
	generatedidea += verbs2ndconcepts[vc] + " ";
	generatedidea += concepts[c];
	
	switch (o3) {
		case 0: generatedidea += " with ";
			break;
		case 1: generatedidea += " because of ";
			break;
		case 2: generatedidea += " because of ";
			break;
		case 3: generatedidea += " with ";
			break;
		case 4: generatedidea += " for ";
			break;
		case 5: generatedidea += "led by ";
			break;
		case 6: generatedidea += " leading ";
			break;
		case 7: generatedidea += " because of ";
			break;
		case 8: generatedidea += " with ";
			break;
		case 9: generatedidea += " for ";
			break;
	}
	if (n3 >= 0) {
		o4=Math.floor(Math.random() * 10);		//Select Plural or Single noun again.
		if (a3 >= 0) {
			if (o4 < 5) {
				if (adjectives[a3].substr(0,1)==="a" || adjectives[a3].substr(0,1)==="e" || adjectives[a3].substr(0,1)==="i" || adjectives[a3].substr(0,1)==="o" || adjectives[a3].substr(0,1)==="u") {
					generatedidea += "an ";
				} else {
					generatedidea += "a ";
				}
			}
			generatedidea += adjectives[a3] + " ";
		} else {
			if (o4 < 5) {
				if (nouns[n3].substr(0,1)==="a" || nouns[n3].substr(0,1)==="e" || nouns[n3].substr(0,1)==="i" || nouns[n3].substr(0,1)==="o" || nouns[n3].substr(0,1)==="u") {
					generatedidea += "an ";
				} else {
					generatedidea += "a ";
				}
			}
		}
		if (o4 < 5) {
			generatedidea += nouns[n3];
		} else {
			generatedidea += pnouns[n3];
		}
	}
}

function buildSentence9() {
/* "you explore a [desc] [location] with a [adj] [noun]." */
	generatedidea += "you ";
	
	generatedidea += "explore ";

	if (d >= 0) {
		if (descriptions[d].substr(0,1)==="a" || descriptions[d].substr(0,1)==="e" || descriptions[d].substr(0,1)==="i" || descriptions[d].substr(0,1)==="o" || descriptions[d].substr(0,1)==="u") {
			generatedidea += "an ";
		} else {
			generatedidea += "a ";
		}
		generatedidea += descriptions[d] + " ";
	} else {
		if (locations[l].substr(0,1)==="a" || locations[l].substr(0,1)==="e" || locations[l].substr(0,1)==="i" || locations[l].substr(0,1)==="o" || locations[l].substr(0,1)==="u") {
			generatedidea += "an ";
		} else {
			generatedidea += "a ";
		}
	}
	generatedidea += locations[l] + " ";
	
	if (n4 >= 0) {
		generatedidea += "with ";
		AddNounPiece(a4, n4, -1);
	}
}

function buildSentence10() {
/* "you explore a [desc] [location] with a [adj] [noun] while you [verb] a [adj] [noun]." */
	generatedidea += "you ";
	
	generatedidea += "explore ";

	if (d >= 0) {
		if (descriptions[d].substr(0,1)==="a" || descriptions[d].substr(0,1)==="e" || descriptions[d].substr(0,1)==="i" || descriptions[d].substr(0,1)==="o" || descriptions[d].substr(0,1)==="u") {
			generatedidea += "an ";
		} else {
			generatedidea += "a ";
		}
		generatedidea += descriptions[d] + " ";
	} else {
		if (locations[l].substr(0,1)==="a" || locations[l].substr(0,1)==="e" || locations[l].substr(0,1)==="i" || locations[l].substr(0,1)==="o" || locations[l].substr(0,1)==="u") {
			generatedidea += "an ";
		} else {
			generatedidea += "a ";
		}
	}
	generatedidea += locations[l] + " ";
	
	if (n4 >= 0) {
		generatedidea += "with ";
		AddNounPiece(a1, n1, -1);
	}
	
	AddConnectorPiece();
	
	if (n3 >= 0) {
		generatedidea += "you ";
		generatedidea += verbs2nd[v2] + " ";
	}
	if (n4 >= 0) {
		AddNounPiece(a4, n4, -1);
	}
}

function buildSentence11() {
/* "a [adj] [noun] explores a [desc] [location] with a [adj] [noun]." */
	o4=Math.floor(Math.random() * 10);		//Select Plural or Single noun again.
	if (adjectiveNumber >= 0) {
		if (o4 < 5) {
			if (adjectives[adjectiveNumber].substr(0,1)==="a" || adjectives[adjectiveNumber].substr(0,1)==="e" || adjectives[adjectiveNumber].substr(0,1)==="i" || adjectives[adjectiveNumber].substr(0,1)==="o" || adjectives[adjectiveNumber].substr(0,1)==="u") {
				generatedidea += "an ";
			} else {
				generatedidea += "a ";
			}
		}
		generatedidea += adjectives[adjectiveNumber] + " ";
	} else {
		if (o4 < 5) {
			if (nouns[nounNumber].substr(0,1)==="a" || nouns[nounNumber].substr(0,1)==="e" || nouns[nounNumber].substr(0,1)==="i" || nouns[nounNumber].substr(0,1)==="o" || nouns[nounNumber].substr(0,1)==="u") {
				generatedidea += "an ";
			} else {
				generatedidea += "a ";
			}
		}
	}
	if (o4 < 5) {
		generatedidea += nouns[nounNumber];
		if (verbNumber >= 0) {
			generatedidea += " explores ";
		}
	} else {
		generatedidea += pnouns[nounNumber];
		if (verbNumber >= 0) {
			generatedidea += " explore ";
		}
	}

	if (d >= 0) {
		if (descriptions[d].substr(0,1)==="a" || descriptions[d].substr(0,1)==="e" || descriptions[d].substr(0,1)==="i" || descriptions[d].substr(0,1)==="o" || descriptions[d].substr(0,1)==="u") {
			generatedidea += "an ";
		} else {
			generatedidea += "a ";
		}
		generatedidea += descriptions[d] + " ";
	} else {
		if (locations[l].substr(0,1)==="a" || locations[l].substr(0,1)==="e" || locations[l].substr(0,1)==="i" || locations[l].substr(0,1)==="o" || locations[l].substr(0,1)==="u") {
			generatedidea += "an ";
		} else {
			generatedidea += "a ";
		}
	}
	generatedidea += locations[l] + " ";
	
	if (n4 >= 0) {
		generatedidea += "with ";
		AddNounPiece(a4, n4, -1);
	}
}

function AddNounPiece(adjectiveNumber, nounNumber, verbNumber) {		//Use -1 to exclude a trailing verb
	o4=Math.floor(Math.random() * 10);		//Select Plural or Single noun again.
	if (adjectiveNumber >= 0) {
		if (o4 < 5) {
			if (adjectives[adjectiveNumber].substr(0,1)==="a" || adjectives[adjectiveNumber].substr(0,1)==="e" || adjectives[adjectiveNumber].substr(0,1)==="i" || adjectives[adjectiveNumber].substr(0,1)==="o" || adjectives[adjectiveNumber].substr(0,1)==="u") {
				generatedidea += "an ";
			} else {
				generatedidea += "a ";
			}
		}
		generatedidea += adjectives[adjectiveNumber] + " ";
	} else {
		if (o4 < 5) {
			if (nouns[nounNumber].substr(0,1)==="a" || nouns[nounNumber].substr(0,1)==="e" || nouns[nounNumber].substr(0,1)==="i" || nouns[nounNumber].substr(0,1)==="o" || nouns[nounNumber].substr(0,1)==="u") {
				generatedidea += "an ";
			} else {
				generatedidea += "a ";
			}
		}
	}
	if (o4 < 5) {
		generatedidea += nouns[nounNumber];
		if (verbNumber >= 0) {
			generatedidea += " " + verbs3rd[verbNumber] + " ";
		}
	} else {
		generatedidea += pnouns[nounNumber];
		if (verbNumber >= 0) {
			generatedidea += " " + verbs2nd[verbNumber] + " ";
		}
	}
}

function AddLocationPiece() {
	var preposition=Math.floor(Math.random() * 10);
	switch (preposition) {
		case 0: generatedidea += " in ";
			break;
		case 1: generatedidea += " near ";
			break;
		case 2: generatedidea += " under ";
			break;
		case 3: generatedidea += " around ";
			break;
		case 4: generatedidea += " to win ";
			break;
		case 5: generatedidea += " beside ";
			break;
		case 6: generatedidea += " to destroy ";
			break;
		case 7: generatedidea += " above ";
			break;
		case 8: generatedidea += " in ";
			break;
		case 9: generatedidea += " in ";
			break;
	}
	if (d >= 0) {
		if (descriptions[d].substr(0,1)==="a" || descriptions[d].substr(0,1)==="e" || descriptions[d].substr(0,1)==="i" || descriptions[d].substr(0,1)==="o" || descriptions[d].substr(0,1)==="u") {
			generatedidea += "an ";
		} else {
			generatedidea += "a ";
		}
		generatedidea += descriptions[d] + " ";
	} else {
		if (locations[l].substr(0,1)==="a" || locations[l].substr(0,1)==="e" || locations[l].substr(0,1)==="i" || locations[l].substr(0,1)==="o" || locations[l].substr(0,1)==="u") {
			generatedidea += "an ";
		} else {
			generatedidea += "a ";
		}
	}
	generatedidea += locations[l];
}

function AddConnectorPiece() {
	switch (o3) {
		case 0: generatedidea += " while ";
			break;
		case 1: generatedidea += " because ";
			break;
		case 2: generatedidea += ", and ";
			break;
		case 3: generatedidea += " even though ";
			break;
		case 4: generatedidea += ", but ";
			break;
		case 5: generatedidea += ", however ";
			break;
		case 6: generatedidea += ", and then ";
			break;
		case 7: generatedidea += ". At the same time, ";
			break;
		case 8: generatedidea += ", which means that ";
			break;
		case 9: generatedidea += " while ";
			break;
	}
}