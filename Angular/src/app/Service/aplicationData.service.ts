import { HttpClient } from "@angular/common/http";
import { DataStructure, MinimalDataStructure } from "../Interface/DataStructure";
import { Injectable } from '@angular/core';
import { User } from "../Interface/User";
import { UserService } from "./user.service";
import { Router } from "@angular/router";
import { ShareDocumentService } from "./shareDocument.service";
@Injectable({
  providedIn: 'root'
})
export class ApplicationDataService {

  private localStorageKey = 'element_data';
  private loadDefaultData = true;

  constructor(private http: HttpClient, private userService: UserService, private shareDocumentService: ShareDocumentService, private router: Router) {
    localStorage.removeItem(this.localStorageKey); 
    if (this.loadDefaultData) {
      const ELEMENT_DATA: DataStructure[] = [
        {
          id: 1, name: 'Item 1', status: 'Active', creationTime: new Date('2022-01-01').toISOString().slice(0, 10), responsible: 'Test_User', type: 'first-type',
          JsonData: { id: 1, name: 'Item 1', status: 'Active', creationTime: new Date('2022-01-01').toISOString().slice(0, 10), responsible: 'Test_User', type: 'first-type', Owner: "Test_User" },
          Owner: "Test_User"
        },
        {
          id: 2, name: 'Item 2', status: 'Inactive', creationTime: new Date('2022-01-02').toISOString().slice(0, 10), responsible: 'admin', type: 'first-type',
          JsonData: { id: 2, name: 'Item 2', status: 'Inactive', creationTime: new Date('2022-01-02').toISOString().slice(0, 10), responsible: 'admin', type: 'first-type', Owner: "admin" },
          Owner: "admin"
        },
        {
          id: 3, name: 'Item 3', status: 'Active', creationTime: new Date('2022-01-03').toISOString().slice(0, 10), responsible: 'admin', type: 'first-type',
          JsonData: { id: 3, name: 'Item 3', status: 'Active', creationTime: new Date('2022-01-03').toISOString().slice(0, 10), responsible: 'admin', type: 'first-type', Owner: "admin" },
          Owner: "admin"
        },
        {
          id: 4, name: 'Item 4', status: 'Inactive', creationTime: new Date('2022-01-04').toISOString().slice(0, 10), responsible: 'Test_User', type: 'second-type',
          JsonData: { id: 4, name: 'Item 4', status: 'Inactive', creationTime: new Date('2022-01-04').toISOString().slice(0, 10), responsible: 'Test_User', type: 'second-type', Owner: "Test_User" },
          Owner: "Test_User"
        },
        {
          id: 5, name: 'Item 5', status: 'Active', creationTime: new Date('2022-01-05').toISOString().slice(0, 10), responsible: 'Test_User', type: 'second-type',
          JsonData: { id: 5, name: 'Item 5', status: 'Active', creationTime: new Date('2022-01-05').toISOString().slice(0, 10), responsible: 'Test_User', type: 'second-type', Owner: "Test_User" },
          Owner: "Test_User"
        },
        {
          id: 6, name: 'Item 6', status: 'Inactive', creationTime: new Date('2022-01-06').toISOString().slice(0, 10), responsible: 'Test_User', type: 'first-type',
          JsonData: { id: 6, name: 'Item 6', status: 'Inactive', creationTime: new Date('2022-01-06').toISOString().slice(0, 10), responsible: 'Test_User', type: 'first-type', Owner: "Test_User" },
          Owner: "Test_User"
        },
        {
          id: 7, name: 'Item 7', status: 'Active', creationTime: new Date('2022-01-07').toISOString().slice(0, 10), responsible: 'Test_User', type: 'first-type',
          JsonData: { id: 7, name: 'Item 7', status: 'Active', creationTime: new Date('2022-01-07').toISOString().slice(0, 10), responsible: 'Test_User', type: 'first-type', Owner: "Test_User" },
          Owner: "Test_User"
        },
        {
          id: 8, name: 'Item 8', status: 'Inactive', creationTime: new Date('2022-01-08').toISOString().slice(0, 10), responsible: 'Test_User', type: 'second-type',
          JsonData: { id: 8, name: 'Item 8', status: 'Inactive', creationTime: new Date('2022-01-08').toISOString().slice(0, 10), responsible: 'Test_User', type: 'second-type', Owner: "Test_User" },
          Owner: "Test_User"
        },
        {
          id: 9, name: 'Item 9', status: 'Active', creationTime: new Date('2022-01-09').toISOString().slice(0, 10), responsible: 'Test_User', type: 'first-type',
          JsonData: { id: 9, name: 'Item 9', status: 'Active', creationTime: new Date('2022-01-09').toISOString().slice(0, 10), responsible: 'Test_User', type: 'first-type', Owner: "Test_User" },
          Owner: "Test_User"
        },
        {
          id: 10, name: 'Item 10', status: 'Inactive', creationTime: new Date('2022-01-10').toISOString().slice(0, 10), responsible: 'Test_User', type: 'second-type',
          JsonData: { id: 10, name: 'Item 10', status: 'Inactive', creationTime: new Date('2022-01-10').toISOString().slice(0, 10), responsible: 'Test_User', type: 'second-type', Owner: "Test_User" },
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
    return applications.filter(app => app.Owner === user.userName);
  }

  getApplicationById(id: number): any {
    const applications = this.getAllApplications();
    const application = applications.find(app => app.id === id);
    return application ? application.JsonData : null;
  }

  getApplicationListById(ids: number[]): any {
    const applications = this.getAllApplications();
    const filteredApplications = applications.filter(app => ids.includes(app.id));
    console.log('filteredApplications', filteredApplications);
    return filteredApplications.length > 0 ? filteredApplications : null;
  }

  search(searchKey: string): any[] {
    let data = this.getAllApplications();

    let results = [];

    for (let item of data) {
      if (String(item.id).includes(searchKey) || item.name.includes(searchKey) || String(item.type).includes(searchKey) || item.responsible.includes(searchKey)) {
        results.push(item);
      }
    }

    return results;
  }

  searchOwnedDocuments(searchKey: string, user: User): DataStructure[] {
    let data = this.getApplications(user);

    let results: DataStructure[] = [];

    for (let item of data) {
      if (String(item.id).includes(searchKey) || item.name.includes(searchKey) || String(item.type).includes(searchKey) || item.responsible.includes(searchKey)) {
        results.push(item);
      }
    }

    return results;
  }
  searchSharedDocuments(searchKey: string, user: User): DataStructure[] {
    let results: DataStructure[] = [];

    const sharedDocumentid = this.shareDocumentService.findSharedDocuments(user.userID || 0);
    let data = this.getApplicationListById(sharedDocumentid);

    for (let item of data) {
      if (String(item.id).includes(searchKey) || item.name.includes(searchKey) || String(item.type).includes(searchKey) || item.responsible.includes(searchKey)) {
        results.push(item);
      }
    }

    return results;
  }
  searchByStatus(status: string): DataStructure[] {
    const data = this.getAllApplications();
    return data.filter(item => item.status === status);
  }

  searchByCreationTime(startDate: Date, endDate: Date | undefined): DataStructure[] {
    const data = this.getAllApplications();
    if (endDate) {
      return data.filter(item => new Date(item.creationTime) >= startDate && new Date(item.creationTime) <= endDate);
    } else {
      return data.filter(item => new Date(item.creationTime) >= startDate);
    }
  }

  searchOwnedDocumentsByStatus(status: string, user: User): DataStructure[] {
    const data = this.getApplications(user);
    return data.filter(item => item.status === status);
  }

  searchOwnedDocumentsByCreationTime(startDate: Date, endDate: Date | undefined, user: User): DataStructure[] {
    const data = this.getApplications(user);
    if (endDate) {
      return data.filter(item => new Date(item.creationTime) >= startDate && new Date(item.creationTime) <= endDate);
    } else {
      return data.filter(item => new Date(item.creationTime) >= startDate);
    }
  }
  searchSharedDocumentsByCreationTime(startDate: Date, endDate: Date | undefined, currentUser: User): DataStructure[] {
    const sharedDocumentIds = this.shareDocumentService.findSharedDocuments(currentUser.userID || 0);
    const data = this.getApplicationListById(sharedDocumentIds);

    if (endDate) {
      return data.filter((item:DataStructure) => new Date(item.creationTime) >= startDate && new Date(item.creationTime) <= endDate);
    } else {
      return data.filter((item:DataStructure)=> new Date(item.creationTime) >= startDate);
    }
  }

  searchSharedDocumentsByStatus(status: string, currentUser: User): DataStructure[] {
    const sharedDocumentIds = this.shareDocumentService.findSharedDocuments(currentUser.userID || 0);
    const data = this.getApplicationListById(sharedDocumentIds);

    return data.filter((item:DataStructure)=> item.status === status);
  }


  addApplication(application: MinimalDataStructure): void {
    const applications = this.getAllApplications();
    const newId = applications.length > 0 ? Math.max(...applications.map(a => a.id)) + 1 : 1;
    const currentUser = this.userService.getCurrentUser()?.userName;
    if (!currentUser) {
      console.log(currentUser);
      alert(currentUser);
      if (!currentUser) {
        this.router.navigate(['/login']);
        return;
      }
    }
    const formattedDate = new Date().toISOString().slice(0, 10);
    const newApplication: DataStructure = {
      ...application,
      id: newId,
      Owner: currentUser,
      status: 'created',
      creationTime: formattedDate,
      JsonData: {
        ...application,
        id: newId,
        Owner: currentUser,
        status: 'created',
        creationTime: formattedDate
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

  updateApplication(jsonData: any): void {
    let applications = this.getAllApplications();
    const index = applications.findIndex(app => app.id === jsonData.id);
    if (index !== -1) {
      const { id, name, Owner, status, creationTime, type, responsible, ...otherFields } = jsonData;
      const updatedApplication: DataStructure = {
        ...applications[index],
        id,
        name,
        Owner,
        status,
        creationTime,
        type,
        responsible,
        JsonData: {
          ...applications[index].JsonData,
          ...jsonData
        }
      };
      console.log('Updated Application', updatedApplication);
      applications[index] = updatedApplication;
      localStorage.setItem(this.localStorageKey, JSON.stringify(applications));
    } else {
      throw new Error('Application not found');
    }
  }
}