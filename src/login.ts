import { createBot } from "mineflayer";
import pkg from "prismarine-auth";
const { Authflow, Titles } = pkg;

export async function login() {
	if (!process.env?.EMAIL) {
		throw new Error("No email provided");
	}

	const flow = new Authflow(
		"",
		"./",
		{
			authTitle: Titles.MinecraftJava,
			deviceType: "Win32",
			doSisuAuth: true
		},

		/* eslint-disable @typescript-eslint/no-explicit-any */
		function (res: any) {
			const userCode = res.userCode ?? res.user_code;
			const verificationUri = res.verificationUri ?? res.verification_uri;
			console.log(verificationUri, userCode);
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

	return bot;
}
