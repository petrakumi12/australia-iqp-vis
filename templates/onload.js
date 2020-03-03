let org_types = ['Business', 'Community Organization', 'Education', 'Government', 'Local Government', 'Other', 'State Government', 'Trust/Foundation/Foundation', 'Target']
let color = ["#4e79a7", "#f28e2c", "#e15759", "#76b7b2", "#59a14f", "#edc949", "#af7aa1", "#ff9da7", "#9c755f", "#bab0ab", "#fffff"];
// let color = ["#ffffff", "#218aee", "#44aa99", "#0a461e", "#332288", "#ddcc77", "#999933", "#cc6677", "#882255", "#aa4499"]
window.onload = function () {
    if_mobile()
    treemap()
    graph()
    load_controls()
    keep_dropdown_dropped()
    // document.getElementById('the-btn').addEventListener('click', remove_div)
};

function keep_dropdown_dropped() {
    $(document).on('click', '.dropdown-menu', function (e) {
        e.stopPropagation();
    });
}

function if_mobile() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        document.getElementsByTagName('body').innerText = "Oops, we don't do this yet... <br/><br/>" +
            "It seems like you are trying to access this visualization on a mobile device. Unfortunately, we do not support this visualization on mobile yet. " +
            "Make sure to check it out on your computer, it's worth a look we promise!<br/><br/>- The Global Lab Development Team"
    }
}

function remove_div() {
    console.log('hereee')
    document.getElementById('help-text').style = "opacity:0; animation: 1s ease-out 0s 1 slideOutFromLeft";
    document.getElementsByClassName('typed')[0].style.zIndex = -1;
    document.getElementById('the-btn').innerText = "Show intro text";
    document.getElementById('the-btn').removeEventListener('click', remove_div);
    document.getElementById('the-btn').addEventListener('click', show_div)

}

function show_div() {
    console.log('hereee')
    document.getElementById('help-text').style = "opacity:1; animation: 1s ease-out 0s 1 slideInFromLeft";
    document.getElementsByClassName('typed')[0].style.zIndex = 480;
    document.getElementById('the-btn').innerText = "Hide intro text";
    document.getElementById('controls-btn').style.zIndex = 500;
    document.getElementById('the-btn').style.zIndex = 500;
    document.getElementById('the-btn').addEventListener('click', remove_div);
    document.getElementById('the-btn').removeEventListener('click', show_div)
}

function load_controls() {
    let dropdown = document.getElementById('dropdown-list');
    for (let org_type of org_types) {
        let cur_color = color[org_types.indexOf(org_type)].replace("#", "");
        let li = document.createElement('LI');
        li.style.color = color[org_types.indexOf(org_type)] + " !important;";
        li.innerHTML =
            "<label class='dropdown-element btn btn-dark d-flex justify-content-left pl-4' style='background-color: " + ColorLuminance(String(cur_color), -0.5) + "'>" +
            " <input type='checkbox' class='' onchange='toggle_group(this)'>" + org_type + "</label>";
        dropdown.appendChild(li)
    }
    let li = document.createElement('LI');
    li.innerHTML = "<label class='dropdown-element btn btn-dark d-flex justify-content-left pl-4'>" +
        " <input type='checkbox' class='' onchange='toggle_color_blind(this)'> Color Blind Mode  </label>";
    dropdown.appendChild(li)
    for (let selection of ['Select All', 'Deselect All']) {
        let li = document.createElement('LI');
        li.innerHTML = '<button type="button" class="btn btn-secondary btn-sm btn-block mb-2" onclick="toggle_selectAll(this.innerText)">' + selection + '</button>';
        dropdown.appendChild(li);
        tf = false;
    }
}

