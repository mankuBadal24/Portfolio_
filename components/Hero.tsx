"use client";
import { motion } from "framer-motion";
import Badge from "./Badge";
import Container from "./Container";
import Image from "next/image";
import { BRAND } from "@/lib/brand";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-10 sm:pt-14 md:pt-16">
      {/* subtle decorative gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_50%_-100px,rgba(37,99,235,0.25),transparent_60%)] dark:bg-[radial-gradient(1200px_600px_at_50%_-100px,rgba(37,99,235,0.15),transparent_60%)]"
      />
      <Container className="grid items-center gap-10 md:grid-cols-2">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3"
          >
            <Badge>Available for opportunities</Badge>
            <span className="text-xs opacity-70">{BRAND.adjectives.join(" • ")}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="font-heading text-4xl sm:text-5xl md:text-6xl"
          >
            {BRAND.name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-lg text-gray-600 dark:text-gray-300"
          >
            {BRAND.role}. I build clean, robust and accessible web & mobile experiences.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex gap-3"
          >
            <a href="#featured" className="rounded-2xl bg-brand px-5 py-3 text-white">
              View Projects
            </a>
            <a
              href="#contact"
              className="rounded-2xl border border-white/20 px-5 py-3 hover:bg-white/10"
            >
              Contact
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72"
          aria-hidden="true"
        >
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand/30 to-accent/30 blur-2xl" />
          <div className="relative h-full w-full card grid place-items-center">
            <Image
              src="/avatar.svg"
              alt="Avatar"
              width={220}
              height={220}
              priority
              className="h-28 w-28 sm:h-32 sm:w-32"
            />
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
