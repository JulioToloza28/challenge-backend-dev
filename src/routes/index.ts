import { Router } from "express";
import portfolioRoutes from "./portfolio.routes";
import orderRoutes from "./order.routes";

const router = Router();

/**
 * Registro de rutas globales
 */
router.use("/portfolio", portfolioRoutes);
router.use("/orders", orderRoutes);

export default router;
