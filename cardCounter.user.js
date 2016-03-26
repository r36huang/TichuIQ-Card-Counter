// ==UserScript==
// @name         TichuIQ Card Counter with Visual Display
// @namespace    http://your.homepage/
// @version      0.3
// @description  enter something useful
// @author       You
// @match        http://tichuiq.com/public_html/game.php
// @grant        none
// ==/UserScript==
// This script automatically tracks which cards have been played.
// "00" is dog, "01" is mahjong, "15" is phoenix, "17" is dragon
// a is black, b is blue, c is green, d is red
// To make this automatically load, install this script into Tampermonkey for Google Chrome
// When you type ":]" in the chat, the script will start telling you what cards have not yet been played, and when you type ":[" it will tell you the unplayed cards sorted by suit.
// To stop it from telling you the unplayed cards, just type anything else in chat.
// When you type "[:" in the chat, the script will print out what cards have not yet been played in the alert box, and when you type "]:" it will send an alert with the unplayed cards sorted by suit.
// This will trigger a flag that you have already been alerted. Type " " in the chat to clear the flag.
var cards = {};
var lp = [];
var allCards = ["00", "01", "15", "17", "02a", "02b", "02c", "02d", "03a", "03b", "03c", "03d", "04a", "04b", "04c", "04d", "05a", "05b", "05c", "05d", "06a", "06b", "06c", "06d", "07a", "07b", "07c", "07d", "08a", "08b", "08c", "08d", "09a", "09b", "09c", "09d", "10a", "10b", "10c", "10d", "11a", "11b", "11c", "11d", "12a", "12b", "12c", "12d", "13a", "13b", "13c", "13d", "14a", "14b", "14c", "14d"]
function resetCards(cards) {
	allCards.forEach(function(c) {cards[c] = false;});
}
resetCards(cards);
var cardsBySuit = {};
var allCardsBySuit = ["00", "01", "15", "17", "02a", "03a", "04a", "05a", "06a", "07a", "08a", "09a", "10a", "11a", "12a", "13a", "14a", "02b", "03b", "04b", "05b", "06b", "07b", "08b", "09b", "10b", "11b", "12b", "13b", "14b", "02c", "03c", "04c", "05c", "06c", "07c", "08c", "09c", "10c", "11c", "12c", "13c", "14c", "02d", "03d", "04d", "05d", "06d", "07d", "08d", "09d", "10d", "11d", "12d", "13d", "14d"]
function resetCardsBySuit(cardsBySuit) {
	allCardsBySuit.forEach(function(c) {cardsBySuit[c] = false;});
}
resetCardsBySuit(cardsBySuit);
var alerted = false;
var cardsInHand = {};
var cardWindow = createWindow();

function getCards(i) { // logs in the console the cards left (sorted by rank)
	switch(i) {
		case 0:
			console.log(Object.keys(cards).filter(function(c){return (!cards[c] && !cardsInHand[c]);}));
			break;
		default:
			console.log(Object.keys(cards).filter(function(c){return cards[c];}));
	}
}
function getCardsBySuit(i) { // logs in the console the cards left (sorted by suit)
	switch(i) {
		case 0:
			console.log(Object.keys(cardsBySuit).filter(function(c){return (!cardsBySuit[c] && !cardsInHand[c]);}));
			break;
		default:
			console.log(Object.keys(cardsBySuit).filter(function(c){return cardsBySuit[c];}));
	}
}

// Main Loop
setInterval(function(){
	$.get('http://tichuiq.com/public_html/get_game_data.php?start=0&firstcall=0').then(function(r){
			var r = JSON.parse(r); 
			for(i = 0; i < 4; i++) {
				if(typeof(r.players[i].cards[0]) == "string") { // you only get to see your own hand, every other hand is just a "number"
					var s = r.players[i].cards;
					s.forEach(function(c){cardsInHand[c] = true;});
				}
			};
			var h = r.active_hand.played_pile; 
			if (!r.given_cards) {resetCards(cards); resetCardsBySuit(cardsBySuit); resetCards(cardsInHand); console.clear();}
			if(r.dogs_were_played) {cards["00"] = true; cardsBySuit["00"] = true;}
			h.forEach(function(c) {cards[c] = true; cardsBySuit[c] = true;}); 
			var np = Object.keys(cards).filter(function(c){return cards[c];}); 
			(lp.length < np.length) && console.log(np);
			lp = np; 
			if(r.messages[0] && r.messages[0].m == ":]") {getCards(0);};
			if(r.messages[0] && r.messages[0].m == ":[") {getCardsBySuit(0);};
			if(r.messages[0] && r.messages[0].m == "[:" && !alerted) {alert(Object.keys(cards).filter(function(c){return (!cards[c] && !cardsInHand[c]);})); alerted = true;};
			if(r.messages[0] && r.messages[0].m == "]:" && !alerted) {alert(Object.keys(cardsBySuit).filter(function(c){return (!cardsBySuit[c] && !cardsInHand[c]);})); alerted = true;};
			if(r.messages[0] && r.messages[0].m == " ") {alerted = false;};

			updateWindow(cardWindow, cards);
		
		})
}, 500)

function createWindow(){
	var cardWindow = window.open("", "Cards", "width=200, height=700");
	var cardDocument = cardWindow.document;
	cardDocument.title = "Cards";
	cardDocument.body.bgColor = "000000";

	var urlBase = "http://tichuiq.com/public_html/images/cards/";

	var rowBlack = cardDocument.createElement("P");
	rowBlack.id = "rowBlack"
	var rowBlue = cardDocument.createElement("P");
	rowBlue.id = "rowBlue"
	var rowGreen = cardDocument.createElement("P");
	rowGreen.id = "rowGreen"
	var rowRed = cardDocument.createElement("P");
	rowRed.id = "rowRed"
	cardDocument.body.appendChild(rowBlack);
	cardDocument.body.appendChild(rowBlue);
	cardDocument.body.appendChild(rowGreen);
	cardDocument.body.appendChild(rowRed);
	
	for(i in allCards) {
		var bodyElement = cardDocument.createElement("span");
		bodyElement.id = allCards[i];
		var bodyImg = cardDocument.createElement("img");
		bodyImg.id = allCards[i]+" img";
		bodyImg.setAttribute("src", urlBase+allCards[i]+".png");
		bodyElement.appendChild(bodyImg);
		var bodySeparationSpace = cardDocument.createTextNode(" ");
		bodyElement.appendChild(bodySeparationSpace);
		switch(i % 4) {
			case 0:
				rowBlack.appendChild(bodyElement);
				break;
			case 1:
				rowBlue.appendChild(bodyElement);
				break;
			case 2:
				rowGreen.appendChild(bodyElement);
				break;
			case 3:
				rowRed.appendChild(bodyElement);
				break;
		}
	}
	
	updateWindow(cardWindow,cards);
	
	return cardWindow;
}

function updateWindow(cardWindow, cards){
	var cardDocument = cardWindow.document;
	
	var cardsArray = Object.keys(cards).filter(function(c){return (!cards[c] && !cardsInHand[c]);});

	for(i in cardsArray) {
		var rand = Math.random();
		if(rand > 0.5) {
			cardDocument.getElementById(cardsArray[i]+" img").setAttribute("src", "http://tichuiq.com/public_html/images/resource/tichuVerCard.png");
		} else {
			cardDocument.getElementById(cardsArray[i]+" img").setAttribute("src", "http://i.imgur.com/JHuAJ9W.png");
		}
	}
}

// Intrinsic Ranking: 17, 15, 14d, 14c, 14b, 14a, ..., 2a, 01, 00
