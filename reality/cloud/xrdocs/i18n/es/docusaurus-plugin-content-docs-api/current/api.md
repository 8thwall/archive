---
slug: '/'
sidebar_label: Introducción a la API
sidebar_position: 1
description: Esta sección ofrece una visión detallada de las API disponibles para crear experiencias WebAR inmersivas con 8th Wall Studio.
---

# Introducción a la API

Esta sección ofrece una visión detallada de las API disponibles para crear experiencias WebAR inmersivas con 8th Wall Studio.

La referencia de la API de 8th Wall está organizada en dos grupos principales:

## API del estudio

La API de Studio proporciona todo lo necesario para crear experiencias estructuradas y dinámicas en Studio.

La API de Studio incluye:

- [Sistema Entidad-Componente (ECS)\*\*](/api/studio/ecs) - APIs para trabajar con la arquitectura ECS de Studio, permitiendo crear, modificar y organizar entidades y componentes en tiempo de ejecución.
- [**World**](/api/studio/world) - Funciones básicas y utilidades para gestionar el gráfico general de la escena, incluyendo jerarquías de entidades, transformaciones y espacios. El mundo es el contenedor de todos los espacios, entidades, consultas y observadores de tu proyecto.
- [Eventos\*\*](/api/studio/events) - Un sistema completo para enviar y responder a eventos en tiempo de ejecución dentro de Studio.

Utiliza la API de Studio para crear experiencias inmersivas y llenas de estados que respondan a las entradas de los jugadores, a los cambios en el mundo y a las interacciones en tiempo real.

[Explora la API de Studio →](/api/studio)

## API del motor

La API del motor proporciona acceso de bajo nivel al motor de RA subyacente de 8th Wall, incluyendo:

- **Módulos de canalización de cámaras de 8th Wall** - Módulos de canalización de cámaras desarrollados por 8th Wall.
- **Módulos personalizados de canalización de cámara** - Interfaz para trabajar con el canal de procesamiento de fotogramas de la cámara.

Utilice la API del motor cuando necesite un control detallado de la entrada de la cámara, el procesamiento de fotogramas o la integración de flujos de trabajo WebGL o de visión por ordenador personalizados en su proyecto.

[Explora la API del motor →](/api/engine)

---

## Elegir la API adecuada

- \*\*Empieza con la API de Studio para trabajar en el entorno de desarrollo estructurado de Studio.

- → Sumérgete en la API del motor para acceder a la cámara y a las funciones de RA de bajo nivel.

:::note
**Las experiencias de Studio pueden utilizar módulos de canalización de cámara personalizados para un control avanzado, pero la API de Studio y la API de Engine tienen propósitos diferentes: Studio se encarga de la construcción del mundo y la interacción, mientras que Engine gestiona la cámara de bajo nivel y el procesamiento de fotogramas.**
:::
