import config from "./config.json" assert { type: "json" };
import { Log } from "./utils.js";

interface Reward {
	gameType?: string;
	amount?: number;
	rarity: string;
	reward?: string;
	score: number;
	about: string;
}

interface DailyStreak {
	highScore?: number;
	keeps?: boolean;
	score?: number;
	token?: boolean;
	value?: number;
}

export async function logReward(reward: Reward, rewards: Reward[], dailyStreak: DailyStreak) {
	if (!process.env?.WEBHOOK_URL) {
		throw new Error("No webhook URL provided");
	}

	Log("Started reward log");

	const content = config.logFull
		? `\`\`\`🎉 Successfully claimed ${reward.about}!\n\n✨ Your other rewards were:\n • ${rewards[0].about}\n • ${rewards[1].about}\n\n🔥 Your current streak: ${(dailyStreak.score ?? 0) + 1}\n💯 Your highest streak: ${dailyStreak.highScore}\`\`\``
		: `:tada: Successfully claimed \`${reward.about}!\``;

	fetch(process.env.WEBHOOK_URL, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			username: `MauritsWilke/DailyRewardClaimer`,
			content: content,
			avatar_url: `https://pbs.twimg.com/profile_images/1346968969849171970/DdNypQdN_400x400.png`
		})
	});

	Log("Finished reward log");
}
