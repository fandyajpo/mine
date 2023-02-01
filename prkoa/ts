import Koa from "koa";
import Router from "koa-router";

enum Permission {
  Read,
  Write,
  Execute,
  ManageRoles,
  BanUsers,
  KickUsers
}

const roles = {
  Member: [Permission.Read, Permission.Write],
  Moderator: [
    Permission.Read,
    Permission.Write,
    Permission.KickUsers,
    Permission.BanUsers
  ],
  Administrator: [
    Permission.Read,
    Permission.Write,
    Permission.Execute,
    Permission.ManageRoles,
    Permission.BanUsers,
    Permission.KickUsers
  ]
};

const hasPermission = (userRole: string, permission: Permission): boolean => {
  const userPermissions = roles[userRole];
  if (!userPermissions) {
    return false;
  }
  return userPermissions.includes(permission);
};

const authorize = (permission: Permission) => {
  return async (ctx: Koa.Context, next: () => Promise<void>) => {
    const userRole = ctx.state.user.role;
    if (!hasPermission(userRole, permission)) {
      ctx.status = 403;
      ctx.body = { error: "Forbidden" };
      return;
    }
    await next();
  };
};

const app = new Koa();
const router = new Router();

router.get("/protected", authorize(Permission.Read), (ctx: Koa.Context) => {
  ctx.body = { message: "Access granted" };
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000);
