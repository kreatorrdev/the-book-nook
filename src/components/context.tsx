"use client";
import { createContext, useContext } from "react";
import type { Snapshot } from "@/lib/types";
export type NookContext = { data: Snapshot; busy: boolean; mutate: (body: Record<string, unknown>, message?: string) => Promise<boolean>; notify: (message: string, error?: boolean) => void; signIn: () => void };
export const Nook = createContext<NookContext | null>(null);
export function useNook() { const value = useContext(Nook); if (!value) throw new Error("Reading room context missing"); return value; }
