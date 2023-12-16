-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "description" TEXT,
ADD COLUMN     "img" TEXT;

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'User';
