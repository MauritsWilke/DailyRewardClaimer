import { createBot } from "mineflayer";
import pkg from "prismarine-auth";
import { bypassAuth } from "./bypassAuth.js";
import { Log } from "./utils.js";
const { Authflow, Titles } = pkg;

export async function login() {
	if (!process.env?.EMAIL) {
		throw new Error("No email provided");
	}

	Log("Started login");

	const flow = new Authflow(
		"",
		"./",
		{
			authTitle: Titles.MinecraftJava,
			deviceType: "Win32",
			doSisuAuth: true
		},

		/* eslint-disable @typescript-eslint/no-explicit-any */
		async function (res: any) {
			const userCode: string = res.userCode ?? res.user_code;
			Log(`Got auth code: ${userCode}`);
			const verificationUri = res.verificationUri ?? res.verification_uri;
			await bypassAuth(userCode);
		}
	);

	const { token } = await flow.getMinecraftJavaToken({
		fetchEntitlements: true,
		fetchProfile: true
	});

	const bot = createBot({
		username: process.env.EMAIL,
		accessToken: token,
		auth: "microsoft",
		host: "mc.hypixel.net",
		port: 25565,
		version: "1.8"
	});

	Log("Finished login");

	return bot;
}
