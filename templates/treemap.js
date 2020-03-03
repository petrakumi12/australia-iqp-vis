function treemap() {
    d3.csv(names_path).then(function (names_json) {
        data = {
            name: "EcoCentre",
            children: {}
        }
        let children_arr = [];
        let org_arr = d3.map(names_json, d => d.org_type).keys();
        for (let org of org_arr) {
            let children_dict = {};
            children_dict.name = org;
            children_dict.children = [];
            names_json.forEach(d => {
                if (d.org_type === org) {
                    children_dict.children.push(d)
                }
            });
            children_arr.push(children_dict)
        }
        data.children = children_arr;
        console.log(data);
        return data
    }).then(function (data) {

        let width = window.innerWidth / 2;
        let height = window.innerHeight ;

        const x = d3.scaleLinear().rangeRound([0, width]);
        const y = d3.scaleLinear().rangeRound([0, height]);

        // let color = d3.scaleOrdinal(d3.schemeCategory10);

        let treemap = data => d3.treemap()
            .size([width, height])
            .padding(1)
            .round(true)
            (d3.hierarchy(data)
                .sum(d => d.effort)
                .sort((a, b) => b.effort - a.effort));


        const svg = d3.select("#tree")
            .style('width', width)
            .style('height', height)
            // .style("font", "4px");

        let group = svg.append("g")
            .call(render, treemap(data));

        function render(group, root) {

            // const root = treemap(data);
            // console.log(root.leaves())

            const leaf = svg.selectAll("g")
                .data(root.leaves())
                .join("g")
                .attr("transform", d => `translate(${d.x0},${d.y0})`)
                .attr("cursor", "pointer")
                .on("mouseover", mouseover_tree)
                .on("mouseout", mouseout_tree);


            console.log(data);

            leaf.append("title")
                .text(d => d.data.name);

            leaf.append("rect")
                .attr("id", d => d.name)
                .attr("class", d => gen_class(d.data.org_type))
                .attr("fill", d => {
                    while (d.depth > 1) d = d.parent;
                    return ColorLuminance(color[org_types.indexOf(d.data.name)].replace("#", ""), darkness);
                })
                .attr("fill-opacity", 0.6)
                .attr("width", d => d.x1 - d.x0)
                .attr("height", d => d.y1 - d.y0);

            leaf.append("clipPath")
                .attr("id", d => d.data.id)
                .append("use")

            leaf.append("text")
                .attr("clip-path", d => d.data.id)
                .selectAll("tspan")
                .data(d => d.data.name.split(/(?=[A-Z][a-z])|\s+/g).concat(d.value))
                .join("tspan")
                .attr("x", 3)
                .attr("y", (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`)
                .attr("fill-opacity", (d, i, nodes) => i === nodes.length - 1 ? 0.7 : null)
                .text(d => d);

            group.call(position, root);

        }

        function position(group, root) {
            group.selectAll("g")
                .attr("transform", d => d === root ? `translate(0,-30)` : `translate(${x(d.x0)},${y(d.y0)})`)
                .select("rect")
                .attr("width", d => d === root ? width : x(d.x1) - x(d.x0))
                .attr("height", d => d === root ? 30 : y(d.y1) - y(d.y0));
        }
        return svg.node();

    })


}

function mouseover_tree(d, i) {
    console.log('mouseover', d, i);
    d3.selectAll('rect')
        .transition()
        .attr('fill', d => {
            console.log(d)
            // while (d.depth > 1) d = d.parent;
            let col = color[org_types.indexOf(d.data.org_type)].replace("#", "");
            return ColorLuminance(col, darkness);
        });

    d3.selectAll('circle')
        .transition()
        .attr('fill', d => {
            let col = color[org_types.indexOf(d.data)].replace("#", "");
            return ColorLuminance(col, darkness);
        });

    console.log('type', d.data.org_type);
    d3.selectAll("." + gen_class(d.data.org_type))
        .transition()
        .attr('fill', color[org_types.indexOf(d.data.org_type)]);
}

function mouseout_tree(d, i) {

    if (cur_state) {

        d3.selectAll("line")
            .attr('stroke-opacity', 0.3)
            .attr('stroke-width', d => Math.sqrt(d.value));

        d3.selectAll('circle')
            .transition()
            .attr('fill', d => color[org_types.indexOf(d.data)]);

        d3.selectAll('rect')
            .transition()
            .attr('fill', d => color[org_types.indexOf(d.data.org_type)]);
    }
    else {
        d3.selectAll('circle')
            .transition()
            .attr('fill', d => ColorLuminance(color[org_types.indexOf(d.data)].replace("#", ""), darkness));

        d3.selectAll('rect')
            .transition()
            .attr('fill', d => ColorLuminance(color[org_types.indexOf(d.data.org_type)].replace("#", ""), darkness));
    }
}