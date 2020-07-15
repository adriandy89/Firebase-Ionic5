import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

import { FirebaseService } from '../services/firebase.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

interface StudentData {
  Name: string;
  Age: number;
  Address: string;
}

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder: string;

  studentList = [];
  studentData: StudentData;

  studentForm: FormGroup;

  constructor(
    public menuCtrl: MenuController,
    private activatedRoute: ActivatedRoute,
    private route: Router,
    private firebaseService: FirebaseService,
    public fb: FormBuilder
    ) {
      this.studentData = {} as StudentData;
     }

  ngOnInit() {
    this.menuCtrl.enable(true)
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');

    this.studentForm = this.fb.group({
      Name: ['', [Validators.required]],
      Age: ['', [Validators.required]],
      Address: ['', [Validators.required]]
    })    

    this.firebaseService.read_students().subscribe(data => {

      this.studentList = data.map(e => {
        return {
          id: e.payload.doc.id,
          isEdit: false,
          Name: e.payload.doc.data()['Name'],
          Age: e.payload.doc.data()['Age'],
          Address: e.payload.doc.data()['Address'],
        };
      })
      console.log(this.studentList);

    });
  }

  logout(){
    this.firebaseService.logoutUser().then( res => this.route.navigate(['/']))
  }

  CreateRecord() {
    console.log(this.studentForm.value);
    this.firebaseService.create_student(this.studentForm.value).then(resp => {
      this.studentForm.reset();
    })
      .catch(error => {
        console.log(error);
      });
  }

  RemoveRecord(rowID) {
    this.firebaseService.delete_student(rowID);
  }

  EditRecord(record) {
    record.isEdit = true;
    record.EditName = record.Name;
    record.EditAge = record.Age;
    record.EditAddress = record.Address;
  }

  UpdateRecord(recordRow) {
    let record = {};
    record['Name'] = recordRow.EditName;
    record['Age'] = recordRow.EditAge;
    record['Address'] = recordRow.EditAddress;
    this.firebaseService.update_student(recordRow.id, record);
    recordRow.isEdit = false;
  }

  doRefresh(event) {
    console.log('Begin async operation');

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

}
