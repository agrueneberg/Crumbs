onmessage = function (message) {
    "use strict";
    var docs, fields, delimiter, rows, req, url, body;
    docs = [];
    fields = [];
    delimiter = message.data.options.delimiter || ",";
    rows = message.data.data;
    rows = rows.split(/\r?\n/).filter(function (field) {
        // Skip empty rows.
        if (field.length > 0) {
            return field;
        }
    });
    if (message.data.options.firstLineHasFieldNames === true) {
        // Populate field names from first row.
        fields = rows.shift().split(delimiter);
    }
    rows.forEach(function (row) {
        var doc;
        doc = {};
        row.split(delimiter).forEach(function (field, index) {
            var field_name;
            field_name = fields[index] || "field" + index;
            doc[field_name] = field;
        });
        docs.push(doc);
    });
    if (docs.length > 0) {
        req = new XMLHttpRequest();
        url = location.protocol + "//" + location.host + "/" + location.pathname.split("/")[1] + "/";
        body = {
            "docs" : docs
        };
        req.onreadystatechange = function () {
            if (req.readyState == 4) {
                postMessage(0);
            }
        };
        req.open("POST", url + "_bulk_docs");
        req.setRequestHeader("Content-Type", "application/json");
        req.send(JSON.stringify(body));
    } else {
        postMessage(1);
    }
};
