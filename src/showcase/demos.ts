import type { Component } from 'vue';
import UiAlertDemo from './demos/UiAlertDemo.vue';
import UiAppShellDemo from './demos/UiAppShellDemo.vue';
import UiAudioPlayerDemo from './demos/UiAudioPlayerDemo.vue';
import UiAuthFrameDemo from './demos/UiAuthFrameDemo.vue';
import UiAvatarDemo from './demos/UiAvatarDemo.vue';
import UiBadgeDemo from './demos/UiBadgeDemo.vue';
import UiBarChartDemo from './demos/UiBarChartDemo.vue';
import UiBreadcrumbsDemo from './demos/UiBreadcrumbsDemo.vue';
import UiButtonDemo from './demos/UiButtonDemo.vue';
import UiCardDemo from './demos/UiCardDemo.vue';
import UiCheckboxDemo from './demos/UiCheckboxDemo.vue';
import UiCheckboxGroupDemo from './demos/UiCheckboxGroupDemo.vue';
import UiChipDemo from './demos/UiChipDemo.vue';
import UiCodeBlockDemo from './demos/UiCodeBlockDemo.vue';
import UiConfirmDialogDemo from './demos/UiConfirmDialogDemo.vue';
import UiDescriptionListDemo from './demos/UiDescriptionListDemo.vue';
import UiDisclosureDemo from './demos/UiDisclosureDemo.vue';
import UiCopyFieldDemo from './demos/UiCopyFieldDemo.vue';
import UiDividerDemo from './demos/UiDividerDemo.vue';
import UiDrawerDemo from './demos/UiDrawerDemo.vue';
import UiDropdownDemo from './demos/UiDropdownDemo.vue';
import UiEmptyStateDemo from './demos/UiEmptyStateDemo.vue';
import UiFieldErrorDemo from './demos/UiFieldErrorDemo.vue';
import UiFileInputDemo from './demos/UiFileInputDemo.vue';
import UiComboboxDemo from './demos/UiComboboxDemo.vue';
import UiFilterBarDemo from './demos/UiFilterBarDemo.vue';
import UiFormDemo from './demos/UiFormDemo.vue';
import UiFormFieldDemo from './demos/UiFormFieldDemo.vue';
import UiHelpTextDemo from './demos/UiHelpTextDemo.vue';
import UiIconButtonDemo from './demos/UiIconButtonDemo.vue';
import UiInputDemo from './demos/UiInputDemo.vue';
import UiKbdDemo from './demos/UiKbdDemo.vue';
import UiLabelDemo from './demos/UiLabelDemo.vue';
import UiListDemo from './demos/UiListDemo.vue';
import UiMapDemo from './demos/UiMapDemo.vue';
import UiStreetViewDemo from './demos/UiStreetViewDemo.vue';
import UiPlaceInputDemo from './demos/UiPlaceInputDemo.vue';
import UiRichTextDemo from './demos/UiRichTextDemo.vue';
import UiRichTextEditorDemo from './demos/UiRichTextEditorDemo.vue';
import UiModalDemo from './demos/UiModalDemo.vue';
import UiChipGroupDemo from './demos/UiChipGroupDemo.vue';
import UiMultiSelectDemo from './demos/UiMultiSelectDemo.vue';
import UiPageHeaderDemo from './demos/UiPageHeaderDemo.vue';
import UiPaginationDemo from './demos/UiPaginationDemo.vue';
import UiPasswordInputDemo from './demos/UiPasswordInputDemo.vue';
import UiRadioGroupDemo from './demos/UiRadioGroupDemo.vue';
import UiSearchInputDemo from './demos/UiSearchInputDemo.vue';
import UiSelectDemo from './demos/UiSelectDemo.vue';
import UiSkeletonDemo from './demos/UiSkeletonDemo.vue';
import UiSpinnerDemo from './demos/UiSpinnerDemo.vue';
import UiStatCardDemo from './demos/UiStatCardDemo.vue';
import UiSwatchDemo from './demos/UiSwatchDemo.vue';
import UiEmbedFrameDemo from './demos/UiEmbedFrameDemo.vue';
import UiSwitchDemo from './demos/UiSwitchDemo.vue';
import UiTableDemo from './demos/UiTableDemo.vue';
import UiTabNavDemo from './demos/UiTabNavDemo.vue';
import UiTabsDemo from './demos/UiTabsDemo.vue';
import UiTextDemo from './demos/UiTextDemo.vue';
import UiTextareaDemo from './demos/UiTextareaDemo.vue';
import UiToasterDemo from './demos/UiToasterDemo.vue';
import UiTooltipDemo from './demos/UiTooltipDemo.vue';

