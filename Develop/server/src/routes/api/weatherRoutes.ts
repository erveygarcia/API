import { Router, type Request, type Response } from 'express';
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

const router = Router();

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  try {
    const { city } = req.body;
    if (!city) {
      return res.status(400).json({ error: 'City is required' });
    }

    // TODO: GET weather data from city name
    const weatherData = await WeatherService.getWeatherForCity(city);

    // TODO: save city to search history
    await HistoryService.addCity(city);

    return res.status(200).json(weatherData);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error while retrieving weather data' });
  }
});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const history = await HistoryService.getCities();
    return res.status(200).json(history);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error while getting history' });
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const success = await HistoryService.removeCity(id);

    if (!success) {
      return res.status(404).json({ error: 'City not found in history' });
    }

    return res.status(200).json({ message: 'City removed from history' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error while deleting city from history' });
  }
});

export default router;
