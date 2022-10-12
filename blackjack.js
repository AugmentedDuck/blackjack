let drawnCard = 0; //The new card
let playerScore = 0; //The players count
let playerCards = []; //The players cards on hand
let dealerScore = 0; //The dealers count
let dealerCards = []; //The dealers cards on hand
let playerHighAces = 0; //The players amount of 11 aces 
let dealerHighAces = 0; //The dealers amount of 11 aces
let isStanding = false; //Is the player is done playing
let dealerWin = false; //Has the dealer won 
let playerWin = false; //Has the player won
let isPush = false; //Is it a push
let isBlackjack = false; //Is there a blackjack
let hasPlayerMoved = 0; //Has the player done anything
let chipScore = 1000; //The amout of chips the player starts with
let oldScore = 1000; //The amount of chips the player had
let betAmount = 50; //The amount the player bets each round

//Only runs when the page is loaded
function setup() {
  createCanvas(windowWidth, windowHeight); //Scale the canvas to the window

  gameStart(); //Start the game
}

//Updates every frame
function draw() {
  background(38, 85, 55); //Makes the background green

  displayText();

  displayButtons();

  playerBustDetector();

  whoWon();
}

//What happens if the player stands
function playerStand() {
  //Check the player isn't already standing
  if (!isStanding) {
    dealerTurn(); //Make the dealers move
    isStanding = true; //Change it so the player is standing
    hasPlayerMoved++; //And make it so the player has made a move
  }
}

//What happens if the player hits
function playerHit() {
  //Make sure the player isn't standing
  if (!isStanding) {
    drawnCard = int(random(1, 14)); //Draw a random card between 1-13

    //If the card is a 11, 13 or 13
    if (drawnCard == 11 || drawnCard == 12 || drawnCard == 13) {
      playerScore += 10; //Add 10 to count
      //If the card it a 1
    } else if (drawnCard == 1) {
      playerScore += 11; //Count it as 11
      playerHighAces++; //Add 1 to amount of 11's
      append(playerCards, "A"); //Add an A to the players hand
    } else {
      playerScore += drawnCard; //Else add the number to the players count
      append(playerCards, str(drawnCard)); //Add the number to the players hand
    }

    
    if (drawnCard == 11) {
      append(playerCards, "J"); //If the card is an 11 add J to players hand
    } else if (drawnCard == 12) {
      append(playerCards, "Q"); //If the card is an 12 add Q to players hand
    } else if (drawnCard == 13) {
      append(playerCards, "K"); //If the card is an 13 add K to players hand
    }

    hasPlayerMoved++; //Show player has made a move
  }
}

//What happens when dealer hits
function dealerHit() {
  drawnCard = int(random(1, 14)); //Draw a random card between 1-13
  
  //If the card is a 11, 13 or 13
  if (drawnCard == 11 || drawnCard == 12 || drawnCard == 13) {
    dealerScore += 10; //Add 10 to count
    //If the card it a 1
  } else if (drawnCard == 1) {
    dealerScore += 11; //Count it as 11
    dealerHighAces++;  //Add 1 to amount of 11's
    append(dealerCards, "A"); //Add an A to the dealers hand
  } else {
    dealerScore += drawnCard; //Else add the number to the dealers count
    append(dealerCards, str(drawnCard)); //Add the number to the dealers hand
  }

  if (drawnCard == 11) {
    append(dealerCards, "J"); //If the card is an 11 add J to dealers hand
  } else if (drawnCard == 12) {
    append(dealerCards, "Q");  //If the card is an 12 add Q to dealers hand
  } else if (drawnCard == 13) {
    append(dealerCards, "K");  //If the card is an 13 add K to dealers hand
  }
}

//What happens when it's the dealers turn
function dealerTurn() {
  while (dealerScore < 17) {
    dealerHit(); //While the dealer is under 17, hit

    //If the dealer busts
    if (dealerScore > 21) {
      //Check if dealer has an 11 
      if (dealerHighAces >= 1) {
        dealerScore -= 10; //If true remove 10
        dealerHighAces--; //Remove an 11
      } else {
        playerWin = true; //Else the dealer busts, and player wins
      }
    }
  }
}

//Checks who won
function whoWon() {
  //If the player has a higher count than the dealer and is standing and the dealer hasn't won 
  if (playerScore > dealerScore && isStanding == true && dealerWin == false) {
    playerWin = true; //The player wins

    //else if player has a lower count than the dealer and is standing and the player hasn't won
  } else if (playerScore < dealerScore && isStanding == true && playerWin == false) {
    dealerWin = true; //The dealer wins

    //Else if player and dealer have the same score and the player is standing
  } else if (playerScore == dealerScore && isStanding == true) {
    isPush = true; //It's a push
  }
}

