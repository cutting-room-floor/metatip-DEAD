all: leaflet-metatip.js site/bundle.js

leaflet-metatip.js: index.js package.json
	browserify -s metatip index.js > leaflet-metatip.js

site/bundle.js: site/site.js site/states.json leaflet-metatip.js
	browserify -t brfs site/site.js > site/bundle.js
