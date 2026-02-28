# Receptores de eventos AFrame

Esta sección describe los eventos que escucha el componente "xrweb" A-Frame

Puede emitir estos eventos en su aplicación web para realizar diversas acciones:

| Escucha de eventos                        | Descripción                                                                                                                                                                                                                                                                                      |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [hidecamerafeed](hidecamerafeed.md)       | Oculta la imagen de la cámara. El seguimiento no se detiene.                                                                                                                                                                                                                                     |
| [recenter](recenter.md)                   | Vuelve a dirigir la alimentación de la cámara a su origen. Si se proporciona un nuevo origen como argumento, el origen de la cámara se restablecerá a ese, y luego se recentrará.                                                                                                                |
| [screenshotrequest](screenshotrequest.md) | Emite una petición al motor para que capture una captura de pantalla del lienzo AFrame. El motor emitirá un evento [`screenshotready`](/api/aframeevents/screenshotready) con la imagen comprimida en JPEG o [`screenshoterror`](/api/aframeevents/screenshoterror) si se ha producido un error. |
| [showcamerafeed](showcamerafeed.md)       | Muestra la alimentación de la cámara.                                                                                                                                                                                                                                                            |
| [stopxr](stopxr.md)                       | Detiene la sesión XR actual. Mientras está parado, la alimentación de la cámara se detiene y no se sigue el movimiento del dispositivo.                                                                                                                                                          |
