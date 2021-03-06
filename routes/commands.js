// Node.js includes
var util = require('util');

// 3rd party includes
var builder = require('xmlbuilder');
var _ = require('lodash');

// Internal includes
var Request = require('./request.js').Request;

/**
 * Search request helper class
 * @class
 * @mixes Request
 * @param {Object|String} query  Query string or object
 * @param {int} offset
 * @param {int} docs 
 * @param {Object} list   Listing policy
 */
var SearchRequest = exports.SearchRequest = function(query, offset, docs, list) {
    var self = this;
    if (_.isObject(query)) {
        query.command = query.command || 'search';
        Request.call(self, query);
    } else {
        Request.call(self, 'search');
    }

    self.setQuery(query);
    self.setOffset(offset);
    self.setDocs(docs);
    if (list) self.setList(list);
}
util.inherits(SearchRequest, Request);

/**
 * SQL Search request helper class
 * @class
 * @mixes Request
 * @param {Object|String} query Query string or object
 */
var SQLSearchRequest = exports.SQLSearchRequest = function(query) {
    var self = this;
    if (_.isObject(query)) {
        query.command = query.command || 'search';
        SearchRequest.call(self, query);
    } else {
        SearchRequest.call(self, 'search');

        self.setParam('sql', query);
    }
}
util.inherits(SQLSearchRequest, SearchRequest);

/**
 * Modify request helper class
 * @class
 * @mixes Request
 * @param {String} command   Command type (insert, update, replace, partial-replace, delete)
 * @param {Object|String|Object[]|String[]} documents Documents to modify
 */
var ModifyRequest = exports.ModifyRequest = function(command, documents) {
    var self = this;    
    Request.call(self, command);

    if (_.isString(documents) || _.isObject(documents)) self.unknownParams['_document'] = documents;
}
util.inherits(ModifyRequest, Request);

/**
 * Insert request helper class
 * @class
 * @mixes ModifyRequest
 * @param {Object|String|Object[]|String[]} documents Documents to modify
 */
var InsertRequest = exports.InsertRequest = function(documents) {
    var self = this;    
    ModifyRequest.call(self, 'insert', documents);
}
util.inherits(InsertRequest, ModifyRequest);

/**
 * Update request helper class
 * @class
 * @mixes ModifyRequest
 * @param {Object|String|Object[]|String[]} documents Documents to update
 */
var UpdateRequest = exports.UpdateRequest = function(documents) {
    var self = this;    
    ModifyRequest.call(self, 'update', documents);
}
util.inherits(UpdateRequest, ModifyRequest);

/**
 * Replace request helper class
 * @class
 * @mixes ModifyRequest
 * @param {Object|String|Object[]|String[]} documents Documents to replace
 */
var ReplaceRequest = exports.ReplaceRequest = function(documents) {
    var self = this;    
    ModifyRequest.call(self, 'replace', documents);
}
util.inherits(ReplaceRequest, ModifyRequest);

/**
 * Partial Replace request helper class
 * @class
 * @mixes ModifyRequest
 * @param {Object|String|Object[]|String[]} documents Documents to replace
 */
var PartialReplaceRequest = exports.PartialReplaceRequest = function(documents) {
    var self = this;
    ModifyRequest.call(self, 'partial-replace', documents);
}
util.inherits(PartialReplaceRequest, ModifyRequest);

/**
 * Delete request helper class
 * @class
 * @mixes ModifyRequest
 * @param {Object|String|Object[]|String[]} documents Documents to delete
 */
var DeleteRequest = exports.DeleteRequest = function(ids) {
    var self = this;
    ModifyRequest.call(self, 'delete', ids);
}
util.inherits(DeleteRequest, ModifyRequest);

/**
 * Alternatives request helper class
 * @class
 * @mixes Request
 * @param {Object|String} query Query string or object
 * @param {double} cr    Minimum ratio between the occurrence of the alternative and the occurrence of the search term
 * @param {double} idif  A number that limits how much the alternative may differ from the search term
 * @param {double} h     A number that limits the overall estimate of the quality of the alternative
 */
var AlternativesRequest = exports.AlternativesRequest = function(query, cr, idif, h) {
    var self = this;
    Request.call(self, 'alternatives');

    self.setQuery(query);
    self.setCr(cr);
    self.setIdif(idif);
    self.setH(h);
}
util.inherits(AlternativesRequest, Request);

