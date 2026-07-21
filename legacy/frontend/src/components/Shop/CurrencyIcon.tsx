import React from 'react';
import { Coins, Sword, Crown, Shield, Star, Gem, Sparkles } from 'lucide-react';
import type { Currency } from '../../types/shop';

interface CurrencyIconProps {
  currency: Currency;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const CurrencyIcon: React.FC<CurrencyIconProps> = ({ 
  currency, 
  size = 'md', 
  showLabel = false,
  className = '' 
}) => {
  const getCurrencyConfig = (currency: Currency) => {
    const configs = {
      dungeon_coin: {
        icon: <Coins className={getIconSize(size)} />,
        label: '地下城幣',
        color: 'text-orange-600'
      },
      arena_coin: {
        icon: <Sword className={getIconSize(size)} />,
        label: '競技場幣',
        color: 'text-red-600'
      },
      p_arena_coin: {
        icon: <Crown className={getIconSize(size)} />,
        label: '公主競技場幣',
        color: 'text-purple-600'
      },
      clan_coin: {
        icon: <Shield className={getIconSize(size)} />,
        label: '戰隊幣',
        color: 'text-blue-600'
      },
      master_coin: {
        icon: <Star className={getIconSize(size)} />,
        label: '大師幣',
        color: 'text-yellow-600'
      },
      goddess_stone: {
        icon: <Sparkles className={getIconSize(size)} />,
        label: '女神的祕石',
        color: 'text-pink-600'
      },
      mana: {
        icon: <Gem className={getIconSize(size)} />,
        label: '瑪那',
        color: 'text-blue-500'
      },
      jewel: {
        icon: <Gem className={getIconSize(size)} />,
        label: '寶石',
        color: 'text-green-600'
      }
    };
    return configs[currency];
  };

  function getIconSize(size: 'sm' | 'md' | 'lg'): string {
    const sizes = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    };
    return sizes[size];
  }

  const config = getCurrencyConfig(currency);

  return (
    <div className={`inline-flex items-center gap-1 ${config.color} ${className}`}>
      {config.icon}
      {showLabel && (
        <span className={`font-medium ${size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm'}`}>
          {config.label}
        </span>
      )}
    </div>
  );
};

export default CurrencyIcon;