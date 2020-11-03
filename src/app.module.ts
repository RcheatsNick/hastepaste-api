import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AppController } from "./app.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RateLimiterModule, RateLimiterGuard } from "nestjs-rate-limit";
import { HealthModule } from "./routers/health/health.module";
import { PingModule } from "./routers/ping/ping.module";
import { AuthModule } from "./routers/auth/auth.module";
import CONFIG from "./config";

@Module({
    imports: [
        RateLimiterModule.forRoot({
            points: 100,
            duration: 5,
            keyPrefix: "global",
        }),
        TypeOrmModule.forRoot({
            type: "mongodb",
            url: CONFIG.MONGODB_URI,
            synchronize: true,
            logger: "debug",
            useUnifiedTopology: true,
            useNewUrlParser: true,
            autoLoadEntities: true,
        }),
        HealthModule,
        PingModule,
        AuthModule
    ],
    controllers: [AppController],
    providers: [{ provide: APP_GUARD, useClass: RateLimiterGuard }],
})
export class AppModule {}
