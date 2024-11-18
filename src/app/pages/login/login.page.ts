import { Component, OnInit } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { ChatService } from '../../services/chat.service';
@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
    credentialForm: FormGroup;
    constructor(
        private fb: FormBuilder,
        private router: Router,
        private alertController: AlertController,
        private loadingController: LoadingController,
        private chatService: ChatService
    ) {
        this.credentialForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }
    ngOnInit() {
        this.credentialForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }
    async signUp() {
        const loading = await this.loadingController.create();
        await loading.present();
        this.chatService
            .signup(this.credentialForm.value)
            .then(
                async (user) => {
                    loading.dismiss();
                    const alert = await this.alertController.create({
                        header: 'Registro exitoso',
                        message: "El correo se encuentra registrado",
                        buttons: ['OK'],
                    });
                    this.router.navigateByUrl('/', { replaceUrl: true });
                },
                async (err) => {
                    loading.dismiss();
                    const alert = await this.alertController.create({
                        header: 'Registro fallido',
                        message: "El correo ya se encuentra registrado",
                        buttons: ['OK'],
                    });
                    await alert.present();
                }
            );
    }
    async signIn() {
        const loading = await this.loadingController.create();
        await loading.present();
        this.chatService
            .signIn(this.credentialForm.value)
            .then(
                (res) => {
                    loading.dismiss();
                    this.router.navigateByUrl('/chat', { replaceUrl: true });
                },
                async (err) => {
                    loading.dismiss();
                    const alert = await this.alertController.create({
                        header: 'algo salio mal',
                        message: "Ingrese sus credenciales correctas",
                        buttons: ['OK'],
                    });
                    await alert.present();
                }
            );
    }
    get email() {
        return this.credentialForm.get('email');
    }
    get password() {
        return this.credentialForm.get('password');
    }


}