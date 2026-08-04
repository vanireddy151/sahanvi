function loadBitmap(file) {
  if (typeof createImageBitmap === "function") {
    return createImageBitmap(file);
  }
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = URL.createObjectURL(file);
  });
}

function drawAndEncode(source, width, height, quality) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d").drawImage(source, 0, 0, width, height);
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Could not encode image."))),
      "image/jpeg",
      quality
    );
  });
}

// Re-encodes the image as JPEG, scaling and lowering quality until it
// fits under maxSizeMB. Cloudinary uploads stay fast and reliably under
// the backend's size limit even for large, uncompressed camera photos.
export async function compressImage(file, { maxSizeMB = 5, maxDimension = 2000 } = {}) {
  if (!file || !file.type?.startsWith("image/")) return file;

  const maxBytes = maxSizeMB * 1024 * 1024;
  if (file.size <= maxBytes) return file;

  let source;
  try {
    source = await loadBitmap(file);
  } catch {
    return file;
  }

  let width = source.width;
  let height = source.height;
  if (Math.max(width, height) > maxDimension) {
    const scale = maxDimension / Math.max(width, height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  let quality = 0.9;
  let blob;
  try {
    blob = await drawAndEncode(source, width, height, quality);

    while (blob.size > maxBytes && quality > 0.4) {
      quality -= 0.1;
      blob = await drawAndEncode(source, width, height, quality);
    }

    while (blob.size > maxBytes && Math.max(width, height) > 800) {
      width = Math.round(width * 0.85);
      height = Math.round(height * 0.85);
      blob = await drawAndEncode(source, width, height, quality);
    }
  } catch {
    return file;
  }

  const name = file.name.replace(/\.\w+$/, "") + ".jpg";
  return new File([blob], name, { type: "image/jpeg" });
}
