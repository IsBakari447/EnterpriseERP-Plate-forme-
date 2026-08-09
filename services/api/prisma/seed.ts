import { PrismaClient, UserRole } from "@prisma/client";
import { enterprisePermissions, enterpriseRoles, rolePermissions } from "../src/common/security/permissions";

const prisma = new PrismaClient();

function splitPermission(permission: string) {
  const [module, action = "read"] = permission.split(".");
  return { module, action };
}

async function upsertRole(role: UserRole) {
  const existing = await prisma.role.findFirst({
    where: {
      companyId: null,
      key: role,
    },
  });

  if (existing) {
    return prisma.role.update({
      where: { id: existing.id },
      data: {
        name: role.replace(/_/g, " "),
        system: true,
      },
    });
  }

  return prisma.role.create({
    data: {
      companyId: null,
      key: role,
      name: role.replace(/_/g, " "),
      system: true,
    },
  });
}

async function main() {
  for (const permission of enterprisePermissions) {
    const { module, action } = splitPermission(permission);

    await prisma.permission.upsert({
      where: { key: permission },
      update: {
        module,
        action,
      },
      create: {
        key: permission,
        module,
        action,
        description: `${module} ${action}`,
      },
    });
  }

  for (const role of enterpriseRoles) {
    const roleRecord = await upsertRole(role as UserRole);
    const permissions = rolePermissions[role];

    for (const permissionKey of permissions) {
      const permission = await prisma.permission.findUniqueOrThrow({
        where: { key: permissionKey },
        select: { id: true },
      });

      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: roleRecord.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: roleRecord.id,
          permissionId: permission.id,
        },
      });
    }
  }

  console.log(`Seeded ${enterprisePermissions.length} permissions and ${enterpriseRoles.length} system roles.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
