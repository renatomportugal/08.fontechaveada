var dataArrayAreas = ["linhaVerdeSemSeta", "linhaTracejadaComSeta", "linhaVermelhaComSeta"];
var dataArrayAreasLegenda = ["Português", "Matemática", "Geografia"];
var dataGroup = ["Básico","Intemediário", "Avançado"];


// This is an adaptation of Mike Bostock's Force Directed Graph https://bl.ocks.org/mbostock/2706022
var links = [
//Data Collection
////Control


{"source":0,"target":1, "type": "linhaVerdeSemSeta"},
{"source":0,"target":2, "type": "linhaVerdeSemSeta"},
{"source":2,"target":2, "type": "linhaVermelhaComSeta"},
{"source":3,"target":3, "type": "linhaVermelhaComSeta"},
{"source":1,"target":0, "type": "linhaTracejadaComSeta"},
{"source":4,"target":4, "type": "linhaVerdeSemSeta"},
{"source":5,"target":5, "type": "linhaVerdeSemSeta"},

// {"source":0,"target":2, "type": 1},
// {"source":0,"target":1, "type": 2},
// {"source":2,"target":2, "type": 0},
// {"source":3,"target":3, "type": 0},
// {"source":4,"target":4, "type": 0},


///////  LAST LINE -- NOTHING FOLLOWS  ////// 
];
var nodes = [
    {"name": "Item01" ,"group": "Control"},
    {"name": "Item02" ,"group": "Control"},
    {"name": "Item03" ,"group": "Internet"},
    {"name": "Item04" ,"group": "External"},
    {"name": "Item05" ,"group": "External"},
    {"name": "Item06" ,"group": "External"},


    // {"name": "Item01" ,"group": dataGroup[0]},
    // {"name": "Item02" ,"group": dataGroup[1]},
    // {"name": "Item03" ,"group": dataGroup[0]},
    // {"name": "Item04" ,"group": dataGroup[0]},
    // {"name": "Item05" ,"group": dataGroup[2]},

];
var width = 1200,
    height = 800;
var color = d3.scale.category20();
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);
var force = d3.layout.force()
    .nodes(nodes)
    .links(links)
    .size([width, height])
    .charge(-600)
    .linkDistance(150)
    .start();
    
// build the arrow.
svg.append("defs").selectAll("marker")
    // .data(["bidirectional","ESB","one-directional"])      
    .data(dataArrayAreas)      
  .enter().append("marker")    
    .attr("id", String)
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 30)
    .attr("refY", 0)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
  .append("path")
    .attr("d", "M0,-5L10,0L0,5");
//var link = svg.selectAll(".link")
var link = svg.append("g").selectAll(".link")
    .data(links)
    .enter().append("line")
    .attr("class", "link")

    

    // .attr("class", function(d) { 
    //     let ttt = d.type
    //     console.log(ttt)
    //     return "link " + ttt; 
    // })    
    // .attr("marker-end", function(d) {
    //     let ttt = d.type
    //     // console.log(ttt)
    //     return "url(#" + ttt + ")"; 
    // });

    .attr("class", function(d) { return "link " + d.type; })    
    .attr("marker-end", function(d) { return "url(#" + d.type + ")"; });
    
    
    
// You define here your nodes and the color will be d.group
var node = svg.selectAll(".node")
    .data(nodes)
    .enter().append("g")
    .attr("class", "node")
    .on('click',click)
    .on('dblclick', connectedNodes)
    .call(force.drag);
//For each node, we'll count the number of links and set 
//the size based on that, using cube root to keep things "smaller" relative
//to each other. Then, set the color based on which group its in
node.append("circle")
      .attr("r",function(d) {return Math.cbrt(d.weight) * 6;})
      .style("fill", function (d) {return color(d.group);})
node.append("text")
      .attr("dx", 10)
      .attr("dy", ".35em")
      .text(function(d) { return d.name });
    
//Display node name when mouse on a node
node.append("title")
    .text(function(d) { return d.name; });
    
force.on("tick", function (e) {
    link.attr("x1", function (d) {return d.source.x;})
    	.attr("y1", function (d) {return d.source.y;})
    	.attr("x2", function (d) {return d.target.x;})
    	.attr("y2", function (d) {return d.target.y;});
    node.attr("transform", function(d) { 
	return "translate(" + d.x + "," + d.y + ")"; });
   
    node.each(collide(0.5)); //collision detection
    
});
// Single Mouse Click Action
// action to take on mouse click
function click() {
    d3.select(this).classed("fixed", d3.fixed = true);
}
//Dragging nodes
var drag = force.drag()
    .on("dragstart", dragstart);var drag = force.drag()
    .on("dragstart", dragstart);
function dragstart(d) {
  d3.select(this).classed("fixed", d.fixed = true);
}
//Collision detection
var padding = 2, // separation between circles
    radius=10;
