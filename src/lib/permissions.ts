export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  MANAGER: "MANAGER",
  RECEPTIONIST: "RECEPTIONIST",
  HR: "HR",
  FINANCE: "FINANCE",
};

export const PERMISSIONS = {
  DASHBOARD_VIEW: "dashboard.view",
  APPOINTMENTS_VIEW: "appointments.view",
  APPOINTMENTS_MANAGE: "appointments.manage",
  APPOINTMENTS_CANCEL: "appointments.cancel",
  APPOINTMENTS_RESCHEDULE: "appointments.reschedule",
  SPECIALISTS_VIEW: "specialists.view",
  SPECIALISTS_MANAGE: "specialists.manage",
  AVAILABILITY_MANAGE: "availability.manage",
  CUSTOMERS_VIEW: "customers.view",
  PAYMENTS_VIEW: "payments.view",
  PAYMENTS_MANAGE: "payments.manage",
  APPLICATIONS_VIEW: "applications.view",
  APPLICATIONS_MANAGE: "applications.manage",
  REPORTS_VIEW: "reports.view",
  ADMIN_USERS_MANAGE: "admin_users.manage",
  SETTINGS_MANAGE: "settings.manage",
  ACTIVITY_LOGS_VIEW: "activity_logs.view",
};

const ROLE_PERMISSIONS: Record<string, string[]> = {
  [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS), // Has all permissions
  
  [ROLES.MANAGER]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.APPOINTMENTS_VIEW,
    PERMISSIONS.APPOINTMENTS_MANAGE,
    PERMISSIONS.APPOINTMENTS_CANCEL,
    PERMISSIONS.APPOINTMENTS_RESCHEDULE,
    PERMISSIONS.SPECIALISTS_VIEW,
    PERMISSIONS.SPECIALISTS_MANAGE,
    PERMISSIONS.AVAILABILITY_MANAGE,
    PERMISSIONS.CUSTOMERS_VIEW,
    PERMISSIONS.REPORTS_VIEW,
  ],
  
  [ROLES.RECEPTIONIST]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.APPOINTMENTS_VIEW,
    PERMISSIONS.APPOINTMENTS_MANAGE,
    PERMISSIONS.CUSTOMERS_VIEW,
  ],
  
  [ROLES.HR]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.APPLICATIONS_VIEW,
    PERMISSIONS.APPLICATIONS_MANAGE,
  ],
  
  [ROLES.FINANCE]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.PAYMENTS_VIEW,
    PERMISSIONS.PAYMENTS_MANAGE,
    PERMISSIONS.REPORTS_VIEW,
  ],
};

export function hasPermission(userRole: string, permission: string): boolean {
  if (!userRole) return false;
  const permissions = ROLE_PERMISSIONS[userRole] || [];
  return permissions.includes(permission);
}
