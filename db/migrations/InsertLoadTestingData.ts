import { faker } from '@faker-js/faker';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertMultipleDataSample1667831234567
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const numberOfItemsToGenerate = 10000;

    for (let i = 0; i < numberOfItemsToGenerate; i++) {
      const productCode = faker.number
        .int({ min: 10001, max: 999999999999999 })
        .toString();
      const location = faker.location.country().slice(0, 50).replace(/'/g, '');
      const manufacturer = faker.vehicle.manufacturer().replace(/'/g, '');
      const price = faker.commerce.price({ min: 100, max: 1000 });

      await queryRunner.query(`
        INSERT INTO products (productcode, location, productdesc, price)
        VALUES ('${productCode}', '${location}', '${manufacturer}', ${price})
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Rollback: Delete the seeded data
    await queryRunner.query(`DELETE FROM products`);
  }
}
