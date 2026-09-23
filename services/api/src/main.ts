import "reflect-metadata";
import { RequestMethod, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import helmet from "helmet";
import { AppModule } from "./app.module";
import { ApiExceptionFilter } from "./common/filters/api-exception.filter";

type PreflightRequest = {
  headers: {
    origin?: string | string[];
  };
  method?: string;
};

type PreflightResponse = {
  setHeader(name: string, value: string): void;
  status(code: number): PreflightResponse;
  end(): void;
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = Number(process.env.PORT ?? 4000);
  const isProduction = process.env.NODE_ENV === "production";
  const defaultCorsOrigin = isProduction
    ? "https://enterpriseerp-web.onrender.com"
    : "http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000,https://enterpriseerp-web.onrender.com";
  const configuredCorsOrigin = process.env.CORS_ORIGIN ? `${defaultCorsOrigin},${process.env.CORS_ORIGIN}` : defaultCorsOrigin;
  const corsOrigins = configuredCorsOrigin
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  const isAllowedOrigin = (origin: string | undefined) => {
    if (!origin) return true;
    if (corsOrigins.includes(origin)) return true;
    if (isProduction) return false;

    return (
      corsOrigins.includes("*") ||
      /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0|[\w-]+)(:\d+)?$/i.test(origin) ||
      /^https?:\/\/(10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3})(:\d+)?$/i.test(origin)
    );
  };
  const corsMethods = "GET,HEAD,POST,PUT,PATCH,DELETE,OPTIONS";
  const corsHeaders = "Authorization,Content-Type,Accept,X-Requested-With";

  app.getHttpAdapter().getInstance().set("trust proxy", 1);
  app.use((request: PreflightRequest, response: PreflightResponse, next: () => void) => {
    const origin = Array.isArray(request.headers.origin) ? request.headers.origin[0] : request.headers.origin;

    if (isAllowedOrigin(origin)) {
      if (origin) {
        response.setHeader("Access-Control-Allow-Origin", origin);
        response.setHeader("Vary", "Origin");
      }

      response.setHeader("Access-Control-Allow-Credentials", "true");
      response.setHeader("Access-Control-Allow-Methods", corsMethods);
      response.setHeader("Access-Control-Allow-Headers", corsHeaders);
    }

    if (request.method === "OPTIONS") {
      response.status(204).end();
      return;
    }

    next();
  });
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
    })
  );
  app.enableCors({
    origin: (origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) => {
      callback(null, isAllowedOrigin(origin));
    },
    credentials: true,
    methods: corsMethods.split(","),
    allowedHeaders: corsHeaders.split(","),
    optionsSuccessStatus: 204,
  });
  app.setGlobalPrefix("api", {
    exclude: [
      { path: "", method: RequestMethod.GET },
      { path: "health", method: RequestMethod.GET },
      { path: "health", method: RequestMethod.OPTIONS },
      { path: "health/ready", method: RequestMethod.GET },
      { path: "health/ready", method: RequestMethod.OPTIONS },
    ],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );
  app.useGlobalFilters(new ApiExceptionFilter());

  await app.listen(port);
  console.log(`EnterpriseERP API running on http://localhost:${port}`);
}

bootstrap();
