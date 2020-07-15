import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';

import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  signupView: boolean = false

  validations_form: FormGroup;
  validations_form_login: FormGroup;
  errorMessage: string = '';
  errorMessageLogin: string = '';
  successMessage: string = '';
  newEmail: string = '';

  validation_messages = {
    'displayName': [
      { type: 'required', message: 'Name is required.' }
    ],
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Enter a valid email.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 5 characters long.' }
    ]
  };

  constructor(
    public menuCtrl: MenuController,
    private activatedRoute: Router,
    private authService: FirebaseService,
    private formBuilder: FormBuilder,
    public loadingController: LoadingController
  ) {}

  ngOnInit() {  
    if (this.authService.isLoggedIn()) {
      this.goHome();
    }  
      this.validations_form = this.formBuilder.group({
        displayName: new FormControl('', Validators.compose([
          Validators.required
        ])),
        email: new FormControl('', Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        ])),
        password: new FormControl('', Validators.compose([
          Validators.minLength(5),
          Validators.required
        ])),
      });
  
      this.validations_form_login = this.formBuilder.group({
        email: new FormControl('', Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        ])),
        password: new FormControl('', Validators.compose([
          Validators.minLength(5),
          Validators.required
        ])),
      });    
  }

  // Loading

  async presentLoading() {
    const loading = await this.loadingController.create({
      spinner: "lines",
      message: 'Conecting...',
      animated: true
    });
    await loading.present();
    /*
        const { role, data } = await loading.onDidDismiss();
        console.log('Loading dismissed!');  */
  }

  // Hide the loader if already created otherwise return error
  hideLoader() {
    this.loadingController.dismiss().then((res) => {
      console.log('Loading dismissed!', res);
    }).catch((error) => {
      console.log('error', error);
    });
  }

  // USER Register
  tryRegister(value) {
    this.presentLoading()
    this.authService.registerUser(value)
      .then(res => {
        this.hideLoader()
        console.log(res);
        this.errorMessage = "";
        this.errorMessageLogin = "";
        this.successMessage = "Your account has been created. Please log in.";
        this.newEmail= res.user.email;
        this.toggleSignUpView()
      }, err => {
        this.hideLoader()
        console.log(err);
        this.errorMessageLogin = "";
        this.errorMessage = err.message;
        this.successMessage = "";
      })
  }

  // USER Login
  loginUser(value) {
    this.presentLoading()
    this.authService.loginUser(value)
      .then(res => {
        this.hideLoader();
        console.log(res);
        this.errorMessage = "";
        this.errorMessageLogin = "";
        localStorage.setItem('user', JSON.stringify(res.user));
        console.log(localStorage.getItem('user'))
        this.goHome();
      }, err => {
        this.hideLoader();
        this.errorMessage = "";
        this.errorMessageLogin = err.message;
      })
  }

  toggleSignUpView() {
    this.signupView = !this.signupView
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);    
  }

  goHome() {
    this.menuCtrl.enable(true);
    this.activatedRoute.navigate(['/folder'])
  }

}
