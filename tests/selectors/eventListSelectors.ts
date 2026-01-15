import { Selector } from "testcafe";
import { eventListTestIds } from "../testIds/eventListTestIds";

export const eventListSelectors = {
	container: Selector(`[data-testid="${eventListTestIds.container}"]`),
	header: Selector(`[data-testid="${eventListTestIds.header}"]`),
	title: Selector(`[data-testid="${eventListTestIds.title}"]`),
	pastSwitch: Selector(`[data-testid="${eventListTestIds.pastSwitch}"]`),
	eventsContainer: Selector(`[data-testid="${eventListTestIds.eventsContainer}"]`),
	emptyState: Selector(`[data-testid="${eventListTestIds.emptyState}"]`),
	createButton: Selector(`[data-testid="${eventListTestIds.createButton}"]`),
};
