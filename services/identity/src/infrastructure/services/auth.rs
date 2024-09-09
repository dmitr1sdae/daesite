use crate::domain::error::{CommonError, RepositoryError};
use crate::domain::models::id::ID;
use crate::domain::models::modulus::Modulus;
use crate::domain::models::session::Session;
use crate::domain::models::user::{CreateUser, User};
use crate::domain::repositories::avatar::AvatarRepository;
use crate::domain::repositories::modulus::ModulusRepository;
use crate::domain::repositories::user::UserRepository;
use crate::domain::services::auth::AuthService;
use argon2::password_hash::PasswordHasher;
use argon2::password_hash::SaltString;
use argon2::Argon2;
use id::Generator;
use num_bigint::BigUint;
use rand::rngs::OsRng;
use rand::{RngCore, SeedableRng};
use rand_chacha::ChaCha20Rng;
use std::future::Future;
use std::sync::Arc;

#[derive(Clone)]
pub struct AuthServiceImpl {
    pub id_generator: Generator,
    pub avatar_repository: Arc<dyn AvatarRepository>,
    pub modulus_repository: Arc<dyn ModulusRepository>,
    pub user_repository: Arc<dyn UserRepository>,
}

impl AuthServiceImpl {
    pub fn new(
        id_generator: Generator,
        avatar_repository: Arc<dyn AvatarRepository>,
        modulus_repository: Arc<dyn ModulusRepository>,
        user_repository: Arc<dyn UserRepository>,
    ) -> Self {
        AuthServiceImpl {
            id_generator,
            avatar_repository,
            modulus_repository,
            user_repository,
        }
    }

    async fn get_modulus_by_user<F, Fut>(&self, get_user: F) -> Result<Modulus, CommonError>
    where
        F: FnOnce() -> Fut,
        Fut: Future<Output = Result<User, RepositoryError>>,
    {
        let user = get_user().await?;

        self.modulus_repository
            .get(user.modulus)
            .await
            .map_err(|err| CommonError {
                message: "Failed to get modulus".to_string(),
                description: err.to_string(),
                code: 500,
            })
    }

    fn hash_argon2(&self, session_key: Vec<u8>) -> Result<Vec<u8>, CommonError> {
        let salt = SaltString::generate(&mut OsRng);

        let argon2 = Argon2::default();

        let hasher = argon2
            .hash_password(&session_key, &salt)
            .unwrap()
            .hash
            .unwrap();
        let hash = hasher.as_bytes();

        Ok(hash.to_vec())
    }
}

#[async_trait::async_trait]
impl AuthService for AuthServiceImpl {
    async fn get_modulus(&self) -> Result<Modulus, CommonError> {
        match self.modulus_repository.get_random().await {
            Ok(Some(modulus)) => Ok(modulus),
            Ok(None) => Err(CommonError {
                message: "No modulus found".to_string(),
                description: "The repository returned no modulus".to_string(),
                code: 404,
            }),
            Err(err) => Err(CommonError {
                message: "Failed to get modulus".to_string(),
                description: err.to_string(),
                code: 500,
            }),
        }
    }

    async fn get_modulus_by_username(&self, username: String) -> Result<Modulus, CommonError> {
        self.get_modulus_by_user(|| self.user_repository.get_by_username(username))
            .await
    }

    async fn get_modulus_by_email(&self, email: String) -> Result<Modulus, CommonError> {
        self.get_modulus_by_user(|| self.user_repository.get_by_email(email))
            .await
    }

    async fn generate_session(&self, username: String) -> Result<(), CommonError> {
        let user = self.user_repository.get_by_username(username).await?;
        let modulus = self.modulus_repository.get(user.modulus).await?;

        let mut rng = ChaCha20Rng::from_entropy();
        let mut b_bytes = [0u8; 32];
        rng.fill_bytes(&mut b_bytes);
        let b = BigUint::from_bytes_be(&b_bytes);

        let N = BigUint::parse_bytes(modulus.modulus.as_bytes(), 16).unwrap(); // Large prime number, usually 2048-bit
        let g = BigUint::from(2u32); // Generator g, often 2

        let hash = self
            .hash_argon2([&N.to_bytes_be()[..], &g.to_bytes_be()[..]].concat())
            .unwrap();
        let k = BigUint::from_bytes_be(hash.as_ref());

        let v = BigUint::parse_bytes(&user.verifier.as_bytes(), 16).unwrap(); // Convert verifier to BigUint
        let kv = &k * &v; // kv
        let g_b = g.modpow(&b, &N); // g^b % N
        let B = (kv + g_b) % &N; // B = kv + g^b % N

        Ok(())
    }

    async fn verify(&self, client_verifier: String, proof: String) -> Result<Session, CommonError> {
        todo!();
    }

    async fn signup(
        &self,
        modulus: ID,
        username: String,
        email: String,
        salt: String,
        verifier: String,
    ) -> Result<(), CommonError> {
        self.user_repository
            .create(&CreateUser {
                username,
                email,
                modulus,
                salt,
                verifier,
            })
            .await?;

        Ok(())
    }
}
