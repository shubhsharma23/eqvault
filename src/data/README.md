# Centralized Labels System

This directory contains the centralized labels and content strings for the EQVault application.

## Files

### `labels.json`
The main JSON file containing all UI strings, labels, button texts, descriptions, and other content used throughout the application.

### `labels.ts`
TypeScript wrapper that imports `labels.json` and exports type-safe constants for use in components.

## Usage

### Importing Labels

```typescript
import { APP_LABELS, NAV_LABELS, BUTTON_LABELS, PAGE_LABELS } from '@/data/labels';

// Use in your component
<h1>{APP_LABELS.name}</h1>
<button>{BUTTON_LABELS.copy}</button>
```

### Available Label Categories

- **APP_LABELS** - Application-wide labels (name, tagline, hero, footer, stats)
- **NAV_LABELS** - Navigation menu items
- **BUTTON_LABELS** - Button texts (copy, submit, view all, etc.)
- **SECTION_LABELS** - Section headings
- **PAGE_LABELS** - Page-specific labels (browse, devices)
- **PRESET_CARD_LABELS** - PresetCard component labels
- **DEVICE_CARD_LABELS** - DeviceCard component labels
- **SOUND_SIGNATURE_LABELS** - Sound signature display names
- **DEVICE_TYPE_LABELS** - Device type display names
- **ARIA_LABELS** - Accessibility labels

## Benefits

1. **Centralized Content Management** - All UI strings in one place
2. **Easy Localization** - Simple to add multiple language support
3. **Type Safety** - TypeScript types for autocomplete and error checking
4. **Consistency** - Ensures consistent wording across the application
5. **Maintainability** - Easy to update content without touching component code

## Adding New Labels

1. Add your label to the appropriate section in `labels.json`
2. Use camelCase for keys (e.g., `viewDevices`, `browsePresets`)
3. Import and use in your component via `labels.ts`

## Example Structure

```json
{
  "buttons": {
    "newButton": "Click Me",
    "anotherButton": "Submit Form"
  }
}
```

```typescript
import { BUTTON_LABELS } from '@/data/labels';

<button>{BUTTON_LABELS.newButton}</button>
```
