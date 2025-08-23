#!/bin/bash

API_BASE="http://localhost:3000/api"

echo "開始匯入專用裝備資料..."

# 專用裝備1優先度 - SS
echo "匯入專用裝備1優先度 - SS..."
ue1_ss_chars=("克莉絲提娜" "優花梨" "璃乃" "泳咲")
for char in "${ue1_ss_chars[@]}"; do
  curl -s -X POST "$API_BASE/ue1-priority" \
    -H "Content-Type: application/json" \
    -d "{\"character_name\": \"$char\", \"tier\": \"SS\"}" > /dev/null
  echo "✅ 已新增專用裝備1角色: $char (SS)"
done

# 專用裝備1優先度 - S
echo "匯入專用裝備1優先度 - S..."
ue1_s_chars=("凱留(公主)" "似似花" "晶" "栞" "矛依未" "流夏" "純" "望(解放者)" "吉塔(魔導士)" "可可蘿(公主)" "帆希(新年)" "怜(夏日)" "真步(夏日)" "美空" "蘭法" "莉莉(泳裝)" "愛梅斯(夏日)" "帆希(夏日)" "杏奈" "步未" "雪" "宮子" "凱留" "惠理子(指揮官)" "似似花(夏日)" "禊&美美&鏡華" "咲戀(夏日)")
for char in "${ue1_s_chars[@]}"; do
  curl -s -X POST "$API_BASE/ue1-priority" \
    -H "Content-Type: application/json" \
    -d "{\"character_name\": \"$char\", \"tier\": \"S\"}" > /dev/null
  echo "✅ 已新增專用裝備1角色: $char (S)"
done

# 專用裝備1優先度 - A
echo "匯入專用裝備1優先度 - A..."
ue1_a_chars=("靜流(情人節)" "凱留(編入生)" "霞(夏日)" "茉莉" "祈梨" "斑比" "鈴莓" "紡希" "真陽" "伊緒(黑暗)" "霞(魔法少女)" "怜(新年)" "純(聖誕節)" "碧(插班生)" "栞(遊俠)" "似似花(新年)" "碧(工作服)" "秋乃&咲戀" "日和(星辰)" "咲戀(舞姬)" "涅亞(夏日)" "霞(新年)" "可可蘿" "初音&栞" "優依(星辰)" "庫露露" "真步(夢想樂園)" "優衣(新年)" "真步(灰姑娘)" "空花(黑暗)" "美空(夏日)" "莫妮卡" "珠希(咖啡廳)" "真步" "莉瑪" "可可蘿(夏日)" "貪吃佩可(夏日)" "優妮(冬日)" "綾音(聖誕節)")
for char in "${ue1_a_chars[@]}"; do
  curl -s -X POST "$API_BASE/ue1-priority" \
    -H "Content-Type: application/json" \
    -d "{\"character_name\": \"$char\", \"tier\": \"A\"}" > /dev/null
  echo "✅ 已新增專用裝備1角色: $char (A)"
done

# 專用裝備1優先度 - B
echo "匯入專用裝備1優先度 - B..."
ue1_b_chars=("嘉夜" "伊緒" "怜" "鈴奈" "貪吃佩可(超載)" "吉塔" "伊莉亞" "望" "莫妮卡(魔法少女)" "矛依未(解放者)" "胡桃(舞台劇)" "優妮" "依里(聖誕)" "杏奈(海盜)" "流夏(薩拉薩利亞)")
for char in "${ue1_b_chars[@]}"; do
  curl -s -X POST "$API_BASE/ue1-priority" \
    -H "Content-Type: application/json" \
    -d "{\"character_name\": \"$char\", \"tier\": \"B\"}" > /dev/null
  echo "✅ 已新增專用裝備1角色: $char (B)"
done

# 專用裝備2優先度 - SS
echo "匯入專用裝備2優先度 - SS..."
ue2_ss_chars=("泳咲" "妹弓")
for char in "${ue2_ss_chars[@]}"; do
  curl -s -X POST "$API_BASE/ue2-priority" \
    -H "Content-Type: application/json" \
    -d "{\"character_name\": \"$char\", \"tier\": \"SS\"}" > /dev/null
  echo "✅ 已新增專用裝備2角色: $char (SS)"
done

# 專用裝備2優先度 - S
echo "匯入專用裝備2優先度 - S..."
ue2_s_chars=("魔霞" "怜" "聖克" "泳真" "凱留" "鈴莓" "情姐" "可可蘿" "插班碧" "真步(夏日)" "真陽")
for char in "${ue2_s_chars[@]}"; do
  curl -s -X POST "$API_BASE/ue2-priority" \
    -H "Content-Type: application/json" \
    -d "{\"character_name\": \"$char\", \"tier\": \"S\"}" > /dev/null
  echo "✅ 已新增專用裝備2角色: $char (S)"
done

# 專用裝備2優先度 - A
echo "匯入專用裝備2優先度 - A..."
ue2_a_chars=("泳狗" "江空" "聖誕熊槌" "鈴奈" "泳七" "綾音(聖誕節)" "貪吃(佩可夏日)")
for char in "${ue2_a_chars[@]}"; do
  curl -s -X POST "$API_BASE/ue2-priority" \
    -H "Content-Type: application/json" \
    -d "{\"character_name\": \"$char\", \"tier\": \"A\"}" > /dev/null
  echo "✅ 已新增專用裝備2角色: $char (A)"
done

echo "🎉 專用裝備資料匯入完成！"