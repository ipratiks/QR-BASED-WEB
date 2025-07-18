-- CreateTable
CREATE TABLE "profiles" (
    "id" UUID NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'DOCTOR',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);
