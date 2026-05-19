import { pgTable, uuid, varchar, text, integer, jsonb, timestamp, boolean, pgEnum } from 'drizzle-orm/pg-core';

export const planEnum = pgEnum('plan', ['free', 'one_time', 'monthly']);
export const subscriptionStatusEnum = pgEnum('subscription_status', ['active', 'canceled', 'past_due']);
export const analysisStatusEnum = pgEnum('status', ['processing', 'completed', 'failed']);
export const paymentTypeEnum = pgEnum('payment_type', ['one_time', 'subscription']);
export const paymentStatusEnum = pgEnum('payment_status', ['pending', 'completed', 'failed', 'refunded']);

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  clerkId: varchar('clerk_id').unique(),
  email: varchar('email').unique(),
  name: varchar('name'),
  plan: planEnum('plan').default('free'),
  credits: integer('credits').default(0),
  creditsExpiry: timestamp('credits_expiry'),
  stripeCustomerId: varchar('stripe_customer_id'),
  stripeSubscriptionId: varchar('stripe_subscription_id'),
  subscriptionStatus: subscriptionStatusEnum('subscription_status'),
  subscriptionEndsAt: timestamp('subscription_ends_at'),
  cvTemplatesUsedThisMonth: integer('cv_templates_used_this_month').default(0),
  aiRewritesUsed: integer('ai_rewrites_used').default(0),
  isAdmin: boolean('is_admin').default(false),
  isBlocked: boolean('is_blocked').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const cvAnalyses = pgTable('cv_analyses', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }), // GDPR: Delete analyses when user is deleted
  guestSessionId: text('guest_session_id'),
  originalCvUrl: varchar('original_cv_url'),
  jobUrl: varchar('job_url'),
  userName: varchar('user_name'),
  jobTitle: varchar('job_title'),
  jobDescription: text('job_description'),
  atsScore: integer('ats_score'),
  scoreBreakdown: jsonb('score_breakdown'),
  flaws: jsonb('flaws'),
  suggestions: jsonb('suggestions'),
  keywordsMissing: jsonb('keywords_missing'),
  keywordsFound: jsonb('keywords_found'),
  optimizedData: jsonb('optimized_data'),
  status: analysisStatusEnum('status').default('processing'),
  detectedPlatform: varchar('detected_platform', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow(),
});

export const cvTemplates = pgTable('cv_templates', {
  id: uuid('id').defaultRandom().primaryKey(),
  analysisId: uuid('analysis_id').references(() => cvAnalyses.id, { onDelete: 'cascade' }), // Cascade deletion
  templateNumber: integer('template_number'),
  templateStyle: varchar('template_style'),
  templateData: jsonb('template_data'),
  pdfUrl: varchar('pdf_url'),
  isPaid: boolean('is_paid').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  guestSessionId: text("guest_session_id"),
});

export const payments = pgTable('payments', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }), // Keep payment history for accounting, but unlink user
  guestEmail: varchar('guest_email'),
  guestSessionId: varchar('guest_session_id'),
  stripePaymentIntentId: varchar('stripe_payment_intent_id').unique(),
  stripeSessionId: varchar('stripe_session_id'),
  amount: integer('amount'),
  currency: varchar('currency').default('eur'),
  paymentType: paymentTypeEnum('payment_type'),
  templateId: uuid('template_id'),
  status: paymentStatusEnum('status').default('pending'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const guestSessions = pgTable('guest_sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  sessionToken: varchar('session_token').unique(),
  ipAddress: varchar('ip_address'),
  userAgent: text('user_agent'),
  email: varchar('email'),
  createdAt: timestamp('created_at').defaultNow(),
  lastActiveAt: timestamp('last_active_at').defaultNow(),
});

export const cvGenerations = pgTable('cv_generations', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  analysisId: uuid('analysis_id').references(() => cvAnalyses.id, { onDelete: 'cascade' }),
  templateId: uuid('template_id').references(() => cvTemplates.id, { onDelete: 'cascade' }),
  templateStyle: varchar('template_style'),
  templateData: jsonb('template_data'),
  pdfUrl: varchar('pdf_url'),
  createdAt: timestamp('created_at').defaultNow(),
});
export const siteSettings = pgTable('site_settings', {
  id: uuid('id').defaultRandom().primaryKey(),
  activeOffer: jsonb('active_offer'), // { discount: 20, description: 'Offre Spéciale', expiresAt: '...' }
  updatedAt: timestamp('updated_at').defaultNow(),
});
