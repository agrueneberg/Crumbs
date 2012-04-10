Crumbs
======

Crumbs is a CSV importer for [CouchDB](http://www.couchdb.org).

Crumbs is different from other import solutions in that it is served as an attachment to a CouchDB design document. The [File API](http://www.w3.org/TR/FileAPI/) of HTML5 allows the browser to read one or more input files directly from the local machine without any uploads and additional server-side logic. Crumbs is even able to process large files without affecting the user experience; its implementation as a [Web Worker](http://www.w3.org/TR/workers/) pushes the workload in the background.


Example
-------

After installing Crumbs, point your browser to `http://localhost:5984/<your_db>/_design/crumbs/crumbs.html`, select one or more CSV files and click `Import files`, or drag them into the designated area.


Installation
------------

Clone this repository and use [CouchApp](http://couchapp.org) to push Crumbs to CouchDB, or replicate [an existing deployment of Crumbs](http://agrueneberg.iriscouch.com/crumbs/), e.g. using curl:

    curl\
      -X POST\
      -H "Content-Type:application/json"\
      -d "{\"source\":\"http://agrueneberg.iriscouch.com/crumbs\",\
           \"target\":\"http://localhost:5984/<your_db>\",\
           \"filter\":\"vacuum/rw\"}"\
      http://localhost:5984/_replicate
