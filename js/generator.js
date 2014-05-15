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
				  values/adjectives.txt
				  values/locations.txt
				  values/descriptions.txt
				  values/verbs2nd.txt
				  values/verbs3rd.txt
				  values/additions.txt
**********************************************************************************/

var gt = 0;	//game type
var n1 = n2 = n3 = n4 = 0;	//nouns
var v1 = v2 = 0;	//verbs
var a1 = a2 = a3 = a4 = 0;	//adjectives
var o1 = o2 = o3 = o4 = sentencestructure = 0;	//optional/chance additions
var types = nouns = pnouns = concepts = verbs2nd = verbs3rd = adjectives = locations = descriptions = additions = [];
var generatedidea = "";

function generatevalues(seed, genre) {	
	//Use the seed given to seed the random numbers
	if(seed) {
		Math.seedrandom(seed);
	}
	//Give a failsafe in case a seed somehow doesn't come over.
	else {
		Math.seedrandom();
	}
	
	//Make jquery calls to populate these array variables with all the words from the word lists
	var typesCall = $.get("values/gametypes.txt", function (data) { types = data.split("\n"); });
	var nounsCall = $.get("values/nouns.txt", function (data) { nouns = data.split("\n"); });
	var pluralnounsCall = $.get("values/pluralnouns.txt", function (data) { pnouns = data.split("\n"); });
	var adjsCall = $.get("values/adjectives.txt", function (data) { adjectives = data.split("\n"); });
	var locsCall = $.get("values/locations.txt", function (data) { locations = data.split("\n"); });
	var descsCall = $.get("values/descriptions.txt", function (data) { descriptions = data.split("\n"); });
	var verbs2ndCall = $.get("values/verbs2nd.txt", function (data) { verbs2nd = data.split("\n"); });
	var verbs3rdCall = $.get("values/verbs3rd.txt", function (data) { verbs3rd = data.split("\n"); });
	var additionsCall = $.get("values/additions.txt", function (data) { additions = data.split("\n"); });
	
	//Use jquery $.when to generate only after each of the word list arrays have been filled.
	$.when(typesCall, nounsCall, pluralnounsCall, verbs2ndCall, verbs3rdCall, adjsCall, locsCall, descsCall, additionsCall).done(function () {
		
		//Trim whitespace from before/after noun lists to prevent odd spacing in generated sentences.
		trimWhitespaceFromLists(nouns, pnouns, locations);
		
		//Set the variables to their random values.
		generateRandomValues();
		
		//Set the Genre. If no genre is provided (from genre lock), it is generated.
		setGenre(genre);
		
		//Select the sentence structure. The multiplier is equal to the number of sentence structures there are to choose from.
		sentencestructure=Math.floor(Math.random() * 5);
		/*	"A [type] game where..."
			0: "a [adj] [noun] [verb] a [adj] [noun] while a [adj] [noun] [verb] a [adj] [noun]."
			1: "a [adj] [noun] [verb] a [adj] [noun] in a [desc] [location] while a [adj] [noun] [verb] a [adj] [noun]."
			2: "you [verb2a] a [adj] [noun] while you [verb2act] a [adj] [noun]."
			3: "you [verb2a] a [adj] [noun] in a [desc] [location] while it [verb2act] you."
			4: "you [verb2a] a [adj] [noun] in a [desc] [location] while a you [verb2act] a [adj] [noun]."
		*/
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
		}
		// Less Efficient Method
		/*if (sentencestructure == 0) {
			buildSentenceO();
		}
		
		if (sentencestructure == 1) {
			buildSentence1();
		}
		
		if (sentencestructure == 2) {
			buildSentence2();
		}
		
		if (sentencestructure == 3) {
			buildSentence3();
		}
		
		if (sentencestructure == 4) {
			buildSentence4();
		}*/
		
		o3=Math.floor(Math.random() * 10);		//Randomize if you get a sentence addition
		if (o3 < 5) {
			generatedidea += ".";
		} else {
			var add = Math.floor(Math.random() * additions.length);
			generatedidea += additions[add];
		}
		generatedidea += "<br />";
		
		//Put the text in the designated area.
		var ideaPositionOnPage = document.getElementById('ideatext');
		ideaPositionOnPage.innerHTML = generatedidea;
	});
}

function trimWhitespaceFromLists(list1, list2, list3) {
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
}

