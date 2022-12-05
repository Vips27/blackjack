var dealerSum = 0;
var userSum = 0;
var user2Sum = 0;

var dealerAceCount = 0;
var userAceCount = 0;
var user2AceCount = 0;
var lastCard;
var turn = 1;

var hidden;
var deck;

var isSplit = false;
var canHit = true;
window.onload = function(){ 
    buildDeck();
    shuffleDeck();
    // startGame();
    hitBtn = document.getElementById("hit")
    hitBtn.disabled = true
    stayBtn = document.getElementById("stay")
    stayBtn.disabled = true
    splitBtn = document.getElementById("split")
    splitBtn.disabled = true
}

function buildDeck(){
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let types = ["C", "D", "H", "S"];
    deck = [];

    for (let i = 0; i < types.length; i++){
        for (let j = 0; j < values.length; j++){
            deck.push(values[j] +"-"+ types[i]);
        }
    }
    // console.log(deck);
}

function shuffleDeck(){
    for (let i = 0; i < deck.length; i++){
        let j = Math.floor(Math.random() * deck.length);
        let temp = deck[i];
        deck[i] = deck[j]
        deck[j] = temp
    }
    console.log(deck);
}

function startGame(){
    hidden = deck.pop()
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);
    // console.log(hidden);
    // console.log(dealerSum);
    var hiddenImg = document.createElement("img");
    hiddenImg.id = "hidden"
    hiddenImg.src = "./Images/PNG/red_back.png"
    hiddenImg.className = "card";
    document.getElementById("dealer-cards").append(hiddenImg)
    hitBtn = document.getElementById("hit")
    hitBtn.disabled = false
    stayBtn = document.getElementById("stay")
    stayBtn.disabled = false
    isSplit = false;

    var firstValue = 0;
    // while (dealerSum < 17){
    for (let i = 0; i < 1; i++){
        let cardImg = document.createElement("img")
        let card = deck.pop();
        cardImg.src = "./Images/PNG/" + card + ".png"
        dealerSum += getValue(card);
        if(i == 0) firstValue = getValue(card);
        
        dealerAceCount += checkAce(card);
        cardImg.className = "card";
        document.getElementById("dealer-cards").append(cardImg)
        // }
        document.getElementById("dealer-sum").innerText = dealerSum;
        
        const button = document.getElementById("deal")
        button.disabled = true
    }
    document.getElementById("dealer-sum").innerText = firstValue;
    // console.log(dealerSum);

    let card1 = deck.pop();
    let card2= deck.pop();
    let data1 = card1.split("-");
    let data2 = card2.split("-");

    console.log("card1:", card1, "card2:", card2)
    let initCards = [];
    for (let i = 0; i < 2; i++){
        let cardImg = document.createElement("img")
        let card = deck.pop();
        console.log(card);
        cardImg.src = "./Images/PNG/" + card + ".png"
        userSum += getValue(card);
        console.log(userSum)
        userAceCount += checkAce(card);
        console.log(userAceCount)
        cardImg.className = "card";
        document.getElementById("user1-cards").append(cardImg)

        let message = "";
        let data = card.split("-");
        initCards.push(card)
        // if (data[0]){
        //     splitBtn = document.getElementById("split")
        //     splitBtn.disabled = false
        // }
        if (userSum > 21){
         canHit = false
         hitBtn = document.getElementById("hit")
         hitBtn.disabled = true
         message = "You lose"
         document.getElementById("dealer-sum").innerText = dealerSum;
         document.getElementById("hidden").src = "./Images/PNG/" + hidden + ".png";
        }
        document.getElementById("user-sum").innerText = userSum;
        document.getElementById("results").innerText = message;

        if(i == 1){
            lastCard = card;
        }
    }
    if(getValue(initCards[0]) == getValue(initCards[1])){
        splitBtn = document.getElementById("split");
        splitBtn.disabled = false
    }
    
    // console.log(userSum);
    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stay").addEventListener("click", stay)
    document.getElementById("split").addEventListener("click", split)
}

