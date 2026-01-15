import { Selector } from "testcafe";
import { landingPageTestIds } from "../testIds/landingPageTestIds";

export const landingPageSelectors = {
	heading: Selector(`[data-testid="${landingPageTestIds.heading}"]`),
	tagline: Selector(`[data-testid="${landingPageTestIds.tagline}"]`),
	description: Selector(`[data-testid="${landingPageTestIds.description}"]`),
	getStartedButton: Selector(`[data-testid="${landingPageTestIds.getStartedButton}"]`),
};
