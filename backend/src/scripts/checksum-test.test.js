import { generateFileChecksum } from "#utils/checksum.util";

const testChecksum = async () => {
  try {
    const checksum = await generateFileChecksum(
      "./uploads/temp/storage-test.csv",
    );

    console.log("SHA-256:", checksum);
  } catch (error) {
    console.error("Checksum generation failed", error);
  }
};

testChecksum();
