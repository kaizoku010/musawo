const CLOUDINARY_CLOUD_NAME = 'dnko3bvt0';
const CLOUDINARY_PRESET = 'ml_default';
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export const uploadToCloudinary = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_PRESET);
    formData.append('folder', 'products');

    const response = await fetch(`https://api.cloudinary.com/v1_1/dnko3bvt0/image/upload`,
       {
      method: 'POST',
      body: formData,
      mode: 'cors' // Add explicit CORS mode

    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to upload image');
    }

    const data = await response.json();
    if (!data.secure_url) {
      throw new Error('No secure URL received from Cloudinary');
    }

    return data.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error.message);
    throw error; // Re-throw the original error instead of creating a new one
  }
};