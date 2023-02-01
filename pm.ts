enum Permission {
  Read,
  Write,
  Execute,
  ManageRoles,
  BanUsers,
  KickUsers
}

class Role {
  constructor(private name: string, private permissions: Permission[]) {}

  hasPermission(permission: Permission): boolean {
    return this.permissions.includes(permission);
  }
}

class User {
  constructor(private username: string, private role: Role) {}

  hasPermission(permission: Permission): boolean {
    return this.role.hasPermission(permission);
  }
}

const memberRole = new Role("Member", [Permission.Read, Permission.Write]);
const moderatorRole = new Role("Moderator", [
  Permission.Read,
  Permission.Write,
  Permission.KickUsers,
  Permission.BanUsers
]);
const administratorRole = new Role("Administrator", [
  Permission.Read,
  Permission.Write,
  Permission.Execute,
  Permission.ManageRoles,
  Permission.BanUsers,
  Permission.KickUsers
]);

const user = new User("John Doe", memberRole);

console.log(user.hasPermission(Permission.Read)); // true
console.log(user.hasPermission(Permission.BanUsers)); // false

const moderator = new User("Jane Doe", moderatorRole);

console.log(moderator.hasPermission(Permission.BanUsers)); // true
console.log(moderator.hasPermission(Permission.Execute)); // false

const administrator = new User("Jim Doe", administratorRole);

console.log(administrator.hasPermission(Permission.ManageRoles)); // true
