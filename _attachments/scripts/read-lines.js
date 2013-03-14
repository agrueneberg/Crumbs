var readLines;
readLines = function (file, fn, callback) {
    var chunkSize, sliceMethod, hold, numLines, lowerBoundary, upperBoundary, lastIteration;
    // The default chunk size is 1000 characters.
    // TODO: Make chunkSize configurable.
    chunkSize = 1000;
    // Feature detection of file.*slice.
    if (file.slice) {
        sliceMethod = "slice";
    } else if (file.webkitSlice) {
        sliceMethod = "webkitSlice";
    } else if (file.mozSlice) {
        sliceMethod = "mozSlice";
    }
    // Only use slice if it is supported by the browser and the file
    // size is bigger than the chunk size.
    if (sliceMethod && (file.size - 1) > chunkSize) {
        // Initialize hold space for temporary storage across iterations.
        hold = "";
        // Set initial number of lines.
        numLines = 0;
        // Set initial boundaries.
        lowerBoundary = 0;
        upperBoundary = chunkSize;
        lastIteration = false;
        // Perform asynchronous loop.
        async.doUntil(function (onIterationDone) {
            var reader, chunk;
            // Mark the last iteration.
            if (upperBoundary === file.size - 1) {
                lastIteration = true;
            }
            reader = new FileReader();
            reader.onloadend = function (evt) {
                var text, splits;
                if (evt.target.readyState == FileReader.DONE) {
                    // Combine data from hold space and text result.
                    text = hold + evt.target.result;
                    // Split text on newline characters.
                    splits = text.split(/\r?\n/);
                    async.times(splits.length, function (index, onFnDone) {
                        if (index === splits.length - 1) {
                            // The last split does not necessarily end with a
                            // newline character because it might have been
                            // split in the middle of the line.
                            if (upperBoundary === file.size - 1) {
                                numLines = numLines + 1;
                                // Output the split anyway if the end of the
                                // buffer is reached.
                                fn(splits[index], numLines, onFnDone);
                            } else {
                                // If there are more iterations, save the split
                                // for the next one.
                                hold = splits[index];
                                onFnDone();
                            }
                        } else {
                            numLines = numLines + 1;
                            // Output each line.
                            fn(splits[index], numLines, onFnDone);
                        }
                    }, function (err) {
                        // Set new boundaries.
                        lowerBoundary = upperBoundary;
                        upperBoundary = lowerBoundary + chunkSize;
                        // Prevent overshooting.
                        if (upperBoundary > file.size - 1) {
                            upperBoundary = file.size - 1;
                        }
                        onIterationDone();
                    });
                }
            };
            chunk = file[sliceMethod](lowerBoundary, upperBoundary);
            reader.readAsBinaryString(chunk);
        }, function () {
            return lastIteration === true;
        }, callback);
    } else {
        reader = new FileReader();
        reader.onloadend = function (evt) {
            var splits;
            if (evt.target.readyState == FileReader.DONE) {
                splits = evt.target.result.split(/\r?\n/);
                async.times(splits.length, function (index, onFnDone) {
                    fn(splits[index], index + 1, onFnDone);
                }, callback);
            }
        };
        reader.readAsBinaryString(file);
    }
};
