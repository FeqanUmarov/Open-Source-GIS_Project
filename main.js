var mapView = new ol.View({
    center: ol.proj.fromLonLat([47.5769, 40.1431]),
    zoom: 8,
});

var map = new ol.Map({
    target: 'map',
    view: mapView,
    controls: [],
});

var noneTile = new ol.layer.Tile({
    title: 'None',
    type: 'base',
    visible: false
});

var osmTile = new ol.layer.Tile({
    title: 'Open Street Map',
    visible: true,
    type: 'base',
    source: new ol.source.OSM()
});

map.addLayer(osmTile);

var baseGroup = new ol.layer.Tile({
    title: 'Base Maps',
    layers: [osmTile, noneTile]
});
map.addLayer(baseGroup);

var AzSerhed = new ol.layer.Tile({
    title: "Azerbaycan Serhedler",
    source: new ol.source.TileWMS({
        url: 'http://localhost:8082/geoserver/server/wms',
        params: { 'LAYERS': 'server:az_rayonlar', 'TILED': true },
        serverType: 'geoserver',
        visible: true
    })
});

//map.addLayer(AzSerhed);

var AzYol = new ol.layer.Tile({
    title: "Azerbaycan Yollar",
    source: new ol.source.TileWMS({
        url: 'http://localhost:8082/geoserver/server/wms',
        params: { 'LAYERS': 'server:az_yollar_all', 'TILED': true },
        serverType: 'geoserver',
        visible: true
    })
});

var AzTikili = new ol.layer.Tile({
    title: "Azerbaycan TIKILI",
    source: new ol.source.TileWMS({
        url: 'http://localhost:8082/geoserver/server/wms',
        params: { 'LAYERS': 'server:tkili', 'TILED': true },
        serverType: 'geoserver',
        visible: true
    })
});

//map.addLayer(AzYol);

var overlayGroup = new ol.layer.Group({
    title: 'Overlays',
    fold: true,
    layers: [AzSerhed, AzYol, AzTikili]
});

map.addLayer(overlayGroup);


var layerSwitcher = new ol.control.LayerSwitcher({
    activationMode: 'click',
    startActive: false,
    groupSelectStyle: 'children'
});

map.addControl(layerSwitcher);


var mousePosition = new ol.control.MousePosition({
    className: 'mousePosition',
    projection: 'EPSG:4326',
    coordinateFormat: function (coordinate) { return ol.coordinate.format(coordinate, '{y}, {x}', 6); }
})

map.addControl(mousePosition);

var scaleControl = new ol.control.ScaleLine({
    bar: true,
    text: true,

});
map.addControl(scaleControl)


var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');


var popup = new ol.Overlay({
    element: container,
    autoPan: true,
    autoPanAnimantion: {
        duration: 250,
    },
});
map.addOverlay(popup);

closer.onclick = function () {
    popup.setPosition(undefined);
    closer.blur();
    return false;
};

// home button

var homeButton = document.createElement('button');
homeButton.innerHTML = '<img src="resources/images/home2.png" alt="" style = "width:20px; height:20px;filter:brightness(0) invert(1);vertical-align:middle"></img>';
homeButton.className = 'myButton';

var homeElement = document.createElement('div');
homeElement.className = 'homeButtonDiv';
homeElement.appendChild(homeButton);

var homeControl = new ol.control.Control({
    element: homeElement
});

homeButton.addEventListener("click", () => {
    location.href = "index.html";
});

map.addControl(homeControl);

// end: home control

map.on('singleclick', function (evt) {
    content.innerHTML = '';
});


// full screen

var fsButton = document.createElement('button');
fsButton.innerHTML = '<img src="resources/images/full-screen.png" alt="" style = "width:20px; height:20px;filter:brightness(0) invert(1);vertical-align:middle"></img>';
fsButton.className = 'myButton';

var fsElement = document.createElement('div');
fsElement.className = 'fsButtonDiv';
fsElement.appendChild(fsButton);

var fsControl = new ol.control.Control({
    element: fsElement
});

fsButton.addEventListener("click", () => {
    var mapEle = document.getElementById("map");
    if (mapEle.requestFullscreen) {
        mapEle.requestFullscreen();
    } else if (mapEle.msRequestFullscreen) {
        mapEle.msRequestFullscreen();
    } else if (mapEle.mozRequestFullscreen) {
        mapEle.mozRequestFullscreen();
    } else if (mapEle.webkitRequestFullscreen) {
        mapEle.webkitRequestFullscreen();
    }
})
map.addControl(fsControl);

// start zoomIn
var zoomInInteraction = new ol.interaction.DragBox();

zoomInInteraction.on('boxend', function () {
    var zoomInExtent = zoomInInteraction.getGeometry().getExtent();
    map.getView().fit(zoomInExtent);
});

var ziButton = document.createElement('button');
ziButton.innerHTML = '<img src="resources/images/zoom-in.png" alt="" style = "width:20px; height:20px;filter:brightness(0) invert(1);vertical-align:middle"></img>'
ziButton.className = 'myButton';
ziButton.id = 'ziButton';


var ziElement = document.createElement('div');
ziElement.className = 'ziButtonDiv';
ziElement.appendChild(ziButton);

var ziControl = new ol.control.Control({
    element: ziElement
})

var zoomInFlag = false;
ziButton.addEventListener("click", () => {
    ziButton.classList.toggle('clicked');
    zoomInFlag = !zoomInFlag;
    if (zoomInFlag) {
        document.getElementById("map").style.cursor = "zoom-in";
        map.addInteraction(zoomInInteraction)
    } else {
        map.removeInteraction(zoomInInteraction);
        document.getElementById("map").style.cursor = "default";
    }
})
map.addControl(ziControl);
// end zoomIn

//start zoomOut
var zoomOutInteraction = new ol.interaction.DragBox();

