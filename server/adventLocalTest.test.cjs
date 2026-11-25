"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { isLocalQuizTestRequest, readGuestKey } = require("./adventLocalTest.cjs");

function withEnv(name, value, fn) {
  const prev = process.env[name];
  if (value == null) delete process.env[name];
  else process.env[name] = value;
  try {
    return fn();
  } finally {
    if (prev === undefined) delete process.env[name];
    else process.env[name] = prev;
  }
}

test("lokalni test je isključen pa ni loopback ne otvara kviz", () => {
  withEnv("RENDER", null, () => {
    withEnv("RAILWAY_ENVIRONMENT", null, () => {
      withEnv("FLY_APP_NAME", null, () => {
        assert.equal(
          isLocalQuizTestRequest({ socket: { remoteAddress: "127.0.0.1" } }),
          false,
        );
        assert.equal(
          isLocalQuizTestRequest({ socket: { remoteAddress: "::ffff:127.0.0.1" } }),
          false,
        );
        assert.equal(
          isLocalQuizTestRequest({ socket: { remoteAddress: "203.0.113.8" } }),
          false,
        );
      });
    });
  });
});

test("PaaS nikad ne uključuje lokalni test, ni s loopback adresom", () => {
  withEnv("RENDER", "true", () => {
    assert.equal(
      isLocalQuizTestRequest({ socket: { remoteAddress: "127.0.0.1" } }),
      false,
    );
  });
});

test("gost ključ mora biti kratki alfanumerički token", () => {
  assert.equal(readGuestKey({ headers: { "x-advent-local-guest": "abc12345" } }), "abc12345");
  assert.equal(readGuestKey({ headers: { "x-advent-local-guest": "bad key" } }), "");
  assert.equal(readGuestKey({ headers: { "x-advent-local-guest": "short" } }), "");
});
