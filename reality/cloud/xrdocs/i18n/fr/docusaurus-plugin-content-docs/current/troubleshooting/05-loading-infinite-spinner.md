---
id: loading-infinite-spinner
---

# Écran de chargement Infinite Spinner

#### Problème {#issue}

Lors de l'accès à une expérience WebAR, la page est bloquée sur l'écran de chargement avec un "spinner infini".

![chargement d'un spinner fini](/images/loading-infinite-spinner.jpg)

#### Pourquoi cela se produit-il ? {#why-does-this-happen}

Si vous utilisez le module de chargement XRExtras `` (qui est inclus par défaut dans tous les projets 8th Wall et les exemples ), l'écran de chargement s'affiche pendant le chargement de la scène et des ressources, et pendant que le navigateur attend que les permissions du navigateur soient acceptées. Si la scène prend beaucoup de temps pour se charger, ou si quelque chose empêche la scène de s'initialiser complètement, elle peut sembler "bloquée" sur cet écran pour toujours.

#### Causes potentielles {#potential-causes}

1. Actifs importants et/ou connexion Internet lente

Si vous vous trouvez dans un endroit où le wifi et/ou le service cellulaire sont lents et que vous essayez de charger une page Web AR contenant de grandes ressources, il se peut que la scène ne soit pas vraiment "bloquée", mais qu'elle mette du temps à se charger sur le site. Utilisez l'inspecteur de réseau du navigateur pour vérifier si votre page est simplement en train de télécharger les ressources.

En outre, essayez [d'optimiser autant que possible](/guides/your-3d-models-on-the-web/#texture-optimization) les ressources de la scène.  Il peut s'agir de techniques telles que la compression des textures, la réduction de la texture et/ou de la résolution vidéo, et la réduction du nombre de polygones des modèles 3D.

2. Appareil photo verrouillé sur un onglet d'arrière-plan

Certains appareils/navigateurs ne vous permettent pas d'ouvrir l'appareil photo s'il est déjà utilisé par un autre onglet. Essayez de fermer tous les autres onglets qui utilisent la caméra, puis rechargez la page.

3. spécifique à iOS Safari : Les éléments CSS poussent l'élément vidéo "hors de l'écran"

Si vous avez ajouté des éléments HTML/CSS personnalisés à votre expérience de WebAR, assurez-vous qu'ils sont correctement superposés à la scène. Si l'élément vidéo de la page est déplacé hors de l'écran, iOS Safari n'affichera pas le flux vidéo. Cela déclenche à son tour une série d'événements qui donnent l'impression que 8th Wall est "coincé".  En réalité, voici ce qui se passe :

Le flux vidéo ne s'affiche pas -> La scène AFrame ne s'initialise pas complètement -> La scène AFrame n'émet jamais l'événement "loaded" -> Le module XRExtras Loading ne disparaît jamais (il est à l'écoute de l'événement "loading" de la scène qui ne se déclenche jamais !)

Pour résoudre ce problème, nous vous recommandons d'utiliser la vue "Layout" de l'inspecteur Safari pour visualiser le positionnement de votre contenu DOM. Souvent, vous verrez quelque chose de similaire à l'image ci-dessous où l'élément vidéo est repoussé "hors de l'écran" / "sous le pli".

![vidéo - élément - hors-écran](/images/video-element-offscreen.jpg)

Pour résoudre ce problème, ajustez le positionnement CSS de vos éléments afin qu'ils ne repoussent pas le flux vidéo hors de l'écran. L'utilisation du positionnement `absolute` est un moyen d'y parvenir.
