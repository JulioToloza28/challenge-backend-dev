
# challenge-backend-dev

## Descripción

**challenge-backend** es una API RESTful diseñada para gestionar portafolios de usuarios, buscar activos financieros y realizar operaciones de trading en un mercado simulado. Esta API permite a los usuarios interactuar con su portafolio, realizar operaciones de compra/venta de activos y registrar transferencias de fondos, todo dentro de un entorno controlado.

## Tecnologías

- **Node.js**: Entorno de ejecución para JavaScript y TypeScript en el servidor.
- **TypeScript**: Superset de JavaScript para facilitar el desarrollo con tipado estático.
- **Express.js**: Framework minimalista para la creación de aplicaciones web y APIs en Node.js.
- **Sequelize**: ORM para trabajar con bases de datos SQL como MySQL.
- **Swagger**: Herramientas para documentar y probar la API RESTful de manera interactiva.

## Características

- **Gestión de Portafolios**: Los usuarios pueden administrar sus activos dentro de un portafolio.
- **Búsqueda de Activos Financieros**: Permite buscar activos financieros disponibles en el mercado.
- **Operaciones de Trading Simulado**: Los usuarios pueden realizar transacciones en un entorno de mercado simulado para probar sus estrategias.
- **Documentación API**: Generación de documentación interactiva de la API usando Swagger UI.

## Instalación

### Requisitos previos

1. **Node.js**: Asegúrate de tener Node.js instalado en tu máquina. Puedes verificar la instalación con el siguiente comando:

   ```bash
   node -v
   ```

2. **MySQL**: Asegúrate de tener MySQL instalado y configurado en tu entorno local o en una base de datos remota.

### Clonar el repositorio

```bash
git clone https://github.com/JulioToloza28/challenge-backend
cd challenge-backend
```

### Instalar dependencias

```bash
npm install
```

## Configuración

1. Crea un archivo `.env` en la raíz del proyecto.
2. Añade las siguientes variables de entorno en el archivo `.env`:

   ```
   DB_HOST= 
   DB_PORT= 
   DB_NAME= 
   DB_USER=u 
   DB_PASSWORD= 
   DB_ROOT_PASSWORD= 
   ```

3. Asegúrate de tener las tablas necesarias en tu base de datos. Puedes ejecutar las migraciones de Sequelize si se encuentran configuradas.

## Scripts

- **dev**: Inicia el servidor en modo de desarrollo con **nodemon**, que recarga automáticamente la aplicación cuando se realizan cambios.

  ```bash
  npm run dev
  ```

- **test**: Ejecuta las pruebas usando **Jest**.

  ```bash
  npm run test
  ```

- **build**: Compila el proyecto de TypeScript a JavaScript.

  ```bash
  npm run build
  ```

- **start**: Inicia la aplicación en producción utilizando **ts-node**.

  ```bash
  npm start
  ```

## Endpoints de la API

### Documentación

La documentación interactiva de la API está disponible mediante **Swagger UI** en la siguiente ruta:

```
http://localhost:3000/api-docs
```

### Portafolio

1. **GET /portfolio/{userId}**: Obtiene el portafolio de un usuario específico.
   - **Descripción**: Devuelve el valor total de la cuenta de un usuario, pesos disponibles y el listado de activos.
   - **Parámetros**:
     - `userId`: ID del usuario cuyo portafolio se va a obtener (parámetro de ruta).
   - **Respuesta**:
     - 200: Información del portafolio del usuario.
     - 404: Usuario no encontrado.
   
2. **GET /portfolio/assets/search**: Busca activos financieros en el mercado.
   - **Descripción**: Devuelve una lista de activos que coinciden con el criterio de búsqueda.
   - **Parámetros**:
     - `ticker`: Ticker del activo para filtrar (opcional).
     - `name`: Nombre del activo para filtrar (opcional).
   - **Respuesta**:
     - 200: Lista de activos que coinciden con la búsqueda.

### Órdenes

1. **POST /orders**: Crear una nueva orden.
   - **Descripción**: Permite al usuario crear una nueva orden de compra o venta.
   - **Cuerpo de la solicitud**:
     - `userId`: ID del usuario.
     - `instrumentId`: ID del activo financiero.
     - `side`: Tipo de orden (BUY, SELL, CASH_IN, CASH_OUT).
     - `size`: Cantidad de activos a comprar/vender.
     - `price`: Precio de compra/venta.
     - `type`: Tipo de orden (MARKET, LIMIT).
   - **Respuesta**:
     - 201: Orden creada con éxito.
     - 400: Error en la solicitud.
   
2. **POST /orders/{orderId}/cancel**: Cancelar una orden existente.
   - **Descripción**: Permite cancelar una orden con estado "NEW".
   - **Parámetros**:
     - `orderId`: ID de la orden a cancelar (parámetro de ruta).
   - **Respuesta**:
     - 200: Orden cancelada con éxito.
     - 400: Error en la solicitud.
     - 404: Orden no encontrada.
     - 409: Conflicto, la orden no está en estado "NEW".
   
3. **GET /orders/{orderId}**: Obtener los detalles de una orden específica.
   - **Descripción**: Devuelve información detallada de una orden.
   - **Parámetros**:
     - `orderId`: ID de la orden a consultar (parámetro de ruta).
   - **Respuesta**:
     - 200: Información detallada de la orden.
     - 404: La orden no fue encontrada.
   
4. **POST /orders/transfer**: Registrar una transferencia de fondos.
   - **Descripción**: Permite registrar una transferencia de fondos entrante (CASH_IN) o saliente (CASH_OUT).
   - **Cuerpo de la solicitud**:
     - `userId`: ID del usuario.
     - `side`: Tipo de transferencia (CASH_IN o CASH_OUT).
     - `size`: Monto de la transferencia.
     - `type`: Tipo de orden (MARKET).
   - **Respuesta**:
     - 201: Transferencia registrada con éxito.
     - 400: Error en la solicitud.
     - 404: Usuario no encontrado.
     - 500: Error al procesar la transferencia.




