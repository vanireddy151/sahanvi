# Cloudinary Setup

Use Cloudinary for large images and videos so the project does not need to keep heavy media in Git.

## Upload Folder

Create a folder in Cloudinary named:

```text
sahanvi
```

Upload these files with these public IDs:

```text
sahanvi/Logo-transparent
sahanvi/sahanvi-flower-transparent
sahanvi/sahanvi-banner-person
sahanvi/sahanvi-banner-person-2
sahanvi/sahanvi-story-video
```

For the video, upload the video file to Cloudinary as a video asset. The app uses Cloudinary automatic format and quality delivery.

## Environment Variables

Add these to `Frontend/.env.local`:

```text
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
NEXT_PUBLIC_CLOUDINARY_FOLDER=sahanvi
```

Restart the Next server after changing `.env.local`.

## Local Fallbacks

If `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is empty, the app still uses local files from `Frontend/public/assets`. After all media is uploaded and working from Cloudinary, the large local image/video files can be removed from `public/assets`.
