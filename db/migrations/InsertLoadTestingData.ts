import { faker } from '@faker-js/faker';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertMultipleDataSample1667831234567
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const countries = this.generateUniqueCountries(100);
    const manufacturers = this.generateUniqueManufacturers(100);
    console.log(
      `Countries: ${countries.length}, Manufacturers: ${manufacturers.length}`,
    );
    for (const manufacturer of manufacturers) {
      const productCode = faker.number
        .int({ min: 10001, max: 999999999999999 })
        .toString();
      for (const country of countries) {
        const price = faker.commerce.price({ min: 100, max: 1000 });

        await queryRunner.query(`
            INSERT INTO products (productcode, location, productdesc, price)
            VALUES ('${productCode}', '${country}', '${manufacturer}', ${price})
            `);
      }
    }
    console.log(
      `Countries: ${countries.length}, Manufacturers: ${manufacturers.length}`,
    );
  }

  private generateUniqueManufacturers(count: number): string[] {
    const manufacturers = new Set<string>();
    const maxAttempts = count * 10; // Safeguard to prevent endless loop
    let attempts = 0;

    while (manufacturers.size < count && attempts < maxAttempts) {
      const manufacturer = faker.vehicle.manufacturer().replace(/'/g, '');
      manufacturers.add(manufacturer);
      attempts++;
    }
    return Array.from(manufacturers);
  }

  private generateUniqueCountries(count: number): string[] {
    const countries = new Set<string>();
    const maxAttempts = count * 10; // Safeguard to prevent endless loop
    let attempts = 0;

    while (countries.size < count && attempts < maxAttempts) {
      const country = faker.location.country().slice(0, 50).replace(/'/g, '');
      countries.add(country);
      attempts++;
    }

    return Array.from(countries);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Rollback: Delete the seeded data
    await queryRunner.query(`DELETE FROM products`);
  }
}
