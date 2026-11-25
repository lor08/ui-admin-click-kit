<script setup lang="ts">
import KitExample from './KitExample.vue';
import { demos } from './demos';
import UiChip from '../ui/UiChip.vue';
import UiPageHeader from '../ui/UiPageHeader.vue';
import { entriesOf, type KitEntry, type KitGroup } from './manifest';
import { useTrans } from './words';
import { computed } from 'vue';

/**
 * One page of the UI Kit section: the header of the group, the chips to
 * the other groups and to each component below, then every component of
 * the group rendered from the manifest with its demo; a part of a bigger
 * component (UiTabPanel, UiDropdownItem) follows its parent with its own
 * snippet and API and no demo of its own. A page may add blocks before
 * (the tokens) or after (a composed screen) through the slots.
 */
const props = withDefaults(
    defineProps<{
        group: KitGroup;
        groups: KitGroup[];
        /** Where the host serves the section; a group's page is `<base>/<group>`. */
        base?: string;
    }>(),
    { base: '/ui-kit' },
);

const t = useTrans();

/** Parents in manifest order, each followed by its parts. */
const entries = computed((): KitEntry[] => {
    const all = entriesOf(props.group);

    return all.filter((entry) => entry.partOf === undefined).flatMap((parent) => [parent, ...all.filter((entry) => entry.partOf === parent.name)]);
});
</script>

<template>
    <UiPageHeader :title="t(`ui_kit.groups.${props.group}.title`)" :lead="t(`ui_kit.groups.${props.group}.lead`)" :breadcrumbs="[{ label: t('ui_kit.title'), href: props.base }, { label: t(`ui_kit.groups.${props.group}.title`) }]">
        <nav class="mt-4 flex flex-wrap gap-1.5" :aria-label="t('ui_kit.nav')" data-test="group-nav">
            <UiChip v-for="other in props.groups" :key="other" :href="`${props.base}/${other}`" :active="other === props.group">{{ t(`ui_kit.groups.${other}.title`) }}</UiChip>
        </nav>
        <nav class="mt-3 flex flex-wrap gap-1.5" data-test="component-nav">
            <UiChip v-for="entry in entries" :key="entry.name" :href="`#${entry.name}`" mono>{{ entry.name }}</UiChip>
        </nav>
    </UiPageHeader>

    <div class="space-y-8">
        <slot name="before" />
        <KitExample v-for="entry in entries" :key="entry.name" :entry="entry">
            <component :is="demos[entry.name]" v-if="demos[entry.name]" />
        </KitExample>
        <slot name="after" />
    </div>
</template>
