// jQuery creates its own event object, and it doesn't have a
// dataTransfer property yet. This adds dataTransfer to the event object.
$.event.props.push("dataTransfer");
$(function() {
    "use strict";
    var dump;
    dump = function (file) {
        var spinner, worker, reader, optionFirstLineHasFieldNames, optionDelimiter;
        spinner = $("#spinner");
        spinner.show();
        if (file) {
            worker = new Worker("scripts/crumbs-worker.js");
            optionFirstLineHasFieldNames = $("#optionFirstLineHasFieldNames").is(":checked");
            optionDelimiter = $("#optionDelimiter").val();
            reader = new FileReader();
            reader.onload = function (event) {
                var payload;
                payload = {
                    data: event.target.result,
                    options: {
                        firstLineHasFieldNames: optionFirstLineHasFieldNames,
                        delimiter: optionDelimiter
                    }
                };
                worker.onmessage = function (message) {
                    if (message.data === 0) {
                        alert("Import complete.");
                    } else {
                        alert("Something went wrong.");
                    }
                    spinner.hide();
                };
                worker.postMessage(payload);
            };
            reader.readAsText(file);
        } else {
            spinner.hide();
            alert("Please provide a CSV file.");
        }
    };
    // Button handlers.
    $("#button").click(function () {
        var file;
        file = $("#picker").get(0).files[0];
        dump(file);
    });
    // Drag-and-Drop handlers.
    $("#dropzone").bind("dragover", function (e) {
        e.preventDefault();
        $(this).css("background", "red");
    });
    $("#dropzone").bind("dragleave", function (e) {
        e.preventDefault();
        $(this).css("background", "white");
    });
    $("#dropzone").bind("drop", function (e) {
        var file;
        e.preventDefault();
        $(this).css("background", "white");
        file = e.dataTransfer.files[0];
        dump(file);
    });
});
