import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { getDbInstance, schema } from "../db/index.js";
import { authMiddleware, JWT_SECRET } from "../middleware/auth.js";

const router = Router();

interface LoginBody {
  email: string;
  password: string;
}

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body as LoginBody;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const db = getDbInstance();
    const [member] = await db
      .select()
      .from(schema.members)
      .where(eq(schema.members.email, email))
      .limit(1);

    if (!member) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, member.password);
    if (!passwordMatch) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const token = jwt.sign(
      { userId: member.id, email: member.email },
      JWT_SECRET,
      { expiresIn: "24h" },
    );

    res.json({
      token,
      user: {
        id: member.id,
        name: member.name,
        email: member.email,
        teamId: member.teamId,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const db = getDbInstance();

    const [member] = await db
      .select()
      .from(schema.members)
      .where(eq(schema.members.id, userId))
      .limit(1);

    if (!member) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({
      user: {
        id: member.id,
        name: member.name,
        email: member.email,
        teamId: member.teamId,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
