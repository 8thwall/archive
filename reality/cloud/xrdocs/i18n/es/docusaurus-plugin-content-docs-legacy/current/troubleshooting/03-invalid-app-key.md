---
id: invalid-app-key
---

# Clave de aplicación no válida

Problema: Cuando intento ver mi Web App, recibo un mensaje de error **"Clave de aplicación no válida "** o **"Dominio no autorizado "**.

Pasos para solucionar problemas:

1. Compruebe que la clave de su aplicación se ha pegado correctamente en el código fuente.
2. Verifique que se está conectando a su aplicación web a través de **https**.  Los navegadores móviles lo necesitan para acceder a la cámara.
3. Compruebe que está utilizando un navegador compatible, consulte [Requisitos del navegador web](/legacy/getting-started/requirements/#web-browser-requirements)
4. Si se autoaloja, verifique que su dispositivo ha sido debidamente autorizado.  En su teléfono, visite <https://apps.8thwall.com/token> para ver el estado de autorización del dispositivo. Esto no es necesario si ha configurado [Self Hosted Domains](/legacy/guides/projects/self-hosted-domains).
5. Si es miembro de varios espacios de trabajo de desarrollador web, asegúrese de que la App Key y el Dev Token pertenecen al **mismo espacio de trabajo**.
6. Si su navegador está en modo de navegación privada o de incógnito, salga del modo privado/de incógnito, vuelva a autorizar su dispositivo e inténtelo de nuevo.
7. Borre los datos del sitio web y las cookies de su navegador, vuelva a autorizar su dispositivo e inténtelo de nuevo.
8. Si tienes un plan Pro o Enterprise de pago e intentas acceder públicamente a tu experiencia WebAR, asegúrate de que [Self Hosted Domains](/legacy/guides/projects/self-hosted-domains) está configurado correctamente.
