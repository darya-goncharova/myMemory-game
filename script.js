const cards = document.querySelectorAll('.memory-card');

  let hasFlippedCard = false;
  let lockBoard = false;
  let firstCard, secondCard;
const modal = document.querySelector(".popup");
const playAgain = document.querySelector(".restart");
const movesCount = document.querySelector(".moves-counter");
let moves = 0;
let flipped = [];

const hiscores = JSON.parse(localStorage.getItem('moves')) || [];
const scoreList = document.querySelector('.scoretable');
const scoreButton = document.querySelector('.hiscore-button');
const hiscore = document.querySelector('.hiscore');
const resetScoreButton = document.querySelector('.reset_button');


function shuffle() {
  cards.forEach(card => {
    let ramdomPos = Math.floor(Math.random() * 20);
   card.style.order = ramdomPos;
   });
  }
  shuffle();

  
  function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flip');

    if (!hasFlippedCard) {
      hasFlippedCard = true;
      firstCard = this;
      return;
    }

    secondCard = this;
    lockBoard = true;

    checkForMatch();
  }

  cards.forEach(card => card.addEventListener('click', flipCard));


  function moveCounter() {    
    movesCount.innerHTML ++;
    moves ++;
  }
  

  function checkForMatch() {
    moveCounter();
    let isMatch = firstCard.dataset.card === secondCard.dataset.card;
    isMatch ? disableCards() : unflipCards();
  }

  function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
    flipped.push(firstCard,secondCard);
    congratulations();
  }


  function unflipCards() {
    setTimeout(() => {
      firstCard.classList.remove('flip');
      secondCard.classList.remove('flip');

      resetBoard();
    }, 1000);
  }

  function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
  }




// congratulations when all cards match, show modal and moves, time and rating
function congratulations(){
  if (flipped.length === 20){
    modal.classList.add("show");
  };
}

playAgain.addEventListener("click", closeModal); 
function closeModal() {
    modal.classList.remove("show");
    checkScore();
    resetEverything(); 
  }

  function resetEverything() {
  moves = 0;
  movesCount.innerHTML = 0;
  flipped = [];
   cards.forEach(card => {
    card.classList.remove('flip');
   });
   shuffle();
   cards.forEach(card => card.addEventListener('click', flipCard));
   moveCounter();
   }


//hiscore
scoreButton.addEventListener("click", populateTable); 
  function populateTable() {
    hiscore.classList.toggle("show");
    scoreList.innerHTML = hiscores.map((row) => {
      return `<tr><td>${row.clicker}</td><td>${row.moves}</tr>`;
    }).join('');
  }


  function checkScore() {
    let worstScore = 0;
    if (moves > worstScore) {
      const clicker = window.prompt(`${moves} – Невероятно!!! Как тебя зовут?`);
      hiscores.push({moves, clicker});
      hiscores.sort((a, b) => a.moves > b.moves ? -1 : 1);
      if (hiscores.length > 10) {
        hiscores.pop();
    }
    populateTable();
    localStorage.setItem('hiscores', JSON.stringify(hiscores));
  }}

  resetScoreButton.addEventListener("click", closeScore); 
  function closeScore() {
    hiscore.classList.remove("show");
  }