zoomOutInteraction.on('boxend', function () {
    var zoomOutExtent = zoomOutInteraction.getGeometry().getExtent();
    map.getView().setCenter(ol.extent.getCenter(zoomOutExtent))
    mapView.setZoom(mapView.getZoom() - 1)
});

var zoButton = document.createElement('button');
zoButton.innerHTML = '<img src="resources/images/zoom-out.png" alt="" style = "width:20px; height:20px;filter:brightness(0) invert(1);vertical-align:middle"></img>'
zoButton.className = 'myButton';
zoButton.id = 'zoButton';


var zoElement = document.createElement('div');
zoElement.className = 'zoButtonDiv';
zoElement.appendChild(zoButton);

var zoControl = new ol.control.Control({
    element: zoElement
})

var zoomOutFlag = false;
zoButton.addEventListener("click", () => {
    zoButton.classList.toggle('clicked');
    zoomOutFlag = !zoomOutFlag;
    if (zoomOutFlag) {
        document.getElementById("map").style.cursor = "zoom-out";
        map.addInteraction(zoomOutInteraction);
    } else {
        map.removeInteraction(zoomOutInteraction);
        document.getElementById("map").style.cursor = "default";
    }
})
map.addControl(zoControl);
// end zoomOut




// feature info

var featureInfoButton = document.createElement('button');
featureInfoButton.innerHTML = '<img src="resources/images/info.png" alt="" style = "width:20px; height:20px;filter:brightness(0) invert(1);vertical-align:middle"></img>';
featureInfoButton.className = 'myButton';
featureInfoButton.id = 'featureInfoButton';

var featureInfoElement = document.createElement('div');
featureInfoElement.className = 'featureInfoDiv';
featureInfoElement.appendChild(featureInfoButton);

var featureInfoControl = new ol.control.Control({
    element: featureInfoElement
});

var featureInfoFlag = false;
featureInfoButton.addEventListener("click", () => {
    featureInfoButton.classList.toggle('clicked');
    featureInfoFlag = !featureInfoFlag;
})
map.addControl(featureInfoControl);



map.on('singleclick', function (evt) {
    if (featureInfoFlag) {
        content.innerHTML = '';
        var resolution = mapView.getResolution();
        var url = AzSerhed.getSource().getFeatureInfoUrl(evt.coordinate, resolution, 'EPSG:3857', {
            'INFO_FORMAT': 'application/json',
            'propertyName': 'rayon'

        });
        if (url) {
            $.getJSON(url, function (data) {
                var feature = data.features[0];
                var props = feature.properties;
                content.innerHTML = "<h4> Rayonun adi: </h4> <p>" + props.rayon.toUpperCase() + "</p>";
                popup.setPosition(evt.coordinate);
            })

        } else {
            popup.setPosition(undefined);
        }

    }

});

// strart length area and line

var lengthButton = document.createElement('button');
lengthButton.innerHTML = '<img src="resources/images/measure_len.png" alt="" style = "width:20px; height:20px;filter:brightness(0) invert(1);vertical-align:middle"></img>'
lengthButton.className = 'myButton';
lengthButton.id = 'lengthButton';

var lengthElement = document.createElement('div');
lengthElement.className = 'lengthButtonDiv';
lengthElement.appendChild(lengthButton);

var lengthControl = new ol.control.Control({
    element: lengthElement
});

var lengthFlag = false;
lengthButton.addEventListener("click", () => {
    lengthButton.classList.toggle('clicked');
    lengthFlag = !lengthFlag;
    document.getElementById("map").style.cursor = "default";
    if (lengthFlag) {
        map.removeInteraction(draw);
        addInteraction('LineString');
    } else {
        map.removeInteraction(draw);
        source.clear();
        const elements = document.getElementsByClassName("ol-tooltip ol-tooltip-static");
        while (elements.length > 0) elements[0].remove();
    }
});

map.addControl(lengthControl);

var areaButton = document.createElement('button');
areaButton.innerHTML = '<img src="resources/images/length_area.png" alt="" style = "width:20px; height:20px;filter:brightness(0) invert(1);vertical-align:middle"></img>'
areaButton.className = 'myButton';
areaButton.id = 'areaButton';

var areaElement = document.createElement('div');
areaElement.className = 'areaButtonDiv';
areaElement.appendChild(areaButton);

var areaControl = new ol.control.Control({
    element: areaElement
});

var areaFlag = false;
areaButton.addEventListener("click", () => {
    areaButton.classList.toggle('clicked');
    areaFlag = !areaFlag;
    document.getElementById("map").style.cursor = "default";
    if (areaFlag) {
        map.removeInteraction(draw)
        addInteraction('Polygon')
    } else {
        map.removeInteraction(draw);
        source.clear();
        const elements = document.getElementsByClassName("ol-tooltip ol-tooltip-static");
        while (elements.length > 0) elements[0].remove();
    }

});

map.addControl(areaControl);


/**
 * @type {string}
 */
var continuePolygonMsg = 'Klik et polygon cek ve sonlandirmaq ucun iki defe klik et';

/**
 * @type {string}
 */
var continueLineMsg = 'Klik et xett cek ve sonlandirmaq ucun iki defe klik et'

var draw;

var source = new ol.source.Vector();
var vector = new ol.layer.Vector({
    source: source,
    style: new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(255,255,255,0.2)',
        }),
        stroke: new ol.style.Stroke({
            color: '#ffcc33',
            width: 2,
        }),
        image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
                color: '#ffcc33'
            })

        })
    })
});

map.addLayer(vector);

