require('dotenv').config();
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');

const s3Client = new S3Client({
    region: 'auto',
    endpoint: process.env.CLOUDFLARE_ENDPOINT,
    credentials: {
        accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY,
        secretAccessKey: process.env.CLOUDFLARE_SECRET_KEY
    }
});

function moveFileToUploaded(filePath, relativePath) {
    // const uploadedFolder = path.join(__dirname, 'media', 'uploaded', 'public');
    const uploadedFolder = path.join(__dirname, 'test_media', 'uploaded', 'public');
    const destinationDir = path.join(uploadedFolder, relativePath);
    const destinationPath = path.join(destinationDir, path.basename(filePath));

    fs.mkdirSync(destinationDir, { recursive: true });
    fs.renameSync(filePath, destinationPath);
};

async function uploadFile(filePath, fileKey, relativePath) {
    const fileStream = fs.createReadStream(filePath);
    const contentType = mime.lookup(filePath) || 'image/webp';

    const uploadParams = {
        Bucket: process.env.CLOUDFLARE_BUCKET_NAME,
        // Key: `public/${fileKey}`,
        Key: `test/${fileKey.replace('\\', /\//g)}`,
        Body: fileStream,
        ContentType: contentType
    };

    try {
        const command = new PutObjectCommand(uploadParams);
        await s3Client.send(command);
        // moveFileToUploaded(filePath, relativePath);
        console.log(`✅ Uploaded: ${fileKey}`);
    } catch (error) {
        console.error(`❌ Error uploading ${fileKey}:`, error);
        throw error;
    }
};

async function uploadDirectory(dirPath, s3Prefix, relativePath) {
    const files = fs.readdirSync(dirPath);
    const uploadPromises = [];

    for (const file of files) {
        const filePath = path.join(dirPath, file);
        const s3Key = path.join(s3Prefix, file);

        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
            uploadPromises.push(uploadDirectory(filePath, s3Key, path.join(relativePath, file)));
        } else {
            uploadPromises.push(uploadFile(filePath, s3Key, relativePath));
        }
    }

    await Promise.all(uploadPromises);
};

async function uploadAll() {
    try {
        // const rootFolder = path.join(__dirname, 'media', 'missing');
        const rootFolder = path.join(__dirname, 'test_media', 'missing');
        const foldersToUpload = ['cardimages', 'cardsquares', 'crops'];
        const uploadPromises = [];

        for (const folder of foldersToUpload) {
            const folderPath = path.join(rootFolder, folder);
            const s3Prefix = `${folder}`;

            if (fs.existsSync(folderPath)) {
                console.log(`📂 Uploading files from ${folder}...`);
                uploadPromises.push(uploadDirectory(folderPath, s3Prefix, folder));
            } else {
                console.log(`⚠️ Folder ${folder} is not found.`);
            }
        }

        await Promise.all(uploadPromises);
        console.log('✅ All the images has been successfully uploaded');
    } catch (error) {
        console.error('❌ Error while uploading: ', error);
        process.exit(1);
    }
};

uploadAll();