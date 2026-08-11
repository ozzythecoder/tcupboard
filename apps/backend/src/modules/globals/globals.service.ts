import { readSingleton } from "@directus/sdk";
import type { TipTapContent } from "@repo/shared";
import type { CmsClient } from "@/config/cms.js";

export class GlobalsService {
    constructor(private readonly cms: CmsClient) {}

    getSiteIntro() {
        return this.cms.request<{ id: number; content: TipTapContent }>(
            readSingleton("global_site_intro"),
        );
    }
}
