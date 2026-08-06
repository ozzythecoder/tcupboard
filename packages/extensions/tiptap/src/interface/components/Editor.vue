<script lang="ts" setup>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import { StarterKit } from '@tiptap/starter-kit'
import { Image } from '@tiptap/extension-image'
import { FileHandlePluginOptions, FileHandler } from '@tiptap/extension-file-handler'
import { ref, watch } from 'vue'

const props = defineProps<{ content: any, value: any }>()
const emit = defineEmits<{
    input: [value: any]
}>()
const val = ref(props.value)

function handleEditorUpdate(value: any) {
    emit('input', value)
    val.value = value
}

const handleImageDrop: FileHandlePluginOptions['onDrop'] = (editor, files, pos) => {
    files.forEach(file => {
        const rdr = new FileReader()

        rdr.readAsDataURL(file)
        rdr.onload = () => {
            editor
                .chain()
                .insertContentAt(pos, {
                    type: 'image',
                    attrs: {
                        src: rdr.result,
                    }
                })
                .focus()
                .run()
        }
    })
}


const editor = useEditor({
    editorProps: {
        attributes: {
            class: 'uncontrolled'
        }
    },
    extensions: [
        StarterKit.configure({
            link: {
                openOnClick: false
            }
        }),
        Image,
        FileHandler.configure({
            allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif'],
            onDrop: handleImageDrop,
        })],
    content: props.value,
    onUpdate(props) {
        handleEditorUpdate(props.editor.getJSON())
    }
})

// Reactively load existing content into editor
watch(
    () => props.value,
    (newValue) => {
        if (newValue && editor.value) {
            const currentContent = JSON.stringify(editor.value.getJSON())
            const newContent = JSON.stringify(newValue)
            if (currentContent !== newContent) {
                editor.value.commands.setContent(newValue)
            }
        }
    },
    { immediate: true }
)
</script>

<template>
    <div class="format-menu">
        <button :data-active="editor?.isActive('bold')" @click="editor?.chain().focus().toggleBold().run()">
            Bold
        </button>
        <button :data-active="editor?.isActive('italic')" @click="editor?.chain().focus().toggleItalic().run()">
            Italic
        </button>
        <button :data-active="editor?.isActive('underline')" @click="editor?.chain().focus().toggleUnderline().run()">
            Underline
        </button>
        <button :data-active="editor?.isActive('heading', { level: 1 })"
            @click="editor?.chain().focus().toggleHeading({ level: 1 }).run()">
            H1
        </button>
        <button :data-active="editor?.isActive('heading', { level: 2 })"
            @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()">
            H2
        </button>
        <button :data-active="editor?.isActive('heading', { level: 3 })"
            @click="editor?.chain().focus().toggleHeading({ level: 3 }).run()">
            H3
        </button>
        <button :data-active="editor?.isActive('orderedList')"
            @click="editor?.chain().focus().toggleOrderedList().run()">
            1.
        </button>
        <button :data-active="editor?.isActive('bulletList')" @click="editor?.chain().focus().toggleBulletList().run()">
            •
        </button>
        <button :data-active="editor?.isActive('blockquote')" @click="editor?.chain().focus().toggleBlockquote().run()">
            Quote
        </button>
        <button :data-active="editor?.isActive('link')" @click="editor?.chain().focus().toggleLink().run()">
            Link
        </button>
    </div>
    <editor-content :editor="editor" />
    <details>
        <summary>JSON payload</summary>
        <pre class="checkity"> {{ val }} </pre>
    </details>
</template>

<style>
.uncontrolled {
    margin-top: .5rem;
    padding: 1rem;
    border: 1px solid var(--theme--form--field--input--border-color);
    border-radius: var(--theme--border-radius);
    font-size: 1rem;
    font-weight: 400;

    p {
        margin-bottom: 0.25rem;
    }

    h1 {
        font-size: 2.25rem;
        font-weight: 700;
    }

    h2 {
        font-size: 1.75rem;
        font-weight: 600;
    }

    h3 {
        font-size: 1.5rem;
        font-weight: 600;
    }

    blockquote {
        font-style: italic;
        font-weight: 400;
        padding-left: .5rem;
        margin-left: .5rem;
        border-left: 3px solid oklch(0.3 0 0);
        color: oklch(0.8 0 0);
    }

    a {
        color: oklch(0.6 0.25 273);
        text-decoration: underline;
    }
}

.format-menu {
    transition: background-color 0.5s ease-in-out;
    display: flex;
    flex-direction: row;
    gap: .33rem;

    >button {
        border: 1px solid var(--theme--form--field--input--border-color);
        border-radius: 6px;
        padding-inline: .5rem;
        padding-block: .25rem;

        &:hover {
            background-color: oklch(0.3 0 0);
        }

        &[data-active="true"] {
            background-color: oklch(0.6 0.25 273);
        }
    }
}

.checkity {
    color: white;
    font-family: monospace;
}
</style>
