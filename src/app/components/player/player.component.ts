import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Player} from "../../models/player";
import {Router} from "@angular/router";
import {TokenDecoderService} from "../utils/token-decoder.service";

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  @Input() playerId: String | undefined;
  @Input() firstName: String | undefined;
  @Input() lastName: String | undefined;
  @Input() jerseyNo: String | undefined;
  @Input() position: String | undefined;
  @Input() starter: boolean | undefined;
  @Input() playing: boolean | undefined;
  @Input() left: boolean = false;

  @Input() players: Player[] | undefined;

  @Input() points: String | undefined;
  @Input() assists: String | undefined;
  @Input() rebounds: String | undefined;
  @Input() fouls: String | undefined;

  clicked: boolean = false;

  @Output() removePlayer: EventEmitter<any> = new EventEmitter();
  @Output() substitutePlayer: EventEmitter<any> = new EventEmitter();
  @Output() addPoints: EventEmitter<any> = new EventEmitter();
  @Output() addAssist: EventEmitter<any> = new EventEmitter();
  @Output() addRebound: EventEmitter<any> = new EventEmitter();
  @Output() addFoul: EventEmitter<any> = new EventEmitter();
  constructor(private router: Router, public tokenDecoder: TokenDecoderService) { }

  ngOnInit(): void {
  }

  emitRemovePlayer() {
    this.removePlayer.emit(this.playerId);
  }

  emitAddPoints(points: number) {
    this.addPoints.emit({points, playerId: this.playerId});
  }

  emitAddAssist() {
    this.addAssist.emit({playerId: this.playerId});
  }

  emitAddRebound() {
    this.addRebound.emit({playerId: this.playerId});
  }

  emitAddFoul() {
    this.addFoul.emit({playerId: this.playerId});
  }

  setClicked(ignore: boolean) {
    if (ignore) return;
    this.clicked = !this.clicked;
  }

  emitSubstitutePlayer(id: string | undefined) {
    this.substitutePlayer.emit({playerId: this.playerId, newPlayerId: id, isHomeTeam: this.left});
  }

  isMatchRoute() {
    return this.router.url.startsWith('/match');
  }
}
