// server/services/truckService.js
import db from '../db/index.js';

export const createTruck = async (truckData) => {
  const {
    registration_plate, brand, model, vin, production_year,
    type_of_truck, total_weight, pallet_capacity, max_payload_kg, is_active
  } = truckData;

  const sql = `
    INSERT INTO trucks (
      registration_plate, brand, model, vin, production_year, type_of_truck, total_weight, pallet_capacity, max_payload_kg, is_active
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *
  `;
  try {
    const { rows } = await db.query(sql, [
      registration_plate, brand, model, vin, production_year, type_of_truck, total_weight, pallet_capacity, max_payload_kg, is_active
    ]);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

export const findTrucksByCompany = async () => {
  const { rows } = await db.query('SELECT * FROM trucks WHERE is_deleted = FALSE ORDER BY brand, model');
  return rows;
};

export const updateTruck = async (truckId, truckData) => {
  const {
    registration_plate, brand, model, vin, production_year,
    type_of_truck, total_weight, pallet_capacity, max_payload_kg, is_active
  } = truckData;
  const sql = `
    UPDATE trucks SET
      registration_plate = $1, brand = $2, model = $3, vin = $4, production_year = $5,
      type_of_truck = $6, total_weight = $7, pallet_capacity = $8, max_payload_kg = $9, is_active = $10
    WHERE id = $11 RETURNING *
  `;
  const { rows } = await db.query(sql, [registration_plate, brand, model, vin, production_year, type_of_truck, total_weight, pallet_capacity, max_payload_kg, is_active, truckId]);
  return rows.length > 0 ? rows[0] : null;
};

export const deleteTruck = async (truckId) => {
  const result = await db.query('UPDATE trucks SET is_deleted = TRUE WHERE id = $1', [truckId]);
  return result.rowCount;
};

export const toInt = (value) => {
  const num = parseInt(value, 10);
  return isNaN(num) ? null : num;
};

export const importTrucks = async (trucksData) => {
  return db.withTransaction(async (client) => {
    const importedTrucks = [];
    const sql = `
      INSERT INTO trucks (
        registration_plate, brand, model, vin, production_year, 
        type_of_truck, total_weight, pallet_capacity, max_payload_kg, is_active
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (registration_plate) DO UPDATE SET
        brand = EXCLUDED.brand,
        model = EXCLUDED.model,
        vin = EXCLUDED.vin,
        production_year = EXCLUDED.production_year,
        type_of_truck = EXCLUDED.type_of_truck,
        total_weight = EXCLUDED.total_weight,
        pallet_capacity = EXCLUDED.pallet_capacity,
        max_payload_kg = EXCLUDED.max_payload_kg,
        is_active = EXCLUDED.is_active,
        updated_at = NOW()
      RETURNING id;
    `;

    for (const truck of trucksData) {
      if (!truck.registration_plate) continue; // Pomiń wiersze bez numeru rejestracyjnego

      const result = await client.query(sql, [
        truck.registration_plate,
        truck.brand,
        truck.model || '',
        truck.vin || null,
        toInt(truck.production_year),
        truck.type_of_truck?.toLowerCase() === 'rigid' ? 'rigid' : 'tractor',
        toInt(truck.total_weight),
        toInt(truck.pallet_capacity),
        toInt(truck.max_payload_kg),
        truck.is_active !== false // Domyślnie true, chyba że jawnie ustawiono na false
      ]);

      if (result.rows.length > 0) {
        importedTrucks.push(result.rows[0]);
      }
    }

    return { importedCount: importedTrucks.length, importedIds: importedTrucks.map(t => t.id) };
  });
};