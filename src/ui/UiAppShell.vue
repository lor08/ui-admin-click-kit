<script setup lang="ts">
import UiIconButton from './UiIconButton.vue';
import { kitPath, useTrans } from './kit';
import { Menu } from '@lucide/vue';
import { DialogContent, DialogOverlay, DialogPortal, DialogRoot, DialogTitle } from 'reka-ui';
import { ref, watch } from 'vue';

/**
 * The frame of every signed-in screen: the dark sidebar on the left (brand,
 * `nav`, `footer`), the page on the right. On a phone the sidebar is a
 * drawer behind a menu button in a top bar; it closes when the path changes.
 * `dock` is a bar along the bottom (UiDock, the softphone): the sidebar and
 * the page end above the band it publishes as `--voice-dock-height`, none
 * while there is no bar or it is collapsed to its button.
 */
const props = defineProps<{ brand: string }>();

const t = useTrans();
const mobileOpen = ref(false);

/** For an item of the footer that opens a dialog: the drawer goes first, or it stays behind the dialog on a phone. */
function closeMenu(): void {
    mobileOpen.value = false;
}

watch(kitPath, () => (mobileOpen.value = false));
</script>

<template>
    <div class="min-h-screen bg-canvas">
        <div class="fixed top-0 bottom-[var(--voice-dock-height,0px)] left-0 z-30 hidden lg:block" data-test="desktop-sidebar">
            <aside class="flex h-full w-[var(--width-sidebar)] flex-col bg-sidebar text-sidebar-ink" data-test="sidebar">
                <div class="flex h-14 shrink-0 items-center gap-2 border-b border-sidebar-line px-4">
                    <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-control bg-brand-600 text-xs font-bold text-white" aria-hidden="true">{{ props.brand.charAt(0) }}</span>
                    <span class="truncate text-sm font-semibold text-white" data-test="brand">{{ props.brand }}</span>
                </div>
                <nav :aria-label="t('ui.shell.nav')" class="grow overflow-y-auto px-2 py-3"><slot name="nav" /></nav>
                <div class="shrink-0 border-t border-sidebar-line px-2 py-3"><slot name="footer" :close-menu="closeMenu" /></div>
            </aside>
        </div>

        <DialogRoot :open="mobileOpen" @update:open="(open: boolean) => (mobileOpen = open)">
            <DialogPortal>
                <DialogOverlay class="fixed inset-0 z-40 bg-ink/40 lg:hidden" />
                <DialogContent class="fixed inset-y-0 left-0 z-50 focus:outline-none lg:hidden" :aria-label="t('ui.shell.nav')" :aria-describedby="undefined" data-test="mobile-sidebar">
                    <DialogTitle class="sr-only">{{ t('ui.shell.nav') }}</DialogTitle>
                    <aside class="flex h-full w-[var(--width-sidebar)] flex-col bg-sidebar text-sidebar-ink">
                        <div class="flex h-14 shrink-0 items-center gap-2 border-b border-sidebar-line px-4">
                            <span class="truncate text-sm font-semibold text-white">{{ props.brand }}</span>
                        </div>
                        <!-- Any item closes the drawer, the one of the current screen too: it changes no route. -->
                        <nav :aria-label="t('ui.shell.nav')" class="grow overflow-y-auto px-2 py-3" @click="closeMenu"><slot name="nav" /></nav>
                        <div class="shrink-0 border-t border-sidebar-line px-2 py-3"><slot name="footer" :close-menu="closeMenu" /></div>
                    </aside>
                </DialogContent>
            </DialogPortal>
        </DialogRoot>

        <div class="flex min-h-screen flex-col pb-[var(--voice-dock-height,0px)] lg:pl-[var(--width-sidebar)]">
            <header class="sticky top-0 z-20 flex h-14 items-center gap-2 border-b border-line bg-surface px-3 lg:hidden" data-test="header">
                <UiIconButton :label="t('ui.shell.open_menu')" :aria-expanded="mobileOpen ? 'true' : 'false'" data-test="sidebar-toggle" @click="mobileOpen = true">
                    <Menu />
                </UiIconButton>
                <span class="truncate text-sm font-semibold text-ink">{{ props.brand }}</span>
            </header>

            <main class="mx-auto w-full max-w-7xl grow px-4 py-6 sm:px-6 lg:px-8">
                <slot />
            </main>
        </div>
        <slot name="dock" />
    </div>
</template>
