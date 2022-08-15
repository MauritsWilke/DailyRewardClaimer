import "dotenv/config";
import type { Bot } from "mineflayer";
import { login } from "./login.js";
import { claimReward } from "./claimReward.js";

const bot: Bot = await login();

bot.on("message", async (jsonMsg) => {
	if (jsonMsg.toString().match("https://rewards.hypixel.net/claim-reward/")) {
		const rewardURL = jsonMsg
			.toString()
			.match(/https:\/\/rewards\.hypixel\.net\/claim-reward\/.*/gm);

		if (rewardURL?.[0]) {
			await claimReward(rewardURL[0]);
		}
	}
});
