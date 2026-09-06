import { SetMetadata } from "@nestjs/common";

export const TENANT_OPTIONAL_KEY = "tenantOptional";

export function TenantOptional() {
  return SetMetadata(TENANT_OPTIONAL_KEY, true);
}
