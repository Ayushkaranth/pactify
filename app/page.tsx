"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, Variants, useInView, animate } from "framer-motion";
import { GridBackground } from "@/components/ui/grid-background";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle, MessageSquare, Target, UserCheck, Wallet, Sparkles, Github, Twitter, Linkedin, ClipboardList } from "lucide-react";

// --- Advanced Animation Components & Hooks (Included directly for simplicity) ---

// Custom Hook for the 3D Tilt Effect
function useTilt(ref: React.RefObject<HTMLDivElement>) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const onMouseMove = (e: MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    setRotate({
      x: yPct * -14,
      y: xPct * 14,
    });
  };

  const onMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  useEffect(() => {
    const currentRef = ref.current;
    if (currentRef) {
      currentRef.addEventListener("mousemove", onMouseMove);
      currentRef.addEventListener("mouseleave", onMouseLeave);
    }
    return () => {
      if (currentRef) {
        currentRef.removeEventListener("mousemove", onMouseMove);
        currentRef.removeEventListener("mouseleave", onMouseLeave);
      }
    };
  }, [ref]);
  
  return { rotate };
}

// Tilt Card Component Wrapper
const TiltCard = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    const ref = useRef<HTMLDivElement>(null);
    const { rotate } = useTilt(ref);

    return (
        <motion.div
            ref={ref}
            style={{
                transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1, 1, 1)`,
                transition: "all 0.2s cubic-bezier(0.03, 0.98, 0.52, 0.99)",
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
};


// --- Main Landing Page Component ---

export default function LandingPage() {
  const features = [
    { icon: <Target className="h-10 w-10 text-orange-400" />, title: "Stake Your Goals", description: "Commit to personal goals by staking crypto. Succeed and get it back. Fail, and it goes to a cause you choose. True accountability." },
    { icon: <UserCheck className="h-10 w-10 text-blue-400" />, title: "Verifiable Pacts", description: "Create on-chain agreements and IOUs with peers. A permanent, timestamped record of every commitment, big or small." },
    { icon: <MessageSquare className="h-10 w-10 text-green-400" />, title: "Spam-Free Outreach", description: "Contact professionals with a refundable crypto bond. Show you're serious and respect their time, guaranteeing a response." },
  ];

  const howItWorksSteps = [
    { icon: <ClipboardList size={40} className="text-white" />, title: "1. Define Your Commitment", description: "Create a pact for anything—a personal goal, a project task, or a financial IOU. Set the terms and the deadline clearly." },
    { icon: <Wallet size={40} className="text-white" />, title: "2. Add a Verifiable Stake", description: "Optionally add a crypto stake. This creates a powerful, real-world incentive and proves you're serious about your commitment." },
    { icon: <Sparkles size={40} className="text-white" />, title: "3. Build Your On-Chain Legacy", description: "As you succeed, your on-chain history grows, building a public Reliability Score—your ultimate professional asset." },
  ];
  
  const testimonials = [
    { name: "Priya Sharma", title: "Final Year Student", quote: "Pactify was a game-changer for my final year project. The on-chain task pacts kept everyone accountable. The public profile is now the highlight of my resume!", avatar: "https://placehold.co/100x100/F97316/FFFFFF?text=PS" },
    { name: "Aman Gupta", title: "Freelance Developer", quote: "The spam-free outreach is brilliant. I get fewer, but much higher-quality inquiries. Plus, the IOU ledger has saved me from so many awkward conversations with clients.", avatar: "https://placehold.co/100x100/3B82F6/FFFFFF?text=AG" },
    { name: "Rohan Desai", title: "Tech Recruiter @ Innovate Inc.", quote: "A Pactify profile is the strongest signal I can get. It shows a candidate's drive and reliability before I even read their resume. It's the future of hiring.", avatar: "https://placehold.co/100x100/10B981/FFFFFF?text=RD" },
  ];

  const containerVariants: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2 } } };
  const itemVariants: Variants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.5 } } };
  const featureVariants: Variants = { hidden: { y: 50, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } } };

  return (
    <div className="w-full min-h-screen overflow-y-auto bg-slate-950 text-white">
      <Navbar />

      {/* Hero Section */}
      <GridBackground>
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
            <div className="absolute inset-0 z-0">
                {Array.from({ length: 250 }).map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: Math.random() * 100 - 50 + 'vw', y: Math.random() * 100 - 50 + 'vh' }}
                        animate={{ opacity: [0, 0.7, 0], x: `calc(${Math.random() * 100 - 50}vw + ${Math.random() * 100 - 50}px)`, y: `calc(${Math.random() * 100 - 50}vh + ${Math.random() * 100 - 50}px)` }}
                        transition={{ duration: Math.random() * 10 + 10, repeat: Infinity, ease: "linear" }}
                        style={{ width: `${Math.random() * 2 + 1}px`, height: `${Math.random() * 2 + 1}px` }}
                        className="bg-white rounded-full"
                    />
                ))}
            </div>

            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="relative z-10">
                <motion.h1
                    variants={itemVariants}
                    className="text-4xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400"
                >
                    Beyond Promises.
                    <br />
                    Verifiable Proof.
                </motion.h1>
                <motion.p variants={itemVariants} className="mt-6 text-lg max-w-2xl mx-auto text-neutral-300">
                    Pactify is the accountability engine for students and professionals. We turn your goals, agreements, and outreach into tangible, on-chain commitments.
                </motion.p>
                <motion.div variants={itemVariants} className="mt-8">
                    <Link href="/sign-up">
                        <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white text-lg px-8 py-6 rounded-full shadow-lg shadow-orange-500/30 transition-transform duration-300 hover:scale-105 active:scale-95">
                            Build Your Reputation
                        </Button>
                    </Link>
                </motion.div>
            </motion.div>
        </div>
      </GridBackground>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 bg-slate-950">
        <div className="max-w-7xl mx-auto">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.5 }} className="text-4xl font-bold text-center text-white mb-16">An Engine for Trust</motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                    <TiltCard key={index}>
                        <motion.div variants={featureVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="bg-slate-900 p-8 rounded-2xl border border-white/[0.1] shadow-2xl h-full backdrop-blur-sm bg-opacity-70">
                            <div className="mb-4">{feature.icon}</div>
                            <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                            <p className="text-neutral-400">{feature.description}</p>
                        </motion.div>
                    </TiltCard>
                ))}
            </div>
        </div>
      </section>

      {/* REPLACEMENT: How It Works Section */}
      <section id="how-it-works" className="py-24 px-4 bg-slate-900/50">
        <div className="max-w-5xl mx-auto">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.5 }} className="text-4xl font-bold text-center text-white mb-20">From Ambition to Achievement in 3 Steps</motion.h2>
          <div className="relative">
            <motion.div 
                initial={{ height: 0 }}
                whileInView={{ height: "100%" }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="hidden md:block absolute top-0 left-1/2 w-0.5 bg-gradient-to-b from-transparent via-orange-500 to-transparent opacity-30"
            ></motion.div>
            <div className="space-y-16">
              {howItWorksSteps.map((step, index) => (
                <motion.div 
                    key={index} 
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.7, delay: 0.2 * index }}
                    className="flex flex-col md:flex-row items-center gap-8 even:md:flex-row-reverse"
                >
                    <div className="flex-shrink-0 flex items-center justify-center h-24 w-24 bg-slate-800 border-2 border-orange-500/50 rounded-full shadow-lg">
                        {step.icon}
                    </div>
                    <div className="text-center md:text-left">
                        <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                        <p className="text-neutral-400 max-w-md">{step.description}</p>
                    </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 px-4 bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.5 }} className="text-4xl font-bold text-center text-white mb-16">Trusted by the Ambitious</motion.h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TiltCard key={index}>
                <motion.div variants={featureVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="bg-slate-900 p-8 rounded-2xl border border-white/[0.1] shadow-2xl flex flex-col h-full">
                  <blockquote className="text-neutral-300 italic flex-grow">"{testimonial.quote}"</blockquote>
                  <div className="flex items-center mt-6">
                    <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full border-2 border-orange-400/50" />
                    <div className="ml-4">
                      <p className="font-bold text-white">{testimonial.name}</p>
                      <p className="text-sm text-orange-400">{testimonial.title}</p>
                    </div>
                  </div>
                </motion.div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.7 }} className="p-1 rounded-2xl bg-gradient-to-r from-orange-500 via-purple-500 to-blue-500">
            <div className="bg-slate-900 p-12 rounded-xl text-center">
              <h2 className="text-4xl font-bold text-white mb-4">Ready to Build Your Legacy of Proof?</h2>
              <p className="text-neutral-300 text-lg mb-8 max-w-2xl mx-auto">Stop telling people you're reliable. Start proving it. Your on-chain reputation begins today.</p>
              <Link href="/sign-up">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white text-lg px-8 py-6 rounded-full shadow-lg shadow-orange-500/30 transition-transform duration-300 hover:scale-105 active:scale-95">
                  Sign Up and Start Committing
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.1] mt-12">
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-neutral-500">
              <p>&copy; {new Date().getFullYear()} Pactify. All rights reserved.</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="hover:text-white transition-colors duration-300"><Twitter /></a>
                <a href="#" className="hover:text-white transition-colors duration-300"><Github /></a>
                <a href="#" className="hover:text-white transition-colors duration-300"><Linkedin /></a>
              </div>
          </div>
      </footer>
    </div>
  );
}