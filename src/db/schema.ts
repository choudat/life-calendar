import { pgTable, serial, text, timestamp, integer, uuid, date, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const events = pgTable("events", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(), // Clerk User ID
  
  title: text("title").notNull(),
  description: text("description"),
  calendarId: text("calendar_id").notNull(), 
  icon: text("icon"), // Optional emoji icon
  
  startDate: date("start_date").notNull(),
  endDate: date("end_date"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const calendars = pgTable("calendars", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(), // Clerk User ID
  
  title: text("title").notNull(),
  color: text("color").notNull(),
  isVisible: boolean("is_visible").default(true).notNull(),
  position: integer("position").default(0).notNull(),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Zod Schemas
export const insertEventSchema = createInsertSchema(events, {
  title: z.string().min(1).max(50),
  description: z.string().optional(),
  calendarId: z.string().min(1),
}).omit({ 
  createdAt: true, 
  updatedAt: true 
});

export const insertCalendarSchema = createInsertSchema(calendars, {
  title: z.string().min(1).max(50),
  color: z.string().min(1),
}).omit({
  createdAt: true,
  updatedAt: true
});

export const selectEventSchema = createSelectSchema(events);
export const selectCalendarSchema = createSelectSchema(calendars);

export type Event = z.infer<typeof selectEventSchema>;
export type NewEvent = z.infer<typeof insertEventSchema>;
export type Calendar = z.infer<typeof selectCalendarSchema>;
export type NewCalendar = z.infer<typeof insertCalendarSchema>;

