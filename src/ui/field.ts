import { computed, inject, provide, useId, type ComputedRef, type InjectionKey } from 'vue';

/**
 * What a form control learns from the UiFormField around it: the id its
 * label points at, the id of the text that describes it, whether it is in
 * error. A control outside any field gets its own id and no description.
 */
export interface FieldContext {
    id: string;
    describedBy: ComputedRef<string | undefined>;
    invalid: ComputedRef<boolean>;
}

export const FIELD: InjectionKey<FieldContext> = Symbol('ui-field');

export interface FieldOptions {
    id: ComputedRef<string | undefined>;
    hasLabel: ComputedRef<boolean>;
    hasNote: ComputedRef<boolean>;
    invalid: ComputedRef<boolean>;
}

/**
 * UiFormField calls this: a field with nothing of its own to show passes
 * the enclosing field through (so a control may always wrap itself in one),
 * any other field is the source of ids for the control inside it.
 */
export function provideField(options: FieldOptions): FieldContext {
    const parent = inject(FIELD, null);
    const own = useId();
    const passthrough = computed(() => !options.hasLabel.value && !options.hasNote.value && options.id.value === undefined);

    const context: FieldContext = {
        get id(): string {
            if (options.id.value !== undefined) {
                return options.id.value;
            }

            return passthrough.value && parent ? parent.id : own;
        },
        describedBy: computed(() => {
            if (options.hasNote.value) {
                return `${context.id}-note`;
            }

            return passthrough.value ? parent?.describedBy.value : undefined;
        }),
        invalid: computed(() => options.invalid.value || (passthrough.value && parent ? parent.invalid.value : false)),
    };

    provide(FIELD, context);

    return context;
}
