<script setup lang="ts">
import UiTable, { type UiTableColumn } from '../ui/UiTable.vue';
import { memberKey, type KitEntry } from './manifest';
import { useTrans } from './words';
import { computed } from 'vue';

/** The props, slots and events of a manifest entry, in kit tables, with the words of lang/<locale>/ui_kit.json. */
const props = defineProps<{ entry: KitEntry }>();

const t = useTrans();

const base = `ui_kit.components.${props.entry.name}`;

interface PropRow {
    name: string;
    type: string;
    default: string | null;
    description: string;
}

interface MemberRow {
    name: string;
    description: string;
}

const propColumns = computed((): UiTableColumn[] => [
    { key: 'name', label: t('ui_kit.example.props'), class: 'font-mono text-xs' },
    { key: 'type', label: t('ui_kit.example.type'), class: 'font-mono text-xs text-ink-muted' },
    { key: 'default', label: t('ui_kit.example.default'), class: 'font-mono text-xs' },
    { key: 'description', label: t('ui_kit.example.description') },
]);

const propRows = computed((): PropRow[] =>
    props.entry.props.map((prop) => ({ name: prop.name, type: prop.type, default: prop.default ?? null, description: t(`${base}.props.${memberKey(prop.name)}`) })),
);

function memberColumns(label: string): UiTableColumn[] {
    return [
        { key: 'name', label, class: 'w-48 font-mono text-xs' },
        { key: 'description', label: t('ui_kit.example.description') },
    ];
}

const slotRows = computed((): MemberRow[] => props.entry.slots.map((slot) => ({ name: `#${slot}`, description: t(`${base}.slots.${memberKey(slot)}`) })));
const eventRows = computed((): MemberRow[] => props.entry.events.map((event) => ({ name: `@${event}`, description: t(`${base}.events.${memberKey(event)}`) })));
</script>

<template>
    <div class="space-y-4" data-test="api">
        <UiTable v-if="propRows.length > 0" :columns="propColumns" :rows="propRows" row-key="name" dense>
            <template #cell-default="{ row }">
                <span v-if="row.default === null" class="text-danger">{{ t('ui_kit.example.required') }}</span>
                <span v-else class="text-ink-muted">{{ row.default }}</span>
            </template>
        </UiTable>
        <UiTable v-if="slotRows.length > 0" :columns="memberColumns(t('ui_kit.example.slots'))" :rows="slotRows" row-key="name" dense />
        <UiTable v-if="eventRows.length > 0" :columns="memberColumns(t('ui_kit.example.events'))" :rows="eventRows" row-key="name" dense />
    </div>
</template>
