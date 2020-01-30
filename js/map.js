var Chart = function(opts) {
    this.data = opts.data;
    this.ga = opts.ga;
    this.element = opts.element;

    this.draw();
};

Chart.prototype.draw = function() {
    this.width = this.element.offsetWidth;
    this.height = this.width * 1.1;

    if (this.data.has("unit")) {
        var unitStr = this.data.get("unit").split("-");
        this.unit = unitStr[0];
        this.fmt = unitStr[1];
        this.data.remove("unit");

        this.data.each(function(value, key, data) { data.set(key, +value); });
    }

    this.setProjection();
    this.setColor();
    this.addTooltip();

    if (this.data.keys()[0] > 100000) {
        this.drawTract();
    } else {
        this.drawCounty();
    }

    // this.addLegend();
    this.addContinousLegend();

};

Chart.prototype.setProjection = function() {
    this.projection = d3.geoTransverseMercator()
        .rotate([84 + 10 / 60, -30])
        .scale(this.width * 13)
        .translate([this.width / 3.1, this.height / 0.95]);

    this.path = d3.geoPath()
        .projection(this.projection);
};

Chart.prototype.setColor = function() {
    // this.color = d3.scaleQuantize()
    //     .domain(d3.extent(this.data.values()))
    //     .range(["#DEEDCF", "#BFE1B0", "#99D492", "#74C67A", "#56B870", "#39A96B"]);
        // .range(d3.schemeBlues[6]);
    this.color = d3.scaleLinear()
          .range(["#DEEDCF", "#39A96B"])
          .domain(d3.extent(this.data.values()))
          .interpolate(d3.interpolateLab);


};

Chart.prototype.addTooltip = function() {
    var _this = this;
    d3.selectAll(".d3-tip-" + this.element.id).remove();

    this.tip = d3.tip()
        .attr("class", "d3-tip-" + this.element.id)
        .html(function(d) {
            if (+d.properties.GEOID < 100000) {
                return d.properties.NAME + " County</br>" + d.properties.GEOID + ": " + d3.format(_this.fmt)(_this.data.get(d.properties.GEOID)) + " " + _this.unit;
            } else {
                return d.properties.GEOID + ": " + d3.format(_this.fmt)(_this.data.get(d.properties.GEOID)) + " " + _this.unit;
            }
        });
};

Chart.prototype.drawTract = function() {
    var _this = this;

    this.element.innerHTML = '';
    this.svg = d3.select(this.element).append('svg');
    this.svg.attr('width', this.width);
    this.svg.attr('height', this.height);
    this.svg.call(this.tip);

    this.svg.append("g")
        .attr("class", "tract")
        .selectAll("path")
        .data(topojson.feature(this.ga, this.ga.objects.tract).features)
        .enter().append("path")
        .attr("fill", function(d) { return _this.color(_this.data.get(d.properties.GEOID)); })
        .attr("d", this.path)
        // .on("mouseover", this.tip.show)
        // .on("mouseout", this.tip.hide);

    this.svg.append("path")
        .datum(topojson.mesh(this.ga, this.ga.objects.county, function(a, b) { return a != b; }))
        .attr("class", "county")
        .attr("d", this.path);
};

Chart.prototype.drawCounty = function() {
    var _this = this;

    this.element.innerHTML = '';
    this.svg = d3.select(this.element).append('svg');
    this.svg.attr('width', this.width);
    this.svg.attr('height', this.height);
    this.svg.call(this.tip);

    this.svg.append("g")
        .attr("class", "county")
        .selectAll("path")
        .data(topojson.feature(this.ga, this.ga.objects.county).features)
        .enter().append("path")
        .attr("fill", function(d) { return _this.color(_this.data.get(d.properties.GEOID)); })
        .attr("d", this.path)
        .on("mouseover", this.tip.show)
        .on("mouseout", this.tip.hide);
};

Chart.prototype.addContinousLegend = function() {
    var colorScale1 = d3
        .scaleLinear()
          .range(["#DEEDCF", "#39A96B"])
          .domain(d3.extent(this.data.values()))
          .interpolate(d3.interpolateLab);
    continuous("#legend1", colorScale1);
    // create continuous color legend
    function continuous(selector_id, colorscale) {
      var legendheight = 200,
          legendwidth = 80,
          margin = {top: 10, right: 60, bottom: 10, left: 2};
    d3.select(selector_id).selectAll("*").remove();

      var canvas = d3.select(selector_id)
        .style("height", legendheight + "px")
        .style("width", legendwidth + "px")
        .style("position", "relative")
        .append("canvas")
        .attr("height", legendheight - margin.top - margin.bottom)
        .attr("width", 1)
        .style("height", (legendheight - margin.top - margin.bottom) + "px")
        .style("width", (legendwidth - margin.left - margin.right) + "px")
        .style("border", "1px solid #000")
        .style("position", "absolute")
        .style("top", (margin.top) + "px")
        .style("left", (margin.left) + "px")
        .node();


      var ctx = canvas.getContext("2d");

      var legendscale = d3.scaleLinear()
        .range([1, legendheight - margin.top - margin.bottom])
        .domain(colorscale.domain());

      // image data hackery based on http://bl.ocks.org/mbostock/048d21cf747371b11884f75ad896e5a5
      var image = ctx.createImageData(1, legendheight);
      d3.range(legendheight).forEach(function(i) {
        var c = d3.rgb(colorscale(legendscale.invert(i)));
        image.data[4*i] = c.r;
        image.data[4*i + 1] = c.g;
        image.data[4*i + 2] = c.b;
        image.data[4*i + 3] = 255;
      });
      ctx.putImageData(image, 0, 0);

      var legendaxis = d3.axisRight()
        .scale(legendscale)
        .tickSize(6)
        .ticks(8);

      var svg = d3.select(selector_id)
        .append("svg")
        .attr("height", (legendheight) + "px")
        .attr("width", (legendwidth) + "px")
        .style("position", "absolute")
        .style("left", "0px")
        .style("top", "0px")

      svg
        .append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + (legendwidth - margin.left - margin.right + 3) + "," + (margin.top) + ")")
        .call(legendaxis);
    }
}

Chart.prototype.addLegend = function() {
    var _this = this;

    this.legend = this.svg.selectAll("g.legendEntry")
        .data(this.color.range().reverse())
        .enter()
        .append("g").attr("class", "legendEntry");

    this.legend.append("rect")
        .attr("x", this.width / 1.5)
        .attr("y", function(d, i) {
            return i * 20 + 10;
        })
        .attr("width", 15)
        .attr("height", 15)
        .style("stroke", "black")
        .style("stroke-width", 1)
        .style("fill", function(d) {return d;});

    this.legend.append("text")
        .attr("x", this.width / 1.5 + 20)
        .attr("y", function(d, i) {
            return i * 20 + 12;
        })
        .attr("dy", "0.8em")
        .text(function(d, i) {
            var extent = _this.color.invertExtent(d);
            var format = d3.format(_this.fmt);
            return format(+extent[0]) + " - " + format(+extent[1]) + " " + _this.unit;
        });
};

Chart.prototype.setData = function(data) {
    this.data = data;
    this.draw();
};
