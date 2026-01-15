import { landingPageSelectors } from "./selectors/landingPageSelectors";

fixture`Landing Page`.page`http://localhost:5173`;

test("should display the landing page with correct content", async (t) => {
	await t.expect(landingPageSelectors.heading.exists).ok("Main heading should be visible");
	await t.expect(landingPageSelectors.heading.innerText).contains("Team Time");

	await t.expect(landingPageSelectors.tagline.exists).ok("Tagline should be visible");
	await t.expect(landingPageSelectors.tagline.innerText).contains("effortless way to bring your team together");

	await t.expect(landingPageSelectors.description.exists).ok("Description should be visible");
	await t.expect(landingPageSelectors.description.innerText).contains("Say goodbye to endless email chains");

	await t.expect(landingPageSelectors.getStartedButton.exists).ok("Get Started button should be visible");
});

test("should navigate to login page when clicking Get Started", async (t) => {
	await t.click(landingPageSelectors.getStartedButton);

	const currentUrl = await t.eval(() => window.location.pathname);
	await t.expect(currentUrl).eql("/login", "Should navigate to login page");
});
