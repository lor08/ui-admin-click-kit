<script setup lang="ts">
import { silentWav } from './samples';
import UiAudioPlayer from '../../ui/UiAudioPlayer.vue';
import { useToast } from '../../ui/toast';
import { useTrans } from '../words';
import { onBeforeUnmount } from 'vue';

const t = useTrans();
const toast = useToast();
const src = silentWav(3);

onBeforeUnmount(() => URL.revokeObjectURL(src));
</script>

<template>
    <UiAudioPlayer :src="src" :label="t('ui_kit.samples.audio_label')" @play="toast.info(t('ui_kit.samples.audio_played'))" />
</template>
