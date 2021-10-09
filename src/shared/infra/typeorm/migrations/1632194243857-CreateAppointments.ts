import {MigrationInterface, QueryRunner, Table} from "typeorm";

export default class CreateAppointments1632194243857 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.createTable(
        new Table({
          name: 'appointments',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary:true,
              generationStrategy: 'uuid',
              default: 'uuid_generate_v4()',
              isNullable:true
            },
            {
              name: 'provider',
              type: 'varchar',
            },
            {
              name: 'date',
              type: 'timestamp with time zone',
            },
            {
              name: 'created_at',
              type: 'timestamp',
              default: "now()"
            },
            {
              name: 'updated_at',
              type: 'timestamp',
              default: "now()"
            },
          ]
        })
      );
    }
    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable('appointments')
    }

}