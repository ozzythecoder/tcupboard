<script setup lang="ts">
import { inject, ref, watch } from 'vue';

const props = withDefaults(
	defineProps<{
		value: string | null;
		sourceField: string | null;
	}>(),
	{
		value: null,
		sourceField: null,
	},
);
const emit = defineEmits<{
	input: [value: string | null];
}>();
const formValues = inject('values', ref<Record<string, any>>({}))

function slugify(v: string): string {
	return v
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/(^-|-$)/g, '');
}

function update(v: string) {
    emit('input', slugify(v));
}

watch(
	() => (props.sourceField ? formValues.value[props.sourceField] : null),
	(v) => {
		if (typeof v === 'string' && v) {
    		update(v)
		} else if (v === null) {
    		emit('input', null);
		}
	},
);
</script>

<template>
	<VInput :modelValue="value" @blur="update($event.target.value)" />
</template>
