#!/bin/bash

API_BASE="http://localhost:3000/api"

echo "開始匯入資料..."

# 1. 競技場常用角色
echo "匯入競技場常用角色..."
characters=("新年怜" "闇姊姊" "嘉夜" "祈梨" "布丁" "紡希" "跳跳虎" "靜流&璃乃" "豬妹" "酒鬼" "步未" "雌小鬼" "若菜" "默涅" "公可" "真陽" "涅妃" "咲戀(夏日)" "妹弓" "霞" "魔霞" "愛梅斯" "凱留" "多娜" "厄" "雪" "涅比亞" "凱留(公主)" "泳裝EMT")

for char in "${characters[@]}"; do
  curl -s -X POST "$API_BASE/arena-common" \
    -H "Content-Type: application/json" \
    -d "{\"character_name\": \"$char\"}" > /dev/null
  echo "✅ 已新增競技場角色: $char"
done

# 2. 戰鬥試煉場角色 - 推薦練
echo "匯入戰鬥試煉場角色 - 推薦練..."
recommend_chars=("新年怜" "魔霞" "杏奈" "酒鬼" "咲戀(夏日)" "妹弓" "雪" "凱留" "祈梨" "吉塔" "公凱" "新年帆希" "步未" "厄" "姬騎士")

for char in "${recommend_chars[@]}"; do
  curl -s -X POST "$API_BASE/trial-characters" \
    -H "Content-Type: application/json" \
    -d "{\"character_name\": \"$char\", \"category\": \"推薦練\"}" > /dev/null
  echo "✅ 已新增試煉角色: $char (推薦練)"
done

# 3. 戰鬥試煉場角色 - 後期練
echo "匯入戰鬥試煉場角色 - 後期練..."
later_chars=("優妮" "聖誕姊法" "嘉夜" "新年姆咪")

for char in "${later_chars[@]}"; do
  curl -s -X POST "$API_BASE/trial-characters" \
    -H "Content-Type: application/json" \
    -d "{\"character_name\": \"$char\", \"category\": \"後期練\"}" > /dev/null
  echo "✅ 已新增試煉角色: $char (後期練)"
done

# 4. 六星優先度 - SS
echo "匯入六星優先度 - SS..."
ss_chars=("優花梨" "望")
for char in "${ss_chars[@]}"; do
  curl -s -X POST "$API_BASE/sixstar-priority" \
    -H "Content-Type: application/json" \
    -d "{\"character_name\": \"$char\", \"tier\": \"SS\"}" > /dev/null
  echo "✅ 已新增六星角色: $char (SS)"
done

# 5. 六星優先度 - S
echo "匯入六星優先度 - S..."
s_chars=("真步" "璃乃")
for char in "${s_chars[@]}"; do
  curl -s -X POST "$API_BASE/sixstar-priority" \
    -H "Content-Type: application/json" \
    -d "{\"character_name\": \"$char\", \"tier\": \"S\"}" > /dev/null
  echo "✅ 已新增六星角色: $char (S)"
done

# 6. 六星優先度 - AA
echo "匯入六星優先度 - AA..."
aa_chars=("吉塔" "步未" "凱留" "宮子" "克莉絲提娜" "栞" "霞" "矛依未" "怜(新年)")
for char in "${aa_chars[@]}"; do
  curl -s -X POST "$API_BASE/sixstar-priority" \
    -H "Content-Type: application/json" \
    -d "{\"character_name\": \"$char\", \"tier\": \"AA\"}" > /dev/null
  echo "✅ 已新增六星角色: $char (AA)"
done

# 7. 六星優先度 - A
echo "匯入六星優先度 - A..."
a_chars=("紡希" "純" "真陽" "可可蘿" "祈梨" "莫妮卡" "流夏" "真琴" "茉莉" "鈴莓" "可可蘿(夏日)" "斑比" "嘉夜" "杏奈" "伊莉亞")
for char in "${a_chars[@]}"; do
  curl -s -X POST "$API_BASE/sixstar-priority" \
    -H "Content-Type: application/json" \
    -d "{\"character_name\": \"$char\", \"tier\": \"A\"}" > /dev/null
  echo "✅ 已新增六星角色: $char (A)"
done

