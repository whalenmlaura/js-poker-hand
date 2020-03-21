window.onload = function(){

    // declare arrays for cards
    let valueArray = [];
    let suitArray = [];

// ----------------------------- Same Suit Checker AND regular flush (Any five cards of the same suit, but not in a sequence)-----------------------------  
    let isSameSuit = function(suitToCheck, suits) {
        // check that all suits are the same as the first card - https://www.geeksforgeeks.org/how-to-check-all-values-of-an-array-are-equal-or-not-in-javascript/
        if (suits.every((array) => (array === suitToCheck)) === true) {
            return true;
        } else {
            return false;
        };
    };
    
// ----------------------------- royal flush (A, K, Q, J, 10, all the same suit) -----------------------------
    let isRoyalFlush = function(values) {
        // check that every card is greater or equal to 10
        if (values.every((item) => (item >= 10)) === true) {
            return true;
        } else {
            return false;
        };
    };

// ----------------------------- straight (Five cards in a sequence) / Use for straight flush too -----------------------------
    let isStraight = function(values) {
        // check that numbers are consecutive - https://stackoverflow.com/questions/34723831/check-if-javascript-array-values-are-sequential-and-not-equal
        let arrayLength = 0;
        let consecutiveArray = [];
        for (let i = 0; i < values.length - 1; i++) {
            //makes array inside array of first number
            let innerArray = [values[i]];
            while (values[i + 1] === (values[i] + 1)) {
                //pushes number after the first number, i++ continues loop
                innerArray.push(values[i + 1]);
                i++;
            };
            consecutiveArray.push(innerArray);
            //inside for loop, check length of innerArrays
            if (innerArray.length >= arrayLength) {
                arrayLength = innerArray.length;
            };
        };
        // Since Ace's value is 14, handle odd case first (A, 2, 3, 4, 5)
        if (values.includes(14) && values.includes(2) && values.includes(3) && values.includes(4) && values.includes(5)) {
            return true;
        } else if (arrayLength == 5) {
            return true;
        } else {
            return false;
        };
    };

// ----------------------------- four/three of a kind (number of cards of the same rank) -----------------------------
    let isNumOfaKind = function(values) {
        let highestDuplicates = 0;
        values.forEach(function(num){
            let duplicates = 0;
            for (let i=0; i < values.length; i++) {
                if (num == values[i]) {
                    duplicates++;
                };
            };
            if (duplicates > highestDuplicates) {
                highestDuplicates = duplicates;
            };
        });
        if (highestDuplicates == 4) {
            return 4;
        } else if (highestDuplicates == 3) {
            return 3;
        } else if (highestDuplicates == 2) {
            return 2;
        };
    };

// ----------------------------- full house (Three of a kind with a pair) -----------------------------
    let isFullHouse = function(values) {
        let threeDupes = false;
        let twoDupes = false;

        values.forEach(function(num){
            let duplicates = 0;
            for (let i=0; i < values.length; i++) {
                if (num == values[i]) {
                    duplicates++;
                };
            };
            if (duplicates == 3) {
                threeDupes = true;
            };
            if (duplicates == 2) {
                twoDupes = true;
            }; 
        });
        // if one is false, the whole thing is false
        return threeDupes && twoDupes;
    };

// ----------------------------- one/two pair (number of different pairs) -----------------------------
    let isPair = function(values) {
        // https://www.geeksforgeeks.org/count-equal-element-pairs-in-the-given-array/
        let numOfPairs = 0;
        let i = 0;
        while (i < (values.length - 1)) {
            if (values[i] == values[i+1]) {
                numOfPairs++;
                i = i + 2;
            } else {
                i++;
            };
        };
        if (numOfPairs == 2) {
            return 2;
        };
        if (numOfPairs == 1) {
            return 1;
        };
    };

// ----------------------------- high card (When you haven't made any of the hands above, the highest card plays) -----------------------------
    let highestCard = function(values) {
        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/max
        let highCard = Math.max(...values);
        switch (highCard) {
            case 14:
                return "HIGHEST CARD: ACE";
            case 13:
                return "HIGHEST CARD: KING";
            case 12:
                return "HIGHEST CARD: QUEEN";
            case 11:
                return "HIGHEST CARD: JACK";
            default:
                return (`HIGHEST CARD: ${highCard}`);
        };
    };

    // functions to check hands
    let handChecker = function(suitToCheck, suits, values){
        if ((isSameSuit(suitToCheck, suits)) && (isRoyalFlush(values))) {
            return "ROYAL FLUSH!";
        } else if ((isSameSuit(suitToCheck, suits)) && (isStraight(values))) {
            return "STRAIGHT FLUSH";
        } else if (isNumOfaKind(values) == 4) {
            return "FOUR OF A KIND";
        } else if (isFullHouse(values)) {
            return "FULL HOUSE";
        } else if (isSameSuit(suitToCheck, suits)) {
            return "FLUSH";
        } else if (isStraight(values)) {
            return "STRAIGHT";
        } else if (isNumOfaKind(values) == 3) {
            return "THREE OF A KIND";
        } else if (isPair(values) == 2) {
            return "TWO PAIRS";
        } else if (isPair(values) == 1) {
            return "ONE PAIR"
        } else {
            return highestCard(values);
        };
    };

    let cardSorter = function(hand) {
        // add the image of each card to the html page
        hand.forEach(function(element){
            document.getElementById("cards").innerHTML += ("<img src="+element.image+">");
            // change any face cards to numeric values
            switch (element.value) {
                case "JACK":
                    element.value = 11;
                    break;
                case "QUEEN":
                    element.value = 12;
                    break;
                case "KING":
                    element.value = 13;
                    break;
                case "ACE":
                    element.value = 14;
                    break;
                default:
                    break;
            };
            // change values from string to int and push values and suits to respective arrays
            element.value = Number.parseInt(element.value);
            valueArray.push(element.value);
            suitArray.push(element.suit);
            // sort numeric values - https://www.tutorialrepublic.com/faq/how-to-sort-an-array-of-integers-correctly-in-javascript.php
            valueArray.sort(function(a, b){
                return a - b;
            });
        });
    };

    // fetch a new deck of cards
    fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
        .then(function(response){
            return response.json();
        })
        .then(function(myJson){
            // get the deck_id of the fetched deck and fetch 5 cards from the deck
            let deckId = myJson.deck_id;
            fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=5`)
// ------------------------------------------- TEST HANDS -------------------------------------------
            //fetch('https://www.mikecaines.com/cards/royalflush.json')
            //fetch('https://www.mikecaines.com/cards/straightflush.json')
            //fetch('https://www.mikecaines.com/cards/flush.json')
            //fetch('https://www.mikecaines.com/cards/highstraight.json')
            //fetch('https://www.mikecaines.com/cards/fourofakind.json')
            //fetch('https://www.mikecaines.com/cards/fullhouse.json')
            //fetch('https://www.mikecaines.com/cards/threeofakind.json')
            //fetch('https://www.mikecaines.com/cards/lowstraight.json')
            //fetch('https://www.mikecaines.com/cards/twopair.json')
            //fetch('https://www.mikecaines.com/cards/pair.json')
            //fetch('https://www.mikecaines.com/cards/acehigh.json')
                .then(function(myDeck){
                    return myDeck.json();
                })
                // get info from the 5 cards
                .then(function(myHand){
                    // assign cards to variable and call function to assign and sort the cards
                    let gameHand = myHand.cards;
                    cardSorter(gameHand);
                    // get suit of first card, and call function to check the hand
                    let firstSuit = suitArray[0];
                    document.getElementById("highest-hand").innerHTML = ("<h1>"+(handChecker(firstSuit, suitArray, valueArray))+"</h1>");
                }); // end .then(function(myHand)
        }); // end .then(function(myJson)
        
}; // end window.onload