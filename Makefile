all: leaflet-metatip.js site/bundle.js

leaflet-metatip.js: index.js package.json
	browserify -s metatip index.js > leaflet-metatip.js

site/bundle.js: site/site.js leaflet-metatip.js
	browserify site/site.js > site/bundle.js
