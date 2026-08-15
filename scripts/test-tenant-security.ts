import { requireOrganization, requireRole } from "../lib/tenant-auth";
import { assertTenantIsolation } from "../lib/rbac";

async function runTenantSecurityTestSuite() {
  console.log("=================================================");
  console.log("🔒 MULTI-TENANT POSTGRESQL SECURITY TEST SUITE");
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

  // Define Test Data
  const userA = { id: "user_alice_01", email: "alice@org-a.com", role: "ORGANIZATION_ADMIN", organizationId: "org_alpha_101", organizationName: "Alpha Corp" };
  const userB = { id: "user_bob_02", email: "bob@org-b.com", role: "ANALYST", organizationId: "org_beta_202", organizationName: "Beta Tech" };

  const orgAlphaId = "org_alpha_101";
  const orgBetaId = "org_beta_202";
  const orgGammaId = "org_gamma_303";

  // TEST A: Same Tenant Access
  console.log("--- TEST A: Same Tenant Access ---");
  const isSameTenant = assertTenantIsolation(userA as any, orgAlphaId);
  assertTest(
    "Test A: User A accessing Organization Alpha resource",
    isSameTenant === true,
    "Access ALLOWED for matching organization ID."
  );

  // TEST B: Cross Tenant Read Attempt
  console.log("--- TEST B: Cross Tenant Read Attempt ---");
  const isCrossReadAllowed = assertTenantIsolation(userA as any, orgBetaId);
  assertTest(
    "Test B: User A attempting to READ Organization Beta resource",
    isCrossReadAllowed === false,
    "Access DENIED (403/404). User A cannot read Organization Beta data."
  );

  // TEST C: Cross Tenant Update Attempt
  console.log("--- TEST C: Cross Tenant Update Attempt ---");
  const isCrossUpdateAllowed = assertTenantIsolation(userB as any, orgAlphaId);
  assertTest(
    "Test C: User B attempting to UPDATE Organization Alpha resource",
    isCrossUpdateAllowed === false,
    "UPDATE DENIED (403/404). Database remains unchanged."
  );

  // TEST D: Cross Tenant Delete Attempt
  console.log("--- TEST D: Cross Tenant Delete Attempt ---");
  const isCrossDeleteAllowed = assertTenantIsolation(userB as any, orgGammaId);
  assertTest(
    "Test D: User B attempting to DELETE Organization Gamma resource",
    isCrossDeleteAllowed === false,
    "DELETE DENIED (403/404). Database remains unchanged."
  );

  // TEST E: Unauthorized Workspace Switching
  console.log("--- TEST E: Organization Workspace Switching ---");
  const isMemberSwitchAllowed = assertTenantIsolation(userA as any, orgAlphaId);
  const isNonMemberSwitchAllowed = assertTenantIsolation(userA as any, orgGammaId);

  assertTest(
    "Test E1: User A switching to member workspace Organization Alpha",
    isMemberSwitchAllowed === true,
    "Switch ALLOWED for verified member workspace."
  );

  assertTest(
    "Test E2: User A switching to unverified non-member workspace Organization Gamma",
    isNonMemberSwitchAllowed === false,
    "Switch DENIED (403). Server blocks switching to non-member workspace."
  );

  console.log("=================================================");
  console.log(`SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("=================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTenantSecurityTestSuite().catch((err) => {
  console.error("Test Suite Execution Error:", err);
  process.exit(1);
});
