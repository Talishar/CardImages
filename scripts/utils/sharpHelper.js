const sharp = require('sharp');

const saveCardImage = async (imageData, outputFilePath) => {
    await sharp(imageData).toFile(outputFilePath);
    console.log(`Image saved at: ${outputFilePath}`);
};

const resizeImage = async (imageData) => {
    return await sharp(imageData)
        .resize(450, 628, {
            fit: 'fill'
        })
        .toBuffer();
};

// Default values for images in cardsquares folder
const CROP_TOP = { left: 0, top: 0, width: 450, height: 372 };
const CROP_BOTTOM = { left: 0, top: 550, width: 450, height: 78 };

const combineImages = async (imageBuffer, outputFilePath) => {
    const topBuffer = await sharp(imageBuffer)
        .extract(CROP_TOP)
        .toBuffer();
    const bottomBuffer = await sharp(imageBuffer)
        .extract(CROP_BOTTOM)
        .toBuffer();
    await sharp({
        create: {
            width: 450,
            height: 450,
            channels: 4,
            background: { r: 255, g: 255, b: 255, alpha: 0 }
        }
    })
    .composite([
        { input: topBuffer, top: 0, left: 0 },
        { input: bottomBuffer, top: 373, left: 0 }
    ])
    .webp()
    .toFile(outputFilePath);
    console.log(`Cropped image saved at: ${outputFilePath}`);
}

module.exports = {
    saveCardImage,
    resizeImage,
    combineImages
};