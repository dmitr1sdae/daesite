use crate::domain::models::id::ID;
use crate::domain::models::permission::Permission;
use crate::domain::models::role::Role;
use crate::domain::models::user::{CheckUser, CreateUser, UpdateUser, User};
use crate::domain::repositories::repository::{QueryParams, RepositoryResult, ResultPaging};
use crate::domain::repositories::user::{UserQueryParams, UserRepository};
use crate::infrastructure::connectors::postgres;
use chrono::Utc;
use std::collections::HashMap;
use std::sync::Arc;

pub struct UserPostgresRepository {
    repository: Arc<postgres::Session>,
}

#[async_trait::async_trait]
impl UserRepository for UserPostgresRepository {
    async fn check(&self, user: &CheckUser) -> RepositoryResult<bool> {
        let exists: bool = sqlx::query_scalar!(
            "SELECT EXISTS(SELECT 1 FROM users WHERE username = $1 OR email = $2) as \"exists!\"",
            user.username,
            user.email
        )
        .fetch_one(self.repository.as_ref())
        .await
        .unwrap();

        Ok(exists)
    }

    async fn create(&self, id: ID, new_user: &CreateUser) -> RepositoryResult<User> {
        let result = sqlx::query!(
            "
            INSERT INTO users (id, username, modulus, email, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
            ",
            id,
            new_user.username,
            new_user.modulus,
            new_user.email,
            Utc::now().timestamp_millis(),
            Utc::now().timestamp_millis()
        )
        .fetch_one(self.repository.as_ref())
        .await
        .unwrap();

        let user_id = result.id;

        self.get_by_id(user_id).await
    }

    async fn list(&self, params: UserQueryParams) -> RepositoryResult<ResultPaging<User>> {
        let offset = ((params.next_page() - 1) * params.page_size()) as i64;
        let limit = (params.page_size()) as i64;

        // Query to fetch users with their roles
        let rows = sqlx::query!(
            "
            SELECT u.id as user_id, u.username, u.avatar, u.modulus, u.email, u.created_at, u.updated_at,
                r.id as role_id, r.name as role_name
            FROM users u
            LEFT JOIN user_roles ur ON u.id = ur.user_id
            LEFT JOIN roles r ON ur.role_id = r.id
            ORDER BY u.id DESC
            LIMIT $1 OFFSET $2
            ",
            limit,
            offset
        )
        .fetch_all(self.repository.as_ref())
        .await
        .unwrap();

        todo!()
    }

    async fn get_by_id(&self, user_id: ID) -> RepositoryResult<User> {
        let rows = sqlx::query!(
            "
            SELECT u.id as user_id, u.username, u.avatar, u.modulus, u.email, u.created_at, u.updated_at,
                   r.id as role_id, r.name as role_name, r.created_at as role_created_at, r.updated_at as role_updated_at,
                   p.id as permission_id, p.name as permission_name
            FROM users u
            LEFT JOIN user_roles ur ON u.id = ur.user_id
            LEFT JOIN roles r ON ur.role_id = r.id
            LEFT JOIN role_permissions rp ON r.id = rp.role_id
            LEFT JOIN permissions p ON rp.permission_id = p.id
            WHERE u.id = $1
            ",
            user_id
        )
        .fetch_all(self.repository.as_ref())
        .await
        .unwrap();

        let mut user = User {
            id: user_id,
            username: String::new(),
            avatar: None,
            modulus: 0,
            email: String::new(),
            roles: Vec::new(),
            created_at: 0,
            updated_at: 0,
        };

        let mut roles_map: HashMap<ID, Role> = HashMap::new();

        for row in rows {
            if user.username.is_empty() {
                user.username = row.username;
                user.avatar = row.avatar;
                user.modulus = row.modulus;
                user.email = row.email;
                user.created_at = row.created_at;
                user.updated_at = row.updated_at;
            }

            let role_id = row.role_id;
            if !roles_map.contains_key(&role_id) {
                roles_map.insert(
                    role_id,
                    Role {
                        id: role_id,
                        name: row.role_name,
                        permissions: Vec::new(),
                        created_at: row.role_created_at,
                        updated_at: row.role_updated_at,
                    },
                );
            }

            let permission_name = row.permission_name;

            if let Some(role) = roles_map.get_mut(&role_id) {
                role.permissions.push(Permission {
                    id: row.permission_id,
                    name: permission_name,
                });
            }
        }

        user.roles.extend(roles_map.into_values());

        Ok(user)
    }

    async fn get_by_email(&self, user_email: String) -> RepositoryResult<User> {
        let rows = sqlx::query!(
            "
            SELECT u.id as user_id, u.username, u.avatar, u.modulus, u.email, u.created_at, u.updated_at,
                   r.id as role_id, r.name as role_name, r.created_at as role_created_at, r.updated_at as role_updated_at,
                   p.id as permission_id, p.name as permission_name
            FROM users u
            LEFT JOIN user_roles ur ON u.id = ur.user_id
            LEFT JOIN roles r ON ur.role_id = r.id
            LEFT JOIN role_permissions rp ON r.id = rp.role_id
            LEFT JOIN permissions p ON rp.permission_id = p.id
            WHERE u.email = $1
            ",
            user_email
        )
        .fetch_all(self.repository.as_ref())
        .await
        .unwrap();

        let mut user = User {
            id: 0,
            username: String::new(),
            avatar: None,
            modulus: 0,
            email: user_email,
            roles: Vec::new(),
            created_at: 0,
            updated_at: 0,
        };

        let mut roles_map: HashMap<ID, Role> = HashMap::new();

        for row in rows {
            if user.username.is_empty() {
                user.id = row.user_id;
                user.username = row.username;
                user.avatar = row.avatar;
                user.modulus = row.modulus;
                user.created_at = row.created_at;
                user.updated_at = row.updated_at;
            }

            let role_id = row.role_id;
            if !roles_map.contains_key(&role_id) {
                roles_map.insert(
                    role_id,
                    Role {
                        id: role_id,
                        name: row.role_name,
                        permissions: Vec::new(),
                        created_at: row.role_created_at,
                        updated_at: row.role_updated_at,
                    },
                );
            }

            let permission_name = row.permission_name;

            if let Some(role) = roles_map.get_mut(&role_id) {
                role.permissions.push(Permission {
                    id: row.permission_id,
                    name: permission_name,
                });
            }
        }

        user.roles.extend(roles_map.into_values());

        Ok(user)
    }

    async fn get_by_username(&self, username: String) -> RepositoryResult<User> {
        let rows = sqlx::query!(
            "
            SELECT u.id as user_id, u.username, u.avatar, u.modulus, u.email, u.created_at, u.updated_at,
                   r.id as role_id, r.name as role_name, r.created_at as role_created_at, r.updated_at as role_updated_at,
                   p.id as permission_id, p.name as permission_name
            FROM users u
            LEFT JOIN user_roles ur ON u.id = ur.user_id
            LEFT JOIN roles r ON ur.role_id = r.id
            LEFT JOIN role_permissions rp ON r.id = rp.role_id
            LEFT JOIN permissions p ON rp.permission_id = p.id
            WHERE u.username = $1
            ",
            username
        )
        .fetch_all(self.repository.as_ref())
        .await
        .unwrap();

        let mut user = User {
            id: 0,
            username,
            avatar: None,
            modulus: 0,
            email: String::new(),
            roles: Vec::new(),
            created_at: 0,
            updated_at: 0,
        };

        let mut roles_map: HashMap<ID, Role> = HashMap::new();

        for row in rows {
            if user.username.is_empty() {
                user.id = row.user_id;
                user.avatar = row.avatar;
                user.modulus = row.modulus;
                user.email = row.email;
                user.created_at = row.created_at;
                user.updated_at = row.updated_at;
            }

            let role_id = row.role_id;
            if !roles_map.contains_key(&role_id) {
                roles_map.insert(
                    role_id,
                    Role {
                        id: role_id,
                        name: row.role_name,
                        permissions: Vec::new(),
                        created_at: row.role_created_at,
                        updated_at: row.role_updated_at,
                    },
                );
            }

            let permission_name = row.permission_name;

            if let Some(role) = roles_map.get_mut(&role_id) {
                role.permissions.push(Permission {
                    id: row.permission_id,
                    name: permission_name,
                });
            }
        }

        user.roles.extend(roles_map.into_values());

        Ok(user)
    }

    async fn update(&self, user_id: ID, user: &UpdateUser) -> RepositoryResult<User> {
        sqlx::query!(
            "
            UPDATE users
            SET
                username = COALESCE($2, username),
                email = COALESCE($3, email),
                updated_at = $4
            WHERE id = $1
            ",
            user_id,
            user.username,
            user.email,
            Utc::now().timestamp_millis()
        )
        .execute(self.repository.as_ref())
        .await
        .unwrap();

        self.get_by_id(user_id).await
    }

    async fn delete(&self, user_id: ID) -> RepositoryResult<()> {
        // Remove user-role associations
        sqlx::query!(
            "
            DELETE FROM user_roles
            WHERE user_id = $1
            ",
            user_id
        )
        .execute(self.repository.as_ref())
        .await
        .unwrap();

        // Remove the user
        sqlx::query!(
            "
            DELETE FROM users
            WHERE id = $1
            ",
            user_id
        )
        .execute(self.repository.as_ref())
        .await
        .unwrap();

        Ok(())
    }
}
