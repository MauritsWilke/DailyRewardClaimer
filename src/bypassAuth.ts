import puppeteer from "puppeteer";
import { Log } from "./utils.js";
const URL = "https://www.microsoft.com/link";
const TIME_DELAY_MS = 1000; // time to wait between actions for animations to stop playing

export async function bypassAuth(code: string) {
	if (!process.env?.EMAIL || !process.env?.PASSWORD) {
		throw new Error("No email and/or password provided");
	}

	Log("Starting auth bypass");

	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	page.setUserAgent(
		"Mozilla/5.0 (Windows NT 5.1; rv:5.0) Gecko/20100101 Firefox/5.0"
	);
	await page.goto(URL, {
		waitUntil: "networkidle0"
	});

	await page.waitForSelector("#otc");
	const inputField = await page.$("#otc");
	if (!inputField) throw new Error("Failed to find input field");
	await inputField.type(code);
	await page.keyboard.press("Enter");

	await page.waitForTimeout(TIME_DELAY_MS);

	await page.waitForSelector("#i0116");
	const emailField = await page.$("#i0116");
	if (!emailField) throw new Error("Failed to find email field");
	await emailField.type(process.env.EMAIL);
	await page.keyboard.press("Enter");

	await page.waitForTimeout(TIME_DELAY_MS);

	await page.waitForSelector("#i0118");
	const passwordField = await page.$("#i0118");
	if (!passwordField) throw new Error("Failed to find email field");
	await passwordField.type(process.env.PASSWORD);
	await page.keyboard.press("Enter");

	await page.waitForTimeout(TIME_DELAY_MS);

	await page.waitForSelector("#idBtn_Back", { timeout: 2000 });
	const noButton = await page.$("#idBtn_Back");
	if (noButton) await noButton.click();

	browser.close();

	Log("Succesfully bypassed auth!");
}
