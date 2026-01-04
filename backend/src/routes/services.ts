import express, { Request, Response } from 'express';
import { services } from '../config/services';

const router = express.Router();

// Get all services
router.get('/', (req: Request, res: Response) => {
  res.json({ services });
});

// Get popular services
router.get('/popular', (req: Request, res: Response) => {
  const popularServices = services.filter(s => s.popular);
  res.json({ services: popularServices });
});

// Get service by ID
router.get('/:id', (req: Request, res: Response) => {
  const service = services.find(s => s.id === req.params.id);
  
  if (!service) {
    return res.status(404).json({ error: 'Service not found' });
  }

  res.json({ service });
});

// Get price estimate
router.get('/:id/estimate', (req: Request, res: Response) => {
  const service = services.find(s => s.id === req.params.id);
  
  if (!service) {
    return res.status(404).json({ error: 'Service not found' });
  }

  const { vehicleYear } = req.query;
  let estimatedPrice = service.basePrice;
  const priceModifiers: { reason: string; modifier: string }[] = [];

  if (vehicleYear) {
    const year = parseInt(vehicleYear as string);
    if (year >= 2020) {
      estimatedPrice *= 1.15;
      priceModifiers.push({ reason: 'Newer vehicle', modifier: '+15%' });
    } else if (year < 2010) {
      estimatedPrice *= 0.9;
      priceModifiers.push({ reason: 'Older vehicle', modifier: '-10%' });
    }
  }

  res.json({
    service: { id: service.id, name: service.name },
    estimate: {
      basePrice: service.basePrice,
      estimatedPrice: Math.round(estimatedPrice * 100) / 100,
      priceModifiers,
      estimatedDuration: service.estimatedDuration,
      note: 'Final price may vary. Free quote available.'
    }
  });
});

// Get services by category
router.get('/category/:category', (req: Request, res: Response) => {
  const categoryServices = services.filter(s => s.category === req.params.category);
  
  if (categoryServices.length === 0) {
    return res.status(404).json({ error: 'No services found' });
  }

  res.json({ services: categoryServices });
});

export default router;