function addInteraction(intType) {
    draw = new ol.interaction.Draw({
        source: source,
        type: intType,
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(200,200,200,0.6)',
            }),
            stroke: new ol.style.Stroke({
                color: 'rgba(0,0,0,0.5)',
                lineDash: [10, 10],
                width: 2,
            }),
            image: new ol.style.Circle({
                radius: 5,
                stroke: new ol.style.Stroke({
                    color: 'rgba(0,0,0,0.7)',
                }),
                fill: new ol.style.Fill({
                    color: 'rgba(255,255,255,0.2)'
                }),
            }),
        }),
    });

    map.addInteraction(draw);
    createMeasureTooltip();
    createHelpTooltip();

    /**
     * @type {import ("../src/ol/Feature.js").default}
     */

    var sketch;

    /**
     * @param {import ("../src/ol/MapBrowserEvent").default} evt
     */

    var pointerMoveHandler = function (evt) {
        if (evt.dragging) {
            return;
        }
        /** @type {string} */
        var helpMsg = 'Klik et ve cekmeye basla'

        if (sketch) {
            var geom = sketch.getGeometry();
        }
    };

    map.on('pointermove', pointerMoveHandler);

    draw.on('drawstart', function (evt) {
        sketch = evt.feature;

        /** @type {import("../src/ol/coordinate.js").Coordinate|undefined} */
        var tooltipCoord = evt.coordinate;


        sketch.getGeometry().on('change', function (evt) {
            var geom = evt.target;
            var output;
            if (geom instanceof ol.geom.Polygon) {
                output = formatArea(geom);
                tooltipCoord = geom.getInteriorPoint().getCoordinates();
            } else if (geom instanceof ol.geom.LineString) {
                output = formatLength(geom);
                tooltipCoord = geom.getLastCoordinate();
            }
            measureTooltipElement.innerHTML = output;
            measureTooltip.setPosition(tooltipCoord);
        });
    });

    draw.on('drawend', function () {
        measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
        measureTooltip.setOffset([0, -7]);

        sketch = null;
        measureTooltipElement = null;
        createMeasureTooltip();

    });


}

/**
 * @type {HTMLElement}
 */
var helpTooltipElement;

/**
 * @type {Overlay}
 */
var helpTooltip;

function createHelpTooltip() {
    if (helpTooltipElement) {
        helpTooltipElement.parentNode.removeChild(helpTooltipElement)
    }
    helpTooltipElement = document.createElement('div');
    helpTooltipElement.className = 'ol-tooltip hidden';
    helpTooltip = new ol.Overlay({
        element: helpTooltipElement,
        offset: [15, 0],
        positioning: 'center-left',
    });
    map.addOverlay(helpTooltip);
}



/**
 * @type {HTMLElement}
 */
var measureTooltipElement;

/**
 * @type {Overlay}
 */
var measureTooltip;

function createMeasureTooltip() {
    if (measureTooltipElement) {
        measureTooltipElement.parentNode.removeChild(measureTooltipElement);
    }
    measureTooltipElement = document.createElement('div');
    measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
    measureTooltip = new ol.Overlay({
        element: measureTooltipElement,
        offset: [0, -15],
        positioning: 'bottom-center',
    });
    map.addOverlay(measureTooltip);
}

/**
 * @param {LineString} line
 * @return {string}
 */
var formatLength = function (line) {
    var length = ol.sphere.getLength(line);
    var output;
    if (length > 100) {
        output = Math.round((length / 1000) * 100) / 100 + ' ' + 'km';
    } else {
        output = Math.round(length * 100) / 100 + ' ' + 'km';
    }
    return output;
};

/**
 * @param {Polygon} polygon
 * @return {string}
 */

var formatArea = function (polygon) {
    var area = ol.sphere.getArea(polygon);
    var output;
    if (area > 10000) {
        output = Math.round((area / 1000000) * 100) / 100 + ' ' + 'km<sup>2</sup>';
    } else {
        output = Math.round(area * 100) / 100 + ' ' + 'm<sup>2</sup>';

    }
    return output;
}

// start attribute query

var geojson;
var queryGeoJSON;
var featureOverlay;


var qryButton = document.createElement('button');
qryButton.innerHTML = '<img src="resources/images/analytic.png" alt="" style = "width:20px; height:20px;filter:brightness(0) invert(1);vertical-align:middle"></img>'
qryButton.className = 'myButton';
qryButton.id = 'qryButton';

var qryElement = document.createElement('div');
qryElement.className = 'myButtonDiv';
qryElement.appendChild(qryButton);

var qryControl = new ol.control.Control({
    element: qryElement
})

var qryFlag = false;
qryButton.addEventListener("click", () => {
    qryButton.classList.toggle('clicked');
    qryFlag = !qryFlag;
    document.getElementById("map").style.cursor = "default";
    if (qryFlag) {
        if (geojson) {
            geojson.getSource().clear();
            map.removeLayer(geojson);
        }

        if (featureOverlay) {
            featureOverlay.getSource().clear();
            map.removeLayer(featureOverlay);
        }
        document.getElementById("attQueryDiv").style.display = "block";

        bolIdentify = false;

        addMapLayerList();
    } else {
        document.getElementById("attQueryDiv").style.display = "none";
        document.getElementById("attListDiv").style.display = "none";

        if (geojson) {
            geojson.getSource().clear();
            map.removeLayer(geojson);
        }
        if (featureOverlay) {
            featureOverlay.getSource().clear();
            map.removeLayer(featureOverlay);
        }

    }
})
map.addControl(qryControl);


