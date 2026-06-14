import labelsData from './labels.json';

// Type-safe labels object
export const LABELS = labelsData;

// Export individual sections for convenience
export const APP_LABELS = LABELS.app;
export const NAV_LABELS = LABELS.navigation;
export const BUTTON_LABELS = LABELS.buttons;
export const SECTION_LABELS = LABELS.sections;
export const PAGE_LABELS = LABELS.pages;
export const PRESET_CARD_LABELS = LABELS.presetCard;
export const DEVICE_CARD_LABELS = LABELS.deviceCard;
export const SOUND_SIGNATURE_LABELS = LABELS.soundSignatures;
export const DEVICE_TYPE_LABELS = LABELS.deviceTypes;
export const ARIA_LABELS = LABELS.aria;

// Type definitions for better IDE support
export type LabelsType = typeof LABELS;
export type AppLabelsType = typeof APP_LABELS;
export type NavLabelsType = typeof NAV_LABELS;
export type ButtonLabelsType = typeof BUTTON_LABELS;
export type SectionLabelsType = typeof SECTION_LABELS;
export type PageLabelsType = typeof PAGE_LABELS;
