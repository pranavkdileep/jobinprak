import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";
import crypto from "crypto";
import { sendVerificationEmail, sendPasswordResetEmail } from "@/actions/email/email-services";

export async function sendVerificationEmailWorkflow(
  userId: string,
  email: string
) {
  "use workflow";

  const token = await generateVerificationToken(userId);
  await deliverVerificationEmail(email, token);

  return { userId, status: "verification_email_sent" };
}

async function generateVerificationToken(userId: string) {
  "use step";

  const db = await connectToDatabase();
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 60 * 60 * 1000);

  await db.collection("users").updateOne(
    { _id: new ObjectId(userId) },
    {
      $set: {
        emailVerificationToken: token,
        emailVerificationExpires: expires,
        updatedAt: new Date(),
      },
    }
  );

  return token;
}

async function deliverVerificationEmail(email: string, token: string) {
  "use step";

  await sendVerificationEmail(email, token);
}

export async function sendPasswordResetEmailWorkflow(userId: string) {
  "use workflow";

  const token = await generatePasswordResetToken(userId);
  const user = await getUserEmail(userId);
  await deliverPasswordResetEmail(user.email, token);

  return { userId, status: "password_reset_email_sent" };
}

async function generatePasswordResetToken(userId: string) {
  "use step";

  const db = await connectToDatabase();
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 60 * 60 * 1000);

  await db.collection("users").updateOne(
    { _id: new ObjectId(userId) },
    {
      $set: {
        passwordResetToken: token,
        passwordResetExpires: expires,
        updatedAt: new Date(),
      },
    }
  );

  return token;
}

async function getUserEmail(userId: string) {
  "use step";

  const db = await connectToDatabase();
  const user = await db
    .collection("users")
    .findOne({ _id: new ObjectId(userId) }, { projection: { email: 1 } });

  if (!user) {
    throw new Error("User not found");
  }

  return { email: user.email };
}

async function deliverPasswordResetEmail(email: string, token: string) {
  "use step";

  await sendPasswordResetEmail(email, token);
}
