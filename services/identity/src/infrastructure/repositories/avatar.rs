use crate::domain::models::avatar::Avatar;
use crate::domain::models::id::ID;
use crate::domain::repositories::avatar::AvatarRepository;
use crate::domain::repositories::repository::RepositoryResult;
use crate::infrastructure::connectors::s3;
use crate::infrastructure::error::InfrastructureRepositoryError;
use image::{DynamicImage, GenericImage, GenericImageView, ImageFormat, Rgba};
use std::io::Cursor;
use std::sync::Arc;

pub struct S3AvatarRepository {
    repository: Arc<s3::Session>,
    mask_img: Arc<DynamicImage>,
}

impl S3AvatarRepository {
    pub fn new(repository: Arc<s3::Session>) -> Self {
        let mask_img_slice = include_bytes!("../../../static/circle_image.webp");
        let reader = image::ImageReader::new(Cursor::new(mask_img_slice));
        let mask_img = Arc::new(reader.decode().expect("Failed to load file"));

        Self {
            repository,
            mask_img,
        }
    }

    fn process_image(&self, avatar: &Avatar) -> RepositoryResult<Avatar> {
        let img = image::load_from_memory(&avatar.content)
            .map_err(|e| InfrastructureRepositoryError::ImageProcessing(e).into_inner())?;

        let (width, height) = (480, 480);
        let resized_img = img.resize_exact(width, height, image::imageops::FilterType::Lanczos3);

        let mut result_image = DynamicImage::new_rgba8(width, height);
        self.apply_mask(&resized_img, &mut result_image, width, height)?;

        let mut png_bytes = Vec::new();
        result_image
            .write_to(&mut Cursor::new(&mut png_bytes), ImageFormat::Png)
            .map_err(|e| InfrastructureRepositoryError::ImageProcessing(e).into_inner())?;

        Ok(Avatar {
            filename: avatar.filename.clone(),
            content: png_bytes,
        })
    }

    fn apply_mask(
        &self,
        resized_img: &DynamicImage,
        result_image: &mut DynamicImage,
        width: u32,
        height: u32,
    ) -> RepositoryResult<()> {
        for y in 0..height {
            for x in 0..width {
                let base_pixel = resized_img.get_pixel(x, y);
                let mask_pixel = self.mask_img.get_pixel(x, y);
                let alpha = mask_pixel.0[3] as f32 / 255.0;

                let blended_pixel = Rgba([
                    (base_pixel.0[0] as f32 * alpha) as u8,
                    (base_pixel.0[1] as f32 * alpha) as u8,
                    (base_pixel.0[2] as f32 * alpha) as u8,
                    mask_pixel.0[3], // Keep original alpha from mask
                ]);

                result_image.put_pixel(x, y, blended_pixel);
            }
        }

        Ok(())
    }
}

#[async_trait::async_trait]
impl AvatarRepository for S3AvatarRepository {
    async fn upload_avatar(&self, avatar: Avatar) -> RepositoryResult<Avatar> {
        let processed_avatar = self.process_image(&avatar)?;

        self.repository
            .put_object_with_content_type(
                processed_avatar.filename.as_str(),
                &processed_avatar.content,
                "image/png",
            )
            .await
            .map_err(|e| InfrastructureRepositoryError::S3(e).into_inner())?;

        Ok(processed_avatar)
    }
    async fn delete_avatar(&self, user_id: ID, avatar_id: ID) -> RepositoryResult<()> {
        self.repository
            .delete_object(format!("{}/{}", user_id, avatar_id))
            .await
            .map_err(|e| InfrastructureRepositoryError::S3(e).into_inner())?;

        Ok(())
    }
    async fn delete_all(&self, user_id: ID) -> RepositoryResult<()> {
        let objects_to_delete = self
            .repository
            .list(format!("{}/", user_id), None)
            .await
            .map_err(|e| InfrastructureRepositoryError::S3(e).into_inner())?;

        for result in objects_to_delete {
            for object in result.contents {
                self.repository
                    .delete_object(object.key.clone())
                    .await
                    .map_err(|e| InfrastructureRepositoryError::S3(e).into_inner())?;
            }
        }

        Ok(())
    }
}
