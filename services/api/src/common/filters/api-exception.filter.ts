import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { randomUUID } from "crypto";

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ApiExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<{
      status: (code: number) => { json: (body: unknown) => void };
    }>();
    const request = context.getRequest<{ method?: string; url?: string }>();
    const isHttpException = exception instanceof HttpException;
    const status = isHttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const details = isHttpException ? exception.getResponse() : "Internal server error";
    const requestId = randomUUID();

    if (status >= 500) {
      this.logger.error(`[${requestId}] ${request.method ?? "HTTP"} ${request.url ?? ""} failed`, exception as Error);
    }

    if ("setHeader" in response && typeof response.setHeader === "function") {
      response.setHeader("x-request-id", requestId);
    }

    response.status(status).json({
      statusCode: status,
      path: request.url,
      timestamp: new Date().toISOString(),
      requestId,
      error: details,
    });
  }
}
