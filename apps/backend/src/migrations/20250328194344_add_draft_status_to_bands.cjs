exports.up = (knex) => knex.schema.withSchema(knex.client.config.migrations.schemaName)
      .table('bands_new', table => {
        table.boolean('is_draft').defaultTo(true);
        table.jsonb('completion_status').defaultTo('{}');
      });
  
  exports.down = (knex) => knex.schema.withSchema(knex.client.config.migrations.schemaName)
      .table('bands_new', table => {
        table.dropColumn('completion_status');
        table.dropColumn('is_draft');
      });
