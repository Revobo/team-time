import { appPageSelectors } from "./selectors/appPageSelectors";
import { loginPageSelectors } from "./selectors/loginPageSelectors";

fixture`Authentication`.page`http://localhost:5173/login`;

const users = [
	{ email: "alice@example.com", password: "TestPassword1!", team: "Engineering" },
	{ email: "bob@example.com", password: "TestPassword1!", team: "Engineering" },
	{ email: "carol@example.com", password: "TestPassword1!", team: "Engineering" },
	{ email: "dan@example.com", password: "TestPassword1!", team: "Design" },
	{ email: "eve@example.com", password: "TestPassword1!", team: "Design" },
	{ email: "frank@example.com", password: "TestPassword1!", team: "Design" },
];

for (const user of users) {
	test(`should login and logout: ${user.email}`, async (t) => {
		await t.typeText(loginPageSelectors.email, user.email);
		await t.typeText(loginPageSelectors.password, user.password);
		await t.click(loginPageSelectors.submitButton);

		await t.expect(appPageSelectors.userName.exists).ok({ timeout: 10000 });
		await t.expect(appPageSelectors.logoutButton.exists).ok();

		await t.click(appPageSelectors.logoutButton);

		await t.expect(loginPageSelectors.submitButton.exists).ok({ timeout: 5000 });
	});
}
