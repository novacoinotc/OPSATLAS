import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@opsatlas.mx";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log("Admin user already exists, skipping seed.");
    return;
  }

  const hashedPassword = await bcrypt.hash("admin123", 12);

  await prisma.user.create({
    data: {
      email,
      name: "Admin",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("Admin user created:");
  console.log("  Email: admin@opsatlas.mx");
  console.log("  Password: admin123");
  console.log("  IMPORTANT: Change this password after first login!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
