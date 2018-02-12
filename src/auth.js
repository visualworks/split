export default class Auth {
    constructor() {
        return this;
    }
    request(method = "GET", oBodyData = {}) {
        const CONST_MAPPINGS = require("const.json");
        let sEndpointNoCache = CONST_MAPPINGS.SOAP_URL + "?cache=" + Date.now(new Date());
        const RequestHeader = new Headers();
        RequestHeader.append("Content-Type", "application/json");
        RequestHeader.append("Content-Length", oBodyData.length.toString());
        RequestHeader.append("Connection", "close");
        RequestHeader.append("Cache-Control", "no-cache");
        let oData = {
            body: oBodyData,
            cache: "no-cache",
            method: method,
            header: RequestHeader
        };
        return fetch(sEndpointNoCache, oData).then((response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(CONST_MAPPINGS.RESPONSE_NOT_OK);
        });
    }
    doPost(oBodyData = {}) {
        return this.request("POST", JSON.stringify(oBodyData)).then((response) => {
            return response;
        });
    }
}