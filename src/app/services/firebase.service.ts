import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from  'firebase';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  collectionName = 'Students';
  user: User;

  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth
  ) { 
    this.afAuth.authState.subscribe(user => {
      if (user){
        this.user = user;
        localStorage.setItem('user', JSON.stringify(this.user));        
      } else {
        localStorage.setItem('user', null);
      }
    })
  }

  isLoggedIn(): boolean {
    const  user  =  JSON.parse(localStorage.getItem('user'));
    return  user  !==  null;
  }

  getUser() {
    const  user  =  JSON.parse(localStorage.getItem('user'));
    return  user;
  }

  // Auth - Firebase
  
  registerUser(value) {
    return new Promise<any>((resolve, reject) => {

      this.afAuth.createUserWithEmailAndPassword(value.email, value.password)
        .then(
          res => resolve(res),
          err => reject(err))
    })
  }

  // Email verification when new user register  --- not using
  SendVerificationMail(correo) {
    const actionCodeSettings = {
      url: `http://localhost:8100/welcome`,
      handleCodeInApp: true
    };
    return this.afAuth.sendSignInLinkToEmail(correo, actionCodeSettings)
    .then(() => {
      console.log('Email link was sending')
    })
  }

  loginUser(value) {
    console.log(this.user)
    return new Promise<any>((resolve, reject) => {
      this.afAuth.signInWithEmailAndPassword(value.email, value.password)
        .then(
          res => resolve(res),
          err => reject(err))
    })
  }

  logoutUser() {
    return new Promise((resolve, reject) => {
      if (this.afAuth.currentUser) {
        this.afAuth.signOut()
          .then(() => {
            console.log("LOG Out");
            localStorage.removeItem('user');
            resolve();
          }).catch((error) => {
            reject();
          });
      }
    })
  }

  userDetails() {
    return this.afAuth.user
  }

  // Firebase CRUD Operations

  create_student(record) {
    return this.firestore.collection(this.collectionName).add(record);
  }

  read_students() {
    return this.firestore.collection(this.collectionName).snapshotChanges();
  }

  update_student(recordID, record) {
    this.firestore.doc(this.collectionName + '/' + recordID).update(record);
  }

  delete_student(record_id) {
    this.firestore.doc(this.collectionName + '/' + record_id).delete();
  }

}