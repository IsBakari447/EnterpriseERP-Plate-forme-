import "reflect-metadata";
import { RequestMethod } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ApiExceptionFilter } from "./common/filters/api-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = Number(process.env.PORT ?? 4000);
  const corsOrigins = (process.env.CORS_ORIGIN ?? "http://localhost:3000,http://127.0.0.1:3000")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors({
    origin: (origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) => {
      if (!origin || corsOrigins.includes("*") || corsOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      const isLocalDevOrigin =
        /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0|[\w-]+)(:\d+)?$/i.test(origin) ||
        /^https?:\/\/(10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3})(:\d+)?$/i.test(origin);

      callback(null, isLocalDevOrigin);
    },
    credentials: true,
  });
  app.setGlobalPrefix("api", {
    exclude: [
      { path: "", method: RequestMethod.GET },
      { path: "health", method: RequestMethod.GET },
      { path: "health/ready", method: RequestMethod.GET },
      { path: "modules", method: RequestMethod.GET },
      { path: "pricing", method: RequestMethod.GET },
      { path: "roadmap", method: RequestMethod.GET },
      { path: "security", method: RequestMethod.GET },
      { path: "integrations", method: RequestMethod.GET },
      { path: "onboarding", method: RequestMethod.GET },
      { path: "competitive-position", method: RequestMethod.GET },
      { path: "demo-script", method: RequestMethod.GET },
      { path: "roi-model", method: RequestMethod.GET },
      { path: "faq", method: RequestMethod.GET },
      { path: "platform-status", method: RequestMethod.GET },
      { path: "login", method: RequestMethod.GET },
      { path: "register", method: RequestMethod.GET },
      { path: "dashboard", method: RequestMethod.GET },
    ],
  });
  app.useGlobalFilters(new ApiExceptionFilter());

  await app.listen(port);
  console.log(`EnterpriseERP API running on http://localhost:${port}`);
}

bootstrap();
