"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Logo from "@/components/logo";
import { Zap, Lock, BrainCircuit, ArrowRight, Server } from "lucide-react";
import Earth from "@/components/hero-3d";
import { motion, useInView, useAnimation } from "framer-motion";

// Animated component wrapper
const AnimatedSection = ({ children, delay = 0 }) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.6,
            delay: delay,
            ease: [0.22, 1, 0.36, 1],
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
};

// Animated feature card
const FeatureCard = ({ icon, title, description, delay = 0 }) => {
  return (
    <motion.div
      className="bg-card p-6 rounded-lg shadow-sm border"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 0.5,
        delay: delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -5,
        boxShadow:
          "0 10px 25px -5px rgba(107, 33, 168, 0.2), 0 8px 10px -6px rgba(107, 33, 168, 0.2)",
        transition: { duration: 0.2 },
      }}
    >
      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </motion.div>
  );
};

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <motion.header
        className="border-b"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Logo size="md" />
          <div className="flex gap-4">
            <Button variant="ghost" asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/sign-up">Sign Up</Link>
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center py-12 md:py-24 lg:py-10 bg-gradient-to-br from-purple-950/30 to-background dark:from-purple-950/50 dark:to-background overflow-hidden">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center ">
          <AnimatedSection>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Intelligent Power & Security System
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Advanced monitoring and control system for processing rooms and
              call centers. Optimize energy usage, enhance security, and improve
              operational efficiency.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" asChild>
                  <Link href="/sign-up">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" variant="outline" asChild>
                  <Link href="/sign-in">Sign In</Link>
                </Button>
              </motion.div>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.3}>
            <div className="hidden md:block ">
              <Earth />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <h2 className="text-3xl font-bold text-center mb-12">
              Key Features
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Zap className="h-6 w-6 text-primary" />}
              title="Power Management"
              description="Optimize energy consumption and reduce operational costs with intelligent power monitoring."
              delay={0.1}
            />
            <FeatureCard
              icon={<Lock className="h-6 w-6 text-primary" />}
              title="Enhanced Security"
              description="Comprehensive security monitoring with real-time alerts and access control management."
              delay={0.2}
            />
            <FeatureCard
              icon={<BrainCircuit className="h-6 w-6 text-primary" />}
              title="AI Analytics"
              description="Advanced AI-powered analytics for predictive maintenance and anomaly detection."
              delay={0.3}
            />
            <FeatureCard
              icon={<Server className="h-6 w-6 text-primary" />}
              title="3D Monitoring"
              description="Interactive 3D visualization of your data center with real-time status monitoring."
              delay={0.4}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-24 bg-gradient-to-br from-purple-950/30 to-background dark:from-purple-950/50 dark:to-background">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection>
            <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of facilities using our intelligent system to
              optimize operations and enhance security.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Button size="lg" asChild>
                <Link href="/sign-up">Create Your Account</Link>
              </Button>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <motion.footer
        className="border-t py-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Logo size="sm" />
            <div className="mt-4 md:mt-0 text-sm text-muted-foreground">
              © 2024 IntelliPower. All rights reserved.
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