//All the text
function displayText() {
  textSize(24); //Sets the text size
  fill(197, 179, 88); //Makes the text the golden color
  textAlign("center"); //Aligns the text in the center
  text("Dealer Cards: " + dealerCards + "\nCount: " + dealerScore, width / 2, 30); //Tells the dealers cards and count
  text("Your Cards: " + playerCards + "\nCount: " + playerScore + "\nChips: " + chipScore, width / 2, height - 270); //Tells the players cards, count and number of chips

  if (chipScore < betAmount) {
    text("Sorry, not enough chips", width / 2, 150); //If you don't have enough chips to play
  }

  textAlign("center");
  textSize(40); //Makes the text bigger
  if (isPush) {
    text("Push", width / 2, height / 2); //If it's a push write it
    chipScore = oldScore + betAmount; //Give back bet
  } else if (isBlackjack) {
    text("Blackjack", width / 2, height / 2); //If it's a blackjack write it
    chipScore = oldScore + betAmount * 2 + betAmount * (3 / 2); //Give back bet + winnings + blackjack bonus
  } else if (dealerWin) {
    text("Dealer Wins", width / 2, height / 2); //If the dealer wins write it
  } else if (playerWin) {
    text("Player Wins", width / 2, height / 2); //If the player wins write it
    chipScore = oldScore + betAmount * 2; //Give back bet + winnings
  }
}

//Checks if the player has gone bust
function playerBustDetector() {
  //If the players count is above 21
  if (playerScore > 21) {
    //chech if player has 11's
    if (playerHighAces >= 1) {
      playerScore -= 10; //Remove 10
      playerHighAces--; //Remove an 11
    } else {
      dealerWin = true; //Else the player is bust, and dealer wins
      isStanding = true; //The player stands
    }
  }
}

//Checks for a blackjack
function blackjackDetector() {
  //If the player has 21 (only runs at start of game, so no need to check if the player has made any moves)
  if (playerScore == 21) {
    dealerHit(); //Makes the dealer "turn over" it's face down card

    //If the dealer also has 21
    if (dealerScore == 21) {
      isPush = true; //It's a push
      isStanding = true; //The player stands
    } else {
      isBlackjack = true; //The player has blackjack
      isStanding = true; //The player is standing
    }
  }
}

//What happens at game start
function gameStart() {
  betAmount = 50; //Sets the bet amount to 50

  oldScore = chipScore; //Makes the old amount to the new
  if (chipScore >= betAmount) {
    //Resets all the variables    
    drawnCard = 0;
    playerScore = 0;
    playerCards = [];
    dealerScore = 0;
    dealerCards = [];
    playerHighAces = 0;
    dealerHighAces = 0;
    isStanding = false;
    dealerWin = false;
    playerWin = false;
    isPush = false;
    isBlackjack = false;
    hasPlayerMoved = 0;
    chipScore = oldScore - betAmount; //And does some magic (idk why but it works)
    oldScore = chipScore;

    //The player gets to cards
    playerHit();
    playerHit();

    //The dealer get one face up card
    dealerHit();

    //Checks for blackjack
    blackjackDetector();
  }
}

//What happens when player doubles down
function doubleDown() {
  //Has the player got enough chips
  if (chipScore >= betAmount) {
    chipScore -= 50; //Bet an additional 50 chips
    betAmount = 100; //Set the bet to 100
    playerHit(); //Get another card
    playerStand(); //Makes the player stand
  }
}

//If the player surrenders
function surrender() {
  chipScore += betAmount / 2; //Give back half the bet
  gameStart(); //Start a new game
}

//Controls the buttons
function displayButtons() {
  //The stand button
  let standButton = createButton("STAND");
  standButton.position(width / 2 - 235, height - 190);
  standButton.size(150, 70);
  standButton.mousePressed(playerStand);
  //The hit button
  let hitButton = createButton("HIT");
  hitButton.position(width / 2 - 75, height - 190);
  hitButton.size(150, 150);
  hitButton.mousePressed(playerHit);
  //The restart button
  let restartButton = createButton("RESTART 50 CHIPS");
  restartButton.position(width / 2 + 85, height - 110);
  restartButton.size(150, 70);
  restartButton.mousePressed(gameStart);
  //The double down button
  let doubleButton = createButton("DOUBLE DOWN");
  doubleButton.position(width / 2 - 235, height - 110);
  doubleButton.size(150, 70);
  doubleButton.mousePressed(doubleDown);
  //The surrender button
  let surrenderButton = createButton("SURRENDER 25 CHIPS");
  surrenderButton.position(width / 2 + 85, height - 190);
  surrenderButton.size(150, 70);
  surrenderButton.mousePressed(surrender);

  //The "grey out" buttons
  let noDoubleButton = createButton("NOT AVAILABE");
  let noSurrenderButton = createButton("NOT AVAILABE");

  if (hasPlayerMoved > 2) {
    //Greys out surrender if the player has moved
    noSurrenderButton.position(width / 2 + 85, height - 190);
    noSurrenderButton.size(150, 70);
    //Greys out double down if the player has moved
    noDoubleButton.position(width / 2 - 235, height - 110);
    noDoubleButton.size(150, 70);
  }
}
