import { Selector } from "testcafe";
import { appPageTestIds } from "../testIds/appPageTestIds";

export const appPageSelectors = {
	userName: Selector(`[data-testid="${appPageTestIds.userName}"]`),
	logoutButton: Selector(`[data-testid="${appPageTestIds.logoutButton}"]`),
};
