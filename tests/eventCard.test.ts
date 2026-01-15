import { appPageSelectors } from "./selectors/appPageSelectors";
import { eventCardSelectors } from "./selectors/eventCardSelectors";
import { loginPageSelectors } from "./selectors/loginPageSelectors";

fixture`Event Card`.page`http://localhost:5173/login`.beforeEach(async (t) => {
	await t.typeText(loginPageSelectors.email, "alice@example.com");
	await t.typeText(loginPageSelectors.password, "TestPassword1!");
	await t.click(loginPageSelectors.submitButton);

	await t.expect(appPageSelectors.userName.exists).ok({ timeout: 10000 });
});

test("should display event cards", async (t) => {
	await t.expect(eventCardSelectors.card.exists).ok({ timeout: 5000 });
	await t.expect(eventCardSelectors.card.count).gte(1);
});

test("should display event name on cards", async (t) => {
	await t.expect(eventCardSelectors.eventName.exists).ok({ timeout: 5000 });
	await t.expect(eventCardSelectors.eventName.innerText).notEql("");
});

test("should display event state chip", async (t) => {
	await t.expect(eventCardSelectors.state.exists).ok({ timeout: 5000 });
	const stateText = await eventCardSelectors.state.innerText;
	await t.expect(stateText === "Voting" || stateText === "Finalized").ok();
});

test("should display creator name", async (t) => {
	await t.expect(eventCardSelectors.createdBy.exists).ok({ timeout: 5000 });
	await t.expect(eventCardSelectors.createdBy.innerText).contains("Created by");
});

test("should be clickable", async (t) => {
	await t.expect(eventCardSelectors.card.exists).ok({ timeout: 5000 });
	await t.click(eventCardSelectors.card);
});
