import crypto from "crypto";
import fs from "fs";

const generateFileChecksum = (filePath) => {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash("sha256");

    const stream = fs.createReadStream(filePath);

    stream.on("data", (chunk) => {
      hash.update(chunk);
    });

    stream.on("end", () => {
      const checksum = hash.digest("hex");

      resolve(checksum);
    });

    stream.on("error", (error) => {
      reject(error);
    });
  });
};

export { generateFileChecksum };
