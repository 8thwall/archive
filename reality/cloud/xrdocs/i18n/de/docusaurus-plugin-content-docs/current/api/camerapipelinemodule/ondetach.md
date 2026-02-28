# onDetach()

`onDetach: ({framework})`

## Beschreibung {#description}

`onDetach` wird aufgerufen, nachdem ein Modul das letzte Mal Rahmenaktualisierungen erhalten hat. Dies geschieht entweder, nachdem der Motor abgestellt oder das Modul manuell aus der Pipeline entfernt wurde, je nachdem, was zuerst eintritt.

## Parameter {#parameters}

| Parameter | Beschreibung                                                            |
| --------- | ----------------------------------------------------------------------- |
| framework | Die Framework-Bindungen für dieses Modul zum Versenden von Ereignissen. |
