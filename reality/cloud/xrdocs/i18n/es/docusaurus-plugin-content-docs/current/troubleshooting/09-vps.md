---
id: vps-troubleshooting
---

# Lightship VPS

## Permisos de localización denegados {#location-permissions-denied}

#### Edición {#issue}

Al iniciar una experiencia que utiliza el módulo Lightship Maps o Lightship VPS, es posible que aparezca una alerta con el texto "PERMISO DE UBICACIÓN DENEGADO". POR FAVOR PERMITA E INTENTE DE NUEVO."\`

#### Resolución {#resolution}

Habilite los permisos de ubicación tanto a nivel del navegador como a nivel del sistema.

**Nivel del navegador (iOS)**

Por favor, asegúrese de que la Ubicación está configurada como "Preguntar" o "Permitir" en `Configuración > Safari > Ubicación`.

**Nivel del sistema (iOS)**

Asegúrate de que los servicios de localización están activados en `Configuración > Privacidad y seguridad > Servicios de localización > Safari`.

https://support.apple.com/en-us/HT207092

## No se puede solicitar una activación de VPS {#unable-to-request-a-vps-activation}

#### Edición {#issue}

Al intentar activar una Ubicación VPS, aparece una alerta que dice `"ERROR: Imposible solicitar una Activación Vps"`.

#### Resolución {#resolution}

No se requiere ninguna acción. Este error indica que se ha alcanzado el límite diario de activación global. La ubicación se añade a una cola y se activa lo antes posible, normalmente en 24 horas.

## Inicio de sesión en Wayfarer con 8th Wall mediante Google {#signing-into-wayfarer-with-8th-wall-using-google}

#### Edición {#issue}

Si intentas iniciar sesión en Wayfarer con 8th Wall utilizando la autenticación de Google, la aplicación se congela en una pantalla blanca.

#### Resolución {#resolution}

Por el momento, la aplicación Wayfarer no admite la autenticación de Google. Si tienes una cuenta activa en 8th Wall, puedes ir a https://www.8thwall.com/profile para conectar una combinación de correo electrónico y contraseña y utilizarla para iniciar sesión en Wayfarer.

## La exploración de prueba no aparece en el navegador geoespacial {#test-scan-not-showing-up-in-the-geospatial-browser}

#### Edición {#issue}

Realiza una exploración de prueba en la aplicación Wayfarer, pero nunca aparece en el navegador geoespacial de 8th Wall.

#### Resolución {#resolution}

Es probable que se haya seleccionado un espacio de trabajo de 8th Wall incorrecto en la página de perfil de la aplicación Wayfarer. Por favor, seleccione el espacio de trabajo correcto de la 8ª Pared y vuelva a escanear la ubicación.

## Activación o Escaneo de Prueba atascado en el procesamiento {#activation-or-test-scan-stuck-in-processing}

#### Resolución {#resolution}

Póngase en contacto con support@lightship.dev e incluya detalles sobre la ubicación del VPS o la exploración de prueba.

## Activación fallida {#failed-activation}

#### Resolución {#resolution}

Póngase en contacto con support@lightship.dev e incluya detalles sobre la ubicación del VPS.
