import { FC, useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { UserStatsWithCalculations } from '@/hooks/useUserStatistics';
import { calculateTotalXP, getCurrentLevel } from '@/lib/xpCalculations';

interface AdminStatsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stats: UserStatsWithCalculations | null;
  onSave: (stats: any) => Promise<void>;
  loading?: boolean;
}

export const AdminStatsModal: FC<AdminStatsModalProps> = ({
  open,
  onOpenChange,
  stats,
  onSave,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    likes_count: stats?.likes_count || 0,
    comments_count: stats?.comments_count || 0,
    views_count: stats?.views_count || 0,
    favorites_count: stats?.favorites_count || 0,
    paid_posts: stats?.paid_posts || 0,
    bought_posts: stats?.bought_posts || 0,
    sold_posts: stats?.sold_posts || 0,
    followers_count: stats?.followers_count || 0,
    following_count: stats?.following_count || 0,
    items_for_sale: stats?.items_for_sale || 0,
    items_sold: stats?.items_sold || 0,
    items_bought: stats?.items_bought || 0,
  });

  // Calculate preview of XP and level
  const preview = useMemo(() => {
    const totalXP = calculateTotalXP(formData);
    const levelInfo = getCurrentLevel(totalXP);
    return { totalXP, levelInfo };
  }, [formData]);

  const handleInputChange = (field: string, value: string) => {
    const numValue = Math.max(0, parseInt(value) || 0);
    setFormData((prev) => ({
      ...prev,
      [field]: numValue,
    }));
  };

  const handleSave = async () => {
    try {
      await onSave(formData);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to save statistics:', error);
    }
  };

  const StatField: FC<{ label: string; field: string; description: string }> = ({
    label,
    field,
    description,
  }) => (
    <div className="grid gap-2">
      <label className="text-xs sm:text-sm font-medium text-white">{label}</label>
      <p className="text-xs text-[#B0B0B0]">{description}</p>
      <Input
        type="number"
        min="0"
        value={formData[field as keyof typeof formData]}
        onChange={(e) => handleInputChange(field, e.target.value)}
        className="bg-[#0C1014] border-[#181B22] text-white"
        disabled={loading}
      />
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] bg-[#0C1014] border-[#181B22] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">User Statistics</DialogTitle>
          <DialogDescription className="text-[#B0B0B0]">
            Edit user statistics to calculate XP and level
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
          {/* Preview Section */}
          <div className="rounded-lg border border-[#181B22] bg-[#0C1014]/50 p-4">
            <h3 className="text-sm font-semibold text-white mb-3">Preview</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-[#B0B0B0]">Total XP</p>
                <p className="text-lg font-bold text-[#A0FF75]">{preview.totalXP}</p>
              </div>
              <div>
                <p className="text-xs text-[#B0B0B0]">Level</p>
                <p className="text-lg font-bold text-white">{preview.levelInfo.level}</p>
              </div>
              <div>
                <p className="text-xs text-[#B0B0B0]">Title</p>
                <p className="text-lg font-bold text-[#A06AFF]">{preview.levelInfo.name}</p>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-xs text-[#B0B0B0] mb-2">Progress to next level</p>
              <div className="h-2 bg-[#181B22] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#A06AFF] rounded-full transition-all"
                  style={{ width: `${preview.levelInfo.progressPercent}%` }}
                />
              </div>
              <p className="text-xs text-[#B0B0B0] mt-1">{preview.levelInfo.progressPercent}%</p>
            </div>
          </div>

          {/* Posts Section */}
          <div className="grid gap-4">
            <h3 className="text-sm font-semibold text-white">Post Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <StatField
                label="Likes Count"
                field="likes_count"
                description="Total likes on posts"
              />
              <StatField
                label="Comments Count"
                field="comments_count"
                description="Total comments on posts"
              />
              <StatField
                label="Views Count"
                field="views_count"
                description="Total post views"
              />
              <StatField
                label="Favorites Count"
                field="favorites_count"
                description="Times added to favorites"
              />
              <StatField
                label="Paid Posts"
                field="paid_posts"
                description="Paid posts published"
              />
              <StatField
                label="Bought Posts"
                field="bought_posts"
                description="Posts purchased"
              />
              <StatField
                label="Sold Posts"
                field="sold_posts"
                description="Posts sold"
              />
            </div>
          </div>

          {/* Profile Section */}
          <div className="grid gap-4">
            <h3 className="text-sm font-semibold text-white">Profile Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <StatField
                label="Followers"
                field="followers_count"
                description="Number of followers"
              />
              <StatField
                label="Following"
                field="following_count"
                description="Number of accounts following"
              />
            </div>
          </div>

          {/* Commerce Section */}
          <div className="grid gap-4">
            <h3 className="text-sm font-semibold text-white">Commerce Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <StatField
                label="Items for Sale"
                field="items_for_sale"
                description="Active items for sale"
              />
              <StatField
                label="Items Sold"
                field="items_sold"
                description="Total items sold"
              />
              <StatField
                label="Items Bought"
                field="items_bought"
                description="Total items purchased"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 text-sm font-semibold text-[#B0B0B0] border border-[#181B22] rounded-xl hover:border-[#1F2230] hover:text-white transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-semibold text-white bg-[#A06AFF] rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
