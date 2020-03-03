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
                .attr('fill', ColorLuminance(color[org_types.indexOf(group_name)].replace("#", ""), darkness))
                .attr('stroke-opacity', 0.3)
        }
    }

    function select_all() {
        d3.selectAll('circle').on('mouseover', null);
        d3.selectAll('circle').on('mouseout', null);
        d3.selectAll('rect').on('mouseover', null);
        d3.selectAll('rect').on('mouseout', null);
        d3.selectAll('circle')
            .attr('fill', d => color[org_types.indexOf(d.data)])
            .attr('fill-opacity', 1)
            .on('mouseover', function (d) {//transition the radius of current selection to be bigger
                mouseover(d, this)
            })
            .on('mouseout', function (d) {//bring back stroke width and radius for cur circle
                mouseout(d, this)
            });

        d3.selectAll('rect')
            .attr('fill', d => color[org_types.indexOf(d.data.org_type)])
            .on('mouseover', mouseover_tree)
            .on('mouseout', mouseout_tree);
        toggle_all_checkboxes(true)
    }

    function deselect_all() {
        d3.selectAll('circle')
            .attr('fill', d => ColorLuminance(color[org_types.indexOf(d.data)].replace("#", ""), darkness));

        d3.selectAll('rect')
            .attr('fill', d => ColorLuminance(color[org_types.indexOf(d.data.org_type)].replace("#", ""), darkness))
        toggle_all_checkboxes(false)


    }

    function toggle_all_checkboxes(onoff) {
        let dropdown = document.getElementById('dropdown-list').children;
        for (element of dropdown) {
            let inside_el = element.children[0];
            if (inside_el.tagName === 'LABEL' && inside_el.innerText !== 'Color Blind Mode') {
                inside_el.children[0].checked = onoff
            }
        }
    }

    function toggle_color_blind(obj) {
        if (!obj.checked) {
            color = ["#4e79a7", "#f28e2c", "#e15759", "#76b7b2", "#59a14f", "#edc949", "#af7aa1", "#ff9da7", "#9c755f", "#bab0ab", "#fffff"];
        } else {
            color = ["#ffffff", "#218aee", "#44aa99", "#0a461e", "#332288", "#ddcc77", "#999933", "#cc6677", "#882255", "#aa4499"]
        }
        let dropdown = document.getElementById('dropdown-list');
        for (let li of dropdown.childNodes) {
            let child = li.childNodes[0];
            if (child.tagName === 'LABEL') {
                let org_type = child.innerText;
                let idx = org_types.indexOf(child.innerText);
                child = child.childNodes[0].nextSibling;
                if (child.checked) {
                    console.log('checked', child);
                    d3.selectAll('.' + gen_class(org_type))
                        .attr("fill", color[idx]);
                }
                else {
                    console.log('cur color', color[idx])
                    let cur_color = color[idx] === undefined ? 'FFFFFF' : color[idx].replace("#", "");
                    d3.selectAll('.' + gen_class(org_type))
                        .attr("fill", ColorLuminance(cur_color, darkness));
                }

            }
        }
        for (let li of dropdown.childNodes) {
            console.log('li', li.childNodes[0].innerText)
            if (li.childNodes[0].tagName === 'LABEL') {
                let idx = org_types.indexOf(li.childNodes[0].innerText);
                console.log(idx)
                let cur_color = color[idx] === undefined ? 'FFFFFF' : color[idx].replace("#", "");
                li.childNodes[0].style.backgroundColor = ColorLuminance(String(cur_color), -0.5);
            }
        }
    }