import { Router ,Request, Response ,NextFunction } from "express";

import {
  getPortfolio,
  searchAssets,
} from "../controllers/portfolio.controller";

const router = Router();

function asyncHandler(fn: Function) {
  return function (req: Request, res: Response, next: NextFunction) {
    return Promise.resolve(fn(req, res, next)).catch(next);
  };
}
// Endpoint de bienvenida
router.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Portfolio endpoint!",
  });
});

// Endpoint para obtener el portafolio de un usuario
/**
 * @swagger
 * /portfolio/{userId}:
 *   get:
 *     summary: Obtener el portafolio de un usuario
 *     description: Devuelve el valor total de la cuenta de un usuario, pesos disponibles y el listado de activos.
 *     tags:
 *       - Portfolio
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID del usuario cuyo portafolio se va a obtener.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Información del portafolio del usuario.
 *       404:
 *         description: Usuario no encontrado.
 */
router.get("/:userId", asyncHandler(getPortfolio));

// Endpoint para buscar activos en el mercado
/**
 * @swagger
 * /portfolio/assets/search:
 *   get:
 *     summary: Buscar activos en el mercado
 *     description: Devuelve una lista de activos que coinciden con el criterio de búsqueda.
 *     tags:
 *       - Portfolio
 *     parameters:
 *       - name: ticker
 *         in: query
 *         description: Ticker del activo para filtrar.
 *         schema:
 *           type: string
 *       - name: name
 *         in: query
 *         description: Nombre del activo para filtrar.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de activos que coinciden con la búsqueda.
 */
router.get("/assets/search", asyncHandler(searchAssets));

export default router;
