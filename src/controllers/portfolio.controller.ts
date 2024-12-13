import express, { Request, Response } from 'express';
import { getPortfolioData , getAssetsByCriteria } from "../services/portfolio.service"
import { CustomError } from "../errors/CustomError";


/**
 * Controlador para obtener el portfolio del usuario.
 */
export const getPortfolio = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = Number(req.params.userId); 
    const portfolio = await getPortfolioData(userId); 

    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" }); 
    }

    return res.status(200).json(portfolio); 
  } catch (error) {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message }); 
    }

    return res.status(500).json({ message: "Internal server error" });
  }
};



export const searchAssets = async (req: Request, res: Response): Promise<Response> => { 
  try {
    const { ticker, name } = req.query;

   
    if (!ticker && !name) {
      return res.status(400).json({
        message: 'Debe proporcionar al menos un criterio de búsqueda: ticker o nombre.',
      }); 
    }

  
    const assets = await getAssetsByCriteria(ticker as string, name as string);

    
    if (assets.length === 0) {
      return res.status(404).json({
        message: 'No assets found matching the criteria.',
      }); 
    }

    
    return res.status(200).json(assets);
  } catch (error) {
    console.error('Search Assets Error:', error);
    return res.status(500).json({
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};





  

