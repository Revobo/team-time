import { Selector } from "testcafe";
import { eventDetailTestIds } from "../testIds/eventDetailTestIds";

export const eventDetailSelectors = {
	dialog: Selector(`[data-testid="${eventDetailTestIds.dialog}"]`),
	title: Selector(`[data-testid="${eventDetailTestIds.title}"]`),
	stateChip: Selector(`[data-testid="${eventDetailTestIds.stateChip}"]`),
	description: Selector(`[data-testid="${eventDetailTestIds.description}"]`),
	createdBy: Selector(`[data-testid="${eventDetailTestIds.createdBy}"]`),
	proposalsList: Selector(`[data-testid="${eventDetailTestIds.proposalsList}"]`),
	proposalItem: Selector(`[data-testid="${eventDetailTestIds.proposalItem}"]`),
	proposalDate: Selector(`[data-testid="${eventDetailTestIds.proposalDate}"]`),
	upvoteButton: Selector(`[data-testid="${eventDetailTestIds.upvoteButton}"]`),
	downvoteButton: Selector(`[data-testid="${eventDetailTestIds.downvoteButton}"]`),
	voteCount: Selector(`[data-testid="${eventDetailTestIds.voteCount}"]`),
	selectButton: Selector(`[data-testid="${eventDetailTestIds.selectButton}"]`),
	selectedChip: Selector(`[data-testid="${eventDetailTestIds.selectedChip}"]`),
	proposeTimeButton: Selector(`[data-testid="${eventDetailTestIds.proposeTimeButton}"]`),
	closeButton: Selector(`[data-testid="${eventDetailTestIds.closeButton}"]`),
};
