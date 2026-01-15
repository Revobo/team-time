import { Selector } from "testcafe";
import { createEventDialogTestIds } from "../testIds/CreateEventDialogTestIds";

export const createEventDialogSelectors = {
	dialog: Selector(`[data-testid="${createEventDialogTestIds.dialog}"]`),
	title: Selector(`[data-testid="${createEventDialogTestIds.title}"]`),
	nameInput: Selector(`[data-testid="${createEventDialogTestIds.nameInput}"] input`),
	descriptionInput: Selector(`[data-testid="${createEventDialogTestIds.descriptionInput}"] textarea`).nth(0),
	datetimeInput: Selector(`[data-testid="${createEventDialogTestIds.datetimeInput}"] input`),
	addTimeButton: Selector(`[data-testid="${createEventDialogTestIds.addTimeButton}"]`),
	timesList: Selector(`[data-testid="${createEventDialogTestIds.timesList}"]`),
	timeItem: Selector(`[data-testid="${createEventDialogTestIds.timeItem}"]`),
	removeTimeButton: Selector(`[data-testid="${createEventDialogTestIds.removeTimeButton}"]`),
	cancelButton: Selector(`[data-testid="${createEventDialogTestIds.cancelButton}"]`),
	createButton: Selector(`[data-testid="${createEventDialogTestIds.createButton}"]`),
};
