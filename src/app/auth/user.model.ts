export class User {
  constructor(
    public id: string,
    public email,
    private token: string,
    private tokenExpirationDate: Date
  ) {}

  getToken() {
    if (!this.tokenExpirationDate || this.tokenExpirationDate < new Date()) {
      return null;
    }
    return this.token;
  }
}
