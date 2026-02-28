# Importation de modules

## Importer des modules dans un projet du Cloud Editor {#importing-modules-into-a-cloud-editor-project}

Les modules vous permettent d'ajouter des composants réutilisables à votre projet, ce qui vous permet de vous concentrer sur le développement de votre expérience principale. Le 8th Wall Cloud Editor vous permet d'importer des modules que vous possédez, ou des modules publiés par 8th Wall, directement dans vos projets.

**Pour importer un module dans un projet du Cloud Editor** :

1. Dans le Cloud Editor, cliquez sur le bouton "+" à côté de Modules.

![modules-step1-add-module](/images/modules-step1-add-module.png)

2. Sélectionnez le module que vous souhaitez importer dans la liste. Seuls les modules compatibles avec le projet hébergé par 8th Wall seront disponibles à l'importation. (En savoir plus sur la[compatibilité des modules](#module-compatibility))

![modules-step2-select-template](/images/modules-step2-select-template.png)

3. Cliquez sur "Importer" pour ajouter votre module à votre projet. Prenez note de l'alias du module. Si vous avez déjà un module dans votre projet avec le même alias, vous devrez peut-être renommer votre module.

![modules-step3-press-import](/images/modules-step3-press-import.png)

4. Le module est maintenant visible dans votre projet, dans la section "Modules".

![modules-step4-press-import](/images/modules-added-to-project.jpg)

5. Si vous sélectionnez le module importé, vous accéderez à la page de configuration du module. Cette page permet de configurer différents paramètres du module.

![modules-step5-press-import](/images/modules-config-page.jpg)

Une fois que vous avez ajouté un module à votre projet, il se peut que vous deviez apporter des modifications à votre code pour intégrer complètement le module. Les modules avec readmes contiennent de la documentation à laquelle il convient de se référer pour comprendre comment intégrer le module spécifique dans le code de votre projet.

## Importer des modules dans un projet auto-hébergé {#importing-modules-into-a-self-hosted-project}

Les modules vous permettent d'ajouter des composants réutilisables à votre projet, ce qui vous permet de vous concentrer sur le développement de votre expérience de base. Vous pouvez importer vos propres modules ou des modules publiés par 8th Wall directement dans vos projets auto-hébergés.

**Pour importer un module dans votre projet auto-hébergé**:

1. Dans le Cloud Editor, ouvrez votre projet auto-hébergé et cliquez sur l'icône Module dans le menu de gauche :

![Modules-nav gauche](/images/modules-icon-left-nav.jpg)

2. Cliquez sur "+" ou "Importer un module" pour ajouter un module disponible à votre projet.

3. Cliquez sur « Modules publics » pour importer un module créé par 8th Wall, ou sur « Mes modules » pour importer un module créé par un membre de votre espace de travail. Seuls les modules compatibles avec le projet auto-hébergé seront disponibles à l'importation. (En savoir plus sur la[compatibilité des modules](#module-compatibility))

4. Sélectionnez le module que vous souhaitez importer dans la liste.

5. Cliquez sur "Importer" pour ajouter votre module à votre projet. Prenez note de l'alias du module. Si vous avez déjà un module dans votre projet avec le même alias, vous devrez peut-être renommer votre module.

6. Vous pouvez ajouter jusqu'à 10 modules à votre projet auto-hébergé. Ces modules seront visibles sous forme d'onglets sur la page Modules du projet du Cloud Editor de 8th Wall.

![modules de projet auto-hébergés](/images/self-hosted-project-modules.jpg)

7. Si vous sélectionnez le module importé, les détails de la configuration du module s'affichent. Il est possible de l'utiliser pour configurer divers paramètres du module.

![détails du module de projet auto-hébergé](/images/self-hosted-project-module-details.jpg)

8. Si vous importez un module créé par votre équipe, vous verrez plusieurs options d'épinglage , notamment "Version" (uniquement si le module a été déployé au moins une fois) et "Commit" (qui vous permet d'épingler le module à n'importe quel commit du code du module). Si vous sélectionnez une cible d'épinglage « Version », vous pouvez abonner votre module importé à des mises à jour de corrections de bugs, à des mises à jour de nouvelles fonctionnalités, ou désactiver les mises à jour automatiques du module.

![projet auto-hébergé-module-épinglage-cible](/images/self-hosted-project-module-pinning-target.jpg)

9. Une fois que vous avez ajouté un module à votre projet, appuyez sur "Copier le code" et collez le contenu de votre presse-papiers dans le fichier `head.html` de votre projet. Cet extrait permet de charger des modules dans votre projet auto-hébergé avec les paramètres de configuration des modules que vous avez spécifiés. Vous devrez recopier l'extrait de code et mettre à jour le `head.html` de votre projet chaque fois que vous modifiez les paramètres de configuration du module.

![code de copie de projet auto-hébergé](/images/self-hosted-project-module-copy-code.jpg)

10. Il se peut que vous deviez modifier votre code pour intégrer complètement le module.