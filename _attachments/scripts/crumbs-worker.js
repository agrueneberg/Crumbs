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
            var fieldName;
            fieldName = fields[index] || "field" + index;
            doc[fieldName] = field;
        });
        docs.push(doc);
    });

    if (docs.length === 0) {
     // Could not create documents from file.
     // Exit code: 1 = Failure.
        postMessage(1);
    } else {
        req = new XMLHttpRequest();
        url = location.protocol + "//" + location.host + "/" + location.pathname.split("/")[1] + "/";
        body = {
            "docs" : docs
        };
        req.onload = function () {
         // Exit code: 0 = Success.
            postMessage(0);
        };
        req.open("POST", url + "_bulk_docs");
        req.setRequestHeader("Content-Type", "application/json");
        req.send(JSON.stringify(body));
    }

};
