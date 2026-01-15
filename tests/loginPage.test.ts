import { loginPageSelectors } from "./selectors/loginPageSelectors";

fixture`Login Page`.page`http://localhost:5173/login`;

test("should display the login form", async (t) => {
	await t.expect(loginPageSelectors.heading.exists).ok();
	await t.expect(loginPageSelectors.description.exists).ok();
	await t.expect(loginPageSelectors.email.exists).ok();
	await t.expect(loginPageSelectors.password.exists).ok();
	await t.expect(loginPageSelectors.submitButton.exists).ok();
	await t.expect(loginPageSelectors.backToHome.exists).ok();
});

test("should not submit with invalid email", async (t) => {
	await t.typeText(loginPageSelectors.email, "invalid-email");
	await t.typeText(loginPageSelectors.password, "password123");
	await t.click(loginPageSelectors.submitButton);

	const currentUrl = await t.eval(() => window.location.pathname);
	await t.expect(currentUrl).eql("/login");
	await t.expect(loginPageSelectors.submitButton.exists).ok();
});

test("should not submit with empty password", async (t) => {
	await t.typeText(loginPageSelectors.email, "test@example.com");
	await t.click(loginPageSelectors.submitButton);

	const currentUrl = await t.eval(() => window.location.pathname);
	await t.expect(currentUrl).eql("/login");
	await t.expect(loginPageSelectors.submitButton.exists).ok();
});

test("should show error message for invalid credentials", async (t) => {
	await t.typeText(loginPageSelectors.email, "wrong@example.com");
	await t.typeText(loginPageSelectors.password, "wrongpassword");
	await t.click(loginPageSelectors.submitButton);

	await t.expect(loginPageSelectors.error.exists).ok({ timeout: 5000 });
});

test("should navigate back to home page", async (t) => {
	await t.click(loginPageSelectors.backToHome);

	const currentUrl = await t.eval(() => window.location.pathname);
	await t.expect(currentUrl).eql("/");
});
