<script setup lang="ts">
/// <reference types="google.maps" />
import UiFormField from './UiFormField.vue';
import { kitLocale } from './kit';
import { MapPin } from 'lucide-vue-next';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { configureMaps, mapsKey, mapsLoader, placeToAddress, type PlaceAddress, type PlaceComponent } from './map';
import { controlBase, controlSizes, controlState } from './styles';

/**
 * An address search with Google Places suggestions: the person types, picks a
 * suggestion and the form gets street, city, state and zip in `place`. The
 * fields stay the form's to correct. Without a Maps key it is a plain
 * text box and the form is filled by hand.
 */
const props = withDefaults(
    defineProps<{
        modelValue: string;
        label?: string;
        hint?: string | null;
        error?: string | null;
        id?: string;
        placeholder?: string;
        /** The country suggestions come from, an ISO code. */
        country?: string;
    }>(),
    { label: undefined, hint: null, error: null, id: undefined, placeholder: undefined, country: 'us' },
);

const emit = defineEmits<{ 'update:modelValue': [value: string]; place: [address: PlaceAddress] }>();

const input = ref<HTMLInputElement | null>(null);
const key = mapsKey();
const loader = mapsLoader();
let listener: google.maps.MapsEventListener | null = null;

onMounted(async () => {
    if (key === '' || loader === null || input.value === null) {
        return;
    }

    try {
        configureMaps(loader, key, kitLocale());
        const { Autocomplete } = (await loader.importLibrary('places')) as google.maps.PlacesLibrary;
        if (input.value === null) {
            return;
        }
        const autocomplete = new Autocomplete(input.value, { componentRestrictions: { country: props.country }, fields: ['address_components', 'formatted_address'], types: ['address'] });
        listener = autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (!place.address_components) {
                return;
            }
            emit('update:modelValue', place.formatted_address ?? input.value?.value ?? '');
            emit('place', placeToAddress(place.address_components as PlaceComponent[]));
        });
    } catch {
        // Without Places the box stays a plain text field; the form is filled by hand.
    }
});

onBeforeUnmount(() => listener?.remove());
</script>

<template>
    <UiFormField :label="props.label" :hint="props.hint" :error="props.error" :id="props.id" v-slot="field">
        <div class="relative">
            <MapPin class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle" aria-hidden="true" />
            <input
                :id="field.id"
                ref="input"
                type="text"
                autocomplete="off"
                :class="[controlBase, controlSizes.md, controlState(field.invalid), 'pl-9']"
                :value="props.modelValue"
                :placeholder="props.placeholder"
                :aria-invalid="field.invalid || undefined"
                :aria-describedby="field.describedBy"
                data-test="place-input"
                @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
                @keydown.enter.prevent
            />
        </div>
    </UiFormField>
</template>
