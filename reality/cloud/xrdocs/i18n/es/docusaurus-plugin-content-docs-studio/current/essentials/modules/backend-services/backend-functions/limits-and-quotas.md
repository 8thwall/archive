---
id: limits-and-quotas
sidebar_position: 4
---

# Límites y cuotas

Los siguientes límites y cuotas se aplican actualmente a las funciones de back-end:

## Límites de ruta

- Máximo de rutas por módulo: 32
- Número máximo de rutas por proyecto: 64

:::note
Cada función backend cuenta como 1 ruta adjunta a la pasarela subyacente para tu aplicación. Cada ruta
Proxy también cuenta para este límite.
:::

## Función Tiempo de espera

Las funciones backend están limitadas a un **tiempo máximo de ejecución de 10 segundos**. Si sobrepasa este límite,
la función expirará con un error.

## Soporte de paquetes

Actualmente no se admite la instalación de paquetes NPM. En este momento tienes acceso a todos los módulos principales de Node.js
.
