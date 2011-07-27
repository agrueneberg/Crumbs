onmessage = function(message) {
    var completed = 0;
    var rows = message.data.data.split('\n');
    rows.forEach(function(row) {
        // Skip empty rows
        if (row.length == 0) {
            completed++;
        } else {
            var doc = {};
            row.split(',').forEach(function(field, index) {
                doc['field' + index] = field;
            });
            var req = new XMLHttpRequest();
            req.onreadystatechange = function() {
                if (req.readyState == 4) {
                    completed++;
                    if (completed == rows.length) {
                        postMessage('Dump complete.');
                    }
                }
            };
            req.open('POST', message.data.url);
            req.setRequestHeader('Content-Type', 'application/json');
            req.send(JSON.stringify(doc));
        }
    });
};
