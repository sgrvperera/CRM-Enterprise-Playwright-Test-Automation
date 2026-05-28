export interface RoleStrategy {
  email: string;
  password: string;
  roleName: string;
}

export class AdminStrategy implements RoleStrategy {
  readonly email = 'admin@example.com';
  readonly password = 'Admin123!';
  readonly roleName = 'admin';
}

export class ViewerStrategy implements RoleStrategy {
  readonly email = 'viewer@example.com';
  readonly password = 'Viewer123!';
  readonly roleName = 'viewer';
}
