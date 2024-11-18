import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import { switchMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface User {
  uid: string;
  email: string;
}

export interface Message {
  createdAt: firebase.firestore.FieldValue;
  id: string;
  from: string;
  msg: string;
  fromName: string;
  myMsg: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  currentUser: User | null = null;

  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore) {
    this.afAuth.onAuthStateChanged((user) => {
      if (user) {
        this.currentUser = {
          uid: user.uid,
          email: user.email || '', // Manejo de valores nulos
        };
      } else {
        this.currentUser = null;
      }
    });
  }

  // Método para registrar un nuevo usuario
  async signup({ email, password }: { email: string; password: string }): Promise<any> {
    const credential = await this.afAuth.createUserWithEmailAndPassword(email, password);
    const uid = credential.user?.uid;
    if (uid) {
      await this.afs.doc(`users/${uid}`).set({
        uid,
        email: credential.user?.email || '',
      });
    }
    return credential.user;
  }

  // Método para iniciar sesión
  signIn({ email, password }: { email: string; password: string }) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  // Método para cerrar sesión
  signOut(): Promise<void> {
    return this.afAuth.signOut();
  }

  // Agregar un mensaje al chat
  addChatMessage(msg: string) {
    return this.afs.collection('messages').add({
      msg: msg,
      from: this.currentUser?.uid, // Usamos el operador opcional para evitar errores si currentUser es null
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
  }

  // Obtener mensajes del chat
  getChatMessages() {
    let users: User[] = [];
    return this.getUsers().pipe(
      switchMap((res) => {
        users = res;
        return this.afs.collection('messages', (ref) => ref.orderBy('createdAt')).valueChanges({ idField: 'id' }) as Observable<Message[]>;
      }),
      map((messages) => {
        // Asignar el nombre real y verificar si el mensaje es del usuario actual
        for (let m of messages) {
          m.fromName = this.getUserForMsg(m.from, users);
          m.myMsg = this.currentUser?.uid === m.from;
        }
        return messages;
      })
    );
  }

  // Obtener los usuarios de la base de datos
  private getUsers(): Observable<User[]> {
    return this.afs.collection('users').valueChanges({ idField: 'uid' }) as Observable<User[]>;
  }

  // Obtener el nombre de usuario para un mensaje
  private getUserForMsg(msgFromId: string, users: User[]): string {
    for (let usr of users) {
      if (usr.uid === msgFromId) {
        return usr.email;
      }
    }
    return 'Deleted';
  }
}
