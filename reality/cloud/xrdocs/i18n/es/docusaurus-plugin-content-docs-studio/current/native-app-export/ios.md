---
id: iOS
description: En esta sección se explica cómo exportar a iOS.
---

# iOS

## Exportar a iOS

1. **Abre tu proyecto de Studio**. Asegúrese de que el proyecto cumple los [criterios de requisitos](/studio/native-app-export/#requirements).

2. Haga clic en **Publicar**. En **Exportar**, seleccione **iOS**.

3. \*\*Personaliza la compilación de tu aplicación
   - **Nombre mostrado**: El nombre que aparece en la pantalla de inicio de iOS.
   - **(Opcional)** Sube un **Icono de aplicación** (1024x1024 o más grande)

4. \*\*En este paso, configurarás las credenciales de firma necesarias para crear y ejecutar tu aplicación iOS. Debe seleccionar uno o ambos tipos de firma: Desarrollo o Distribución, y cargar el certificado y el perfil de aprovisionamiento correspondientes para cada uno. Todos estos pasos deben completarse sin salir del flujo de exportación de aplicaciones nativas en Studio.

   - **Identificador del paquete**: Una cadena única, por ejemplo `com.miempresa.miapp` esta cadena debe coincidir con la configuración de la cuenta de desarrollador de Apple para poder subir la aplicación para su distribución/pruebas.

   - **Tipo de contrato**:

     i. **Desarrollo en Apple** - Utilice esta opción si desea crear y probar su aplicación en dispositivos registrados durante el desarrollo.

     1. **Generar una solicitud de firma de certificado (CSR)**
        a. En Studio, haga clic en _Agregar nuevo certificado_ y, a continuación, en _Crear solicitud de firma de certificado_.

     2. **Crear un certificado de desarrollo**
        a. Inicie sesión en su [Cuenta de desarrollador de Apple](https://developer.apple.com/account/resources/certificates/add).
        b. Utilice la solicitud de firma de certificado para crear un certificado de Desarrollo Apple o Desarrollo iOS y, a continuación, descárguelo.
        c. Referencia: [Apple: Crear un certificado de desarrollo](https://developer.apple.com/help/account/certificates/create-a-development-certificate).

     3. **Cargar el certificado**
        a. En Studio, cargue el certificado de desarrollo en _Cargar certificado._.

     4. **Crear un perfil de aprovisionamiento**
        a. En su cuenta de desarrollador de Apple, cree un perfil de aprovisionamiento de desarrollo de aplicaciones iOS.
        b. Asócielo con el certificado de desarrollo y el identificador de aplicación correctos (puede que tenga que crear uno primero).
        i. Para crear un App ID, vaya a [Apple: Create an App ID](https://developer.apple.com/account/resources/identifiers/add/bundleId) y elija App IDs. A continuación, seleccione _App_. A continuación, escriba la descripción y el ID del paquete.
        - Algunos equipos prefieren utilizar un ID de paquete comodín para su uso durante el desarrollo, ya que esto le permite compartir el mismo ID de aplicación y perfil de aprovisionamiento entre diferentes aplicaciones. Para ello, elija **Descripción = Desarrollo de comodines** e **ID de paquete = Explícito** con un valor de `com.miempresa.*`.
          c. Referencia: [Apple: Crear un perfil de aprovisionamiento de desarrollo](https://developer.apple.com/help/account/provisioning-profiles/create-a-development-provisioning-profile).

     5. **Cargar el perfil de aprovisionamiento de desarrollo**
        a. En Studio, cargue el perfil de aprovisionamiento de desarrollo en _Cargar perfil de aprovisionamiento_.

     ii. **Distribución de Apple** - Utilice esta opción cuando prepare su aplicación para su lanzamiento a través de TestFlight, la App Store o la distribución empresarial.

     1. **Generar una solicitud de firma de certificado (CSR)**
        a. En Studio, haga clic en _Agregar nuevo certificado_ y, a continuación, en _Crear solicitud de firma de certificado_.

     2. **Crear un certificado de distribución**
        a. Inicie sesión en su cuenta de desarrollador de Apple.
        b. Utilice la solicitud de firma de certificado para crear un certificado de Distribución de Apple (o Distribución de iOS - App Store Connect y Ad Hoc) y, a continuación, descárguelo.
        c. Referencia: [Apple: Visión general de los certificados](https://developer.apple.com/help/account/certificates/certificates-overview).

     3. **Cargar el certificado**
        a. En Studio, cargue el certificado de distribución en _Cargar certificado_.

     4. **Crear un perfil de aprovisionamiento**
        a. En su cuenta de desarrollador de Apple, cree un perfil de aprovisionamiento App Store (para la versión TestFlight/App Store) o Ad Hoc (para la distribución limitada a dispositivos).
        b. Asócielo con el certificado de distribución y el identificador de aplicación correctos (puede que tenga que crear uno primero).
        i. A diferencia del desarrollo, para la distribución debe crear un ID de aplicación sólo para esta aplicación, no un ID de paquete comodín.
        c. Referencia: [Apple: Crear un perfil de aprovisionamiento de distribución](https://developer.apple.com/help/account/provisioning-profiles/create-an-app-store-provisioning-profile).

     5. **Cargar el perfil de aprovisionamiento de distribución**
        a. En Studio, cargue el perfil de aprovisionamiento de distribución en _Cargar perfil de aprovisionamiento_.

   - Una vez que haya cargado los certificados y perfiles de aprovisionamiento necesarios para Desarrollo y/o Distribución, haga clic en **Guardar** para confirmar la configuración de firma de Apple.

5. **Configurar permisos (opcional):**
   Indique los permisos de sensor que su aplicación puede necesitar para funcionar correctamente y, opcionalmente, establezca un texto personalizado para la solicitud de permiso. Este paso es necesario para enviar correctamente su aplicación a la tienda de aplicaciones.

   - **Cámara**: Selecciona si la aplicación utiliza alguna de las cámaras del dispositivo (como para Efectos faciales o Efectos del mundo).
   - **Localización**: Selecciona si la aplicación utiliza localización GPS (como para VPS).
   - **Micrófono**: Selecciona si la aplicación utiliza el micrófono del dispositivo (como para Grabadora multimedia, o interacción por voz).

6. Una vez rellenada la información básica de tu aplicación, completada la configuración de Apple y establecidos los permisos, haz clic en **Continuar** para finalizar la configuración de la compilación.

---

## Finalización de los ajustes de compilación

Ahora definirás cómo se empaqueta tu aplicación:

- **Versión**: Utilice el versionado semántico (por ejemplo, 1.0.0) ([Semantic Versioning](https://semver.org/))

- \*\*Orientación:
  - Vertical: Mantiene la app fija en posición vertical, incluso cuando se gira el dispositivo.
  - Horizontal izquierda: muestra la aplicación horizontalmente con el dispositivo girado de modo que el lado izquierdo esté hacia abajo.
  - Horizontal derecha: Muestra la aplicación horizontalmente con el dispositivo girado de modo que el lado derecho esté hacia abajo.
  - Rotación automática: Permite que la app siga la rotación física del dispositivo, cambiando entre las vistas vertical y horizontal automáticamente.
  - Rotación automática (sólo horizontal): Ajusta la posición de la app en función de la rotación del dispositivo, pero la restringe solo a vistas horizontales.

- \*\*Barra de estado:
  - Sí: Muestra la barra de estado del sistema por defecto sobre la aplicación.
  - No: Oculta la barra de estado del sistema por defecto.

- \*\*Modo de construcción:
  - Paquete estático: Compilación autónoma completa (nota: las aplicaciones que utilizan funciones de realidad aumentada siguen necesitando una conexión a Internet, aunque sean un paquete estático).
  - Recarga en directo: Obtiene actualizaciones de Studio a medida que se actualiza el proyecto.

- **Entorno**: Seleccione entre Dev, Latest, Staging o Production

- **Tipo de contrato**:
  - Desarrollo: Selecciona esta opción cuando estés construyendo y probando tu app durante el desarrollo. Le permite ejecutar la aplicación en dispositivos registrados utilizando su perfil de aprovisionamiento y certificados de desarrollo.
  - Distribución: Seleccione esta opción cuando esté preparando su aplicación para el lanzamiento, ya sea para TestFlight, la App Store o la distribución empresarial/interna. Utiliza el perfil de aprovisionamiento de distribución y los certificados para garantizar que la aplicación se instala y es de confianza en los dispositivos de los usuarios finales.

7. Cuando todo esté listo, haz clic en **Build** para generar el paquete de tu aplicación.

8. Una vez finalizada la compilación, descarga el archivo `.ipa` utilizando los enlaces de descarga que aparecen en el resumen de compilación.

---

## Publicación en la App Store

Una vez finalizada la exportación, estarás listo para publicar tu aplicación en la App Store utilizando el IPA (iOS App Store Package). Cuando estés listo para compartir tu aplicación con otros o lanzarla, utilizarás App Store Connect de Apple y TestFlight (para pruebas beta) o la distribución de App Store. El proceso de alto nivel es:

1. **Prepare un registro de App Store Connect**: Inicia sesión en App Store Connect (con tu cuenta de desarrollador de Apple) y crea una entrada de App si aún no lo has hecho. En el panel de App Store Connect, ve a _Mis aplicaciones_ y haz clic en el signo "+" para añadir una nueva aplicación. Elija iOS como plataforma, introduzca el nombre de su aplicación, seleccione el ID de paquete correcto (tal y como está configurado en su proyecto 8th Wall) y proporcione un SKU y un idioma principal, a continuación _Cree_ la aplicación.

2. **Cargue el archivo .ipa mediante Transporter**: Asegúrese de que el .ipa está firmado con su certificado de distribución y perfil de aprovisionamiento (distribución de App Store). Apple no acepta compilaciones firmadas por desarrolladores para su distribución en TestFlight/App Store. En un Mac, el método de carga más sencillo es la aplicación Transporter de Apple. Instala Transporter desde el Mac App Store, ábrelo e inicia sesión con tu ID de Apple (cuenta de desarrollador). A continuación, haz clic en el signo "+" y añade tu archivo .ipa (o arrastra el .ipa a Transporter) y haz clic en _Enviar_ para cargarlo. Transporter validará el archivo y lo enviará a App Store Connect. (También puede cargar compilaciones mediante el organizador de archivos de Xcode o el comando `altool`).

3. **Activa las pruebas de TestFlight (si es necesario)**: Una vez que la compilación aparezca en App Store Connect (en la pestaña TestFlight de tu aplicación), puedes distribuirla a los probadores.
   - Pruebas internas: hasta 100 miembros, asignación inmediata de las compilaciones.
   - Pruebas externas: hasta 10.000 usuarios, requiere Beta App Review.

4. **Envío a la App Store**: Para lanzar la aplicación al App Store público, ve a la página App Store de la aplicación en App Store Connect. Rellene todos los metadatos necesarios: capturas de pantalla, descripción, categoría, precios, URL de la política de privacidad, etc. Adjunte la compilación cargada y, a continuación, haga clic en _Someter a revisión_. Apple realizará entonces una revisión completa de la aplicación.

🔗 [Apple: Sube tu aplicación a App Store Connect](https://developer.apple.com/help/app-store-connect/manage-builds/upload-builds/#:~:text=After%20adding%20an%20app%20to,testing%20%2C%20or%20%2075)

---

## Instalación directa en un dispositivo iOS

Para instalar un archivo `.ipa` firmado por un desarrollador (por ejemplo, de 8th Wall) en un iPhone o iPad para realizar pruebas, es necesario realizar una carga lateral con las herramientas de Apple:

1. **Verifique el aprovisionamiento**: Asegúrese de que el UDID del dispositivo está incluido en el perfil de aprovisionamiento de la aplicación. Un archivo `.ipa` de desarrollo o Ad Hoc sólo se instalará en los dispositivos registrados en ese perfil. Si no es así, tendrás que añadir tu dispositivo al perfil de aprovisionamiento y, a continuación, volver a cargar tu perfil de aprovisionamiento en la página Configuración completa de Apple en Desarrollo de Apple y, a continuación, volver a generar la aplicación `.ipa` firmada con el perfil que contiene tu dispositivo.

2. **Instalar en dispositivo**:
   a. **Utilizando Xcode**: En macOS, conecta tu dispositivo iOS mediante USB (y toca "Confiar" si el dispositivo te lo pide). Inicia Xcode y ve a _Window > Devices and Simulators._ Selecciona tu iPhone/iPad de la lista de dispositivos de la izquierda. (Asegúrate de que el Modo Desarrollador está activado en el dispositivo para iOS 16+; de lo contrario, iOS bloqueará la ejecución de la app). Instala el archivo `.ipa` con Xcode: Arrastra y suelta el archivo `.ipa` en la sección "Aplicaciones instaladas" del panel de tu dispositivo en la ventana Dispositivos de Xcode. Xcode copiará la aplicación en el dispositivo y la verificará. Al cabo de un momento, el icono de la aplicación debería aparecer en tu dispositivo.

   b. **Utilizando Apple Configurator 2**: Esta es una aplicación gratuita para Mac de Apple que se puede utilizar para instalar el `.ipa`. Abre Configurator, conecta tu dispositivo, luego elige _Acciones > Añadir > Aplicaciones > Elegir de mi Mac…_ y selecciona el archivo `.ipa`. Esto desplegará la aplicación en el dispositivo de forma similar.

   c. **Utilizando Música (antes iTunes)**: Abre la aplicación Música, conecta tu dispositivo, selecciónalo en la barra lateral izquierda y, a continuación, arrastra y suelta el archivo `.ipa` en la ventana principal. Al cabo de un momento, la aplicación debería aparecer en tu dispositivo. Tenga en cuenta que puede que no esté en la primera página; si no lo ve, desplácese por las páginas de inicio de sus aplicaciones.

3. **Confía en el certificado de desarrollador**: Si la aplicación se firmó con un certificado de empresa o de desarrollo, es posible que tengas que confiar manualmente en él en el dispositivo antes de que se ejecute. En el iPhone/iPad, ve a _Configuración > General > VPN y gestión de dispositivos_ (o _Perfiles y gestión de dispositivos_ en iOS antiguos) y busca el perfil del desarrollador de la aplicación. Pulse _Confiar en [Desarrollador]_ y confirme para confiar en el certificado. Este paso no es necesario para las aplicaciones de App Store/TestFlight, pero puede ser necesario para las instalaciones directas.

4. **Inicia la aplicación**: Ahora abre la aplicación en tu dispositivo. La aplicación debería iniciarse si el perfil y el certificado son válidos y el dispositivo está en modo desarrollador (para iOS 16+). Si aparece un error como "no se ha podido verificar la integridad", suele significar que el dispositivo no está aprovisionado, que la aplicación no está firmada correctamente o que el modo de desarrollador está desactivado. Una vez instalada y fiable, la versión de desarrollo se ejecutará en el dispositivo físico.
