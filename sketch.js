let drawnCard = 0;
let playerScore = 0;
let dealerScore = 0;
let playerHighAces = 0;
let dealerHighAces = 0;
let isStanding = false;
let dealerWin = false;
let playerWin = false;
let isPush = false;
let isBlackjack = false;
let hasPlayerMoved = 0;
let chipScore = 1000;
let oldScore = 1000;
let betAmount = 50;

function setup() {
  createCanvas(windowWidth, windowHeight);

  gameStart();
}

function draw() {
  background(200);

  let hitButton = createButton("HIT");
  let standButton = createButton("STAND");
  let restartButton = createButton("RESTART 50 CHIPS");
  let doubleButton = createButton("DOUBLE DOWN");
  let surrenderButton = createButton("SURRENDER 25 CHIPS");
  let noSurrenderButton = createButton("NOT AVAILABE");

  displayText();

  hitButton.position(10, height / 2);
  hitButton.size(150);
  hitButton.mousePressed(playerHit);

  standButton.position(width - 160, height / 2);
  standButton.size(150);
  standButton.mousePressed(playerStand);

  restartButton.position(width / 2 - 75, 100);
  restartButton.size(150);
  restartButton.mousePressed(gameStart);

  doubleButton.position(10, height / 2 + 25);
  doubleButton.size(150);
  doubleButton.mousePressed(doubleDown);

  surrenderButton.position(width / 2 - 170 / 2, 125);
  surrenderButton.size(170);
  surrenderButton.mousePressed(surrender);

  noSurrenderButton.position(width / 2 - 170 / 2, -125);

  if (hasPlayerMoved > 2) {
    noSurrenderButton.position(width / 2 - 170 / 2, 125);
    noSurrenderButton.size(170);
  }

  playerBustDetector();

  whoWon();
}

function playerStand() {
  if (!isStanding) {
    dealerTurn();
    isStanding = true;
    hasPlayerMoved++;
  }
}

function playerHit() {
  if (!isStanding) {
    drawnCard = int(random(1, 14));

    if (drawnCard == 11 || drawnCard == 12 || drawnCard == 13) {
      playerScore += 10;
    } else if (drawnCard == 1) {
      playerScore += 11;
      playerHighAces++;
    } else {
      playerScore += drawnCard;
    }

    hasPlayerMoved++;
  }
}

function dealerHit() {
  drawnCard = int(random(1, 14));

  if (drawnCard == 11 || drawnCard == 12 || drawnCard == 13) {
    dealerScore += 10;
  } else if (drawnCard == 1) {
    dealerScore += 11;
    dealerHighAces++;
  } else {
    dealerScore += drawnCard;
  }
}

function dealerTurn() {
  while (dealerScore <= 17) {
    dealerHit();

    if (dealerScore > 21) {
      if (dealerHighAces > 1) {
        dealerScore -= 10;
        dealerHighAces--;
      } else {
        playerWin = true;
      }
    }
  }
}

function whoWon() {
  if (playerScore > dealerScore && isStanding == true && dealerWin == false) {
    playerWin = true;
  } else if (
    playerScore < dealerScore &&
    isStanding == true &&
    playerWin == false
  ) {
    dealerWin = true;
  } else if (playerScore == dealerScore && isStanding == true) {
    isPush = true;
  }
}

function displayText() {
  textSize(24);
  text(
    "Chips: " +
      chipScore +
      "\nPlayer: " +
      playerScore +
      ", Nr. of Aces: " +
      playerHighAces +
      "\nDealer: " +
      dealerScore +
      ", Nr. of Aces: " +
      dealerHighAces,
    width / 2 - 125,
    25
  );

  if (chipScore < betAmount) {
    text("Sorry, not enough chips", width / 2 - 125, 150);
  }

  textSize(40);
  if (isPush) {
    text("Push", width / 2, height / 2);
    chipScore = oldScore + betAmount;
  } else if (isBlackjack) {
    text("Blackjack", width / 2, height / 2);
    chipScore = oldScore + betAmount * 2 * (3 / 2);
  } else if (dealerWin) {
    text("Dealer Wins", width / 2, height / 2);
  } else if (playerWin) {
    text("Player Wins", width / 2, height / 2);
    chipScore = oldScore + betAmount * 2;
  }
}

function playerBustDetector() {
  if (playerScore > 21) {
    if (playerHighAces > 1) {
      playerScore -= 10;
      playerHighAces--;
    } else {
      dealerWin = true;
      isStanding = true;
    }
  }
}

function blackjackDetector() {
  if (playerScore == 21) {
    dealerHit();

    if (dealerScore == 21) {
      isPush = true;
      isStanding = true;
    } else {
      isBlackjack = true;
      isStanding = true;
    }
  }
}

function gameStart() {
  betAmount = 50;

  oldScore = chipScore;
  if (chipScore >= betAmount) {
    drawnCard = 0;
    playerScore = 0;
    dealerScore = 0;
    playerHighAces = 0;
    dealerHighAces = 0;
    isStanding = false;
    dealerWin = false;
    playerWin = false;
    isPush = false;
    isBlackjack = false;
    hasPlayerMoved = 0;
    chipScore = oldScore - betAmount;
    oldScore = chipScore;

    playerHit();
    playerHit();

    dealerHit();

    blackjackDetector();
  }
}

function doubleDown() {
  if (chipScore >= betAmount && isStanding == false) {
    chipScore -= 50;
    betAmount = 100;
    playerHit();
    playerStand();
  }
}

function surrender() {
  if (hasPlayerMoved <= 2) {
    chipScore += betAmount / 2;
    gameStart();
  }
}