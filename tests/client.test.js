const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const YandexGPTWriter = require("../lib/index.js");

describe("YandexGPTWriter", () => {
  it("throws without oauthToken", () => {
    assert.throws(() => new YandexGPTWriter({}), /OAuth token is required/);
  });

  it("exposes text, image and audio handlers", () => {
    const client = new YandexGPTWriter({
      oauthToken: "test-token",
      catalogId: "b1catalog",
    });
    assert.ok(client.text);
    assert.ok(client.image);
    assert.ok(client.audio);
  });
});

describe("AudioHandler.synthesize", () => {
  it("sends form-urlencoded body with folderId", async () => {
    const calls = [];
    const originalFetch = global.fetch;
    global.fetch = async (url, init = {}) => {
      calls.push({ url: String(url), init });
      if (String(url).includes("/iam/")) {
        return {
          ok: true,
          json: async () => ({ iamToken: "iam-test" }),
        };
      }
      return {
        ok: true,
        arrayBuffer: async () => new Uint8Array([1, 2, 3]).buffer,
      };
    };

    try {
      const client = new YandexGPTWriter({
        oauthToken: "oauth",
        catalogId: "folder-1",
      });
      const audio = await client.audio.synthesize("привет", "alena");
      assert.deepEqual([...audio], [1, 2, 3]);

      const tts = calls.find((c) => String(c.url).includes("tts:synthesize"));
      assert.ok(tts);
      assert.equal(
        tts.init.headers["Content-Type"],
        "application/x-www-form-urlencoded"
      );
      assert.match(String(tts.init.body), /folderId=folder-1/);
      assert.match(String(tts.init.body), /text=/);
      assert.match(String(tts.init.body), /voice=alena/);
      client.destroy();
    } finally {
      global.fetch = originalFetch;
    }
  });
});
