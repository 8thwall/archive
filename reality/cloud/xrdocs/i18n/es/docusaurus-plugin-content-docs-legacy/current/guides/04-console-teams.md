---
id: teams
---

# Equipos

Cada Espacio de Trabajo tiene un equipo que contiene uno o más Usuarios, cada uno con diferentes permisos. Los usuarios pueden pertenecer a varios equipos de Workspace.

Añada a otras personas a su equipo para que puedan acceder a los Proyectos de su espacio de trabajo. Esto le permite crear, gestionar, probar y publicar proyectos Web AR en equipo.

## Invitar a usuarios {#invite-users}

1. Seleccione su espacio de trabajo.

![SelectWorkspace](/images/console-home-my-workspaces.jpg)

2. Haga clic en **Equipo** en el menú de la izquierda.

![SelectAccountNav](/images/console-workspace-nav-teams.jpg)

3. Introduzca la(s) dirección(es) de correo electrónico de los usuarios a los que desea invitar.  Introduzca varios correos electrónicos separados por comas.
4. Haz clic en **Invitar usuarios**

![ManagePlans](/images/console-teams-invite.jpg)

## Funciones de usuario {#user-roles}

Los miembros del equipo pueden tener una de las siguientes funciones:

- PROPIETARIO
- ADMIN
- BILLMANAGER
- DEV

Capacidades para cada función:

| Capacidad                                                       | PROPIETARIO | ADMIN | BILLMANAGER | DEV |
| --------------------------------------------------------------- | ----------- | ----- | ----------- | --- |
| Proyectos - Ver                                                 | X           | X     | X           | X   |
| Proyectos - Crear                                               | X           | X     | X           | X   |
| Proyectos - Editar                                              | X           | X     | X           | X   |
| Proyectos - Suprimir                                            | X           | X     | X           | X   |
| Equipo - Ver usuarios                                           | X           | X     | X           | X   |
| Equipo - Invitar a usuarios                                     | X           | X     |             |     |
| Equipo - Eliminar usuarios                                      | X           | X     |             |     |
| Equipo - Gestionar roles de usuario                             | X           | X     |             |     |
| Perfil público - Activar                                        | X           | X     |             |     |
| Perfil público - Desactivar                                     | X           | X     |             |     |
| Perfil público - Publicar proyecto destacado                    | X           | X     |             |     |
| Perfil público - Editar proyecto destacado                      | X           | X     |             | X   |
| Perfil público - Anular la publicación de un proyecto destacado | X           | X     |             |     |
| Cuenta - Gestionar plan                                         | X           | X     | X           |     |
| Cuenta - Gestionar licencias comerciales                        | X           | X     | X           |     |
| Cuenta - Gestionar formas de pago                               | X           | X     | X           |     |
| Cuenta - Actualizar datos de facturación                        | X           | X     | X           |     |
| Cuenta - Ver/Pagar facturas                                     | X           | X     | X           |     |

## El usuario maneja {#user-handles}

Cada usuario de su espacio de trabajo tiene un identificador. Los manejadores de espacios de trabajo serán los mismos que el manejador de usuario definido en el perfil de un usuario, a menos que ya hayan sido tomados o personalizados por un usuario.

Los handles se utilizan como parte de la URL (en el formato "handle-client-workspace.dev.8thwall.app") para previsualizar los nuevos cambios al desarrollar con el editor de 8th Wall Cloud.

Ejemplo: tony-default-mycompany.dev.8thwall.app

#### Importante {#important}

- Antes de cambiar de manija, asegúrese de que todo el trabajo en el Editor de Nube esté guardado.
- Todos los cambios no realizados en los proyectos del área de trabajo se eliminarán.
- Se eliminarán todos los clientes creados en los proyectos del área de trabajo.

#### Modificar el mando de usuario {#modify-user-handle}

1. Seleccione su espacio de trabajo.
2. Haga clic en **Equipo** en el menú de la izquierda.
3. Introduce un nuevo Asa.
4. Haga clic en &#10004; para guardar.
5. Confirme que

![Change Handle](/images/console-teams-handle.jpg)
