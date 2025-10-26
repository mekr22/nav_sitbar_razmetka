# Marketplace Database Migration Guide

This guide explains the database structure created for the marketplace and how to integrate it into the UI components.

## Database Schema

The following tables have been created in Supabase to store marketplace card data:

### 1. **analysts** table
Stores financial analyst information.

**Columns:**
- `id` (TEXT, PRIMARY KEY)
- `name` (TEXT)
- `avatar` (TEXT)
- `company` (TEXT)
- `role` (TEXT)
- `rating` (TEXT)
- `followers` (TEXT)
- `publications` (TEXT)
- `markets` (TEXT)
- `assets` (TEXT)
- `analysis` (TEXT)
- `forecast_accuracy` (TEXT)
- `featured` (BOOLEAN)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### 2. **investment_consultants** table
Stores investment consultant profiles.

**Columns:**
- `id` (TEXT, PRIMARY KEY)
- `name` (TEXT)
- `credentials` (TEXT)
- `avatar` (TEXT)
- `company` (TEXT)
- `location` (TEXT)
- `nationwide` (BOOLEAN)
- `description` (TEXT)
- `clients` (TEXT)
- `risk_level` (TEXT)
- `aum` (TEXT)
- `portfolio_return` (TEXT)
- `featured` (BOOLEAN)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### 3. **traders** table
Stores trader information.

**Columns:**
- `id` (TEXT, PRIMARY KEY)
- `name` (TEXT)
- `avatar` (TEXT)
- `badge` (TEXT)
- `followers` (TEXT)
- `publications` (TEXT)
- `trades_30_days` (TEXT)
- `experience` (TEXT)
- `roi_month` (TEXT)
- `roi_quarter` (TEXT)
- `avg_profitability` (TEXT)
- `accuracy` (TEXT)
- `certification` (TEXT)
- `rating` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### 4. **signals** table
Stores trading signal information.

**Columns:**
- `id` (TEXT, PRIMARY KEY)
- `name` (TEXT)
- `icon` (TEXT)
- `users` (TEXT)
- `risk_level` (TEXT)
- `platforms` (TEXT ARRAY)
- `assets` (TEXT ARRAY)
- `type` (TEXT)
- `timeframes` (TEXT ARRAY)
- `use` (TEXT)
- `accuracy` (TEXT)
- `chart_image` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### 5. **strategies** table
Stores trading strategy information.

**Columns:**
- `id` (TEXT, PRIMARY KEY)
- `name` (TEXT)
- `icon` (TEXT)
- `users` (TEXT)
- `risk_level` (TEXT)
- `profit_sharing` (TEXT)
- `exchanges` (TEXT ARRAY)
- `exchanges_count` (INTEGER)
- `assets` (TEXT ARRAY)
- `strategy` (TEXT)
- `max_drawdown` (TEXT)
- `min_capital` (TEXT)
- `roi_30d` (TEXT)
- `roi_1y` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### 6. **trading_robots** table
Stores trading robot/bot information.

**Columns:**
- `id` (TEXT, PRIMARY KEY)
- `name` (TEXT)
- `icon` (TEXT)
- `users` (TEXT)
- `accuracy_label` (TEXT)
- `accuracy_level` (TEXT)
- `profit_sharing` (TEXT)
- `exchanges` (JSONB) - Array of exchange objects with id, name, icon
- `pair` (TEXT)
- `max_drawdown` (TEXT)
- `market` (TEXT)
- `asset_tags` (TEXT ARRAY)
- `strategy` (TEXT)
- `settings_tag` (TEXT)
- `roi_30d` (TEXT)
- `roi_90d` (TEXT)
- `roi_1y` (TEXT)
- `automation_style` (TEXT)
- `market_category` (TEXT)
- `leverage_category` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### 7. **courses** table
Stores course and training material information.

**Columns:**
- `id` (TEXT, PRIMARY KEY)
- `title` (TEXT)
- `subtitle` (TEXT)
- `image` (TEXT)
- `host` (TEXT)
- `students` (TEXT)
- `rating` (TEXT)
- `duration` (TEXT)
- `lectures` (TEXT)
- `level` (TEXT)
- `level_category` (TEXT)
- `material_type` (TEXT)
- `release_window` (TEXT)
- `format` (TEXT)
- `focus_area` (TEXT)
- `language` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### 8. **script_products** table
Stores script and software products.

