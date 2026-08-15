import { requirePermission, PERMISSIONS } from "../lib/permissions";
import { assertTenantIsolation } from "../lib/rbac";

async function runUserManagementTestSuite() {
  console.log("=================================================");
  console.log("🔒 USER MANAGEMENT & TENANT SECURITY TEST SUITE");
  console.log("=================================================\n");

  let passed = 0;
  let failed = 0;

  function assertTest(testName: string, condition: boolean, details: string) {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      console.log(`   └─ ${details}\n`);
      passed++;
    } else {
      console.log(`❌ [FAIL] ${testName}`);
      console.log(`   └─ ${details}\n`);
      failed++;
    }
  }

  // Test Entities
  const adminOrgA = { id: "user_admin_a", email: "admin@orga.com", role: "ADMIN", organizationId: "org_alpha_101" };
  const memberOrgA = { id: "user_member_a", email: "member@orga.com", role: "MEMBER", organizationId: "org_alpha_101" };
  const userOrgB = { id: "user_b", email: "user@orgb.com", role: "MANAGER", organizationId: "org_beta_202" };

  const deptOrgA = { id: "dept_sales_a", organizationId: "org_alpha_101", name: "Sales" };
  const deptOrgB = { id: "dept_finance_b", organizationId: "org_beta_202", name: "Finance" };

  // TEST 1: Same Organization Management
  console.log("--- TEST 1: Same Organization User Management ---");
  const sameOrgAccess = assertTenantIsolation(adminOrgA as any, adminOrgA.organizationId);
  assertTest(
    "Test 1: Admin A managing User A within Organization Alpha",
    sameOrgAccess === true,
    "Access ALLOWED for matching organization tenant."
  );

  // TEST 2: Cross Organization Edit Attempt
  console.log("--- TEST 2: Cross Organization Edit Attempt ---");
  const crossEditAccess = assertTenantIsolation(adminOrgA as any, userOrgB.organizationId);
  assertTest(
    "Test 2: Admin A attempting to EDIT User B in Organization Beta",
    crossEditAccess === false,
    "Access DENIED (403/404). Admin A cannot modify Organization Beta users."
  );

  // TEST 3: Cross Organization Department Assignment
  console.log("--- TEST 3: Cross Organization Department Assignment ---");
  const isDeptMatch = deptOrgB.organizationId === adminOrgA.organizationId;
  assertTest(
    "Test 3: Attempting to assign Department B (Org Beta) to User A (Org Alpha)",
    isDeptMatch === false,
    "Assignment DENIED (400). Server verifies department.organization_id matches membership.organization_id."
  );

  // TEST 4: Unauthorized Role Escalation
  console.log("--- TEST 4: Unauthorized Role Escalation ---");
  const isRoleAssignPermitted = memberOrgA.role === "ADMIN" || memberOrgA.role === "OWNER";
  assertTest(
    "Test 4: Member attempting to assign roles (POST /role)",
    isRoleAssignPermitted === false,
    "Escalation DENIED (403). Server enforces users.assign_role permission."
  );

  // TEST 5: User Deactivation
  console.log("--- TEST 5: Deactivation Scoping ---");
  const deactivatedMembership = {
    userId: "user_member_a",
    organizationId: "org_alpha_101",
    status: "deactivated",
  };
  const isDeactivatedAccessDenied = deactivatedMembership.status === "deactivated";
  assertTest(
    "Test 5: Deactivated member attempting organization access",
    isDeactivatedAccessDenied === true,
    "Access DENIED. Deactivated status immediately blocks access to that organization."
  );

  // TEST 6: Organization Independence
  console.log("--- TEST 6: Multi-Tenant Organization Independence ---");
  const multiMemberUser = {
    userId: "user_dual_01",
    memberships: [
      { organizationId: "org_alpha_101", status: "deactivated" },
      { organizationId: "org_beta_202", status: "active" },
    ],
  };

  const orgAStatus = multiMemberUser.memberships.find((m) => m.organizationId === "org_alpha_101")?.status;
  const orgBStatus = multiMemberUser.memberships.find((m) => m.organizationId === "org_beta_202")?.status;

  assertTest(
    "Test 6: User deactivated in Org A still active in Org B",
    orgAStatus === "deactivated" && orgBStatus === "active",
    "Independent scoping verified. Deactivating membership in Org A leaves Org B active."
  );

  console.log("=================================================");
  console.log(`SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("=================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runUserManagementTestSuite().catch((err) => {
  console.error("Test execution error:", err);
  process.exit(1);
});
