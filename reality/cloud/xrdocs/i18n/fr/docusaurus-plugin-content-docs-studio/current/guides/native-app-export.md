---
id: native-app-export
description: Cette section explique comment utiliser Native App Export.
---

# Exportation d'applications natives

:::info[Beta Article]
L'exportation d'applications natives est actuellement en version bêta et limitée aux versions Android. La prise en charge d'iOS, des ordinateurs de bureau et des casques sera bientôt assurée.
:::

Native App Export vous permet d'emballer votre projet Studio en tant qu'application autonome.

---

## Exigences

L'exportation native n'est disponible que pour les projets 3D non AR. Votre projet **ne doit pas** utiliser :

- Fonctionnalités de la caméra ou de la réalité augmentée
- GPS
- Mode paysage
- Claviers virtuels ou physiques
- Manettes de jeu
- Vibrations
- Notifications push
- Achats in-app
- Textures vidéo
- API MediaRecorder
- Données sur la santé
- WebXR
- CSS

> Assurez-vous que votre projet a été construit avec succès au moins une fois avant d'essayer d'exporter.

---

## Exportation vers Android

1. Ouvrez votre projet Studio.
   S'assurer que le projet répond aux critères d'exigence ci-dessus.

2. Cliquez sur **Publier**.
   Sous **Build for Native Platforms**, sélectionnez **Android (Beta)**.

3. Personnalisez votre application :
   - **Nom de l'application:** Le nom affiché sur l'écran d'accueil d'Android
   - **Bundle Identifier:** Une chaîne unique, par exemple `com.mycompany.myapp`
   - _(Facultatif)_ Télécharger une icône d'application (1024x1024)

4. Une fois que les informations de base de votre application sont remplies, cliquez sur **Continue** pour finaliser la configuration de la construction.

---

## Finalisation des paramètres de construction

Vous allez maintenant définir la façon dont votre application est emballée :

- **Nom de la version:** Utiliser une version sémantique (par exemple `1.0.0`)
- **Orientation:**
  - **Portrait :** Garde l'application fixe en position verticale, même lorsque l'appareil est tourné.
  - **Paysage à gauche :** Affiche l'application horizontalement avec l'appareil tourné de sorte que le côté gauche est en panne.
  - **Paysage à droite:** Affiche l'application horizontalement avec l'appareil tourné de sorte que le côté droit est bas.
  - **Rotation automatique :** Permet à l'application de suivre la rotation physique de l'appareil, basculer automatiquement entre les vues verticales et horizontales.
  - **Rotation automatique (Landscape uniquement) :** Ajuste la position de l'application en fonction de la rotation de la console mais la limite aux vues horizontales uniquement.
- **Barre d'état :**
  - **Oui:** Affiche la barre d'état par défaut du système au-dessus de l'application.
  - **Non :** Masque la barre d'état par défaut du système.
- **Type d'exportation:**
  - **APK (Android Package):** Fichiers d'installation directe pour les tests ou le chargement latéral.
  - **AAB (Android App Bundle):** Requis pour la publication sur Google Play
- **Mode de construction:**
  - **L'offre groupée statique:** Construction complète et autonome
  - **Live Reload:** Imprime les mises à jour de Studio au fur et à mesure que votre projet est mis à jour.
- **Environnement:** Choisir parmi `Dev`, `Latest`, `Staging`, ou `Production`.

Lorsque tout est prêt, cliquez sur **Build** pour générer votre paquet d'applications.

> Une fois la compilation terminée, téléchargez le fichier `.apk` ou `.aab` en utilisant les liens de téléchargement fournis dans le résumé de la compilation.

---

## Publication sur le Google Play Store

Une fois l'exportation terminée, vous êtes prêt à publier votre application sur le Play Store à l'aide du **AAB (Android App Bundle)** :

### Pourquoi l'USF ?

Google exige le format AAB pour toutes les nouvelles applications depuis août 2021. Le format AAB permet d'optimiser la diffusion en générant des APK spécifiques à l'appareil et en réduisant la taille de l'application.

### Télécharger vers Google Play Console

1. Se connecter à [Play Console] (https://play.google.com/console) et s'inscrire à Play App Signing si nécessaire.
2. Naviguer vers **"Créer une application "** → remplir le nom, la langue, le statut gratuit/payant
3. Allez dans **Test & Release** → **Production** (ou piste interne/bêta). Cliquez sur **Create new release**, puis téléchargez votre fichier .aab en le faisant glisser dans la section **Drop app bundles here to upload**.
4. Liste complète des magasins, politique de confidentialité, classement des contenus et régions cibles
5. Révision et diffusion de la version

🔗 [Consultez les documents de téléchargement complets ici : Télécharger votre application sur la Play Console](https://developer.android.com/studio/publish)

---

## Installation directe sur un appareil Android

### Installation sur un émulateur Android

1. Activez **"installer des applications inconnues "** pour votre navigateur ou votre gestionnaire de fichiers
2. Transférer l'APK par USB, courriel ou stockage en nuage
3. Ouvrez l'APK depuis votre appareil et appuyez sur **Installer**.

**Pour la méthode en ligne de commande:**

```bash
adb install path/to/app.apk
```

### Installation sur un appareil physique Android

1. Configurez un émulateur dans le gestionnaire AVD d'Android Studio.
2. Lancer l'émulateur.
3. Glissez-déposez l'APK de votre ordinateur sur l'émulateur pour l'installer.

En terminal :

```bash
adb install path/to/app.apk
```
