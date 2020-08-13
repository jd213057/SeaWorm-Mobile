import { Component, OnInit } from '@angular/core';
import { GameService } from './game.service';
import { GameState } from './classes/GameState';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  showIntro: boolean;
  showGame = false;

constructor(protected gameService: GameService) {}

ngOnInit(): void {
this.initGame();
}

initGame(): void {
  document.addEventListener('deviceready', () => {
    document.addEventListener('pause', () => {
       this.gameService.setGameState(GameState.Pause);
    });
    document.addEventListener('resume', () => {
      this.gameService.setGameState(GameState.Play);
   });
  });
  setTimeout(() => {
this.showIntro = true;
  }, 5001);
}

displayApps() {
this.showIntro = false;
this.showGame = true;
}

}

