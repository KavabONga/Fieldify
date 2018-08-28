function get(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
}
String.prototype.format = function() {
    var res = this;
    for (i = 0; i < arguments.length; i++) {
        res = res.replace('{' + i + '}', arguments[i].toString());
    }
    return res;
}