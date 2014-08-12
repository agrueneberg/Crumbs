Crumbs
======

Crumbs is a CSV importer for [CouchDB](http://www.couchdb.org).

Crumbs is different from other import solutions in that it is served as an attachment to a CouchDB design document. The [File API](http://www.w3.org/TR/FileAPI/) of HTML5 allows the browser to read one or more input files directly from the local machine without any uploads and additional server-side logic. Crumbs is even able to process large files without affecting the user experience; its implementation as a [Web Worker](http://www.w3.org/TR/workers/) pushes the workload in the background.


Installation
------------

Clone this repository and use [CouchApp](http://couchapp.org) to push Crumbs to `<your_host>/<your_db>`:

    git clone https://github.com/agrueneberg/Crumbs.git
    couchapp push Crumbs/ http://<your_host>/<your_db>

Alternatively, replicate [an existing deployment of Crumbs](https://couchdb.gutpassfilter.de/crumbs/) to `<your_host>/<your_db>` using `curl`:

curl\
  -X POST\
  -H "Content-Type:application/json"\
  -d "{\"source\":\"https://couchdb.gutpassfilter.de/crumbs\",\
       \"target\":\"http://<your_host>/<your_db>\",\
       \"filter\":\"vacuum/rw\"}"\
  http://localhost:5984/_replicate


Import
------

After installing Crumbs, point your browser to `<your_host>/<your_db>/_design/crumbs/import.html`, select one or more CSV files and click `Import files`.
