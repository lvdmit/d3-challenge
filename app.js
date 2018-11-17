// @TODO: YOUR CODE HERE!
var svgWidth = 800;
var svgHeight = 560;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
d3.csv("data.csv", function(data){
  data.poverty = +data.poverty;
  data.healthcare = +data.healthcare;
  return data;
}).then(function(data) {
  console.log(data);
  //Create Scales
var xScale = d3.scaleLinear()
    .domain([8, d3.max(data,function(d){
    return +d.poverty;
  })])
    .range([0, width]);

var yScale = d3.scaleLinear()
  .domain([2, d3.max(data,function(d){
  return +d.healthcare;
  })])
  .range([height, 0]);

  //Create the axis functions.
  var bottomAxis = d3.axisBottom(xScale);
  var leftAxis = d3.axisLeft(yScale);

    // Add bottomAxis and leftAxis
  chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);
  chartGroup.append("g")
      .call(leftAxis);   

  // Append circles to data points
  var circlesGroup = chartGroup.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d, i) => xScale(d.poverty)) 
      .attr("cy", d => yScale(d.healthcare))
      .attr("r", "15")
      .classed("stateCircle", true)

  // Append state abbreviation to circles 
  chartGroup.selectAll("text")  
        .data(data)
        .enter()
        .append("text")
        .attr("x", (d, i) => xScale(d.poverty)) 
        .attr("y", d => (yScale(d.healthcare-0.28)))
        .classed("stateText", true)
        .text(d => d.abbr)
        //add toolTip because text units are over circle units
        .on("mouseover", function(d) {
          toolTip.show(d);
        })
        // onmouseout event
        .on("mouseout", function(d, i) {
          toolTip.hide(d);
        });;

  
  // var circleText = d3.select("circle").selectAll("text")
  // .enter()
  // .append("text")
  // .attr("class", "stateText")
  // .attr("x", (d, i) => xScale(d.poverty)) 
  // .attr("y", d => (yScale(d.healthcare-0.28)))
  // .text(function(d, i) {
  //   return (d.poverty);
  // });

  // chartGroup.call(circleText);

      
  // x-axis labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .classed("aText", true)
    .attr("data-axis-name", "healthcare")
    .text("Lacks Healthcare(%)");

  // y-axis labels
  chartGroup.append("text")
  .attr("transform", "translate(" + width / 2 + " ," + (height + margin.top + 20) + ")")
  .attr("data-axis-name", "poverty")
  .classed("aText", true)
  .text("In Poverty (%)");

  // Initialize tool tip
   var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.abbr}<br>Poverty: ${d.poverty}%<br>Healthcare: ${d.healthcare}%`);
    });

    
// Create tooltip in the chart
  chartGroup.call(toolTip);

  // Create event listeners to display and hide the tooltip
  circlesGroup.on("mouseover", function(d) {
    toolTip.show(d);
  })
    // onmouseout event
    .on("mouseout", function(d, i) {
      toolTip.hide(d);
    });
 

 });