function addMapLayerList() {
    $(document).ready(function () {
        $.ajax({
            type: "GET",
            url: "http://localhost:8082/geoserver/wfs?request=getCapabilities",
            dataType: "xml",
            success: function (xml) {
                var select = $('#selectLayer');
                select.append("<option class='ddindent' value=''></option>");
                $(xml).find('FeatureType').each(function () {
                    $(this).find('Name').each(function () {
                        var value = $(this).text();
                        select.append("<option class= 'ddindent' value'" + value + "'>" + value + "</option>");
                    });
                });
            }

        });
    });
};
$(function () {
    document.getElementById("selectLayer").onchange = function () {
        var select = document.getElementById("selectAttribute");
        while (select.options.length > 0) {
            select.remove(0);
        }
        var value_layer = $(this).val();
        $(document).ready(function () {
            $.ajax({
                type: "GET",
                url: "http://localhost:8082/geoserver/wfs?service=WFS&request=DescribeFeatureType&version=1.1c.1&typeName=" + value_layer,
                dataType: "xml",
                success: function (xml) {
                    var select = $('#selectAttribute');

                    $(xml).find('xsd\\:sequence').each(function () {
                        $(this).find('xsd\\:element').each(function () {
                            var value = $(this).attr('name');
                            var type = $(this).attr('type');
                            if (value != 'geom' && value != 'the_geom') {
                                select.append("<option class='ddindent' value='" + type + "'>" + value + "</option>");
                            }
                        });
                    });
                }
            });
        });
    }
    document.getElementById("selectAttribute").onchange = function () {
        var operator = document.getElementById("selectOperator");
        while (operator.options.length > 0) {
            operator.remove(0);
        }

        var value_type = $(this).val();
        var value_attribute = $('#selectAttribute option:selected').text();
        operator.options[0] = new Option('Select operator', "");

        if (value_type == 'xsd:short' || value_type == 'xsd:int' || value_type == 'xsd:double') {
            var operator1 = document.getElementById("selectOperator");
            operator1.options[1] = new Option('Greater than', '>');
            operator1.options[2] = new Option('Less than', '<');
            operator1.options[3] = new Option('Equal to', '=');
        }
        else if (value_type == 'xsd:string') {
            var operator1 = document.getElementById("selectOperator");
            operator1.options[1] = new Option('Like', 'Like');
            operator1.options[2] = new Option('Equal to', '=');
        }


    }

    document.getElementById('attQryRun').onclick = function () {
        map.set("isLoading", "YES");

        if (featureOverlay) {
            featureOverlay.getSource().clear();
            map.removeLayer(featureOverlay);
        }

        var layer = document.getElementById("selectLayer");
        var attribute = document.getElementById("selectAttribute");
        var operator = document.getElementById("selectOperator");
        var txt = document.getElementById("enterValue");

        if (layer.options.selectedIndex == 0) {
            alert("Select Layer");
        } else if (attribute.options.selectedIndex == -1) {
            alert("Select Attribute");
        } else if (operator.options.selectedIndex <= 0) {
            alert("Select Operator");
        } else if (txt.value.length <= 0) {
            alert("Enter Value");
        } else {
            var value_layer = layer.options[layer.selectedIndex].value;
            var value_attribute = attribute.options[attribute.selectedIndex].text;
            var value_operator = operator.options[operator.selectedIndex].value;
            var value_txt = txt.value;
            if (value_operator == "Like") {
                value_txt = "%25" + value_txt + "%25";
            } else {
                value_txt = value_txt
            }
            var url = "http://localhost:8082/geoserver/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + value_layer + "&CQL_FILTER=" + value_attribute + "+" + value_operator + "+'" + value_txt + "'&outputFormat=application/json";

            newaddGeoJsonToMap(url);
            newpopulateQueryTable(url);
            setTimeout(function () { newaddRowHandlers(url); }, 300);
            map.addLayer(clickSelectedFeatureOverlay);
            map.set("isloading", "NO");
        }


    }

    document.getElementById("srcCriteria").onchange = function () {
        if (queryGeoJSON) {
            queryGeoJSON.getSource().clear();
            map.removeLayer(queryGeoJSON);
        }

        if (clickSelectedFeatureOverlay) {
            clickSelectedFeatureOverlay.getSource().clear();
            map.removeLayer(clickSelectedFeatureOverlay);
        }

        if (document.getElementById('spUserInput').classList.contains('clicked')) { document.getElementById('spUserInput').classList.toggle('clicked'); }
    }

    document.getElementById('spUserInput').onclick = function () {
        document.getElementById('spUserInput').classList.toggle('clicked');
        if (document.getElementById('spUserInput').classList.contains('clicked')) {
            if (queryGeoJSON) {
                queryGeoJSON.getSource().clear();
                map.removeLayer(queryGeoJSON);
            }
            if (clickSelectedFeatureOverlay) {
                clickSelectedFeatureOverlay.getSource().clear();
                map.removeLayer(clickSelectedFeatureOverlay)
            }
            var srcCriteriaValue = document.getElementById('srcCriteria').value;
            if (srcCriteriaValue == 'pointMarker') {
                addInteractionForSpatialQuery('Point');
            }
            if (srcCriteriaValue == 'lineMarker') {
                addInteractionForSpatialQuery('LineString');
            }
            if (srcCriteriaValue == 'polygonMarker') {
                addInteractionForSpatialQuery('Polygon');
            }
        } else {
            coordList = '';
            markerFeature = undefined;
            map.removeInteraction(draw);
        }
    }

    document.getElementById('spQryRun').onclick = function () {
        var layer = document.getElementById("bufferSelectLayer");
        var value_layer = layer.options[layer.selectedIndex].value;

        var srcCriteria = document.getElementById("srcCriteria");
        var value_src = srcCriteria.options[srcCriteria.selectedIndex].value;
        var coordList = '';
        var url;
        var markerType = '';

        if (markerFeature) {
            if (value_src == 'pointMarker') {
                coordList = markerFeature.getGeometry().getCoordinates()[0] + " " + markerFeature.getGeometry().getCoordinates()[1];
                markerType = 'Point';
            }
            if (value_src == 'lineMarker') {
                var coordArray = markerFeature.getGeometry().getCoordinates();

                for (i = 0; i < coordArray.length; i++) {
                    if (i == 0) {
                        coordList = coordArray[i][0] + " " + coordArray[i][1];
                    } else {
                        coordList = coordList + ", " + coordArray[i][0] + " " + coordArray[i][1];
                    }
                }
                markerType = 'LineString';
            }
            if (value_src == 'polygonMarker') {
                var coordArray = markerFeature.getGeometry().getCoordinates()[0];
                for (i = 0; i < coordArray.length; i++) {
                    if (i == 0) {
                        coordList = coordArray[i][0] + " " + coordArray[i][1];
                    } else {
                        coordList = coordList + ", " + coordArray[i][0] + " " + coordArray[i][1];
                    }
                }
                coordList = "(" + coordList + ")";
                markerType = 'Polygon';
            }

            var value_attribute = $('#qryType option:selected').text();
            if (value_attribute == 'Within Distance of') {

                var dist = document.getElementById("bufferDistance");
                var value_dist = Number(dist.value);

                var distanceUnit = document.getElementById("distanceUnits");
                var value_distanceUnit = distanceUnit.options[distanceUnit.selectedIndex].value;
                url = "http://localhost:8082/geoserver/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + value_layer + "&CQL_FILTER=DWITHIN(geom," + markerType + "(" + coordList + ")," + value_dist + "," + value_distanceUnit + ")&outputFormat=application/json";
            } else if (value_attribute == 'Intersection') {

            } else if (value_attribute == 'Completely Within') {

            }
            newaddGeoJsonToMap(url);
            coordList = '';
            markerFeature = undefined;
        }
    }

    var mapInteractions = map.getInteractions();
    for (var x = 0; x < mapInteractions.getLength(); x++) {
        var mapInteraction = mapInteractions.item(x);

        if (mapInteraction instanceof ol.interaction.DoubleClickZoom) {
            map.removeInteraction(mapInteraction)
            break;
        }
    }

    for (var x = 0; x < mapInteractions.getLength(); x++) {
        var mapInteraction = mapInteractions.item(x);
        if (mapInteraction instanceof ol.interaction.DragPan) {
            map.removeInteraction(mapInteraction)
            break;
        }
    }

    document.getElementById("qryType").onchange = function () {
        var value_attribute = $('#qryType option:selected').text();
        var buffDivElement = document.getElementById("bufferDiv");

        if (value_attribute == 'Within Distance of') {
            buffDivElement.style.display = "block";
        } else {
            buffDivElement.style.display = "none";
        }
    }

    document.getElementById('spQryClear').onclick = function () {
        if (queryGeoJSON) {
            queryGeoJSON.getSource().clear();
            map.removeLayer(queryGeoJSON);
        }

        if (clickSelectedFeatureOverlay) {
            clickSelectedFeatureOverlay.getSource().clear();
        }
        coordList = '';
        markerFeature = undefined;
    }

});


