use crate::domain::error::CommonError;
use crate::domain::models::id::ID;
use crate::domain::models::user::{CreateUser, UpdateUser, User};
use crate::domain::repositories::repository::ResultPaging;
use crate::domain::repositories::user::{UserQueryParams, UserRepository};
use crate::domain::services::user::UserService;
use std::sync::Arc;

#[derive(Clone)]
pub struct UserServiceImpl {
    pub id_generator: id::Generator,
    pub user_repository: Arc<dyn UserRepository>,
}

impl UserServiceImpl {
    pub fn new(id_generator: id::Generator, user_repository: Arc<dyn UserRepository>) -> Self {
        UserServiceImpl {
            id_generator,
            user_repository,
        }
    }
}

#[async_trait::async_trait]
impl UserService for UserServiceImpl {
    async fn create(&self, user: CreateUser) -> Result<User, CommonError> {
        let new_user = CreateUser {
            username: user.username.clone(),
            email: user.email.clone(),
            modulus: user.modulus,
        };

        let created_user = self.user_repository.create(&new_user).await?;

        Ok(created_user)
    }

    async fn list(&self, params: UserQueryParams) -> Result<ResultPaging<User>, CommonError> {
        let users = self.user_repository.list(params).await?;

        Ok(users)
    }

    async fn get(&self, user_id: ID) -> Result<User, CommonError> {
        let user = self.user_repository.get_by_id(user_id).await?;

        Ok(user)
    }

    async fn update(&self, user_id: ID, user: UpdateUser) -> Result<User, CommonError> {
        let updated_user = self.user_repository.update(user_id, &user).await?;

        Ok(updated_user)
    }

    async fn delete(&self, user_id: ID) -> Result<(), CommonError> {
        self.user_repository.delete(user_id).await?;

        Ok(())
    }
}
