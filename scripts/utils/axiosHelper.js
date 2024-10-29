const https = require('https');
const axios = require('axios');

const urlOptions = { httpsAgent: new https.Agent({ rejectUnauthorized: false }) };

const downloadJSON = async (url) => {
    try {
        const response = await axios.get(url, urlOptions);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const downloadImage = async (url) => {
    try {
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'arraybuffer',
            httpsAgent: urlOptions.httpsAgent
        });
    
        return response.data;
    } catch (error) {
        throw console.log('Error downloading the image: ', error);
    }
};

module.exports = {
    downloadJSON,
    downloadImage
};