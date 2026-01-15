import { appPageSelectors } from "./selectors/appPageSelectors";
import { eventCardSelectors } from "./selectors/eventCardSelectors";
import { eventDetailSelectors } from "./selectors/eventDetailSelectors";
import { loginPageSelectors } from "./selectors/loginPageSelectors";
import { proposeTimeDialogSelectors } from "./selectors/proposeTimeDialogSelectors";

fixture`Propose Time Dialog`.page`http://localhost:5173/login`.beforeEach(async (t) => {
	await t.typeText(loginPageSelectors.email, "alice@example.com");
	await t.typeText(loginPageSelectors.password, "TestPassword1!");
	await t.click(loginPageSelectors.submitButton);

	await t.expect(appPageSelectors.userName.exists).ok({ timeout: 10000 });

	await t.expect(eventCardSelectors.card.exists).ok({ timeout: 5000 });
	await t.click(eventCardSelectors.card);

	const stateText = await eventDetailSelectors.stateChip.innerText;

	if (stateText === "Voting") {
		await t.click(eventDetailSelectors.proposeTimeButton);
	}
});

test("should display dialog with all elements", async (t) => {
	if (!(await eventDetailSelectors.stateChip.exists)) return;
	const stateText = await eventDetailSelectors.stateChip.innerText;
	if (stateText !== "Voting") return;

	await t.expect(proposeTimeDialogSelectors.dialog.exists).ok({ timeout: 5000 });
	await t.expect(proposeTimeDialogSelectors.title.exists).ok();
	await t.expect(proposeTimeDialogSelectors.datetimeInput.exists).ok();
	await t.expect(proposeTimeDialogSelectors.cancelButton.exists).ok();
	await t.expect(proposeTimeDialogSelectors.proposeButton.exists).ok();
});

test("should display correct title", async (t) => {
	if (!(await eventDetailSelectors.stateChip.exists)) return;
	const stateText = await eventDetailSelectors.stateChip.innerText;
	if (stateText !== "Voting") return;

	await t.expect(proposeTimeDialogSelectors.title.innerText).eql("Propose a Time");
});

test("should have propose button disabled initially", async (t) => {
	if (!(await eventDetailSelectors.stateChip.exists)) return;
	const stateText = await eventDetailSelectors.stateChip.innerText;
	if (stateText !== "Voting") return;

	await t.expect(proposeTimeDialogSelectors.proposeButton.hasAttribute("disabled")).ok();
});

test("should enable propose button when datetime is entered", async (t) => {
	if (!(await eventDetailSelectors.stateChip.exists)) return;
	const stateText = await eventDetailSelectors.stateChip.innerText;
	if (stateText !== "Voting") return;

	const futureDate = new Date();
	futureDate.setDate(futureDate.getDate() + 1);
	const dateString = futureDate.toISOString().slice(0, 16);

	await t.typeText(proposeTimeDialogSelectors.datetimeInput, dateString);
	await t.expect(proposeTimeDialogSelectors.proposeButton.hasAttribute("disabled")).notOk();
});

test("should close dialog on cancel", async (t) => {
	if (!(await eventDetailSelectors.stateChip.exists)) return;
	const stateText = await eventDetailSelectors.stateChip.innerText;
	if (stateText !== "Voting") return;

	await t.click(proposeTimeDialogSelectors.cancelButton);
	await t.expect(proposeTimeDialogSelectors.dialog.exists).notOk({ timeout: 3000 });
});

test("should propose time and close dialog", async (t) => {
	if (!(await eventDetailSelectors.stateChip.exists)) return;
	const stateText = await eventDetailSelectors.stateChip.innerText;
	if (stateText !== "Voting") return;

	const futureDate = new Date();
	futureDate.setDate(futureDate.getDate() + 7);
	const dateString = futureDate.toISOString().slice(0, 16);

	await t.typeText(proposeTimeDialogSelectors.datetimeInput, dateString);
	await t.click(proposeTimeDialogSelectors.proposeButton);
	await t.expect(proposeTimeDialogSelectors.dialog.exists).notOk({ timeout: 5000 });
});
