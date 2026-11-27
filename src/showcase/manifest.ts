/**
 * The catalogue of the kit: one entry per component of src/ui, the single
 * source for the showcase (KitPage), for src/ui/README.md (npm run
 * ui:readme) and for the test that keeps the three in step
 * (tests/ui/manifest.spec.ts).
 *
 * Names, types, defaults and snippets are code and live here; every word
 * a person reads (what the component is for, when to reach for it, what a
 * prop means) lives in lang/<locale>/ui_kit.json under
 * `components.<Name>`, so the showcase speaks both languages.
 */
export type KitGroup = 'general' | 'buttons' | 'data' | 'feedback' | 'navigation' | 'layout' | 'softphone';

export const kitGroups: KitGroup[] = ['general', 'buttons', 'data', 'feedback', 'navigation', 'layout', 'softphone'];

export interface KitProp {
    name: string;
    type: string;
    /** The default as it reads in code; absent for a required prop. */
    default?: string;
}

export interface KitEntry {
    name: string;
    group: KitGroup;
    /** A piece of a bigger component (UiTabPanel of UiTabs): documented and shown with its parent. */
    partOf?: string;
    props: KitProp[];
    slots: string[];
    events: string[];
    snippet: string;
}

const vModel = (type: string): KitProp => ({ name: 'modelValue', type });

const field: KitProp[] = [
    { name: 'label', type: 'string', default: 'undefined' },
    { name: 'hint', type: 'string | null', default: 'null' },
    { name: 'error', type: 'string | null', default: 'null' },
    { name: 'id', type: 'string', default: 'undefined' },
    { name: 'required', type: 'boolean', default: 'false' },
    { name: 'optional', type: 'boolean', default: 'false' },
    { name: 'disabled', type: 'boolean', default: 'false' },
];

