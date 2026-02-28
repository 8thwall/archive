---
id: usage-and-recent-trends
---

# Uso y tendencias recientes

## Vistas y tiempo de permanencia {#views-and-dwell-time}

Los siguientes análisis de uso se proporcionan por proyecto:

- Vistas
- Tiempo de permanencia

En la pestaña `Vistas` puede ver cuántas veces se ha visto su proyecto a lo largo de su vida. En
la pestaña `Dwell Time`, puede ver el tiempo medio que pasan los usuarios en su experiencia. Los promedios de
no tienen en cuenta los días con datos nulos.

Todas las horas del gráfico se muestran en hora local, pero 8th Wall sólo recoge datos agregados
cada hora en UTC. Los usuarios del gráfico en zonas horarias con desfases horarios distintos verán los datos recogidos en
para las horas UTC más próximas a su día. El tiempo de permanencia sólo estará disponible a partir del 1 de enero de 2023. El
día más reciente sólo se compondrá de datos parciales hasta la hora actual.

Las horas indicadas en el gráfico muestran el inicio del periodo de recogida de datos, y el valor en puntos
es la agregación de los datos a partir de esa fecha.

![ProjectDashboardOverview](/images/console-appkey-usage.jpg)

## Exportación CSV {#csv-export}

Los datos en formato CSV también están disponibles para análisis más avanzados. Puede descargar
estos datos haciendo clic en el icono de descarga situado encima del gráfico. Los campos CSV son los siguientes:

| Campo           | Descripción                                                                             |
| --------------- | --------------------------------------------------------------------------------------- |
| dt              | Cadena de fecha y hora UTC con formato ISO8601.                         |
| meanDwellTimeMs | La duración media de la sesión, en milisegundos, en el día en cuestión. |
| vistas          | Número de visitas recibidas en un día determinado.                      |

## Licencia comercial vistas {#commercia-license-views}

Los proyectos con licencias comerciales basadas en el uso también mostrarán los recuentos de vistas para el periodo de facturación actual
, si procede.  El uso se mide en incrementos de 100 vistas. El consumo de los meses anteriores puede consultarse en
en el [Resumen de facturación](/legacy/guides/account-settings/#invoices) de la página Cuenta.
