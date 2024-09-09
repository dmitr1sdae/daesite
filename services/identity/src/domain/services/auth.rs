use crate::domain::error::CommonError;
use crate::domain::models::id::ID;
use crate::domain::models::modulus::Modulus;
use crate::domain::models::session::Session;

#[async_trait::async_trait]
pub trait AuthService: Sync + Send {
    // on signup
    // GET /api/v1/auth/modulus
    async fn get_modulus(&self) -> Result<Modulus, CommonError>;
    // on signin
    // GET /api/v1/auth/modulus?username=dmitr1sdae
    async fn get_modulus_by_username(&self, username: String) -> Result<Modulus, CommonError>;
    // GET /api/v1/auth/modulus?email=me@dmitr1sdae.com
    async fn get_modulus_by_email(&self, email: String) -> Result<Modulus, CommonError>;
    // POST /api/v1/auth/challenge
    async fn generate_session(&self, username: String) -> Result<(), CommonError>;
    // POST /api/v1/auth/proof
    async fn verify(&self, client_verifier: String, proof: String) -> Result<Session, CommonError>;
    // POST /api/v1/auth/signup
    async fn signup(
        &self,
        modulus: ID,
        email: String,
        username: String,
        salt: String,
        verifier: String,
    ) -> Result<(), CommonError>;
}
