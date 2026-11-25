<script setup lang="ts">
import UiDock from '../../ui/UiDock.vue';
import UiDockButton from '../../ui/UiDockButton.vue';
import UiDockChip from '../../ui/UiDockChip.vue';
import UiDockDialog from '../../ui/UiDockDialog.vue';
import UiDockFab from '../../ui/UiDockFab.vue';
import UiDockInput from '../../ui/UiDockInput.vue';
import UiDockLine from '../../ui/UiDockLine.vue';
import UiDockPanel from '../../ui/UiDockPanel.vue';
import UiDockPerson from '../../ui/UiDockPerson.vue';
import UiDockPlainButton from '../../ui/UiDockPlainButton.vue';
import UiDockRow from '../../ui/UiDockRow.vue';
import UiDockSelect from '../../ui/UiDockSelect.vue';
import UiDockSettings from '../../ui/UiDockSettings.vue';
import UiDockSpacer from '../../ui/UiDockSpacer.vue';
import UiDockStatus from '../../ui/UiDockStatus.vue';
import UiDockTabs from '../../ui/UiDockTabs.vue';
import UiDockTarget from '../../ui/UiDockTarget.vue';
import UiDockText from '../../ui/UiDockText.vue';
import UiDockTextarea from '../../ui/UiDockTextarea.vue';
import UiDockTicker from '../../ui/UiDockTicker.vue';
import UiIcon from '../../ui/UiIcon.vue';
import { useToast } from '../../ui/toast';
import { useTrans } from '../words';
import { ref } from 'vue';

const t = useTrans();
const toast = useToast();
const number = ref('+1 415 555 0170');
const panel = ref(true);
const settings = ref(false);
const collapsed = ref(false);
const asking = ref(false);
const tab = ref('history');
const microphone = ref('');
const note = ref('');
const tabs = [
    { value: 'history', label: t('ui_kit.samples.dock_history') },
    { value: 'colleagues', label: t('ui_kit.samples.dock_colleagues') },
    { value: 'queues', label: t('ui_kit.samples.dock_queues'), badge: 2 },
];
const microphones = [
    { value: 'default', label: t('ui_kit.samples.dock_default_device') },
    { value: 'usb', label: 'USB Headset' },
];

function call(): void {
    asking.value = false;
    toast.info(`${t('ui_kit.samples.dock_call')} ${number.value}`);
}
</script>

<template>
    <!-- The transform makes this box the containing block of the collapsed button, so it stays inside the demo. -->
    <div class="flex h-[30rem] flex-col justify-end overflow-hidden rounded-card bg-canvas [transform:translateZ(0)]">
        <UiDock inline :collapsed="collapsed">
            <UiDockChip dot="ok">{{ t('ui_kit.samples.dock_available') }}</UiDockChip>
            <UiDockSpacer />
            <UiDockInput v-model="number" :placeholder="t('ui_kit.samples.dock_number')" :label="t('ui_kit.samples.dock_number')" @enter="asking = true" />
            <UiDockButton variant="green" round :label="t('ui_kit.samples.dock_call')" @click="asking = true"><UiIcon name="phone" /></UiDockButton>
            <UiDockSpacer kind="grow" />
            <UiDockText kind="timer">00:42</UiDockText>
            <UiDockButton :active="panel" :label="t('ui_kit.samples.dock_title')" @click="panel = !panel"><UiIcon name="dialpad" /></UiDockButton>
            <UiDockPlainButton :label="t('ui_kit.samples.dock_collapse')" @click="collapsed = true"><UiIcon name="minus" /></UiDockPlainButton>

            <template #ticker>
                <UiDockTicker :who="t('ui_kit.samples.dock_customer')" :text="t('ui_kit.samples.dock_ticker_line')" :live="t('ui_kit.samples.dock_live')" />
            </template>

            <template #panel>
                <UiDockPanel v-if="panel" :title="t('ui_kit.samples.dock_title')" :close-label="t('ui_kit.samples.dock_close')" @close="panel = false">
                    <template #actions>
                        <UiDockPlainButton :label="t('ui_kit.samples.dock_settings')" @click="settings = !settings"><UiIcon name="cog-outline" /></UiDockPlainButton>
                    </template>
                    <UiDockSettings v-if="settings" :label="t('ui_kit.samples.dock_settings')">
                        <UiDockSelect v-model="microphone" :label="t('ui_kit.samples.dock_microphone')" :options="microphones" :placeholder="t('ui_kit.samples.dock_choose')" />
                        <template #footer>
                            <UiDockButton variant="light" small @click="settings = false">{{ t('ui_kit.samples.dock_close') }}</UiDockButton>
                        </template>
                    </UiDockSettings>
                    <UiDockTabs v-model="tab" :tabs="tabs" />
                    <template v-if="tab === 'history'">
                        <UiDockRow icon="phone-missed" tone="missed" label="+1 650 555 0122" meta="10:42" :action-label="t('ui_kit.samples.dock_call_back')" @action="asking = true" />
                        <UiDockRow icon="phone-outgoing" tone="out" label="+1 415 555 0170" meta="09:15" :action-label="t('ui_kit.samples.dock_call_back')" @action="asking = true" />
                        <UiDockTextarea v-model="note" :placeholder="t('ui_kit.samples.dock_note')" :label="t('ui_kit.samples.dock_note')" />
                    </template>
                    <template v-else-if="tab === 'colleagues'">
                        <UiDockPerson online label="Jane Doe" meta="101" :action-label="t('ui_kit.samples.dock_call')" @action="call" />
                        <UiDockPerson :online="false" label="John Roe" meta="102" :action-label="t('ui_kit.samples.dock_call')" disabled />
                        <UiDockTarget label="Alex Poe">
                            <UiDockButton variant="light" small>{{ t('ui_kit.samples.dock_transfer') }}</UiDockButton>
                        </UiDockTarget>
                        <UiDockStatus state="done">{{ t('ui_kit.samples.dock_transferred') }}</UiDockStatus>
                    </template>
                    <template v-else>
                        <UiDockLine label="Dispatch" dot="ok" :meta="t('ui_kit.samples.dock_waiting', { count: 2 })">
                            <UiDockButton variant="light" small>{{ t('ui_kit.samples.dock_off') }}</UiDockButton>
                        </UiDockLine>
                        <UiDockLine label="Service plans" dot="off" />
                    </template>
                </UiDockPanel>
            </template>

            <template #fab>
                <UiDockFab :anchor="null" tone="ok" dot="ok" :label="t('ui_kit.samples.dock_expand')" :hint="t('ui_kit.samples.dock_expand')" @expand="collapsed = false"><UiIcon name="phone" /></UiDockFab>
            </template>
        </UiDock>

        <UiDockDialog v-if="asking" :title="number" :hint="t('ui_kit.samples.dock_how_to_call')" :label="t('ui_kit.samples.dock_call_method')" @cancel="asking = false">
            <UiDockButton variant="green" wide data-autofocus @click="call"><UiIcon name="headset" /> {{ t('ui_kit.samples.dock_call_here') }}</UiDockButton>
            <UiDockButton variant="light" wide :href="`tel:${number.replace(/\s/g, '')}`"><UiIcon name="phone" /> {{ t('ui_kit.samples.dock_call_phone') }}</UiDockButton>
        </UiDockDialog>
    </div>
</template>
