onmessage = function (message) {
    "use strict";

    var docs, fields, delimiter, doc, rows, req, url, body;

    docs = [];
    fields = [];
    delimiter = message.data.options.delimiter || ",";
 // Escape sequences are escaped on the way. Fix TABs.
    if (delimiter === "\\t") {
        delimiter = "\t";
    }

    rows = message.data.data;
    rows = rows.split(/\r?\n/).filter(function (field) {
     // Skip empty rows.
        if (field.length > 0) {
            return field;
        }
    });

    if (message.data.options.fieldNames === "first-line-has-field-names") {
     // Populate field names from first row.
        fields = rows.shift().split(delimiter);
    }

    if (message.data.options.documentCreation === "one-document-per-file") {
        doc = {};
    }

    rows.forEach(function (row) {
        var fieldName;
        if (message.data.options.documentCreation === "one-document-per-row") {
            doc = {};
        }
        row.split(delimiter).forEach(function (field, index) {
            if (message.data.options.fieldNames === "first-column-has-field-names") {
                if (index === 0) {
                 // Populate field name from first column.
                    fieldName = field;
                } else {
                    doc[fieldName] = field;
                }
            } else {
                fieldName = fields[index] || "field" + index;
                doc[fieldName] = field;
            }
        });
        if (message.data.options.documentCreation === "one-document-per-row") {
            docs.push(doc);
        }
    });

    if (message.data.options.documentCreation === "one-document-per-file") {
        docs.push(doc);
    };

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
