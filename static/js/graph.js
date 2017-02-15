/**
 * Created by Irene on 13/02/2017.
 */

queue()
    .defer(d3.json, "/wild-life/species")
    .defer(d3.json, "/static/json/geo-countries")
    .await(makeGraphs);

function makeGraphs(error, speciesJson){

    //Clean projectJon data
    var species = speciesJson;
        species.forEach(function (d){
            d["value"] = +d["value"];
    });


    //Create a Crosfilter instance
    var ndx = crossfilter(species);

    //Define Dimensions
    var speciesDim = ndx.dimension(function (d) {
        return["Species"]
    });
    var countryDim = ndx.dimension(function (d) {
        return["Country"]
    });

    var categoryCodeDim = ndx.dimension(function(d){
        return["IUDC"]
    });

    //Calculate  metrics
    var numSpeciesByCountry = countryDim.group();
    var numSpeciesByCategory = categoryCodeDim.group();
    var totalSpeciesEndangeredByCountry = countryDim.group().reduceSum(function (d){
        return d["value"]
    });

    var countryGroup = countryDim.group();

    var all = ndx.groupAll();
    var totalSpecies = ndx.groupAll().reduceSum(function (d){
        return d["value"]
    })

    //Define values (to be used in charts)


    //Charts
    var categoryChart = dc.rowChart("#category-chart");

    selectField = dc.selectMenu("#menu-select")
        .dimension(countryDim)
        .group(countryGroup);


    categoryChart
        .width(300)
        .height(240)
        .dimension(categoryCodeDim)
        .group(numSpeciesByCategory)
        .xAxis().ticks(4);

    dc.renderAll();
}