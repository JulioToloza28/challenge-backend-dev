import Orders from "../models/orders.model";
import Instruments from "../models/instrument.model";
import MarketData from "../models/marketdata.model";
import { Op } from "sequelize";
import { CustomError } from "../errors/CustomError";


interface PortfolioAsset {
  ticker: string;
  name: string;
  quantity: number;
  totalValue: number;
  performance: number;
}

interface Portfolio {
  availableCash: number;
  positions: PortfolioAsset[];
  totalAccountValue: number;
}

export const getPortfolioData = async (userId: number): Promise<Portfolio> => {
 
  try {
    
    const orders = await Orders.findAll({
      where: { userId, status: "FILLED" },
      include: [{ model: Instruments, as: "instrument" }],
    });

    console.log("Órdenes encontradas:", orders);

    if (orders.length === 0) {
      throw new CustomError("Usuario no encontrado", 404);
    }

    
    const cashInOut = orders.filter(order => order.side === "CASH_IN" || order.side === "CASH_OUT");
    console.log("Órdenes de efectivo (CASH_IN/CASH_OUT):", cashInOut);

    const cashAvailable = cashInOut.reduce((sum, order) => {
      console.log(`Procesando orden de efectivo: ID ${order.id}, Tipo ${order.side}, Monto ${order.size}`);
      return order.side === "CASH_IN" ? sum + order.size : sum - order.size;
    }, 0);

    console.log("Efectivo disponible calculado:", cashAvailable);

   
    const assetOrders = orders.filter(order => order.side === "BUY" || order.side === "SELL");
    console.log("Órdenes de compra/venta:", assetOrders);

    const positions = assetOrders.reduce((acc, order) => {
      if (!order.instrumentId || !order.instrument) return acc; // Validar existencia de datos

      const instrumentId = order.instrumentId;
      const existingPosition = acc[instrumentId] || {
        shares: 0,
        name: order.instrument.name,
        ticker: order.instrument.ticker,
      };

      let updatedShares = order.side === "BUY" ? existingPosition.shares + order.size : existingPosition.shares - order.size;
      updatedShares = Math.max(updatedShares, 0);

      console.log(`Instrumento ${order.instrument.name} (${order.instrument.ticker}) - Cantidad actual de acciones: ${updatedShares}`);

      return {
        ...acc,
        [instrumentId]: {
          shares: updatedShares,
          name: order.instrument.name,
          ticker: order.instrument.ticker,
        },
      };
    }, {} as Record<number, { shares: number; name: string; ticker: string }>);

    console.log("Posiciones de activos calculadas:", positions);

    const instrumentIds = Object.keys(positions).map(id => parseInt(id, 10));
    console.log("IDs de instrumentos:", instrumentIds);

   
    const marketData = await MarketData.findAll({
      where: {
        instrumentId: { [Op.in]: instrumentIds },
      },
      attributes: ["instrumentId", "close", "previousClose"],
    });

    console.log("Datos de mercado obtenidos:", marketData);

    
    const marketDataMap = new Map<number, { close: number, previousClose: number }>();
    marketData.forEach(data => {
      marketDataMap.set(data.instrumentId, {
        close: data.close,
        previousClose: data.previousClose,
      });
    });

    console.log("Datos de mercado mapeados:", marketDataMap);

    const assets = instrumentIds
      .map(instrumentId => {
        const position = positions[instrumentId];
        const data = marketDataMap.get(instrumentId);

        if (!data || position.shares <= 0) {
          console.log(`Instrumento ${position?.ticker || 'N/A'} (${instrumentId}) no tiene datos o no hay acciones, se ignora.`);
          return null; 
        }

        const marketValue = position.shares * data.close;
        const performance = data.previousClose
          ? ((data.close - data.previousClose) / data.previousClose) * 100
          : 0;

        console.log(`Instrumento ${position.ticker} (${position.name}) - Valor de mercado: ${marketValue.toFixed(2)}, Rendimiento: ${performance.toFixed(2)}%`);

        return {
          ticker: position.ticker,
          name: position.name,
          quantity: position.shares,
          totalValue: parseFloat(marketValue.toFixed(2)),
          performance: parseFloat(performance.toFixed(2)),
        };
      })
      .filter((asset): asset is PortfolioAsset => asset !== null);

    console.log("Activos procesados:", assets);

    
    const totalValue = cashAvailable + assets.reduce((sum, asset) => sum + asset.totalValue, 0);

    console.log("Valor total del portafolio calculado:", totalValue);

    return {
      totalAccountValue: parseFloat(totalValue.toFixed(2)),
      availableCash: parseFloat(cashAvailable.toFixed(2)),
      positions: assets,
    };
  } catch (error) {
    if (error instanceof CustomError) {
      console.error(`Error ${error.statusCode}: ${error.message}`);
      throw error; 
    } else {
      console.error("Error al obtener los datos del portafolio:", error);
      throw new CustomError("No se pudo obtener la información del portafolio.",404);
    }
  }
};


/**
 * Servicio para buscar activos por criterio (ticker o nombre).
 * @param ticker - Parte o el total del ticker del instrumento a buscar.
 * @param name - Parte o el total del nombre del instrumento a buscar.
 * @returns Una lista de instrumentos que coincidan con los criterios.
 */
export const getAssetsByCriteria = async (ticker?: string, name?: string) => {
  try {
    // Construir las condiciones dinámicas de búsqueda
    const conditions: Record<string, any> = {};
    
    if (ticker) {
      conditions.ticker = {
        [Op.like]: `%${ticker}%`, 
      };
    }

    if (name) {
      conditions.name = {
        [Op.like]: `%${name}%`, 
      };
    }

    
    if (Object.keys(conditions).length === 0) {
      
      throw new Error("Debe proporcionar al menos un criterio de búsqueda: ticker o nombre.");
    }

    
    const assets = await Instruments.findAll({ where: conditions });

    return assets;
  } catch (error: unknown) {  
    


    if (error instanceof Error) {
      if (error.message === "Debe proporcionar al menos un criterio de búsqueda: ticker o nombre.") {
        throw error;  
      }
    }
    throw new Error("Error al buscar activos en la base de datos.");
  }
};


