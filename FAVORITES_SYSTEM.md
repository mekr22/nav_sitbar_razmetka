# User Favorites System Documentation

## Overview

The favorites system allows authenticated users to save their favorite marketplace products (analysts, signals, courses, etc.) to their Supabase profile. All favorites are stored in the `user_favorites` table and can be viewed on the `/marketplace/favourites` page.

## Database Structure

### `user_favorites` Table

Stores the relationship between users and their favorite products.

**Columns:**
- `id` (BIGINT, PRIMARY KEY) - Auto-incremented identifier
- `user_id` (UUID) - References `auth.users(id)`, cascade delete
- `product_type` (TEXT) - Type of product (analyst, signal, course, etc.)
- `product_id` (TEXT) - ID of the product
- `created_at` (TIMESTAMP) - When the favorite was added

**Unique Constraint:** `(user_id, product_type, product_id)` - Prevents duplicate favorites

**Indexes:**
- `idx_user_favorites_user_id` - For fast user lookups
- `idx_user_favorites_product` - For fast product lookups

## Available Product Types

```typescript
type ProductType =
  | "analyst"
  | "investment-consultant"
  | "trader"
  | "signal"
  | "strategy"
  | "trading-robot"
  | "course"
  | "script"
  | "other";
```

## API Functions

### In `code/client/lib/supabaseFavorites.ts`

#### 1. `addFavorite(userId: string, productType: ProductType, productId: string): Promise<boolean>`

Adds a product to user's favorites.

```typescript
import { addFavorite } from "@/lib/supabaseFavorites";

const success = await addFavorite(userId, "signal", "signal-risk-master");
```

#### 2. `removeFavorite(userId: string, productType: ProductType, productId: string): Promise<boolean>`

Removes a product from user's favorites.

```typescript
import { removeFavorite } from "@/lib/supabaseFavorites";

const success = await removeFavorite(userId, "signal", "signal-risk-master");
```

#### 3. `toggleFavorite(userId: string, productType: ProductType, productId: string): Promise<boolean>`

Toggles favorite status (adds if not favorited, removes if favorited).

```typescript
import { toggleFavorite } from "@/lib/supabaseFavorites";

const success = await toggleFavorite(userId, "signal", "signal-risk-master");
```

#### 4. `checkFavorite(userId: string, productType: ProductType, productId: string): Promise<boolean>`

Checks if a product is in user's favorites.

```typescript
import { checkFavorite } from "@/lib/supabaseFavorites";

const isFav = await checkFavorite(userId, "signal", "signal-risk-master");
```

#### 5. `getUserFavoriteIds(userId: string, productType?: ProductType): Promise<Set<string>>`

Gets all favorite product IDs for a user (optionally filtered by type).

```typescript
import { getUserFavoriteIds } from "@/lib/supabaseFavorites";

const favorites = await getUserFavoriteIds(userId, "signal");
```

#### 6. `getUserFavorites(userId: string): Promise<FavoriteProduct[]>`

Gets all favorite products with full data for a user.

```typescript
import { getUserFavorites } from "@/lib/supabaseFavorites";

const favorites = await getUserFavorites(userId);
// Returns: Array of products with type information
```

## React Hooks

### In `code/client/hooks/useFavorite.ts`

#### 1. `useFavorite(productType: ProductType, productId: string)`

Hook for managing favorite status of a single product. Automatically loads current user and checks favorite status.

**Returns:**
- `isFavorite: boolean` - Current favorite status
- `loading: boolean` - Loading state
- `toggle: () => Promise<void>` - Function to toggle favorite
- `userId: string | null` - Current user ID

**Example:**
```typescript
import { useFavorite } from "@/hooks/useFavorite";

function SignalCard({ signal }) {
  const { isFavorite, loading, toggle } = useFavorite("signal", signal.id);

  return (
    <div>
      <button onClick={toggle} disabled={loading}>
        {isFavorite ? "★" : "☆"} Add to Favorites
      </button>
    </div>
  );
}
```

#### 2. `useFavoriteMultiple(productType?: ProductType)`

Hook for managing multiple favorites (e.g., a page with many products).

**Returns:**
- `favorites: Set<string>` - Set of `"type:id"` favorite identifiers
- `isFavorite(type, id): boolean` - Check if product is favorited
- `loading: boolean` - Loading state
- `toggle(type, id): Promise<void>` - Function to toggle favorite
- `userId: string | null` - Current user ID

**Example:**
```typescript
import { useFavoriteMultiple } from "@/hooks/useFavorite";

function SignalsList({ signals }) {
  const { isFavorite, toggle, loading } = useFavoriteMultiple("signal");

  return (
    <div>
      {signals.map((signal) => (
        <div key={signal.id}>
          <button 
            onClick={() => toggle("signal", signal.id)}
            disabled={loading}
          >
            {isFavorite("signal", signal.id) ? "★" : "☆"}
          </button>
          <p>{signal.name}</p>
        </div>
      ))}
    </div>
  );
}
```

## Integration Examples

### Example 1: Using with MarketplaceMyProducts

```typescript
import { useFavoriteMultiple } from "@/hooks/useFavorite";

function MarketplaceMyProducts() {
  const { isFavorite, toggle } = useFavoriteMultiple();
  
  return (
    <SignalCard
      signal={signal}
      isFavorite={isFavorite("signal", signal.id)}
      onToggleFavorite={() => toggle("signal", signal.id)}
    />
  );
}
```

### Example 2: Using with FavoriteStarButton

```typescript
import FavoriteStarButton from "@/components/marketplace/FavoriteStarButton";
import { useFavorite } from "@/hooks/useFavorite";

function MyComponent({ productId }) {
  const { isFavorite, toggle } = useFavorite("signal", productId);

  return (
    <FavoriteStarButton
      pressed={isFavorite}
      onToggle={toggle}
    />
  );
}
```

### Example 3: Using with Favourites Page

The `/marketplace/favourites` page uses `getUserFavorites()` to fetch all user's favorites:

```typescript
import { getUserFavorites } from "@/lib/supabaseFavorites";

useEffect(() => {
  const loadFavorites = async () => {
    const userFavorites = await getUserFavorites(user.id);
    // Display favorites
  };
  loadFavorites();
}, []);
```

## Security & Row Level Security (RLS)

Currently, the `user_favorites` table allows any authenticated user to see their own favorites. To implement proper RLS:

```sql
-- Enable RLS
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- Users can view their own favorites
CREATE POLICY "Users can view own favorites"
  ON user_favorites
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own favorites
CREATE POLICY "Users can insert own favorites"
  ON user_favorites
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own favorites
CREATE POLICY "Users can delete own favorites"
  ON user_favorites
  FOR DELETE
  USING (auth.uid() = user_id);
```

## Best Practices

1. **Always check userId**: Before allowing favorite operations, ensure user is authenticated
2. **Handle errors gracefully**: All functions return boolean or null on error
3. **Use hooks for components**: Prefer hooks over direct function calls in React components
4. **Cache favorites**: Use `useFavoriteMultiple` for pages with many products to avoid repeated queries
5. **Debounce toggle**: Consider debouncing rapid toggle clicks to prevent race conditions

## Troubleshooting

### User's favorites not loading?
- Check if user is authenticated: `await supabase.auth.getUser()`
- Verify `user_id` matches in the database
- Check browser console for errors

### Favorites not persisting?
- Ensure Supabase is configured with environment variables
- Check network tab for failed requests
- Verify user has proper permissions in RLS policies

### Performance issues?
- Use `useFavoriteMultiple` instead of individual `useFavorite` hooks
- Consider pagination for large favorite lists
- Add indexes on frequently queried columns
