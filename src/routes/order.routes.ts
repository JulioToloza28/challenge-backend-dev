import { Router ,Request, Response ,NextFunction } from "express";
import {
  createOrder,
  cancelOrder,
  getOrderDetails,
  createTransfer,
} from "../controllers/orders.controller";

function asyncHandler(fn: Function) {
  return function (req: Request, res: Response, next: NextFunction) {
    return Promise.resolve(fn(req, res, next)).catch(next);
  };
}
const router = Router();

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Crear una nueva orden
 *     description: Permite al usuario crear una nueva orden de compra o venta.
 *     tags:
 *       - Orders
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               instrumentId:
 *                 type: integer
 *               side:
 *                 type: string
 *                 enum: [BUY, SELL, CASH_IN, CASH_OUT]
 *               size:
 *                 type: number
 *               price:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [MARKET, LIMIT]
 *     responses:
 *       201:
 *         description: Orden creada con éxito
 *       400:
 *         description: Error en la solicitud
 */
router.post("/", asyncHandler(createOrder));


/**
 * @swagger
 * /orders/{orderId}/cancel:
 *   post:
 *     summary: Cancelar una orden existente
 *     description: Permite cancelar una orden con estado "NEW". Si la orden no se encuentra o no está en estado "NEW", la cancelación no será posible.
 *     tags:
 *       - Orders
 *     parameters:
 *       - name: orderId
 *         in: path
 *         required: true
 *         description: ID de la orden a cancelar.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Orden cancelada con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Orden cancelada con éxito"
 *                 orderId:
 *                   type: integer
 *                   example: 1
 *       400:
 *         description: Error en la solicitud, por ejemplo, si la orden no existe o no está en estado "NEW".
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Orden no encontrada o no puede ser cancelada"
 *       404:
 *         description: No se encontró la orden con el ID proporcionado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Orden no encontrada"
 *       409:
 *         description: Conflicto, la orden ya fue procesada o no está en estado "NEW".
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "La orden no está en estado NEW, no puede ser cancelada"
 */
router.post("/:orderId/cancel", asyncHandler(cancelOrder));


/**
 * @swagger
 * /orders/{orderId}:
 *   get:
 *     summary: Obtener los detalles de una orden específica
 *     description: Devuelve información detallada de una orden, incluyendo el estado actual, tipo, cantidad, precio y cualquier otro dato relevante. Si la orden no existe o ha sido procesada, no se encontrará.
 *     tags:
 *       - Orders
 *     parameters:
 *       - name: orderId
 *         in: path
 *         required: true
 *         description: ID único de la orden de la que se desea obtener información.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Información detallada de la orden obtenida con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orderId:
 *                   type: integer
 *                   example: 123
 *                 userId:
 *                   type: integer
 *                   example: 1
 *                 instrumentId:
 *                   type: integer
 *                   example: 10
 *                 side:
 *                   type: string
 *                   enum: [BUY, SELL]
 *                   example: "BUY"
 *                 size:
 *                   type: number
 *                   example: 100
 *                 price:
 *                   type: number
 *                   example: 50.5
 *                 type:
 *                   type: string
 *                   enum: [MARKET, LIMIT]
 *                   example: "LIMIT"
 *                 status:
 *                   type: string
 *                   enum: [NEW, PARTIALLY_FILLED, FILLED, CANCELLED]
 *                   example: "NEW"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-12-07T12:00:00Z"
 *       404:
 *         description: La orden con el ID proporcionado no se encontró en el sistema.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Orden no encontrada"
 *       400:
 *         description: Error en la solicitud. Puede ocurrir si el ID de la orden no es válido o la estructura de la petición está mal formada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "ID de orden inválido"
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error interno del servidor"
 */
router.get("/:orderId", asyncHandler(getOrderDetails));


/**
 * @swagger
 * /orders/transfer:
 *   post:
 *     summary: Registrar una transferencia de fondos
 *     description: Permite al usuario registrar una transferencia de fondos entrante (CASH_IN) o saliente (CASH_OUT). Esta acción puede usarse para agregar dinero a la cuenta del usuario (CASH_IN) o retirarlo (CASH_OUT).
 *     tags:
 *       - Orders
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: ID único del usuario que realiza la transferencia.
 *                 example: 1
 *               side:
 *                 type: string
 *                 enum: [CASH_IN, CASH_OUT]
 *                 description: Tipo de transferencia. "CASH_IN" para depósitos y "CASH_OUT" para retiros.
 *                 example: "CASH_IN"
 *               size:
 *                 type: number
 *                 description: Monto de la transferencia en la moneda correspondiente.
 *                 example: 1000
 *               type:
 *                 type: string
 *                 enum: [MARKET]
 *                 description: El tipo de la orden. Este endpoint solo acepta transferencias de tipo "MARKET".
 *                 example: "MARKET"
 *     responses:
 *       201:
 *         description: Transferencia registrada con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Transferencia registrada con éxito."
 *       400:
 *         description: Error en la solicitud. Puede deberse a datos faltantes, incorrectos o incompatibles con la acción solicitada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "El monto de la transferencia debe ser positivo."
 *       404:
 *         description: El usuario con el ID proporcionado no existe.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Usuario no encontrado."
 *       500:
 *         description: Error interno del servidor al registrar la transferencia.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error al procesar la transferencia, inténtelo más tarde."
 */
router.post("/transfer", asyncHandler(createTransfer));


export default router;
