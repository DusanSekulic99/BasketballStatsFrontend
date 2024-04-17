import { Component, OnInit } from '@angular/core';
import {LoginService} from "../../services/login.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup;


  constructor(private loginService: LoginService, private formBuilder: FormBuilder, private router: Router) {
    this.loginForm = this.setUpForm();

  }

  ngOnInit(): void {
  }

  setUpForm() {
    return this.formBuilder.group({
      username: ['', {
        validators: [
          Validators.required,
          Validators.maxLength(256)
        ]}],
      password: ['', {
        validators: [
          Validators.required,
          Validators.maxLength(256)
        ]}]
    })
  }

  login() {
    this.loginService.login(
      this.loginForm.get('username')?.value,
      this.loginForm.get('password')?.value
    ).subscribe((response) => {
      if (response.ok) {
        localStorage.setItem("jwt", response.body.jwt.substring(7))
        this.router.navigate([''])
      } else {
        this.loginForm = this.setUpForm();
      }
    })
  }


  redirect() {
    this.router.navigate([''])
  }
}
