use crate::domain::error::CommonError;

#[async_trait::async_trait]
pub trait CaptchaService: Send + Sync {
    async fn verify_token(&self, token: String, ip_address: String) -> Result<(), CommonError>;
}
