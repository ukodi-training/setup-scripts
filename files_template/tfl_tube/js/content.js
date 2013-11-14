var mydata = {};

mydata.url = "http://api.tubeupdates.com/?method=get.status&format=json&callback=?";

$.getJSON(mydata.url, function (data) {
    items = data.response.lines;

    $.each(items, function (index, item) {

        var name = document.createElement("td");
        var status = document.createElement("td");

        name.innerHTML = item.name;
        status.innerHTML = item.status;

        name.setAttribute('id', item.name);

        var sclass = item.status.split(",")[0].replace(/ /g, "_");
        status.setAttribute('class', sclass);

        var row = document.createElement("tr");
        row.appendChild(name);
        row.appendChild(status);

        document.getElementById('data').appendChild(row);
    });
});
