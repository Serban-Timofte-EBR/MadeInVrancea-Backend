import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import configuration from './config/configuration';
import { buildDatabaseConfig } from './config/database.config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { BusinessesModule } from './modules/businesses/businesses.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { LocationsModule } from './modules/locations/locations.module';
import { LogsModule } from './modules/logs/logs.module';
import { MapModule } from './modules/map/map.module';
import { MediaModule } from './modules/media/media.module';
import { RolesModule } from './modules/roles/roles.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: buildDatabaseConfig,
    }),
    AuthModule,
    UsersModule,
    RolesModule,
    CategoriesModule,
    BusinessesModule,
    LocationsModule,
    MediaModule,
    MapModule,
    LogsModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Every route requires a valid JWT unless annotated with @Public().
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    // Role checks run after authentication for routes annotated with @Roles().
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
