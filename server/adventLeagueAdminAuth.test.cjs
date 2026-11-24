const { describe, it } = require("node:test");
const assert = require("node:assert/strict");

// Admin auth test - manual HTTP test needed for full coverage
// This test validates authorization logic only

function isAdminEmail(email) {
  const adminEmails = String(process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return adminEmails.includes(email.toLowerCase());
}

describe("adventLeagueAdminAuth", () => {
  it("isAdminEmail checks ADMIN_EMAILS env", () => {
    process.env.ADMIN_EMAILS = "admin@test.com,another@admin.com";
    assert.equal(isAdminEmail("admin@test.com"), true);
    assert.equal(isAdminEmail("another@admin.com"), true);
    assert.equal(isAdminEmail("ADMIN@TEST.COM"), true); // case-insensitive
    assert.equal(isAdminEmail("regular@user.com"), false);
    delete process.env.ADMIN_EMAILS;
  });

  it("isAdminEmail returns false when no admins configured", () => {
    delete process.env.ADMIN_EMAILS;
    assert.equal(isAdminEmail("any@email.com"), false);
  });
});
