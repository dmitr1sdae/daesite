use std::env;

use crate::domain::error::CommonError;
use crate::domain::services::captcha::CaptchaService;
use reqwest::Client;
use serde::Deserialize;

const CLOUDFLARE_TURNSTILE_VERIFY_URL: &str =
    "https://challenges.cloudflare.com/turnstile/v0/siteverify";

#[derive(Deserialize)]
struct TurnstileResponse {
    success: bool,
}

pub struct CloudflareCaptchaService {
    client: Client,
    secret_key: String,
}

impl CloudflareCaptchaService {
    pub fn new() -> Self {
        let secret_key =
            env::var("CLOUDFLARE_SECRET_KEY").expect("CLOUDFLARE_SECRET_KEY must be set");

        CloudflareCaptchaService {
            client: Client::new(),
            secret_key,
        }
    }
}

#[async_trait::async_trait]
impl CaptchaService for CloudflareCaptchaService {
    async fn verify_token(&self, token: String, ip_address: String) -> Result<(), CommonError> {
        let form = vec![
            ("secret", self.secret_key.clone()),
            ("response", token.to_string()),
            ("remoteip", ip_address.to_string()),
        ];

        let response = self
            .client
            .post(CLOUDFLARE_TURNSTILE_VERIFY_URL)
            .form(&form)
            .send()
            .await
            .map_err(|_| CommonError {
                message: "Request failed".to_string(),
                description: "Failed to send request to Cloudflare Turnstile endpoint".to_string(),
                code: 500,
            })?
            .json::<TurnstileResponse>()
            .await
            .map_err(|_| CommonError {
                message: "Parsing response failed".to_string(),
                description: "Failed to parse response from Cloudflare Turnstile".to_string(),
                code: 501,
            })?;

        if !response.success {
            return Err(CommonError {
                message: "CAPTCHA verification failed".to_string(),
                description: "The provided CAPTCHA token is invalid or has expired".to_string(),
                code: 203,
            });
        }

        Ok(())
    }
}
