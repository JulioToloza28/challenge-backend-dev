import { getPortfolioData, getAssetsByCriteria } from '../../services/portfolio.service';
import Orders from '../../models/orders.model';
import Instruments from '../../models/instrument.model';
import MarketData from '../../models/marketdata.model';
import { Op } from 'sequelize';

describe('Portfolio Service', () => {
  describe('getPortfolioData', () => {
    const mockOrder = {
      id: 1,
      userId: 1,
      instrumentId: 101,
      side: 'BUY',
      size: 10,
      price: 100,
      status: 'FILLED',
      instrument: { name: 'Test Instrument', ticker: 'TEST' },
    };

    const mockMarketData = {
      instrumentId: 101,
      close: 150,
      previousClose: 145,
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return portfolio data successfully', async () => {
      
      jest.spyOn(Orders, 'findAll').mockResolvedValue([mockOrder] as any);
      jest.spyOn(MarketData, 'findAll').mockResolvedValue([mockMarketData] as any);

      const result = await getPortfolioData(1);

      expect(Orders.findAll).toHaveBeenCalledWith({
        where: { userId: 1, status: 'FILLED' },
        include: [{ model: Instruments, as: 'instrument' }],
      });
      expect(MarketData.findAll).toHaveBeenCalledWith({
        where: { instrumentId: { [Op.in]: [101] } },
        attributes: ['instrumentId', 'close', 'previousClose'],
      });
      expect(result).toEqual({
        totalAccountValue: 1500.00,
        availableCash: 0,
        positions: [
          {
            ticker: 'TEST',
            name: 'Test Instrument',
            quantity: 10,
            totalValue: 1500.00,
            performance: 3.45,
          },
        ],
      });
    });

    it('should throw an error if no orders are found', async () => {
      jest.spyOn(Orders, 'findAll').mockResolvedValue([]);

      await expect(getPortfolioData(1)).rejects.toThrow('Usuario no encontrado');
    });

    it('should handle errors and re-throw them', async () => {
      jest.spyOn(Orders, 'findAll').mockRejectedValue(new Error('Database error'));

      await expect(getPortfolioData(1)).rejects.toThrow('No se pudo obtener la información del portafolio.');
    });
  });

  describe('getAssetsByCriteria', () => {
    const mockAsset = {
      id: 1,
      ticker: 'TEST',
      name: 'Test Instrument',
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return assets based on ticker criteria', async () => {
      jest.spyOn(Instruments, 'findAll').mockResolvedValue([mockAsset] as any);

      const result = await getAssetsByCriteria('TEST');

      expect(Instruments.findAll).toHaveBeenCalledWith({
        where: {
          ticker: { [Op.like]: '%TEST%' },
        },
      });
      expect(result).toEqual([mockAsset]);
    });

    it('should return assets based on name criteria', async () => {
      jest.spyOn(Instruments, 'findAll').mockResolvedValue([mockAsset] as any);

      const result = await getAssetsByCriteria(undefined, 'Test Instrument');

      expect(Instruments.findAll).toHaveBeenCalledWith({
        where: {
          name: { [Op.like]: '%Test Instrument%' },
        },
      });
      expect(result).toEqual([mockAsset]);
    });

    it('should throw an error if no criteria are provided', async () => {
      await expect(getAssetsByCriteria()).rejects.toThrow('Debe proporcionar al menos un criterio de búsqueda: ticker o nombre.');
    });
    it('should handle errors and re-throw them', async () => {
      jest.spyOn(Instruments, 'findAll').mockRejectedValue(new Error('Database error'));

      await expect(getAssetsByCriteria('TEST')).rejects.toThrow('Error al buscar activos en la base de datos.');
    });
  });
});
