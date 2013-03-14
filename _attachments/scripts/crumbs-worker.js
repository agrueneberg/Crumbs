importScripts("async.js", "read-lines.js");

var persistDocuments;

persistDocuments = function (docs, callback) {
    req = new XMLHttpRequest();
    url = location.protocol + "//" + location.host + "/" + location.pathname.split("/")[1] + "/";
    body = {
        "docs" : docs
    };
    req.onload = function () {
        callback();
    };
    req.open("POST", url + "_bulk_docs");
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify(body));
};

onmessage = function (message) {
    "use strict";

    var file, options, docs, fields, delimiter, fieldNameNormalization,
        documentThreshold, toCamelCase, toUnderscore, doc, req, url, body;

    file = message.data.file;
    options = message.data.options;

    docs = [];
    fields = [];

    delimiter = options.delimiter || ",";
 // Escape sequences are escaped on the way. Fix TABs.
    if (delimiter === "\\t") {
        delimiter = "\t";
    }

    fieldNameNormalization = options.fieldNameNormalization;

    // TODO: Make documentThreshold configurable.
    documentThreshold = 250;

    toCamelCase = function (s) {
        return s.replace(new RegExp("[^ \\w]", "g"), "").replace(new RegExp(" +(\\w)?", "g"), function (m, g) {
            return g.toUpperCase();
        });
    };

    toUnderscore = function (s) {
        return s.replace(new RegExp("[^ \\w]", "g"), "").toLowerCase().replace(new RegExp(" ", "g"), "_");
    };

    if (options.documentCreation === "one-document-per-file") {
        doc = {};
    }

    readLines(file, function (line, lineNumber, callback) {

        var fieldName;

        // Filter empty lines.
        if (line.length > 0) {

            if (lineNumber === 1 && options.fieldNames === "first-line-has-field-names") {

             // Populate field names from first row.
                fields = line.split(delimiter);
                fields = fields.map(function (field) {
                    if (fieldNameNormalization === "use-camelcase") {
                        field = toCamelCase(field);
                    } else if (fieldNameNormalization === "use-underscore") {
                        field = toUnderscore(field);
                    }
                    return field;
                });

            } else {

                if (options.documentCreation === "one-document-per-row") {
                    doc = {};
                }

                line.split(delimiter).forEach(function (field, index) {
                    if (options.fieldNames === "first-column-has-field-names") {
                        if (index === 0) {
                         // Populate field name from first column.
                            if (fieldNameNormalization === "use-camelcase") {
                                field = toCamelCase(field);
                            } else if (fieldNameNormalization === "use-underscore") {
                                field = toUnderscore(field);
                            }
                            fieldName = field;
                        } else {
                            doc[fieldName] = field;
                        }
                    } else {
                        fieldName = fields[index] || "field" + index;
                        doc[fieldName] = field;
                    }
                });

                if (options.documentCreation === "one-document-per-row") {
                    docs.push(doc);
                }

            }

        }

        // Persist some documents after threshold is reached.
        if (docs.length === documentThreshold) {
            persistDocuments(docs, function () {
                docs = [];
                callback();
            });
        } else {
            callback();
        }

    }, function (err) {

        if (err) {
            postMessage(1);
        } else {

            if (options.documentCreation === "one-document-per-file") {
                docs.push(doc);
            }

            // Persist the rest of the documents.
            if (docs.length > 0) {
                persistDocuments(docs, function () {
                    postMessage(0);
                });
            } else {
                postMessage(0);
            }

        }

    });

};
