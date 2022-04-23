import { HasuraMetadataAdminClient } from './metadata';

type Logger = Record<'debug' | 'info' | 'warn' | 'error', (m: string) => void>;

export class HasuraAdminClient {
  public readonly metadata: HasuraMetadataAdminClient;
  constructor({
    endpoint,
    adminSecret,
    logger = console,
  }: {
    endpoint: string;
    adminSecret: string;
    logger?: Logger;
  }) {
    this.metadata = new HasuraMetadataAdminClient({
      endpoint,
      adminSecret,
      logger,
    });
  }
}
