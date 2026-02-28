---
sidebar_label: dispositivoEstimar()
---

# XR8.XrDevice.deviceEstimate()

`XR8.XrDevice.deviceEstimate()`

## Descripción {#description}

Devuelve una estimación del dispositivo del usuario (por ejemplo, marca / modelo) basada en la cadena del agente de usuario y otros factores. Esta información es sólo una estimación y no debe considerarse completa ni fiable.

## Parámetros {#parameters}

Ninguno

## Devuelve {#returns}

Un objeto: `{ locale, os, osVersion, manufacturer, model }`

| Propiedad    | Descripción                                                       |
| ------------ | ----------------------------------------------------------------- |
| localización | La configuración regional del usuario.            |
| os           | El sistema operativo del dispositivo.             |
| osVersion    | La versión del sistema operativo del dispositivo. |
| fabricante   | El fabricante del aparato.                        |
| modelo       | El modelo del aparato.                            |
