onmessage = function(message) {
    var docs = [];
    var fields = [];
    var delimiter = message.data.options.delimiter || ",";
    var rows = message.data.data.split('\n').filter(function(field) {
        // Skip empty rows
        if (field.length > 0) {
            return field;
        }
    });
    if (message.data.options && message.data.options.firstLineHasFieldNames) {
        fields = rows.shift().split(delimiter);
    }
    rows.forEach(function(row) {
        var doc = {};
        row.split(delimiter).forEach(function(field, index) {
            var field_name = fields[index] || 'field' + index;
            doc[field_name] = field;
        });
        docs.push(doc);
    });
    if (docs.length > 0) {
        var req = new XMLHttpRequest();
        var url = location.protocol + '//' + location.host + '/' + location.pathname.split('/')[1] + '/';
        var body = {'docs' : docs};
        req.onreadystatechange = function() {
            if (req.readyState == 4) {
                postMessage(0);
            }
        };
        req.open('POST', url + '_bulk_docs');
        req.setRequestHeader('Content-Type', 'application/json');
        req.send(JSON.stringify(body));
    } else {
        postMessage(1);
    }
};
