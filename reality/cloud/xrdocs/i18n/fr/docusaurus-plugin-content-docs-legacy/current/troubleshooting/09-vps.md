---
id: vps-troubleshooting
---

# Lightship VPS

## Les droits d'accès à l'emplacement sont refusés {#location-permissions-denied}

#### Numéro {#issue}

Lorsque vous lancez une expérience qui utilise le module Lightship Maps ou Lightship VPS, vous pouvez rencontrer une alerte indiquant "LOCATION PERMISSION DENIED". VEUILLEZ AUTORISER ET RÉESSAYER."\\`

#### Résolution {#resolution}

Activez les autorisations de localisation au niveau du navigateur et au niveau du système.

**Niveau navigateur (iOS)**

Assurez-vous que la localisation est réglée sur "Demander" ou "Autoriser" dans `Paramètres > Safari > Localisation`.

**Niveau système (iOS)**

Assurez-vous que les services de localisation sont activés dans `Paramètres > Confidentialité et sécurité > Services de localisation > Safari`.

https://support.apple.com/en-us/HT207092

## Se connecter à Wayfarer avec 8th Wall en utilisant Google {#signing-into-wayfarer-with-8th-wall-using-google}

#### Numéro {#issue}

Si vous essayez de vous connecter à Wayfarer avec 8th Wall en utilisant l'authentification Google, l'application se fige sur un écran blanc.

#### Résolution {#resolution}

L'application Wayfarer ne prend pas en charge l'authentification Google pour le moment. Si vous avez un compte 8th Wall actif, vous pouvez aller sur https://www.8thwall.com/profile pour connecter une combinaison email/mot de passe et l'utiliser pour vous connecter à Wayfarer à la place.

## Test Scan ne s'affiche pas dans le navigateur géospatial {#test-scan-not-showing-up-in-the-geospatial-browser}

#### Numéro {#issue}

Vous effectuez un scan test dans l'application Wayfarer, mais il n'apparaît jamais dans le navigateur géospatial du 8e mur.

#### Résolution {#resolution}

Il est probable que l'espace de travail 8th Wall sélectionné sur la page de profil de l'application Wayfarer ne soit pas le bon. Veuillez sélectionner l'espace de travail 8e mur correct et scanner à nouveau l'emplacement.

## Activation ou Test Scan bloqué dans le traitement {#activation-or-test-scan-stuck-in-processing}

#### Résolution {#resolution}

Veuillez contacter support@lightship.dev et inclure des détails sur l'emplacement du VPS ou le scan de test.

## Échec de l'activation {#failed-activation}

#### Résolution {#resolution}

Veuillez contacter support@lightship.dev et inclure des détails sur l'emplacement du VPS.
