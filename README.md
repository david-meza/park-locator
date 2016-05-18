[![Stories in Ready](https://badge.waffle.io/david-meza/park-locator.png?label=ready&title=Ready)](https://waffle.io/david-meza/park-locator)
# Park Locator

Park Locator is a mapping tool for Raleigh parks that allows you to find the closest park to your home, search for parks by amenity, get directions to a park, and explore program offerings at the parks.

## Live Application

* Raleigh NC: [Open](https://maps.raleighnc.gov/parklocator)

## Demo

* V2 - Esri: [Open](https://park-locator-esri.surge.sh)
* Esri Experimental (API V4): [Open](https://park-locator-esri-test.surge.sh)

## Other Versions / Branches

* V1 (Deprecated): [Open](https://park-locator.surge.sh)
* V2 - Google Maps (Deprecated - No longer maintained): [Open](https://park-locator-gmaps.surge.sh)
* Backup Host - Heroku: [Open](https://park-locator.herokuapp.com)
* Backup Host 2 - AWS: [Open](http://goo.gl/qGCG4B)

## Build & development

To install dependencies run `npm install` and `bower install`.

The running of tasks for this application was automated using Grunt. 

To produce a distributable/minified version of the app run `grunt build`. 

To preview the application in development in a local live server run `grunt serve`.

## Testing

Running `grunt test` will run the unit tests with karma.
