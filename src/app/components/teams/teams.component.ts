import { Component, OnInit } from '@angular/core';
import {TeamsService} from "../../services/teams/teams.service";
import {Team} from "../../models/team";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {setTeam, TeamType} from "../../store/teams/state/teams.actions";
import {BehaviorSubject, map, Observable, of, tap} from "rxjs";
import {TokenDecoderService} from "../utils/token-decoder.service";

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})
export class TeamsComponent implements OnInit {

  private teamsSubject = new BehaviorSubject<Team[]>([]);
  public teams$: Observable<Team[]>;

  public newTeamForm: FormGroup;

  constructor(private teamService: TeamsService, private formBuilder: FormBuilder,
              private router: Router, private store: Store, public tokenDecoder: TokenDecoderService) {
    this.newTeamForm = this.setUpForm();
    this.teams$ = this.teamsSubject.asObservable();
  }

  ngOnInit(): void {
    this.teamService.getTeams().subscribe(
      (teams => this.teamsSubject.next(teams))
    )
  }

  createTeam() {
    this.teamService.createTeam(this.newTeamForm.get('teamName')?.value, this.newTeamForm.get('teamBadge')?.value)
      .subscribe(team => {
          this.newTeamForm = this.setUpForm()
          const currentData = this.teamsSubject.getValue();
          const updatedData = [...currentData, team];
          this.teamsSubject.next(updatedData);
      })
  }

  setUpForm() {
    return this.formBuilder.group({
      teamName: ['', {
        validators: [
          Validators.required,
          Validators.maxLength(256)
        ]}],
      teamBadge: ['', {
        validators: [
          Validators.required,
          Validators.maxLength(256)
        ]}]
    })
  }


  public removeTeam(team: Team) {
    this.teamService.removeTeam(team.id).subscribe((() => {
      const currentData = this.teamsSubject.getValue();
      const updatedData = currentData.filter(item => item !== team);
      this.teamsSubject.next(updatedData);
    }));
  }

  public showTeam(team: Team) {
    this.store.dispatch(setTeam({ team, teamType: TeamType.SELECTED }))
    this.router.navigate([`team/${team.id}`])
  }

}
