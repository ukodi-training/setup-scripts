// Load all the data in 3 different formats and call 

queue()
    .defer(d3.json, "data/world-50m.json")
    .defer(d3.tsv, "data/world-country-names.tsv")
    .defer(d3.csv, config.data_file)
    .await(ready);

var max_value = 0;

// Set up map width and height
var width  = config.map_width,
    height = config.map_height;

// Initialise map projection, in this case mercator.
// Lots more projection types are listed on https://github.com/mbostock/d3/wiki/Geo-Projections

var projection = d3.geo.mercator()
                .translate([410, 260])
                .scale(140);

var path = d3.geo.path()
    .projection(projection);

var color = d3.scale.category10();

var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height)
    .call(d3.behavior.zoom()
    .on("zoom", redraw))
    .append("g");

function redraw() {
    svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}

var tooltip = d3.select("#map").append("div")
    .attr("class", "tooltip");

function getColor(d,i){
	var overlayHueMin = 238,
	overlayHueMax = 240,
	overlaySatMin = 1,
	overlaySatMax = 1,
	overlayValMin = 0.95,
	overlayValMax = 0.8;
	if (d.value === undefined) {
		return d3.rgb(255,255,255);
	} else {
		var p = ( d.value / max_value ) * config.color_multiplier;
//		console.log( d.name + " (" + d.value + ") " + p + " (" + max_value + ")");
		var h = overlayHueMin + p * (overlayHueMax - overlayHueMin);
		var s = overlaySatMin + p * (overlaySatMax - overlaySatMin);
		var v = overlayValMin + p * (overlayValMax - overlayValMin);
		return d3.hsl(h,s,v);
	}
}

function ready(error, world, names, values) {
  var countries = topojson.object(world, world.objects.countries).geometries,
      neighbors = topojson.neighbors(world, countries),
      i = -1,
      n = countries.length;

  countries.forEach(function(d) { 

    var tryit = names.filter(function(n) { return d.id == n.id; })[0];
    if (typeof tryit === "undefined"){
//      console.log("Failed in match 1: " + d);
    } else {
      d.name = tryit.name; 
    }
   
    var local_max = 0; 
    var tryit2 = values.filter(function(n) { return d.name == n.Country; })[0];
    if (typeof tryit2 === "undefined"){
//	console.log("Failed to find data for: " + d.name);
    } else {
	d.value = parseInt(tryit2[config.column_title].replace(/\,/g,''));
	if (d.value > max_value) {
		max_value = d.value;
	}
    }

  });

var country = svg.selectAll(".country").data(countries);

  country
   .enter()
    .insert("path")
    .attr("class", "country")    
      .attr("title", function(d,i) { return d.name; })
      .attr("d", path)
      .style("fill", function(d, i) { return getColor(d); });

    // Respond to mouse actions
    country
      .on("mousemove", function(d,i) {
      })
      .on("click", function(d,i) {
      })
      .on("mouseout",  function(d,i) {
      });

}
