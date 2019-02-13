import {onThemeChange, onThemeInit, onShowCustomThemeView} from './theme';
import {onRefreshPopular, onLoadMorePopular, onFlushPopularFavorite} from './popular';
import {onRefreshTrending, onLoadMoreTrending, onFlushTrendingFavorite} from './trending';
import {onLoadFavoriteData} from './favorite';
import {onLoadLanguage} from './language';

export default {
  onThemeChange,
  onThemeInit,
  onShowCustomThemeView,
  onRefreshPopular,
  onLoadMorePopular,
  onRefreshTrending,
  onLoadMoreTrending,
  onLoadFavoriteData,
  onFlushPopularFavorite,
  onFlushTrendingFavorite,
  onLoadLanguage
}
