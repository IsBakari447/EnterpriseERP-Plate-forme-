import "reflect-metadata";
import { RequestMethod } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import helmet from "helmet";
import { AppModule } from "./app.module";
import { ApiExceptionFilter } from "./common/filters/api-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = Number(process.env.PORT ?? 4000);
  const corsOrigins = (process.env.CORS_ORIGIN ?? "http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000,https://enterpriseerp-web.onrender.com")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.getHttpAdapter().getInstance().set("trust proxy", 1);
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
    })
  );
  app.enableCors({
    origin: (origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) => {
      if (!origin || corsOrigins.includes("*") || corsOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      const isLocalDevOrigin =
        /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0|[\w-]+)(:\d+)?$/i.test(origin) ||
        /^https?:\/\/(10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3})(:\d+)?$/i.test(origin);
      const isEnterpriseErpRenderOrigin = /^https:\/\/enterpriseerp-[\w-]+\.onrender\.com$/i.test(origin);

      callback(null, isLocalDevOrigin || isEnterpriseErpRenderOrigin);
    },
    credentials: true,
  });
  app.setGlobalPrefix("api", {
    exclude: [
      { path: "", method: RequestMethod.GET },
      { path: "health", method: RequestMethod.GET },
      { path: "health/ready", method: RequestMethod.GET },
    ],
  });
  app.useGlobalFilters(new ApiExceptionFilter());

  await app.listen(port);
  console.log(`EnterpriseERP API running on http://localhost:${port}`);
}

bootstrap();
