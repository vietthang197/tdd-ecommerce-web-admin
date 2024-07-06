export class SecurityUtilities {
  static hasPermission(resourceId:string, permission: string, permissionList: any[]) {
    for (let item of permissionList) {
      if (item?.rsname == resourceId && item.scopes?.includes(permission)) {
        return true;
      }
    }
    return false;
  }
}
