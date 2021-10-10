import { Util } from "./Util";

export class PrincipalsHelper {
	public static isCurrentUserMemberOfGroup(groupName: string): boolean {
		var userIsInGroup = false;
		let url = _spPageContextInfo.webAbsoluteUrl + "/_api/web/currentuser/groups";
		let request = Util.httpRequest(url);
		if (request.status === 200) {
			let groupsEntries = request.responseXML.getElementsByTagName("entry");
			userIsInGroup = Array.prototype.slice.call(groupsEntries).some((e) => {
				let groupEntryName = e.getElementsByTagName("d:Title")[0].textContent;
				return groupName == groupEntryName;
			});
		} else {
			console.log("Error" + request);
		}
		return userIsInGroup;
	}

	public static getPrincipalId(principalName: string): number {
		let principalId: number;
		if (principalName.match(/^i:0|^\w+\\/i)) {
			principalId = this._getUserId(principalName);
		} else {
			principalId = this._getGroupId(principalName);
		};
		return principalId;
	}

	private static _getUserId(userName: string): number {
	//userName format = i:0#.w|bidev\sp_admin
		let userId = -1;
		const url = _spPageContextInfo.siteAbsoluteUrl + "/_api/web/siteusers(@v)?@v='" + encodeURIComponent(userName) + "'";
		let request = Util.httpRequest(url);
		if (request.status === 200) {
			userId = request.responseXML.getElementsByTagName("d:Id")[0].textContent;
		} else {
			console.log("Error" + request);
		}
		return userId;
	}

	private static _getGroupId(groupName: string): number {
		let groupId = -1;
		const url = _spPageContextInfo.siteAbsoluteUrl + "/_api/web/sitegroups/getbyname('" + encodeURIComponent(groupName) + "')";;
		let request = Util.httpRequest(url);
		if (request.status === 200) {
			groupId = request.responseXML.getElementsByTagName("d:Id")[0].textContent;
		} else {
			console.log("Error" + request);
		}
		return groupId;
	}
}