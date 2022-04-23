import { HasuraAdminClient } from '@nhost/hasura';
import { logger } from './logger';
import { ENV } from './utils';

export const applyMetadata = async (): Promise<void> => {
  const admin = new HasuraAdminClient({
    endpoint: ENV.HASURA_GRAPHQL_GRAPHQL_URL.replace('/v1/graphql', ''),
    adminSecret: ENV.HASURA_GRAPHQL_ADMIN_SECRET,
  });
  logger.info('Applying metadata...');

  logger.debug('Reloading metadata...');
  await admin.metadata.reload();
  logger.debug('Metadata reloaded');

  try {
    // track
    await admin.metadata.trackTable({
      source: 'default',
      table: {
        schema: 'auth',
        name: 'provider_requests',
      },
    });
    await admin.metadata.trackTable({
      source: 'default',
      table: {
        schema: 'auth',
        name: 'refresh_tokens',
      },
    });
    await admin.metadata.trackTable({
      source: 'default',
      table: {
        schema: 'auth',
        name: 'roles',
      },
    });
    await admin.metadata.trackTable({
      source: 'default',
      table: {
        schema: 'auth',
        name: 'user_providers',
      },
    });
    await admin.metadata.trackTable({
      source: 'default',
      table: {
        schema: 'auth',
        name: 'user_roles',
      },
    });
    await admin.metadata.trackTable({
      source: 'default',
      table: {
        schema: 'auth',
        name: 'users',
      },
    });
    await admin.metadata.trackTable({
      source: 'default',
      table: {
        schema: 'auth',
        name: 'providers',
      },
    });

    // customization
    await admin.metadata.setTableCustomization({
      source: 'default',
      table: {
        schema: 'auth',
        name: 'users',
      },
      configuration: {
        custom_name: 'users',
        custom_root_fields: {
          select: 'users',
          select_by_pk: 'user',
          select_aggregate: 'usersAggregate',
          insert: 'insertUsers',
          insert_one: 'insertUser',
          update: 'updateUsers',
          update_by_pk: 'updateUser',
          delete: 'deleteUsers',
          delete_by_pk: 'deleteUser',
        },
        custom_column_names: {
          // * See: https://github.com/hasura/graphql-engine/issues/8020
          // id: 'id',
          created_at: 'createdAt',
          updated_at: 'updatedAt',
          last_seen: 'lastSeen',
          // * See: https://github.com/hasura/graphql-engine/issues/8020
          // disabled: 'disabled',
          display_name: 'displayName',
          avatar_url: 'avatarUrl',
          // * See: https://github.com/hasura/graphql-engine/issues/8020
          // locale: 'locale',
          // email: 'email',
          phone_number: 'phoneNumber',
          password_hash: 'passwordHash',
          email_verified: 'emailVerified',
          phone_number_verified: 'phoneNumberVerified',
          new_email: 'newEmail',
          otp_method_last_used: 'otpMethodLastUsed',
          otp_hash: 'otpHash',
          otp_hash_expires_at: 'otpHashExpiresAt',
          default_role: 'defaultRole',
          is_anonymous: 'isAnonymous',
          totp_secret: 'totpSecret',
          active_mfa_type: 'activeMfaType',
          // * See: https://github.com/hasura/graphql-engine/issues/8020
          // ticket: 'ticket',
          ticket_expires_at: 'ticketExpiresAt',
        },
      },
    });

    await admin.metadata.setTableCustomization({
      source: 'default',
      table: {
        schema: 'auth',
        name: 'user_roles',
      },
      configuration: {
        custom_name: 'authUserRoles',
        custom_root_fields: {
          select: 'authUserRoles',
          select_by_pk: 'authUserRole',
          select_aggregate: 'authUserRolesAggregate',
          insert: 'insertAuthUserRoles',
          insert_one: 'insertAuthUserRole',
          update: 'updateAuthUserRoles',
          update_by_pk: 'updateAuthUserRole',
          delete: 'deleteAuthUserRoles',
          delete_by_pk: 'deleteAuthUserRole',
        },
        custom_column_names: {
          // * See: https://github.com/hasura/graphql-engine/issues/8020
          // id: 'id',
          created_at: 'createdAt',
          user_id: 'userId',
          // * See: https://github.com/hasura/graphql-engine/issues/8020
          // role: 'role',
        },
      },
    });
    await admin.metadata.setTableCustomization({
      source: 'default',
      table: {
        schema: 'auth',
        name: 'user_providers',
      },
      configuration: {
        custom_name: 'authUserProviders',
        custom_root_fields: {
          select: 'authUserProviders',
          select_by_pk: 'authUserProvider',
          select_aggregate: 'authUserProvidersAggregate',
          insert: 'insertAuthUserProviders',
          insert_one: 'insertAuthUserProvider',
          update: 'updateAuthUserProviders',
          update_by_pk: 'updateAuthUserProvider',
          delete: 'deleteAuthUserProviders',
          delete_by_pk: 'deleteAuthUserProvider',
        },
        custom_column_names: {
          // * See: https://github.com/hasura/graphql-engine/issues/8020
          // id: 'id',
          created_at: 'createdAt',
          updated_at: 'updatedAt',
          user_id: 'userId',
          access_token: 'accessToken',
          refresh_token: 'refreshToken',
          provider_id: 'providerId',
          provider_user_id: 'providerUserId',
        },
      },
    });
    await admin.metadata.setTableCustomization({
      source: 'default',
      table: {
        schema: 'auth',
        name: 'providers',
      },
      configuration: {
        custom_name: 'authProviders',
        custom_root_fields: {
          select: 'authProviders',
          select_by_pk: 'authProvider',
          select_aggregate: 'authProvidersAggregate',
          insert: 'insertAuthProviders',
          insert_one: 'insertAuthProvider',
          update: 'updateAuthProviders',
          update_by_pk: 'updateAuthProvider',
          delete: 'deleteAuthProviders',
          delete_by_pk: 'deleteAuthProvider',
        },
        custom_column_names: {
          // * See: https://github.com/hasura/graphql-engine/issues/8020
          // id: 'id',
        },
      },
    });
    await admin.metadata.setTableCustomization({
      source: 'default',
      table: {
        schema: 'auth',
        name: 'refresh_tokens',
      },
      configuration: {
        custom_name: 'authRefreshTokens',
        custom_root_fields: {
          select: 'authRefreshTokens',
          select_by_pk: 'authRefreshToken',
          select_aggregate: 'authRefreshTokensAggregate',
          insert: 'insertAuthRefreshTokens',
          insert_one: 'insertAuthRefreshToken',
          update: 'updateAuthRefreshTokens',
          update_by_pk: 'updateAuthRefreshToken',
          delete: 'deleteAuthRefreshTokens',
          delete_by_pk: 'deleteAuthRefreshToken',
        },
        custom_column_names: {
          refresh_token: 'refreshToken',
          created_at: 'createdAt',
          expires_at: 'expiresAt',
          user_id: 'userId',
        },
      },
    });
    await admin.metadata.setTableCustomization({
      source: 'default',
      table: {
        schema: 'auth',
        name: 'roles',
      },
      configuration: {
        custom_name: 'authRoles',
        custom_root_fields: {
          select: 'authRoles',
          select_by_pk: 'authRole',
          select_aggregate: 'authRolesAggregate',
          insert: 'insertAuthRoles',
          insert_one: 'insertAuthRole',
          update: 'updateAuthRoles',
          update_by_pk: 'updateAuthRole',
          delete: 'deleteAuthRoles',
          delete_by_pk: 'deleteAuthRole',
        },
        custom_column_names: {
          // * See: https://github.com/hasura/graphql-engine/issues/8020
          // role: 'role',
        },
      },
    });
    await admin.metadata.setTableCustomization({
      source: 'default',
      table: {
        schema: 'auth',
        name: 'provider_requests',
      },
      configuration: {
        custom_name: 'authProviderRequests',
        custom_root_fields: {
          select: 'authProviderRequests',
          select_by_pk: 'authProviderRequest',
          select_aggregate: 'authProviderRequestsAggregate',
          insert: 'insertAuthProviderRequests',
          insert_one: 'insertAuthProviderRequest',
          update: 'updateAuthProviderRequests',
          update_by_pk: 'updateAuthProviderRequest',
          delete: 'deleteAuthProviderRequests',
          delete_by_pk: 'deleteAuthProviderRequest',
        },
        custom_column_names: {
          // * See: https://github.com/hasura/graphql-engine/issues/8020
          // id: 'id',
          // redirect_url: 'redirectUrl',
        },
      },
    });

    await admin.metadata.createObjectRelationship({
      source: 'default',
      table: {
        schema: 'auth',
        name: 'user_providers',
      },
      name: 'user',
      using: {
        foreign_key_constraint_on: ['user_id'],
      },
    });
    await admin.metadata.createArrayRelationship({
      source: 'default',
      table: {
        schema: 'auth',
        name: 'users',
      },
      name: 'userProviders',
      using: {
        foreign_key_constraint_on: {
          table: {
            schema: 'auth',
            name: 'user_providers',
          },
          columns: ['user_id'],
        },
      },
    });

    await admin.metadata.createObjectRelationship({
      source: 'default',
      table: {
        schema: 'auth',
        name: 'user_providers',
      },
      name: 'provider',
      using: {
        foreign_key_constraint_on: ['provider_id'],
      },
    });
    await admin.metadata.createArrayRelationship({
      source: 'default',
      table: {
        schema: 'auth',
        name: 'providers',
      },
      name: 'userProviders',
      using: {
        foreign_key_constraint_on: {
          table: {
            schema: 'auth',
            name: 'user_providers',
          },
          columns: ['provider_id'],
        },
      },
    });

    await admin.metadata.createObjectRelationship({
      source: 'default',
      table: {
        schema: 'auth',
        name: 'user_roles',
      },
      name: 'user',
      using: {
        foreign_key_constraint_on: ['user_id'],
      },
    });

    await admin.metadata.createArrayRelationship({
      source: 'default',
      table: {
        schema: 'auth',
        name: 'roles',
      },
      name: 'userRoles',
      using: {
        foreign_key_constraint_on: {
          table: {
            schema: 'auth',
            name: 'user_roles',
          },
          columns: ['role'],
        },
      },
    });

    await admin.metadata.createObjectRelationship({
      source: 'default',
      table: {
        schema: 'auth',
        name: 'users',
      },
      name: 'defaultRoleByRole',
      using: {
        foreign_key_constraint_on: ['default_role'],
      },
    });
    await admin.metadata.createArrayRelationship({
      source: 'default',
      table: {
        schema: 'auth',
        name: 'roles',
      },
      name: 'usersByDefaultRole',
      using: {
        foreign_key_constraint_on: {
          table: {
            schema: 'auth',
            name: 'users',
          },
          columns: ['default_role'],
        },
      },
    });

    await admin.metadata.createArrayRelationship({
      source: 'default',
      table: {
        schema: 'auth',
        name: 'users',
      },
      name: 'roles',
      using: {
        foreign_key_constraint_on: {
          table: {
            schema: 'auth',
            name: 'user_roles',
          },
          columns: ['user_id'],
        },
      },
    });

    await admin.metadata.createObjectRelationship({
      source: 'default',
      table: {
        schema: 'auth',
        name: 'user_roles',
      },
      name: 'user',
      using: {
        foreign_key_constraint_on: ['user_id'],
      },
    });

    await admin.metadata.createObjectRelationship({
      source: 'default',
      table: {
        schema: 'auth',
        name: 'user_roles',
      },
      name: 'roleByRole',
      using: {
        foreign_key_constraint_on: ['role'],
      },
    });

    await admin.metadata.createObjectRelationship({
      source: 'default',
      table: {
        schema: 'auth',
        name: 'refresh_tokens',
      },
      name: 'user',
      using: {
        foreign_key_constraint_on: ['user_id'],
      },
    });
    await admin.metadata.createArrayRelationship({
      source: 'default',
      table: {
        schema: 'auth',
        name: 'users',
      },
      name: 'refreshTokens',
      using: {
        foreign_key_constraint_on: {
          table: {
            schema: 'auth',
            name: 'refresh_tokens',
          },
          columns: ['user_id'],
        },
      },
    });
  } finally {
    logger.debug('Reloading metadata...');
    await admin.metadata.reload();
    logger.debug('Metadata reloaded');
  }
  logger.info('Metadata applied');
};
