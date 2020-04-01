import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import * as moment from 'moment';

import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';

import { Post } from '../models/post';

import { CommentsPage } from '../comments/comments.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  message: string;
  post: Post;
  posts: Post[];

  postsCollection: AngularFirestoreCollection<Post>;

  constructor(
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private afStore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router,
    private modalCtrl: ModalController,
  ) {}

  ngOnInit() {
    this.afStore.firestore.enableNetwork();
    this.getPosts();
  }

  addPost() {
    this.post = {
      id: '',
      userName: this.afAuth.auth.currentUser.displayName,
      message: this.message,
      created: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    this.afStore
      .collection('posts')
      .add(this.post)
      .then(docRef => {
        this.postsCollection.doc(docRef.id).update({
          id: docRef.id
        });
        this.message = '';
      })
      .catch(async error => {
        const toast = await this.toastCtrl.create({
          message: error.toString(),
          duration: 3000
        });
        await toast.present();
      });
  }

  getPosts() {
    this.postsCollection = this.afStore.collection(
      'posts', ref => ref.orderBy('created', 'desc'));
    
    this.postsCollection.valueChanges().subscribe(data => {
      this.posts = data;
    });
  }

  async presentPrompt(post: Post) {
    const alert = await this.alertCtrl.create({
      header: 'メッセージ編集',
      inputs: [
        {
          name: 'message',
          type: 'text',
          placeholder: 'メッセージ'
        }
      ],
      buttons: [
        {
          text: 'キャンセル',
          role: 'cancel',
          handler: () => {
            console.log('キャンセルが選択されました');
          }
        },
        {
          text: '更新',
          handler: data => {
            this.updatePost(post, data.message);
          }
        }
      ]
    });
    await alert.present();
  }

  updatePost(post: Post, message: string) {
    this.postsCollection
      .doc(post.id)
      .update({
        message: message
      })
      .then(async () => {
        const toast = await this.toastCtrl.create({
          message: '投稿が更新されました',
          duration: 3000
        });
        await toast.present();
      })
      .catch(async error => {
        const toast = await this.toastCtrl.create({
          message: error.toString(),
          duration: 3000
        });
        await toast.present();
      });
  }

  deletePost(post: Post) {
    this.postsCollection
      .doc(post.id)
      .delete()
      .then(async () => {
        const toast = await this.toastCtrl.create({
          message: '投稿が削除されました',
          duration: 3000
        });
        await toast.present();
      })
      .catch(async error => {
        const toast = await this.toastCtrl.create({
          message: error.toString(),
          duration: 3000
        });
        await toast.present();
      });
  }

  differenceTime(time: Date): string {
    moment.locale('ja');
    return moment(time).fromNow();
  }

  logout() {
    this.afStore.firestore.disableNetwork();
    this.afAuth.auth
      .signOut()
      .then(async () => {
        const toast = await this.toastCtrl.create({
          message: 'ログアウトしました',
          duration: 3000
        });
        await toast.present();
        this.router.navigateByUrl('/login');
      })
      .catch(async error => {
        const toast = await this.toastCtrl.create({
          message: error.toString(),
          duration: 3000
        });
        await toast.present();
      });
  }

  async showComment(post: Post) {
    const modal = await this.modalCtrl.create({
      component: CommentsPage,
      componentProps: {
        sourcePost: post
      }
    });
    return await modal.present();
  }
}
