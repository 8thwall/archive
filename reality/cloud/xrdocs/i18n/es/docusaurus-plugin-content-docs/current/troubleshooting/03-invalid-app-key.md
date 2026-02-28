---
id: invalid-app-key
---

# Clave de aplicación no válida

Problema: al intentar ver mi Web App, recibo un mensaje de error **"Clave de aplicación no válida"** o **«Dominio no autorizado"**.

Pasos para solucionar problemas:

1. Compruebe que la clave de su aplicación se ha pegado correctamente en el código fuente.
2. Compruebe que está conectando a su aplicación web a través de **https**.  Es necesario en los navegadores móviles para acceder a la cámara.
3. Compruebe que utiliza un navegador compatible, consulte [Requisitos del navegador web](/getting-started/requirements/#web-browser-requirements)
4. Si tiene su propio alojamiento (hosting), verifique que su dispositivo ha sido debidamente autorizado.  En su teléfono, visite <https://apps.8thwall.com/token> para ver el estado de autorización del dispositivo. Esto no es necesario si ha configurado [Dominios autohospedados](/guides/projects/self-hosted-domains).
5. Si es miembro de varios espacios de trabajo de Desarrollo Web, asegúrese de que la App Key y el Dev Token son del **mismo espacio de trabajo**.
6. Si su navegador está en modo Navegación privada o Incógnito, salga del modo Privado/Incógnito, vuelva a autorizar su dispositivo e inténtelo de nuevo.
7. Borra los datos del sitio web & cookies de su navegador web, vuelva a autorizar su dispositivo e inténtelo de nuevo.
8. Si tiene un plan Pro o Enterprise de pago e intenta acceder públicamente a su experiencia WebAR, asegúrese de que [Dominios autohospedados](/guides/projects/self-hosted-domains) está configurado correctamente.
