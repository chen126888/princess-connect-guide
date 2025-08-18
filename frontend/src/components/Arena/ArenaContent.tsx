import React from 'react';
import Card from '../Common/Card';
import TeamLineup from '../Common/TeamLineup';
import type { Character } from '../../types';
import type { ArenaType, ArenaSection as ArenaSectionType, ArenaItem as ArenaItemType, ArenaSubsection } from '../../types/arena';
import { arenaConfigs } from '../../arenaData';
import CharacterImageCard from '../Character/CharacterImageCard';

interface ArenaContentProps {
  activeType: ArenaType;
  characters: Character[];
  loading: boolean;
}

const PriorityBadge: React.FC<{ priority?: 'high' | 'medium' | 'low' }> = ({ priority }) => {
  if (!priority) return null;

  const configs = {
    high: { label: '重要', className: 'bg-red-100 text-red-800 border-red-200' },
    medium: { label: '建議', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    low: { label: '可選', className: 'bg-gray-100 text-gray-800 border-gray-200' }
  };

  const config = configs[priority];

  return (
    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded border ${config.className}`}>
      {config.label}
    </span>
  );
};

const ArenaItem: React.FC<{ item: ArenaItemType }> = ({ item }) => (
  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
    <div className="flex items-start justify-between mb-2">
      <h5 className="font-medium text-gray-800">{item.name}</h5>
      <PriorityBadge priority={item.priority} />
    </div>
    <p className="text-sm text-gray-600">{item.description}</p>
  </div>
);

const renderNewlines = (text: string) => {
  return { __html: text.replace(/\n/g, '<br />') };
};

const RecommendedCharacters: React.FC<{ 
  characters: Character[], 
  names: (string | string[])[], 
  title: string,
  isTeamLineup?: boolean 
}> = ({ characters, names, title, isTeamLineup = false }) => {
  if (names.length === 0) return null;

  // 將 (string | string[])[] 轉換為 string[]，處理可選角色
  const processCharacterNames = (names: (string | string[])[]): string[] => {
    return names.map(nameOrChoice => {
      if (typeof nameOrChoice === 'string') {
        return nameOrChoice;
      } else {
        // 對於選擇性角色，用 "/" 連接
        return nameOrChoice.join('/');
      }
    });
  };

  // 判斷是否應該使用 TeamLineup（通常是陣容推薦）
  const shouldUseTeamLineup = isTeamLineup || 
    title.includes('隊伍') || 
    title.includes('陣容') || 
    title.includes('第一隊') || 
    title.includes('第二隊') || 
    title.includes('通用隊伍') ||
    title.includes('進攻') ||
    title.includes('防守');

  if (shouldUseTeamLineup) {
    // 使用新的 TeamLineup 組件顯示完整陣容
    const characterNames = processCharacterNames(names);
    const bgColor = title.includes('進攻') ? 'bg-red-50' : 
                   title.includes('防守') ? 'bg-blue-50' :
                   title.includes('第一隊') ? 'bg-green-50' :
                   title.includes('第二隊') ? 'bg-purple-50' :
                   'bg-gray-50';
    
    const textColor = title.includes('進攻') ? 'text-red-800' : 
                     title.includes('防守') ? 'text-blue-800' :
                     title.includes('第一隊') ? 'text-green-800' :
                     title.includes('第二隊') ? 'text-purple-800' :
                     'text-gray-800';

    return (
      <div className="mt-4">
        <TeamLineup 
          characterNames={characterNames}
          bgColor={bgColor}
          textColor={textColor}
        />
      </div>
    );
  } else {
    // 使用原有的個別角色顯示方式（適合角色推薦列表）
    return (
      <div className="mt-4">
        <div className="flex flex-wrap gap-2 items-center">
          {names.map((nameOrChoice, index) => {
            if (typeof nameOrChoice === 'string') {
              // 優先精確匹配角色名稱，再匹配暱稱
              const char = characters.find(c => c.角色名稱 === nameOrChoice) || 
                          characters.find(c => c.暱稱 && c.暱稱.includes(nameOrChoice));
              return char ? <CharacterImageCard key={char.id} character={char} /> : null;
            } else {
              // 對於選擇性角色，同樣優先精確匹配角色名稱
              const char1 = characters.find(c => c.角色名稱 === nameOrChoice[0]) || 
                           characters.find(c => c.暱稱 && c.暱稱.includes(nameOrChoice[0]));
              const char2 = characters.find(c => c.角色名稱 === nameOrChoice[1]) || 
                           characters.find(c => c.暱稱 && c.暱稱.includes(nameOrChoice[1]));
              
              if (!char1 && !char2) return null;

              return (
                <div key={`choice-${index}`} className="flex items-center gap-1">
                  {char1 && <CharacterImageCard character={char1} />}
                  {char1 && char2 && <span className="text-gray-600 text-sm font-bold mx-1">或</span>}
                  {char2 && <CharacterImageCard character={char2} />}
                </div>
              );
            }
          })}
        </div>
      </div>
    );
  }
};

const ArenaSection: React.FC<{ section: ArenaSectionType, allCharacters: Character[] }> = ({ section, allCharacters }) => (
  <Card className="mb-6">
    <h3 className="text-xl font-bold text-gray-800 mb-3">{section.title}</h3>
    <p className="text-gray-600 mb-4" dangerouslySetInnerHTML={renderNewlines(section.description)}></p>

    {section.recommendedCharacters && (
      <RecommendedCharacters 
        characters={allCharacters} 
        names={section.recommendedCharacters} 
        title={section.title}
      />
    )}
    
    {section.items && section.items.length > 0 && (
      <div className="space-y-3 mb-4 pt-4 border-t border-gray-200 mt-4">
        {section.items.map((item, index) => (
          <ArenaItem key={index} item={item} />
        ))}
      </div>
    )}
    
    {section.subsections && section.subsections.length > 0 && (
      <div className="space-y-4 pt-4 border-t border-gray-200 mt-4">
        {section.subsections.map((subsection, index) => (
          <div key={index} className="">
            <h4 className="text-lg font-semibold text-gray-800 mb-2">{subsection.title}</h4>
            <p className="text-gray-600 mb-3" dangerouslySetInnerHTML={renderNewlines(subsection.description)}></p>
            {subsection.recommendedCharacters && (
              <RecommendedCharacters 
                characters={allCharacters} 
                names={subsection.recommendedCharacters} 
                title={subsection.title}
              />
            )}
            {subsection.items && subsection.items.length > 0 && (
              <div className="space-y-2 mt-3">
                {subsection.items.map((item, itemIndex) => (
                  <ArenaItem key={itemIndex} item={item} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    )}
  </Card>
);

const ArenaContent: React.FC<ArenaContentProps> = ({ activeType, characters, loading }) => {
  const config = arenaConfigs[activeType];
  
  if (!config) {
    return (
      <Card>
        <div className="text-center py-8">
          <div className="text-6xl mb-4">❓</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">內容載入失敗</h2>
          <p className="text-gray-600">無法找到對應的內容配置</p>
        </div>
      </Card>
    );
  }

  if (loading) {
    return <Card><div className="text-center p-8">正在載入角色資料...</div></Card>;
  }

  return (
    <div className="space-y-6">
      {/* 標題區域 */}
      { (config.content.title || config.description) && (
        <Card>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-3">{config.content.title}</h1>
            <p className="text-lg text-gray-600">{config.description}</p>
          </div>
        </Card>
      )}
      
      {/* 內容區域 */}
      {config.content.sections.map((section, index) => (
        <ArenaSection key={index} section={section} allCharacters={characters} />
      ))}
    </div>
  );
};

export default ArenaContent;



