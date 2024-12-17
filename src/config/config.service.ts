import { TypeOrmModuleOptions } from '@nestjs/typeorm';

require('dotenv').config();

class ConfigService {

    constructor(private env: { [k: string]: string | undefined }) { }

    private getValue(key: string, throwOnMissing = true): string {
        const value = this.env[key];
        if (!value && throwOnMissing) {
            throw new Error(`config error - missing env.${key}`);
        }

        return value;
    }

    public ensureValues(keys: string[]) {
        keys.forEach(k => this.getValue(k, true));
        return this;
    }

    public getPort() {
        return this.getValue('PORT', true);
    }

    public isProduction() {
        const mode = this.getValue('MODE', false);
        return mode != 'DEV';
    }

    public getTypeOrmConfig(forJsonFile = false): TypeOrmModuleOptions {
        const migrationsPath =
            'src/db/migrations/*.' + (forJsonFile ? 'ts' : 'js')
        console.log(migrationsPath)
        return {
            type: 'postgres',

            host: this.getValue('POSTGRES_HOST'),
            port: parseInt(this.getValue('POSTGRES_PORT')),
            username: this.getValue('POSTGRES_USER'),
            password: this.getValue('POSTGRES_PASSWORD'),
            database: this.getValue('POSTGRES_DATABASE'),

            synchronize: false,
            entities: ['**/*.entity.js'],
            migrationsTableName: 'db_migrations',
            migrations: [migrationsPath],
            // cli: {
            //     migrationsDir: 'src/db/migrations',
            //     entitiesDir: 'src/db/models',
            // },
            ssl: this.isProduction(),
        };
    }

}

const configService = new ConfigService(process.env)
    .ensureValues([
        'POSTGRES_HOST',
        'POSTGRES_PORT',
        'POSTGRES_USER',
        'POSTGRES_PASSWORD',
        'POSTGRES_DATABASE'
    ]);

export { configService };