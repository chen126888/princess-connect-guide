import React from 'react';
import Card from '../Common/Card';
import YoutubeChannelsSection from './YoutubeChannelsSection';
import { clanBattleConfigs } from '../../clanBattleData/clanBattleConfigs';

const Introduction: React.FC = () => {
  const config = clanBattleConfigs;

  return (
    <>
      <Card className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">戰隊戰簡介</h2>
        <div className="text-gray-700 leading-relaxed space-y-3">
          <p>戰隊戰共有四個階段，難度隨階段升高。每位成員每日可消耗300體力出刀一次，最多三次。若王在戰鬥中陣亡，可獲得補償刀（剩餘時間+30秒）。</p>
          <p>戰隊戰需從第一階段開始挑戰，隨著進度推進，階段會逐漸升高。高階段能獲得更高分數，但難度也隨之增加。對於未滿等的新手玩家，建議在戰隊戰初期盡早參與，協助戰隊推進度。</p>
          <p>若戰隊迅速進入高階段（如第四階段），而新手難以應對時，可考慮調整至適合自身練度的階段進行挑戰。一般而言，若在第四階段單刀傷害未能達到5000萬，則建議轉為挑戰兩刀第三階段的王(一刀殺王，獲得的補償刀再殺一次)，通常能獲得更高總分。以此類推，若第三階段難以應對，則可考慮挑戰第二階段。</p>
          <p><strong>建議等級參考 (個人猜測)：</strong></p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>一階王：建議等級 100 以上</li>
            <li>二階王：建議等級 200 以上</li>
            <li>三階王：建議等級 250 以上</li>
            <li>四階王：建議等級 300 以上（可嘗試挑戰）</li>
          </ul>
        </div>
      </Card>

      {config.youtubeChannels && config.youtubeChannels.length > 0 && (
        <YoutubeChannelsSection channels={config.youtubeChannels} />
      )}
    </>
  );
};

export default Introduction;