console.log('hi');
let names_path = 'resources/all_names_new.csv';
let direction_path = 'resources/to_from.csv';
let org_types = ['Business', 'Community Organization', 'Eduation', 'Education', 'Government', 'Local Government', 'Other', 'State Government', 'Trust/Foundation', 'Trust/Foundation/Foundation', 'Trust/Foundations/Foundation', 'Target','']
let color = ["#4e79a7", "#f28e2c", "#e15759", "#e15759", "#76b7b2", "#59a14f", "#edc949", "#af7aa1", "#ff9da7", "#9c755f", "#9c755f", "#9c755f", "#bab0ab", "#fffff"];
let map = {
    0: 'zero',
    1: 'one',
    2: 'two',
    3: 'three',
    4: 'four',
    5: 'five',
    6: 'six',
    7: 'seven',
    8: 'eight',
    9: 'nine'
}
window.onload = function () {
    // type_logo()
    graph()
    // document.getElementById('the-btn').addEventListener('click', remove_div)


}

function type_logo() {
    new Typed('#typed', {
        strings: ["<b>Mapping Knowledge Flows Between Nonprofit Organizations</b><br/><br/>" +
        "This is an interactive visualization of all entities that the <br/>" +
        "Port Phillip EcoCentre in Australia has developed programs or partnerships with. <br/><br/>" +
        "The radius of each circle represents the number of partnership hours with the respective organization<br/>" +
        "while the direction of the arrows show the direction of the partnership. <br/><br/>" +
        "Hover over nodes to learn more about them!^1000", ""],
        typeSpeed: 2,
        // startDelay: 50,
        showCursor: false,
        fadeOut: true
    })
}

