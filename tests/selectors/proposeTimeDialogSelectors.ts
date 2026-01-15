import { Selector } from "testcafe";
import { proposeTimeDialogTestIds } from "../testIds/proposeTimeDialog";

export const proposeTimeDialogSelectors = {
	dialog: Selector(`[data-testid="${proposeTimeDialogTestIds.dialog}"]`),
	title: Selector(`[data-testid="${proposeTimeDialogTestIds.title}"]`),
	datetimeInput: Selector(`[data-testid="${proposeTimeDialogTestIds.datetimeInput}"] input`),
	cancelButton: Selector(`[data-testid="${proposeTimeDialogTestIds.cancelButton}"]`),
	proposeButton: Selector(`[data-testid="${proposeTimeDialogTestIds.proposeButton}"]`),
};
