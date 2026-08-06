import { defineInterface } from '@directus/extensions-sdk'
import Editor from './components/Editor.vue'

export default defineInterface({
    id: 'directus-tippytap/interface',
    name: 'TipTap',
    group: 'standard',
    icon: 'edit',
    description: 'Rich text editor.',
    // biome-ignore lint: necessary cast to avoid excessive type comparison
    component: Editor as any,
    types: ['json'],
    options: [
        {
            field: 'content',
            name: 'Content',
            type: 'json'
        }
    ]
})