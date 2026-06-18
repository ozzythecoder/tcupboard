import type { Request } from "express";

export type Policy = (req: Request) => Promise<boolean>;
export type PolicyComposer = (...policies: Policy[]) => Policy;
export type ComposerFactory = (composers: { all: PolicyComposer; or: PolicyComposer }) => Policy;

export type PolicyRecord = Record<string, Policy>;