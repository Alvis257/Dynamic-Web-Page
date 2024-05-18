import { Injectable } from '@angular/core';
import { ShareRights } from '../Interface/ShareRights';


interface SharedDocument {
  documentId: number;
  userId: number;
  rights: ShareRights;
}

@Injectable({
  providedIn: 'root'
})
export class ShareDocumentService {
  private localStorageKey = 'sharedDocuments';
  constructor() {
    if (!localStorage.getItem(this.localStorageKey)) {
      localStorage.setItem(this.localStorageKey, JSON.stringify([]));
    }
  }
  shareDocument(documentId: number, userIds: number[], rights: ShareRights): void {
    let sharedDocuments: SharedDocument[] = JSON.parse(localStorage.getItem(this.localStorageKey) || '[]');
    userIds.forEach(userId => {
      const existingShareIndex = sharedDocuments.findIndex(share => share.userId === userId && share.documentId === documentId);
      if (existingShareIndex !== -1) {
        sharedDocuments[existingShareIndex].rights = rights;
      } else {
        sharedDocuments.push({ documentId, userId, rights });
      }
    });
    localStorage.setItem(this.localStorageKey, JSON.stringify(sharedDocuments));
  }

  findSharedDocuments(userId: number): number[] {
    const sharedDocuments: SharedDocument[] = JSON.parse(localStorage.getItem(this.localStorageKey) || '[]');
    console.log('sharedDocuments', sharedDocuments);
    return sharedDocuments.filter(share => share.userId === userId).map(share => share.documentId);
  }

  findSharedUsers(documentId: number): number[] {
    const sharedDocuments: SharedDocument[] = JSON.parse(localStorage.getItem(this.localStorageKey) || '[]');
    return sharedDocuments.filter(share => share.documentId === documentId).map(share => share.userId);
  }
  
  getUserRights(userId: number, documentId: number): ShareRights | null {
    const sharedDocuments: SharedDocument[] = JSON.parse(localStorage.getItem(this.localStorageKey) || '[]');
    const sharedDocument = sharedDocuments.find(share => share.userId === userId && share.documentId === documentId);
    return sharedDocument ? sharedDocument.rights : null;
  }

  removeUsersFromSharing(documentId: number, userIds: number[]): void {
    let sharedDocuments: SharedDocument[] = JSON.parse(localStorage.getItem(this.localStorageKey) || '[]');
    userIds.forEach(userId => {
      sharedDocuments = sharedDocuments.filter(share => !(share.userId === userId && share.documentId === documentId));
    });
    localStorage.setItem(this.localStorageKey, JSON.stringify(sharedDocuments));
  }
}