"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";

export function Navbar() {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-orange-400 hover:text-orange-300 transition-colors duration-300">
              Pactify
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <a href="#features" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300">
                How It Works
              </a>
              <a href="#testimonials" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300">
                Testimonials
              </a>
              <a href="#" className="text-gray-500 cursor-not-allowed px-3 py-2 rounded-md text-sm font-medium">
                Community (Soon)
              </a>
            </div>
          </div>
          <div className="flex items-center">
            <SignedOut>
              <Link href="/sign-in">
                <Button variant="ghost" className="text-white hover:text-orange-300">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="ml-4 bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20">
                  Get Started
                </Button>
              </Link>
            </SignedOut>
            <SignedIn>
                <Link href="/dashboard">
                    <Button variant="ghost" className="text-white hover:text-orange-300">
                        Dashboard
                    </Button>
                </Link>
              <div className="ml-4">
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}