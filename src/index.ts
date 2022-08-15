import "dotenv/config";
import type { Bot } from "mineflayer";
import { login } from "./login.js";
import { claimReward } from "./claimReward.js";
import { Log } from "./utils.js";
import { getRewardURL } from "./getRewardURL.js";

const client: Bot = await login();
client.once("spawn", async () => {
	Log(`Logged in as ${client.username}`);

	const rewardURL = await getRewardURL(client);
	if (rewardURL) {
		await claimReward(rewardURL);
		client.quit();
		Log(`Logged off`);
	} else Log("Reward URL undefined for some reason.");
});
