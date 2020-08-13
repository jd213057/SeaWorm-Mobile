import { Component, OnInit } from '@angular/core';
import { GameService } from './game.service';

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
  setTimeout(() => {
this.showIntro = true;
  }, 5001);
}

displayApps() {
this.showIntro = false;
this.showGame = true;
}

}

