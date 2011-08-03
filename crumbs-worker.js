onmessage = function(message) {
    var docs = [];
    var rows = message.data.split('\n').filter(function(field) {
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
    var url = location.protocol + '//' + location.host + '/' + location.pathname.split('/')[1] + '/';
    var body = {'docs' : docs};
    req.onreadystatechange = function() {
        if (req.readyState == 4) {
            postMessage('Dump complete.');
        }
    };
    req.open('POST', url + '_bulk_docs');
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify(body));
};
