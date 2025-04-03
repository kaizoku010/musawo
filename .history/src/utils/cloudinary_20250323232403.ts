const CLOUDINARY_CLOUD_NAME = 'dnko3bvt0';
const CLOUDINARY_PRESET = 'ml_default';
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_PRESET);
  formData.append('folder', 'products'); // Optional: organize uploads in folders

  try {
    const response = await fetch(CLOUDINARY_URL, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (data.secure_url) {
      return data.secure_url;
    } else {
      throw new Error('Upload failed - no secure URL received');
    }
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