function newaddGeoJsonToMap(url) {
    if (geojson) {
        geojson.getSource().clear();
        map.removeLayer(geojson);
    }


    var style = new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: '#8ef6e4',
            width: 3
        }),
        image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
                color: '#FFFF00'
            })
        })
    });

    geojson = new ol.layer.Vector({
        source: new ol.source.Vector({
            url: url,
            format: new ol.format.GeoJSON()
        }),
        style: style,
    });

    geojson.getSource().on('addfeature', function () {
        map.getView().fit(
            geojson.getSource().getExtent(),
            { duration: 1590, size: map.getSize(), maxZoom: 21 }
        );
    });
    map.addLayer(geojson);


};

function newpopulateQueryTable(url) {
    if (typeof attributePanel !== 'undefined') {
        if (attributePanel.parentElement !== null) {
            attributePanel.close();
        }
    }
    $.getJSON(url, function (data) {
        var col = [];
        col.push('id');
        for (var i = 0; i < data.features.length; i++) {
            for (var key in data.features[i].properties) {

                if (col.indexOf(key) === -1) {
                    col.push(key);
                }
            }
        }

        var table = document.createElement("table");

        table.setAttribute("class", "table table-bordered table-hover table-condensed");
        table.setAttribute("id", "attQryTable");


        var tr = table.insertRow(-1);

        for (var i = 0; i < col.length; i++) {
            var th = document.createElement("th");
            th.innerHTML = col[i];
            tr.appendChild(th);
        }

        for (var i = 0; i < data.features.length; i++) {
            tr = table.insertRow(-1);
            for (var j = 0; j < col.length; j++) {
                var tabCell = tr.insertCell(-1);
                if (j == 0) { tabCell.innerHTML = data.features[i]['id']; }

                else {
                    tabCell.innerHTML = data.features[i].properties[col[j]];
                }
            }
        }

        var tabDiv = document.getElementById('attListDiv');
        var delTab = document.getElementById('attQryTable');

        if (delTab) {
            tabDiv.removeChild(delTab);
        }
        tabDiv.appendChild(table)
        document.getElementById("attListDiv").style.display = "block";
    });

    var highlightStyle = new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(255,0,255,0.3)'
        }),
        stroke: new ol.style.Stroke({
            color: '#FF0FF',
            width: 3,
        }),
        image: new ol.style.Circle({
            radius: 10,
            fill: new ol.style.Fill({
                color: '#FF0FF'
            })
        })
    });

    var featureOverlay = new ol.layer.Vector({
        source: new ol.source.Vector(),
        map: map,
        style: highlightStyle
    });



};

function newaddRowHandlers() {
    var table = document.getElementById("attQryTable");
    var rows = document.getElementById("attQryTable").rows;
    var heads = table.getElementsByTagName('th');
    var col_no;

    for (var i = 0; i < heads.length; i++) {
        var head = heads[i];
        if (head.innerHTML == 'id') {
            col_no = i + 1;
        }
    }

    for (i = 0; i < rows.length; i++) {
        rows[i].onclick = function () {
            return function () {
                featureOverlay.getSource().clear();

                $(function () {
                    $("#attQryTable td").each(function () {
                        $(this).parent("tr").css("background-color", "white");
                    });

                });

                var cell = this.cells[col_no - 1];
                var id = cell.innerHTML;
                $(document).ready(function () {
                    $("#attQryTable td:nth_child(" + col_no + ")").each(function () {
                        if ($(this).text() == id) {
                            $(this).parent("tr").css("background-color", "#d1d8e2");
                        }
                    });
                });

                var features = geojson.getSource().getFeatures();

                for (i = 0; i < features.length; i++) {
                    if (features[i].getId() == id) {
                        featureOverlay.getSource().addFeature(features[i]);

                        featureOverlay.getSource().on('addfeature', function () {
                            map.getView().fit(
                                featureOverlay.getSource().getExtent(),
                                { duration: 1500, size: map.getSize(), maxZoom: 24 }
                            )
                        })
                    }
                }
            };
        }(rows[i]);
    }
}

