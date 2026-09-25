# GraphQL vs REST: prueba de concepto de turnos médicos

Proyecto práctico para mostrar **qué es GraphQL, para qué sirve y cómo se compara con una API REST**. El mismo servicio de turnos médicos se expone por las dos vías, así que la comparación es directa: mismos datos, misma lógica, distinta interfaz.

## Qué muestra

**GraphQL** (foco principal):

- Un solo endpoint y un schema tipado que describe la API.
- Selección de campos y consultas anidadas en una sola llamada.
- Introspección y GraphiQL, el explorador visual.
- Variables, alias y fragments.
- Mutations y errores tipados (`CONFLICT`, `NOT_FOUND`).
- Suscripciones: un turno nuevo llega en vivo por WebSocket.
- El problema N+1 y su solución con DataLoader, medido con un contador.

**REST** (comparación breve): endpoints convencionales, uno por recurso, para ver el over-fetching y el under-fetching.

## Requisitos

- [Node.js](https://nodejs.org) 20.19 o superior (`node -v` para verificar).
- [Postman](https://www.postman.com/downloads/) para las requests de la demo.

## Cómo arrancar

```bash
npm install
npm run dev
```

El servidor queda en el puerto 3000. Para detenerlo, `Ctrl+C`. Si el puerto está ocupado, se puede usar otro con la variable `PORT` (por ejemplo `PORT=3001 npm run dev`) y cambiar `baseUrl` en Postman.

| Qué | URL |
|---|---|
| GraphQL | `http://127.0.0.1:3000/graphql` |
| GraphiQL (explorador visual) | `http://127.0.0.1:3000/graphiql` |
| REST | `http://127.0.0.1:3000/api/turnos` |

Los datos son ficticios (6 pacientes, 5 profesionales y 10 turnos) y viven **en memoria**: al reiniciar el servidor vuelven al estado inicial.

## Cómo probarlo

Importar `postman/Turnos-PoC-V2.postman_collection.json` en Postman y ejecutar las carpetas **en orden**, con el servidor recién iniciado.

| Carpeta | Qué muestra |
|---|---|
| 0. Punto de partida | GraphQL es un `POST /graphql` con un JSON: HTTP común. |
| 1. Introspección | El servidor describe su propio schema. |
| 2. Selección de campos y anidado | Pedir solo lo necesario, y turno + paciente + profesional en 1 llamada. |
| 3. Variables | Consulta fija, valores aparte. |
| 4. Alias | El mismo campo dos veces con distintos argumentos. |
| 5. Fragments | Reutilizar un grupo de campos. |
| 6. N+1, mutation y errores | N+1 contra DataLoader, crear un turno y un error `CONFLICT`. |
| 7. Comparación con REST | El mismo dato en 3 llamadas y con datos de más. |

Las mutaciones cambian los datos. Para repetir la secuencia, reiniciá el servidor.

### Suscripción (en GraphiQL)

Abrir `http://127.0.0.1:3000/graphiql`, ejecutar lo siguiente y dejarlo abierto:

```graphql
subscription {
  turnoCreado { id fecha paciente { nombre } }
}
```

Luego crear un turno desde Postman (carpeta 6): aparece en vivo en GraphiQL.

### N+1 y DataLoader

La consola del servidor imprime cuántos accesos a datos hizo cada request GraphQL:

```text
[accesos a datos] turnos=1 pacientes=10 profesionales=10 | total=21 | SIN DataLoader
[accesos a datos] turnos=1 pacientes=1 profesionales=1 | total=3 | CON DataLoader
```

Misma consulta y mismo resultado. La primera lleva el header `x-sin-dataloader`, que apaga el agrupamiento solo para esta demo.

## Estructura

| Archivo | Rol |
|---|---|
| `src/schema.graphql` | El contrato de GraphQL: tipos, consultas, mutación y suscripción. |
| `src/resolvers.ts` | Cómo se obtiene cada campo del schema. |
| `src/loaders.ts` | DataLoader, para evitar el N+1. |
| `src/turnos.ts` | Lógica de negocio compartida por GraphQL y REST. |
| `src/rest.ts` | La API REST equivalente. |
| `src/app.ts` | Arma la aplicación y conecta todas las piezas. |
| `src/server.ts` | Arranca el servidor. |
| `src/data.ts` | Datos de ejemplo. |
| `postman/` | Colección de requests para la demo. |
| `presentacion/` | Diapositivas de la exposición. |

## Tecnologías

Node.js, TypeScript, [Fastify](https://fastify.dev), [Mercurius](https://mercurius.dev) (GraphQL para Fastify) y [DataLoader](https://github.com/graphql/dataloader).

Otros comandos: `npm start` (ejecuta sin reiniciar al cambiar archivos) y `npm run typecheck` (revisa los tipos sin generar archivos).

## Límites de la prueba de concepto

- Los datos están en memoria, no hay base de datos: el N+1 se simula con un contador.
- No hay autenticación, límite de profundidad de consultas ni caché.
- `fecha` es un `String` en formato ISO 8601, porque GraphQL no trae un tipo fecha propio.
