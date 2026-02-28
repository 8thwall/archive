---
id: requirements
---

# Prérequis

**Tous les projets** doivent afficher le badge [Powered by 8th Wall](https://drive.google.com/drive/folders/1c9d23c5hS_HspHTUD7VceV6ocqdbPN7J?usp=sharing) sur la page de chargement. </code> Il est inclus par défaut dans le module de chargement et ne peut pas être supprimé.
Veuillez consulter <a href="/guides/advanced-topics/load-screen/">ici</a> pour obtenir des instructions sur la personnalisation de l'écran de chargement.</p>

<h2 id="web-browser-requirements" spaces-before="0">Prérequis en matière de navigateur web</h2>

<p spaces-before="0">Les navigateurs mobiles ont besoin des fonctionnalités suivantes pour prendre en charge les expériences de 8th Wall Web :</p>

<ul>
<li><strong x-id="1">WebGL</strong> (canvas.getContext('webgl') || canvas.getContext('webgl2'))</li>
<li><strong x-id="1">getUserMedia</strong> (navigator.mediaDevices.getUserMedia)</li>
<li><strong x-id="1">deviceorientation</strong> (window.DeviceOrientationEvent - nécessaire uniquement si le SLAM est activé)</li>
<li><strong x-id="1">Web-Assembly/WASM</strong> (window.WebAssembly)</li>
</ul>

<p spaces-before="0"><strong x-id="1">NOTE</strong> : Les expériences Web 8th Wall doivent être visualisées via <strong x-id="1">https</strong>. Cette fonction est <strong x-id="1">requise</strong> par les navigateurs pour <strong x-id="1">l'accès à la caméra</strong>.</p>

<p spaces-before="0">Cela se traduit par la compatibilité suivante pour les appareils iOS et Android :</p>

<ul>
<li>iOS :

<ul>
<li><strong x-id="1">Safari</strong> (iOS 11+)</li>
<li><strong x-id="1">Applications</strong> qui utilisent <strong x-id="1">SFSafariViewController</strong> web views (iOS 13+)

<ul>
<li>Apple a ajouté la prise en charge de getUserMedia() à SFSafariViewController dans iOS 13.  8th Wall fonctionne dans les applications iOS 13 qui utilisent les vues web SFSafariViewController.</li>
<li>Exemples : Twitter, Slack, Discord, Gmail, Hangouts, etc.</li>
</ul></li>
<li><strong x-id="1">Applications/navigateurs</strong> qui utilisent <strong x-id="1">WKWebView</strong> web views (iOS 14.3+)

<ul>
<li>Exemples :

<ul>
<li>Chrome</li>
<li>Firefox</li>
<li>Microsoft Edge</li>
<li>Facebook</li>
<li>Facebook Messenger</li>
<li>Instagram</li>
<li>et plus encore...</li>
</ul></li>
</ul></li>
</ul></li>
<li>Android :

<ul>
<li><strong x-id="1">Les navigateurs</strong> sont connus pour prendre en charge de manière native les fonctionnalités requises pour WebAR :

<ul>
<li><strong x-id="1">Chrome</strong></li>
<li><strong x-id="1">Firefox</strong></li>
<li><strong x-id="1">Samsung Internet</strong></li>
<li><strong x-id="1">Microsoft Edge</strong></li>
</ul></li>
<li><strong x-id="1">Applications</strong> utilisant des vues Web connues pour prendre en charge les fonctionnalités requises pour WebAR :

<ul>
<li>Twitter, WhatsApp, Slack, Gmail, Hangouts, Reddit, LinkedIn, etc.</li>
</ul></li>
</ul></li>
</ul>

<h4 id="link-out-support" spaces-before="0">Support Link-out</h4>

<p spaces-before="0">Pour les applications qui ne supportent pas nativement les fonctionnalités requises pour WebAR, notre bibliothèque XRExtras fournit des flux pour diriger les utilisateurs au bon endroit, maximisant ainsi l'accessibilité de vos projets WebAR à partir de ces applications.</p>

<p spaces-before="0">Exemples : TikTok, Facebook (Android), Facebook Messenger (Android), Instagram (Android)</p>

<p spaces-before="0">Captures d’écran :</p>

<table spaces-before="0">
<thead>
<tr>
  <th>Lancer le navigateur à partir du menu (iOS)</th>
  <th>Lancer le navigateur à partir d'un bouton (Android)</th>
  <th>Copier le lien dans le presse-papiers</th>
</tr>
</thead>
<tbody>
<tr>
  <td><img src="/images/launch-browser-from-menu.jpg" alt="iOS" /></td>
  <td><img src="/images/launch-browser-from-button.jpg" alt="Android" /></td>
  <td><img src="/images/copy-link-to-clipboard.jpg" alt="copier dans le presse-papiers" /></td>
</tr>
</tbody>
</table>

<h2 id="supported-frameworks" spaces-before="0">Cadres supportés</h2>

<p spaces-before="0">8th Wall Web s'intègre facilement dans les frameworks JavaScript 3D tels que :</p>

<ul>
<li>Cadre A (<a href="https://aframe.io/" x-nc="1">https://aframe.io/</a>)</li>
<li>three.js (<a href="https://threejs.org/" x-nc="1">https://threejs.org/</a>)</li>
<li>Babylon.js (<a href="https://www.babylonjs.com/" x-nc="1">https://www.babylonjs.com/</a>)</li>
<li>PlayCanvas (<a href="https://www.playcanvas.com" x-nc="1">https://www.playcanvas.com</a>)</li>
</ul>
