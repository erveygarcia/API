import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// TODO: Fix '__dirname is not defined' issue for ES Modules
import { fileURLToPath } from 'url';

// Remove duplicate import
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fix HISTORY_FILE path
const HISTORY_FILE = path.join(__dirname, '..', '..', 'db', 'searchHistory.json');

// TODO: Define a City class with name and id properties
class City {
  constructor(public id: string, public name: string) {}
}

// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read(): Promise<City[]> {
    try {
      const data = await fs.readFile(HISTORY_FILE, 'utf-8');
      return JSON.parse(data) as City[];
    } catch (error) {
      return []; // If the file doesn't exist, return an empty array
    }
  }

  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]): Promise<void> {
    await fs.writeFile(HISTORY_FILE, JSON.stringify(cities, null, 2));
  }

  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities(): Promise<City[]> {
    return await this.read();
  }

  // TODO: Define an addCity method that adds a city to the searchHistory.json file
  async addCity(cityName: string): Promise<City> {
    const cities = await this.read();
    const newCity = new City(uuidv4(), cityName);
    cities.push(newCity);
    await this.write(cities);
    return newCity;
  }

  // * BONUS TODO: Fix typo in length property (lenght → length)
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string): Promise<boolean> {
    const cities = await this.read();
    const newCities = cities.filter(city => city.id !== id);
    if (newCities.length === cities.length) return false; // City not found
    await this.write(newCities);
    return true;
  }
}

export default new HistoryService();
