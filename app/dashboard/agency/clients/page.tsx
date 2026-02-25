"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

type Client = {
  id: string;
  name: string;
  industry: string;
  plan: string;
  status: "Actif" | "En onboarding" | "En pause";
  kpi: string;
  note: string;
};

export default function ClientsPage() {
  const clients: Client[] = useMemo(
    () => [
      {
        id: "1",
        name: "NIVEA FR",
        industry: "Skincare • Retail",
        plan: "Agency Pro",
        status: "Actif",
        kpi: "+18% engagement",
        note: "3 scripts validés • 1 campagne live",
      },
      {
        id: "2",
        name: "Beauty UK",
        industry: "Beauty • D2C",
        plan: "Agency",
        status: "Actif",
        kpi: "ROAS 2.4",
       
