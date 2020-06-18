import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Worm, Direction } from '../classes/Worm';
import { Food, TYPE } from '../classes/Food';
import { Case, State } from '../classes/Case';
import { GameService } from '../game.service';
import { Poison } from '../classes/Poison';


@Component({
  selector: 'app-jeu',
  templateUrl: './jeu.component.html',
  styleUrls: ['./jeu.component.css']
})
export class JeuComponent implements OnInit {
  @Output() displayParty = new EventEmitter();
  grid: Case[] = [];
  seaWorm: Worm;
  food: Food;
  poison1: Poison;
  poison2: Poison;
  poison3: Poison;
  score: number;
  compteur = '3';
  onGame = false;
  endGame = false;
  isBitten = false;
  controlPressed = false;
  displayRate;
  foodTimer;
  wormSpeed = this.gameService.getLevel();
  eatSound = new Audio('.\\assets\\sounds\\eat.mp3');
  clickExitSound = new Audio('.\\assets\\sounds\\Button_Press_4-Marianne_Gagnon-570460555.mp3');
  buttonClass = 'no-focus';


  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.countdownTimer();
    const launcher = setTimeout(() => {
      this.initGame();
    }, 4000);
  }

  ngOnDestroy(): void {
  clearInterval(this.displayRate);
  clearTimeout();
  }

  countdownTimer(): void {
    let count = 3;
    const startSound = new Audio('.\\assets\\sounds\\start-sound.mp3');
    startSound.volume = 0.6;
    if (this.gameService.getAudio()) {
      startSound.play();
    }
    const timer = setInterval(() => {
  count--;
  this.compteur = count.toString();
  if (count <= 0) {
    this.compteur = 'Go';
    setTimeout(() => {
  clearInterval(timer);
  this.onGame = true;
}, 1000);
  }
}, 1000);
  }

  initGame(): void {
    this.buildGrid();
    this.setControls();
    this.placeWorm();
    this.placeFood();
    this.placePoisonsOnStart();
    this.displayGame();
  }

  getCount(): string {
    this.compteur = this.compteur;
    return this.compteur;
  }

  cursorIn() {
    this.buttonClass = 'cursor-in';
  }

  cursorOut() {
    this.buttonClass = 'no-focus';
  }

  getCaseClass(): string {
    return '';
  }

  setControls(): void {
    const grid = document.getElementsByClassName('grid');
    document.addEventListener('keydown', (event) => {
      if (this.controlPressed != true) {
        switch (event.key) {
          case 'ArrowDown':
            if (this.seaWorm.getDirection() != Direction.haut) {
              this.seaWorm.setDirection(Direction.bas);
              this.controlPressed = true;
            }
            break;
          case 'ArrowUp':
            if (this.seaWorm.getDirection() != Direction.bas) {
              this.seaWorm.setDirection(Direction.haut);
              this.controlPressed = true;
            }
            break;
          case 'ArrowLeft':
            if (this.seaWorm.getDirection() != Direction.droite) {
              this.seaWorm.setDirection(Direction.gauche);
              this.controlPressed = true;
            }
            break;
          case 'ArrowRight':
            if (this.seaWorm.getDirection() != Direction.gauche) {
              this.seaWorm.setDirection(Direction.droite);
              this.controlPressed = true;
            }
            break;
        }
      }
  });
}

  buildGrid(): void {
    const caseId = 0;
    for (let y = 0; y <= 9; y++) {
for (let x = 0; x <= 9; x++) {
  const caseToAdd = new Case(State.clear, x, y);
  this.grid.push(caseToAdd);
}
}
  }

  placeWorm(): void {
    const cases = [];
    const pixel = new Case(State.worm, 4, 5);
    cases.push(pixel);
    this.seaWorm = new Worm(cases);
    this.seaWorm.setDirection(Direction.droite);
  }

  placeFood(): void {
    let restart = false;
    let positionX: number;
    let positionY: number;
    do {
      positionX = Math.round(Math.random() * 9);
      positionY = Math.round(Math.random() * 9);
      const idToCheck = positionY.toString() + '-' + positionX.toString();
      for (const pixel of this.seaWorm.getCases()) {
        if (pixel.getId() == idToCheck) {
          restart = true;
        }
      }
    } while (restart == true);
    const foodPixel = new Case(State.food, positionX, positionY);
    this.food = new Food(foodPixel);
    const foodCount = this.food.getCount();
    this.food.setCount(foodCount);
  }

  placeAgainFood(): void {
    let restart = false;
    let positionX: number;
    let positionY: number;
    do {
    restart = false;
    positionX = Math.round(Math.random() * 9);
    positionY = Math.round(Math.random() * 9);
    const idToCheck = positionY.toString() + '-' + positionX.toString();
    for (const pixel of this.seaWorm.getCases()) {
        if (pixel.getId() == idToCheck) {
          restart = true;
        }
    }} while (restart == true);
    this.food.getCase().setPositionX(positionX);
    this.food.getCase().setPositionY(positionY);
  }

  getPoisonPosition(): Case {
    let restart = false;
    let positionX: number;
    let positionY: number;
    do {
    restart = false;
    positionX = Math.round(Math.random() * 9);
    positionY = Math.round(Math.random() * 9);
    const idToCheck = positionY.toString() + '-' + positionX.toString();
    for (const pixel of this.seaWorm.getCases()) {
        if (pixel.getId() == idToCheck) {
          restart = true;
        }
        if (idToCheck == this.food.getCase().getId()) {
          restart = true;
        }
        if (idToCheck == this.poison1.getCase().getId() ||
         idToCheck == this.poison2.getCase().getId() ||
          idToCheck == this.poison3.getCase().getId() ) {
          restart = true;
        }
    }} while (restart == true);
    return new Case(State.poison, positionX, positionY);
  }

  displayGame(): void {
      this.displayRate = setInterval((run) => {
          this.runGameCycle();
     }, this.wormSpeed);
  }

  runGameCycle(): void {
    this.isBitten = this.checkBites();
    if (this.isBitten == false) {
   this.moveWorm(this.seaWorm);
   if (this.food.getCase().getId() == this.seaWorm.getCases()[0].getId()) {
  this.playEatSound();
  this.getFoodEffect(this.food.getType());
  this.placeAgainFood();
  this.setFoodType();
  this.getScore();
  this.increaseWormSpeed();
}
   if (this.food.getType() == TYPE.orange) {
  this.growWorm();
}
   this.showPixels(this.seaWorm);
  } else {
    this.storeScore();
    this.looseGame();
  }
  }

  playEatSound(): void {
    this.eatSound.currentTime = 0;
    if (this.gameService.getAudio()) {
      this.eatSound.play();
    }
  }

  getFoodEffect(foodtype: TYPE): void {
    switch (foodtype) {
case TYPE.yellowgreen:
this.growWorm();
if (!this.gameService.getCode1()) {
  this.food.setCount(this.food.getCount() + 1);
}
break;
case TYPE.red:
  this.shrinkWorm();
  if (!this.gameService.getCode1()) {
    this.food.setCount(this.food.getCount() + 2);
  }
  break;
  case TYPE.green:
  this.extraShrinkWorm();
  if (!this.gameService.getCode1()) {
    this.food.setCount(this.food.getCount() + 100);
  }
  break;
  case TYPE.orange:
    this.food.setType(TYPE.yellowgreen);
    this.food.setCount(this.food.getCount() + 1);
    break;
  case TYPE.purple:
    this.mediumShrinkWorm();
    this.food.setCount(this.food.getCount() + 3);
    this.removePoisons();
    this.food.setType(TYPE.yellowgreen);
    break;
    case TYPE.darkblue:
      if (this.foodTimer != null || this.foodTimer != undefined) {
        clearTimeout(this.foodTimer);
      }
      this.mediumShrinkWorm();
      this.food.setCount(this.food.getCount() + 3);
      break;
    }
  }

  setFoodType(): void {
const moduloValue = this.food.getCount() % 101;
switch (moduloValue) {
  case 7:
  case 15:
  case 23:
  case 27:
  case 43:
  case 53:
  case 59:
  case 73:
  case 77:
    this.food.setType(TYPE.red);
    break;
  case 11:
  case 31:
  case 71:
  case 97:
    this.food.setType(TYPE.orange);
    break;
  case 13:
  case 37:
  case 47:
  case 67:
  case 83:
    this.food.setType(TYPE.darkblue);
    this.launchFoodTimer();
    break;
  case 19:
  case 41:
  case 49:
  case 63:
  case 89:
    this.food.setType(TYPE.purple);
    this.multiplyFood();
    break;
  case 0:
    this.food.setType(TYPE.green);
    break;
}
  }

  checkBites(): boolean {
    if (this.seaWorm.getCases().length >= 2) {
      const head = this.seaWorm.getCases()[0];
      const restOfBody = this.seaWorm.getCases().slice(1);
      for (const pixel of restOfBody) {
        if (pixel.getPositionX() == head.getPositionX() && pixel.getPositionY() == head.getPositionY()) {
          return true;
        }
      }
      if (head.getId() == this.poison1.getCase().getId() && this.poison1.getToShow() ||
       head.getId() == this.poison2.getCase().getId() && this.poison2.getToShow() ||
        head.getId() == this.poison3.getCase().getId() && this.poison3.getToShow()) {
return true;
        }
    }
    return false;
  }

  getScore(): number {
  return this.food.getCount();
  }

  placePoisonsOnStart(): void {
    for (let i = 0; i <= 2; i++) {
      const poisonPosition = new Case(State.poison, 0, 0);
      switch (i) {
        case 0:
          this.poison1 = new Poison(poisonPosition);
          this.poison1.setToShow(false);
          break;
        case 1:
          this.poison2 = new Poison(poisonPosition);
          this.poison2.setToShow(false);
          break;
        case 2:
          this.poison3 = new Poison(poisonPosition);
          this.poison3.setToShow(false);
          break;
      }
    }
  }

  multiplyFood(): void {
    for (let i = 0; i <= 2; i++) {
      const poisonPosition = this.getPoisonPosition();
      switch (i) {
        case 0:
          this.poison1.setCase(poisonPosition) ;
          this.poison1.setToShow(true);
          break;
        case 1:
          this.poison2.setCase(poisonPosition);
          this.poison2.setToShow(true);
          break;
        case 2:
          this.poison3.setCase(poisonPosition);
          this.poison3.setToShow(true);
          break;
      }
    }
  }

  removePoisons(): void {
    this.poison1.removePoison();
    this.poison2.removePoison();
    this.poison3.removePoison();
  }

  launchFoodTimer(): void {
    const initialFoodCount = this.food.getCount();
    this.foodTimer = setTimeout(() => {
  this.food.setType(TYPE.yellowgreen);
  clearTimeout(this.foodTimer);
}, 3000);
  }

  extraShrinkWorm(): void {
    const wormShrinked =
    this.seaWorm.getCases().slice(0 , 1);
    this.seaWorm.setCases(wormShrinked);
    this.food.setType(TYPE.yellowgreen);
  }

  mediumShrinkWorm(): void {
    if (this.seaWorm.getCases().length > 6) {
      const wormShrinked =
      this.seaWorm.getCases().slice(0 , this.seaWorm.getCases().length - 3);
      this.seaWorm.setCases(wormShrinked);
    }
    this.food.setType(TYPE.yellowgreen);
  }

  shrinkWorm(): void {
    if (this.seaWorm.getCases().length > 4) {
      const wormShrinked =
      this.seaWorm.getCases().slice(0 , this.seaWorm.getCases().length - 2);
      this.seaWorm.setCases(wormShrinked);
    }
    this.food.setType(TYPE.yellowgreen);
  }

  growWorm(): void {
    const bigWorm = this.seaWorm.getCases();
    let pixelToAdd;
    const lastPixelWorm = this.seaWorm.getCases()[this.seaWorm.getCases().length - 1];
    if (this.seaWorm.getCases().length > 1) {
      const beforeLastPixelWorm = this.seaWorm.getCases()[this.seaWorm.getCases().length - 2];
      pixelToAdd = new Case(State.worm,
     lastPixelWorm.getPositionX() - (beforeLastPixelWorm.getPositionX() - lastPixelWorm.getPositionX()),
      lastPixelWorm.getPositionY() - (beforeLastPixelWorm.getPositionY() - lastPixelWorm.getPositionY()));
    } else if (this.seaWorm.getCases().length == 1) {
      let positionX: number;
      let positionY: number;
      switch (this.seaWorm.getDirection()) {
        case Direction.gauche:
positionX = this.seaWorm.getCases()[0].getPositionX() + 1;
positionY = this.seaWorm.getCases()[0].getPositionY();
break;
case Direction.droite:
  positionX = this.seaWorm.getCases()[0].getPositionX() - 1;
  positionY = this.seaWorm.getCases()[0].getPositionY();
  break;
case Direction.haut:
  positionY = this.seaWorm.getCases()[0].getPositionY() + 1;
  positionX = this.seaWorm.getCases()[0].getPositionX();
  break;
case Direction.bas:
  positionY = this.seaWorm.getCases()[0].getPositionY() - 1;
  positionX = this.seaWorm.getCases()[0].getPositionX();
  break;
      }
      pixelToAdd = new Case(State.worm, positionX, positionY);
    }
    bigWorm.push(pixelToAdd);
    this.seaWorm.setCases(bigWorm);
    if (this.gameService.getCode1()) {
      this.extraGrowWorm();
    }
  }

  extraGrowWorm(): void {
    const bigWorm = this.seaWorm.getCases();
    const lastPixel = bigWorm[bigWorm.length - 1];
    const beforeLastPixelWorm = this.seaWorm.getCases()[this.seaWorm.getCases().length - 2];
    const  pixelToAdd = new Case(State.worm,
      lastPixel.getPositionX() - (beforeLastPixelWorm.getPositionX() - lastPixel.getPositionX()),
      lastPixel.getPositionY() - (beforeLastPixelWorm.getPositionY() - lastPixel.getPositionY()));
    bigWorm.push(pixelToAdd);
    this.seaWorm.setCases(bigWorm);
  }

  showPixels(worm: Worm): void {
    let pixelToShow;
    for (const pixel of this.grid) {
    pixelToShow = document.getElementById(pixel.getId());
    pixelToShow.style.backgroundColor = 'dodgerblue';
    if (this.poison1 != undefined && this.poison2 != undefined && this.poison3 != undefined &&
        (pixel.getId() == this.poison1.getCase().getId() && this.poison1.getToShow()) ||
     (pixel.getId() == this.poison2.getCase().getId() && this.poison2.getToShow())  ||
     (pixel.getId() == this.poison3.getCase().getId() && this.poison3.getToShow()) ) {
      pixelToShow.style.backgroundColor = 'purple';
     }
    if (pixel.getId() == this.food.getCase().getId()) {
      switch (this.food.getType()) {
        case TYPE.yellowgreen:
          pixelToShow.style.backgroundColor = 'yellowgreen';
          break;
        case TYPE.red:
          pixelToShow.style.backgroundColor = 'red';
          break;
        case TYPE.green:
          pixelToShow.style.backgroundColor = 'green';
          break;
          case TYPE.orange:
          pixelToShow.style.backgroundColor = 'orangered';
          break;
          case TYPE.purple:
          pixelToShow.style.backgroundColor = 'rebeccapurple';
          break;
          case TYPE.darkblue:
          pixelToShow.style.backgroundColor = 'darkblue';
          break;
      }
    }
  }
    for (const wormPixel of this.seaWorm.getCases()) {
      pixelToShow = document.getElementById(wormPixel.getId());
      if (!this.gameService.getCode2()) {
        pixelToShow.style.backgroundColor = 'darkblue';
      } else if (this.gameService.getCode2()) {
        const colorRandom = Math.floor(Math.random() * 5);
        switch (colorRandom) {
case 0:
  pixelToShow.style.backgroundColor = 'red';
  break;
case 1:
  pixelToShow.style.backgroundColor = 'orange';
  break;
case 2:
  pixelToShow.style.backgroundColor = 'yellow';
  break;
case 3:
  pixelToShow.style.backgroundColor = 'green';
  break;
case 4:
  pixelToShow.style.backgroundColor = 'darkblue';
  break;
case 5:
  pixelToShow.style.backgroundColor = 'purple';
  break;
        }
      }
}
  }

  moveWorm(worm: Worm): void {
    const wormCases = worm.getCases();
    const newWormCases: Case[] = [];
    let pixelToMove;
    let positionX;
    let positionY;
    for (let i = 0; i <= wormCases.length - 1; i++) {
      let newWormCase;
      if (i == 0) {
        newWormCase = wormCases[i];
        switch (this.seaWorm.getDirection()) {
    case Direction.gauche:
      positionX = newWormCase.getPositionX() - 1;
      if (positionX <= -1) {
        positionX = 9;
      }
      pixelToMove = new Case (State.worm, positionX, newWormCase.getPositionY());
      break;
    case Direction.droite:
      positionX = newWormCase.getPositionX() + 1;
      if (positionX >= 10) {
        positionX = 0;
      }
      pixelToMove = new Case (State.worm, positionX, newWormCase.getPositionY());
      break;
    case Direction.haut:
      positionY = newWormCase.getPositionY() - 1;
      if (positionY <= -1) {
        positionY = 9;
      }
      pixelToMove = new Case (State.worm, newWormCase.getPositionX(), positionY);
      break;
    case Direction.bas:
      positionY = newWormCase.getPositionY() + 1;
      if (positionY >= 10) {
        positionY = 0;
      }
      pixelToMove = new Case (State.worm, newWormCase.getPositionX(), positionY);
      break;
  }
        this.controlPressed = false;
}
      if (i != 0) {
    newWormCase = wormCases[i - 1];
    pixelToMove = new Case (State.worm, newWormCase.getPositionX(), newWormCase.getPositionY());
}
      newWormCases.push(pixelToMove);
}
    this.seaWorm.setCases(newWormCases);
  }

  increaseWormSpeed(): void {
    this.wormSpeed = this.wormSpeed - 0.05 * this.wormSpeed;
  }

  storeScore(): void {
    this.gameService.saveRecord(this.food.getCount(), this.gameService.getCode1(), this.gameService.getCode2());
  }

  endPanelClass(): string {
   return this.endGame ? 'end-panel' : '';
  }

  getEndGameClass(): string {
    return this.endGame ? 'score-endGame' : '';
  }

  looseGame(): void {
    const gameOverSound = new Audio ('.\\assets\\sounds\\gameover.mp3');
    if (this.gameService.getAudio()) {
      gameOverSound.play();
    }
    this.onGame = false;
    this.endGame = true;
    clearInterval(this.displayRate);
    setTimeout(() => {
      this.displayParty.emit();
    }, 10000);
  }

  exitGame(): void {
    this.clickExitSound.volume = 0.7;
    if (this.gameService.getAudio()) {
      this.clickExitSound.play();
    }
    this.storeScore();
    clearInterval(this.displayRate);
    this.displayParty.emit();
  }

}
