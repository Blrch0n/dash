const fileMigrationService = require("./services/fileMigrationService");

async function testMigration() {
  try {
    console.log("🔍 Checking migration status...");
    const status = fileMigrationService.getMigrationStatus();
    console.log("Migration Status:", JSON.stringify(status, null, 2));

    if (status.remaining > 0) {
      console.log(`\n📦 Migrating ${status.remaining} files...`);
      const result = await fileMigrationService.migrateUploadedFiles();
      console.log("Migration Result:", JSON.stringify(result, null, 2));
    } else {
      console.log("✅ No files to migrate or all files already migrated");
    }
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
  }
}

testMigration();
