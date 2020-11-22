import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import { HealthController } from "@routers/health/health.controller";
import { HealthService } from "@routers/health/health.service";

@Module({
    imports: [TerminusModule],
    controllers: [HealthController],
    providers: [HealthService],
})
export class HealthModule {}
