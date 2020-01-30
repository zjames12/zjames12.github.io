#!/bin/bash

# Requires NodeJS
# npm install -g shapefile
# npm install -g ndjson-cli
# npm install -g topojson

wget http://www2.census.gov/geo/tiger/GENZ2016/shp/cb_2016_us_county_500k.zip
wget http://www2.census.gov/geo/tiger/GENZ2016/shp/cb_2016_13_tract_500k.zip
unzip -o cb_2016_us_county_500k.zip
unzip -o cb_2016_13_tract_500k.zip

shp2json cb_2016_13_tract_500k.shp -o ga-tract.json
ndjson-split 'd.features' < ga-tract.json > ga-tract.ndjson

shp2json cb_2016_us_county_500k.shp -o us-county.json
ndjson-split 'd.features' < us-county.json > us-county.ndjson
ndjson-filter 'd.properties.STATEFP == '13'' < us-county.ndjson > ga-county.ndjson

geo2topo -n county=ga-county.ndjson tract=ga-tract.ndjson > ga-topo.json
toposimplify -p .0001 -f < ga-topo.json > ga-simple.json
topoquantize 1e5 < ga-simple.json > ga.json

rm us-county.json us-county.ndjson ga-county.ndjson ga-tract.json ga-tract.ndjson ga-topo.json ga-simple.json
