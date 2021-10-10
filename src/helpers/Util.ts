export class Util {
    public static isIE(): Boolean {
        return navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > -1
    }

	public static httpRequest(url: string): any {
		var request = new XMLHttpRequest();
		request.open('GET', url, false);
		request.send(null);
		return request;
    }

    public static getSPCamlQuery(camlQueryText: string): SP.CamlQuery {
        let spCamlQuery = new SP.CamlQuery();
        spCamlQuery.set_viewXml(camlQueryText);
        return spCamlQuery;
    }
}