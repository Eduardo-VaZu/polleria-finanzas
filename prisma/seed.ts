import "dotenv/config";
import { PrismaClient, UserRole } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required for seeding.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({
  adapter,
  log: ["error"],
});

const PURCHASE_CATEGORIES = [
  "Pollo",
  "Papa",
  "Ensalada",
  "Aceites",
  "Aderezo de pollo",
  "Condimentos",
  "Cremas y salsas",
  "Envases y descartables",
  "Bebidas",
  "Coccion y energia",
  "Limpieza e higiene",
] as const;

const EXPENSE_CATEGORIES = [
  "Local",
  "Servicios",
  "Personal",
  "Marketing",
  "Mantenimiento",
  "Comisiones",
  "Limpieza",
  "Otros",
] as const;

const SALE_PRODUCTS = [
  { name: "1 pollo", defaultPrice: "0.00", category: "Pollo" },
  { name: "1/2 pollo", defaultPrice: "0.00", category: "Pollo" },
  { name: "1/4 pollo", defaultPrice: "0.00", category: "Pollo" },
  { name: "Combo familiar", defaultPrice: "0.00", category: "Combo" },
  { name: "Gaseosa personal", defaultPrice: "0.00", category: "Bebidas" },
  { name: "Gaseosa 1.5L", defaultPrice: "0.00", category: "Bebidas" },
  { name: "Agua", defaultPrice: "0.00", category: "Bebidas" },
  { name: "Adicional de papas", defaultPrice: "0.00", category: "Adicional" },
  { name: "Delivery", defaultPrice: "0.00", category: "Servicio" },
] as const;

const PURCHASE_PRODUCTS = [
  { name: "Pollo entero", unit: "kg", category: "Pollo" },
  { name: "Papa para fritura", unit: "kg", category: "Papa" },
  { name: "Aceite de frituras", unit: "lt", category: "Aceites" },
  { name: "Aceite de crema", unit: "lt", category: "Aceites" },
  { name: "Lechuga", unit: "unidad", category: "Ensalada" },
  { name: "Pepino", unit: "unidad", category: "Ensalada" },
  { name: "Tomate", unit: "kg", category: "Ensalada" },
  { name: "Sal", unit: "kg", category: "Condimentos" },
  { name: "Condimentos varios", unit: "kg", category: "Condimentos" },
  { name: "Aderezo de pollo", unit: "kg", category: "Aderezo de pollo" },
  { name: "Mayonesa", unit: "lt", category: "Cremas y salsas" },
  { name: "Aji", unit: "kg", category: "Cremas y salsas" },
  { name: "Ketchup", unit: "lt", category: "Cremas y salsas" },
  { name: "Taper para pollo", unit: "unidad", category: "Envases y descartables" },
  { name: "Taper para papas", unit: "unidad", category: "Envases y descartables" },
  { name: "Pote para crema", unit: "unidad", category: "Envases y descartables" },
  { name: "Bolsa", unit: "unidad", category: "Envases y descartables" },
  { name: "Servilletas", unit: "paquete", category: "Envases y descartables" },
  { name: "Gaseosa personal", unit: "unidad", category: "Bebidas" },
  { name: "Gaseosa 1.5L", unit: "unidad", category: "Bebidas" },
  { name: "Agua", unit: "unidad", category: "Bebidas" },
  { name: "Carbon", unit: "kg", category: "Coccion y energia" },
  { name: "Gas", unit: "balon", category: "Coccion y energia" },
  { name: "Detergente", unit: "lt", category: "Limpieza e higiene" },
  { name: "Lejia", unit: "lt", category: "Limpieza e higiene" },
] as const;

async function seedAdminUser(): Promise<void> {
  const passwordHash = await bcrypt.hash("admin123456", Number(process.env.BCRYPT_SALT_ROUNDS ?? 10));

  await prisma.user.upsert({
    where: { email: "admin@polleria.com" },
    update: {
      name: "Administrador",
      role: UserRole.ADMIN,
      isActive: true,
      passwordHash,
    },
    create: {
      name: "Administrador",
      email: "admin@polleria.com",
      role: UserRole.ADMIN,
      isActive: true,
      passwordHash,
    },
  });
}

async function seedPurchaseCategories(): Promise<Map<string, string>> {
  const categoryIdByName = new Map<string, string>();

  for (const name of PURCHASE_CATEGORIES) {
    const category = await prisma.purchaseCategory.upsert({
      where: { name },
      update: { isActive: true },
      create: { name, isActive: true },
      select: { id: true, name: true },
    });

    categoryIdByName.set(category.name, category.id);
  }

  return categoryIdByName;
}

async function seedExpenseCategories(): Promise<void> {
  for (const name of EXPENSE_CATEGORIES) {
    await prisma.expenseCategory.upsert({
      where: { name },
      update: { isActive: true },
      create: { name, isActive: true },
    });
  }
}

async function seedSaleProducts(): Promise<void> {
  for (const product of SALE_PRODUCTS) {
    const existing = await prisma.saleProduct.findFirst({
      where: { name: product.name },
      select: { id: true },
    });

    if (existing) {
      await prisma.saleProduct.update({
        where: { id: existing.id },
        data: {
          category: product.category,
          isActive: true,
        },
      });
      continue;
    }

    await prisma.saleProduct.create({
      data: {
        name: product.name,
        defaultPrice: product.defaultPrice,
        category: product.category,
        isActive: true,
      },
    });
  }
}

async function seedPurchaseProducts(categoryIdByName: Map<string, string>): Promise<void> {
  for (const product of PURCHASE_PRODUCTS) {
    const categoryId = categoryIdByName.get(product.category);
    if (!categoryId) {
      throw new Error(`Missing category mapping for purchase product: ${product.name}`);
    }

    const existing = await prisma.purchaseProduct.findFirst({
      where: { name: product.name },
      select: { id: true },
    });

    if (existing) {
      await prisma.purchaseProduct.update({
        where: { id: existing.id },
        data: {
          unit: product.unit,
          categoryId,
          isActive: true,
        },
      });
      continue;
    }

    await prisma.purchaseProduct.create({
      data: {
        name: product.name,
        unit: product.unit,
        categoryId,
        isActive: true,
      },
    });
  }
}

async function main(): Promise<void> {
  await seedAdminUser();
  const categoryIdByName = await seedPurchaseCategories();
  await seedExpenseCategories();
  await seedSaleProducts();
  await seedPurchaseProducts(categoryIdByName);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Seed completed successfully.");
  })
  .catch(async (error: unknown) => {
    console.error("Seed failed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });
