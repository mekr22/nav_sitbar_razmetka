export const LEVEL_THRESHOLDS = [
  { level: 1, xp: 0, name: 'Newbie' },
  { level: 2, xp: 100, name: 'Explorer' },
  { level: 3, xp: 300, name: 'Contributor' },
  { level: 4, xp: 600, name: 'Creator' },
  { level: 5, xp: 1000, name: 'Influencer' },
  { level: 6, xp: 1700, name: 'Expert' },
  { level: 7, xp: 2500, name: 'Guru' },
  { level: 8, xp: 3500, name: 'Gold Member' },
  { level: 9, xp: 5000, name: 'Platinum Elite' },
  { level: 10, xp: 7000, name: 'Legend' },
];

export interface UserStatistics {
  likes_count: number;
  comments_count: number;
  views_count: number;
  favorites_count: number;
  paid_posts: number;
  bought_posts: number;
  sold_posts: number;
  followers_count: number;
  following_count: number;
  items_for_sale: number;
  items_sold: number;
  items_bought: number;
}

export function calculateTotalXP(stats: UserStatistics): number {
  let totalXP = 0;

  // Лайк на посте: √1 XP за 2 лайка
  totalXP += Math.sqrt(1 * (stats.likes_count / 2));

  // Комментарий: √2 XP за комментарий
  totalXP += Math.sqrt(2 * stats.comments_count);

  // Просмотр: √1 XP за 20 просмотров
  totalXP += Math.sqrt(1 * (stats.views_count / 20));

  // В избранном: √3 XP за добавление
  totalXP += Math.sqrt(3 * stats.favorites_count);

  // Новый подписчик: √5 XP за подписчика
  totalXP += Math.sqrt(5 * stats.followers_count);

  // Новая подписка: √1 XP за подписку
  totalXP += Math.sqrt(1 * stats.following_count);

  // Выставил платный пост: √10 XP за пост
  totalXP += Math.sqrt(10 * stats.paid_posts);

  // Купил пост: √15 XP за покупку
  totalXP += Math.sqrt(15 * stats.bought_posts);

  // Продал пост: √25 XP за продажу
  totalXP += Math.sqrt(25 * stats.sold_posts);

  // Выставил товар: √5 XP за товар
  totalXP += Math.sqrt(5 * stats.items_for_sale);

  // Продал товар: √30 XP за продажу
  totalXP += Math.sqrt(30 * stats.items_sold);

  // Купил товар: √10 XP за покупку
  totalXP += Math.sqrt(10 * stats.items_bought);

  return Math.floor(totalXP);
}

export function getCurrentLevel(totalXP: number): {
  level: number;
  name: string;
  nextLevelXP: number;
  currentLevelXP: number;
  progressPercent: number;
} {
  let currentLevel = LEVEL_THRESHOLDS[0];
  let nextLevel = LEVEL_THRESHOLDS[1];

  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalXP >= LEVEL_THRESHOLDS[i].xp) {
      currentLevel = LEVEL_THRESHOLDS[i];
      nextLevel = LEVEL_THRESHOLDS[i + 1] || LEVEL_THRESHOLDS[i];
      break;
    }
  }

  const currentLevelXP = currentLevel.xp;
  const nextLevelXP = nextLevel.xp;
  const xpInCurrentLevel = totalXP - currentLevelXP;
  const xpNeededForNextLevel = nextLevelXP - currentLevelXP;
  const progressPercent =
    xpNeededForNextLevel > 0
      ? Math.min(100, (xpInCurrentLevel / xpNeededForNextLevel) * 100)
      : 100;

  return {
    level: currentLevel.level,
    name: currentLevel.name,
    nextLevelXP: nextLevelXP,
    currentLevelXP: currentLevelXP,
    progressPercent: Math.round(progressPercent),
  };
}
