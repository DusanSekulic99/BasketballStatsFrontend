import { Component, OnInit } from '@angular/core';
import {Store} from "@ngrx/store";
import {Team} from "../../models/team";
import {getSelectedTeam} from "../../store";
import {PlayerService} from "../../services/player/player.service";
import {Player} from "../../models/player";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BehaviorSubject, Observable} from "rxjs";
import {TokenDecoderService} from "../utils/token-decoder.service";

@Component({
  selector: 'app-view-team',
  templateUrl: './view-team.component.html',
  styleUrls: ['./view-team.component.scss']
})
export class ViewTeamComponent implements OnInit {

  private playersSubject = new BehaviorSubject<Player[]>([]);
  public players$: Observable<Player[]>;

  public selectedTeam: Team | undefined;
  public playersLeft: Player[];
  public playersRight: Player[];

  public newPlayerForm: FormGroup;

  constructor(private store: Store, private playerService: PlayerService, private formBuilder: FormBuilder,
              public tokenDecoder: TokenDecoderService) {
    this.newPlayerForm = this.setUpForm();
    this.players$ = this.playersSubject.asObservable();
    this.playersLeft = [];
    this.playersRight = [];
  }

  ngOnInit(): void {
    this.store.select(getSelectedTeam).subscribe((selectedTeam) => {
      this.selectedTeam = selectedTeam
    });
    this.playerService.getPlayersFromTeam(this.selectedTeam?.id).subscribe((players) =>
      this.playersSubject.next(players)
    )
  }

  setUpForm() {
    return this.formBuilder.group({
      firstName: ['', {
        validators: [
          Validators.required,
          Validators.maxLength(256)
        ]}],
      lastName: ['', {
        validators: [
          Validators.required,
          Validators.maxLength(256)
        ]}],
      jerseyNo: ['', {
        validators: [
          Validators.required,
          Validators.max(99),
          Validators.min(0),
        ]
      }],
      position: ['', {
        validators: [
          Validators.required,
          Validators.maxLength(256)
        ]
      }],
      starter: [false]
    })
  }

  createPlayer() {
    this.playerService.createPlayer({
      firstName: this.newPlayerForm.get('firstName')?.value,
      lastName: this.newPlayerForm.get('lastName')?.value,
      jerseyNo: this.newPlayerForm.get('jerseyNo')?.value,
      position: this.newPlayerForm.get('position')?.value,
      starter: this.newPlayerForm.get('starter')?.value,
      playing: this.newPlayerForm.get('starter')?.value,
      points: "0",
      assists: "0",
      rebounds: "0",
      fouls: "0",
    }, this.selectedTeam?.id).subscribe((player) => {
      this.newPlayerForm = this.setUpForm();

      const currentData = this.playersSubject.getValue();
      const updatedData = [...currentData, player];
      this.playersSubject.next(updatedData);
    })
  }

  removePlayer(playerId: string) {
    this.playerService.removePlayer(playerId).subscribe((players) => {
      this.playersSubject.next(players);
    })
  }

  getAllSubs() {
    return this.playersSubject.getValue().filter((player) => !player.starter);
  }

  substitutePlayer({playerId, newPlayerId} : any) {
    return this.playerService.substitutePlayer(playerId, newPlayerId).subscribe((players) => {
      this.playersSubject.next(players)
    })
  }
}
