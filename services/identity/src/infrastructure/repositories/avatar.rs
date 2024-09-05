use crate::domain::models::avatar::Avatar;
use crate::domain::models::id::ID;
use crate::domain::repositories::avatar::AvatarRepository;
use crate::domain::repositories::repository::RepositoryResult;
use crate::infrastructure::connectors::s3;
use image::{DynamicImage, GenericImage, GenericImageView, ImageFormat, Rgba};
use std::io::Cursor;
use std::sync::Arc;

pub struct S3AvatarRepository {
    id_generator: id::Generator,
    repository: Arc<s3::Session>,
    mask_img: Arc<DynamicImage>,
}

impl S3AvatarRepository {
    pub fn new(id_generator: id::Generator, repository: Arc<s3::Session>) -> Self {
        let mask_img = Arc::new(image::open("mask_image.webp").expect("Failed to open image file"));

        Self {
            id_generator,
            repository,
            mask_img,
        }
    }

    async fn process_image(&self, user_id: ID, avatar: Avatar) -> RepositoryResult<Avatar> {
        let img = image::load_from_memory(&avatar.content).unwrap();
        let (width, height) = (480, 480);
        let resized_img = img.resize_exact(width, height, image::imageops::FilterType::Lanczos3);
        let mut result_image = DynamicImage::new_rgba8(width, height);

        for y in 0..height {
            for x in 0..width {
                let base_pixel = resized_img.get_pixel(x, y);
                let mask_pixel = self.mask_img.get_pixel(x, y);
                let alpha = mask_pixel.0[3] as f32 / 255.0;

                let blended_pixel = Rgba([
                    (base_pixel.0[0] as f32 * alpha) as u8,
                    (base_pixel.0[1] as f32 * alpha) as u8,
                    (base_pixel.0[2] as f32 * alpha) as u8,
                    mask_pixel[3],
                ]);

                result_image.put_pixel(x, y, blended_pixel);
            }
        }

        let mut png_bytes = Vec::new();
        resized_img
            .write_to(&mut Cursor::new(&mut png_bytes), ImageFormat::Png)
            .map_err(|e| e.to_string())
            .unwrap();

        Ok(Avatar {
            filename: Some(format!(
                "{}/{}",
                user_id,
                self.id_generator.clone().generate()
            )),
            content: png_bytes,
        })
    }
}

#[async_trait::async_trait]
impl AvatarRepository for S3AvatarRepository {
    async fn upload_avatar(&self, user_id: ID, avatar: Avatar) -> RepositoryResult<Avatar> {
        let processed_avatar = self.process_image(user_id, avatar).await?;

        self.repository
            .put_object_with_content_type(
                processed_avatar.filename.clone().unwrap().as_str(),
                &processed_avatar.content,
                "image/png",
            )
            .await
            .unwrap();

        Ok(processed_avatar)
    }
}
