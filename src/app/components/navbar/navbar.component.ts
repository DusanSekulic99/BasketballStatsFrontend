import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {TokenDecoderService} from "../utils/token-decoder.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(private router: Router, public tokenDecoder: TokenDecoderService) { }

  ngOnInit(): void {
  }

  public push(path: String) {
    this.router.navigate([path]);
  }

  logout() {
    localStorage.removeItem("jwt");
    this.push("login");
  }
}
