export default class {
  constructor(e: Object, link, pathToSave) {
    this.e = e;
    this.url = link;
    this.pathToSave = pathToSave;
    this.errors = {
      401: `Error 401 ${this.url} demand authorization, try another site =)`,
      403: 'Error 403 Forbidden, permission denied',
      404: `Error 404 ${this.url} page not found`,
      500: 'Error 500 Internal Server Error',
      502: 'Error 502 Bad Gateway',
      503: 'Error 503 Service Unavailable',
    };
  }
  getMessage() {
    return this.errors[this.e.response.status] || this.e.message;
  }
}
