import { Selector } from "testcafe";
import { eventsCalendarTestIds } from "../testIds/eventsCalendarTestids";

export const eventsCalendarSelectors = {
	container: Selector(`[data-testid="${eventsCalendarTestIds.container}"]`),
	calendar: Selector(".rbc-calendar"),
	toolbar: Selector(".rbc-toolbar"),
	toolbarLabel: Selector(".rbc-toolbar-label"),
	monthView: Selector(".rbc-month-view"),
	weekView: Selector(".rbc-time-view"),
	dayView: Selector(".rbc-time-view"),
	todayButton: Selector(".rbc-btn-group button").withText("Today"),
	backButton: Selector(".rbc-btn-group button").withText("Back"),
	nextButton: Selector(".rbc-btn-group button").withText("Next"),
	monthButton: Selector(".rbc-btn-group button").withText("Month"),
	weekButton: Selector(".rbc-btn-group button").withText("Week"),
	dayButton: Selector(".rbc-btn-group button").withText("Day"),
	calendarEvent: Selector(".rbc-event"),
};