// start spatial query
// var bufferButton = document.createElement('button');
// bufferButton.innerHTML = '<img src="resources/images/data.png" alt="" style = "width:20px; height:20px;filter:brightness(0) invert(1);vertical-align:middle"></img>'
// bufferButton.className = 'myButton';
// bufferButton.id = 'bufferButton';

// var bufferElement = document.createElement('div');
// bufferElement.className = 'bufferButtonDiv';
// bufferElement.appendChild(bufferButton);

// var bufferControl = new ol.control.Control({
//     element: bufferElement
// })

// var bufferFlag = false;
// bufferButton.addEventListener("click", ()=>{
//     bufferButton.classList.toggle('clicked');
//     bufferFlag = !bufferFlag;
//     document.getElementById("map").style.cursor = "default";
//     if (bufferFlag){
//         if (geojson){
//             geojson.getSource().clear();
//             map.removeLayer(geojson);
//         }
//         if (featureOverlay){
//             featureOverlay.getSource().clear();
//             map.removeLayer(featureOverlay);
//         }

//         document.getElementById("spQueryDiv").style.display = "block";

//         addMapLayerList_sp();
//     } else {
//         document.getElementById("map").style.cursor = "default";
//         document.getElementById("spQueryDiv").style.display = "none";
//         document.getElementById("attListDiv").style.display = "none";

//         if (geojson){
//             geojson.getSource().clear();
//             map.removeLayer(geojson);
//         }

//         if (featureOverlay){
//             featureOverlay.getSource().clear();
//             map.removeLayer(featureOverlay);
//         }
//         map.removeInteraction(draw);
//         if (document.getElementById('spUserInput').classList.contains('clicked')){ document.getElementById('spUserInput').classList.toggle('clicked'); }
//     }
// });
// map.addControl(bufferControl);

// function addMapLayerList_sp(){
//     $(document).ready(function(){
//         $.ajax({
//             type: "GET",
//             url: "http://localhost:8082/geoserver/wfs?request=getCapabilities",
//             dataType: "xml",
//             success: function(xml){
//                 var select = $('#buffSelectLayer');
//                 select.append("<option class='ddindent' value=''></option>");
//                 $(xml).find('FeatureType').each(function () {
//                     $(this).find('Name').each(function () {
//                         var value = $(this).text();
//                         select.append("<option class='ddindent' value='" + value + "'>" + value + "</option>");
//                     });
//                 });
//             }
//         });
//     });


// };

// var markerFeature;
// var clickSelectedFeatureOverlay
// function addInteractionForSpatialQuery(intType){
//     draw = new ol.interaction.Draw({
//         source: clickSelectedFeatureOverlay.getSource(),
//         type: intType,
//         style: interaction
//     });
//     map.addInteraction(draw)

//     draw.on('drawend', function (e) {
//         markerFeature = e.feature;
//         markerFeature.set('geometry', markerFeature.getGeometry());
//         map.removeInteraction(draw);
//         document.getElementById('spUserInput').classList.toggle('clicked');
//         map.addLayer(clickSelectedFeatureOverlay);
//     })
// }

// function selectFeature(evt){
//     if (featureOverlay){
//         featureOverlay.getSource().clear();
//         map.removeLayer(featureOverlay);
//     }
//     var selectedFeature = map.forEachFeatureAtPixel(evt.pixel,
//         function (feature, layer){
//             return feature
//         }
//         )



//function toggleLayer(eve){
//    var lyrname = eve.target.value;
//   var checkedStatus = eve.target.checked;
//    var lyrList = map.getLayers();

//    lyrList.forEach(function(element){
//        if(lyrname == element.get('title')){
//            element.setVisible(checkedStatus);
//        }

//    });

//}

// end : spatial query


// start : start editing Control
var editgeojson;
var editLayer;
var modifiedFeatureList = [];
var editTask;
var editTaskName;
var modifiedFeature = false;
var modifyInteraction;
var featureAdd;
var snap_edit;
var selectFeatureOverlay = new ol.layer.Vector({
    title: 'Selected Feature',
    source: new ol.source.Vector(),
    map: map,

});

var startEditingButton = document.createElement('button');
startEditingButton.innerHTML = '<img src="resources/images/edit.png" alt="" style = "width:20px; height:20px;filter:brightness(0) invert(1);vertical-align:middle" class="myImg"></img>';
startEditingButton.className = 'myButton';
startEditingButton.id = 'startEditingButton';
startEditingButton.title = 'Start Editing';

var startEditingElement = document.createElement('div');
startEditingElement.className = 'myButtonDiv';
startEditingElement.appendChild(startEditingButton);

var editingControl = new ol.control.Control({
    element: startEditingElement
})
var startEditingFlag = false;
startEditingButton.addEventListener("click", () => {
    startEditingButton.classList.toggle('clicked');
    startEditingFlag = !startEditingFlag;
    document.getElementById("map").style.cursor = "default";
    if (startEditingFlag) {
        document.getElementById("editingControlsDiv").style.display = "block";
        editLayer = document.getElementById('editingLayer').value;
        var style = new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(0, 0, 0, 0)'
            }),
            stroke: new ol.style.Stroke({
                color: '#00FFFF',
                width: 1
            }),
            image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                    color: '#00FFFF'
                })
            })
        });

        if (editgeojson) {
            editgeojson.getSource().clear();
            map.removeLayer(editgeojson);
        }

        editgeojson = new ol.layer.Vector({
            title: "Edit Layer",
            source: new ol.source.Vector({
                format: new ol.format.GeoJSON(),
                url: function (extent) {
                    return 'http://localhost:8082/geoserver/' + geoserverWorkspace + '/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=' + editLayer + '&' + 'outputFormat=application/json&srsname=EPSG:4326&' + 'bbox=' + extent.join(',') + ',EPSG:4326';
                },
                strategy: ol.loadingstrategy.bbox
            }),
            style: style,
        });
        map.addLayer(editgeojson);
    } else {
        document.getElementById("editingControlsDiv").style.display = "none";
        editgeojson.getSource().clear();
        map.removeLayer(editgeojson);
    }
})

