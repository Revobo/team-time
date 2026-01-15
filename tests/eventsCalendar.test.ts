import { appPageSelectors } from "./selectors/appPageSelectors";
import { eventsCalendarSelectors } from "./selectors/eventsCalendarSelectors";
import { loginPageSelectors } from "./selectors/loginPageSelectors";

fixture`Events Calendar`.page`http://localhost:5173/login`.beforeEach(async (t) => {
	await t.typeText(loginPageSelectors.email, "alice@example.com");
	await t.typeText(loginPageSelectors.password, "TestPassword1!");
	await t.click(loginPageSelectors.submitButton);

	await t.expect(appPageSelectors.userName.exists).ok({ timeout: 10000 });
});

test("should display calendar container", async (t) => {
	await t.expect(eventsCalendarSelectors.container.exists).ok({ timeout: 5000 });
});

test("should display calendar component", async (t) => {
	await t.expect(eventsCalendarSelectors.calendar.exists).ok({ timeout: 5000 });
});

test("should display calendar toolbar", async (t) => {
	await t.expect(eventsCalendarSelectors.toolbar.exists).ok({ timeout: 5000 });
});

test("should display navigation buttons", async (t) => {
	await t.expect(eventsCalendarSelectors.todayButton.exists).ok({ timeout: 5000 });
	await t.expect(eventsCalendarSelectors.backButton.exists).ok();
	await t.expect(eventsCalendarSelectors.nextButton.exists).ok();
});

test("should display view buttons", async (t) => {
	await t.expect(eventsCalendarSelectors.monthButton.exists).ok({ timeout: 5000 });
	await t.expect(eventsCalendarSelectors.weekButton.exists).ok();
	await t.expect(eventsCalendarSelectors.dayButton.exists).ok();
});

test("should navigate to previous month", async (t) => {
	const initialLabel = await eventsCalendarSelectors.toolbarLabel.innerText;

	await t.click(eventsCalendarSelectors.backButton);
	const newLabel = await eventsCalendarSelectors.toolbarLabel.innerText;

	await t.expect(newLabel).notEql(initialLabel);
});

test("should navigate to next month", async (t) => {
	const initialLabel = await eventsCalendarSelectors.toolbarLabel.innerText;

	await t.click(eventsCalendarSelectors.nextButton);
	const newLabel = await eventsCalendarSelectors.toolbarLabel.innerText;

	await t.expect(newLabel).notEql(initialLabel);
});

test("should switch to week view", async (t) => {
	await t.click(eventsCalendarSelectors.weekButton);
	await t.expect(eventsCalendarSelectors.weekView.exists).ok({ timeout: 3000 });
});

test("should switch to day view", async (t) => {
	await t.click(eventsCalendarSelectors.dayButton);
	await t.expect(eventsCalendarSelectors.dayView.exists).ok({ timeout: 3000 });
});

test("should return to today on Today button click", async (t) => {
	await t.click(eventsCalendarSelectors.nextButton);
	await t.click(eventsCalendarSelectors.nextButton);
	await t.click(eventsCalendarSelectors.todayButton);
});
