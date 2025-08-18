import React from 'react';
import type { ActiveTab } from './CharacterDevelopmentTabs';

interface CharacterDevelopmentDescriptionProps {
  activeTab: ActiveTab;
}

const CharacterDevelopmentDescription: React.FC<CharacterDevelopmentDescriptionProps> = ({
  activeTab
}) => {
  const tabDescriptions: Record<ActiveTab, string> = {
    sixStar: '以下為筆者按自己觀點排的，僅供參考，主要以純新手為主，其中角色排序已獲取難度、開花難度為優先考量點，以常駐和FES角色為主，故有些角色雖六星強力，但因獲取難度高，排序較後。此表確保新手在初期階段優先培養基本坦克、補師、輸出 ，確保推圖、活動、露娜塔能順利進行，以穩定獲得資源+鑽石。回鍋及較高等玩家，若不知道該養成哪隻，請多參考戰隊戰/深域/專一/專二表，及其他網路資源/未來視，作為自身養成順序。',
    unique1: '此表參考日服(部分角色專武台服尚未實裝)，為開專優先順序，非專武升高順序，不考慮對應碎片關卡打不過或無法開花的情況。',
    unique2: '此表參考日服(部分角色專武台服尚未實裝)，為開專優先順序，非專武升高順序，不考慮對應碎片關卡打不過或無法開花的情況。',
    nonSixStar: '以下是筆者自己認為非六星且常駐可刷或可換的角色，這些也是都有用處。'
  };

  const sixStarSpecificDescription = '筆者認為此表A級以上基本都用的到，除了望、吉塔、嘉夜在深域較少見，其他在滿等之後還是常用到，就算戰隊戰沒用到，深域及抄業都有不少上場空間。\n雖說新角色越來越多，但中期深域關卡，基本沒人再繼續更新過關隊伍，尤其4~5的道中，沒有默涅隊可用，有這些角色對於懶得試隊伍的人，抄作業上有很大幫助。\n此表角色都有專用武器一，專一都需要開，是否升上去，取決於是否輸出。';

  const unique1SpecificDescription = '此表A以上皆為常用到的，為建議開專順序，有部分角色為競技場角色，可考慮將優先順序往後延，至於輸出角色的專武優先升高哪隻，請依自身情況考量。';

  const unique2SpecificDescription = '有部分角色為競技場角色，可考慮將優先順序往後延，輸出角色的專武優先升高。';

  const nonSixStarSpecificDescription = '以下不一定都要五星，個人認為開專>五星，如果使用上會暴斃，再考慮升星。(個人只有碧(工作服/插班生)有五星)';

  return (
    <>
      {/* Main Description Box */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg shadow-sm text-sm">
        <p>{tabDescriptions[activeTab]}</p>
      </div>

      {/* Tab-specific Description Boxes */}
      {activeTab === 'sixStar' && (
        <div className="mb-6 p-4 bg-gray-100 border border-gray-200 text-gray-800 rounded-lg shadow-sm text-sm">
          {sixStarSpecificDescription.split('\n').map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      )}

      {activeTab === 'unique1' && (
        <div className="mb-6 p-4 bg-gray-100 border border-gray-200 text-gray-800 rounded-lg shadow-sm text-sm">
          <p>{unique1SpecificDescription}</p>
        </div>
      )}

      {activeTab === 'unique2' && (
        <div className="mb-6 p-4 bg-gray-100 border border-gray-200 text-gray-800 rounded-lg shadow-sm text-sm">
          <p>{unique2SpecificDescription}</p>
        </div>
      )}

      {activeTab === 'nonSixStar' && (
        <div className="mb-6 p-4 bg-gray-100 border border-gray-200 text-gray-800 rounded-lg shadow-sm text-sm">
          <p>{nonSixStarSpecificDescription}</p>
        </div>
      )}
    </>
  );
};

export default CharacterDevelopmentDescription;