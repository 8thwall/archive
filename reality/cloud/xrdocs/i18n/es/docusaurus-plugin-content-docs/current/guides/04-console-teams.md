---
id: teams
---

# Equipos

Cada espacio de trabajo tiene un equipo que contiene uno o más usuarios, cada uno con permisos diferentes. Los usuarios pueden pertenecer a varios espacios de trabajo.

Añade a otras personas a tu equipo para que puedan acceder a los proyectos de tu espacio de trabajo. Esto te permite crear, gestionar, probar y publicar en equipo proyectos de WebAR de forma colaborativa.

## Invitar a usuarios {#invite-users}

1. Selecciona tu espacio de trabajo.

![Seleccionar área de trabajo](/images/console-home-my-workspaces.jpg)

2. Haz clic en **Equipo** en el navegador de la izquierda.

![SelectAccountNav](/images/console-workspace-nav-teams.jpg)

3. Introduce la(s) dirección(es) de correo electrónico de los usuarios que quieres invitar.  Introduce varios correos electrónicos separados por comas.
4. Haz clic en **Invitar usuarios**

![ManagePlans](/images/console-teams-invite.jpg)

## Funciones de usuarios {#user-roles}

Los miembros del equipo pueden tener una de las siguientes funciones:
* PROPIETARIO
* ADMIN
* BILLMANAGER
* DEV

Capacidades para cada función:

| Capacidad                                                       | PROPIETARIO | ADMIN | BILLMANAGER | DEV |
| --------------------------------------------------------------- | ----------- | ----- | ----------- | --- |
| Proyectos - Ver                                                 | X           | X     | X           | X   |
| Proyectos - Crear                                               | X           | X     | X           | X   |
| Proyectos - Editar                                              | X           | X     | X           | X   |
| Proyectos - Eliminar                                            | X           | X     | X           | X   |
| Equipo - Ver usuarios                                           | X           | X     | X           | X   |
| Equipo - Invitar usuarios                                       | X           | X     |             |     |
| Equipo - Eliminar usuarios                                      | X           | X     |             |     |
| Equipo - Gestionar roles de usuario                             | X           | X     |             |     |
| Perfil público - Activar                                        | X           | X     |             |     |
| Perfil Público - Desactivar                                     | X           | X     |             |     |
| Perfil público - Publicar proyecto destacado                    | X           | X     |             |     |
| Perfil Público - Editar proyecto destacado                      | X           | X     |             | X   |
| Perfil público - Anular la publicación de un proyecto destacado | X           | X     |             |     |
| Cuenta - Gestionar plan                                         | X           | X     | X           |     |
| Cuenta - Gestionar licencias comerciales                        | X           | X     | X           |     |
| Cuenta - Gestionar formas de pago                               | X           | X     | X           |     |
| Cuenta - Actualizar información de facturación                  | X           | X     | X           |     |
| Cuenta - Ver/Pagar facturas                                     | X           | X     | X           |     |

## Identificadores de usuario {#user-handles}

Cada usuario de tu espacio de trabajo tiene un identificador. Los identificadores del espacio de trabajo serán los mismos que el identificador de usuario definido en el perfil de un usuario, a menos que ya estén siendo usados o personalizados por un usuario.

Los «identificadores» se utilizan como parte de la URL (en el formato "handle-client-workspace.dev.8thwall.app") para previsualizar los nuevos cambios al desarrollar con el Editor en la Nube de 8th Wall.

Ejemplo: tony-default-mycompany.dev.8thwall.app

#### Importante {#important}

* Antes de cambiar tu identificador, asegúrate de que todo el trabajo en el editor de nube está guardado.
* Cualquiera de sus cambios no almacenados en proyectos en el espacio de trabajo serán abandonados.
* Se eliminarán todos los clientes creados en los proyectos del espacio de trabajo.

#### Modificar el identificador de un usuario {#modify-user-handle}

1. Selecciona tu espacio de trabajo.
2. Haz clic en **Equipo** en el navegador de la izquierda
3. Introduce un nuevo identificador.
4. Pulsa &#10004; para guardar.
5. Confirmar

![Cambiar identificador de usuario](/images/console-teams-handle.jpg)
