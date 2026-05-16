const fs = require("fs");
const path = require("path");

const config = require("./app.json");

const googleServicesPath = path.join(__dirname, "google-services.json");
if (!fs.existsSync(googleServicesPath)) {
   delete config.expo.android.googleServicesFile;
}

module.exports = config;