function collide(alpha) {
  var quadtree = d3.geom.quadtree(nodes);
  return function(d) {
    var rb = 2*radius + padding,
        nx1 = d.x - rb,
        nx2 = d.x + rb,
        ny1 = d.y - rb,
        ny2 = d.y + rb;
    quadtree.visit(function(quad, x1, y1, x2, y2) {
      if (quad.point && (quad.point !== d)) {
        var x = d.x - quad.point.x,
            y = d.y - quad.point.y,
            l = Math.sqrt(x * x + y * y);
          if (l < rb) {
          l = (l - rb) / l * alpha;
          d.x -= x *= l;
          d.y -= y *= l;
          quad.point.x += x;
          quad.point.y += y;
        }
      }
      return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
    });
  };
}
//Toggle stores whether the highlighting is on
var toggle = 0;
//Create an array logging what is connected to what
var linkedByIndex = {};
for (i = 0; i < links.length; i++) {
    linkedByIndex[i + "," + i] = 1;
};
links.forEach(function (d) {
    linkedByIndex[d.source.index + "," + d.target.index] = 1;
});
//This function looks up whether a pair are neighbours
function neighboring(a, b) {
    return linkedByIndex[a.index + "," + b.index];
}
function connectedNodes() {
    if (toggle == 0) {
        //Reduce the opacity of all but the neighbouring nodes
        d = d3.select(this).node().__data__;
        node.style("opacity", function (o) {
            return neighboring(d, o) | neighboring(o, d) ? 1 : 0.1;
        });
        link.style("opacity", function (o) {
            return d.index==o.source.index | d.index==o.target.index ? 1 : 0.1;
        });
        //Reduce the op
        toggle = 1;
    } else {
        //Put them back to opacity=1
        node.style("opacity", 1);
        link.style("opacity", 1);
        toggle = 0;
    }
}
//Legend
var legend = svg.selectAll(".legend")
    .data(color.domain())
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
legend.append("rect")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", color);
legend.append("text")
    .attr("x", width - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function(d) { return d; });
 
// adding Huan Zang's filter box https://jsfiddle.net/zhanghuancs/cuyu8
    // Method to create the filter
    createFilter();

    // Method to create the filter, generate checkbox options on fly
    function createFilter() {
        d3.select(".filterContainer").selectAll("div")
        //   .data(["ESB", "bidirectional", "one-directional"])
          .data(dataArrayAreasLegenda)
          .enter()  
          .append("div")
          .attr("class", "checkbox-container")
          .append("label")
          .each(function (d) {
                // create checkbox for each data
                d3.select(this).append("input")
                  .attr("type", "checkbox")
                  .attr("id", function (d) {

                    //_A partir da legenda, colocar o estilo
                    //   return "chk_" + d;

                    for (let idxA = 0; idxA < dataArrayAreasLegenda.length; idxA++) {
                        const element = dataArrayAreasLegenda[idxA];
                        if (d == element) {
                            d = dataArrayAreas[idxA]
                        }
                    }
                    return "chk_" + d;

                   })
                  .attr("checked", true)
                  .on("click", function (d, i) {
                      // register on click event

                    // console.log(d)
                    for (let idxA = 0; idxA < dataArrayAreasLegenda.length; idxA++) {
                        const element = dataArrayAreasLegenda[idxA];
                        if (d == element) {
                            d = dataArrayAreas[idxA]
                        }
                    }

                      var lVisibility = this.checked ? "visible" : "hidden";
                      filterGraph(d, lVisibility);
                   })
                d3.select(this).append("span")
                    .text(function (d) {
                        return d;
                    });
        });
        $("#sidebar").show();
    }
    // Method to filter graph
 
function filterGraph(aType, aVisibility){

        link.style("visibility", function (o) {
         var lOriginalVisibility = $(this).css("visibility");
        //  console.log("o.type: "+o.type)
        //  console.log("aType: "+aType)
         return o.type === aType ? aVisibility : lOriginalVisibility;
         });      
   
       // change the visibility of the node
        // if all the links with that node are invisibile, the node should also be invisible
        // otherwise if any link related to that node is visibile, the node should be visible
        node.style("visibility", function (o, i) {
           var lHideNode = true;
            link.each(function (d, i) {
                if (d.source === o || d.target === o) {
                    if ($(this).css("visibility") === "visible") {
                        lHideNode = false;
                         // we need show the text for this circle
                        d3.select(d3.selectAll(".nodeText")[0][i]).style("visibility", "visible");
                        return "visible";
                }
                } 
            });
            if (lHideNode) {
                // we need hide the text for this circle 
                d3.select(d3.selectAll(".nodeText")[0][i]).style("visibility", "hidden");
                return "hidden";
            }
  
        });
  
}

////////// END OF SCRIPT //////////