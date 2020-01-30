var chart2;

d3.queue()
    .defer(d3.json, "shape/ga.json")
    .defer(d3.csv, "data/county_names.csv")
    .defer(d3.csv, "data/county_names.csv")
    .await(ready);

function ready(error, ga, dataRaw1, dataRaw2) {
    if (error) throw error;

    var data2 = d3.map();
    dataRaw2.forEach(function(d) { data2.set(d.id, d.value); });

    chart2 = new Chart({
        element: document.querySelector("#map2"),
        data: data2,
        ga: ga
    });
}

// CHANGEMAP2 function : changes map 2
function changeMap2(file) {
    var fname = "data/datasets/" + file //+ " " + newGeo + ".csv";
    d3.csv(fname, function(dataRaw) {
    // d3.csv(fname, function(error, dataRaw) {
        // if (error) throw error;

        var data = d3.map();
        dataRaw.forEach(function(d) { data.set(d.id, d.value); });

        chart2.setData(data);
    });
};

$(window).resize(function() {
    if(this.resizeTO) clearTimeout(this.resizeTO);
    this.resizeTO = setTimeout(function() {
        $(this).trigger('resizeEnd');
    }, 500);
});

$(window).bind('resizeEnd', function() {
    chart2.draw();
});
