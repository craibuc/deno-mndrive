import { load } from "https://deno.land/std@0.222.1/dotenv/mod.ts";
const env = await load();

import { MnDrive } from "./mod.ts";

try {

    const mndrive = new MnDrive(env.MNDRIVE_SERVER, env.MNDRIVE_USERNAME, env.MNDRIVE_PASSWORD);

    const status = await mndrive.get_account_status();
    console.log('status',status)

    const license = await mndrive.get_license('V112298685904');
    console.log('license',license)

} catch (error) {
    console.error(error.message)
}
