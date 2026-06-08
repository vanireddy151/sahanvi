const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const folder = process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER || "sahanvi";
const directLogo = "https://res.cloudinary.com/djgftgg1d/image/upload/v1780300399/Logo-transparent_bnjbbe.png";
const directFlower = "https://res.cloudinary.com/djgftgg1d/image/upload/v1780300399/sahanvi-flower-transparent_bgqiqr.png";
const directBannerPerson = "https://res.cloudinary.com/djgftgg1d/image/upload/v1780300399/sahanvi-banner-person_cesgfp.jpg";
const directBannerPerson2 = "https://res.cloudinary.com/djgftgg1d/image/upload/v1780300400/sahanvi-banner-person-2_ajfxna.jpg";
const directStoryVideo = "https://res.cloudinary.com/djgftgg1d/video/upload/v1780300416/sahanvi-story-video_qfphet.mov";
const directKalamkariSaree = "";
const directPaithaniYellowSaree = "";

function cloudinaryUrl(type, publicId, fallback, transform = "") {
  if (!cloudName || !publicId) {
    return fallback;
  }

  const transformPath = transform ? `${transform}/` : "";
  return `https://res.cloudinary.com/${cloudName}/${type}/upload/${transformPath}${folder}/${publicId}`;
}

export const media = {
  logo: cloudName ? directLogo : "/assets/Logo-transparent.png",
  flower: cloudName ? directFlower : "/assets/sahanvi-flower-transparent.png",
  bannerPerson: cloudName ? directBannerPerson : "/assets/sahanvi-banner-person.jpeg",
  bannerPerson2: cloudName ? directBannerPerson2 : "/assets/sahanvi-banner-person-2.jpeg",
  kalamkariSaree: directKalamkariSaree || (cloudName ? directBannerPerson2 : "/assets/sahanvi-banner-person-2.jpeg"),
  paithaniYellowSaree: directPaithaniYellowSaree || (cloudName ? directBannerPerson2 : "/assets/sahanvi-banner-person-2.jpeg"),
  storyVideo: cloudName ? directStoryVideo : "/assets/sahanvi-story-video.mov"
};
