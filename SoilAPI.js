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
function getProperties(lat, lon){
    var ans = JSON.parse(get('https://rest.soilgrids.org/query?lon={0}&lat={1}&attributes=TAXNWRB,PHIHOX'.format(lon, lat)));
    return ans['properties'];
}
function soilCompare(a, b) {
	if (a.part < b.part)
		return 1;
	if (a.part > b.part)
		return -1;
	return 0;
}
function getSoilInfo(lat, lon, lim=10){
    var props = getProperties(lat, lon);
    var soil_dict = props['TAXNWRB'];
    var soils = new Array();
    for (soil in soil_dict) {
        soils.push({name:soil, part:soil_dict[soil]});
    }
    soils = soils.sort(soilCompare);
    res_soils = [];
    for (i = 0; (i < soils.length) && (soils[i].part >= lim); i++)
        res_soils.push(soils[i]);
    for (i in props['PHIHOX']['M']) {
        var acidity = props['PHIHOX']['M'][i];
        break;
    }
    return {'acidity':acidity, 'soils':res_soils};
}