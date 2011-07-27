Crumbs
======

Crumbs dumps a CSV file to a [CouchDB](http://www.couchdb.org) database. It is served as an attachment to a CouchDB document and uses the [File API](http://www.w3.org/TR/FileAPI/) of HTML5 to read the input file from the local machine -- no additional server-side logic is needed. It is intended to be used with large files, using [Web Workers](http://www.w3.org/TR/workers/) to push the workload in the background.
