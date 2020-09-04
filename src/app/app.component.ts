import { Component, OnInit } from '@angular/core';
import { GameService } from './game.service';

/// <reference types="cordova-plugin-background-mode" />

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
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
        document.addEventListener('pause', () => {
            this.gameService.setAudio('audioOff');
        });
        document.addEventListener('resume', () => {
            this.gameService.setAudio('audioOn');
        });
    }

    displayApps() {
        this.showIntro = false;
        this.showGame = true;
    }
}
