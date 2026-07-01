import type { Request } from "express";

export type Policy = (req: Request) => Promise<boolean>;
export type PolicyFactory = (...args: unknown[]) => Policy | Promise<Policy>;
export type PolicyComposer = (...policies: Policy[]) => Policy;
export type ComposerFactory = (composers: { all: PolicyComposer; one: PolicyComposer }) => Policy;
