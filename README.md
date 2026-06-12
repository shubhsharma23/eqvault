# EQVault - API Routes Migration

## Database Setup Complete ✅

The database has been successfully migrated to Supabase and the application now fetches data from the database instead of local files.

## What Changed

### New Files Created

1. **`/src/lib/supabase.ts`** - Supabase client configuration
2. **`/src/lib/db.ts`** - Database utility functions with type transformations
3. **`/src/lib/utils.ts`** - Utility functions (cn for className merging)
4. **API Routes:**
   - `/src/app/api/devices/route.ts` - GET all devices
   - `/src/app/api/devices/[id]/route.ts` - GET device by ID
   - `/src/app/api/presets/route.ts` - GET all presets (supports ?deviceId filter)
   - `/src/app/api/presets/[id]/route.ts` - GET preset by ID

### Updated Files

1. **`/src/app/page.tsx`** - Now fetches from database (async server component)
2. **`/src/app/devices/page.tsx`** - Now fetches from database (async server component)
3. **`/src/app/browse/page.tsx`** - Now fetches from API routes (client component with loading states)
4. **`/src/data/index.ts`** - Marked as deprecated with warnings

## API Endpoints

### Devices

```bash
# Get all devices
GET /api/devices

# Get device by ID
GET /api/devices/{id}
```

### Presets

```bash
# Get all presets
GET /api/presets

# Get presets for a specific device
GET /api/presets?deviceId=oneplus-nord-buds-2

# Get preset by ID
GET /api/presets/{id}
```

## Database Functions

For server components, you can directly import and use database functions:

```typescript
import { 
  getAllDevices, 
  getDeviceById,
  getAllPresets,
  getPresetsByDeviceId,
  getPresetById 
} from '@/lib/db';

// Example in async server component
export default async function MyPage() {
  const devices = await getAllDevices();
  const presets = await getAllPresets();
  
  return (
    <div>
      {/* Render your data */}
    </div>
  );
}
```

## Type Transformations

The database layer automatically transforms snake_case database columns to camelCase application types:

**Database (snake_case):**
```typescript
{
  driver_type: "10mm Dynamic",
  preset_count: 5,
  device_id: "oneplus-nord-buds-2"
}
```

**Application (camelCase):**
```typescript
{
  driverType: "10mm Dynamic",
  presetCount: 5,
  deviceId: "oneplus-nord-buds-2"
}
```

## Data Flow

### Server Components (Recommended)
```
Page Component → db.ts → Supabase → Transform → Render
```

### Client Components
```
Page Component → API Route → db.ts → Supabase → Transform → JSON Response → Render
```

## Environment Variables

Ensure your `.env.local` has:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Migration Notes

- ✅ All data is now in Supabase (seeded via `scripts/seed.ts`)
- ✅ `/src/data/index.ts` is deprecated but kept for `SIGNATURE_LABELS` and `FREQ_LABELS`
- ✅ Server components use direct database calls for better performance
- ✅ Client components use API routes with loading/error states
- ✅ All database queries include proper error handling
- ✅ Type safety maintained with automatic snake_case → camelCase transformation

## Next Steps

1. **Optional:** Remove the deprecated DEVICES and PRESETS arrays from `/src/data/index.ts` after confirming everything works
2. **Optional:** Add caching strategies for API routes (Next.js revalidation)
3. **Optional:** Implement pagination for large datasets
4. **Optional:** Add more API endpoints (search, filtering, sorting)

## Testing

```bash
# Start the development server
npm run dev

# Test API endpoints
curl http://localhost:3000/api/devices
curl http://localhost:3000/api/presets
curl http://localhost:3000/api/presets?deviceId=oneplus-nord-buds-2
```