export const manifest: KitEntry[] = [
    // General elements
    {
        name: 'UiInput',
        group: 'general',
        props: [
            vModel('string'),
            ...field,
            { name: 'type', type: 'string', default: "'text'" },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'" },
            { name: 'placeholder', type: 'string', default: 'undefined' },
            { name: 'autocomplete', type: 'string', default: 'undefined' },
            { name: 'name', type: 'string', default: 'undefined' },
            { name: 'readonly', type: 'boolean', default: 'false' },
            { name: 'autofocus', type: 'boolean', default: 'false' },
            { name: 'invalid', type: 'boolean', default: 'false' },
            { name: 'inputmode', type: "'text' | 'numeric' | 'tel' | 'email' | 'decimal' | 'search' | 'url'", default: 'undefined' },
            { name: 'min / max / step / maxlength', type: 'string | number', default: 'undefined' },
        ],
        slots: ['leading', 'trailing'],
        events: ['update:modelValue', 'blur', 'keydown'],
        snippet: `<UiInput id="email" v-model="form.email" type="email" :label="t('people.form.email')" :error="form.errors.email" required />`,
    },
    {
        name: 'UiPasswordInput',
        group: 'general',
        props: [
            vModel('string'),
            ...field,
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'" },
            { name: 'name', type: 'string', default: 'undefined' },
            { name: 'autocomplete', type: "'current-password' | 'new-password'", default: "'current-password'" },
            { name: 'placeholder', type: 'string', default: 'undefined' },
            { name: 'autofocus', type: 'boolean', default: 'false' },
            { name: 'strength', type: 'boolean', default: 'false' },
            { name: 'minLength', type: 'number', default: '12' },
        ],
        slots: [],
        events: ['update:modelValue', 'blur'],
        snippet: `<UiPasswordInput id="password" v-model="form.password" autocomplete="new-password" :label="t('account.password.new')" :error="form.errors.password" strength :min-length="props.password_min" required />`,
    },
    {
        name: 'UiCopyField',
        group: 'general',
        props: [{ name: 'value', type: 'string' }, { name: 'label', type: 'string', default: 'undefined' }, { name: 'id', type: 'string', default: 'undefined' }, { name: 'copyLabel', type: 'string', default: 'undefined' }],
        slots: [],
        events: ['copied'],
        snippet: `<UiCopyField :value="invite.url" :label="t('people.invite.link')" />`,
    },
    {
        name: 'UiTextarea',
        group: 'general',
        props: [vModel('string'), ...field, { name: 'rows', type: 'number', default: '3' }, { name: 'placeholder', type: 'string', default: 'undefined' }, { name: 'readonly', type: 'boolean', default: 'false' }, { name: 'maxlength', type: 'number', default: 'undefined' }],
        slots: [],
        events: ['update:modelValue'],
        snippet: `<UiTextarea v-model="form.notes" :label="t('projects.form.notes')" :rows="4" :error="form.errors.notes" />`,
    },
    {
        name: 'UiPlaceInput',
        group: 'general',
        props: [vModel('string'), { name: 'label', type: 'string', default: 'undefined' }, { name: 'hint', type: 'string | null', default: 'null' }, { name: 'error', type: 'string | null', default: 'null' }, { name: 'id', type: 'string', default: 'undefined' }, { name: 'placeholder', type: 'string', default: 'undefined' }, { name: 'country', type: 'string', default: "'us'" }],
        slots: [],
        events: ['update:modelValue', 'place'],
        snippet: `<UiPlaceInput v-model="search" :label="t('places.form.search')" :hint="t('places.form.search_hint')" @place="Object.assign(form, $event)" />`,
    },
    {
        name: 'UiRichTextEditor',
        group: 'general',
        props: [vModel('string'), { name: 'label', type: 'string', default: 'undefined' }, { name: 'hint', type: 'string | null', default: 'null' }, { name: 'error', type: 'string | null', default: 'null' }, { name: 'id', type: 'string', default: 'undefined' }, { name: 'placeholder', type: 'string', default: 'undefined' }, { name: 'labels', type: '{ bold: string; italic: string; underline: string; color: string; background: string; clear: string }' }],
        slots: [],
        events: ['update:modelValue'],
        snippet: `<UiRichTextEditor v-model="form.description" :label="t('projects.form.description')" :labels="editorLabels" :error="form.errors.description" />`,
    },
    {
        name: 'UiFileInput',
        group: 'general',
        props: [vModel('File | null'), { name: 'accept', type: 'string', default: 'undefined' }, ...field],
        slots: [],
        events: ['update:modelValue'],
        snippet: `<UiFileInput v-model="upload.file" accept=".xlsx,.csv" :label="t('imports.form.file')" :error="upload.errors.file" />`,
    },
    {
        name: 'UiSelect',
        group: 'general',
        props: [
            vModel('string'),
            { name: 'options', type: '{ value: string; label: string; disabled?: boolean }[]' },
            ...field,
            { name: 'placeholder', type: 'string', default: 'undefined' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'" },
            { name: 'invalid', type: 'boolean', default: 'false' },
        ],
        slots: [],
        events: ['update:modelValue'],
        snippet: `<UiSelect v-model="filter.status" :label="t('projects.filters.status')" :options="statusOptions" :placeholder="t('projects.filters.all_statuses')" />`,
    },
    {
        name: 'UiMultiSelect',
        group: 'general',
        props: [
            vModel('string[]'),
            { name: 'options', type: '{ value: string; label: string; disabled?: boolean }[]' },
            { name: 'label', type: 'string', default: 'undefined' },
            { name: 'hint', type: 'string | null', default: 'null' },
            { name: 'error', type: 'string | null', default: 'null' },
            { name: 'id', type: 'string', default: 'undefined' },
            { name: 'placeholder', type: 'string', default: 'undefined' },
            { name: 'searchable', type: 'boolean', default: 'false' },
            { name: 'disabled', type: 'boolean', default: 'false' },
        ],
        slots: [],
        events: ['update:modelValue'],
        snippet: `<UiMultiSelect v-model="filter.teams" :label="t('projects.filters.team')" :options="teamOptions" :placeholder="t('projects.filters.all_teams')" searchable />`,
    },
    {
        name: 'UiChipGroup',
        group: 'general',
        props: [
            vModel('string | null'),
            { name: 'options', type: '{ value: string; label: string; disabled?: boolean }[]' },
            { name: 'label', type: 'string', default: 'undefined' },
            { name: 'hint', type: 'string | null', default: 'null' },
            { name: 'error', type: 'string | null', default: 'null' },
            { name: 'mandatory', type: 'boolean', default: 'false' },
            { name: 'disabled', type: 'boolean', default: 'false' },
        ],
        slots: [],
        events: ['update:modelValue'],
        snippet: `<UiChipGroup v-model="form.priority" :label="t('tasks.form.priority')" :options="priorityOptions" :error="form.errors.priority" />`,
    },
    {
        name: 'UiCheckbox',
        group: 'general',
        props: [
            vModel('boolean'),
            { name: 'label', type: 'string' },
            { name: 'description', type: 'string | null', default: 'null' },
            { name: 'error', type: 'string | null', default: 'null' },
            { name: 'id', type: 'string', default: 'undefined' },
            { name: 'disabled', type: 'boolean', default: 'false' },
            { name: 'indeterminate', type: 'boolean', default: 'false' },
            { name: 'mono', type: 'boolean', default: 'false' },
        ],
        slots: [],
        events: ['update:modelValue'],
        snippet: `<UiCheckbox v-model="form.primary" :label="t('people.form.primary')" :description="t('people.form.primary_hint')" />`,
    },
    {
        name: 'UiCheckboxGroup',
        group: 'general',
        props: [
            vModel('string[]'),
            { name: 'options', type: '{ value: string; label: string; description?: string; disabled?: boolean }[]' },
            { name: 'label', type: 'string', default: 'undefined' },
            { name: 'hint', type: 'string | null', default: 'null' },
            { name: 'error', type: 'string | null', default: 'null' },
            { name: 'columns', type: '1 | 2 | 3', default: '1' },
            { name: 'disabled', type: 'boolean', default: 'false' },
        ],
        slots: [],
        events: ['update:modelValue'],
        snippet: `<UiCheckboxGroup v-model="form.roles" :label="t('people.form.roles')" :options="roleOptions" :error="form.errors.roles" :columns="2" />`,
    },
    {
        name: 'UiSwitch',
        group: 'general',
        props: [vModel('boolean'), { name: 'label', type: 'string' }, { name: 'description', type: 'string | null', default: 'null' }, { name: 'id', type: 'string', default: 'undefined' }, { name: 'disabled', type: 'boolean', default: 'false' }],
        slots: [],
        events: ['update:modelValue'],
        snippet: `<UiSwitch v-model="notify" :label="t('projects.settings.notify')" @update:model-value="toggleNotify" />`,
    },
    {
        name: 'UiRadioGroup',
        group: 'general',
        props: [
            vModel('string'),
            { name: 'options', type: '{ value: string; label: string; description?: string; disabled?: boolean; depth?: number; group?: boolean }[]' },
            { name: 'label', type: 'string', default: 'undefined' },
            { name: 'name', type: 'string', default: 'undefined' },
            { name: 'error', type: 'string | null', default: 'null' },
            { name: 'inline', type: 'boolean', default: 'false' },
            { name: 'disabled', type: 'boolean', default: 'false' },
        ],
        slots: [],
        events: ['update:modelValue'],
        snippet: `<UiRadioGroup v-model="form.delivery" :label="t('reports.form.send_by')" :options="deliveries" inline />`,
    },
    {
        name: 'UiFormField',
        group: 'general',
        props: field.filter((prop) => prop.name !== 'disabled'),
        slots: ['default'],
        events: [],
        snippet: `<UiFormField :label="t('places.form.address')" :error="form.errors.line1" required>
    <div class="grid grid-cols-3 gap-2">
        <UiInput v-model="form.line1" class="col-span-2" />
        <UiInput v-model="form.city" />
    </div>
</UiFormField>`,
    },
    {
        name: 'UiLabel',
        group: 'general',
        props: [{ name: 'for', type: 'string', default: 'undefined' }, { name: 'required', type: 'boolean', default: 'false' }, { name: 'optional', type: 'boolean', default: 'false' }],
        slots: ['default'],
        events: [],
        snippet: `<UiLabel for="postcode" required>{{ t('places.form.postcode') }}</UiLabel>`,
    },
    {
        name: 'UiHelpText',
        group: 'general',
        props: [{ name: 'id', type: 'string', default: 'undefined' }],
        slots: ['default'],
        events: [],
        snippet: `<UiHelpText id="postcode-note">{{ t('places.form.postcode_hint') }}</UiHelpText>`,
    },
    {
        name: 'UiFieldError',
        group: 'general',
        props: [{ name: 'id', type: 'string', default: 'undefined' }, { name: 'message', type: 'string | null', default: 'null' }],
        slots: [],
        events: [],
        snippet: `<UiFieldError id="postcode-note" :message="form.errors.postcode" />`,
    },
    {
        name: 'UiForm',
        group: 'general',
        props: [{ name: 'processing', type: 'boolean', default: 'false' }, { name: 'error', type: 'string | null', default: 'null' }],
        slots: ['default', 'actions'],
        events: ['submit'],
        snippet: `<UiForm :processing="form.processing" :error="form.errors.form" @submit="save">
    <UiInput v-model="form.name" :label="t('teams.form.name')" :error="form.errors.name" />
    <template #actions>
        <UiButton type="submit">{{ t('teams.form.save') }}</UiButton>
        <UiButton variant="secondary" href="/teams">{{ t('ui.cancel') }}</UiButton>
    </template>
</UiForm>`,
    },

    // Buttons
    {
        name: 'UiButton',
        group: 'buttons',
        props: [
            { name: 'variant', type: "'primary' | 'secondary' | 'danger' | 'ghost' | 'link'", default: "'primary'" },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'" },
            { name: 'href', type: 'string', default: 'undefined' },
            { name: 'download', type: 'boolean', default: 'false' },
            { name: 'newTab', type: 'boolean', default: 'false' },
            { name: 'type', type: "'button' | 'submit'", default: "'button'" },
            { name: 'block', type: 'boolean', default: 'false' },
            { name: 'disabled', type: 'boolean', default: 'false' },
            { name: 'loading', type: 'boolean', default: 'false' },
            { name: 'wrap', type: 'boolean', default: 'false' },
        ],
        slots: ['default', 'icon', 'trailing'],
        events: [],
        snippet: `<UiButton :loading="form.processing" @click="save">
    <template #icon><Plus class="h-4 w-4" /></template>
    {{ t('projects.create') }}
</UiButton>`,
    },
    {
        name: 'UiIconButton',
        group: 'buttons',
        props: [
            { name: 'label', type: 'string' },
            { name: 'variant', type: "'ghost' | 'secondary' | 'primary' | 'danger'", default: "'ghost'" },
            { name: 'size', type: "'sm' | 'md'", default: "'md'" },
            { name: 'href', type: 'string', default: 'undefined' },
            { name: 'type', type: "'button' | 'submit'", default: "'button'" },
            { name: 'disabled', type: 'boolean', default: 'false' },
            { name: 'pressed', type: 'boolean', default: 'undefined' },
        ],
        slots: ['default'],
        events: [],
        snippet: `<UiIconButton :label="t('ui.close')" size="sm" @click="emit('close')"><X /></UiIconButton>`,
    },

    // Data
    {
        name: 'UiTable',
        group: 'data',
        props: [
            { name: 'columns', type: "{ key: string; label: string; sortable?: boolean; align?: 'left' | 'right' | 'center'; class?: string; pinEnd?: boolean; hideLabel?: boolean }[]" },
            { name: 'rows', type: 'T[]' },
            { name: 'rowKey', type: 'string' },
            { name: 'empty', type: 'string', default: 'undefined' },
            { name: 'sort', type: "{ key: string; direction: 'asc' | 'desc' } | null", default: 'undefined' },
            { name: 'loading', type: 'boolean', default: 'false' },
            { name: 'dense', type: 'boolean', default: 'false' },
            { name: 'clickable', type: 'boolean', default: 'false' },
            { name: 'flush', type: 'boolean', default: 'false' },
            { name: 'mutedRow', type: '(row: T) => boolean', default: 'undefined' },
            { name: 'rowTone', type: "(row: T) => 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info' | null", default: 'undefined' },
            { name: 'pulseRow', type: '(row: T) => boolean', default: 'undefined' },
            { name: 'stickyFirst', type: 'boolean', default: 'false' },
            { name: 'reorderable', type: 'boolean', default: 'false' },
            { name: 'rowLabel', type: '(row: T) => string', default: 'undefined' },
        ],
        slots: ['cell-<key>', 'header-<key>', 'empty', 'footer'],
        events: ['update:sort', 'row-click', 'reorder'],
        snippet: `<UiTable :columns="columns" :rows="props.projects" row-key="id" :empty="t('projects.empty')" clickable @row-click="open">
    <template #cell-status="{ row }"><UiBadge :tone="tones[row.status]" dot>{{ t(\`projects.statuses.\${row.status}\`) }}</UiBadge></template>
    <template #footer><UiPagination v-model:page="page" :last-page="props.last_page" /></template>
</UiTable>`,
    },
    {
        name: 'UiSearchInput',
        group: 'data',
        props: [
            vModel('string'),
            { name: 'placeholder', type: 'string', default: 'undefined' },
            { name: 'label', type: 'string', default: 'undefined' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'" },
            { name: 'loading', type: 'boolean', default: 'false' },
            { name: 'debounce', type: 'number', default: '300' },
            { name: 'autofocus', type: 'boolean', default: 'false' },
            { name: 'id', type: 'string', default: 'undefined' },
        ],
        slots: [],
        events: ['update:modelValue', 'search', 'clear'],
        snippet: `<UiSearchInput v-model="q" :placeholder="t('projects.search')" :loading="searching" @search="load" />`,
    },
    {
        name: 'UiCombobox',
        group: 'data',
        props: [
            vModel('string'),
            { name: 'options', type: '{ key: string; heading?: string }[]' },
            { name: 'label', type: 'string', default: 'undefined' },
            { name: 'placeholder', type: 'string', default: 'undefined' },
            { name: 'loading', type: 'boolean', default: 'false' },
            { name: 'debounce', type: 'number', default: '250' },
            { name: 'message', type: 'string | null', default: 'null' },
            { name: 'id', type: 'string', default: 'undefined' },
            { name: 'prefer', type: '(option) => boolean', default: 'undefined' },
        ],
        slots: ['option'],
        events: ['update:modelValue', 'search', 'select'],
        snippet: `<UiCombobox v-model="q" :options="options" :label="t('search.label')" :loading="searching" :message="message" :prefer="(option) => option.kind === 'project'" @search="load" @select="open">
    <template #option="{ option }">{{ option.display_name }}</template>
</UiCombobox>`,
    },
    {
        name: 'UiFilterBar',
        group: 'data',
        props: [
            { name: 'columns', type: '2 | 3 | 4 | 5 | 6', default: '4' },
            { name: 'processing', type: 'boolean', default: 'false' },
            { name: 'resettable', type: 'boolean', default: 'true' },
            { name: 'applyLabel', type: 'string', default: 'undefined' },
            { name: 'resetLabel', type: 'string', default: 'undefined' },
        ],
        slots: ['default', 'actions'],
        events: ['apply', 'reset'],
        snippet: `<UiFilterBar :columns="4" @apply="apply" @reset="reset">
    <UiSelect v-model="filter.status" :label="t('tasks.filters.status')" :options="statuses" :placeholder="t('tasks.filters.any')" />
    <UiInput v-model="filter.from" type="date" :label="t('tasks.filters.from')" />
</UiFilterBar>`,
    },
    {
        name: 'UiBadge',
        group: 'data',
        props: [
            { name: 'tone', type: "'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info'", default: "'neutral'" },
            { name: 'size', type: "'sm' | 'md'", default: "'md'" },
            { name: 'dot', type: 'boolean', default: 'false' },
            { name: 'outline', type: 'boolean', default: 'false' },
        ],
        slots: ['default'],
        events: [],
        snippet: `<UiBadge :tone="tones[row.status]" dot>{{ t(\`projects.statuses.\${row.status}\`) }}</UiBadge>`,
    },
    {
        name: 'UiDescriptionList',
        group: 'data',
        props: [
            { name: 'items', type: '{ key: string; label: string; value?: string | number | null }[]' },
            { name: 'placeholder', type: 'string', default: "'—'" },
            { name: 'dense', type: 'boolean', default: 'false' },
        ],
        slots: ['value-<key>'],
        events: [],
        snippet: `<UiDescriptionList :items="[{ key: 'name', label: t('people.form.name'), value: user.name }, { key: 'status', label: t('people.form.status') }]">
    <template #value-status><UiBadge :tone="user.is_blocked ? 'danger' : 'success'" dot>{{ t(user.is_blocked ? 'people.statuses.blocked' : 'people.statuses.active') }}</UiBadge></template>
</UiDescriptionList>`,
    },
    {
        name: 'UiText',
        group: 'data',
        props: [
            { name: 'tone', type: "'default' | 'muted' | 'subtle'", default: "'muted'" },
            { name: 'size', type: "'sm' | 'xs'", default: "'sm'" },
            { name: 'mono', type: 'boolean', default: 'false' },
            { name: 'block', type: 'boolean', default: 'false' },
            { name: 'lines', type: 'boolean', default: 'false' },
        ],
        slots: ['default'],
        events: [],
        snippet: `<UiText v-if="row.roles.length === 0" tone="subtle">{{ t('people.no_roles') }}</UiText>`,
    },
    {
        name: 'UiAvatar',
        group: 'data',
        props: [{ name: 'name', type: 'string' }, { name: 'src', type: 'string | null', default: 'null' }, { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'" }],
        slots: [],
        events: [],
        snippet: `<UiAvatar :name="user.name" size="sm" />`,
    },
    {
        name: 'UiStatCard',
        group: 'data',
        props: [
            { name: 'label', type: 'string' },
            { name: 'value', type: 'string | number | null' },
            { name: 'hint', type: 'string | null', default: 'null' },
            { name: 'tone', type: "'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info'", default: "'neutral'" },
            { name: 'href', type: 'string', default: 'undefined' },
            { name: 'loading', type: 'boolean', default: 'false' },
            { name: 'compact', type: 'boolean', default: 'false' },
            { name: 'labelFrom', type: "'sm' | 'md' | 'xl'", default: "'md'" },
        ],
        slots: ['icon'],
        events: [],
        snippet: `<UiStatCard :label="t('projects.stats.active')" :value="props.stats.active" tone="success" href="/projects?status=active">
    <template #icon><FolderOpen /></template>
</UiStatCard>`,
    },
    {
        name: 'UiBarChart',
        group: 'data',
        props: [
            { name: 'series', type: "{ key: string; label: string; tone: 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info' }[]" },
            { name: 'rows', type: '{ key: string; label: string; values: Record<string, number>; hint?: string }[]' },
            { name: 'orientation', type: "'vertical' | 'horizontal'", default: "'vertical'" },
            { name: 'label', type: 'string', default: 'undefined' },
            { name: 'empty', type: 'string', default: 'undefined' },
        ],
        slots: ['total'],
        events: [],
        snippet: `<UiBarChart
    :label="t('tasks.chart.by_day')"
    :series="[{ key: 'done', label: t('tasks.chart.done'), tone: 'success' }, { key: 'overdue', label: t('tasks.chart.overdue'), tone: 'danger' }]"
    :rows="props.days"
    :empty="t('tasks.chart.empty')"
/>`,
    },
    {
        name: 'UiTimelineBar',
        group: 'data',
        props: [
            { name: 'segments', type: "{ key: string; start: number; end: number; tone: 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info'; label: string }[]" },
            { name: 'span', type: 'number' },
            { name: 'ticks', type: '{ at: number; label: string }[]', default: '[]' },
            { name: 'label', type: 'string', default: 'undefined' },
        ],
        slots: [],
        events: [],
        snippet: `<UiTimelineBar
    :label="t('reports.timeline.of', { name: agent.name })"
    :span="86400"
    :segments="agent.segments"
    :ticks="[{ at: 0, label: '00:00' }, { at: 43200, label: '12:00' }, { at: 86400, label: '24:00' }]"
/>`,
    },
    {
        name: 'UiStreetView',
        group: 'data',
        props: [
            { name: 'address', type: 'string | null' },
            { name: 'unit', type: 'string | null', default: 'null' },
        ],
        slots: [],
        events: [],
        snippet: `<UiStreetView :address="place.address" :unit="place.unit" />`,
    },
    {
        name: 'UiMap',
        group: 'data',
        props: [
            { name: 'features', type: '{ id: string; geometry: MapGeometry }[]', default: '[]' },
            { name: 'featureStyle', type: '(id: string) => MapFeatureStyle', default: '() => ({})' },
            { name: 'center', type: '{ lat: number; lng: number }', default: '{ lat: 39.5, lng: -98.35 }' },
            { name: 'zoom', type: 'number', default: '4' },
            { name: 'loading', type: 'boolean', default: 'false' },
            { name: 'loadingLabel', type: 'string', default: 'undefined' },
            { name: 'info', type: '{ title: string; text?: string | null } | null', default: 'null' },
            { name: 'label', type: 'string', default: 'undefined' },
        ],
        slots: [],
        events: ['ready', 'viewport', 'feature-click', 'feature-hover'],
        snippet: `<UiMap
    ref="map"
    class="h-[60vh]"
    :features="visibleFeatures"
    :feature-style="styleOf"
    :center="{ lat: 34.05, lng: -118.24 }"
    :zoom="8"
    :loading="loading"
    :loading-label="t('places.map.loading_areas')"
    :info="hovered"
    @viewport="cull"
    @feature-click="toggleArea"
    @feature-hover="hover"
/>`,
    },
    {
        name: 'UiRichText',
        group: 'data',
        props: [{ name: 'html', type: 'string' }, { name: 'empty', type: 'string', default: "''" }],
        slots: [],
        events: [],
        snippet: `<UiRichText :html="project.description" :empty="t('projects.no_description')" />`,
    },
    {
        name: 'UiCodeBlock',
        group: 'data',
        props: [
            { name: 'value', type: 'unknown' },
            { name: 'maxHeight', type: "'sm' | 'md' | 'lg'", default: "'md'" },
            { name: 'collapsible', type: 'boolean', default: 'false' },
            { name: 'label', type: 'string', default: 'undefined' },
            { name: 'open', type: 'boolean', default: 'false' },
        ],
        slots: [],
        events: [],
        snippet: `<UiCodeBlock :value="event.payload" :label="t('events.payload')" collapsible max-height="lg" />`,
    },
    {
        name: 'UiAudioPlayer',
        group: 'data',
        props: [
            { name: 'src', type: 'string' },
            { name: 'label', type: 'string' },
        ],
        slots: [],
        events: ['play', 'error'],
        snippet: `<UiAudioPlayer ref="player" :src="recording.url" :label="t('recordings.player')" @play="renew" @error="failed = true" />`,
    },
    {
        name: 'UiMediaFile',
        group: 'data',
        props: [
            { name: 'src', type: 'string' },
            { name: 'contentType', type: 'string' },
            { name: 'label', type: 'string' },
        ],
        slots: [],
        events: [],
        snippet: `<UiMediaFile v-for="file in sms.media" :key="file.position" :src="file.url" :content-type="file.content_type" :label="t('sms.card.file', { n: file.position + 1 })" />`,
    },
    {
        name: 'UiSwatch',
        group: 'data',
        props: [{ name: 'color', type: 'string' }, { name: 'border', type: 'string | null', default: 'null' }, { name: 'size', type: "'sm' | 'md'", default: "'sm'" }],
        slots: ['default'],
        events: [],
        snippet: `<UiSwatch :color="teamColor(team.id)">{{ team.name }}</UiSwatch>`,
    },
    {
        name: 'UiEmbedFrame',
        group: 'data',
        props: [{ name: 'url', type: 'string' }, { name: 'title', type: 'string' }],
        slots: [],
        events: [],
        snippet: `<UiEmbedFrame v-if="answer.url" :url="answer.url" :title="t('reports.frame')" />`,
    },

    // Feedback
    {
        name: 'UiAlert',
        group: 'feedback',
        props: [{ name: 'variant', type: "'info' | 'warning' | 'success' | 'danger'", default: "'info'" }, { name: 'title', type: 'string | null', default: 'null' }, { name: 'dismissible', type: 'boolean', default: 'false' }],
        slots: ['default'],
        events: ['dismiss'],
        snippet: `<UiAlert v-if="notFound" variant="danger">{{ notFound }}</UiAlert>`,
    },
    {
        name: 'UiToaster',
        group: 'feedback',
        props: [],
        slots: [],
        events: [],
        snippet: `const toast = useToast();
toast.success(t('projects.created'));
toast.error(t('payments.provider_down'), detail);
toast.push({ tone: 'info', title: t('imports.started'), timeout: 0 });`,
    },
    {
        name: 'UiModal',
        group: 'feedback',
        props: [{ name: 'open', type: 'boolean' }, { name: 'title', type: 'string' }, { name: 'description', type: 'string | null', default: 'null' }, { name: 'size', type: "'sm' | 'md' | 'lg' | 'xl'", default: "'md'" }],
        slots: ['default', 'footer'],
        events: ['close'],
        snippet: `<UiModal :open="contactOpen" :title="t('people.contacts.add')" @close="contactOpen = false">
    <UiInput v-model="form.value" :label="t('people.contacts.value')" :error="form.errors.value" />
    <template #footer>
        <UiButton variant="secondary" @click="contactOpen = false">{{ t('ui.cancel') }}</UiButton>
        <UiButton :loading="form.processing" @click="addContact">{{ t('people.contacts.save') }}</UiButton>
    </template>
</UiModal>`,
    },
    {
        name: 'UiDrawer',
        group: 'feedback',
        props: [{ name: 'open', type: 'boolean' }, { name: 'title', type: 'string' }, { name: 'description', type: 'string | null', default: 'null' }, { name: 'size', type: "'md' | 'lg'", default: "'md'" }],
        slots: ['default', 'actions', 'footer'],
        events: ['update:open'],
        snippet: `<UiDrawer v-model:open="drawerOpen" :title="t('tasks.task')" :description="task.title" size="lg">
    <template #actions><UiIconButton :label="t('tasks.open')" :href="\`/tasks/\${task.id}\`"><ExternalLink /></UiIconButton></template>
    <UiDescriptionList :items="taskItems" dense />
</UiDrawer>`,
    },
    {
        name: 'UiConfirmDialog',
        group: 'feedback',
        props: [
            { name: 'open', type: 'boolean' },
            { name: 'title', type: 'string' },
            { name: 'message', type: 'string | null', default: 'null' },
            { name: 'confirmLabel', type: 'string', default: 'undefined' },
            { name: 'cancelLabel', type: 'string', default: 'undefined' },
            { name: 'tone', type: "'brand' | 'danger'", default: "'brand'" },
            { name: 'processing', type: 'boolean', default: 'false' },
        ],
        slots: ['default'],
        events: ['confirm', 'cancel'],
        snippet: `<UiConfirmDialog :open="confirmMerge" :title="t('projects.merge_title')" :message="t('projects.merge_warning')" tone="danger" :processing="mergeForm.processing" @confirm="merge" @cancel="confirmMerge = false" />`,
    },
    {
        name: 'UiSpinner',
        group: 'feedback',
        props: [{ name: 'size', type: "'xs' | 'sm' | 'md' | 'lg'", default: "'md'" }, { name: 'label', type: 'string', default: 'undefined' }],
        slots: [],
        events: [],
        snippet: `<UiSpinner v-if="loading" size="sm" />`,
    },
    {
        name: 'UiSkeleton',
        group: 'feedback',
        props: [{ name: 'shape', type: "'text' | 'block' | 'circle'", default: "'text'" }, { name: 'lines', type: 'number', default: '1' }],
        slots: [],
        events: [],
        snippet: `<UiSkeleton v-if="loading" :lines="3" />`,
    },
    {
        name: 'UiEmptyState',
        group: 'feedback',
        props: [{ name: 'title', type: 'string' }, { name: 'description', type: 'string | null', default: 'null' }, { name: 'size', type: "'sm' | 'md'", default: "'md'" }],
        slots: ['icon', 'action'],
        events: [],
        snippet: `<UiEmptyState :title="t('tasks.empty')" :description="t('tasks.empty_hint')">
    <template #icon><ListTodo /></template>
    <template #action><UiButton variant="secondary" href="/projects">{{ t('projects.title') }}</UiButton></template>
</UiEmptyState>`,
    },
    {
        name: 'UiTooltip',
        group: 'feedback',
        props: [{ name: 'text', type: 'string' }, { name: 'side', type: "'top' | 'right' | 'bottom' | 'left'", default: "'top'" }],
        slots: ['default'],
        events: [],
        snippet: `<UiTooltip :text="t('projects.id_hint')"><UiIconButton :label="t('ui.copy')" size="sm"><Copy /></UiIconButton></UiTooltip>`,
    },

    // Navigation
    {
        name: 'UiTabs',
        group: 'navigation',
        props: [{ name: 'tabs', type: '{ value: string; label: string; count?: number | null; disabled?: boolean }[]' }, vModel('string')],
        slots: ['default'],
        events: ['update:modelValue'],
        snippet: `<UiTabs v-model="tab" :tabs="[{ value: 'members', label: t('projects.tabs.members'), count: project.members.length }, { value: 'files', label: t('projects.tabs.files') }]">
    <UiTabPanel value="members">…</UiTabPanel>
    <UiTabPanel value="files">…</UiTabPanel>
</UiTabs>`,
    },
    {
        name: 'UiTabPanel',
        group: 'navigation',
        partOf: 'UiTabs',
        props: [{ name: 'value', type: 'string' }],
        slots: ['default'],
        events: [],
        snippet: `<UiTabPanel value="members">…</UiTabPanel>`,
    },
    {
        name: 'UiTabNav',
        group: 'navigation',
        props: [
            { name: 'items', type: '{ key: string; label: string; href: string; count?: number | null; icon?: Component }[]' },
            { name: 'current', type: 'string' },
            { name: 'label', type: 'string' },
        ],
        slots: [],
        events: [],
        snippet: `<UiTabNav :items="[{ key: 'overview', label: t('projects.tabs.overview'), href: \`/projects/\${id}\`, count: 2, icon: FolderOpen }]" current="overview" :label="t('projects.tabs.label')" />`,
    },
    {
        name: 'UiDropdown',
        group: 'navigation',
        props: [{ name: 'align', type: "'start' | 'end'", default: "'end'" }, { name: 'side', type: "'top' | 'bottom' | 'left' | 'right'", default: "'bottom'" }],
        slots: ['trigger', 'default'],
        events: [],
        snippet: `<UiDropdown>
    <template #trigger><UiIconButton :label="t('ui.actions')"><MoreHorizontal /></UiIconButton></template>
    <UiDropdownItem :href="\`/projects/\${row.id}\`"><template #icon><FolderOpen /></template>{{ t('projects.open') }}</UiDropdownItem>
    <UiDropdownSeparator />
    <UiDropdownItem tone="danger" @select="askToMerge(row)"><template #icon><GitMerge /></template>{{ t('projects.merge') }}</UiDropdownItem>
</UiDropdown>`,
    },
    {
        name: 'UiDropdownItem',
        group: 'navigation',
        partOf: 'UiDropdown',
        props: [{ name: 'href', type: 'string', default: 'undefined' }, { name: 'newTab', type: 'boolean', default: 'false' }, { name: 'tone', type: "'default' | 'danger'", default: "'default'" }, { name: 'disabled', type: 'boolean', default: 'false' }],
        slots: ['default', 'icon'],
        events: ['select'],
        snippet: `<UiDropdownItem tone="danger" @select="signOut">{{ t('account.sign_out') }}</UiDropdownItem>`,
    },
    {
        name: 'UiDropdownSeparator',
        group: 'navigation',
        partOf: 'UiDropdown',
        props: [],
        slots: [],
        events: [],
        snippet: `<UiDropdownSeparator />`,
    },
    {
        name: 'UiPagination',
        group: 'navigation',
        props: [{ name: 'page', type: 'number' }, { name: 'lastPage', type: 'number' }, { name: 'total', type: 'number | null', default: 'null' }, { name: 'perPage', type: 'number | null', default: 'null' }],
        slots: [],
        events: ['update:page'],
        snippet: `<UiPagination :page="props.page" :last-page="props.last_page" :total="props.total" :per-page="50" @update:page="(page) => visit(\`/projects?page=\${page}\`)" />`,
    },
    {
        name: 'UiPageHeader',
        group: 'navigation',
        props: [{ name: 'title', type: 'string' }, { name: 'lead', type: 'string | null', default: 'null' }, { name: 'breadcrumbs', type: '{ label: string; href?: string }[]', default: '[]' }],
        slots: ['actions', 'meta', 'default'],
        events: [],
        snippet: `<UiPageHeader :title="project.name" :lead="t('projects.lead')" :breadcrumbs="[{ label: t('projects.title'), href: '/projects' }, { label: project.name }]">
    <template #actions><UiButton :href="\`/projects/\${project.id}/edit\`">{{ t('projects.edit') }}</UiButton></template>
</UiPageHeader>`,
    },
    {
        name: 'UiBreadcrumbs',
        group: 'navigation',
        props: [{ name: 'items', type: '{ label: string; href?: string }[]' }],
        slots: [],
        events: [],
        snippet: `<UiBreadcrumbs :items="[{ label: t('projects.title'), href: '/projects' }, { label: project.name }]" />`,
    },
    {
        name: 'UiChip',
        group: 'navigation',
        props: [
            { name: 'href', type: 'string', default: 'undefined' },
            { name: 'active', type: 'boolean', default: 'false' },
            { name: 'mono', type: 'boolean', default: 'false' },
            { name: 'disabled', type: 'boolean', default: 'false' },
        ],
        slots: ['default'],
        events: ['select'],
        snippet: `<UiChip v-for="group in groups" :key="group" :href="\`/ui-kit/\${group}\`" :active="group === current">{{ t(\`ui_kit.groups.\${group}.title\`) }}</UiChip>`,
    },
    {
        name: 'UiKbd',
        group: 'navigation',
        props: [],
        slots: ['default'],
        events: [],
        snippet: `<UiKbd>Esc</UiKbd>`,
    },

    // Layout
    {
        name: 'UiDisclosure',
        group: 'layout',
        props: [{ name: 'title', type: 'string' }, { name: 'lead', type: 'string | null', default: 'null' }, { name: 'defaultOpen', type: 'boolean', default: 'false' }],
        slots: ['default', 'meta'],
        events: ['update:open'],
        snippet: `<UiDisclosure :title="t('tasks.by_day.title')">
    <template #meta><UiBadge tone="brand">{{ props.by_day.total }}</UiBadge></template>
    <UiTable :columns="columns" :rows="rows" row-key="day" />
</UiDisclosure>`,
    },
    {
        name: 'UiCard',
        group: 'layout',
        props: [{ name: 'title', type: 'string | null', default: 'null' }, { name: 'lead', type: 'string | null', default: 'null' }, { name: 'padding', type: "'md' | 'none'", default: "'md'" }],
        slots: ['default', 'actions', 'footer'],
        events: [],
        snippet: `<UiCard :title="t('people.contacts.title')" padding="none">
    <template #actions><UiButton size="sm" variant="secondary" @click="contactOpen = true">{{ t('people.contacts.add') }}</UiButton></template>
    <UiTable :columns="columns" :rows="person.contacts" row-key="value" flush />
</UiCard>`,
    },
    {
        name: 'UiList',
        group: 'layout',
        props: [{ name: 'bordered', type: 'boolean', default: 'false' }, { name: 'dense', type: 'boolean', default: 'false' }, { name: 'divided', type: 'boolean', default: 'false' }],
        slots: ['default'],
        events: [],
        snippet: `<UiList>
    <UiListItem v-for="provider in providers" :key="provider" :title="t(\`account.providers.\${provider}\`)">
        <template #trailing><UiButton size="sm" variant="secondary" @click="unlink(provider)">{{ t('account.unlink') }}</UiButton></template>
    </UiListItem>
</UiList>`,
    },
    {
        name: 'UiListItem',
        group: 'layout',
        partOf: 'UiList',
        props: [
            { name: 'title', type: 'string | null', default: 'null' },
            { name: 'description', type: 'string | null', default: 'null' },
            { name: 'mono', type: 'boolean', default: 'false' },
            { name: 'selectable', type: 'boolean', default: 'false' },
            { name: 'selected', type: 'boolean', default: 'false' },
        ],
        slots: ['default', 'leading', 'trailing'],
        events: ['select'],
        snippet: `<UiListItem title="projects.view" :description="t('permissions.projects_view')" mono />`,
    },
    {
        name: 'UiDivider',
        group: 'layout',
        props: [{ name: 'vertical', type: 'boolean', default: 'false' }],
        slots: ['default'],
        events: [],
        snippet: `<UiDivider>{{ t('account.login.or') }}</UiDivider>`,
    },
    {
        name: 'UiAppShell',
        group: 'layout',
        props: [{ name: 'brand', type: 'string' }],
        slots: ['default', 'nav', 'footer', 'dock'],
        events: [],
        snippet: `<UiAppShell :brand="t('app.name')">
    <template #nav>
        <UiNavItem v-for="item in menu" :key="item.href" :label="t(item.label)" :icon="item.icon" :href="item.href" :active-prefix="item.href" />
    </template>
    <template #footer="{ closeMenu }">
        <UiSidebarIdentity :name="user.name" :caption="t(\`roles.\${user.role}\`)" />
        <UiNavItem :label="t('account.sign_out')" :icon="LogOut" @click="closeMenu(); signOut()" />
    </template>
    <RouterView />
</UiAppShell>`,
    },
    {
        name: 'UiNavItem',
        group: 'layout',
        partOf: 'UiAppShell',
        props: [
            { name: 'label', type: 'string' },
            { name: 'icon', type: 'Component' },
            { name: 'href', type: 'string', default: 'undefined' },
            { name: 'activePrefix', type: 'string', default: 'undefined' },
        ],
        slots: [],
        events: ['click'],
        snippet: `<UiNavItem :label="t('nav.projects')" :icon="FolderOpen" href="/projects" active-prefix="/projects" />`,
    },
    {
        name: 'UiSidebarIdentity',
        group: 'layout',
        partOf: 'UiAppShell',
        props: [
            { name: 'name', type: 'string' },
            { name: 'caption', type: 'string' },
        ],
        slots: [],
        events: [],
        snippet: `<UiSidebarIdentity :name="user.name" :caption="t(\`roles.\${user.role}\`)" />`,
    },
    {
        name: 'UiSidebarSelect',
        group: 'layout',
        partOf: 'UiAppShell',
        props: [
            vModel('string'),
            { name: 'options', type: '{ value: string; label: string }[]' },
            { name: 'label', type: 'string' },
        ],
        slots: [],
        events: ['update:modelValue'],
        snippet: `<UiSidebarSelect :model-value="locale" :options="languages" :label="t('nav.language')" @update:model-value="setLocale" />`,
    },
    {
        name: 'UiAuthFrame',
        group: 'layout',
        props: [
            { name: 'brand', type: 'string' },
            { name: 'title', type: 'string' },
            { name: 'lead', type: 'string | null', default: 'null' },
        ],
        slots: ['default', 'footer'],
        events: [],
        snippet: `<UiAuthFrame :brand="t('app.name')" :title="t('account.login.title')" :lead="t('account.login.lead')">
    <UiForm @submit="signIn">…</UiForm>
    <template #footer><UiButton variant="link" href="/help">{{ t('account.login.help') }}</UiButton></template>
</UiAuthFrame>`,
    },

    // Softphone
    {
        name: 'UiIcon',
        group: 'softphone',
        props: [{ name: 'name', type: 'IconName' }, { name: 'label', type: 'string', default: 'undefined' }],
        slots: [],
        events: [],
        snippet: `<UiIcon name="phone-incoming" />`,
    },
    {
        name: 'UiDock',
        group: 'softphone',
        props: [{ name: 'inline', type: 'boolean', default: 'false' }, { name: 'collapsed', type: 'boolean', default: 'false' }],
        slots: ['default', 'panel', 'ticker', 'fab'],
        events: ['band'],
        snippet: `<UiAppShell :brand="t('app.name')">
    …
    <template #dock>
        <UiDock :collapsed="collapsed">
            <UiDockChip dot="ok">{{ t('softphone.available') }}</UiDockChip>
            <UiDockInput v-model="number" :placeholder="t('softphone.number')" :label="t('softphone.number')" @enter="dial" />
            <UiDockButton variant="green" round :label="t('softphone.call')" @click="dial"><UiIcon name="phone" /></UiDockButton>
            <UiDockSpacer kind="grow" />
            <UiDockPlainButton :label="t('softphone.collapse')" @click="collapsed = true"><UiIcon name="minus" /></UiDockPlainButton>
            <template #panel><UiDockPanel v-if="panel" :title="t('softphone.history')" :close-label="t('softphone.close')" @close="panel = false">…</UiDockPanel></template>
            <template #fab><UiDockFab :anchor="anchor" tone="ok" dot="ok" :label="t('softphone.expand')" @expand="collapsed = false" @move="anchor = $event"><UiIcon name="phone" /></UiDockFab></template>
        </UiDock>
    </template>
</UiAppShell>`,
    },
    {
        name: 'UiDockButton',
        group: 'softphone',
        partOf: 'UiDock',
        props: [
            { name: 'variant', type: "'ghost' | 'green' | 'red' | 'light'", default: "'ghost'" },
            { name: 'label', type: 'string', default: 'undefined' },
            { name: 'round', type: 'boolean', default: 'false' },
            { name: 'active', type: 'boolean', default: 'false' },
            { name: 'pulse', type: 'boolean', default: 'false' },
            { name: 'wide', type: 'boolean', default: 'false' },
            { name: 'small', type: 'boolean', default: 'false' },
            { name: 'disabled', type: 'boolean', default: 'false' },
            { name: 'href', type: 'string', default: 'undefined' },
        ],
        slots: ['default'],
        events: [],
        snippet: `<UiDockButton variant="green" round pulse @click="answer"><UiIcon name="phone" /> {{ t('softphone.answer') }}</UiDockButton>`,
    },
    {
        name: 'UiDockChip',
        group: 'softphone',
        partOf: 'UiDock',
        props: [
            { name: 'dot', type: 'DockDot', default: 'undefined' },
            { name: 'tone', type: "'default' | 'miss' | 'line' | 'sudo'", default: "'default'" },
            { name: 'label', type: 'string', default: 'undefined' },
            { name: 'inert', type: 'boolean', default: 'false' },
        ],
        slots: ['default'],
        events: [],
        snippet: `<UiDockChip dot="ok" :label="t('softphone.status')" @click="openStatus">{{ t('softphone.available') }}</UiDockChip>`,
    },
    {
        name: 'UiDockDialog',
        group: 'softphone',
        partOf: 'UiDock',
        props: [{ name: 'title', type: 'string' }, { name: 'hint', type: 'string' }, { name: 'label', type: 'string' }],
        slots: ['default'],
        events: ['cancel'],
        snippet: `<UiDockDialog v-if="asking" :title="number" :hint="t('softphone.how_to_call')" :label="t('softphone.call_method')" @cancel="asking = false">
    <UiDockButton variant="green" wide data-autofocus @click="callHere">{{ t('softphone.call_here') }}</UiDockButton>
    <UiDockButton variant="light" wide :href="\`tel:\${number}\`">{{ t('softphone.call_phone') }}</UiDockButton>
</UiDockDialog>`,
    },
    {
        name: 'UiDockFab',
        group: 'softphone',
        partOf: 'UiDock',
        props: [
            { name: 'anchor', type: 'FabAnchor | null' },
            { name: 'tone', type: "'ok' | 'dnd' | 'wait' | 'call' | 'wrap' | 'err' | 'off'" },
            { name: 'dot', type: 'DockDot' },
            { name: 'label', type: 'string' },
            { name: 'hint', type: 'string | null', default: 'null' },
            { name: 'viewport', type: 'FabViewport | null', default: 'null' },
        ],
        slots: ['default'],
        events: ['expand', 'move', 'grab', 'place'],
        snippet: `<UiDockFab :anchor="anchor" tone="call" dot="ok" :label="t('softphone.expand')" @expand="collapsed = false" @move="(next) => (anchor = next)">
    <UiDockText kind="fab">{{ timer }}</UiDockText>
</UiDockFab>`,
    },
    {
        name: 'UiDockInput',
        group: 'softphone',
        partOf: 'UiDock',
        props: [{ name: 'modelValue', type: 'string' }, { name: 'placeholder', type: 'string' }, { name: 'label', type: 'string' }, { name: 'wide', type: 'boolean', default: 'false' }, { name: 'disabled', type: 'boolean', default: 'false' }],
        slots: [],
        events: ['update:modelValue', 'enter', 'focus'],
        snippet: `<UiDockInput v-model="number" :placeholder="t('softphone.number')" :label="t('softphone.number')" @enter="dial" />`,
    },
    {
        name: 'UiDockText',
        group: 'softphone',
        partOf: 'UiDock',
        props: [{ name: 'kind', type: "'caller' | 'error' | 'timer' | 'empty' | 'meta' | 'fab'", default: "'caller'" }],
        slots: ['default'],
        events: [],
        snippet: `<UiDockText kind="timer">{{ timer }}</UiDockText>`,
    },
    {
        name: 'UiDockSpacer',
        group: 'softphone',
        partOf: 'UiDock',
        props: [{ name: 'kind', type: "'sep' | 'grow'", default: "'sep'" }],
        slots: [],
        events: [],
        snippet: `<UiDockSpacer kind="grow" />`,
    },
    {
        name: 'UiDockPlainButton',
        group: 'softphone',
        partOf: 'UiDock',
        props: [{ name: 'label', type: 'string' }],
        slots: ['default'],
        events: [],
        snippet: `<UiDockPlainButton :label="t('softphone.settings')" @click="toggleSettings"><UiIcon name="cog-outline" /></UiDockPlainButton>`,
    },
    {
        name: 'UiDockTicker',
        group: 'softphone',
        partOf: 'UiDock',
        props: [{ name: 'who', type: 'string' }, { name: 'text', type: 'string' }, { name: 'live', type: 'string | null' }],
        slots: [],
        events: [],
        snippet: `<template #ticker><UiDockTicker :who="t('softphone.customer')" :text="lastLine" :live="t('softphone.live')" /></template>`,
    },
    {
        name: 'UiDockPanel',
        group: 'softphone',
        partOf: 'UiDock',
        props: [{ name: 'title', type: 'string' }, { name: 'closeLabel', type: 'string' }, { name: 'narrow', type: 'boolean', default: 'false' }],
        slots: ['default', 'actions'],
        events: ['close'],
        snippet: `<UiDockPanel :title="t('softphone.title')" :close-label="t('softphone.close')" @close="panel = null">
    <template #actions><UiDockPlainButton :label="t('softphone.settings')"><UiIcon name="cog-outline" /></UiDockPlainButton></template>
    …
</UiDockPanel>`,
    },
    {
        name: 'UiDockTabs',
        group: 'softphone',
        partOf: 'UiDock',
        props: [{ name: 'tabs', type: '{ value: string; label: string; badge?: number }[]' }, { name: 'modelValue', type: 'string' }],
        slots: [],
        events: ['update:modelValue'],
        snippet: `<UiDockTabs v-model="tab" :tabs="[{ value: 'history', label: t('softphone.history') }, { value: 'queues', label: t('softphone.queues'), badge: waiting }]" />`,
    },
    {
        name: 'UiDockRow',
        group: 'softphone',
        partOf: 'UiDock',
        props: [{ name: 'icon', type: 'IconName' }, { name: 'tone', type: "'out' | 'in' | 'internal' | 'missed'" }, { name: 'label', type: 'string' }, { name: 'meta', type: 'string' }, { name: 'actionLabel', type: 'string' }],
        slots: [],
        events: ['action'],
        snippet: `<UiDockRow icon="phone-missed" tone="missed" :label="call.number" :meta="call.time" :action-label="t('softphone.call_back')" @action="dial(call.number)" />`,
    },
    {
        name: 'UiDockPerson',
        group: 'softphone',
        partOf: 'UiDock',
        props: [{ name: 'online', type: 'boolean' }, { name: 'label', type: 'string' }, { name: 'meta', type: 'string' }, { name: 'actionLabel', type: 'string' }, { name: 'disabled', type: 'boolean', default: 'false' }],
        slots: [],
        events: ['action'],
        snippet: `<UiDockPerson :online="person.online" :label="person.name" :meta="person.extension" :action-label="t('softphone.call')" :disabled="!person.online" @action="callColleague(person)" />`,
    },
    {
        name: 'UiDockLine',
        group: 'softphone',
        partOf: 'UiDock',
        props: [{ name: 'label', type: 'string' }, { name: 'dot', type: "'ok' | 'off'", default: 'undefined' }, { name: 'meta', type: 'string', default: 'undefined' }],
        slots: ['default'],
        events: [],
        snippet: `<UiDockLine :label="queue.name" :dot="queue.on ? 'ok' : 'off'" :meta="t('softphone.waiting', { count: queue.waiting })"><UiDockButton variant="light" small @click="toggle(queue)">{{ queue.on ? t('softphone.off') : t('softphone.on') }}</UiDockButton></UiDockLine>`,
    },
    {
        name: 'UiDockTarget',
        group: 'softphone',
        partOf: 'UiDock',
        props: [{ name: 'label', type: 'string' }],
        slots: ['default'],
        events: [],
        snippet: `<UiDockTarget :label="person.name"><UiDockButton variant="light" small @click="transfer(person)">{{ t('softphone.transfer') }}</UiDockButton></UiDockTarget>`,
    },
    {
        name: 'UiDockStatus',
        group: 'softphone',
        partOf: 'UiDock',
        props: [{ name: 'state', type: "'waits' | 'done' | 'failed'" }],
        slots: ['default'],
        events: [],
        snippet: `<UiDockStatus state="waits">{{ t('softphone.transferring') }}</UiDockStatus>`,
    },
    {
        name: 'UiDockSettings',
        group: 'softphone',
        partOf: 'UiDock',
        props: [{ name: 'label', type: 'string' }],
        slots: ['default', 'footer'],
        events: [],
        snippet: `<UiDockSettings :label="t('softphone.settings')">
    <UiDockSelect v-model="microphone" :label="t('softphone.microphone')" :options="microphones" />
    <template #footer><UiDockButton variant="light" small @click="resetFab">{{ t('softphone.reset_button') }}</UiDockButton></template>
</UiDockSettings>`,
    },
    {
        name: 'UiDockSelect',
        group: 'softphone',
        partOf: 'UiDock',
        props: [{ name: 'modelValue', type: 'string' }, { name: 'label', type: 'string' }, { name: 'options', type: '{ value: string; label: string }[]' }, { name: 'placeholder', type: 'string', default: 'undefined' }],
        slots: [],
        events: ['update:modelValue', 'focus'],
        snippet: `<UiDockSelect v-model="microphone" :label="t('softphone.microphone')" :options="microphones" :placeholder="t('softphone.choose')" @focus="readDevices" />`,
    },
    {
        name: 'UiDockMeter',
        group: 'softphone',
        partOf: 'UiDock',
        props: [{ name: 'label', type: 'string' }, { name: 'value', type: 'number' }],
        slots: [],
        events: [],
        snippet: `<UiDockMeter :label="t('softphone.microphone_level')" :value="level" />`,
    },
    {
        name: 'UiDockTextarea',
        group: 'softphone',
        partOf: 'UiDock',
        props: [{ name: 'modelValue', type: 'string' }, { name: 'placeholder', type: 'string' }, { name: 'label', type: 'string' }, { name: 'rows', type: 'number', default: '3' }, { name: 'maxlength', type: 'number', default: 'undefined' }],
        slots: [],
        events: ['update:modelValue'],
        snippet: `<UiDockTextarea v-model="note" :placeholder="t('softphone.note')" :label="t('softphone.note')" :maxlength="1000" />`,
    },
    {
        name: 'UiDialpad',
        group: 'softphone',
        props: [{ name: 'letters', type: 'boolean', default: 'false' }],
        slots: [],
        events: ['press'],
        snippet: `<UiDialpad letters @press="(digit) => (number += digit)" />`,
    },
    {
        name: 'UiPhoneLink',
        group: 'softphone',
        props: [{ name: 'href', type: 'string' }, { name: 'title', type: 'string', default: 'undefined' }],
        slots: ['default'],
        events: ['click'],
        snippet: `<UiPhoneLink :href="\`tel:\${call.from}\`" :title="t('softphone.call')" @click="(event) => softphoneReady && (event.preventDefault(), dial(call.from))">{{ call.fromLabel }}</UiPhoneLink>`,
    },
];

/** The entries of one group, in the order of the manifest. */
export function entriesOf(group: KitGroup): KitEntry[] {
    return manifest.filter((entry) => entry.group === group);
}

/** The lang key under `ui_kit.components.<Name>` for a prop, slot or event name: `update:modelValue` → `update_modelValue`, `cell-<key>` → `cell_key`. */
export function memberKey(name: string): string {
    return name.replace(/[<>]/g, '').replace(/[^A-Za-z0-9]+/g, '_').replace(/^_|_$/g, '');
}
