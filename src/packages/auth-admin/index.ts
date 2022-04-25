type Logger = Record<'debug' | 'info' | 'warn' | 'error', (m: string) => void>;

import { User as UserType } from '../../types';

class User {
  private client: HasuraAdminClient;

  id?: string;
  //   disabled: boolean;
  //   createdAt: Date;
  //   displayName: string;
  //   avatarUrl: string;
  //   locale: string;
  //   email: string;
  //   isAnonymous: boolean;
  //   defaultRole: string;
  //   metadata: Record<string, any>;
  //   emailVerified: boolean;
  //   phoneNumber: string;
  //   phoneNumberVerified: boolean;
  //   activeMfaType: string;
  //   roles: string[];

  constructor(client: HasuraAdminClient, { id }: { id: string }) {
    this.client = client;
    this.id = id;

    // this.disabled = true;
    // this.emailVerified = false;
    // this.phoneNumberVerified = false;
    Object.assign(this, client.options);
  }

  save() {
    if (this.id) {
      console.log('save', this.client.headers);
    }
  }
}

interface GetUserByIdParams {
  id: string;
}
interface GetUserByEmailParams {
  email: string;
}
interface GetUserByRefreshTokenParams {
  refreshToken: string;
}

export class HasuraAdminClient {
  private _adminSecret?: string;
  private _graphqlEndpoint: string;
  private _logger: Logger;
  readonly options = {
    roles: ['me', 'user'],
    defaultRole: 'user',
  };
  constructor({
    graphqlEndpoint,
    adminSecret,
    logger = console,
  }: {
    graphqlEndpoint: string;
    adminSecret: string;
    logger?: Logger;
  }) {
    this._graphqlEndpoint = graphqlEndpoint;
    this._adminSecret = adminSecret;
    this._logger = logger;
  }

  get headers() {
    const headers: Record<string, string> = {};
    if (this._adminSecret) {
      headers['x-hasura-admin-secret'] = this._adminSecret;
    }
    return headers;
  }

  get endpoint() {
    return this._graphqlEndpoint;
  }

  findUser(params: GetUserByIdParams): User | null;
  findUser(params: GetUserByEmailParams): User | null;
  findUser(params: GetUserByRefreshTokenParams): User | null;
  findUser(
    params:
      | GetUserByIdParams
      | GetUserByEmailParams
      | GetUserByRefreshTokenParams
  ): User | null {
    if ('id' in params) {
      this._logger.debug(`Find user by id: ${params.id}`);
      //
    } else if ('email' in params) {
      this._logger.debug(`Find user by email: ${params.email}`);
      //
    } else {
      this._logger.debug(`Find user by refresh token: ${params.refreshToken}`);
      // params.refreshToken
    }
    return null;
  }

  createUser() {
    // TODO
  }
}
