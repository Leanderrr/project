var width = 400,
    height = 430,
    axes = 12,
    tick_axis = 9,
    start = 0,
    end = 2.25;

var theta = function(r) {
  return 2*Math.PI*r;
};

var angle = d3.scale.linear()
	.domain([0, axes]).range([0, 360])

var r = d3.min([width,height])/2-40;
var r2 = r;

var radius = d3.scale.linear()
  .domain([start, end])
  .range([0, r]);

var svg = d3.select("#chart").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width/2 + "," + (height/2+8) +")");

var points = d3.range(start, end+0.001, (end-start)/1000);

var spiral = d3.svg.line.radial()
  .interpolate("cardinal")
  .angle(theta)
  .radius(radius);
 
var path = svg.selectAll(".spiral")
    .data([points])
  .enter().append("path")
    .attr("class", "spiral")
    .attr("d", spiral)
   
  
  var z = d3.scale.category20();
  
var circles = svg.selectAll('.circle')
	.data(points);
  
/*  circles.enter().append('circle')
  			.attr('r', 5)
        .attr('transform', function(d) { return 'translate(' + d + ')'})
        .style('fill', function(d) { return z(d); });
        
    */  
    
    var circle = svg.append("circle")
    .attr("r", 13)
    .attr("transform", "translate(" + points[0] + ")");
    
      var movingCircle = circle.transition().duration(4000)
      										.attrTween('transform', translateAlongPath(path.node()))
//		  	.attr('cx', function(d) { return radius(d) * Math.cos(theta(d))})
  //    	.attr('cy', function(d) { return radius(d) * Math.sin(theta(d))})

        
function translateAlongPath(path){
	var l = path.getTotalLength();
  	return function(d, i, a) {
    	return function(t) {
      console.log(t)
      	var p = path.getPointAtLength(t * l);
      	return "translate(" + p.x + "," + p.y + ")";
    };
  };
}

var test = translateAlongPath(path.node());
console.log(test)
var bars = svg.selectAll('.bar')
	.data(points).enter().append('rect').transition().duration(2000)
//  .attrTween('transform', translateAlongPath(path.node()))
  .attr('class', 'bar')
  .attr('width', 10)
  .attr('height', 20)
  .style('fill', function(d) { return z(d)});

var rect = svg.append('rect').attr('width', 10).attr('height', 10);
rect.transition().duration(3400).attrTween('transform', translateAlongPath(path.node()));