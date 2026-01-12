import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

export const members = pgTable("members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  teamId: integer("team_id")
    .notNull()
    .references(() => teams.id),
  email: text("email").notNull(),
  password: text("password").notNull(),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  state: text("state").notNull().default("voting"),
  teamId: integer("team_id")
    .notNull()
    .references(() => teams.id),
  creatorId: integer("creator_id")
    .notNull()
    .references(() => members.id),
  finalizedTimeId: integer("finalized_time_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const proposedTimes = pgTable("proposed_times", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),
  proposerId: integer("proposer_id")
    .notNull()
    .references(() => members.id),
  proposedAt: timestamp("proposed_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const timeVotes = pgTable(
  "time_votes",
  {
    id: serial("id").primaryKey(),
    proposedTimeId: integer("proposed_time_id")
      .notNull()
      .references(() => proposedTimes.id, { onDelete: "cascade" }),
    voterId: integer("voter_id")
      .notNull()
      .references(() => members.id),
    vote: integer("vote").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [unique().on(table.proposedTimeId, table.voterId)],
);
