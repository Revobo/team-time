import { Selector } from "testcafe";
import { loginPageTestIds } from "../testIds/loginPageTestIds";

export const loginPageSelectors = {
	heading: Selector(`[data-testid="${loginPageTestIds.heading}"]`),
	description: Selector(`[data-testid="${loginPageTestIds.description}"]`),
	email: Selector(`[data-testid="${loginPageTestIds.email}"] input`),
	password: Selector(`[data-testid="${loginPageTestIds.password}"] input`),
	submitButton: Selector(`[data-testid="${loginPageTestIds.submitButton}"]`),
	backToHome: Selector(`[data-testid="${loginPageTestIds.backToHome}"]`),
	error: Selector(`[data-testid="${loginPageTestIds.error}"]`),
};
