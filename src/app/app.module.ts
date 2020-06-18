import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { HelpComponent } from './help/help.component';
import { ConfigComponent } from './config/config.component';
import { DebugComponent } from './debug/debug.component';
import { GameService } from './game.service';
import { IntroComponent } from './intro/intro.component';
import { ExitDialogComponent } from './exit-dialog/exit-dialog.component';
import { JeuComponent } from './jeu/jeu.component';
import { ScoreComponent } from './score/score.component';
import { MenuTemplateComponent } from './menu-template/menu-template.component';


@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    HelpComponent,
    ConfigComponent,
    DebugComponent,
    IntroComponent,
    ExitDialogComponent,
    JeuComponent,
    ScoreComponent,
    MenuTemplateComponent
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [GameService],
  bootstrap: [AppComponent],

})
export class AppModule { }
