import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, HttpHealthIndicator, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { DogHealthIndicator } from './dog-health';

@Controller('health-check')
export class HealthCheckController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: TypeOrmHealthIndicator,
    private dog: DogHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  async check() {
    const result = await this.health.check([
      // () => this.http.pingCheck('cnaws-gavia', 'http://139.150.80.194/')
      () => this.http.pingCheck('nestjs_docs', 'https://docs.nestjs.com'),
      () => this.db.pingCheck('database'),
      () => this.dog.isHealth('dog'),
    ]);

    // console.log(result);
    const { status, info, error, details } = { ...result };
    // console.log(info);

    // type userKeyType = keyof typeof info;

    Object.keys(info).forEach(
      (key) => {
        console.log(info[key]);
      }
    )
    // console.log(info.nestjs_docs);
    // console.log(info.database);
    // console.log(info.dog);
  //   console.log(_info);
  }

  @Get('/db')
  @HealthCheck()
  checkDB() {
    return this.health.check([
      () => this.db.pingCheck('database'),
    ])
  }
}
