

# Aplicación en ionic con autenticacion y geolocalización con Firebase 📱

## Equipo de desarrollo

- [@Luis Guaygua](https://github.com/Kr-luis)
- [@Yuverly Verdezoto](https://github.com/YuverlyHidokun)

##aclaracion
este repositorio se hiso en colaboracion con el desarrollador Kr-luis
Basandonos en la [@guía](https://ionicframework.com/docs/native/geolocation) realizamos la lógica y la construcción de la app

**De click [@aqui](https://github.com/Kr-luis/Repaso_Ionic/blob/main/Repaso_ionic.apk) para descargar la aplicación**


## Capturas de Pantalla 📸


### Interfaz Principal y Auntenticacion

![login](https://github.com/Kr-luis/Repaso_Ionic/blob/main/src/assets/Capturas/Login.png?raw=true)

### Actualizacion mensajes de validaciones

![validaciones](https://github.com/Kr-luis/Repaso_Ionic/blob/main/src/assets/Capturas/validaciones.png?raw=true)

### Chat

![chat](https://github.com/Kr-luis/Repaso_Ionic/blob/main/src/assets/Capturas/Chat2.png?raw=true)

### Funcion de compartir ubicacion

![ubicacion](https://github.com/Kr-luis/Repaso_Ionic/blob/main/src/assets/Capturas/ubicacion.png?raw=true)
## Pasos para configurar el Proyecto en Ionic 

1. Crear el proyecto en IONIC:
   ```bash
   ionic start nombre_aplicacion blank --type=angular --capacitor
2. Entrar en el proyecto
    ```bash
    cd nombre_aplicacion
3. Dentro de de la carpeta del proyecto
   ```bash
   ionic g page pages/login
   ionic g page pages/chat
   ionic g service services/chat
3. Instalar capacitadores 
   ```bash
   npm i @ionic/pwa-elements
4. Añadir Firebase al proyecto 
   ```bash
   ng add @angular/fire
## Construir APK
1. Añadir capacitor de android
   ```bash
   ionic cap add android
2. Construir apk
   ```bash
   ionic build
3. Abrimos el apk en android studio
   ```bash
   ionic cap open android
