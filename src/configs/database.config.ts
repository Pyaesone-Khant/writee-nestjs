import { registerAs } from "@nestjs/config";

export default registerAs('database', () => ({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) ?? 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    synchronize: process.env.DB_SYNC === "true" ? true : false,
    autoLoadEntities: process.env.DB_AUTO_LOAD_ENTITIES === "true" ? true : false,
}))