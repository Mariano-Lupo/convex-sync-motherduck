# Convex Sync MotherDuck


## Descripción

Este proyecto implementa un motor de sincronización entre Convex y DuckDB inspirado en una arquitectura CDC (Change Data Capture).

El objetivo es replicar datos desde Convex hacia un destino analítico compatible con DuckDB, manteniendo consistencia, idempotencia y capacidad de recuperación ante errores.

La implementación actual incluye:

* Importación inicial mediante snapshot.
* Persistencia de estado de sincronización.
* Motor de ejecución con recuperación de errores.
* Almacenamiento en DuckDB local.
* Suite de tests automatizados con Bun.
* Seed idempotente para generación de datos de prueba.


## Objetivo de la Prueba Técnica

La evaluación solicita construir un componente de sincronización capaz de:

* Replicar tablas desde Convex.
* Mantener cursores persistentes.
* Aplicar cambios incrementales.
* Recuperarse de interrupciones.
* Garantizar idempotencia.
* Exponer estado observable del proceso de sincronización.

La implementación desarrollada prioriza la construcción incremental de una base sólida de sincronización, acompañada por pruebas automatizadas que validan comportamiento, recuperación e idempotencia.


## Estado Actual

Actualmente el proyecto implementa:

* Snapshot inicial desde exportaciones de Convex.
* Persistencia de estado mediante tabla `sync_state`.
* Replicación de datos hacia DuckDB.
* Re-ejecución segura evitando snapshots duplicados.
* Recuperación desde estados de error.
* Suite de pruebas automatizadas.

No se encuentra implementado todavía el consumo directo de los endpoints `list_snapshot` y `document_deltas` de Streaming Export.


## Instalación


### Requisitos

* Bun
* Node.js
* Convex
* DuckDB

Instalar dependencias:

```bash
bun install
```


## Ejecución

Iniciar Convex y la aplicación:

```bash
npm run dev
```


## Seed de Datos

El proyecto incluye un seed idempotente ubicado en:

**convex/seed.ts**

Ejecutar:

```bash
bunx convex run seed:run
```

El seed elimina los registros existentes y genera un nuevo conjunto de datos de prueba.

Actualmente genera:

* 500 notas de prueba.
* Datos consistentes para validar snapshots e idempotencia.


## Ejecución de Tests

Ejecutar toda la suite:

```bash
bun test
```

Tests implementados actualmente:

| Test                  | Objetivo                                                      |
| --------------------- | ------------------------------------------------------------- |
| duckdb.test.ts        | Inserción y eliminación de registros                          |
| idempotency.test.ts   | Verificar que la re-aplicación no genera duplicados           |
| snapshot.test.ts      | Validar consistencia del snapshot                             |
| engine.test.ts        | Validar ejecución completa del motor                          |
| engineRerun.test.ts   | Verificar que un snapshot completado no se ejecuta nuevamente |
| recovery.test.ts      | Persistencia de errores                                       |
| errorRecovery.test.ts | Recuperación desde estado de error                            |
| --------------------- | ------------------------------------------------------------- |


## Decisiones de Arquitectura


### Separación de Responsabilidades

La implementación fue dividida en componentes simples y con responsabilidades específicas:

* `duckdb.ts`: acceso y persistencia en DuckDB.
* `importSnapshot.ts`: importación de snapshots.
* `engine.ts`: coordinación del proceso de sincronización.
* `seed.ts`: generación de datos de prueba.
* Tests independientes para validar cada comportamiento crítico.

Esta separación permite evolucionar cada parte sin afectar el resto del sistema.


### Idempotencia

La idempotencia se implementa utilizando el identificador de Convex como clave primaria en DuckDB.

La estrategia elegida fue:

**INSERT OR REPLACE**

De esta manera:

* Re-aplicar un registro no genera duplicados.
* El último estado siempre prevalece.
* Las re-ejecuciones son seguras.

Esta decisión fue validada mediante tests automatizados.


### Persistencia de Estado

Se implementó una tabla `sync_state` para almacenar:

* Estado actual del proceso.
* Cantidad de filas aplicadas.
* Último error registrado.
* Timestamp de actualización.

Esto permite:

* Observabilidad básica.
* Recuperación después de fallos.
* Evitar re-ejecutar snapshots ya completados.


### Recuperación ante Errores

Cuando ocurre una excepción:

1. El motor registra el error.
2. El estado pasa a `error`.
3. La información queda persistida en DuckDB.

Una vez corregida la causa del fallo, el estado puede actualizarse y el proceso continuar.


### Estrategia de Snapshot

La implementación actual utiliza snapshots exportados desde Convex.

El flujo es:

```text
Export Snapshot
        ↓
documents.jsonl
        ↓
importSnapshot()
        ↓
DuckDB
```

La evaluación solicita utilizar los endpoints oficiales de Streaming Export (`list_snapshot` y `document_deltas`).

Debido a restricciones de tiempo, se priorizó construir primero una base sólida de sincronización, persistencia de estado, recuperación e idempotencia.

La siguiente evolución natural del proyecto sería reemplazar la lectura de archivos exportados por el consumo directo de dichos endpoints.


### Escalabilidad

