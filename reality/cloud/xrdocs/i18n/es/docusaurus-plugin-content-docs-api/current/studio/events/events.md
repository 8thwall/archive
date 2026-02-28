# Estudio Eventos Referencia

Los eventos son una parte esencial de la creación de experiencias dinámicas e interactivas en Studio. Esta referencia describe los distintos tipos de eventos que puedes escuchar en tus proyectos.

## Categorías de eventos

- [Eventos XR](xr): Eventos emitidos por los módulos de cámara de 8th Wall como `reality` y `facecontroller`, que cubren cosas como el seguimiento de objetivos de imagen, la creación de ubicaciones VPS y la detección de caras.

- [Eventos de activos](assets): Eventos relacionados con activos, como eventos de carga y reproducción de activos.

- [Eventos de cámara](camera): Eventos relacionados con los cambios de estado de la cámara, incluidos los cambios de cámara activa, las ediciones de atributos de cámara XR y los cambios de entidad de cámara activa.

- [Eventos generales](general): Eventos centrales a nivel mundial que se activan dentro de las experiencias de Studio, como un cambio de espacio activo.

- [Eventos de entrada](input): Eventos desencadenados por las interacciones del usuario, incluyendo eventos táctiles, gestuales y de clic en la interfaz de usuario. Abarca tanto los toques simples como los gestos multitáctiles complejos.

- [Eventos físicos](physics): Eventos emitidos cuando se producen interacciones físicas entre entidades, como el inicio o fin de colisiones.

---

Cada sección de eventos proporciona:

- Descripción del momento en que se emite el evento
- Propiedades (si las hay) transmitidas con el evento
- Ejemplos de código que muestran cómo escuchar el evento globalmente o en entidades específicas
