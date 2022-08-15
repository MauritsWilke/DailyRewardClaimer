import type { Bot } from "mineflayer";
import { Log, sleep } from "./utils.js";
const REWARD_ITEM_SLOT = 31;

export async function getRewardURL(client: Bot): Promise<string | undefined> {
	return new Promise((resolve, reject) => {
		client.chat("/delivery");

		client.once("windowOpen", async (window) => {
			await sleep(1000);

			if (window.slots[REWARD_ITEM_SLOT].name === "coal_block") {
				Log("Reward already claimed");
				client.quit();
				Log("Logged off");
				resolve(undefined);
			}

			client.simpleClick.leftMouse(REWARD_ITEM_SLOT);

			client.on("message", async (jsonMsg) => {
				const message = jsonMsg.toString();
				// prettier-ignore
				if (message.match("https://rewards.hypixel.net/claim-reward/")) {
					const rewardURL = message.match(/https:\/\/rewards\.hypixel\.net\/claim-reward\/.*/gm);
					Log(`Reward URL retrieved: ${rewardURL}`);
					resolve(rewardURL?.[0] ? rewardURL[0] : undefined);
				}
			});
		});
	});
}
