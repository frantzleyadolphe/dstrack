import {
  pgTable,
  serial,
  varchar,
  integer,
  numeric,
  text,
  date,
  timestamp,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 256 }).notNull().unique(),
  password_hash: varchar("password_hash", { length: 512 }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const enhance_production_report = pgTable("enhance_production_report", {
  id: serial("id").primaryKey(),
  report_date: date("report_date").notNull(),
  operator_initials: varchar("operator_initials", { length: 10 }),
  item_number: varchar("item_number", { lenght: 10 }),
  lot_number: varchar("lot_number", { length: 50 }),
  table_name: varchar("table_name", { length: 10 }),
  associate_hour3: integer("associate_hour"),
  associate_hour4: integer("associate_hour3"),
  shift: varchar("shift", { length: 10 }),
  shift_duration_hours: integer("shift_duration_hours"),
  good_parts_expected3: integer("good_parts_expected3"),
  good_parts_expected4: integer("good_parts_expected4"),
  reviewed_by: varchar("reviewed_by", { length: 20 }),
  date_reviewed: date("date_reviewed"),
  created_at: timestamp("created_at").defaultNow(),
});

export const enhance_production_entries = pgTable(
  "enhance_production_entries",
  {
    id: serial("id").primaryKey(),
    report_id: integer("report_id").references(
      () => enhance_production_report.id
    ),
    hour_label: varchar("hour_label", { length: 20 }),
    good_parts: integer("good_parts"),
    weight_of_reject: numeric("weight_of_reject", { precision: 10, scale: 3 }),
    reject_parts: integer("reject_parts"),
    total_parts: integer("total_parts"),
    percent_of_pieces_rejected: numeric("percent_of_pieces_rejected", {
      precision: 10,
      scale: 3,
    }),
    pressure_setting: integer("pressure_setting"),
    timer: integer("timer"),
    issue_repoerted: text("issue_repoerted"),
    downtime_minute: integer("downtime_minute"),
    created_at: timestamp("created_at").defaultNow(),
  }
);
