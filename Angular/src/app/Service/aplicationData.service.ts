import { HttpClient } from "@angular/common/http";
import { DataStructure, MinimalDataStructure } from "../Interface/DataStructure";
import { Injectable } from '@angular/core';
import { User } from "../Interface/User";
import { UserService } from "./user.service";
import { Router } from "@angular/router";
@Injectable({
  providedIn: 'root'
})
export class ApplicationDataService {
    private localStorageKey = 'element_data';
    private loadDefaultData = true;
  
    constructor(private http: HttpClient, private userService: UserService, private router: Router) {
      if (this.loadDefaultData) {
        const ELEMENT_DATA: DataStructure[] = [
          {
              id: 1, name: 'Item 1', status: 'Active', creationTime: new Date('2022-01-01'), responsible: 'Test_User', type: 'first-type',
              JsonData: { id: 1, name: 'Item 1', status: 'Active', creationTime: new Date('2022-01-01'), responsible: 'Test_User', type: 'first-type',Owner: "Test_User" },
              Owner: "Test_User"
          },
          {
              id: 2, name: 'Item 2', status: 'Inactive', creationTime: new Date('2022-01-02'), responsible: 'admin', type: 'first-type',
              JsonData: { id: 2, name: 'Item 2', status: 'Inactive', creationTime: new Date('2022-01-02'), responsible: 'admin', type: 'first-type',Owner: "admin" },
              Owner: "admin"
          },
          {
              id: 3, name: 'Item 3', status: 'Active', creationTime: new Date('2022-01-03'), responsible: 'admin', type: 'first-type',
              JsonData: { id: 3, name: 'Item 3', status: 'Active', creationTime: new Date('2022-01-03'), responsible: 'admin', type: 'first-type',Owner: "admin" },
              Owner: "admin"
          },
          {
              id: 4, name: 'Item 4', status: 'Inactive', creationTime: new Date('2022-01-04'), responsible: 'Test_User', type: 'second-type',
              JsonData: { id: 4, name: 'Item 4', status: 'Inactive', creationTime: new Date('2022-01-04'), responsible: 'Test_User', type: 'second-type',Owner: "Test_User" },
              Owner: "Test_User"
          },
          {
              id: 5, name: 'Item 5', status: 'Active', creationTime: new Date('2022-01-05'), responsible: 'Test_User', type: 'second-type',
              JsonData: { id: 5, name: 'Item 5', status: 'Active', creationTime: new Date('2022-01-05'), responsible: 'Test_User', type: 'second-type',Owner: "Test_User" },
              Owner: "Test_User"
          },
          {
              id: 6, name: 'Item 6', status: 'Inactive', creationTime: new Date('2022-01-06'), responsible: 'Test_User', type: 'first-type',
              JsonData: { id: 6, name: 'Item 6', status: 'Inactive', creationTime: new Date('2022-01-06'), responsible: 'Test_User', type: 'first-type',Owner: "Test_User" },
              Owner: "Test_User"
          },
          {
              id: 7, name: 'Item 7', status: 'Active', creationTime: new Date('2022-01-07'), responsible: 'Test_User', type: 'first-type',
              JsonData: { id: 7, name: 'Item 7', status: 'Active', creationTime: new Date('2022-01-07'), responsible: 'Test_User', type: 'first-type',Owner: "Test_User" },
              Owner: "Test_User"
          },
          {
              id: 8, name: 'Item 8', status: 'Inactive', creationTime: new Date('2022-01-08'), responsible: 'Test_User', type: 'second-type',
              JsonData: { id: 8, name: 'Item 8', status: 'Inactive', creationTime: new Date('2022-01-08'), responsible: 'Test_User', type: 'second-type',Owner: "Test_User" },
              Owner: "Test_User"
          },
          {
              id: 9, name: 'Item 9', status: 'Active', creationTime: new Date('2022-01-09'), responsible: 'Test_User', type: 'first-type',
              JsonData: { id: 9, name: 'Item 9', status: 'Active', creationTime: new Date('2022-01-09'), responsible: 'Test_User', type: 'first-type',Owner: "Test_User" },
              Owner: "Test_User"
          },
          {
              id: 10, name: 'Item 10', status: 'Inactive', creationTime: new Date('2022-01-10'), responsible: 'Test_User', type: 'second-type',
              JsonData: { id: 10, name: 'Item 10', status: 'Inactive', creationTime: new Date('2022-01-10'), responsible: 'Test_User', type: 'second-type',Owner: "Test_User"},
              Owner: "Test_User"
          }
        ];
        localStorage.setItem(this.localStorageKey, JSON.stringify(ELEMENT_DATA));
      }
    }
  
  
    getAllApplications(): DataStructure[] {
      const data = localStorage.getItem(this.localStorageKey);
      return data ? JSON.parse(data) : [];
    }

    getApplications(user: User): DataStructure[] {

        const applications = this.getAllApplications();
        return applications.filter(app => app.Owner === user.username);
    }

    getApplicationById(id: number): any {
        const applications = this.getAllApplications();
        const application = applications.find(app => app.id === id);
        console.log('application', application);
        return application ? application.JsonData : null;
    }

    getApplicationListById(ids: number[]): any {
      const applications = this.getAllApplications();
      const filteredApplications = applications.filter(app => ids.includes(app.id));
      console.log('filteredApplications', filteredApplications);
      return filteredApplications.length > 0 ? filteredApplications : null;
    }

    addApplication(application: MinimalDataStructure): void {
      const applications = this.getAllApplications();
      const newId = applications.length > 0 ? Math.max(...applications.map(a => a.id)) + 1 : 1;
      const currentUser = this.userService.getCurrentUser()?.username;
      if(!currentUser){
        console.log(currentUser);
        alert(currentUser);
        if (!currentUser) {
          this.router.navigate(['/login']);
          return;
        }
      }
      const newApplication: DataStructure = {
        ...application,
        id: newId,
        Owner: currentUser,
        status: 'created',
        creationTime: new Date(),
        JsonData: {
          ...application,
          id: newId,
          Owner: currentUser,
          status: 'created',
          creationTime: new Date()
        }
      };
      applications.push(newApplication);
      localStorage.setItem(this.localStorageKey, JSON.stringify(applications));
    }
  
    deleteApplication(id: number): void {
      let applications = this.getAllApplications();
      applications = applications.filter(app => app.id !== id);
      localStorage.setItem(this.localStorageKey, JSON.stringify(applications));
    }
  
    updateApplication(updatedApplication: DataStructure): void {
      let applications = this.getAllApplications();
      const index = applications.findIndex(app => app.id === updatedApplication.id);
      if (index !== -1) {
        applications[index] = updatedApplication;
        localStorage.setItem(this.localStorageKey, JSON.stringify(applications));
      }
    }
  }