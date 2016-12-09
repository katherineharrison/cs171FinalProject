// Timeline Visualization
Timeline = function(_parentElement, _data){
	this.parentElement = _parentElement;
	this.data = _data;
	this.displayData = _data;

	this.initVis();
};

Timeline.prototype.initVis = function() {
	var vis = this;

	vis.margin = { top: 40, right: 0, bottom: 60, left: 60 };

	vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right,
		vis.height = 300 - vis.margin.top - vis.margin.bottom;

	// SVG drawing area
	vis.svg = d3.select("#" + vis.parentElement).append("svg")
		.attr("width", vis.width + vis.margin.left + vis.margin.right)
		.attr("height", vis.height + vis.margin.top + vis.margin.bottom)
		.append("g")
		.attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

	vis.x = d3.time.scale()
		.range([0, vis.width]);

	vis.xAxis = d3.svg.axis()
		.scale(vis.x)
		.orient("top");

	vis.focus = vis.svg.append("g")
        .style("display", "none");

	// vis.xMap = function(d) { return vis.x(d.dateend);};

	vis.svg.append("g")
		.attr("class", "x-axis axis");

	var line = vis.svg.select("g")
		.append("line")
		.attr("class", "line")
		.style("opacity", 0);

	vis.cValue = function(d) { return d.classification;};
	vis.color = d3.scale.category20();

	// TO-DO: Initialize brush component
	// Initialize brush component
	var brush = d3.svg.brush()
		.x(vis.x)
		.on("brush", brushed);

	vis.brush = brush;

	// TO-DO: Append brush component here
	vis.svg.append("g")
		.attr("class", "brush")
		.call(brush)
		.selectAll("rect")
		.attr("y", -6)
		.attr("transform", "translate(0, 0)")
		.attr("height", vis.height);

	vis.wrangleData();
};

Timeline.prototype.wrangleData = function() {
	var vis = this;

	var selectBox = document.getElementById("selectBoxMedium");
	var selection = selectBox.options[selectBox.selectedIndex].value;

	console.log(selection);

	vis.displayData = vis.data;

	vis.displayData.sort(function(a,b) {
		return (a.dateend - b.dateend);
	});

	if (selection == "all") {
		vis.displayData = vis.data;
	}
    else if (selection == "Paintings") {
        vis.svg.select("line").remove();
		vis.displayData = vis.displayData.filter(function(d) {
			return d.classification == "Paintings";
		});    
    }
    else if (selection == "Prints") {
        vis.svg.select("line").remove();
		vis.displayData = vis.displayData.filter(function(d) {
			return d.classification == "Prints";
		}); 
    }
    else if (selection == "Drawings") {
        vis.svg.select("line").remove();
		vis.displayData = vis.displayData.filter(function(d) {
			return d.classification == "Drawings";
		}); 
    }
    else if (selection == "Photographs") {
        vis.svg.select("line").remove();
		vis.displayData = vis.displayData.filter(function(d) {
			return d.classification == "Photographs";
		}); 
    }
    else if (selection == "Sculpture") {
        vis.svg.select("line").remove();
		vis.displayData = vis.displayData.filter(function(d) {
			return d.classification == "Sculpture";
		}); 
    }
    else if (selection == "Vessels") {
        vis.svg.select("line").remove();
		vis.displayData = vis.displayData.filter(function(d) {
			return d.classification == "Vessels";
		}); 
    }
    else if (selection == "Artists' Tools") {
        vis.svg.select("line").remove();
		vis.displayData = vis.displayData.filter(function(d) {
			return d.classification == "Artists' Tools";
		}); 
    }
    else if (selection == "Multiples") {
        vis.svg.select("line").remove();
		vis.displayData = vis.displayData.filter(function(d) {
			return d.classification == "Multiples";
		}); 
    }
    else if (selection == "Books") {
        vis.svg.select("line").remove();
		vis.displayData = vis.displayData.filter(function(d) {
			return d.classification == "Books";
		}); 
    }
    else if (selection == "Textile Arts") {
        vis.svg.select("line").remove();
		vis.displayData = vis.displayData.filter(function(d) {
			return d.classification == "Textile Arts";
		}); 
    }
    else if (selection == "Medals and Medallions") {
        vis.svg.select("line").remove();
		vis.displayData = vis.displayData.filter(function(d) {
			return d.classification == "Medals and Medallions";
		}); 
    }
    else if (selection == "Furnitures") {
        vis.svg.select("line").remove();
		vis.displayData = vis.displayData.filter(function(d) {
			return d.classification == "Furnitures";
		}); 
    }
    else {
        vis.svg.select("line").remove();
		vis.displayData = vis.displayData.filter(function(d) {
			return d.classification == "Other";
		}); 
    }

	vis.x.domain(d3.extent(vis.displayData, function (d) {
		return d.dateend;
	}));

	vis.updateVis();

	// TO DO


};

