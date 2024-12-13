import request from 'supertest';
import express, { Request, Response } from 'express';
import * as portfoliocontroller from '../../controllers/portfolio.controller';
import * as portfolioService from '../../services/portfolio.service';
import { CustomError } from '../../errors/CustomError';


const app = express();
app.use(express.json());
app.get('/portfolio/:userId', async (req: Request, res: Response) => {
  await portfoliocontroller.getPortfolio(req, res);
});

app.get('/assets', async (req: Request, res: Response) => {
  await portfoliocontroller.searchAssets(req, res);
});


jest.mock('../../services/portfolio.service.ts', () => ({
  getPortfolioData: jest.fn(),
  getAssetsByCriteria: jest.fn(),
}));

describe('Portfolio Controller', () => {
  describe('GET /portfolio/:userId', () => {
    it('should return portfolio data successfully', async () => {
      const mockPortfolio = {
        totalAccountValue: 1000,
        availableCash: 500,
        positions: [
          {
            ticker: 'AAPL',
            name: 'Apple Inc.',
            quantity: 10,
            totalValue: 1500,
            performance: 2.5,
          },
        ],
      };

      (portfolioService.getPortfolioData as jest.Mock).mockResolvedValue(mockPortfolio);

      const response = await request(app).get('/portfolio/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPortfolio);
      expect(portfolioService.getPortfolioData).toHaveBeenCalledWith(1);
    });

    it('should return 404 if the portfolio is not found', async () => {
      
      (portfolioService.getPortfolioData as jest.Mock).mockRejectedValue(new CustomError('Usuario no encontrado', 404));
    
      const response = await request(app).get('/portfolio/500');
    
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Usuario no encontrado' });
    });
    
    it('should return 400 if no criteria are provided', async () => {
      
      (portfolioService.getAssetsByCriteria as jest.Mock).mockImplementation(() => {
        throw new Error('Debe proporcionar al menos un criterio de búsqueda: ticker o nombre.');
      });
    
      const response = await request(app).get('/assets'); // Sin parámetros de búsqueda
    
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Debe proporcionar al menos un criterio de búsqueda: ticker o nombre.');
    });

    it('should return 500 for a generic error', async () => {
      
      (portfolioService.getAssetsByCriteria as jest.Mock).mockRejectedValue(new Error('Database error'));
  
      
      const response = await request(app).get('/assets').query({ ticker: 'AAPL' });
  
      
      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        message: 'Internal server error',
        error: 'Database error',
      });
    });
  });

  describe('GET /assets', () => {
    it('should return assets successfully', async () => {
      
      const mockAssets = [
        {
          ticker: 'AAPL',
          name: 'Apple Inc.',
          currentPrice: 150.50,
        
        }
      ];
    
      
      (portfolioService.getAssetsByCriteria as jest.Mock).mockResolvedValue(mockAssets);
    
      const response = await request(app).get('/assets').query({ ticker: 'AAPL' });
    
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockAssets);
    });

    it('should return 404 if no assets are found', async () => {
      (portfolioService.getAssetsByCriteria as jest.Mock).mockResolvedValue([]);

      const response = await request(app).get('/assets').query({ ticker: 'XYZ' });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'No assets found matching the criteria.' });
    });

    it('should return 500 for a generic error', async () => {
      (portfolioService.getAssetsByCriteria as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/assets').query({ ticker: 'AAPL' });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Internal server error', error: 'Database error' });
    });

    it('should throw an error if no criteria are provided', async () => {
    
      jest.setTimeout(10000); 
  
      const response = await request(app).get('/assets');
      
      
      expect(response.status).toBe(400);
      
     
      expect(response.body.message).toBe('Debe proporcionar al menos un criterio de búsqueda: ticker o nombre.');
    });
    
    
  });
});
