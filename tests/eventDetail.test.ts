import { appPageSelectors } from "./selectors/appPageSelectors";
import { eventCardSelectors } from "./selectors/eventCardSelectors";
import { eventDetailSelectors } from "./selectors/eventDetailSelectors";
import { loginPageSelectors } from "./selectors/loginPageSelectors";

fixture`Event Detail`.page`http://localhost:5173/login`.beforeEach(async (t) => {
	await t.typeText(loginPageSelectors.email, "alice@example.com");
	await t.typeText(loginPageSelectors.password, "TestPassword1!");
	await t.click(loginPageSelectors.submitButton);

	await t.expect(appPageSelectors.userName.exists).ok({ timeout: 10000 });

	await t.expect(eventCardSelectors.card.exists).ok({ timeout: 5000 });
	await t.click(eventCardSelectors.card);
});

test("should display event detail dialog", async (t) => {
	await t.expect(eventDetailSelectors.dialog.exists).ok({ timeout: 5000 });
	await t.expect(eventDetailSelectors.title.exists).ok();
	await t.expect(eventDetailSelectors.stateChip.exists).ok();
	await t.expect(eventDetailSelectors.createdBy.exists).ok();
	await t.expect(eventDetailSelectors.closeButton.exists).ok();
});

test("should display event title", async (t) => {
	await t.expect(eventDetailSelectors.title.innerText).notEql("");
});

test("should display state as Voting or Finalized", async (t) => {
	const stateText = await eventDetailSelectors.stateChip.innerText;
	await t.expect(stateText === "Voting" || stateText === "Finalized").ok();
});

test("should display creator information", async (t) => {
	await t.expect(eventDetailSelectors.createdBy.innerText).contains("Created by");
});

test("should display proposals list", async (t) => {
	await t.expect(eventDetailSelectors.proposalsList.exists).ok();
	await t.expect(eventDetailSelectors.proposalItem.count).gte(1);
});

test("should display proposal date and time", async (t) => {
	await t.expect(eventDetailSelectors.proposalDate.exists).ok();
	await t.expect(eventDetailSelectors.proposalDate.innerText).notEql("");
});

test("should display vote count", async (t) => {
	await t.expect(eventDetailSelectors.voteCount.exists).ok();
});

test("should close dialog on close button click", async (t) => {
	await t.click(eventDetailSelectors.closeButton);
	await t.expect(eventDetailSelectors.dialog.exists).notOk({ timeout: 3000 });
});

test("should allow upvoting a proposal", async (t) => {
	const stateText = await eventDetailSelectors.stateChip.innerText;
	if (stateText === "Voting") {
		await t.expect(eventDetailSelectors.upvoteButton.exists).ok();
		await t.click(eventDetailSelectors.upvoteButton);
	}
});

test("should allow downvoting a proposal", async (t) => {
	const stateText = await eventDetailSelectors.stateChip.innerText;
	if (stateText === "Voting") {
		await t.expect(eventDetailSelectors.downvoteButton.exists).ok();
		await t.click(eventDetailSelectors.downvoteButton);
	}
});