// end : start editing Control


// start : add feature control

var editingControlsDivElement = document.getElementById('editingControlsDiv');

var addFeatureButton = document.createElement('button');
addFeatureButton.innerHTML = '<img src="resources/images/row.png" alt="" style = "width:20px; height:20px;filter:brightness(0) invert(1);vertical-align:middle" class="myImg"></img>'
addFeatureButton.className = 'myButton';
addFeatureButton.id = 'addFeatureButton';
addFeatureButton.title = 'Add Feature';

var addFeatureElement = document.createElement('div');
addFeatureElement.className = 'myButtonDiv';
addFeatureElement.id = 'addFeatureButtonDiv';
addFeatureElement.appendChild(addFeatureButton);
var addFeatureControl = new ol.control.Control({
    element: addFeatureElement
})


var addFeatureFlag = false;
addFeatureButton.addEventListener("click", () => {
    addFeatureButton.classList.toggle('clicked');
    addFeatureFlag = !addFeatureFlag;
    document.getElementById("map").style.cursor = "default";
    if (addFeatureFlag) {
        if (modifiedFeatureList) {
            if (modifiedFeatureList.length > 0) {
                var answer = confirm('Save edits?');

                if (answer) {
                    saveEdits(editTask);
                    modifiedFeatureList = [];
                } else {
                    modifiedFeatureList = [];
                }
            }
        }
        editTask = 'insert';
        addFeature();
    } else {
        if (modifiedFeatureList.length > 0) {
            var answer = confirm('You have unsaved edits. Do you want to save edits?')
            if (answer) {
                saveEdits(editTask);
                modifiedFeatureList = [];
            } else {
                modifiedFeatureList = [];

            }
        }
        map.un('click', modifyFeature);
        clickSelectedFeatureOverlay.getSource().clear();
        map.removeLayer(clickSelectedFeatureOverlay);
        modifiedFeature = false;
        map.removeInteraction(modifyInteraction);
        map.removeInteraction(snap_edit);
        editTask = '';

        if (modifyInteraction) {
            map.removeInteraction(modifyInteraction);
        }
        if (snap_edit) {
            map.removeInteraction(snap_edit)
        }
        if (drawInteraction) {
            map.removeInteraction(drawInteraction);
        }

    }

})

function addFeature(evt) {
    if (clickSelectedFeatureOverlay) {
        clickSelectedFeatureOverlay.getSource().clear();
        map.removeLayer(clickSelectedFeatureOverlay);
    }

    if (modifyInteraction) {
        map.removeInteraction(modifyInteraction);
    }
    if (snap_edit) {
        map.removeInteraction(snap_edit);
    }

    var interactionType;
    source_mod = editgeojson.getSource();
    drawInteraction = new ol.interaction.Draw({
        source: editgeojson.getSource(),
        type: editgeojson.getSource().getFeatures()[0].getGeometry().getType(),
        style: interactionStyle
    });
    map.addInteraction(drawInteraction);
    snap_edit = new ol.interaction.Snap({
        source: editgeojson.getSource()
    });
    map.addInteraction(snap_edit);

    drawInteraction.on('drawend', function (e) {
        var feature = e.feature;
        feature.set('geometry', feature.getGeometry());
        modifiedFeatureList.push(feature);
    })
}
// end : add feature control


// start : Modify Feature Control
var modifyFeatureButton = document.createElement('button');
modifyFeatureButton.innerHTML = '<img src="resources/images/data.png" alt="" style = "width:20px; height:20px;filter:brightness(0) invert(1);vertical-align:middle" class="myImg"></img>'
modifyFeatureButton.className = 'myButton';
modifyFeatureButton.id = 'modifyFeatureButton';
modifyFeatureButton.title = 'Modify Feature';


var modifyFeatureElement = document.createElement('div');
modifyFeatureElement.className = 'myButtonDiv';
modifyFeatureElement.id = 'modifyFeatureButtonDiv';
modifyFeatureElement.appendChild(modifyFeatureButton);

var modifyControl = new ol.control.Control({
    element: modifyFeatureElement
})

var modifyFeatureFlag = false;
modifyFeatureButton.addEventListener("click", () => {
    modifyFeatureButton.classList.toggle('clicked');
    modifyFeatureFlag = !modifyFeatureFlag;
    document.getElementById("map").style.cursor = "default";
    if (modifyFeatureFlag) {
        modifiedFeatureList = [];
        selectedFeatureOverlay.getSource().clear();
        map.removeLayer(selectedFeatureOverlay);
        map.on('click', modifyFeature);
        editTask = 'update';
    } else {
        if (modifiedFeatureList.length > 0) {
            var answer = confirm('Save Edits?');
            if (answer) {
                saveEdits(editTask);
                modifiedFeatureList = [];
            } else {
                modifiedFeatureList = [];

            }
        }
        map.un('click', modifyFeature);
        selectedFeatureOverlay.getSource().clear();
        map.removeLayer(selectedFeatureOverlay);
        modifiedFeature = false;
        map.removeInteraction(modifyInteraction);
        map.removeInteraction(snap_edit);
        editTask = '';
    }
})
function modifyFeature(evt) {
    selectedFeatureOverlay.getSource().clear();
    map.removeLayer(selectedFeatureOverlay);
    var selectedFeature = map.forEachFeatureAtPixel(evt.pixel,
        function (feature, layer) {
            return feature;
        });
    if (selectedFeature) {
        selectedFeatureOverlay.getSource().addFeature(selectedFeature);
    }
    var modifySource = selectedFeatureOverlay.getSource();
    modifyInteraction = new ol.interaction.Modify({
        source: modifySource
    });
    map.addInteraction(modifyInteraction);

    var sourceEditGeoJson = editgeojson.getSource();
    snap_edit = new ol.interaction.Snap({
        source: sourceEditGeoJson
    });
    map.addInteraction(snap_edit);
    modifyInteraction.on('modifyend', function (e) {
        modifiedFeature = true;
        featureAdd = true;
        if (modifiedFeatureList.length > 0) {

            for (var j = 0; j < modifiedFeatureList.length; j++) {
                if (e.features.item(0)['id_'] == modifiedFeatureList[j]['id_']) {
                    featureAdd = false;
                }
            }
        }
        if (featureAdd) { modifiedFeatureList.push(e.features.item(0)); }
    })
}
var clones = [];