function generateRandomValues() {
	gt=Math.floor(Math.random() * types.length);	//Gives game type a value between 0 and 9, providing 10 game type options
	n1=Math.floor(Math.random() * nouns.length);	//Gives noun1 a value between 0 and 99, providing 100 noun options
	n2=Math.floor(Math.random() * nouns.length);	//Gives noun2 a value between 0 and 99, providing 100 noun options
	v1=Math.floor(Math.random() * verbs3rd.length);	//Gives verb1 a value between 0 and 99, providing 100 noun options
	
	//Get Adjectives or decide if there will be adjectives
	o1=Math.floor(Math.random() * 5);
	if (o1 == 0) {
		a1 = a2 = -1;
	}
	if (o1 == 1) {
		a1 = Math.floor(Math.random() * adjectives.length);
		a2 = -1;
	}
	if (o1 == 2) {
		a2 = Math.floor(Math.random() * adjectives.length);
		a1 = -1;
	}
	if (o1 == 3) {
		a1 = Math.floor(Math.random() * adjectives.length);
		a2 = Math.floor(Math.random() * adjectives.length);
	}
	if (o1 == 4) {
		a2 = Math.floor(Math.random() * adjectives.length);
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
}

function setGenre(genre) {
	if (genre == '') {
		if (types[gt].substr(0,1)==="a" || types[gt].substr(0,1)==="e" || types[gt].substr(0,1)==="i" || types[gt].substr(0,1)==="o" || types[gt].substr(0,1)==="u") {
			generatedidea += "An ";
		} else {
			generatedidea += "A ";
		}
		generatedidea += "<div id='genre'>" + types[gt] + "</div>";
	} else {
		if (genre.substr(0,1)==="a" || genre.substr(0,1)==="e" || genre.substr(0,1)==="i" || genre.substr(0,1)==="o" || genre.substr(0,1)==="u") {
			generatedidea += "An ";
		} else {
			generatedidea += "A ";
		}
		generatedidea += "<div id='genre'>" + genre + "</div>";
	}
	generatedidea += " game where ";
}

function buildSentenceO() {
	
		/* "A [adj] [noun] [verb] a [adj] [noun] while a [adj] [noun] [verb] a [adj] [noun]." */
			if (a1 >= 0) {
				if (o4 < 5) {
					if (adjectives[a1].substr(0,1)==="a" || adjectives[a1].substr(0,1)==="e" || adjectives[a1].substr(0,1)==="i" || adjectives[a1].substr(0,1)==="o" || adjectives[a1].substr(0,1)==="u") {
						generatedidea += "an ";
					} else {
						generatedidea += "a ";
					}
				}
				generatedidea += adjectives[a1] + " ";
			} else {
				if (o4 < 5) {
					if (nouns[n1].substr(0,1)==="a" || nouns[n1].substr(0,1)==="e" || nouns[n1].substr(0,1)==="i" || nouns[n1].substr(0,1)==="o" || nouns[n1].substr(0,1)==="u") {
						generatedidea += "an ";
					} else {
						generatedidea += "a ";
					}
				}
			}
			if (o4 < 5) {
				generatedidea += nouns[n1] + " ";
				generatedidea += verbs3rd[v1] + " ";
			} else {
				generatedidea += pnouns[n1] + " ";
				generatedidea += verbs2nd[v1] + " ";
			}
			o4=Math.floor(Math.random() * 10);		//Select Plural or Single noun again.
			if (a2 >= 0) {
				if (o4 < 5) {
					if (adjectives[a2].substr(0,1)==="a" || adjectives[a2].substr(0,1)==="e" || adjectives[a2].substr(0,1)==="i" || adjectives[a2].substr(0,1)==="o" || adjectives[a2].substr(0,1)==="u") {
						generatedidea += "an ";
					} else {
						generatedidea += "a ";
					}
				}
				generatedidea += adjectives[a2] + " ";
			} else {
				if (o4 < 5) {
					if (nouns[n2].substr(0,1)==="a" || nouns[n2].substr(0,1)==="e" || nouns[n2].substr(0,1)==="i" || nouns[n2].substr(0,1)==="o" || nouns[n2].substr(0,1)==="u") {
						generatedidea += "an ";
					} else {
						generatedidea += "a ";
					}
				}
			}
			if (o4 < 5) {
				generatedidea += nouns[n2];
			} else {
				generatedidea += pnouns[n2];
			}
			
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

function buildSentence1() {
	/* "a [adj] [noun] [verb] a [adj] [noun] in a [desc] [location] while a [adj] [noun] [verb] a [adj] [noun]." */
			if (a1 >= 0) {
				if (o4 < 5) {
					if (adjectives[a1].substr(0,1)==="a" || adjectives[a1].substr(0,1)==="e" || adjectives[a1].substr(0,1)==="i" || adjectives[a1].substr(0,1)==="o" || adjectives[a1].substr(0,1)==="u") {
						generatedidea += "an ";
					} else {
						generatedidea += "a ";
					}
				}
				generatedidea += adjectives[a1] + " ";
			} else {
				if (o4 < 5) {
					if (nouns[n1].substr(0,1)==="a" || nouns[n1].substr(0,1)==="e" || nouns[n1].substr(0,1)==="i" || nouns[n1].substr(0,1)==="o" || nouns[n1].substr(0,1)==="u") {
						generatedidea += "an ";
					} else {
						generatedidea += "a ";
					}
				}
			}
			if (o4 < 5) {
				generatedidea += nouns[n1] + " ";
				generatedidea += verbs3rd[v1] + " ";
			} else {
				generatedidea += pnouns[n1] + " ";
				generatedidea += verbs2nd[v1] + " ";
			}
			o4=Math.floor(Math.random() * 10);		//Select Plural or Single noun again.
			if (a2 >= 0) {
				if (o4 < 5) {
					if (adjectives[a2].substr(0,1)==="a" || adjectives[a2].substr(0,1)==="e" || adjectives[a2].substr(0,1)==="i" || adjectives[a2].substr(0,1)==="o" || adjectives[a2].substr(0,1)==="u") {
						generatedidea += "an ";
					} else {
						generatedidea += "a ";
					}
				}
				generatedidea += adjectives[a2] + " ";
			} else {
				if (o4 < 5) {
					if (nouns[n2].substr(0,1)==="a" || nouns[n2].substr(0,1)==="e" || nouns[n2].substr(0,1)==="i" || nouns[n2].substr(0,1)==="o" || nouns[n2].substr(0,1)==="u") {
						generatedidea += "an ";
					} else {
						generatedidea += "a ";
					}
				}
			}
			if (o4 < 5) {
				generatedidea += nouns[n2];
			} else {
				generatedidea += pnouns[n2];
			}
			o4=Math.floor(Math.random() * 10);		//Select location preposition.
			switch (o4) {
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
			if (a2 >= 0) {
				if (descriptions[a2].substr(0,1)==="a" || descriptions[a2].substr(0,1)==="e" || descriptions[a2].substr(0,1)==="i" || descriptions[a2].substr(0,1)==="o" || descriptions[a2].substr(0,1)==="u") {
					generatedidea += "an ";
				} else {
					generatedidea += "a ";
				}
				generatedidea += descriptions[a2] + " ";
			} else {
				if (locations[n2].substr(0,1)==="a" || locations[n2].substr(0,1)==="e" || locations[n2].substr(0,1)==="i" || locations[n2].substr(0,1)==="o" || locations[n2].substr(0,1)==="u") {
					generatedidea += "an ";
				} else {
					generatedidea += "a ";
				}
			}
			generatedidea += locations[n2];
			
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

function buildSentence2() {
	/* "you [verb2a] a [adj] [noun] in a [desc] [location] while you [verb2act] a [adj] [noun]." */
			generatedidea += "you ";
			generatedidea += verbs2nd[v1] + " ";
			
			o4=Math.floor(Math.random() * 10);		//Select Plural or Single noun again.
			if (a2 >= 0) {
				if (o4 < 5) {
					if (adjectives[a2].substr(0,1)==="a" || adjectives[a2].substr(0,1)==="e" || adjectives[a2].substr(0,1)==="i" || adjectives[a2].substr(0,1)==="o" || adjectives[a2].substr(0,1)==="u") {
						generatedidea += "an ";
					} else {
						generatedidea += "a ";
					}
				}
				generatedidea += adjectives[a2] + " ";
			} else {
				if (o4 < 5) {
					if (nouns[n2].substr(0,1)==="a" || nouns[n2].substr(0,1)==="e" || nouns[n2].substr(0,1)==="i" || nouns[n2].substr(0,1)==="o" || nouns[n2].substr(0,1)==="u") {
						generatedidea += "an ";
					} else {
						generatedidea += "a ";
					}
				}
			}
			if (o4 < 5) {
				generatedidea += nouns[n2];
			} else {
				generatedidea += pnouns[n2];
			}
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
				generatedidea += "you ";
				generatedidea += verbs2nd[v2] + " ";
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

function buildSentence3() {
	/* "you [verb2a] a [adj] [noun] in a [desc] [location] while it [verb2act] you." */
			generatedidea += "you ";
			generatedidea += verbs2nd[v1] + " ";
			
			o4=Math.floor(Math.random() * 10);		//Select Plural or Single noun again.
			if (a2 >= 0) {
				if (o4 < 5) {
					if (adjectives[a2].substr(0,1)==="a" || adjectives[a2].substr(0,1)==="e" || adjectives[a2].substr(0,1)==="i" || adjectives[a2].substr(0,1)==="o" || adjectives[a2].substr(0,1)==="u") {
						generatedidea += "an ";
					} else {
						generatedidea += "a ";
					}
				}
				generatedidea += adjectives[a2] + " ";
			} else {
				if (o4 < 5) {
					if (nouns[n2].substr(0,1)==="a" || nouns[n2].substr(0,1)==="e" || nouns[n2].substr(0,1)==="i" || nouns[n2].substr(0,1)==="o" || nouns[n2].substr(0,1)==="u") {
						generatedidea += "an ";
					} else {
						generatedidea += "a ";
					}
				}
			}
			if (o4 < 5) {
				generatedidea += nouns[n2];
			} else {
				generatedidea += pnouns[n2];
			}
			//o4=Math.floor(Math.random() * 10);		//Select location preposition.
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
			if (a2 >= 0) {
				if (descriptions[a2].substr(0,1)==="a" || descriptions[a2].substr(0,1)==="e" || descriptions[a2].substr(0,1)==="i" || descriptions[a2].substr(0,1)==="o" || descriptions[a2].substr(0,1)==="u") {
					generatedidea += "an ";
				} else {
					generatedidea += "a ";
				}
				generatedidea += descriptions[a2] + " ";
			} else {
				if (locations[n2].substr(0,1)==="a" || locations[n2].substr(0,1)==="e" || locations[n2].substr(0,1)==="i" || locations[n2].substr(0,1)==="o" || locations[n2].substr(0,1)==="u") {
					generatedidea += "an ";
				} else {
					generatedidea += "a ";
				}
			}
			generatedidea += locations[n2];
			
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
			
			o4=Math.floor(Math.random() * 10);		//Select Plural or Single noun again.
			if (a2 >= 0) {
				if (o4 < 5) {
					if (adjectives[a2].substr(0,1)==="a" || adjectives[a2].substr(0,1)==="e" || adjectives[a2].substr(0,1)==="i" || adjectives[a2].substr(0,1)==="o" || adjectives[a2].substr(0,1)==="u") {
						generatedidea += "an ";
					} else {
						generatedidea += "a ";
					}
				}
				generatedidea += adjectives[a2] + " ";
			} else {
				if (o4 < 5) {
					if (nouns[n2].substr(0,1)==="a" || nouns[n2].substr(0,1)==="e" || nouns[n2].substr(0,1)==="i" || nouns[n2].substr(0,1)==="o" || nouns[n2].substr(0,1)==="u") {
						generatedidea += "an ";
					} else {
						generatedidea += "a ";
					}
				}
			}
			if (o4 < 5) {
				generatedidea += nouns[n2];
			} else {
				generatedidea += pnouns[n2];
			}
			o4=Math.floor(Math.random() * 10);		//Select location preposition.
			switch (o4) {
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
			if (a2 >= 0) {
				if (descriptions[a2].substr(0,1)==="a" || descriptions[a2].substr(0,1)==="e" || descriptions[a2].substr(0,1)==="i" || descriptions[a2].substr(0,1)==="o" || descriptions[a2].substr(0,1)==="u") {
					generatedidea += "an ";
				} else {
					generatedidea += "a ";
				}
				generatedidea += descriptions[a2] + " ";
			} else {
				if (locations[n2].substr(0,1)==="a" || locations[n2].substr(0,1)==="e" || locations[n2].substr(0,1)==="i" || locations[n2].substr(0,1)==="o" || locations[n2].substr(0,1)==="u") {
					generatedidea += "an ";
				} else {
					generatedidea += "a ";
				}
			}
			generatedidea += locations[n2];
			
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
				generatedidea += "you ";
				generatedidea += verbs2nd[v2] + " ";
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