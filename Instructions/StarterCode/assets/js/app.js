// @TODO: YOUR CODE HERE!
function makeResponsive(){
    // check to see if SVG is empty (remember, svg item will be added later in the code)
    var graphArea = d3.select("body").select("svg");
    
    if (!graphArea.empty()){
        graphArea.remove();
    }

    // create variables that store the current width/heigth of window browser
    var svgWidth = window.innerWidth;
    var svgHeight = window.innerHeight;

    var margin = {
        top: 50,
        bottom: 50,
        right: 50,
        left: 50
    };

    // define the chart area minus the margins
    var height = svgHeight - margin.top - margin.bottom;
    var width = svgWidth - margin.left - margin.right;

    // create the svg item to reflect within html code
    var svg = d3
        .select("#scatter")
        .append("svg")
        .attr("height", svgHeight)
        .attr("width", svgWidth);
    
    // the graph will shift accoring to the margins
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    d3.csv('../data/data.csv')
     .then(function(healthData){
        // parse through the csv data
        healthData.forEach(function(data){
            console.log(data);
         
            // choose which variables you wish to display
            data.obesity = +data.obesity;
            data.poverty = +data.poverty;
            data.abbr = data.abbr;
        });

        // create x axis scale
        // because the data is numeric(date/time, categorical, etc.) you will use ScaleLinear
        var xScale = d3.scaleLinear()
        //
        .domain([0,d3.max(healthData, d => d.obesity)])
        // the range is from 0 to however wide our graph is
        .range([0, width]);

        // create y axis scale
        var yScale = d3.scaleLinear()
        .domain([0, d3.max(healthData, d => d.poverty)])
        // height is listed first because the top left coordinate is 0,0
        // for the d3 noobs that dont understand this go to http://www.d3noob.org/2012/12/setting-scales-domains-and-ranges-in.html
        .range([height, 0]);

        //create x and y axes
        var xAxis = d3.axisBottom(xScale).ticks(7);
        var yAxis = d3.axisLeft(yScale).ticks(11);

        //append the axes you just created
        chartGroup.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(xAxis);
        
        chartGroup.append("g")
            .call(yAxis);
        
        // create and append the data points in the form of a scatter plot
        var scatterCircles = chartGroup.selectAll("circle")
            .data(healthData)
            .enter()
            .append("circle")
            .attr("cx", d => xScale(d.obesity))
            .attr("cy", d => yScale(d.poverty))
            .attr("r", "20")
            .attr("fill", "gold")
            .attr("opacity", ".5")
            
        
            chartGroup.selectAll("text")
            .data(healthData)
            .enter()
            .append("text")
            .text(d => d.abbr)
            .attr("x", d => xScale(d.obesity))
            .attr("y", d => yScale(d.poverty))
            .attr("text-anchor", "middle")

        
            chartGroup.append("text")
            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate("+ (width/2) +","+(height-((margin.top-margin.bottom)-40)+")"))  // centre below axis
            .text("Obesity Level")
            
            chartGroup.append("text")
            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate("+ ((margin.top-100)/2) +","+(height/2)+")rotate(-90)")  // centre below axis
            .text("Poverty Level")
       // var obesityLabel_X = labels

        
        
        
    }
     )

}

makeResponsive();

d3.select(window).on("resize", makeResponsive);
