<script setup lang="ts">
import UiCopyField from '../../ui/UiCopyField.vue';
import { useTrans } from '../words';

const t = useTrans();
</script>

<template>
    <div class="max-w-xl">
        <UiCopyField id="demo-invite-link" value="https://example.com/invites/3kQ9vT2mX7pL0aZ4sYbN8cWd1eRf6gHj" :label="t('ui_kit.samples.invite_link')" />
    </div>
</template>