function graph() {
    d3.csv(names_path).then(function (names_json) {
        console.log(names_json);

        d3.csv(direction_path).then(function (dirs_json) {
            delete names_json['columns'];
            delete dirs_json['columns'];
            names_arr = [];
            for (let element in Object.keys(names_json)) {
                names_arr.push({
                    'id': names_json[element]['name'],
                    'data': names_json[element]['org_type'],
                    'effort': names_json[element]['effort']
                })
            }

            links_arr = [];
            for (let element in Object.keys(dirs_json)) {
                let from = "";
                let to = "";
                for (let i in Object.keys(names_json)) {
                    if (names_json[i]['name'] === dirs_json[element]['from']) {
                        from = names_json[i]['name']
                    }
                    if (names_json[i]['name'] === dirs_json[element]['to']) {
                        to = names_json[i]['name']
                    }
                }
                links_arr.push({
                    source: from,
                    target: to
                })
            }
            // console.log('names arr', names_arr);
            // console.log('links arr', links_arr);
            return {
                nodes: names_arr,
                links: links_arr
            }
        }).then(function (data) {
            // make_chart(data)
            const links = data.links
            const nodes = data.nodes

            var margin = {top: 10, right: 10, bottom: 10, left: 10},
                width = window.innerWidth + 10,
                height = window.innerHeight + 10;


            console.log('color', color)


            console.log('links', links)
            console.log('nodes', nodes)

            const simulation = d3.forceSimulation(nodes)
                .force("link", d3.forceLink(links).id(d => d.id))
                .force("charge", d3.forceManyBody().strength(-600))
                .force("center", d3.forceCenter(width / 2, (height / 4) + (height / 2)))


            const svg = d3.select("#viz")
                .call(d3.zoom()
                // .scaleExtent([1, 40])
                    .on("zoom", function () {
                        svg.selectAll('g')
                            .attr('transform', d3.event.transform);
                    }))
                .append('svg')
                .attr('width', width)
                .attr('height', height)
                .attr('x', 0)
                .attr('y', 0)
                .attr("transform", "translate(" + width / 2 + ",0), scale(2)")
                .attr("preserveAspectRatio", "xMidYMid meet")


            // build the arrow.
            svg.append("svg:defs").selectAll("marker")
                .data(["end"])      // Different link/path types can be defined here
                .enter().append("svg:marker")    // This section adds in the arrows
                .attr("id", String)
                .attr("viewBox", "0 -5 10 10")
                .attr("refX", 15)
                .attr("refY", -1.5)
                .attr("markerWidth", 6)
                .attr("markerHeight", 6)
                .attr("orient", "auto")
                .append("svg:path")
                .attr("d", "M0,-5L10,0L0,5")
                .attr("fill", "#949494")
                .attr("fill-opacity", 1)
                .attr("stroke", "#949494");


            const link = svg.append("g")
                .attr("stroke", "#949494")
                .attr("stroke-opacity", 0.6)
                .selectAll("line")
                .data(links)
                .join("line")
                .attr('class', d => gen_class(d.source.data))
                .attr('class', d => gen_class(d.target.data))
                .attr("stroke-width", d => Math.sqrt(d.value))
                .attr("marker-end", "url(#end)");


            const node = svg.append("g")
                .selectAll("circle")
                .data(nodes)
                .join("circle")
                .attr("r", function (d) {
                    return d.effort / 8 + 5
                })
                .attr("fill", function (d, i) {
                    return color[org_types.indexOf(d.data)]
                })

                .attr("stroke", "#262626")
                .attr("stroke-width", 1.5)
                .attr('class', d => gen_class(d.data))
                .call(drag(simulation));


            node.append("title")
                .text(d => 'Org. Name: \n' + d.id + '\n' + 'Category: \n' + d.data)


            simulation.on("tick", () => {
                link
                    .attr("x1", d => d.source.x)
                    .attr("y1", d => d.source.y)
                    .attr("x2", d => d.target.x)
                    .attr("y2", d => d.target.y);

                node
                    .attr("cx", d => d.x)
                    .attr("cy", d => d.y)
                    .on('mouseover', function (d) {
                        //make all circles darker visible
                        d3.selectAll("circle")
                            .attr('fill', e=>ColorLuminance(color[org_types.indexOf(e.data)].replace("#",""),-0.8))

                        //make all lines less visible and thinner
                        d3.selectAll("line")
                            .attr('stroke-opacity', 0.3)

                        //except the ones with the same class
                        d3.selectAll('.' + gen_class(d.data))
                            .attr('fill', color[org_types.indexOf(d.data)])
                            .attr('fill-opacity', 1)
                            .attr('stroke-width', 1.7)

                        //transition the radius of current selection to be bigger
                        d3.select(this).transition()
                            .attr('r', function (d) {
                                return d.effort / 8 + 10
                            })
                    })
                    .on('mouseout', function (d) {

                        //bring back stroke width and radius for cur circle
                        d3.select(this).transition()
                            .attr("stroke-width", 2)
                            .attr('r', d.effort / 10 + 5)
                        //bring back opacity and width for all other circles
                        d3.selectAll("circle")
                            .attr('fill', d =>  color[org_types.indexOf(d.data)])
                            .attr('fill-opacity', 1)
                            .attr('stroke-width', 2)
                        //bring back width and opacity of lines
                        d3.selectAll("line")
                            .attr('stroke-opacity', 0.3)
                            .attr('stroke-width', d => Math.sqrt(d.value))

                    })

            });

            return svg.node();

        })
    })

    drag = simulation => {

        function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }

        function dragended(d) {
            if (!d3.event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }


}

function gen_class(d) {
    str = "Test abc test test abc test...".split("abc").join("");
    d = d.split(" ").join("");
    d = d.split("t/F").join("");
    d = d.split("&").join("");

    return d
}

function remove_div() {
    console.log('hereee')
    document.getElementById('help-text').style = "opacity:0; animation: 1s ease-out 0s 1 slideOutFromLeft"
    document.getElementById('the-btn').innerText = "Click here to show intro text"
    document.getElementById('the-btn').removeEventListener('click', remove_div)
    document.getElementById('the-btn').addEventListener('click', show_div)

}

function show_div() {
    console.log('hereee')
    document.getElementById('help-text').style = "opacity:1; animation: 1s ease-out 0s 1 slideInFromLeft"
    document.getElementById('the-btn').innerText = "Click here to hide intro text"
    document.getElementById('the-btn').addEventListener('click', remove_div)
    document.getElementById('the-btn').removeEventListener('click', show_div)
}

function lighten_darken(col, amt) {
  col = parseInt(col, 16);
  let val =  (((col & 0x0000FF) + amt) | ((((col >> 8) & 0x00FF) + amt) << 8) | (((col >> 16) + amt) << 16)).toString(16);
  // console.log(val)
    return val
}

function ColorLuminance(hex, lum) {

	// validate hex string
	hex = String(hex).replace(/[^0-9a-f]/gi, '');
	if (hex.length < 6) {
		hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
	}
	lum = lum || 0;

	// convert to decimal and change luminosity
	var rgb = "#", c, i;
	for (i = 0; i < 3; i++) {
		c = parseInt(hex.substr(i*2,2), 16);
		c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
		rgb += ("00"+c).substr(c.length);
	}

	return rgb;
}