/**
 * The live example of each manifest entry, by component name. A part of a
 * bigger component (UiTabPanel, UiDropdownItem) is shown inside its parent's
 * demo and has none of its own; tests/ui/manifest.spec.ts checks the map
 * against the manifest.
 */
export const demos: Record<string, Component> = {
    UiInput: UiInputDemo,
    UiTextarea: UiTextareaDemo,
    UiSelect: UiSelectDemo,
    UiMultiSelect: UiMultiSelectDemo,
    UiChipGroup: UiChipGroupDemo,
    UiCheckbox: UiCheckboxDemo,
    UiCheckboxGroup: UiCheckboxGroupDemo,
    UiPasswordInput: UiPasswordInputDemo,
    UiDescriptionList: UiDescriptionListDemo,
    UiList: UiListDemo,
    UiText: UiTextDemo,
    UiSwitch: UiSwitchDemo,
    UiRadioGroup: UiRadioGroupDemo,
    UiFormField: UiFormFieldDemo,
    UiLabel: UiLabelDemo,
    UiHelpText: UiHelpTextDemo,
    UiFieldError: UiFieldErrorDemo,
    UiForm: UiFormDemo,
    UiButton: UiButtonDemo,
    UiIconButton: UiIconButtonDemo,
    UiTable: UiTableDemo,
    UiSearchInput: UiSearchInputDemo,
    UiFileInput: UiFileInputDemo,
    UiCombobox: UiComboboxDemo,
    UiFilterBar: UiFilterBarDemo,
    UiBadge: UiBadgeDemo,
    UiAvatar: UiAvatarDemo,
    UiStatCard: UiStatCardDemo,
    UiBarChart: UiBarChartDemo,
    UiMap: UiMapDemo,
    UiStreetView: UiStreetViewDemo,
    UiPlaceInput: UiPlaceInputDemo,
    UiRichText: UiRichTextDemo,
    UiRichTextEditor: UiRichTextEditorDemo,
    UiSwatch: UiSwatchDemo,
    UiEmbedFrame: UiEmbedFrameDemo,
    UiDisclosure: UiDisclosureDemo,
    UiCopyField: UiCopyFieldDemo,
    UiCodeBlock: UiCodeBlockDemo,
    UiAudioPlayer: UiAudioPlayerDemo,
    UiAlert: UiAlertDemo,
    UiToaster: UiToasterDemo,
    UiModal: UiModalDemo,
    UiDrawer: UiDrawerDemo,
    UiConfirmDialog: UiConfirmDialogDemo,
    UiSpinner: UiSpinnerDemo,
    UiSkeleton: UiSkeletonDemo,
    UiEmptyState: UiEmptyStateDemo,
    UiTooltip: UiTooltipDemo,
    UiTabNav: UiTabNavDemo,
    UiTabs: UiTabsDemo,
    UiDropdown: UiDropdownDemo,
    UiPagination: UiPaginationDemo,
    UiPageHeader: UiPageHeaderDemo,
    UiBreadcrumbs: UiBreadcrumbsDemo,
    UiChip: UiChipDemo,
    UiKbd: UiKbdDemo,
    UiCard: UiCardDemo,
    UiDivider: UiDividerDemo,
    UiAppShell: UiAppShellDemo,
    UiAuthFrame: UiAuthFrameDemo,
};
