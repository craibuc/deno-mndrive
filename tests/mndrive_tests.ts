import { assertEquals } from "https://deno.land/std@0.223.0/assert/mod.ts";
import { MockFetch } from "https://deno.land/x/deno_mock_fetch@0.1.1/mod.ts";

import { MnDrive } from "../mod.ts";

const mndrive = new MnDrive('Testing','username','password');

Deno.test("get_account_status returns an object", async () => {

    // arrange
    const body = JSON.stringify({
        Expiration: "9999-12-31T12:00:00.000000-06:00",
        Environment: "Testing"
      })

    const mockFetch = new MockFetch();
    mockFetch
        .intercept(`${mndrive.base_uri}/Services/Maintenance/Rest/ExpirationCheck`, { method: "GET" })
        .reply(body, { status: 200 });

    // act      
    const status = await mndrive.get_account_status();

    // assert
    assertEquals(status.Environment, 'Testing');

});

Deno.test("get_license returns an object", async () => {

    // arrange
    const dln = 'V112298685904'
    const body = JSON.stringify({ dln: dln })

    const mockFetch = new MockFetch();
    mockFetch
        .intercept(`${mndrive.base_uri}/Services/RecordRequest/v1/Search`, { method: "POST" })
        .reply(body, { status: 200 });

    // act      
    const license = await mndrive.get_license(dln);

    // assert
    assertEquals(license.dln, dln);

});

Deno.test("set_password returns an object", async () => {

    // arrange
    const date = new Date()
    const body = JSON.stringify({ NewExpiration: date.toISOString() })

    const mockFetch = new MockFetch();
    mockFetch
        .intercept(`${mndrive.base_uri}/Services/Maintenance/Rest/ChangePassword`, { method: "POST" })
        .reply(body, { status: 200 });

    // act      
    const results = await mndrive.set_password('lorem ipsum');

    // assert
    assertEquals(results.NewExpiration, date.toISOString());

});
