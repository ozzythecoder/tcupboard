import { defineInterface } from "@directus/extensions-sdk";
import InterfaceComponent from "./interface.vue";

export default defineInterface({
    id: "tcup/slug",
    name: "Slug",
    group: "other",
    icon: "box",
    description: "Generate a url-safe slug from another string field.",
    // biome-ignore lint: necessary cast to avoid excessive type comparison
    component: InterfaceComponent as any,
    types: ["string"],
    options: ({ collection }) => [
        {
            field: "sourceField",
            name: "Source Field",
            type: "string",
            meta: {
                interface: "system-field",
                options: {
                    collectionName: collection,
                    typeAllowList: ["string", "text"],
                },
            },
        },
    ],
});
