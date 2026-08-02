import { SetMetadata } from "@nestjs/common";
import type { EnterprisePermission } from "./permissions";

export const PERMISSIONS_KEY = "permissions";

export function Permissions(...permissions: EnterprisePermission[]) {
  return SetMetadata(PERMISSIONS_KEY, permissions);
}
