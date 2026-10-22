"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { MotionReveal } from "@/components/ui/MotionReveal";
import { Section, SectionHeader } from "@/components/ui/Section";
import { CONTACT_API_PATH, SECTION_IDS } from "@/config/site";
import {
  ContactSchema,
  type ContactForm,
  inputClass,
  isContactErrorKey,
} from "@/lib/contact";
import { cn } from "@/lib/utils";

function fieldBorder(hasError: boolean) {
  return hasError
    ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20"
    : "border-border focus-visible:border-brand/50";
}

export default function ContactSection() {
  const t = useTranslations("HomePage.ContactSection");
  const tErrors = useTranslations("HomePage.ContactSection.errors");
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactForm>({
    resolver: zodResolver(ContactSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data: ContactForm) => {
    setSubmitStatus("idle");

    try {
      const res = await fetch(CONTACT_API_PATH, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to send message");
      }
      setSubmitStatus("success");
      reset();
      setTimeout(() => setSubmitStatus("idle"), 5000);
    } catch (err) {
      console.error("Contact submit error:", err);
      setSubmitStatus("error");
    }
  };

  return (
    <Section id={SECTION_IDS.contact} innerClassName="max-w-3xl">
      <MotionReveal>
        <SectionHeader
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("description")}
          align="center"
        />
      </MotionReveal>

      <MotionReveal delay={0.06} className="mt-12">
        <div className="rounded-2xl border border-border bg-surface-elevated/50 p-6 shadow-sm backdrop-blur-sm md:p-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-left text-xs font-medium uppercase tracking-wider text-text-secondary"
              >
                {t("form.name")}
              </label>
              <input
                id="name"
                disabled={isSubmitting}
                {...register("name")}
                placeholder={t("form.name")}
                className={cn(inputClass, fieldBorder(!!errors.name))}
                aria-invalid={!!errors.name}
                autoComplete="name"
              />
              {errors.name?.message &&
                isContactErrorKey(errors.name.message) && (
                  <p className="text-left text-sm text-destructive">
                    {tErrors(errors.name.message)}
                  </p>
                )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-left text-xs font-medium uppercase tracking-wider text-text-secondary"
              >
                {t("form.email")}
              </label>
              <input
                id="email"
                type="email"
                disabled={isSubmitting}
                {...register("email")}
                placeholder={t("form.email")}
                className={cn(inputClass, fieldBorder(!!errors.email))}
                aria-invalid={!!errors.email}
                autoComplete="email"
              />
              {errors.email?.message &&
                isContactErrorKey(errors.email.message) && (
                  <p className="text-left text-sm text-destructive">
                    {tErrors(errors.email.message)}
                  </p>
                )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="message"
                className="block text-left text-xs font-medium uppercase tracking-wider text-text-secondary"
              >
                {t("form.message")}
              </label>
              <textarea
                id="message"
                rows={5}
                disabled={isSubmitting}
                {...register("message")}
                placeholder={t("form.message")}
                className={cn(
                  inputClass,
                  "resize-none",
                  fieldBorder(!!errors.message),
                )}
                aria-invalid={!!errors.message}
              />
              {errors.message?.message &&
                isContactErrorKey(errors.message.message) && (
                  <p className="text-left text-sm text-destructive">
                    {tErrors(errors.message.message)}
                  </p>
                )}
            </div>

            <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
              <m.button
                type="submit"
                disabled={isSubmitting}
                whileHover={isSubmitting ? undefined : { scale: 1.02 }}
                whileTap={isSubmitting ? undefined : { scale: 0.98 }}
                className="font-display inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-brand px-8 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                {isSubmitting ? (
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                ) : (
                  <Send className="h-4 w-4" strokeWidth={2} aria-hidden />
                )}
                {isSubmitting ? t("status.sending") : t("form.button")}
              </m.button>

              <AnimatePresence mode="wait">
                {submitStatus === "success" && (
                  <m.div
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center gap-2 text-sm font-medium text-accent-green sm:justify-end"
                  >
                    <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden />
                    {t("status.success")}
                  </m.div>
                )}
                {submitStatus === "error" && (
                  <m.div
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center gap-2 text-sm font-medium text-destructive sm:justify-end"
                  >
                    <AlertCircle className="h-5 w-5 shrink-0" aria-hidden />
                    {t("status.error")}
                  </m.div>
                )}
              </AnimatePresence>
            </div>

            <p className="text-center text-xs text-text-muted sm:text-left">
              {t("note")}
            </p>
          </form>
        </div>
      </MotionReveal>
    </Section>
  );
}
