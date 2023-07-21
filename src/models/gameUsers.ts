export class GameUsers {
  users: Map<string, string>;

  constructor() {
    this.users = new Map();
  }

  set removeUser(name: string) {
    this.users.delete(name);
  }

  isUserExist = (name: string, id: string) => {
    return this.users.has(name) && this.users.get(name) !== id;
  };

  addUser = (name: string, id: string) => {
    this.users.set(name, id);
  };
}
