import { readItem, readItems } from "@directus/sdk";
import type { TcupUpdate } from "@repo/shared";
import type { CmsClient } from "@/config/cms.js";
import { env } from "@/config/env.js";

export class TcupUpdatesService {
    constructor(private readonly cms: CmsClient) {}

    async getAll() {
        const data = await this.cms.request<TcupUpdate[]>(
            readItems("tcup_updates", {
                filter: {
                    archived: {
                        _eq: false,
                    },
                    publish_date: {
                        _lte: "$NOW",
                    },
                },
            }),
        );

        // return data with client-friendly urls for images
        return data.map((d) => ({
            ...d,
            image: d.image ? `${this.getImageUrl(d.image, "card-thumb")}` : undefined,
        }));
    }

    async getById(id: string, preview: boolean = false) {
        const data = await this.cms
            .request<TcupUpdate>(
                readItem("tcup_updates", id, {
                    version: preview ? "draft" : undefined,
                }),
            )
            .catch(async () => {
                // throws an error if draft is unavailable
                // just return the published version
                return await this.cms.request<TcupUpdate>(readItem("tcup_updates", id));
            });

        return {
            ...data,
            image: data.image ? `${this.getImageUrl(data.image, "hero-image")}` : undefined,
        };
    }

    // build a fetch-ready URL for article images
    private getImageUrl(image_id: string, key?: string) {
        return new URL(
            `${env.directus.publicUrl}/assets/${image_id}${key ? `?key=${key}` : ""}`,
        ).toString();
    }
}
