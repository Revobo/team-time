import { Selector } from "testcafe";
import { eventCardTestIds } from "../testIds/eventCardTestIds";

export const eventCardSelectors = {
	card: Selector(`[data-testid="${eventCardTestIds.card}"]`),
	eventName: Selector(`[data-testid="${eventCardTestIds.eventName}"]`),
	state: Selector(`[data-testid="${eventCardTestIds.state}"]`),
	description: Selector(`[data-testid="${eventCardTestIds.description}"]`),
	createdBy: Selector(`[data-testid="${eventCardTestIds.createdBy}"]`),
	voting: Selector(`[data-testid="${eventCardTestIds.voting}"]`),
	finalizedAt: Selector(`[data-testid="${eventCardTestIds.finalizedAt}"]`),
};
