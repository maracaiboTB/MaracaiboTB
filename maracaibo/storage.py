from pathlib import PurePosixPath

import cloudinary.uploader
import cloudinary.utils
from django.core.files.storage import Storage


class CloudinaryMediaStorage(Storage):
    """Almacenamiento de imágenes subidas por usuarios en Cloudinary."""

    def _save(self, name, content):
        path = PurePosixPath(name)
        folder = "maracaibo"

        if str(path.parent) != ".":
            folder = f"{folder}/{path.parent}"

        result = cloudinary.uploader.upload(
            content,
            folder=folder,
            resource_type="image",
            overwrite=False
        )

        public_id = result["public_id"]
        file_format = result.get("format")

        return (
            f"{public_id}.{file_format}"
            if file_format
            else public_id
        )

    def exists(self, name):
        # Cloudinary genera un identificador único en cada carga.
        return False

    def url(self, name):
        url, _ = cloudinary.utils.cloudinary_url(
            name,
            secure=True,
            resource_type="image"
        )
        return url

    def delete(self, name):
        public_id = name.rsplit(".", 1)[0]
        cloudinary.uploader.destroy(
            public_id,
            resource_type="image",
            invalidate=True
        )
