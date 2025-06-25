import { relations } from "drizzle-orm";
import {
  text,
  pgTable,
  timestamp,
  serial,
  boolean,
  integer,
  index,
} from "drizzle-orm/pg-core";

export const User = pgTable(
  "user",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow(),
  }, (table) => [
    index("email_index").on(table.email),
  ]
);

export const Topic = pgTable("topic", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => User.id),
  title: text("title"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const Task = pgTable("task", {
  id: serial("id").primaryKey().notNull(),
  text: text("text").notNull(),
  done: boolean("done").default(false).notNull(),
  topicId: integer("topic_id")
    .notNull()
    .references(() => Topic.id),
});

export const UserTableRelations = relations(User, ({ one, many }) => {
  return {
    topics: many(Topic),
  };
});

export const TopicTableRelation = relations(Topic, ({ one, many }) => {
  return {
    user: one(User, {
      fields: [Topic.userId],
      references: [User.id],
    }),
    tasks: many(Task),
  };
});

export const TaskTableRelation = relations(Task, ({ one, many }) => {
  return {
    topic: one(Topic, {
      fields: [Task.topicId],
      references: [Topic.id],
    }),
  };
});
