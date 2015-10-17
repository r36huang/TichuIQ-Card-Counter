// copy paste into console to activate
// use getCards(0) and getCardsBySuit(0) to show which cards have not yet been played by rank or by suit, respectively
// use getCards() and getCardsBySuit() to show which cards have been played (by rank or suit)
var cards = {}; 
var lp = []; 

var allCards = ["00", "01", "02a", "02b", "02c", "02d", "03a", "03b", "03c", "03d", "04a", "04b", "04c", "04d", "05a", "05b", "05c", "05d", "06a", "06b", "06c", "06d", "07a", "07b", "07c", "07d", "08a", "08b", "08c", "08d", "09a", "09b", "09c", "09d", "10a", "10b", "10c", "10d", "11a", "11b", "11c", "11d", "12a", "12b", "12c", "12d", "13a", "13b", "13c", "13d", "14a", "14b", "14c", "14d", "15", "17"]
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

setInterval(function(){
	$.get('http://tichuiq.com/public_html/get_game_data.php?start=0&firstcall=0').then(function(r){
			var r = JSON.parse(r); 
			var h = r.active_hand.played_pile; 
			if (!r.given_cards) {resetCards(cards); resetCardsBySuit(cardsBySuit); console.clear();}; 
			if(r.dogs_were_played) {cards["00"] = true; cardsBySuit["00"] = true;};
			h.forEach(function(c) {cards[c] = true; cardsBySuit[c] = true;}); 
			var np = Object.keys(cards).filter(function(c){return cards[c];}); 
			(lp.length < np.length) && console.log(np);
			lp = np; 
			if(r.current_player == 0) {console.log(Object.keys(cards).filter(function(c){return !cards[c];}))};
		})
}, 500)

function getCards(i) {
	switch(i) {
		case 0:
			console.log(Object.keys(cards).filter(function(c){return !cards[c];}));
			break;
		default:
			console.log(Object.keys(cards).filter(function(c){return cards[c];}));
	}
}

function getCardsBySuit(i) {
	switch(i) {
		case 0:
			console.log(Object.keys(cardsBySuit).filter(function(c){return !cardsBySuit[c];}));
			break;
		default:
			console.log(Object.keys(cardsBySuit).filter(function(c){return cardsBySuit[c];}));
	}
}
