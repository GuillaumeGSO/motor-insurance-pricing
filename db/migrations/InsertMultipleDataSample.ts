import { faker } from '@faker-js/faker';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedProductsData1515769694460 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const aseanCountries = [
      'Brunei',
      'Cambodia',
      'Indonesia',
      'Laos',
      'Malaysia',
      'Myanmar',
      'Philippines',
      'Singapore',
      'Thailand',
      'Vietnam',
    ];

    // Use a Map for productCode to vehicleType
    const productCodeToVehicleType = new Map<number, string>([
      [1000, 'Sedan'],
      [2000, 'SUV'],
      [3000, 'Hatchback'],
      [4000, 'Coupe'],
      [5000, 'Convertible'],
      [6000, 'Wagon'],
      [7000, 'Van'],
      [8000, 'Pickup'],
      [9000, 'Minivan'],
    ]);

    // Iterate over the Map
    for (const [productCode, vehicleType] of productCodeToVehicleType) {
      const values = [];
      for (const location of aseanCountries) {
        const price = faker.number.int({ min: 100, max: 1000 });
        values.push(
          `('${productCode}', '${location}', '${vehicleType}', ${price})`,
        );
      }
      // Perform bulk insert
      await queryRunner.query(`
            INSERT INTO products (productcode, location, productdesc, price)
            VALUES ${values.join(',')}
        `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Rollback: Delete the seeded data
    await queryRunner.query(`DELETE FROM products`);
  }
}