Timeline.prototype.updateVis = function() {
	var vis = this;

	console.log(vis.displayData.length);

	// Call axis functions with the new domain
	vis.svg.select(".x-axis").call(vis.xAxis);

	var tooltip = d3.select("body").append("div")
		.attr("class", "tooltip")
		.style("opacity", 0);

	var cValue = function(d) { return d.classification;},
		color = d3.scale.category20();

	var formatTime = d3.time.format("%Y");

	vis.timeArray = [0,1];

	// vis.svg.selectAll('.brush').remove();	

	vis.dot = vis.svg.selectAll('.dot').data(vis.displayData);

	vis.dot.enter().append("circle").attr("class", "dot");

	vis.dot.exit().remove();

	vis.dot.style("opacity", 0.5)
		.attr("r", 2)
		.attr("cx", function(d) {
			return vis.x(d.dateend);
		})
		.attr("cy", function(d) {
			if (vis.timeArray[0] == 0) {
				vis.timeArray[0] = d.dateend;
				return (2 * vis.timeArray[1]);
			}
			else if (vis.timeArray[0] >= d.dateend) {
				vis.timeArray[1] = vis.timeArray[1] + 1;
				return (2 * vis.timeArray[1]);
			}
			else {
				vis.timeArray[0] = d.dateend;
				vis.timeArray[1] = 1;
				return (2 * vis.timeArray[1]);
			}

			// if (d.classification == "Paintings") {
			// 	return 10;
			// }
			// else if (d.classification == "Prints") {
			// 	return 20;
			// }
			// else if (d.classification == "Drawings") {
			// 	return 30;
			// }
			// else if (d.classification == "Photographs") {
			// 	return 40;
			// }
			// else if (d.classification == "Sculpture") {
			// 	return 50;
			// }
			// else if (d.classification == "Vessels") {
			// 	return 60;
			// }
			// else if (d.classification == "Artists' Tools") {
			// 	return 70;
			// }
			// else if (d.classification == "Multiples") {
			// 	return 80;
			// }
			// else if (d.classification == "Books") {
			// 	return 90;
			// }
			// else if (d.classification == "Textile Arts") {
			// 	return 100;
			// }
			// else if (d.classification == "Medals and Medallions") {
			// 	return 110;
			// }
			// else if (d.classification == "Furnitures") {
			// 	return 120;
			// }
			// else {
			// 	return 130;
			// }
		})
		.style("fill", function(d) {
			return vis.color(vis.cValue(d));
		})
		.on("mouseover", function(d) {
			// tooltip.transition()
			// 	.duration(200)
			// 	.style("opacity", .9)
			// 	.style("background", "white");
			// tooltip.html(d.title + "<br/>" + formatTime(d.dateend) + " " + d.classification)
			// 	.style("left", (d3.event.pageX + 5) + "px")
			// 	.style("top", (d3.event.pageY - 28) + "px");
		})
		.on("mouseout", function(d) {
			// tooltip.transition()
			// 	.duration(500)
			// 	.style("opacity", 0);
		})
		.on("click", onclick)


	// information on click 
	var infoTable = d3.select("#timecard");
		infoTable.append("h2").attr("id", "title");
		infoTable.append("div")
			.data(vis.displayData)
			.attr("id", "stats")
			.attr("class", "table");

	// onclick update info on table
	function onclick(d){

		console.log(d);

		// var imagesObject = d.images;
  //    	if(imagesObject.length > 0) {
		// 	$("#" + vis.parentElement + "Image").html("<img class='colorImage' src=" + imagesObject[0].baseimageurl + ">");
		// }
		// $("#" + vis.parentElement + "Info").html(d.title);

			    vis.focus.append("line")
		        .attr("class", "x")
		        .style("stroke", "black")
		.on("click", function(d) {
			// the height is cy

			vis.svg.select("line").remove();

			vis.focus.append("line")
				.attr("class", "line")
				.style("stroke", "black")
				.attr("y1", 0)
				.attr("y2", function () {
					if (d.classification == "Paintings") {
						return 10;
					}
					else if (d.classification == "Prints") {
						return 20;
					}
					else if (d.classification == "Drawings") {
						return 30;
					}
					else if (d.classification == "Photographs") {
						return 40;
					}
					else if (d.classification == "Sculpture") {
						return 50;
					}
					else if (d.classification == "Vessels") {
						return 60;
					}
					else if (d.classification == "Artists' Tools") {
						return 70;
					}
					else if (d.classification == "Multiples") {
						return 80;
					}
					else if (d.classification == "Books") {
						return 90;
					}
					else if (d.classification == "Textile Arts") {
						return 100;
					}
					else if (d.classification == "Medals and Medallions") {
						return 110;
					}
					else if (d.classification == "Furnitures") {
						return 120;
					}
					else {
						return 130;
					}
				})
				.attr("x1", vis.x(d.dateend))
				.attr("x2", vis.x(d.dateend));
		});

			vis.focus.style("display", null);
			// var line = d3.line()
			   //  		.x(function(d) { return cx; })
			   //  		.y(function(d) { return cy; })
			   //  		.style("fill", "black");
			// the height is cy
			// var line = d3.line()
				// .x(function(d) { return cx; })
				// .y(function(d) { return cy; })
				// .style("fill", "black");
	

		document.getElementById("title").innerHTML
			= "<h2>" + d.title + "</h2>";

		document.getElementById("stats").innerHTML
			= "<table><tr><th>Year: </th><td>" + formatTime(d.dateend)
            + "</td></tr><tr><th>Medium: </th><td>" + d.classification
            + "</td></tr></tr></table>";

  //       document.getElementById("pic").innerHTML
  //       	= var imagesObject = d.images;
  //    	if(imagesObject.length > 0) {
		// 	$("#" + vis.parentElement + "Image").html("<img class='colorImage' src=" + imagesObject[0].baseimageurl + ">");
		// }
		// $("#" + vis.parentElement + "Info").html(d.title);
	}

		// });


	// TO DO
};