**Columns:**
- `id` (TEXT, PRIMARY KEY)
- `title` (TEXT)
- `description` (TEXT)
- `hero_image` (TEXT)
- `hero_alt` (TEXT)
- `type_label` (TEXT)
- `industry_label` (TEXT)
- `revenue_label` (TEXT)
- `purchases` (TEXT)
- `views` (TEXT)
- `creator_name` (TEXT)
- `creator_avatar` (TEXT)
- `creator_followers` (TEXT)
- `creator_tags` (TEXT ARRAY)
- `location` (TEXT)
- `verification_label` (TEXT)
- `compatibility` (TEXT ARRAY)
- `requirements` (TEXT ARRAY)
- `rating_score` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### 9. **other_products** table
Stores miscellaneous products and services.

**Columns:**
- `id` (TEXT, PRIMARY KEY)
- `title` (TEXT)
- `description` (TEXT)
- `image` (TEXT)
- `image_alt` (TEXT)
- `label` (TEXT)
- `location` (TEXT)
- `rating` (TEXT)
- `rating_tag` (TEXT)
- `type_label` (TEXT)
- `industry_label` (TEXT)
- `compatibility` (TEXT ARRAY)
- `requirements` (TEXT ARRAY)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Data Migration Status

All existing data from the local data files has been migrated to the Supabase database:
- ✅ Analysts: 2 records migrated
- ✅ Investment Consultants: 6 records migrated
- ✅ Traders: 2 records migrated
- ✅ Signals: 2 records migrated
- ✅ Strategies: 4 records migrated
- ✅ Trading Robots: 4 records migrated
- ✅ Courses: 11 records migrated
- ✅ Script Products: 8 records migrated
- ✅ Other Products: 8 records migrated

## Using the Database Queries

### Available Functions

All query functions are available in `code/client/lib/supabaseQueries.ts`:

#### Fetch all records:
```typescript
import {
  getAnalysts,
  getInvestmentConsultants,
  getTraders,
  getSignals,
  getStrategies,
  getTradingRobots,
  getCourses,
  getScriptProducts,
  getOtherProducts,
} from "@/lib/supabaseQueries";

// Example usage
const analysts = await getAnalysts();
const signals = await getSignals();
const courses = await getCourses();
```

#### Fetch single record by ID:
```typescript
import {
  getAnalystById,
  getSignalById,
  getStrategyById,
  getTradingRobotById,
  getCourseById,
  getScriptProductById,
  getOtherProductById,
} from "@/lib/supabaseQueries";

// Example usage
const analyst = await getAnalystById("analyst-sarah-lee");
const signal = await getSignalById("signal-risk-master");
```

## Integration Examples

### Example 1: Update MarketplaceMyProducts component

Replace static imports with database queries:

```typescript
// Before: Using static data
import { baseAnalysts } from "@/data/marketplaceAnalysts";
const analysts: Analyst[] = baseAnalysts;

// After: Using Supabase queries
import { getAnalysts } from "@/lib/supabaseQueries";

const [analysts, setAnalysts] = useState<Analyst[]>([]);

useEffect(() => {
  const fetchAnalysts = async () => {
    const data = await getAnalysts();
    setAnalysts(data);
  };
  fetchAnalysts();
}, []);
```

### Example 2: Update a detail page component

```typescript
import { useParams } from "react-router-dom";
import { getSignalById } from "@/lib/supabaseQueries";

const SignalDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [signal, setSignal] = useState<Signal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSignal = async () => {
      if (id) {
        const data = await getSignalById(id);
        setSignal(data);
      }
      setLoading(false);
    };
    fetchSignal();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!signal) return <div>Signal not found</div>;

  return <div>{/* Render signal details */}</div>;
};
```

## TypeScript Types

All types are available in `code/client/data/marketplaceTypes.ts`:

```typescript
import type {
  Analyst,
  InvestmentConsultant,
  Trader,
  Signal,
  Strategy,
  TradingRobot,
  Course,
  ScriptProduct,
  OtherProduct,
  MarketplaceCategory,
} from "@/data/marketplaceTypes";
```

## Performance Considerations

- **Caching**: Consider implementing caching with React Query or SWR for frequently accessed data
- **Pagination**: For large datasets, implement pagination using Supabase's `.limit()` and `.range()` functions
- **Error Handling**: All query functions return empty arrays or null on error to prevent crashes
- **Fallback**: If Supabase is not configured, queries gracefully return empty data

## Next Steps

1. Update `code/client/pages/MarketplaceMyProducts.tsx` to use database queries
2. Update individual detail pages to fetch data by ID
3. Update category listing pages to use appropriate query functions
4. Implement search and filtering using Supabase queries
5. Add RLS (Row Level Security) policies if user-specific data is needed

## Backward Compatibility

The original local data files remain unchanged, so you can gradually migrate components to use the database while keeping the old components functional.