function saveEdits(editTaskName) {
    clones = [];

    for (var i = 0; i < modifiedFeatureList.length; i++) {
        var feature = modifiedFeatureList[i];
        var featureProperties = feature.getProperties();

        delete featureProperties.boundedBy;
        var clone = feature.clone();
        clone.setId(feature.getId());

        clones.push(clone)
    }

    if (editTaskName == 'update') { transactWFS('update_batch', clones); }
    if (editTaskName == 'insert') { transactWFS('insert_batch', clones); }

}

var formatWFS = new ol.format.WFS();

var transactWFS = function (mode, f) {
    var node;
    var formatGML = new ol.format.GML({
        featureNS: geoserverWorkspace,
        featureType: editLayer,
        service: 'WFS',
        version: '1.1.0',
        request: 'GetFeature',
        srsName: 'EPSG:4326'
    });
    switch (mode) {
        case 'insert':
            node = formatWFS.writeTransaction([f], null, null, formatGML);
            break;
        case 'insert_batch':
            node = formatWFS.writeTransaction(f, null, null, formatGML);
            break;
        case 'update':
            node = formatWFS.writeTransaction(null, [f], null, formatGML);
            break;
        case 'update_batch':
            node = formatWFS.writeTransaction(null, f, null, formatGML);
            break;
        case 'delete':
            node = formatWFS.writeTransaction(null, null, [f], formatGML);
            break;
        case 'delete_batch':
            node = formatWFS.writeTransaction(null, null, [f], formatGML);
            break;

    }
    var xs = new XMLSerializer();
    var payload = xs.serializeToString(node);

    payload = payload.split('feature:' + editLayer).join(editLayer);
    if (editTask == 'insert') { payload = payload.split(geoserverWorkspace + ':geometry').join(geoserverWorkspace + ':geom'); }
    if (editTask == 'update') { payload = payload.split('<Name>geometry</Name>').join('<Name>geom</Name>'); }

    $.ajax('http://localhost:8080/geoserver/wfs', {
        type: 'POST',
        dataType: 'xml',
        processData: false,
        contentType: 'text/xml',
        data: payload.trim(),
        success: function (data) {

        },
        error: function (e) {
            var errorMsg = e ? (e.status + ' ' + e.statusText) : "";
            alert('Error saving this feature to Geoserver. <br><br>' + errorMsg);
        }

    }).done(function () {
        editgeojson.getSource().refresh();
    });
};
// end : Modify Feature Control

// start: Delete feature control
var deleteFeatureButton = document.createElement('button');
deleteFeatureButton.innerHTML = '<img src="resources/images/loupe.png" alt="" style = "width:20px; height:20px;filter:brightness(0) invert(1);vertical-align:middle" class="myImg"></img>'
deleteFeatureButton.className = 'myButton';
deleteFeatureButton.id = 'deleteFeatureButton';
deleteFeatureButton.title = 'Delete Feature';

var deleteFeatureElement = document.createElement('div');
deleteFeatureElement.className = 'myButton';
deleteFeatureElement.id = 'deleteFeatureButtonDiv';
deleteFeatureElement.appendChild(deleteFeatureButton);
var deleteControl = new ol.control.Control({
    element: deleteFeatureElement
});
var deleteFeatureFlag = false;
deleteFeatureButton.addEventListener("click", () => {
    deleteFeatureButton.classList.toggle('clicked');
    deleteFeatureFlag = !deleteFeatureFlag;
    document.getElementById("map").style.cursor = "default";
    if (deleteFeatureFlag) {
        modifiedFeatureList = [];
        selectedFeatureOverlay.getSource().clear();
        map.removeLayer(selectedFeatureOverlay);
        editTask = 'delete';
        map.on('click', selectedFeatureToDelete);

    }
})
















// start settings control

var settingsButton = document.createElement('button');
settingsButton.innerHTML = '<img src="resources/images/settings.png" alt="" style = "width:20px; height:20px;filter:brightness(0) invert(1);vertical-align:middle" class="myImg"></img>';
settingsButton.className = 'myButton';
settingsButton.id = 'settingButton';
settingsButton.title = 'Settings';

var settingElement = document.createElement('div');
settingElement.className = 'myButtonDiv';
settingElement.appendChild(settingsButton);

var settingControl = new ol.control.Control({
    element: settingElement
})

var settingFlag = false;
settingsButton.addEventListener("click", () => {
    settingsButton.classList.toggle('clicked');
    settingFlag = !settingFlag;
    document.getElementById("map").style.cursor = "default";

    if (settingFlag) {
        document.getElementById('settingsDiv').style.display = "block";
        addMapLayerList('editingLayer');
    } else {
        document.getElementById("settingsDiv").style.display = "none";
    }
})
map.addControl(settingControl);
// end settings Control