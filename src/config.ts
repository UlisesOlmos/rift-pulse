import { registerAs } from '@nestjs/config';


export default registerAs('config', () => {
  return {
    pg: {
      dbName: process.env.DB_NAME,
      port: parseInt(process.env.DB_PORT ?? "5432"),
      password: process.env.DB_PASSWORD,
      user: process.env.DB_USER,
      host: process.env.DB_HOST || "localhost",
    }
  }
})