/**
 * List Words request helper class
 * @class
 * @mixes Request
 * @param {Obejct|String} query Query object or string
 */
var ListWordsRequest = exports.ListWordsRequest = function(query) {
    var self = this;
    Request.call(self, 'list-words');

    self.setQuery(query);
}
util.inherits(ListWordsRequest, Request);

/**
 * Status request helper class
 * @class
 * @mixes Request
 */
var StatusRequest = exports.StatusRequest = function() {
    var self = this;
    Request.call(self, 'status');
}
util.inherits(StatusRequest, Request);

/**
 * Retrieve request helper class
 * @class
 * @mixes Request
 * @param {String|String[]} ids List of ids to retrieve
 */
var RetrieveRequest = exports.RetrieveRequest = function(ids) {
    var self = this;
    Request.call(self, 'retrieve');

    if (_.isArray(ids) || _.isString(ids)) self.unknownParams['_id'] = ids;
}
util.inherits(RetrieveRequest, Request);

/**
 * Lookup request helper class
 * @class
 * @mixes Request
 * @param {String|String[]} ids  List of ids to lookup
 * @param {Object} list Listing policy
 */
var LookupRequest = exports.LookupRequest = function(ids, list) {
    var self = this;
    Request.call(self, 'lookup');

    if (_.isArray(ids) || _.isString(ids)) self.unknownParams['_id'] = ids;
    self.setList(list);
}
util.inherits(LookupRequest, Request);

/**
 * ListLastRetrieveFirst request helper
 * @class
 * @mixes Request
 * @param {String} command Command type
 * @param {int} offset  Document offset to return from
 * @param {int} docs    Document count to return
 * @param {Object} list    Listing policy
 */
var ListLastRetrieveFirstRequest = exports.ListLastRetrieveFirstRequest = function(command, offset, docs, list) {
    var self = this;
    Request.call(self, command);

    self.setOffset(offset);
    self.setDocs(docs);
    if (list) self.setList(list);
}
util.inherits(ListLastRetrieveFirstRequest, Request);

/**
 * ListLast request helper
 * @class
 * @mixes ListLastRetrieveFirstRequest
 * @param {Object} list   Listing policy
 * @param {int} offset Document offset to return from
 * @param {int} docs   Document count to return
 */
var ListLastRequest = exports.ListLastRequest = function(list, offset, docs) {
    var self = this;
    ListLastRetrieveFirstRequest.call(self, 'list-last', offset, docs, list);
}
util.inherits(ListLastRequest, ListLastRetrieveFirstRequest);

/**
 * ListFirst request helper
 * @class
 * @mixes ListLastRetrieveFirstRequest
 * @param {Object} list   Listing policy
 * @param {int} offset Document offset to return from
 * @param {int} docs   Document count to return
 */
var ListFirstRequest = exports.ListFirstRequest = function(list, offset, docs) {
    var self = this;
    ListLastRetrieveFirstRequest.call(self, 'list-first', offset, docs, list);
}
util.inherits(ListFirstRequest, ListLastRetrieveFirstRequest);

/**
 * RetrieveLast request helper
 * @class
 * @mixes ListLastRetrieveFirstRequest
 * @param {int} offset Document offset to return from
 * @param {int} docs   Document count to return
 */
var RetrieveLastRequest = exports.RetrieveLastRequest = function(offset, docs) {
    var self = this;
    ListLastRetrieveFirstRequest.call(self, 'retrieve-last', offset, docs);
}
util.inherits(RetrieveLastRequest, ListLastRetrieveFirstRequest);

/**
 * RetrieveFirst request helper
 * @class
 * @mixes ListLastRetrieveFirstRequest
 * @param {int} offset Document offset to return from
 * @param {int} docs   Document count to return
 */
var RetrieveFirstRequest = exports.RetrieveFirstRequest = function(offset, docs) {
    var self = this;
    ListLastRetrieveFirstRequest.call(self, 'retrieve-first', offset, docs);
}
util.inherits(RetrieveFirstRequest, ListLastRetrieveFirstRequest);

/**
 * SearchDelete request helper
 * @class
 * @mixes Request
 * @param {Object|String} query Query object or string
 */
