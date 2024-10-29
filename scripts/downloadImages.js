const path = require('path');
const { createFolderIfNotExists, checkIfPathExists } = require('./utils/fsHelper');
const { downloadJSON, downloadImage } = require('./utils/axiosHelper');
const { saveCardImage, resizeImage, combineImages } = require('./utils/sharpHelper');

/*
    Use this script when you need to download a card, a set or the whole language collection
    to download the imagen, resize it and create a square copy.
*/

const languagesList = ['en', 'es', 'fr', 'de', 'it', 'ja'];
const localeDictionary = {
    en: 'english',
    es: 'spanish',
    fr: 'french',
    de: 'german',
    it: 'italian',
    ja: 'japanese'
};

// API to retrieve all the existing cards by language
const composeInitialApiUrl = (locale) => `https://cards.fabtcg.com/api/search/v1/cards/?language=${locale}&limit=50&offset=0&ordering=cards`;

// API to retrieve a specific collection and language
// const composeInitialApiUrl = (locale) => `https://cards.fabtcg.com/api/search/v1/cards/set_code=EVO&language=${locale}`;

// API to retrieve a specific card by card code and language
// const composeInitialApiUrl = (locale) => `https://cards.fabtcg.com/api/search/v1/cards/?q=AKO004&language=${locale}`;

// API to retrieve a specific card by name, collection and language
// const composeInitialApiUrl = (locale) => `https://cards.fabtcg.com/api/search/v1/cards/?name=Teklo+Foundry+Heart&set_code=EVO&language=${locale}`;

const mediaUploadedFolderPath = `${path.dirname(path.dirname(__filename))}/media/uploaded/public`;
const mediaMissingFolderPath = `${path.dirname(path.dirname(__filename))}/media/missing`;

const CARD_IMAGES = 'cardimages';
const CARD_SQUARES = 'cardsquares';

const createOutputFolderIfNotExists = (language, folderName) => {
    const outputFilePath = `${mediaMissingFolderPath}/${folderName}/${localeDictionary[language]}/`;
    createFolderIfNotExists(outputFilePath);
}

const WORDS_TO_REPLACE = ['-RF', '-CF', 'JP_', 'L-', '-MV'];

const getFilePathsByImageName = (parentFolderPath, imageUrl, language) => {
    let imageName = path.basename(imageUrl).replace(`${language.toUpperCase()}_`, '');
    WORDS_TO_REPLACE.forEach(word => imageName = imageName.replace(word, ''));
    return {
        cardImages: `${parentFolderPath}/cardimages/${localeDictionary[language]}/${imageName}`,
        cardSquares: `${parentFolderPath}/cardsquares/${localeDictionary[language]}/${imageName}`
    };
};

async function main() {
    for (const language of languagesList) {
        console.log(`------------------------ Starting ${localeDictionary[language]} language ------------------------`)
        try {
            let data = {
                next: composeInitialApiUrl(language)
            };
            let batchNumber = 1;

            createOutputFolderIfNotExists(language, CARD_IMAGES);
            createOutputFolderIfNotExists(language, CARD_SQUARES);

            do {
                data = await downloadJSON(data.next);
                for (const card of data.results) {
                    const imageUrl = card.image.large;
                    if (!imageUrl) {
                        throw new Error('Image url not found in the JSON response');
                    }

                    const uploadedFilePath = getFilePathsByImageName(mediaUploadedFolderPath, imageUrl, language);

                    if (!checkIfPathExists(uploadedFilePath.cardImages) || !checkIfPathExists(uploadedFilePath.cardSquares)) {
                        console.log(`Generating card ${imageUrl}`)
                        const missingFilePath = getFilePathsByImageName(mediaMissingFolderPath, imageUrl, language);
                        const imageData = await downloadImage(imageUrl);
                        const imageBuffer = await resizeImage(imageData);
                        await saveCardImage(imageBuffer, missingFilePath.cardImages);
                        await combineImages(imageBuffer, missingFilePath.cardSquares);
                    }
                }

                console.log(`Finished batch number: ${batchNumber++}`);
            } while (data.next !== null);
            console.log(`------------------------ Finished ${localeDictionary[language]} language ------------------------`)
        } catch (error) {
            console.error('Error: ', error);
        }
    }
}

main();