function hit(){
    if (!canHit){
        return;
    }
    let cardImg = document.createElement("img")
    let card = deck.pop();
    cardImg.src = "./Images/PNG/" + card + ".png"
    cardImg.className = "card";

    if(turn == 1){
        userSum += getValue(card);
        userAceCount += checkAce(card);
        document.getElementById("user1-cards").append(cardImg)
    
    }
    else{
        user2Sum += getValue(card);
        user2AceCount += checkAce(card);
        document.getElementById("user2-cards").append(cardImg)
        document.getElementById("user2-cards").classList.add("add-bar");
    }

   

    dealerSum = reduceAce(dealerSum, dealerAceCount);
   
    if(isSplit == false){
        document.getElementById("user-sum").innerText = reduceAce(userSum, userAceCount);
    }
    else{
        document.getElementById("user-sum").innerText = reduceAce(userSum, userAceCount)+","+reduceAce(user2Sum, user2AceCount);
    }
    
    let message = "";

    if(turn == 1){
        if (reduceAce(userSum, userAceCount) > 21){
            if(isSplit == false){
                canHit = false;
                message = "You loose"
                hitter = document.getElementById("hit")
                hitter.disabled = true
                stayBtn = document.getElementById("stay")
                stayBtn.disabled = true
                document.getElementById("hidden").src = "./Images/PNG/" + hidden + ".png";
                for (let i = 0; i < 1; i++){
                    let cardImg = document.createElement("img")
                    let card = deck.pop();
                    cardImg.src = "./Images/PNG/" + card + ".png"
                    dealerSum += getValue(card);
                    dealerAceCount += checkAce(card);
                    cardImg.className = "card";
                    document.getElementById("dealer-cards").append(cardImg)
                }
                document.getElementById("dealer-sum").innerText = dealerSum;
                document.getElementById("deal-score").style.display = "block";
            }
            else{
                message = "Player 1 looses"
                setTimeout(function(){
                    isSplit = false;
                    userSum = user2Sum;
                    user2AceCount = userAceCount;
                    user2Sum = 0;
                    user2AceCount = 0;
                    let userCards = document.getElementById("user1-cards");
                    let user2Cards = document.getElementById("user2-cards");
                    while(userCards.children.length > 0){
                        userCards.removeChild(userCards.lastChild);
                    }
                    while(user2Cards.children.length > 0){
                        userCards.appendChild(user2Cards.lastChild);
                    }
                    document.getElementById("results").innerText = ""
                    turn = 1;
                    document.getElementById("user-sum").innerText = reduceAce(userSum, userAceCount);
                },1000)
            }
        }
    }
    else{
        if (reduceAce(user2Sum, user2AceCount) > 21){
            message = "Player 2 looses"
            setTimeout(function(){
                isSplit = false;
                user2Sum = 0;
                user2AceCount = 0;
                let user2Cards = document.getElementById("user2-cards");
                while(user2Cards.children.length > 0){
                    user2Cards.removeChild(user2Cards.lastChild);
                }
              
                document.getElementById("user-sum").innerText = reduceAce(userSum, userAceCount);
                document.getElementById("results").innerText = ""
                turn = 1;
            },1000)
        }
    }

    if(isSplit == true){
        if(turn === 1){
            turn = 2;
        }
        else{
            turn = 1;
        }
    }
    
    document.getElementById("results").innerText = message
}

function stay(){
    dealerSum = reduceAce(dealerSum, dealerAceCount);
    userSum = reduceAce(userSum, userAceCount);
    if(isSplit == true){
        user2Sum = reduceAce(user2Sum, user2AceCount);
    }
    
    canHit = false;
    hitBtn = document.getElementById("hit")
    hitBtn.disabled = true
    stayBtn = document.getElementById("stay")
    stayBtn.disabled = true
    document.getElementById("hidden").src = "./Images/PNG/" + hidden + ".png";
    for (let i = 0; i < 1; i++){
        let cardImg = document.createElement("img")
        let card = deck.pop();
        cardImg.src = "./Images/PNG/" + card + ".png"
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        cardImg.className = "card";
        document.getElementById("dealer-cards").append(cardImg);
    }
    let message = "";
    if(isSplit == false){
        if(dealerSum > 21){
            message = "You win!"
        }
        else if (userSum > 21){
            message = "You lose!"
        }
        else if (dealerAceCount > 21){
            message = "You win!"
        }
        else if (userSum > dealerSum){
            message = "You win!"
        }
        else if (userSum < dealerSum){
            message = "You lose!"
        }
        else if (userSum == 21){
            message = "You win!"
        }
        else if (userSum == dealerSum){
            message = "Tie!"
        }
    }
    else{
        if(dealerSum > 21){
            message = "Player 1 wins!"
        }
        else if (userSum > 21){
            message = "Player 1 loses!"
        }
        else if (dealerAceCount > 21){
            message = "Player 1 wins!"
        }
        
        else if (userSum > dealerSum){
            message = "Player 1 wins!"
        }
        else if (userSum < dealerSum){
            message = "Player 1 loses!"
        }
        else if (userSum == 21){
            message = "Player 1 wins!"
        }
        else if (userSum == dealerSum){
            message = "Player 1 and dealer tied!"
        }

        if(dealerSum > 21){
            message += " Player 2 wins!"
        }
        else if (user2Sum > 21){
            message += " Player 2 loses!"
        }
        else if (dealerAceCount > 21){
            message += " Player 2 wins!"
        }
        else if (user2Sum > dealerSum){
            message += " Player 2 wins!"
        }
        else if (user2Sum < dealerSum){
            message += " Player 2 loses!"
        }
        else if (user2Sum == 21){
            message += "Player 2 wins!"
        }
        else if (user2Sum == dealerSum){
            message += "Player 2 and dealer tied!"
        }
    }
    
  
    document.getElementById("dealer-sum").innerText = dealerSum
    if(isSplit == false){
        document.getElementById("user-sum").innerText = userSum
    }
    else{
        document.getElementById("user-sum").innerText = userSum+","+user2Sum
    }
    document.getElementById("results").innerText = message;
    document.getElementById("deal-score").style.display = "block";
    
}

function split(){
    userSum -= getValue(lastCard);
    user2Sum += getValue(lastCard);
    document.getElementById("user-sum").innerText = userSum+","+user2Sum;
    document.getElementById("user2-cards").appendChild(document.getElementById("user1-cards").lastChild);
    document.getElementById("user2-cards").classList.add("add-bar");
    isSplit = true;

    splitBtn = document.getElementById("split");
    splitBtn.disabled = true
}

function getValue(card){
    let data = card.split("-");
    let value = data[0];

    if (isNaN(value)){
        if (value == "A"){
            return 11;
        }
        return 10;
    }
    return parseInt(value);
}

function checkAce(card){
    if (card[0] == "A"){
        return 1;
    }
    return 0;
}

function reduceAce(playerSum, playerAceCount){
    while (playerSum > 21 && playerAceCount > 0){
        playerSum -= 10;
        playerAceCount -= 1;
    }
    return playerSum
}
