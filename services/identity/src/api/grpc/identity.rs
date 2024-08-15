use crate::api::proto::identity::identity_server::Identity;

#[derive(Default)]
pub struct IdentityService {}

#[async_trait::async_trait]
impl Identity for IdentityService {}
