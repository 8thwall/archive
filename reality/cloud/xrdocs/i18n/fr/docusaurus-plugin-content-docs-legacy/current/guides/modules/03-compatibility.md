# Compatibilité des modules {#module-compatibility}

Les modules 8th Wall peuvent être mis à disposition uniquement pour les projets hébergés par 8th Wall, uniquement pour les projets auto-hébergés,
ou à la fois pour les projets hébergés par 8th Wall et les projets auto-hébergés. Par défaut, les modules sont disponibles pour les projets hébergés et auto-hébergés de 8th Wall
. Ceci peut être modifié dans la page de configuration du module.

![module-compatibility-settings](/images/modules-compatibility-settings.jpg)

Les modules doivent être correctement codés pour fonctionner à la fois dans les projets hébergés par 8th Wall et dans les projets auto-hébergés. À l'adresse
, les éléments référencés dans les modules doivent être chargés en tant qu'éléments d'origine croisée afin qu'ils puissent être chargés dans les domaines auto-hébergés (
). Par exemple, en définissant explicitement l'attribut crossorigin sur les médias
:

![module-example-cors](/images/modules-example-cors.jpg)

Ou le préchargement d'un blob de travailleur web à l'aide de fetch avant d'invoquer le travailleur web :

![module-example-webworker](/images/modules-example-webworker.jpg)