var SearchDeleteRequest = exports.SearchDeleteRequest = function(query) {
    var self = this;
    if (_.isObject(query)) {
        query.command = query.command || 'search-delete';
        Request.call(self, query);
    } else {
        Request.call(self, 'search-delete');

        self.setQuery(query);
    }
}
util.inherits(SearchDeleteRequest, Request);

/**
 * ListPaths request helper
 * @class
 * @mixes Request
 */
var ListPathsRequest = exports.ListPathsRequest = function() {
    var self = this;
    Request.call(self, 'list-paths');
}
util.inherits(ListPathsRequest, Request);

/**
 * ListFacets request helper
 * @class
 * @mixes Request
 * @param {Sttring|String[]} paths A single facet path as string or an array of paths to list the facet terms from
 */
var ListFacetsRequest = exports.ListFacetsRequest = function(paths) {
    var self = this;
    Request.call(self, 'list-facets');

    self.setPath(paths);
}
util.inherits(ListFacetsRequest, Request);

/**
 * SimilarDocuments request helper
 * @class
 * @mixes Request
 * @param {String} id ID of the source document - the one that You want to search similar documents to
 * @param {int} len number of keywords to extract from the source
 * @param {int} quota minimum number of keywords matching in the destination
 * @param {int} offset number of results to skip before returning the following ones
 * @param {int} docs number of documents to retrieve
 * @param {String} query an optional query that all found documents have to match against
 */
var SimilarDocumentsRequest = exports.SimilarDocumentsRequest = function(id, len, quota, offset, docs, query) {
    var self = this;
    if (_.isObject(id)) {
        id.command = id.command || 'similar';
        Request.call(self, query);
    } else {
        Request.call(self, 'similar');

        if (_.isString(id)) self.setParam('id', id);
        if (_.isNumber(len)) self.setParam('len', len);
        if (_.isNumber(quota)) self.setParam('quota', quota);
        self.setOffset(offset);
        self.setDocs(docs);
        self.setQuery(query);
    }
}
util.inherits(SimilarDocumentsRequest, Request);

/**
 * SimilarText request helper
 * @class
 * @mixes Request
 * @param {String} text A chunk of text that the found documents have to be similar to
 * @param {int} len number of keywords to extract from the source
 * @param {int} quota minimum number of keywords matching in the destination
 * @param {int} offset number of results to skip before returning the following ones
 * @param {int} docs number of documents to retrieve
 * @param {String} query an optional query that all found documents have to match against
 */
var SimilarTextRequest = exports.SimilarTextRequest = function(text, len, quota, offset, docs, query) {
    var self = this;
    if (_.isObject(text)) {
        text.command = text.command || 'similar';
        Request.call(self, query);
    } else {
        Request.call(self, 'similar');

        if (_.isString(text)) self.setParam('text', text);
        if (_.isNumber(len)) self.setParam('len', len);
        if (_.isNumber(quota)) self.setParam('quota', quota);
        self.setOffset(offset);
        self.setDocs(docs);
        self.setQuery(query);
    }
}
util.inherits(SimilarTextRequest, Request);

/**
 * ShowHistory request helper
 * @class
 * @mixes Request
 * @param {String} ids        List of documents to show history of
 * @param {bool} returnDocs Set this to true if you want historical document content returned as well
 */
var ShowHistoryRequest = exports.ShowHistoryRequest = function(ids, returnDocs) {
    var self = this;
    Request.call(self, 'show-history');

    if (_.isArray(ids) || _.isString(ids)) self.unknownParams['_id'] = ids;
    if (returnDocs) self.setParam('return_doc', 'yes');
}
util.inherits(ShowHistoryRequest, Request);

/**
 * BeginTransaction request helper
 * @class
 * @mixes Request
 */
var BeginTransactionRequest = exports.BeginTransactionRequest = function() {
    var self = this;
    Request.call(self, 'begin-transaction');
}
util.inherits(BeginTransactionRequest, Request);

/**
 * CommitTransaction request helper
 * @class
 * @mixes Request
 */
var CommitTransactionRequest = exports.CommitTransactionRequest = function() {
    var self = this;
    Request.call(self, 'commit-transaction');
}
util.inherits(CommitTransactionRequest, Request);

/**
 * RollbackTransaction request helper
 * @class
 * @mixes Request
 */
var RollbackTransactionRequest = exports.RollbackTransactionRequest = function() {
    var self = this;
    Request.call(self, 'rollback-transaction');
}
util.inherits(RollbackTransactionRequest, Request);