import { faker } from '@faker-js/faker';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedProductsData1515769694459 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const recordsToInsert = 100; // Number of rows to insert
    const values = [];

    for (let i = 0; i < recordsToInsert; i++) {
      const productCode = faker.string.alphanumeric(10); // Random alphanumeric product ID
      const location = faker.location.city();
      const productDesc = faker.vehicle.model();
      const price = faker.number.int({ min: 100, max: 1000 });

      values.push(
        `('${productCode}', '${location}', '${productDesc}', ${price})`,
      );
    }
    // Perform bulk insert
    await queryRunner.query(`
            INSERT INTO products (productcode, location, productdesc, price)
            VALUES ${values.join(',')}
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Rollback: Delete the seeded data
    await queryRunner.query(`DELETE FROM products`);
  }
}
