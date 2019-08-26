export class JsonTools {
  public static clone(data: any): any {
    if (!data) {
      return null;
    } else {
      return JSON.parse(JSON.stringify(data));
    }
  }
}
