import { and, desc, eq, sql } from "drizzle-orm";
import { Router } from "express";
import { getDbInstance, schema } from "../db/index.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

router.use(authMiddleware);

interface CreateEventBody {
  name: string;
  description?: string;
  proposedTimes: string[];
}

interface ProposeTimeBody {
  proposedAt: string;
}

interface VoteBody {
  vote: number;
}

async function getUserTeamId(userId: number): Promise<number | null> {
  const db = getDbInstance();
  const [member] = await db
    .select({ teamId: schema.members.teamId })
    .from(schema.members)
    .where(eq(schema.members.id, userId))
    .limit(1);
  return member?.teamId ?? null;
}

async function isEventCreator(
  eventId: number,
  userId: number,
): Promise<boolean> {
  const db = getDbInstance();
  const [event] = await db
    .select({ creatorId: schema.events.creatorId })
    .from(schema.events)
    .where(eq(schema.events.id, eventId))
    .limit(1);
  return event?.creatorId === userId;
}

router.get("/", async (req, res) => {
  try {
    const userId = req.userId;
    const includePast = req.query.includePast === "true";

    const teamId = await getUserTeamId(userId);
    if (!teamId) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const db = getDbInstance();

    const conditions = [eq(schema.events.teamId, teamId)];

    if (!includePast) {
      conditions.push(
        sql`(${schema.events.state} = 'voting' OR EXISTS (
          SELECT 1 FROM ${schema.proposedTimes} pt
          WHERE pt.event_id = ${schema.events.id}
          AND pt.id = ${schema.events.finalizedTimeId}
          AND pt.proposed_at >= NOW()
        ))`,
      );
    }

    const events = await db
      .select({
        id: schema.events.id,
        name: schema.events.name,
        description: schema.events.description,
        state: schema.events.state,
        creatorId: schema.events.creatorId,
        finalizedTimeId: schema.events.finalizedTimeId,
        createdAt: schema.events.createdAt,
        creatorName: schema.members.name,
      })
      .from(schema.events)
      .leftJoin(schema.members, eq(schema.events.creatorId, schema.members.id))
      .where(and(...conditions))
      .orderBy(desc(schema.events.createdAt));

    const eventsWithProposals = await Promise.all(
      events.map(async (event) => {
        const proposals = await db
          .select({
            id: schema.proposedTimes.id,
            proposedAt: schema.proposedTimes.proposedAt,
            proposerId: schema.proposedTimes.proposerId,
            proposerName: schema.members.name,
          })
          .from(schema.proposedTimes)
          .leftJoin(
            schema.members,
            eq(schema.proposedTimes.proposerId, schema.members.id),
          )
          .where(eq(schema.proposedTimes.eventId, event.id));

        const proposalsWithVotes = await Promise.all(
          proposals.map(async (proposal) => {
            const votes = await db
              .select({
                voterId: schema.timeVotes.voterId,
                vote: schema.timeVotes.vote,
              })
              .from(schema.timeVotes)
              .where(eq(schema.timeVotes.proposedTimeId, proposal.id));

            const upvotes = votes.filter((v) => v.vote === 1).length;
            const downvotes = votes.filter((v) => v.vote === -1).length;
            const userVote =
              votes.find((v) => v.voterId === userId)?.vote ?? null;

            return {
              ...proposal,
              upvotes,
              downvotes,
              userVote,
            };
          }),
        );

        return {
          ...event,
          proposals: proposalsWithVotes,
        };
      }),
    );

    res.json({ events: eventsWithProposals });
  } catch (error) {
    console.error("Get events error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const userId = req.userId;
    const { name, description, proposedTimes } = req.body as CreateEventBody;

    if (!name || !proposedTimes?.length) {
      res
        .status(400)
        .json({ error: "Name and at least one proposed time are required" });
      return;
    }

    const teamId = await getUserTeamId(userId);
    if (!teamId) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const db = getDbInstance();

    const [event] = await db
      .insert(schema.events)
      .values({
        name,
        description: description ?? null,
        teamId,
        creatorId: userId,
      })
      .returning();

    await db.insert(schema.proposedTimes).values(
      proposedTimes.map((time) => ({
        eventId: event.id,
        proposerId: userId,
        proposedAt: new Date(time),
      })),
    );

    res.status(201).json({ event });
  } catch (error) {
    console.error("Create event error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const userId = req.userId;
    const eventId = Number(req.params.id);

    const teamId = await getUserTeamId(userId);
    if (!teamId) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const db = getDbInstance();

    const [event] = await db
      .select({
        id: schema.events.id,
        name: schema.events.name,
        description: schema.events.description,
        state: schema.events.state,
        creatorId: schema.events.creatorId,
        finalizedTimeId: schema.events.finalizedTimeId,
        createdAt: schema.events.createdAt,
        teamId: schema.events.teamId,
        creatorName: schema.members.name,
      })
      .from(schema.events)
      .leftJoin(schema.members, eq(schema.events.creatorId, schema.members.id))
      .where(eq(schema.events.id, eventId))
      .limit(1);

    if (!event) {
      res.status(404).json({ error: "Event not found" });
      return;
    }

    if (event.teamId !== teamId) {
      res.status(403).json({ error: "Access denied" });
      return;
    }

    const proposals = await db
      .select({
        id: schema.proposedTimes.id,
        proposedAt: schema.proposedTimes.proposedAt,
        proposerId: schema.proposedTimes.proposerId,
        proposerName: schema.members.name,
      })
      .from(schema.proposedTimes)
      .leftJoin(
        schema.members,
        eq(schema.proposedTimes.proposerId, schema.members.id),
      )
      .where(eq(schema.proposedTimes.eventId, eventId));

    const proposalsWithVotes = await Promise.all(
      proposals.map(async (proposal) => {
        const votes = await db
          .select({
            voterId: schema.timeVotes.voterId,
            vote: schema.timeVotes.vote,
          })
          .from(schema.timeVotes)
          .where(eq(schema.timeVotes.proposedTimeId, proposal.id));

        const upvotes = votes.filter((v) => v.vote === 1).length;
        const downvotes = votes.filter((v) => v.vote === -1).length;
        const userVote = votes.find((v) => v.voterId === userId)?.vote ?? null;

        return {
          ...proposal,
          upvotes,
          downvotes,
          userVote,
        };
      }),
    );

    res.json({
      event: {
        ...event,
        proposals: proposalsWithVotes,
      },
    });
  } catch (error) {
    console.error("Get event error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/:id/finalize", async (req, res) => {
  try {
    const userId = req.userId;
    const eventId = Number(req.params.id);
    const { proposalId } = req.body as { proposalId: number };

    if (!proposalId) {
      res.status(400).json({ error: "proposalId is required" });
      return;
    }

    const isCreator = await isEventCreator(eventId, userId);
    if (!isCreator) {
      res.status(403).json({ error: "Only the event creator can finalize" });
      return;
    }

    const db = getDbInstance();

    const [proposal] = await db
      .select()
      .from(schema.proposedTimes)
      .where(
        and(
          eq(schema.proposedTimes.id, proposalId),
          eq(schema.proposedTimes.eventId, eventId),
        ),
      )
      .limit(1);

    if (!proposal) {
      res.status(404).json({ error: "Proposal not found" });
      return;
    }

    const [event] = await db
      .update(schema.events)
      .set({
        state: "finalized",
        finalizedTimeId: proposalId,
      })
      .where(eq(schema.events.id, eventId))
      .returning();

    res.json({ event });
  } catch (error) {
    console.error("Finalize event error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/:id/proposals", async (req, res) => {
  try {
    const userId = req.userId;
    const eventId = Number(req.params.id);
    const { proposedAt } = req.body as ProposeTimeBody;

    if (!proposedAt) {
      res.status(400).json({ error: "proposedAt is required" });
      return;
    }

    const teamId = await getUserTeamId(userId);
    if (!teamId) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const db = getDbInstance();

    const [event] = await db
      .select()
      .from(schema.events)
      .where(eq(schema.events.id, eventId))
      .limit(1);

    if (!event) {
      res.status(404).json({ error: "Event not found" });
      return;
    }

    if (event.teamId !== teamId) {
      res.status(403).json({ error: "Access denied" });
      return;
    }

    if (event.state === "finalized") {
      res
        .status(400)
        .json({ error: "Cannot add proposals to finalized event" });
      return;
    }

    const [proposal] = await db
      .insert(schema.proposedTimes)
      .values({
        eventId,
        proposerId: userId,
        proposedAt: new Date(proposedAt),
      })
      .returning();

    res.status(201).json({ proposal });
  } catch (error) {
    console.error("Add proposal error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id/proposals/:proposalId", async (req, res) => {
  try {
    const userId = req.userId;
    const eventId = Number(req.params.id);
    const proposalId = Number(req.params.proposalId);

    const db = getDbInstance();

    const [proposal] = await db
      .select()
      .from(schema.proposedTimes)
      .where(
        and(
          eq(schema.proposedTimes.id, proposalId),
          eq(schema.proposedTimes.eventId, eventId),
        ),
      )
      .limit(1);

    if (!proposal) {
      res.status(404).json({ error: "Proposal not found" });
      return;
    }

    if (proposal.proposerId !== userId) {
      res.status(403).json({ error: "Only the proposer can delete" });
      return;
    }

    await db
      .delete(schema.proposedTimes)
      .where(eq(schema.proposedTimes.id, proposalId));

    res.json({ success: true });
  } catch (error) {
    console.error("Delete proposal error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/:id/proposals/:proposalId/vote", async (req, res) => {
  try {
    const userId = req.userId;
    const eventId = Number(req.params.id);
    const proposalId = Number(req.params.proposalId);
    const { vote } = req.body as VoteBody;

    if (vote !== 1 && vote !== -1) {
      res.status(400).json({ error: "Vote must be 1 or -1" });
      return;
    }

    const teamId = await getUserTeamId(userId);
    if (!teamId) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const db = getDbInstance();

    const [proposal] = await db
      .select({
        id: schema.proposedTimes.id,
        eventId: schema.proposedTimes.eventId,
        teamId: schema.events.teamId,
        eventState: schema.events.state,
      })
      .from(schema.proposedTimes)
      .innerJoin(
        schema.events,
        eq(schema.proposedTimes.eventId, schema.events.id),
      )
      .where(
        and(
          eq(schema.proposedTimes.id, proposalId),
          eq(schema.proposedTimes.eventId, eventId),
        ),
      )
      .limit(1);

    if (!proposal) {
      res.status(404).json({ error: "Proposal not found" });
      return;
    }

    if (proposal.teamId !== teamId) {
      res.status(403).json({ error: "Access denied" });
      return;
    }

    if (proposal.eventState === "finalized") {
      res.status(400).json({ error: "Cannot vote on finalized event" });
      return;
    }

    const [existingVote] = await db
      .select()
      .from(schema.timeVotes)
      .where(
        and(
          eq(schema.timeVotes.proposedTimeId, proposalId),
          eq(schema.timeVotes.voterId, userId),
        ),
      )
      .limit(1);

    if (existingVote) {
      const [result] = await db
        .update(schema.timeVotes)
        .set({ vote })
        .where(eq(schema.timeVotes.id, existingVote.id))
        .returning();
      res.json({ vote: result });
    } else {
      const [result] = await db
        .insert(schema.timeVotes)
        .values({
          proposedTimeId: proposalId,
          voterId: userId,
          vote,
        })
        .returning();
      res.json({ vote: result });
    }
  } catch (error) {
    console.error("Vote error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id/proposals/:proposalId/vote", async (req, res) => {
  try {
    const userId = req.userId;
    const proposalId = Number(req.params.proposalId);

    const db = getDbInstance();

    await db
      .delete(schema.timeVotes)
      .where(
        and(
          eq(schema.timeVotes.proposedTimeId, proposalId),
          eq(schema.timeVotes.voterId, userId),
        ),
      );

    res.json({ success: true });
  } catch (error) {
    console.error("Delete vote error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
