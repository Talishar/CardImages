const path = require('path');
const { createFolderIfNotExists, createJsonIfNotExists, writeJSON } = require('./utils/fsHelper');
const { downloadJSON } = require('./utils/axiosHelper');

/*
    Use this script when a new reprint set like History Pack is released
    to generate a JSON to compare the original card ID with the new collection ID.
    This JSON can be used in the main app for the translations
*/

const COLLECTION_TO_TRANSLATE = '2HP';

const translatedCardsAPI = 'https://cards.fabtcg.com/api/search/v1/cards/?set_code=2HP&ordering=cards&language=es';
const getEnglishCardsAPI = (cardId) => `https://cards.fabtcg.com/api/search/v1/cards/?q=${cardId}&language=en`;


const collectionsFolderPath = `${path.dirname(path.dirname(__filename))}/data/collections`;
const filePath = `${collectionsFolderPath}/${COLLECTION_TO_TRANSLATE}.json`;

const createOutputFileIfNotExists = () => {
    createFolderIfNotExists(collectionsFolderPath);
    createJsonIfNotExists(filePath);
}

const orderMapByName = (obj) => {
    const entries = Object.entries(obj);
    const sortedEntries = entries.sort(([keyA], [keyB]) => keyA.localeCompare(keyB));

    return Object.fromEntries(sortedEntries);
  };

async function main() {
    try {
        const cardsNotFound = [];
        const collectionDataObject = {};
        let batchNumber = 1;
        let translatedCardsResponse = {
            next: translatedCardsAPI
        };

        createOutputFileIfNotExists();

        do {

            console.log(`Starting batch number: ${batchNumber}`);
            translatedCardsResponse = await downloadJSON(translatedCardsResponse.next);

            for (const translatedcard of translatedCardsResponse.results) {

                const cardId = translatedcard.card_id;

                if (!cardId) {
                    console.error('Error: Card ID not found in the JSON response');
                }

                const originalCardsResponse = await downloadJSON(getEnglishCardsAPI(cardId));

                let isMatchCards = false;

                const WORDS_TO_REPLACE = ['-RF', '-CF', 'JP_', 'L-', 'ES_', '.webp'];
                let translatedCollection = path.basename(translatedcard.image.large);
                WORDS_TO_REPLACE.forEach(word => translatedCollection = translatedCollection.replace(word, ''));

                for (const originalCard of originalCardsResponse.results) {
                    if (originalCard.card_id === cardId) {
                        let originalCollection = path.basename(originalCard.image.large);
                        WORDS_TO_REPLACE.forEach(word => originalCollection = originalCollection.replace(word, ''));
                        const collectionMap = {
                            [originalCollection]: translatedCollection
                        };
                        Object.assign(collectionDataObject, collectionMap);
                        isMatchCards = true;
                    }
                }

                if (!isMatchCards) {
                    cardsNotFound.push(translatedCollection);
                    console.error(`Error: Card ${translatedCollection} not found in the English JSON response`);
                }
            }

            console.log(`Finished batch number: ${batchNumber++}`);
        } while (translatedCardsResponse.next !== null);

        console.log(`Saving results to ${filePath}`);
        const orderedCollectionDataObject = orderMapByName(collectionDataObject);
        writeJSON(filePath, orderedCollectionDataObject);
        console.log(`Cards not found in English JSON response: ${cardsNotFound.join(', ')}`, );
        console.log('Check this cards manually please.');

    } catch (error) {
        console.error('Error: ', error);
    }
}

main();
