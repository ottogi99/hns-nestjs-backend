import { DataSource } from "typeorm";

export const MySqlDataSource = new DataSource({
  type: 'mysql',
  host: '192.168.30.90',
  port: 3306,
  username: 'hns',
  password: 'hns',
  database: 'hns_board',
  entities: [__dirname + '/**/entity/*.entity{.ts,.js}'],
  synchronize: false,
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  migrationsRun: false,
  // migrationsTableName: 'migrations',
})
