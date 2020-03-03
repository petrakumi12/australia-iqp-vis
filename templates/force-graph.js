console.log('hi');
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
};
let darkness = -0.6;

let names_path = 'templates/resources/all_names_new.csv';
let direction_path = 'templates/resources/to_from.csv';

function graph() {
    d3.csv(names_path).then(function (names_json) {
        // console.log(names_json);

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
            const links = data.links;
            const nodes = data.nodes;

            const width = window.innerWidth / 2;
            const height = window.innerHeight;

            // console.log('color', color);
            // console.log('links', links);
            // console.log('nodes', nodes);

            const simulation = d3.forceSimulation(nodes)
                .force("link", d3.forceLink(links).id(d => d.id))
                .force("charge", d3.forceManyBody().strength(-600))
                .force("center", d3.forceCenter(width / 2 , (height / 2) - 20))


            const svg = d3.select("#graph")
                .call(d3.zoom()
                    .on("zoom", function () {
                        svg.selectAll('g')
                            .attr('transform', d3.event.transform);
                    }))
                // .append('svg')
                // .attr('width', width)
                // .attr('height', height)
                // .attr('x', window.innerWidth/2)
                // .attr('y', 0)
                .attr("transform", "translate(" + 15 + ",0)")
                .attr("preserveAspectRatio", "xMidYMid meet")


            // build the arrow.
            svg.append("svg:defs").selectAll("marker")
                .data(nodes)      // Different link/path types can be defined here
                .enter().append("svg:marker")    // This section adds in the arrows
                .attr("id", 'end')
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
                    return (d.effort / 5) + 5
                })
                .attr("fill", function (d, i) {
                    return ColorLuminance(color[org_types.indexOf(d.data)].replace("#", ""), darkness)
                })
                // .attr('fill-opacity', 0.8)
                .attr("stroke", "#262626")
                .attr("stroke-width", 1)
                .attr('class', d => gen_class(d.data))
                .call(drag(simulation));
            //possibly add transpose here


            node.append("title")
                .text(d => 'Org. Name: \n' + d.id + '\n' + 'Category: \n' + d.data)


            simulation.on("tick", () => {
                link
                    .attr("x1", d => d.source.x)
                    .attr("y1", d => d.source.y)
                    .attr("x2", d => d.target.x)
                    .attr("y2", d => d.target.y)

                node
                    .attr("cx", d => d.x)
                    .attr("cy", d => d.y)

            });

            svg.selectAll("circle")
                .on('mouseover', function (d) {
                    mouseover(d, this)
                })
                .on('mouseout', function (d) {
                    mouseout(d, this)
                })

            //dat gui hereeee
            // load_dat_gui(svg.node());

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
    d = d.split(" ").join("");
    d = d.split("t/F").join("");
    d = d.split("n/F").join("");
    d = d.split("s/F").join("");
    d = d.split("&").join("");
    if (d === "") {
        d = "sample"
    }

    return d
}

/**
 * @return {string}
 */
function ColorLuminance(hex, lum) {

    // validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    lum = lum || 0;

    // convert to decimal and change luminosity
    let rgb = "#", c, i;
    for (i = 0; i < 3; i++) {
        c = parseInt(hex.substr(i * 2, 2), 16);
        c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
        rgb += ("00" + c).substr(c.length);
    }

    return rgb;
}


function mouseover(d, obj) {
    // console.log('mouseover', obj)

    d3.selectAll('rect')
        .transition()
        .attr('fill', d => {
            console.log(d)
            // while (d.depth > 1) d = d.parent;
            let col = color[org_types.indexOf(d.data.org_type)].replace("#", "");
            return ColorLuminance(col, darkness);
        })

    d3.select(obj)
        .attr('r', (d.effort / 5) + 15);
    //make all circles darker
    d3.selectAll("circle")
        .transition()
        .duration(250)
        .attr('fill', e => ColorLuminance(color[org_types.indexOf(e.data)].replace("#", ""), darkness))

    //except the ones with the same class
    d3.selectAll('.' + gen_class(d.data))
        .transition()
        .duration(250)
        .attr('fill', color[org_types.indexOf(d.data)])
    // .attr('fill-opacity', 1)
    // .attr('stroke-width', 1.7)


}

function mouseout(d, obj) {
    d3.select(obj)
        .attr('r', (d.effort / 5) + 5);

    // console.log('cur state is', cur_state)
    if (cur_state) {

        d3.selectAll("line")
            .attr('stroke-opacity', 0.3)
            .attr('stroke-width', d => Math.sqrt(d.value))

        d3.selectAll('circle')
            .transition()
            .attr('fill', d => color[org_types.indexOf(d.data)])

        d3.selectAll('rect')
            .transition()
            .attr('fill', d => color[org_types.indexOf(d.data.org_type)])
    }
    else {
        d3.selectAll('circle')
            .transition()
            .attr('fill', d => ColorLuminance(color[org_types.indexOf(d.data)].replace("#", ""), darkness))
        // .attr("stroke", "#262626")
        // .attr('stroke-opacity', 0.3)
        d3.selectAll('rect')
            .transition()
            .attr('fill', d => ColorLuminance(color[org_types.indexOf(d.data.org_type)].replace("#", ""), darkness))
    }

}