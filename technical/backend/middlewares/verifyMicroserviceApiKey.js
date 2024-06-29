const verifyMicroserviceApiKey = (req, res, next) => {
    const microserviceApiKey = req.headers['apikey'];
    const senderPort = req.connection.remotePort; // Get the source sender port

    console.log('Microservice API Key:', microserviceApiKey);
    console.log('Source Sender Port:', senderPort); // Log the source sender port

    if (microserviceApiKey === 'M5aMUC2n74MYSmE2L9cZ2ghfmkYwLzwE') {
        next();
    } else {
        res.status(403).json({ error: 'Invalid microservice API key' });
    }
};

module.exports = verifyMicroserviceApiKey;
