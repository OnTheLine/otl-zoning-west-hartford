# otl-zoning-west-hartford
Interactive Map: Exclusionary Zoning in West Hartford CT, 1924-present, including georeferenced 1924 zoning map and shapefiles for use districts (residential, business, industrial) and area districts (A-E).

## Live map
https://ontheline.github.io/otl-zoning-west-hartford/index-caption.html

See related repo https://github.com/ontheline/otl-zoning-metro-hartford

## Credits
Interactive map developed by Jack Dougherty and Ilya Ilyankou / Picturedigits for On The Line, http://OnTheLine.trincoll.edu, Trinity College, Hartford CT

Replaces 2012 UConn Library MAGIC Google Map http://magic.lib.uconn.edu/otl/dualcontrol_zoning_westhartford.html

## Historical sources
Whitten, Robert Harvey. *West Hartford Zoning*. West Hartford CT: Zoning Commission, 1924, http://magic.lib.uconn.edu/magic_2/raster/37840/hdimg_37840_155_1924_unkn_CSL_1_p.pdf (scan of CT State Library edition), or https://www.google.com/books/edition/West_Hartford_Zoning/bdKsAAAAMAAJ.

1924 Tentative Zoning Map, West Hartford, CT. Zoning Commission, Town of West Hartford. Scanned from CT State Library, http://www.worldcat.org/oclc/830321212. Georectified at https://mapwarper.net/maps/56736

1930, 1951, 1960, 1970, 1988 Zoning Maps, Town of West Hartford (with assistance from Jeffrey Roller), georectified at MAGIC Web Mapping Service (WMS), http://magic.lib.uconn.edu/help/help_WMS.htm

2016 Zoning Map, Town of West Hartford, https://www.westhartfordct.gov/resident-services/gis-maps, georectified at https://mapwarper.net/maps/56738

West Harford property parcels, 2020, CT DEEP, https://ct-deep-gis-open-data-website-ctdeep.hub.arcgis.com/datasets/connecticut-parcels-/data?geometry=-73.130%2C41.653%2C-72.290%2C41.832&orderBy=TOWN&where=TOWN%20%3D%20%27West%20Hartford%27

## Dependencies
- Leaflet https://leafletjs.com
- jQuery https://jquery.com/
- Esri Leaflet for Esri imagery and labels https://github.com/Esri/esri-leaflet/
- FontAwesome https://fontawesome.com
- Leaflet.ExtraMarkers https://github.com/coryasilva/Leaflet.ExtraMarkers

## Known issues
- Console warning: Mixed content (http served over https). Asked UConn MAGIC about future https support for WMS server or alternate map source.

## Georeferencing and Digitizing Boundaries
The original 1924 JPG map was georeferenced using [QGIS Georeferencer](https://docs.qgis.org/3.16/en/docs/user_manual/working_with_raster/georeferencer.html) tool. About 40 ground control points were chosen (available in `georeferencing/gcp.points`). The GeoTIFF is too heavy for GitHub, but is easy to recreate.

1. Open the JPG map in Georeferencer.
1. Load GCP points file.
1. In Transformation Settings, set type to *Thin Plate Spline*, resampling method to *Nearest neighbor*, and target SRS to *EPSG:3857* (Web Mercator).
1. Hit the *Play* button to generate a GeoTIFF.

Shapefiles for use and area districts were manually created in QGIS. They are available from `shapefiles/` folder, as well as GeoJSONS (see `geojson/` folder).

## Design notes
* Legend created with https://www.figma.com/file/7JitgyYxiT3xR3fyoZttKb/otl-zoning-graphics
* Western part of West Hartford is rural in 1924, with few roads and intersections that can be reliably used for georeferencing.
* Each polygon contains *acres* property with its area expressed in acres (rounded to 1 decimal).
* PDFs with semi-transparent maps were created to assess the accuracy of the output.

## What percentage of total land did WH assign to zones A-E in 1924?
1. Digitize wh-area-districts-1924-whitten.geojson, with acres, in QGIS Georeferencer.
2. In Mapshaper.org, export as CSV, and calculate pivot table for acres.

| 1924 Residential Zone | Land (in acres) | Percent |
|----------------------:|----------------:|--------:|
| A                     | 6430            | 45%     |
| B                     | 5540            | 39%     |
| C                     | 1825            | 13%     |
| D                     | 435             | 3%      |
| E                     | 109             | 1%      |
| Total                 | 14339           | 100%    |

## What percentage of total residential land did WH assign to zones A-E in 1924?
In 1924, no one knew exactly which land would be developed into residential, so we use 2020 parcel development to estimate total residential land in the future.

1. Place West Hartford 2020 parcels in GeoJSON.io with OpenStreetMap overlay, and manually remove non-residential parcels (schools, parks, cemeteries, streams, industrial areas, store-only areas) to create: wh-approx-res-parcels-2020.geojson. This is *approximate* because I could not easily remove roads, commercial portions of mixed areas, etc., so it overestimates the amount of potential residential land.

2. Upload to Mapshaper.org to do spatial join with 1924 area-districts (A-E zones), which has imperfect results but good enough for estimation:

```
$ -join area-districts
[join] Joined data from 18 source records to 19,895 target records
[join] 1/19896 target records received no data
[join] 1358/19896 target records were matched by multiple source records (many-to-one relationship)
[join] Inconsistent values were found in fields [id,area,acres] during many-to-one join. Values in the first joining record were used.
```
3. Remove extraneous fields from spatial join, export as: wh-approx-res-parcels-2020-w-1924-zones.geojson
4. Also export file as CSV, create pivot table to calculate acres in zones A-E

| 1924 Zone | Estimated 2020 Residential Land (in acres) | Percent |
|----------:|-------------------------------------------:|--------:|
| A         | 2821                                       | 35%     |
| B         | 3725                                       | 46%     |
| C         | 1201                                       | 15%     |
| D         | 316                                        | 4%      |
| E         | 84                                         | 1%      |
| Total     | 8147                                       | 100%    |

Interpretation: While A and B differ in the two tables above, the combined A+B total is about the same (84% vs. 81%).

## What percentage of *undeveloped* land did WH assign to zones A-E in 1924?
Since about 80% of total estimated residential land was zoned A-B in 1924, we can assume that the percent of *undeveloped* land that year was higher than 80%. Answering this more precisely requires parcel data with "year built" field to separate pre-1924 vs post-1924 land. Sent request in mid-April 2021 to WH CIO for GIS parcel shapefile with year-built data.

See also http://gis.vgsi.com/westhartfordct/Parcel.aspx?Pid=2 with these fields:
- Location
- Parcel ID
- Vision ID
- MBLU (not same as MBL in CT DEEP Parcel data)
- Year Built
- (Land) Use Code   (see 100+ are residential)
- Zone
- Neighborhood
- Size (acres)
