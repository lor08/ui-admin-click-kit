<script setup lang="ts">
import { stripedBmp } from './samples';
import UiMediaFile from '../../ui/UiMediaFile.vue';
import { useTrans } from '../words';
import { onBeforeUnmount } from 'vue';

const t = useTrans();
const picture = stripedBmp();
const file = URL.createObjectURL(new Blob(['Invoice 1042: $120.00\n'], { type: 'text/plain' }));

onBeforeUnmount(() => {
    URL.revokeObjectURL(picture);
    URL.revokeObjectURL(file);
});
</script>

<template>
    <div class="flex flex-wrap items-start gap-4">
        <UiMediaFile :src="picture" content-type="image/bmp" :label="t('ui_kit.samples.media_photo')" />
        <UiMediaFile :src="file" content-type="text/plain" :label="t('ui_kit.samples.media_file')" />
    </div>
</template>
