const fs = require("fs");
const path = require("path");

const config = JSON.parse(JSON.stringify(require("./app.json")));

const androidPackage = config.expo.android?.package;
const googleServicesPath = path.join(__dirname, "google-services.json");

function hasMatchingGoogleServicesClient(filePath) {
   if (!androidPackage || !fs.existsSync(filePath)) {
      return false;
   }

   try {
      const googleServices = JSON.parse(fs.readFileSync(filePath, "utf8"));
      return googleServices.client?.some(
         (client) =>
            client.client_info?.android_client_info?.package_name === androidPackage
      );
   } catch {
      return false;
   }
}

if (!hasMatchingGoogleServicesClient(googleServicesPath)) {
   delete config.expo.android.googleServicesFile;
}

module.exports = config;
