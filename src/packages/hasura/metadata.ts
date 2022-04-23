// TODO remove dependency to axios
import axios from 'axios';

/**
 * https://hasura.io/docs/latest/graphql/core/api-reference/schema-metadata-api/relationship.html
 * Here we are using the schema-metadata-api to track the relationships between auth tables
 **/

interface Table {
  name: string;
  schema: string;
}

interface TableArgs {
  source?: string;
  table: Table;
}

type TableConfig = {
  custom_name?: string;
  identifier?: string;
  custom_root_fields?: {
    select?: string;
    select_by_pk?: string;
    select_aggregate?: string;
    insert?: string;
    insert_one?: string;
    update?: string;
    update_by_pk?: string;
    delete?: string;
    delete_by_pk?: string;
  };
  custom_column_names?: {
    [key: string]: string;
  };
};

type TrackTableArgs = TableArgs & {
  configuration?: TableConfig;
};
type UntrackTableArgs = TableArgs & {
  cascade?: boolean;
};

type TableCustomisationArgs = TableArgs & {
  configuration?: TableConfig;
};

type DropRelationshipArgs = TableArgs & {
  relationship: string;
};

type CreateRelationshipArgs = TableArgs & {
  name: string;
  using: {
    foreign_key_constraint_on:
      | {
          table: Table;
          columns: string[];
        }
      | string[];
  };
};

type Logger = Record<'debug' | 'info' | 'warn' | 'error', (m: string) => void>;

export class HasuraMetadataAdminClient {
  private adminSecret?: string;
  private endpoint: string;
  private logger: Logger;
  constructor({
    endpoint,
    adminSecret,
    logger = console,
  }: {
    endpoint: string;
    adminSecret: string;
    logger?: Logger;
  }) {
    this.endpoint = endpoint;
    this.adminSecret = adminSecret;
    this.logger = logger;
  }
  private async runMetadataRequest(args: { type: string; args: {} }) {
    await axios.post(`${this.endpoint}/v1/metadata`, args, {
      headers: {
        'x-hasura-admin-secret': this.adminSecret,
      },
    });
  }

  async reload(
    args: {
      reload_remote_schemas?: boolean;
      reload_sources?: boolean;
      recreate_event_triggers?: boolean;
    } = {}
  ) {
    await this.runMetadataRequest({
      type: 'reload_metadata',
      args,
    });
  }

  // https://hasura.io/docs/latest/graphql/core/api-reference/schema-metadata-api/table-view.html#track-table-v2
  async trackTable(args: TrackTableArgs) {
    try {
      await this.runMetadataRequest({
        type: 'pg_track_table',
        args,
      });
    } catch (error: any) {
      if (error.response.data.code !== 'already-tracked') {
        this.logger.error(error);
        throw new Error(`Error tracking table ${args.table.name}`);
      } else {
        this.logger.debug(`Table ${args.table.name} already tracked`);
      }
    }
  }

  // https://hasura.io/docs/latest/graphql/core/api-reference/schema-metadata-api/table-view.html#untrack-table
  async untrackTable(args: UntrackTableArgs) {
    try {
      await this.runMetadataRequest({
        type: 'pg_untrack_table',
        args,
      });
    } catch (error: any) {
      this.logger.error(error);
      throw new Error(`Error untracking table ${args.table.name}`);
    }
  }

  async setTableCustomization(args: TableCustomisationArgs) {
    this.logger.info(`Set table customization for ${args.table.name}`);

    try {
      await this.runMetadataRequest({
        type: 'pg_set_table_customization',
        args,
      });
    } catch (error: any) {
      this.logger.error(error);
      throw new Error(
        'error setting customization for table ' + args.table.name
      );
    }
  }

  async createObjectRelationship(args: CreateRelationshipArgs) {
    this.logger.info(
      `Set object relationship ${args.name} for ${args.table.name}`
    );
    try {
      await this.runMetadataRequest({
        type: 'pg_create_object_relationship',
        args,
      });
    } catch (error: any) {
      if (error.response.data.code !== 'already-exists') {
        throw new Error(
          `Error creating object relationship for table ${args.table.name}`
        );
      } else {
        this.logger.debug(
          `Object relationship ${args.name} on table ${args.table.name} is already created`
        );
      }
    }
  }

  async createArrayRelationship(args: CreateRelationshipArgs) {
    this.logger.info(
      `Create array relationship ${args.name} for ${args.table.name}`
    );
    try {
      await this.runMetadataRequest({
        type: 'pg_create_array_relationship',
        args,
      });
    } catch (error: any) {
      if (error.response.data.code !== 'already-exists') {
        throw new Error(
          `Error creating array relationship for table ${args.table.name}`
        );
      }
      this.logger.debug(
        `Array relationship ${args.name} on table ${args.table.name} is already created`
      );
    }
  }

  async dropRelationship(args: DropRelationshipArgs) {
    this.logger.info(
      `Drop relationship ${args.relationship} for ${args.table.name}`
    );
    try {
      await this.runMetadataRequest({
        type: 'pg_drop_relationship',
        args,
      });
    } catch (error: any) {
      if (error.response.data.code !== 'already-exists') {
        throw new Error(
          `Error dropping relationship for table ${args.table.name}`
        );
      } else {
        this.logger.debug(
          `Object relationship ${args.relationship} on table ${args.table.name} is already created`
        );
      }
    }
  }
}
