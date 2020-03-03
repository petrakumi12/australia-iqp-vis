function load_dat_gui(svg) {
    console.log('dat gui svg', svg)
    let prev_controls = ""
    let controls = new function () {
        for (let org of org_types) {
            this[org] = true;
        }
        this['Select All'] = function () {
            for (let org of org_types) {
                this[org] = true;
            }
            d3.selectAll('circle').on('mouseover', null)
            d3.selectAll('circle').on('mouseout', null)

            d3.selectAll('circle')
                .attr('fill', d => color[org_types.indexOf(d.data)])
                .attr('fill-opacity', 1)
                .attr("stroke", "#262626")
                .attr("stroke-opacity", 1)
                .attr('stroke-width', 1)
                .on('mouseover', function (d) {//transition the radius of current selection to be bigger
                    mouseover(d, this)
                })
                .on('mouseout', function (d) {//bring back stroke width and radius for cur circle
                    mouseout(d, this)
                })
            prev_controls = this

        };
        this['Deselect All'] = function () {
            for (let org of org_types) {
                this[org] = false;
            }
            d3.selectAll('circle')
                .attr('fill', d => ColorLuminance(color[org_types.indexOf(d.data)].replace("#", ""), darkness))
                .attr('stroke-opacity', 0.3)

            // console.log('helloooo', prev_controls)
            prev_controls = this

        };

        this.redraw = function () {
            console.log('prev controls are', prev_controls)
            let control = this;
            // console.log('keys', Object.keys(control))
            if (Object.keys(control).includes('object')) {
                control = this['object']
            }
            // console.log('control', control)
            let updated_arr = [];
            for (let cont of Object.keys(control)) {
                if (prev_controls !== undefined) {
                    if (org_types.includes(cont) && (cont !== prev_controls[cont])) {
                        // console.log('el', cont)
                        // console.log('prop', control[cont])
                        updated_arr.push({
                            'el': cont,
                            'property': control[cont]
                        })
                    }
                } else {
                    if (org_types.includes(cont)) {
                        // console.log('el', cont)
                        // console.log('prop', control[cont])
                        updated_arr.push({
                            'el': cont,
                            'property': control[cont]
                        })
                    }

                }
            }
            for (let updated_el of updated_arr) {
                let el = updated_el.el;
                let property = updated_el.property;

                if (property) {
                    //if turned on then want to show
                    d3.selectAll('.' + gen_class(el))
                        .attr('fill', color[org_types.indexOf(el)])
                        .attr('fill-opacity', 1)
                        .attr('stroke-width', 1)
                } else {
                    //if turned on then want to hide
                    d3.selectAll('.' + gen_class(el))
                        .attr('fill', ColorLuminance(color[org_types.indexOf(el)].replace("#", ""), darkness))
                        .attr('stroke-opacity', 0.3)
                }
            }

            prev_controls = control.object

        }
    };


    //generate controls box on the gui that for every changed attribute calls the redraw function
    let gui = new dat.GUI({autoPlace: false});
    gui.close()
    document.getElementById('dat-gui').appendChild(gui.domElement);

    for (let org of org_types) {
        gui.add(controls, org).onChange(controls.redraw)
    }
    gui.add(controls, 'Select All')
    gui.add(controls, 'Deselect All')

    controls.redraw()
}

