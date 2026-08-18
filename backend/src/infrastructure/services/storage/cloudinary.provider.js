class CloudinaryProvider {
  /**
   * Upload file to Cloudinary.
   *
   * Future flow:
   *
   * Local file
   *      |
   *      ▼
   * Cloudinary raw upload
   *      |
   *      ▼
   * public_id / secure_url
   */
  async saveTempFile() {
    throw new Error("Cloudinary saveTempFile() is not implemented yet");
  }

  /**
   * Move file to permanent storage.
   *
   * Future Cloudinary structure:
   *
   * experiml/
   *   projects/
   *      projectId/
   *          datasets/
   *              datasetId/
   *                  data.csv
   */
  async moveToPermanent() {
    throw new Error("Cloudinary moveToPermanent() is not implemented yet");
  }

  /**
   * Create access to a stored file.
   *
   * Future Artifact flow may use:
   * Cloudinary asset
   *      |
   *      ▼
   * secure delivery URL / signed URL / stream
   *
   * The exact implementation will be decided
   * when Cloudinary storage is integrated.
   */
  createReadStream() {
    throw new Error("Cloudinary createReadStream() is not implemented yet");
  }

  /**
   * Delete Cloudinary asset.
   *
   * Future:
   * public_id
   *      |
   *      ▼
   * Cloudinary destroy API
   */
  async delete() {
    throw new Error("Cloudinary delete() is not implemented yet");
  }

  /**
   * Check whether asset exists.
   *
   * Future: Cloudinary Admin API lookup
   */
  async exists() {
    throw new Error("Cloudinary exists() is not implemented yet");
  }
}

export default CloudinaryProvider;
