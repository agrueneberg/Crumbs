$(function() {
    "use strict";

    var worker, fileList, submitFile, processFileList;

 // jQuery creates its own event object, and it doesn't have a
 // dataTransfer property yet. This adds dataTransfer to the event object.
    $.event.props.push("dataTransfer");

 // Initialize worker.
    worker = new Worker("scripts/crumbs-worker.js");

 // Keep file list.
    fileList = [];

 // Submits a file to the worker.
    submitFile = function (file, options, callback) {
        var payload;
        payload = {
            file: file,
            options: options.config
        };
        worker.onmessage = function (message) {
            if (message.data === 0) {
                callback(null);
            } else {
                callback(new Error("Something went wrong."));
            }
        };
        worker.postMessage(payload);
    };

 // Iterate through fileList, delegating files to submitFile.
 // fileList is of type FileList, a DOM type.
    processFileList = function processFileList(fileList, options, callback) {
        var file;
        if (fileList.length === 0 || options.currentFileIdx === fileList.length) {
         // Don't start if there are no files, and stop if every file has been processed.
            callback(null);
        } else {
         // Keep pointer to current file.
            options.currentFileIdx = options.currentFileIdx || 0;
            file = fileList[options.currentFileIdx];
            submitFile(file, options, function (err) {
                if (err !== null) {
                    callback(err);
                } else {
                    options.currentFileIdx++;
                    processFileList(fileList, options, callback);
                }
            });
        }
    };

 // Handle option extraction and status indicator on submit.
    $("form").submit(function (ev) {
        var options, button;
        ev.preventDefault();
     // Collect options.
        options = {
            config: {
                fieldNames: $("[name='optionFieldNames']:checked").val() || "none",
                fieldNameNormalization: $("#optionFieldNameNormalization :selected").val() || "do-not-modify",
                documentCreation: $("#optionDocumentCreation").val(),
                delimiter: $("#optionDelimiter").val()
            }
        };
        button = $("input[type='submit']");
        button.button("loading");
        processFileList(fileList, options, function (err) {
            if (err !== null) {
                alert(err);
            } else {
                alert("Import complete.");
            }
            button.button("reset");
        });
    });

 // File picker handler.
    $("#filePicker").change(function (ev) {
        fileList = ev.target.files;
    });

 // Drag-and-Drop handlers.
    $("#dropzone").bind("dragover", function (ev) {
        ev.preventDefault();
        $(this).addClass("alert-success");
    });
    $("#dropzone").bind("dragleave", function (ev) {
        ev.preventDefault();
        $(this).removeClass("alert-success");
    });
    $("#dropzone").bind("drop", function (ev) {
        ev.preventDefault();
        $(this).removeClass("alert-success");
        fileList = ev.dataTransfer.files;
        if (fileList.length === 1) {
            $(this).text(fileList[0].name);
        } else {
            $(this).text(fileList.length + " files");
        }
    });

 // Advanced options handler.
    $("#toggle-advanced-options").click(function (ev) {
        ev.preventDefault();
        $(".advanced-option").toggle();
    });

});
