# XR8.XrDevice

## Descripción {#description}

Proporciona información sobre la compatibilidad y las características del dispositivo.

## Propiedades {#properties}

| Propiedad                                           | Tipo | Descripción                                                                                                |
| --------------------------------------------------- | ---- | ---------------------------------------------------------------------------------------------------------- |
| [IncompatibilityReasons](incompatibilityreasons.md) | Enum | Las posibles razones por las que un dispositivo y un navegador pueden no ser compatibles con 8th Wall Web. |

## Funciones {#functions}

| Función                                                   | Descripción                                                                                                                                                                                                                                                                                                                                                                    |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [deviceEstimate](deviceestimate.md)                       | Devuelve una estimación del dispositivo del usuario (por ejemplo, marca / modelo) basándose en la cadena del agente de usuario y otros factores. Esta información es sólo una estimación y no debe considerarse completa ni fiable.                                                                                                                                            |
| [incompatibleReasons](incompatiblereasons.md)             | Devuelve una matriz de [`XR8.XrDevice.IncompatibilityReasons`](incompatibilityreasons.md) razones por las que el dispositivo el dispositivo y el navegador no son compatibles. Sólo contendrá entradas si [`XR8.XrDevice.isDeviceBrowserCompatible()`](isdevicebrowsercompatible.md) devuelve false.                                                                           |
| [incompatibleReasonDetails](incompatiblereasondetails.md) | Devuelve detalles adicionales sobre las razones por las que el dispositivo y el navegador son incompatibles. Esta información sólo debe utilizarse como pista para ayudar en la gestión posterior del error. No deben considerarse completos ni fiables. Sólo contendrá entradas si [`XR8.XrDevice.isDeviceBrowserCompatible()`](isdevicebrowsercompatible.md) devuelve false. |
| [isDeviceBrowserCompatible](isdevicebrowsercompatible.md) | Devuelve una estimación de si el dispositivo y el navegador del usuario son compatibles con 8th Wall Web. Si devuelve false, [`XR8.XrDevice.incompatibleReasons()`](incompatiblereasons.md) devolverá las razones por las que el dispositivo y el navegador no son compatibles.                                                                                                |
