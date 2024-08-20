use std::env;

pub type Bucket = s3::Bucket;
pub type Region = s3::Region;
pub type Credentials = s3::creds::Credentials;

pub async fn connect() -> Bucket {
    let bucket_name = env::var("S3_BUCKET_NAME")
        .map_err(|_| "S3_BUCKET_NAME must be set")
        .unwrap();
    let bucket_region = env::var("S3_REGION")
        .map_err(|_| "S3_REGION must be set")
        .unwrap();
    let url = env::var("S3_URL")
        .map_err(|_| "S3_URL must be set")
        .unwrap();
    let access_token = env::var("S3_ACCESS_TOKEN")
        .map_err(|_| "S3_ACCESS_TOKEN must be set")
        .unwrap();
    let secret = env::var("S3_SECRET")
        .map_err(|_| "S3_SECRET must be set")
        .unwrap();

    Bucket::new(
        bucket_name.as_str(),
        if bucket_region.as_str() == "r2" {
            Region::R2 { account_id: url }
        } else {
            Region::Custom {
                region: bucket_region,
                endpoint: url,
            }
        },
        Credentials::new(
            Some(access_token.as_str()),
            Some(secret.as_str()),
            None,
            None,
            None,
        )
        .map_err(|_| "Error while creating credentials")
        .unwrap(),
    )
    .map_err(|_| "Error while creating Bucket instance")
    .unwrap()
}
