exports.up = (knex) => knex.schema.withSchema(knex.client.config.migrations.schemaName)
      .raw(`
        ALTER TABLE ${knex.client.config.migrations.schemaName}.bands_new ALTER COLUMN slug DROP NOT NULL;
      `);
  
  exports.down = (knex) => knex.schema.withSchema(knex.client.config.migrations.schemaName)
      .raw(`
        ALTER TABLE ${knex.client.config.migrations.schemaName}.bands_new ALTER COLUMN slug SET NOT NULL;
      `);

