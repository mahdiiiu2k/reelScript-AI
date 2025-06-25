import { users, sessions, subscriptions, type User, type InsertUser, type Session, type InsertSession, type Subscription, type InsertSubscription } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined>;
  
  // Session methods
  createSession(session: InsertSession): Promise<Session>;
  getSession(id: string): Promise<Session | undefined>;
  deleteSession(id: string): Promise<void>;
  deleteExpiredSessions(): Promise<void>;
  
  // Subscription methods
  getSubscription(userId: number): Promise<Subscription | undefined>;
  getSubscriptionByStripeId(stripeSubscriptionId: string): Promise<Subscription | undefined>;
  createOrUpdateSubscription(subscription: InsertSubscription): Promise<Subscription>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.google_id, googleId)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values({
      ...user,
      created_at: new Date(),
      updated_at: new Date(),
    }).returning();
    return result[0];
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    const result = await db.update(users)
      .set({ ...updates, updated_at: new Date() })
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }

  // Session methods
  async createSession(session: InsertSession): Promise<Session> {
    const result = await db.insert(sessions).values({
      ...session,
      created_at: new Date(),
    }).returning();
    return result[0];
  }

  async getSession(id: string): Promise<Session | undefined> {
    const result = await db.select().from(sessions).where(eq(sessions.id, id)).limit(1);
    return result[0];
  }

  async deleteSession(id: string): Promise<void> {
    await db.delete(sessions).where(eq(sessions.id, id));
  }

  async deleteExpiredSessions(): Promise<void> {
    await db.delete(sessions).where(eq(sessions.expires_at, new Date()));
  }

  // Subscription methods
  async getSubscription(userId: number): Promise<Subscription | undefined> {
    const result = await db.select().from(subscriptions).where(eq(subscriptions.user_id, userId)).limit(1);
    return result[0];
  }

  async getSubscriptionByStripeId(stripeSubscriptionId: string): Promise<Subscription | undefined> {
    const result = await db.select().from(subscriptions).where(eq(subscriptions.stripe_subscription_id, stripeSubscriptionId)).limit(1);
    return result[0];
  }

  async createOrUpdateSubscription(subscription: InsertSubscription): Promise<Subscription> {
    const existing = await this.getSubscription(subscription.user_id);
    
    if (existing) {
      const result = await db.update(subscriptions)
        .set({ ...subscription, updated_at: new Date() })
        .where(eq(subscriptions.user_id, subscription.user_id))
        .returning();
      return result[0];
    } else {
      const result = await db.insert(subscriptions).values({
        ...subscription,
        created_at: new Date(),
        updated_at: new Date(),
      }).returning();
      return result[0];
    }
  }
}

export const storage = new DatabaseStorage();
