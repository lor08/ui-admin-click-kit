<script setup lang="ts">
import UiSkeleton from '../../ui/UiSkeleton.vue';
</script>

<template>
    <div class="grid grid-cols-[auto_1fr] items-start gap-3">
        <UiSkeleton shape="circle" />
        <UiSkeleton :lines="3" />
        <UiSkeleton shape="block" class="col-span-2 h-16" />
    </div>
</template>
