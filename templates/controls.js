let cur_state = false;

function toggle_selectAll(tf) {
    if (tf === 'Select All') {
        cur_state = true;
        cur_selected = org_types;
        select_all()
    } else {
        cur_state = false;
        deselect_all()
    }
}

function toggle_group(html_el) {
    let group_name = html_el.parentNode.innerText;
    let tf = html_el.checked;
    if (tf) {
        //if turned on then want to show
        d3.selectAll('.' + gen_class(group_name))
            .attr('fill', color[org_types.indexOf(group_name)])
            .attr('fill-opacity', 1)
            .attr('stroke-width', 1)
    } else {
        //if turned off then want to hide
        d3.selectAll('.' + gen_class(group_name))
            .attr('fill', ColorLuminance(color[org_types.indexOf(group_name)].replace("#", ""), -0.8))
            .attr('stroke-opacity', 0.3)
    }
}

function select_all() {
    d3.selectAll('circle').on('mouseover', null);
    d3.selectAll('circle').on('mouseout', null);
    d3.selectAll('circle')
        .attr('fill', d => color[org_types.indexOf(d.data)])
        .attr('fill-opacity', 1)
        // .attr("stroke", "#262626")
        // .attr("stroke-opacity", 1)
        // .attr('stroke-width', 1)
        .on('mouseover', function (d) {//transition the radius of current selection to be bigger
            mouseover(d, this)
        })
        .on('mouseout', function (d) {//bring back stroke width and radius for cur circle
            mouseout(d, this)
        });
    toggle_all_checkboxes(true)
}

function deselect_all() {
    d3.selectAll('circle')
        .attr('fill', d => ColorLuminance(color[org_types.indexOf(d.data)].replace("#", ""), -0.8))
    // .attr("stroke", "#262626")
    // .attr('stroke-opacity', 0.3)
        toggle_all_checkboxes(false)

}

function toggle_all_checkboxes(onoff) {
    let dropdown = document.getElementById('dropdown-list').children;
    for (element of dropdown) {
        let inside_el = element.children[0];
        if (inside_el.tagName === 'LABEL') {
            inside_el.children[0].checked = onoff
        }
    }
}

