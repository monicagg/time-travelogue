
function ViewMap(mapid, mapURL, center, zoom) {
    this.mapid = mapid;
    if (!zoom) {
        this.zoom = 15;
    } else {
        this.zoom = zoom;
    }
    
    if (!mapURL) {
        this.mapURL = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
    } else {
        this.mapURL = mapURL;
    }
      
    if (!center) {
        this.center = [51.8024, -0.205];
    } else {
        this.center = center;
    }
}

ViewMap.prototype = {
    initialise: function() {
        if (!this.mapid) { throw new Error('Map container ID not given.'); }
        
        this.mymap = L.map(this.mapid).setView(this.center, this.zoom);
    
        L.tileLayer(this.mapURL, {
            maxZoom: 18,
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>, ' +
                'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            id: 'mapbox.streets'
        }).addTo(this.mymap);
        return this;
    },
    showPopup: function(lnglat, popupMsg) {
        currentMap.mymap.panTo(new L.LatLng(lnglat[1], lnglat[0]));
        var marker = L.marker([lnglat[1], lnglat[0]]).addTo(this.mymap);
        marker.bindPopup(popupMsg).openPopup();
        
    },
    showGeoJSON: function(geoJSONData) {
        L.geoJSON(geoJSONData, {
                style: function(feature) {
                    switch (feature.properties.stroke) {
                        case '#1267ff': return {color: "green", dashArray: "1,6"};
                        default: return {color: "green"};
                    }
                },
                pointToLayer: function (feature, latlng) {
                    return L.circle(latlng, 12, {
                                        color: 'green',
                                        fillColor: 'green',
                                        fillOpacity: 0.5
                                    });
                },
        
                onEachFeature: function(feature, layer) {
                    var popupContent = "<p>" + feature.properties.name + " </p>";
        
                    if (feature.properties && feature.properties.description) {
                        popupContent += "<div class=\"popupImg\">" + feature.properties.description + "</div>";
                    }
        
                    layer.bindPopup(popupContent);
                }
            }).addTo(this.mymap);
        return this;
    }
};

var cityMap = function (mapid, mapURL, center, zoom) {
    var map = new ViewMap(mapid, mapURL, center, zoom);
    return map.initialise();    
};

function mymap(mapid,geoJSONData, zoom, mapURL) {
    
    if (!zoom) { zoom = 14; }
    
    if (!mapURL) {
        mapURL = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
    }
    
    var mymap = L.map(mapid).setView([51.8024, -0.205], zoom);

    L.tileLayer(mapURL, {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox.streets'
    }).addTo(mymap);
    
    if (geoJSONData==null) {
        return mymap;
    }
    
    L.geoJSON(geoJSONData, {
        style: function(feature) {
            switch (feature.properties.stroke) {
                case '#1267ff': return {color: "green", dashArray: "1,6"};
                default: return {color: "green"};
            }
        },
        pointToLayer: function (feature, latlng) {
            return L.circle(latlng, 12, {
                                color: 'green',
                                fillColor: 'green',
                                fillOpacity: 0.5
                            });
        },

        onEachFeature: function(feature, layer) {
            var popupContent = "<p>" + feature.properties.name + " </p>";

            if (feature.properties && feature.properties.description) {
                popupContent += "<div class=\"popupImg\">" + feature.properties.description + "</div>";
            }

            layer.bindPopup(popupContent);
        }
    }).addTo(mymap);
    
    return mymap;
}

function showPhotos(filterYear, wgcPhotos) {
		return L.geoJSON(wgcPhotos, {
				filter: function(feature, layer) {
					var featureTimestamp = new Date(feature.properties.timestamp);
					console.log("selectYears=" + filterYear);
					return featureTimestamp.getFullYear()==filterYear;
				},
				
				pointToLayer: function (feature, latlng) {
					return L.marker(latlng);
				},

				onEachFeature: function(feature, layer) {
				var popupContent = "<p>" + feature.properties.name + " - submitted on " + 
									feature.properties.timestamp  + " </p>";
                  
				if (feature.properties && feature.properties.description) {
					popupContent += feature.properties.description;
				}
				//TODO add for links to open in new tab
				layer.bindPopup(popupContent);
			}
			});
		}