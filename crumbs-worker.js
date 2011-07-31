onmessage = function(message) {
    var docs = [];
    var rows = message.data.data.split('\n').filter(function(field) {
        // Skip empty rows
        if (field.length > 0) {
            return field;
        }
    }).forEach(function(row) {
        var doc = {};
        row.split(',').forEach(function(field, index) {
            doc['field' + index] = field;
        });
        docs.push(doc);
    });
    var req = new XMLHttpRequest();
    var body = {'docs' : docs};
    req.onreadystatechange = function() {
        if (req.readyState == 4) {
            postMessage('Dump complete.');
        }
    };
    req.open('POST', message.data.url + '_bulk_docs');
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify(body));
};