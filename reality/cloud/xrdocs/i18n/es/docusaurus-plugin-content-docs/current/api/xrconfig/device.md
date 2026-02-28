---
sidebar_label: device()
---

# XR8.XrConfig.device()

Enumeración

## Descripción {#description}

Especifique la clase de dispositivos en los que debe ejecutarse la canalización. Si el dispositivo actual no pertenece a esa clase, la ejecución fallará antes de abrir la cámara. Si allowedDevices es `XR8.XrConfig.device().ANY`, abra siempre la cámara.

Nota: Los Efectos Mundiales (SLAM) sólo pueden utilizarse con `XR8.XrConfig.device().MOBILE_AND_HEADSETS` o `XR8.XrConfig.device().MOBILE`.

## Propiedades {#properties}

| Propiedad             | Valor                     | Descripción                                                                                                                                                                                                                                                                     |
| --------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| MÓVIL                 | `'móvil'`                 | Restringe la canalización de la cámara en dispositivos de clase móvil, por ejemplo teléfonos y tabletas.                                                                                                                                                                        |
| MÓVIL_Y_AURICULARES | `'móviles y auriculares'` | Restringe la canalización de la cámara en dispositivos móviles y de clase auricular.                                                                                                                                                                                            |
| CUALQUIERA            | `'cualquiera'`            | Comienza a ejecutar la canalización de la cámara sin comprobar las capacidades del dispositivo. Esto puede fallar en algún momento del inicio de la tubería si un sensor necesario no está disponible en el momento de la ejecución (por ejemplo, un portátil no tiene cámara). |
