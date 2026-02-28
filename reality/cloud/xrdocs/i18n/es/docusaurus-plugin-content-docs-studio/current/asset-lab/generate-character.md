---
id: generate-characters
sidebar_position: 3
---

# Generar personajes animados

Asset Lab permite actualmente el rigging y la animación de modelos de personajes 3D **humanoides bípedos**.

Para generar un modelo de personaje animado y rigged, primero debe generar un modelo de personaje 3D en una pose en T, a partir de varias imágenes, para utilizarlo como entrada.

## Paso 1: Generar entradas de imagen

Es necesario utilizar GPT-Image-1 para generar entradas de imagen para caracteres Animados.  Ver [Generar Imágenes](/studio/asset-lab/generate-models) para más detalles.

Utilice **GPT-Image-1** para generar imágenes de caracteres multivista en posición T:

1. Vista frontal
2. Vistas derecha, izquierda y trasera

A continuación, haga clic en **Enviar a modelo 3D**.

![](/images/studio/asset-lab/character-input.png)

## Paso 2: Generar modelo 3D

Seleccione un modelo de generación 3D compatible. Ver [Generar Modelos 3D](/studio/asset-lab/generate-models) para más detalles.

Seleccione el botón Generar para procesar la solicitud.

![](/images/studio/asset-lab/character-generation.png)

Una vez completado, haga clic en **Enviar a Animación**.

## Paso 3: Rig y animación

Actualmente soporta rigging a través de **Meshy**. La entrada debe ser un humanoide bípedo con extremidades claramente definidas.

Devuelve los siguientes clips de animación:

- Caminar
- Ejecutar
- Ocioso
- Saltar
- Ataque
- Muerte
- Marcha Zombi
- Danza

Haga clic en **Rig + Animar** para procesar (puede tardar hasta 2 minutos).

![](/images/studio/asset-lab/character-animation.png)

## Paso 4: Importar al proyecto

Utiliza los botones de importación o descarga para guardar tu modelo manipulado.

![](/images/studio/asset-lab/character-import.png)

Filtre por **Personajes animados** en la Biblioteca para encontrarlos.

![](/images/studio/asset-lab/character-library.png)

![](/images/studio/asset-lab/character-library2.png)
