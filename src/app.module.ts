import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserHttpModule } from './user/user-http.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'users_api_nestjs',
      entities: [],
      synchronize: true,
      autoLoadEntities: true,
    }),
    UserHttpModule,
    AuthModule,
  ],
})
export class AppModule {}
