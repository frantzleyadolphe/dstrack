import {
  pgTable,
  serial,
  varchar,
  integer,
  numeric,
  text,
  date,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";

export const shift = pgTable("shift", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull(), // Shift 1, Shift 2, Shift 3
});

export const admin = pgTable("admin", {
  id: text("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  password: text("password").notNull(),
  shiftId: integer("shift_id")
    .references(() => shift.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const machine = pgTable("machine", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull(), // Machine 1, Machine 2, ...
  shiftId: integer("shift_id")
    .references(() => shift.id)
    .notNull(),
});

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  password: text("password").notNull(),
  machineId: integer("machine_id")
    .references(() => machine.id)
    .notNull(),
  adminId: text("admin_id")
    .references(() => admin.id)
    .notNull(), // Ki admin ki kreye user la
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const enhance_production_report = pgTable("enhance_production_report", {
  id: serial("id").primaryKey(),
  report_date: date("report_date").notNull(),
  operator_initials: varchar("operator_initials", { length: 10 }),
  operatorId: text("operator_id").references(() => user.id), // user who submit the report
  item_number: varchar("item_number", { length: 10 }),
  lot_number: varchar("lot_number", { length: 50 }),
  machineId: integer("machine_id")
    .references(() => machine.id)
    .notNull(),
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
    issue_reported: text("issue_reported"),
    downtime_minute: integer("downtime_minute"),
    is_shift_ended: boolean("is_shift_ended").default(false),
    created_at: timestamp("created_at").defaultNow(),
  }
);

export const export_log = pgTable("export_log", {
  id: serial("id").primaryKey(),
  report_id: integer("report_id")
    .references(() => enhance_production_report.id, { onDelete: "cascade" })
    .notNull(),
  file_url: text("file_url"),
  sent_to: text("sent_to"),
  sent_at: timestamp("sent_at").defaultNow(),
});

export const schema = {
  user,
  account,
  session,
  verification,
  admin,
  shift,
  machine,
  enhance_production_report,
  enhance_production_entries,
  export_log,
};
