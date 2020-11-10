import { Controller, Get } from "@nestjs/common";
import {
    DNSHealthIndicator,
    HealthCheck,
    HealthCheckResult,
    HealthCheckService,
    HealthIndicatorResult,
} from "@nestjs/terminus";
import { HealthService } from "@routers/health/health.service";
import { APIRes } from "api-types";

@Controller("health")
export class HealthController {
    constructor(
        private readonly health: HealthCheckService,
        private readonly dns: DNSHealthIndicator,
        private readonly healthService: HealthService,
    ) {}
    @Get("ping")
    public returnPing(): APIRes<null> {
        return this.healthService.returnPing();
    }
    @Get()
    @HealthCheck()
    public check(): Promise<HealthCheckResult> {
        return this.health.check([
            (): Promise<HealthIndicatorResult> =>
                this.dns.pingCheck("google", "https://google.com"),
        ]);
    }
}
