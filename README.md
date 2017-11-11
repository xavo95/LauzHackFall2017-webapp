# LauzHackFall2017-webapp

To run the app:

- npm install
- grunt install_deps
- grunt build
- mongoimport -d lauzhack2017 -c prices --type csv --file data\prices.csv --headerline
- cd build
- node app.js