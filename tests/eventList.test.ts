import { appPageSelectors } from "./selectors/appPageSelectors";
import { createEventDialogSelectors } from "./selectors/createEventDialogSelectors";
import { eventCardSelectors } from "./selectors/eventCardSelectors";
import { eventListSelectors } from "./selectors/eventListSelectors";
import { loginPageSelectors } from "./selectors/loginPageSelectors";

fixture`Event List`.page`http://localhost:5173/login`.beforeEach(async (t) => {
	await t.typeText(loginPageSelectors.email, "alice@example.com");
	await t.typeText(loginPageSelectors.password, "TestPassword1!");
	await t.click(loginPageSelectors.submitButton);

	await t.expect(appPageSelectors.userName.exists).ok({ timeout: 10000 });
});

test("should display event list container", async (t) => {
	await t.expect(eventListSelectors.container.exists).ok({ timeout: 5000 });
});

test("should display header with title", async (t) => {
	await t.expect(eventListSelectors.header.exists).ok({ timeout: 5000 });
	await t.expect(eventListSelectors.title.exists).ok();
	await t.expect(eventListSelectors.title.innerText).eql("Events");
});

test("should display past events switch", async (t) => {
	await t.expect(eventListSelectors.pastSwitch.exists).ok({ timeout: 5000 });
});

test("should display events container", async (t) => {
	await t.expect(eventListSelectors.eventsContainer.exists).ok({ timeout: 5000 });
});

test("should display event cards", async (t) => {
	await t.expect(eventCardSelectors.card.exists).ok({ timeout: 5000 });
	await t.expect(eventCardSelectors.card.count).gte(1);
});

test("should display create event button", async (t) => {
	await t.expect(eventListSelectors.createButton.exists).ok({ timeout: 5000 });
});

test("should open create event dialog on button click", async (t) => {
	await t.click(eventListSelectors.createButton);
	await t.expect(createEventDialogSelectors.dialog.exists).ok({ timeout: 3000 });
});

test("should toggle past events switch", async (t) => {
	const switchInput = eventListSelectors.pastSwitch.find("input");

	await t.click(eventListSelectors.pastSwitch);
	await t.expect(switchInput.checked).ok();

	await t.click(eventListSelectors.pastSwitch);
	await t.expect(switchInput.checked).notOk();
});
