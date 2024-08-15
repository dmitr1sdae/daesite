use validator::ValidationError;

pub fn validate_next_page(next_page: &str) -> Result<(), ValidationError> {
    String::from_utf8(
        base64_url::decode(next_page).map_err(|_err| ValidationError::new("invalid token"))?,
    )
    .map_err(|_err| ValidationError::new("invalid token"))?
    .parse::<i64>()
    .map_err(|_err| ValidationError::new("invalid token"))?;

    Ok(())
}
