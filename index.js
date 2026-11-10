'use strict';

require('dotenv').config();
const { buildApp } = require('./lib/app');

const app = buildApp();

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production' && require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
