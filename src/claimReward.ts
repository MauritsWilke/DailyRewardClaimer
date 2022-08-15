import puppeteer, { Page } from "puppeteer";
import { Log, sleep } from "./utils.js";
import config from "./config.json" assert { type: "json" };
import { logReward } from "./logReward.js";
const priority = config.priority.reverse();

interface Reward {
	gameType?: string;
	amount?: number;
	rarity: string;
	reward?: string;
	score: number;
	about: string;
}

export async function claimReward(rewardURL: string) {

	Log("Starting claimReward");

	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	page.setUserAgent(
		"Mozilla/5.0 (Windows NT 5.1; rv:5.0) Gecko/20100101 Firefox/5.0"
	);
	await page.goto(rewardURL, {
		waitUntil: "networkidle0"
	});

	const appDataRes = (await page.evaluate("window.appData")) as string;
	const appData = JSON.parse(appDataRes);

	if (appData.skippable) {
		Log("Skipping ad");
		await page.click(config.selectors.skip);
	} else {
		Log(`Playing ad | ${appData.ad.duration + 1} seconds`);
		await page.waitForSelector(config.selectors.play);
		await page.click(config.selectors.play);
		await sleep(appData.ad.duration * 1000 + 1000);
		Log("Finished playing ad");
	}

	await sleep(4000); // delay for chest animation
	for (let i = 1; i < 4; i++) {
		await page.hover(config.selectors.card.replace("$i", i.toString()));
	}
	await sleep(2000); // wait for tooltips to appear in code (for some reason)

	for (let i = 0; i < 3; i++) {
		const reward = appData.rewards[i] as Reward;
		reward.score = getRewardRanking(reward);
		reward.about = await getTooltip(page, i + 1, reward);
	}

	// get the reward with the highest score (as object)
	// prettier-ignore
	const rewardToClaim:Reward = appData.rewards.reduce((r1: Reward, r2: Reward) => {
		return r1.score >= r2.score ? r1 : r2;
	}, {});
	const rewardToClaimNum = appData.rewards.indexOf(rewardToClaim) + 1;
	Log(`Claiming ${rewardToClaim.about}`);

	await page.click(config.selectors.card.replace("$i", rewardToClaimNum));

	// Logging
	appData.rewards.splice(rewardToClaimNum - 1, 1);
	if(config.logRewards) logReward(rewardToClaim, appData.rewards);

	browser.close();

	Log("Finished claimReward");

}

function getRewardRanking(reward: Reward) {
	const ranking = Object.values(reward).map((v: string) => {
		return priority.indexOf(v) + 1;
	});
	return ranking.reduce((a, b) => a + b, 0);
}

async function getTooltip(page: Page, index: number, reward: Reward) {
	const base = config.selectors.tooltip.base.replace("$i", index.toString());
	const raritySelector = base + config.selectors.tooltip.rarity;
	const titleSelector = base + config.selectors.tooltip.title;

	const rarity = await page.$eval(raritySelector, (el) => el.innerHTML);
	const title = await page.$eval(titleSelector, (el) => el.innerHTML);
	const amount = reward?.amount ? `${reward?.amount} ` : "";
	const about = `[${rarity}] ${amount}${title}`;
	return about;
}