Para volúmenes mayores de datos se recomienda:

* Procesamiento por lotes.
* Cursores persistentes.
* Aplicación incremental de cambios.
* Transacciones agrupadas.
* Reintentos con backoff exponencial.

La arquitectura actual fue organizada para permitir incorporar estas capacidades de forma incremental.


## Qué Testeé y Por Qué

La prioridad principal fue validar la correctitud de la sincronización antes de agregar nuevas funcionalidades.


### Tests Implementados


#### duckdb.test.ts

Valida:

* Inserción de registros.
* Eliminación de registros.

Motivo:

La persistencia en el destino es la base de toda la sincronización.

---

#### idempotency.test.ts

Valida:

* Re-aplicación segura del mismo registro.
* Ausencia de duplicados.

Motivo:

La idempotencia es un requisito explícito de la evaluación.

---

#### snapshot.test.ts

Valida:

* Consistencia entre el snapshot exportado y los registros importados.

Motivo:

Garantizar que el snapshot inicial replica correctamente los datos.

---

#### engine.test.ts

Valida:

* Ejecución completa del motor.
* Actualización correcta del estado.

Motivo:

Verificar el flujo principal de sincronización.

---

#### engineRerun.test.ts

Valida:

* Evitar re-ejecutar snapshots ya completados.

Motivo:

Reducir trabajo innecesario y prevenir duplicaciones.

---

#### recovery.test.ts

Valida:

* Persistencia de errores.

Motivo:

Garantizar observabilidad ante fallos.

---

#### errorRecovery.test.ts

Valida:

* Recuperación desde un estado de error.

Motivo:

Demostrar capacidad básica de recuperación.


### Qué No Testeé

No se implementaron pruebas para:

* Streaming Export real.
* Consumo de `document_deltas`.
* Recuperación basada en cursores persistentes.
* Pruebas de carga sostenida.
* Pruebas de rendimiento.

Motivo:

Se priorizó validar primero la consistencia funcional del motor base antes de abordar optimizaciones y escalabilidad.


## Cómo se Recupera de Fallos


### Error Durante un Snapshot

Si ocurre una excepción durante la importación:

1. El proceso captura la excepción.
2. El estado se registra como `error`.
3. El mensaje queda almacenado en `sync_state`.

Esto permite identificar rápidamente la causa del problema.


### Re-ejecución del Motor

Si el snapshot ya fue completado:

**Estado = done**

el motor evita volver a ejecutarlo.

Esto reduce procesamiento innecesario y evita duplicaciones.


### Recuperación Manual

Una vez corregida la causa del fallo:

1. Se reinicia el proceso.
2. Se actualiza el estado.
3. El motor puede continuar operando normalmente.


### Limitaciones Actuales

La recuperación basada en cursores persistentes aún no se encuentra implementada.

Actualmente la recuperación se basa en:

* Persistencia de estado.
* Idempotencia.
* Re-ejecución segura.


## Uso de IA

Se utilizó inteligencia artificial como herramienta de asistencia durante el desarrollo.

La IA fue utilizada para:

* Revisar arquitectura.
* Detectar errores.
* Proponer mejoras incrementales.
* Generar ideas para pruebas automatizadas.
* Revisar decisiones de diseño.

Todas las decisiones finales de implementación, validación y ejecución fueron realizadas manualmente.

Cada cambio fue probado localmente antes de incorporarse al repositorio.


## Diagrama de Flujo

Implementación actual:

```text
Convex
   ↓
Snapshot Export (JSONL)
   ↓
importSnapshot()
   ↓
engine.ts
   ↓
DuckDB
   ↓
sync_state
```

Arquitectura objetivo:

```text
Convex
   ↓
list_snapshot
   ↓
Snapshot Inicial
   ↓
document_deltas
   ↓
Sync Engine
   ↓
DuckDB / MotherDuck
   ↓
Estado Persistente
```

## Limitaciones Actuales

La implementación actual no consume directamente los endpoints de Streaming Export de Convex.

Actualmente el flujo de sincronización se basa en snapshots exportados manualmente a archivos JSONL.

No se encuentran implementados todavía:

- document_deltas
- Cursores persistentes
- Watchdog de recuperación automática
- Migraciones automáticas de esquema
- Componente reutilizable de Convex

Estas funcionalidades fueron identificadas y documentadas como siguientes pasos de evolución del proyecto.


## Trabajo Futuro

Las siguientes mejoras permitirían acercar la implementación al diseño completo solicitado por la evaluación:

* Integración directa con `list_snapshot`.
* Integración directa con `document_deltas`.
* Cursores persistentes.
* Reintentos automáticos con backoff.
* Watchdog de recuperación automática.
* Migraciones automáticas de esquema.
* Compatibilidad nativa con MotherDuck.
* Conversión del motor en un componente reutilizable de Convex.


## Conclusión

La implementación actual establece una base funcional para un motor de sincronización entre Convex y DuckDB.

Se priorizaron:

* Correctitud.
* Idempotencia.
* Observabilidad.
* Recuperación básica.
* Cobertura mediante tests automatizados.

La arquitectura fue organizada para permitir una evolución incremental hacia una solución completa basada en Streaming Export y CDC.
