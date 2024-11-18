import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { Geolocation } from '@capacitor/geolocation';
import { Router } from '@angular/router';


export interface User {
  uid: string;
  email: string;
}

export interface Message {
  createdAt: firebase.firestore.FieldValue;
  id?: string;
  from: string;
  msg: string;
  fromName: string;
  myMsg: boolean;
  latitude?: number;
  longitude?: number;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  currentUser: User | null = null;
  messages!: Observable<Message[]>;
  messageInput: string = '';

  constructor(private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {}

  ngOnInit() {

    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.currentUser = {
          uid: user.uid ?? '',
          email: user.email ?? ''
        };
        this.getMessages();
      }
    });
  }

  getMessages() {
    let users: User[] = [];
    this.messages = this.getUsers().pipe(
      switchMap(res => {
        users = res; 
        return this.afs.collection<Message>('messages', ref => ref.orderBy('createdAt')).valueChanges({ idField: 'id' });
      }),
      map((messages: Message[]) => {
        return messages.map(m => {
          m.fromName = this.getUserForMsg(m.from, users);
          m.myMsg = this.currentUser?.uid === m.from;
          return m;
        });
      })
    );
  }

  sendMessage() {
    if (this.messageInput.trim()) {
      this.afs.collection('messages').add({
        msg: this.messageInput,
        from: this.currentUser?.uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      }).then(() => {
        this.messageInput = '';
      }).catch(err => console.error('Error al enviar el mensaje', err));
    }
  }

  async sendLocation() {
    try {
      const position = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      this.afs.collection('messages').add({
        msg: 'Ubicación compartida',
        from: this.currentUser?.uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        latitude,
        longitude
      }).then(() => {
        console.log('Ubicación enviada correctamente');
      }).catch(err => console.error('Error al enviar la ubicación', err));
    } catch (error) {
      console.error('Error al obtener la ubicación:', error);
    }
  }

  private getUsers(): Observable<User[]> {
    return this.afs.collection<User>('users').valueChanges({ idField: 'uid' });
  }

  private getUserForMsg(msgFromId: string, users: User[]): string {
    for (let usr of users) {
      if (usr.uid === msgFromId) {
        return usr.email;
      }
    }
    return 'Deleted';
  }

  signOut(): Promise<void> {
    return this.afAuth.signOut()
      .then(() => {
        this.router.navigateByUrl('/', { replaceUrl: true });
      })
      .catch(error => {
        console.error('Error signing out:', error);
      });
  }
}