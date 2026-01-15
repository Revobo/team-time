import { appPageSelectors } from "./selectors/appPageSelectors";
import { createEventDialogSelectors } from "./selectors/createEventDialogSelectors";
import { eventListSelectors } from "./selectors/eventListSelectors";
import { loginPageSelectors } from "./selectors/loginPageSelectors";
import { cleanupTestEvents } from "./utils/dbCleanup";

fixture`Create Event Dialog`
	.page`http://localhost:5173/login`
	.beforeEach(async (t) => {
		await t.typeText(loginPageSelectors.email, "alice@example.com");
		await t.typeText(loginPageSelectors.password, "TestPassword1!");
		await t.click(loginPageSelectors.submitButton);

		await t.expect(appPageSelectors.userName.exists).ok({ timeout: 10000 });

		await t.click(eventListSelectors.createButton);
	})
	.after(async () => {
		await cleanupTestEvents();
	});

test("should display dialog with all form elements", async (t) => {
	await t.expect(createEventDialogSelectors.dialog.exists).ok({ timeout: 5000 });
	await t.expect(createEventDialogSelectors.title.exists).ok();
	await t.expect(createEventDialogSelectors.nameInput.exists).ok();
	await t.expect(createEventDialogSelectors.descriptionInput.exists).ok();
	await t.expect(createEventDialogSelectors.datetimeInput.exists).ok();
	await t.expect(createEventDialogSelectors.addTimeButton.exists).ok();
	await t.expect(createEventDialogSelectors.cancelButton.exists).ok();
	await t.expect(createEventDialogSelectors.createButton.exists).ok();
});

test("should have create button disabled initially", async (t) => {
	await t.expect(createEventDialogSelectors.createButton.hasAttribute("disabled")).ok();
});

test("should add proposed time to list", async (t) => {
	const futureDate = new Date();
	futureDate.setDate(futureDate.getDate() + 1);
	const dateString = futureDate.toISOString().slice(0, 16);

	await t.typeText(createEventDialogSelectors.datetimeInput, dateString);
	await t.click(createEventDialogSelectors.addTimeButton);

	await t.expect(createEventDialogSelectors.timesList.exists).ok({ timeout: 3000 });
	await t.expect(createEventDialogSelectors.timeItem.count).eql(1);
});

test("should remove proposed time from list", async (t) => {
	const futureDate = new Date();
	futureDate.setDate(futureDate.getDate() + 1);
	const dateString = futureDate.toISOString().slice(0, 16);

	await t.typeText(createEventDialogSelectors.datetimeInput, dateString);
	await t.click(createEventDialogSelectors.addTimeButton);
	await t.expect(createEventDialogSelectors.timeItem.count).eql(1);

	await t.click(createEventDialogSelectors.removeTimeButton);
	await t.expect(createEventDialogSelectors.timeItem.exists).notOk();
});

test("should enable create button when form is valid", async (t) => {
	const futureDate = new Date();
	futureDate.setDate(futureDate.getDate() + 1);
	const dateString = futureDate.toISOString().slice(0, 16);

	await t.typeText(createEventDialogSelectors.nameInput, "Test Event");
	await t.typeText(createEventDialogSelectors.datetimeInput, dateString);
	await t.click(createEventDialogSelectors.addTimeButton);

	await t.expect(createEventDialogSelectors.createButton.hasAttribute("disabled")).notOk();
});

test("should close dialog on cancel", async (t) => {
	await t.click(createEventDialogSelectors.cancelButton);
	await t.expect(createEventDialogSelectors.dialog.exists).notOk({ timeout: 3000 });
});

test("should create event and close dialog", async (t) => {
	const futureDate = new Date();
	futureDate.setDate(futureDate.getDate() + 1);
	const dateString = futureDate.toISOString().slice(0, 16);
	const eventName = `Test Event ${Date.now()}`;

	await t.typeText(createEventDialogSelectors.nameInput, eventName);
	await t.typeText(createEventDialogSelectors.descriptionInput, "Test description");
	await t.typeText(createEventDialogSelectors.datetimeInput, dateString);
	await t.click(createEventDialogSelectors.addTimeButton);
	await t.click(createEventDialogSelectors.createButton);

	await t.expect(createEventDialogSelectors.dialog.exists).notOk({ timeout: 5000 });
});