# 8. 六星優先度 - B
echo "匯入六星優先度 - B..."
b_chars=("亞里莎" "忍" "深月" "惠理子" "愛蜜莉雅" "雷姆" "拉姆" "鈴奈")
for char in "${b_chars[@]}"; do
  curl -s -X POST "$API_BASE/sixstar-priority" \
    -H "Content-Type: application/json" \
    -d "{\"character_name\": \"$char\", \"tier\": \"B\"}" > /dev/null
  echo "✅ 已新增六星角色: $char (B)"
done

# 9. 六星優先度 - C
echo "匯入六星優先度 - C..."
c_chars=("珠希" "鈴" "七七香" "鏡華" "空花" "優衣")
for char in "${c_chars[@]}"; do
  curl -s -X POST "$API_BASE/sixstar-priority" \
    -H "Content-Type: application/json" \
    -d "{\"character_name\": \"$char\", \"tier\": \"C\"}" > /dev/null
  echo "✅ 已新增六星角色: $char (C)"
done

# 10. 非六星角色
echo "匯入非六星角色..."

# 碧(工作服)
curl -s -X POST "$API_BASE/non-sixstar-characters" \
  -H "Content-Type: application/json" \
  -d '{"character_name": "碧(工作服)", "description": "深域好用，競技場商店可換。", "acquisition_method": "競技場商店"}' > /dev/null
echo "✅ 已新增非六星角色: 碧(工作服)"

# 魔霞
curl -s -X POST "$API_BASE/non-sixstar-characters" \
  -H "Content-Type: application/json" \
  -d '{"character_name": "魔霞", "description": "需開專二，競技場好用，冒險可刷到。", "acquisition_method": "冒險"}' > /dev/null
echo "✅ 已新增非六星角色: 魔霞"

# 碧(插班生)
curl -s -X POST "$API_BASE/non-sixstar-characters" \
  -H "Content-Type: application/json" \
  -d '{"character_name": "碧(插班生)", "description": "深域戰隊戰都能用到，冒險可刷。", "acquisition_method": "冒險"}' > /dev/null
echo "✅ 已新增非六星角色: 碧(插班生)"

# 優妮(聖學祭)
curl -s -X POST "$API_BASE/non-sixstar-characters" \
  -H "Content-Type: application/json" \
  -d '{"character_name": "優妮(聖學祭)", "description": "深域/風深淵討伐會用到，冒險可刷。", "acquisition_method": "冒險"}' > /dev/null
echo "✅ 已新增非六星角色: 優妮(聖學祭)"

# 霞(夏日)
curl -s -X POST "$API_BASE/non-sixstar-characters" \
  -H "Content-Type: application/json" \
  -d '{"character_name": "霞(夏日)", "description": "深域/水深淵討伐/戰對戰都有機會用到，冒險可刷。", "acquisition_method": "冒險"}' > /dev/null
echo "✅ 已新增非六星角色: 霞(夏日)"

# 七七香(夏日)
curl -s -X POST "$API_BASE/non-sixstar-characters" \
  -H "Content-Type: application/json" \
  -d '{"character_name": "七七香(夏日)", "description": "看日服說開專二有用，冒險可刷。", "acquisition_method": "冒險"}' > /dev/null
echo "✅ 已新增非六星角色: 七七香(夏日)"

# 空花(大江戶)
curl -s -X POST "$API_BASE/non-sixstar-characters" \
  -H "Content-Type: application/json" \
  -d '{"character_name": "空花(大江戶)", "description": "戰隊戰/深域偶爾出現，冒險可刷。", "acquisition_method": "冒險"}' > /dev/null
echo "✅ 已新增非六星角色: 空花(大江戶)"

# 香織(夏日)
curl -s -X POST "$API_BASE/non-sixstar-characters" \
  -H "Content-Type: application/json" \
  -d '{"character_name": "香織(夏日)", "description": "水4-10會用到，開專二即可，冒險可刷。", "acquisition_method": "冒險"}' > /dev/null
echo "✅ 已新增非六星角色: 香織(夏日)"

# 真步(灰姑娘)
curl -s -X POST "$API_BASE/non-sixstar-characters" \
  -H "Content-Type: application/json" \
  -d '{"character_name": "真步(灰姑娘)", "description": "深域/推圖常用，冒險可刷。", "acquisition_method": "冒險"}' > /dev/null
echo "✅ 已新增非六星角色: 真步(灰姑娘)"

echo "🎉 資料匯入完成！"