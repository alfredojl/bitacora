const config = {
    // urlDB: 'mongodb://localhost:27017/bitacora', //production
    urlDB: 'mongodb://production:production$@172.26.60.61:27017/bitacora?authSource=admin', //production
    listenPort: 3030
}

module.exports = config;