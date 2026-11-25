<script setup lang="ts">
import UiPhoneLink from '../../ui/UiPhoneLink.vue';
import { useToast } from '../../ui/toast';
import { useTrans } from '../words';

const t = useTrans();
const toast = useToast();

function dial(event: MouseEvent): void {
    event.preventDefault();
    toast.info(`${t('ui_kit.samples.dock_call')} +1 415 555 0170`);
}
</script>

<template>
    <p class="text-sm text-ink">
        {{ t('ui_kit.samples.phone_link_caller') }}
        <UiPhoneLink href="tel:+14155550170" :title="t('ui_kit.samples.dock_call')" @click="dial">+1 415 555 0170</UiPhoneLink>
    </p>
</template>
