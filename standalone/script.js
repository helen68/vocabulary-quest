/**
 * 單字冒險 60 天：Vocabulary Quest
 * Standalone Script.js - Vanilla JS Version
 */

// --- 備用單字庫 (310 字) ---
const fallbackVocabulary = [
  { id: "1", word: "about", chineseMeaning: "關於", partOfSpeech: "prep", rawMeaning: "prep. 關於", sourcePage: "1" },
  { id: "2", word: "after", chineseMeaning: "在...之後", partOfSpeech: "prep", rawMeaning: "prep. 在...之後", sourcePage: "1" },
  { id: "3", word: "again", chineseMeaning: "再次", partOfSpeech: "adv", rawMeaning: "adv. 再次、重新", sourcePage: "1" },
  { id: "4", word: "agree", chineseMeaning: "同意", partOfSpeech: "vi", rawMeaning: "vi. 同意", sourcePage: "1" },
  { id: "5", word: "alive", chineseMeaning: "活著的", partOfSpeech: "adj", rawMeaning: "adj. 活著的", sourcePage: "1" },
  { id: "6", word: "almost", chineseMeaning: "幾乎", partOfSpeech: "adv", rawMeaning: "adv. 幾乎", sourcePage: "1" },
  { id: "7", word: "alone", chineseMeaning: "獨自的", partOfSpeech: "adj", rawMeaning: "adj. 獨自的、孤單的", sourcePage: "2" },
  { id: "8", word: "always", chineseMeaning: "總是", partOfSpeech: "adv", rawMeaning: "adv. 總是、一直", sourcePage: "2" },
  { id: "9", word: "angry", chineseMeaning: "生氣的", partOfSpeech: "adj", rawMeaning: "adj. 生氣的", sourcePage: "2" },
  { id: "10", word: "animal", chineseMeaning: "動物", partOfSpeech: "n", rawMeaning: "n. 動物", sourcePage: "2" },
  { id: "11", word: "answer", chineseMeaning: "回答", partOfSpeech: "v", rawMeaning: "v. 回答、答覆", sourcePage: "3" },
  { id: "12", word: "apple", chineseMeaning: "蘋果", partOfSpeech: "n", rawMeaning: "n. 蘋果", sourcePage: "3" },
  { id: "13", word: "arrive", chineseMeaning: "到達", partOfSpeech: "vi", rawMeaning: "vi. 到達、抵達", sourcePage: "3" },
  { id: "14", word: "ask", chineseMeaning: "詢問", partOfSpeech: "vt", rawMeaning: "vt. 詢問、要求", sourcePage: "3" },
  { id: "15", word: "aunt", chineseMeaning: "阿姨", partOfSpeech: "n", rawMeaning: "n. 伯母、嬸嬸、阿姨", sourcePage: "3" },
  { id: "16", word: "baby", chineseMeaning: "嬰兒", partOfSpeech: "n", rawMeaning: "n. 嬰兒", sourcePage: "4" },
  { id: "17", word: "back", chineseMeaning: "後面的", partOfSpeech: "adj", rawMeaning: "adj. 後面的、背部的", sourcePage: "4" },
  { id: "18", word: "bad", chineseMeaning: "壞的", partOfSpeech: "adj", rawMeaning: "adj. 壞的、差的", sourcePage: "4" },
  { id: "19", word: "bag", chineseMeaning: "袋子", partOfSpeech: "n", rawMeaning: "n. 袋子、包包", sourcePage: "4" },
  { id: "20", word: "ball", chineseMeaning: "球", partOfSpeech: "n", rawMeaning: "n. 球", sourcePage: "4" },
  { id: "21", word: "banana", chineseMeaning: "香蕉", partOfSpeech: "n", rawMeaning: "n. 香蕉", sourcePage: "5" },
  { id: "22", word: "band", chineseMeaning: "樂團", partOfSpeech: "n", rawMeaning: "n. 樂團、樂隊", sourcePage: "5" },
  { id: "23", word: "bank", chineseMeaning: "銀行", partOfSpeech: "n", rawMeaning: "n. 銀行、岸邊", sourcePage: "5" },
  { id: "24", word: "basket", chineseMeaning: "籃子", partOfSpeech: "n", rawMeaning: "n. 籃子", sourcePage: "5" },
  { id: "25", word: "beach", chineseMeaning: "海灘", partOfSpeech: "n", rawMeaning: "n. 海灘、沙灘", sourcePage: "5" },
  { id: "26", word: "beautiful", chineseMeaning: "美麗的", partOfSpeech: "adj", rawMeaning: "adj. 美麗的", sourcePage: "6" },
  { id: "27", word: "because", chineseMeaning: "因為", partOfSpeech: "conj", rawMeaning: "conj. 因為", sourcePage: "6" },
  { id: "28", word: "become", chineseMeaning: "成為", partOfSpeech: "vi", rawMeaning: "vi. 成為、變成", sourcePage: "6" },
  { id: "29", word: "bed", chineseMeaning: "床", partOfSpeech: "n", rawMeaning: "n. 床", sourcePage: "6" },
  { id: "30", word: "bee", chineseMeaning: "蜜蜂", partOfSpeech: "n", rawMeaning: "n. 蜜蜂", sourcePage: "6" },
  { id: "31", word: "before", chineseMeaning: "在...之前", partOfSpeech: "prep", rawMeaning: "prep. 在...之前", sourcePage: "7" },
  { id: "32", word: "begin", chineseMeaning: "開始", partOfSpeech: "v", rawMeaning: "v. 開始", sourcePage: "7" },
  { id: "33", word: "behind", chineseMeaning: "在...後面", partOfSpeech: "prep", rawMeaning: "prep. 在...後面", sourcePage: "7" },
  { id: "34", word: "believe", chineseMeaning: "相信", partOfSpeech: "vt", rawMeaning: "vt. 相信、信任", sourcePage: "7" },
  { id: "35", word: "bell", chineseMeaning: "鈴鐺", partOfSpeech: "n", rawMeaning: "n. 鈴鐺、鐘聲", sourcePage: "7" },
  { id: "36", word: "beside", chineseMeaning: "在...旁邊", partOfSpeech: "prep", rawMeaning: "prep. 在...旁邊", sourcePage: "8" },
  { id: "37", word: "between", chineseMeaning: "在...之間", partOfSpeech: "prep", rawMeaning: "prep. 在...兩者之間", sourcePage: "8" },
  { id: "38", word: "bicycle", chineseMeaning: "腳踏車", partOfSpeech: "n", rawMeaning: "n. 腳踏車、單車", sourcePage: "8" },
  { id: "39", word: "big", chineseMeaning: "大的", partOfSpeech: "adj", rawMeaning: "adj. 大的", sourcePage: "8" },
  { id: "40", word: "bird", chineseMeaning: "鳥", partOfSpeech: "n", rawMeaning: "n. 鳥", sourcePage: "8" },
  { id: "41", word: "birthday", chineseMeaning: "生日", partOfSpeech: "n", rawMeaning: "n. 生日", sourcePage: "9" },
  { id: "42", word: "bite", chineseMeaning: "咬", partOfSpeech: "v", rawMeaning: "v. 咬", sourcePage: "9" },
  { id: "43", word: "black", chineseMeaning: "黑色的", partOfSpeech: "adj", rawMeaning: "adj. 黑色的", sourcePage: "9" },
  { id: "44", word: "blow", chineseMeaning: "吹", partOfSpeech: "v", rawMeaning: "v. 吹、吹動", sourcePage: "9" },
  { id: "45", word: "blue", chineseMeaning: "藍色的", partOfSpeech: "adj", rawMeaning: "adj. 藍色的", sourcePage: "9" },
  { id: "46", word: "boat", chineseMeaning: "船", partOfSpeech: "n", rawMeaning: "n. 船、小舟", sourcePage: "10" },
  { id: "47", word: "body", chineseMeaning: "身體", partOfSpeech: "n", rawMeaning: "n. 身體", sourcePage: "10" },
  { id: "48", word: "book", chineseMeaning: "書本", partOfSpeech: "n", rawMeaning: "n. 書本", sourcePage: "10" },
  { id: "49", word: "born", chineseMeaning: "出生的", partOfSpeech: "adj", rawMeaning: "adj. 出生的、天生的", sourcePage: "10" },
  { id: "50", word: "bottle", chineseMeaning: "瓶子", partOfSpeech: "n", rawMeaning: "n. 瓶子", sourcePage: "10" },
  { id: "51", word: "box", chineseMeaning: "箱子", partOfSpeech: "n", rawMeaning: "n. 箱子、盒子", sourcePage: "11" },
  { id: "52", word: "boy", chineseMeaning: "男孩", partOfSpeech: "n", rawMeaning: "n. 男孩", sourcePage: "11" },
  { id: "53", word: "bread", chineseMeaning: "麵包", partOfSpeech: "n", rawMeaning: "n. 麵包", sourcePage: "11" },
  { id: "54", word: "break", chineseMeaning: "打破", partOfSpeech: "vt", rawMeaning: "vt. 打破、折斷", sourcePage: "11" },
  { id: "55", word: "breakfast", chineseMeaning: "早餐", partOfSpeech: "n", rawMeaning: "n. 早餐", sourcePage: "11" },
  { id: "56", word: "bridge", chineseMeaning: "橋", partOfSpeech: "n", rawMeaning: "n. 橋、橋樑", sourcePage: "12" },
  { id: "57", word: "bright", chineseMeaning: "明亮的", partOfSpeech: "adj", rawMeaning: "adj. 明亮的、聰明的", sourcePage: "12" },
  { id: "58", word: "bring", chineseMeaning: "帶來", partOfSpeech: "vt", rawMeaning: "vt. 帶來、拿來", sourcePage: "12" },
  { id: "59", word: "brother", chineseMeaning: "兄弟", partOfSpeech: "n", rawMeaning: "n. 兄弟", sourcePage: "12" },
  { id: "60", word: "brown", chineseMeaning: "褐色的", partOfSpeech: "adj", rawMeaning: "adj. 褐色的、咖啡色的", sourcePage: "12" },
  { id: "61", word: "brush", chineseMeaning: "刷子", partOfSpeech: "n", rawMeaning: "n. 刷子、畫筆", sourcePage: "13" },
  { id: "62", word: "bus", chineseMeaning: "公車", partOfSpeech: "n", rawMeaning: "n. 公車、巴士", sourcePage: "13" },
  { id: "63", word: "busy", chineseMeaning: "忙碌的", partOfSpeech: "adj", rawMeaning: "adj. 忙碌的", sourcePage: "13" },
  { id: "64", word: "butter", chineseMeaning: "奶油", partOfSpeech: "n", rawMeaning: "n. 奶油", sourcePage: "13" },
  { id: "65", word: "buy", chineseMeaning: "買", partOfSpeech: "vt", rawMeaning: "vt. 購買", sourcePage: "13" },
  { id: "66", word: "cage", chineseMeaning: "籠子", partOfSpeech: "n", rawMeaning: "n. 籠子、鳥籠", sourcePage: "14" },
  { id: "67", word: "cake", chineseMeaning: "蛋糕", partOfSpeech: "n", rawMeaning: "n. 蛋糕", sourcePage: "14" },
  { id: "68", word: "call", chineseMeaning: "打電話", partOfSpeech: "v", rawMeaning: "v. 呼叫、打電話", sourcePage: "14" },
  { id: "69", word: "camera", chineseMeaning: "相機", partOfSpeech: "n", rawMeaning: "n. 照相機", sourcePage: "14" },
  { id: "70", word: "camp", chineseMeaning: "露營", partOfSpeech: "vi", rawMeaning: "vi. 露營、營地", sourcePage: "14" },
  { id: "71", word: "candle", chineseMeaning: "蠟燭", partOfSpeech: "n", rawMeaning: "n. 蠟燭", sourcePage: "15" },
  { id: "72", word: "candy", chineseMeaning: "糖果", partOfSpeech: "n", rawMeaning: "n. 糖果", sourcePage: "15" },
  { id: "73", text: "cap", word: "cap", chineseMeaning: "帽子", partOfSpeech: "n", rawMeaning: "n. 便帽、棒球帽", sourcePage: "15" },
  { id: "74", word: "car", chineseMeaning: "汽車", partOfSpeech: "n", rawMeaning: "n. 汽車", sourcePage: "15" },
  { id: "75", word: "card", chineseMeaning: "卡片", partOfSpeech: "n", rawMeaning: "n. 卡片", sourcePage: "15" },
  { id: "76", word: "care", chineseMeaning: "關心", partOfSpeech: "v", rawMeaning: "v. 照顧、關心", sourcePage: "16" },
  { id: "77", word: "careful", chineseMeaning: "小心的", partOfSpeech: "adj", rawMeaning: "adj. 小心的、謹慎的", sourcePage: "16" },
  { id: "78", word: "carry", chineseMeaning: "攜帶", partOfSpeech: "vt", rawMeaning: "vt. 攜帶、搬運", sourcePage: "16" },
  { id: "79", word: "case", chineseMeaning: "案件", partOfSpeech: "n", rawMeaning: "n. 案件、箱子、情況", sourcePage: "16" },
  { id: "80", word: "cat", chineseMeaning: "貓", partOfSpeech: "n", rawMeaning: "n. 貓咪", sourcePage: "16" },
  { id: "81", word: "catch", chineseMeaning: "接住", partOfSpeech: "vt", rawMeaning: "vt. 接住、捕捉、趕上", sourcePage: "17" },
  { id: "82", word: "chair", chineseMeaning: "椅子", partOfSpeech: "n", rawMeaning: "n. 椅子", sourcePage: "17" },
  { id: "83", word: "chance", chineseMeaning: "機會", partOfSpeech: "n", rawMeaning: "n. 機會、可能性", sourcePage: "17" },
  { id: "84", word: "change", chineseMeaning: "改變", partOfSpeech: "v", rawMeaning: "v. 改變、找零", sourcePage: "17" },
  { id: "85", word: "cheap", chineseMeaning: "便宜的", partOfSpeech: "adj", rawMeaning: "adj. 便宜的", sourcePage: "17" },
  { id: "86", word: "cheat", chineseMeaning: "作弊", partOfSpeech: "vi", rawMeaning: "vi. 作弊、欺騙", sourcePage: "18" },
  { id: "87", word: "cheese", chineseMeaning: "起司", partOfSpeech: "n", rawMeaning: "n. 起司、乳酪", sourcePage: "18" },
  { id: "88", word: "chicken", chineseMeaning: "雞肉", partOfSpeech: "n", rawMeaning: "n. 雞肉、小雞", sourcePage: "18" },
  { id: "89", word: "child", chineseMeaning: "小孩", partOfSpeech: "n", rawMeaning: "n. 小孩、兒童", sourcePage: "18" },
  { id: "90", word: "chocolate", chineseMeaning: "巧克力", partOfSpeech: "n", rawMeaning: "n. 巧克力", sourcePage: "18" },
  { id: "91", word: "choose", chineseMeaning: "選擇", partOfSpeech: "vt", rawMeaning: "vt. 選擇、挑選", sourcePage: "19" },
  { id: "92", word: "church", chineseMeaning: "教堂", partOfSpeech: "n", rawMeaning: "n. 教堂", sourcePage: "19" },
  { id: "93", word: "circle", chineseMeaning: "圓圈", partOfSpeech: "n", rawMeaning: "n. 圓圈、圓形", sourcePage: "19" },
  { id: "94", word: "city", chineseMeaning: "城市", partOfSpeech: "n", rawMeaning: "n. 城市、都市", sourcePage: "19" },
  { id: "95", word: "class", chineseMeaning: "班級", partOfSpeech: "n", rawMeaning: "n. 班級、課堂", sourcePage: "19" },
  { id: "96", word: "classroom", chineseMeaning: "教室", partOfSpeech: "n", rawMeaning: "n. 教室", sourcePage: "20" },
  { id: "97", word: "clean", chineseMeaning: "乾淨的", partOfSpeech: "adj", rawMeaning: "adj. 乾淨的、清潔的", sourcePage: "20" },
  { id: "98", word: "clear", chineseMeaning: "清楚的", partOfSpeech: "adj", rawMeaning: "adj. 清楚的、晴朗的", sourcePage: "20" },
  { id: "99", word: "clerk", chineseMeaning: "店員", partOfSpeech: "n", rawMeaning: "n. 店員、辦事員", sourcePage: "20" },
  { id: "100", word: "climb", chineseMeaning: "爬", partOfSpeech: "v", rawMeaning: "v. 攀爬、爬山", sourcePage: "20" },
  { id: "101", word: "clock", chineseMeaning: "時鐘", partOfSpeech: "n", rawMeaning: "n. 時鐘", sourcePage: "21" },
  { id: "102", word: "close", chineseMeaning: "關閉", partOfSpeech: "vt", rawMeaning: "vt. 關閉、結束", sourcePage: "21" },
  { id: "103", word: "clothes", chineseMeaning: "衣服", partOfSpeech: "n", rawMeaning: "n. 衣服、服裝", sourcePage: "21" },
  { id: "104", word: "cloud", chineseMeaning: "雲", partOfSpeech: "n", rawMeaning: "n. 雲朵", sourcePage: "21" },
  { id: "105", word: "cloudy", chineseMeaning: "多雲的", partOfSpeech: "adj", rawMeaning: "adj. 多雲的、陰天的", sourcePage: "21" },
  { id: "106", word: "club", chineseMeaning: "社團", partOfSpeech: "n", rawMeaning: "n. 社團、俱樂部", sourcePage: "22" },
  { id: "107", word: "coat", chineseMeaning: "外套", partOfSpeech: "n", rawMeaning: "n. 外套、大衣", sourcePage: "22" },
  { id: "108", word: "coffee", chineseMeaning: "咖啡", partOfSpeech: "n", rawMeaning: "n. 咖啡", sourcePage: "22" },
  { id: "109", word: "cola", chineseMeaning: "可樂", partOfSpeech: "n", rawMeaning: "n. 可樂", sourcePage: "22" },
  { id: "110", word: "cold", chineseMeaning: "寒冷的", partOfSpeech: "adj", rawMeaning: "adj. 寒冷的、感冒", sourcePage: "22" },
  { id: "111", word: "collect", chineseMeaning: "收集", partOfSpeech: "vt", rawMeaning: "vt. 收集、採集", sourcePage: "23" },
  { id: "112", word: "color", chineseMeaning: "顏色", partOfSpeech: "n", rawMeaning: "n. 顏色", sourcePage: "23" },
  { id: "113", word: "come", chineseMeaning: "來", partOfSpeech: "vi", rawMeaning: "vi. 來、抵達", sourcePage: "23" },
  { id: "114", word: "common", chineseMeaning: "常見的", partOfSpeech: "adj", rawMeaning: "adj. 常見的、共同的", sourcePage: "23" },
  { id: "115", word: "computer", chineseMeaning: "電腦", partOfSpeech: "n", rawMeaning: "n. 電腦", sourcePage: "23" },
  { id: "116", word: "cook", chineseMeaning: "煮飯", partOfSpeech: "v", rawMeaning: "v. 烹調、廚師", sourcePage: "24" },
  { id: "117", word: "cookie", chineseMeaning: "餅乾", partOfSpeech: "n", rawMeaning: "n. 餅乾", sourcePage: "24" },
  { id: "118", word: "cool", chineseMeaning: "涼爽的", partOfSpeech: "adj", rawMeaning: "adj. 涼爽的、酷的", sourcePage: "24" },
  { id: "119", word: "corner", chineseMeaning: "角落", partOfSpeech: "n", rawMeaning: "n. 角落、轉角", sourcePage: "24" },
  { id: "120", word: "correct", chineseMeaning: "正確的", partOfSpeech: "adj", rawMeaning: "adj. 正確的、修改", sourcePage: "24" },
  { id: "121", word: "cost", chineseMeaning: "花費", partOfSpeech: "v", rawMeaning: "v. 花費、成本", sourcePage: "25" },
  { id: "122", word: "couch", chineseMeaning: "沙發", partOfSpeech: "n", rawMeaning: "n. 沙發、長椅", sourcePage: "25" },
  { id: "123", word: "count", chineseMeaning: "數數", partOfSpeech: "v", rawMeaning: "v. 計算、數數", sourcePage: "25" },
  { id: "124", word: "country", chineseMeaning: "國家", partOfSpeech: "n", rawMeaning: "n. 國家、鄉下", sourcePage: "25" },
  { id: "125", word: "cousin", chineseMeaning: "堂表兄弟姊妹", partOfSpeech: "n", rawMeaning: "n. 堂表兄弟姊妹", sourcePage: "25" },
  { id: "126", word: "cow", chineseMeaning: "母牛", partOfSpeech: "n", rawMeaning: "n. 母牛、乳牛", sourcePage: "26" },
  { id: "127", word: "crazy", chineseMeaning: "瘋狂的", partOfSpeech: "adj", rawMeaning: "adj. 瘋狂的、著迷的", sourcePage: "26" },
  { id: "128", word: "cry", chineseMeaning: "哭泣", partOfSpeech: "vi", rawMeaning: "vi. 哭泣、喊叫", sourcePage: "26" },
  { id: "129", word: "cup", chineseMeaning: "杯子", partOfSpeech: "n", rawMeaning: "n. 杯子", sourcePage: "26" },
  { id: "130", word: "cut", chineseMeaning: "切", partOfSpeech: "vt", rawMeaning: "vt. 切割、剪下", sourcePage: "26" },
  { id: "131", word: "cute", chineseMeaning: "可愛的", partOfSpeech: "adj", rawMeaning: "adj. 可愛的", sourcePage: "27" },
  { id: "132", word: "dance", chineseMeaning: "跳舞", partOfSpeech: "v", rawMeaning: "v. 跳舞、舞蹈", sourcePage: "27" },
  { id: "133", word: "danger", chineseMeaning: "危險", partOfSpeech: "n", rawMeaning: "n. 危險", sourcePage: "27" },
  { id: "134", word: "dark", chineseMeaning: "黑暗的", partOfSpeech: "adj", rawMeaning: "adj. 黑暗的、深色的", sourcePage: "27" },
  { id: "135", word: "date", chineseMeaning: "日期", partOfSpeech: "n", rawMeaning: "n. 日期、約會", sourcePage: "27" },
  { id: "136", word: "daughter", chineseMeaning: "女兒", partOfSpeech: "n", rawMeaning: "n. 女兒", sourcePage: "28" },
  { id: "137", word: "day", chineseMeaning: "白天", partOfSpeech: "n", rawMeaning: "n. 白天、日子", sourcePage: "28" },
  { id: "138", word: "dead", chineseMeaning: "死的", partOfSpeech: "adj", rawMeaning: "adj. 死的、枯萎的", sourcePage: "28" },
  { id: "139", word: "dear", chineseMeaning: "親愛的", partOfSpeech: "adj", rawMeaning: "adj. 親愛的、珍貴的", sourcePage: "28" },
  { id: "140", word: "decide", chineseMeaning: "決定", partOfSpeech: "v", rawMeaning: "v. 決定", sourcePage: "28" },
  { id: "141", word: "deep", chineseMeaning: "深的", partOfSpeech: "adj", rawMeaning: "adj. 深的", sourcePage: "29" },
  { id: "142", word: "delicious", chineseMeaning: "美味的", partOfSpeech: "adj", rawMeaning: "adj. 美味的、好吃的", sourcePage: "29" },
  { id: "143", word: "dentist", chineseMeaning: "牙醫", partOfSpeech: "n", rawMeaning: "n. 牙醫", sourcePage: "29" },
  { id: "144", word: "desk", chineseMeaning: "書桌", partOfSpeech: "n", rawMeaning: "n. 書桌、辦公桌", sourcePage: "29" },
  { id: "145", word: "dictionary", chineseMeaning: "字典", partOfSpeech: "n", rawMeaning: "n. 字典", sourcePage: "29" },
  { id: "146", word: "die", chineseMeaning: "死亡", partOfSpeech: "vi", rawMeaning: "vi. 死亡", sourcePage: "30" },
  { id: "147", word: "different", chineseMeaning: "不同的", partOfSpeech: "adj", rawMeaning: "adj. 不同的", sourcePage: "30" },
  { id: "148", word: "difficult", chineseMeaning: "困難的", partOfSpeech: "adj", rawMeaning: "adj. 困難的", sourcePage: "30" },
  { id: "149", word: "dig", chineseMeaning: "挖", partOfSpeech: "v", rawMeaning: "v. 挖掘", sourcePage: "30" },
  { id: "150", word: "dinner", chineseMeaning: "晚餐", partOfSpeech: "n", rawMeaning: "n. 晚餐", sourcePage: "30" },
  { id: "151", word: "dirty", chineseMeaning: "髒的", partOfSpeech: "adj", rawMeaning: "adj. 骯髒的", sourcePage: "31" },
  { id: "152", word: "dish", chineseMeaning: "盤子", partOfSpeech: "n", rawMeaning: "n. 盤子、菜餚", sourcePage: "31" },
  { id: "153", word: "doctor", chineseMeaning: "醫生", partOfSpeech: "n", rawMeaning: "n. 醫生、博士", sourcePage: "31" },
  { id: "154", word: "dog", chineseMeaning: "狗", partOfSpeech: "n", rawMeaning: "n. 狗、犬", sourcePage: "31" },
  { id: "155", word: "doll", chineseMeaning: "洋娃娃", partOfSpeech: "n", rawMeaning: "n. 洋娃娃、玩偶", sourcePage: "31" },
  { id: "156", word: "door", chineseMeaning: "門", partOfSpeech: "n", rawMeaning: "n. 門", sourcePage: "32" },
  { id: "157", word: "double", chineseMeaning: "雙倍的", partOfSpeech: "adj", rawMeaning: "adj. 雙倍的", sourcePage: "32" },
  { id: "158", word: "down", chineseMeaning: "向下", partOfSpeech: "adv", rawMeaning: "adv. 向下", sourcePage: "32" },
  { id: "159", word: "draw", chineseMeaning: "畫", partOfSpeech: "v", rawMeaning: "v. 繪畫、吸引、拉", sourcePage: "32" },
  { id: "160", word: "dream", chineseMeaning: "夢想", partOfSpeech: "n", rawMeaning: "n. 夢想、作夢", sourcePage: "32" },
  { id: "161", word: "dress", chineseMeaning: "洋裝", partOfSpeech: "n", rawMeaning: "n. 洋裝、穿衣", sourcePage: "33" },
  { id: "162", word: "drink", chineseMeaning: "飲料", partOfSpeech: "n", rawMeaning: "n. 飲料、喝水", sourcePage: "33" },
  { id: "163", word: "drive", chineseMeaning: "開車", partOfSpeech: "v", rawMeaning: "v. 駕駛、開車", sourcePage: "33" },
  { id: "164", word: "driver", chineseMeaning: "司機", partOfSpeech: "n", rawMeaning: "n. 司機、駕駛員", sourcePage: "33" },
  { id: "165", word: "drop", chineseMeaning: "落下", partOfSpeech: "v", rawMeaning: "v. 滴下、落下、掉落", sourcePage: "33" },
  { id: "166", word: "dry", chineseMeaning: "乾的", partOfSpeech: "adj", rawMeaning: "adj. 乾燥的、弄乾", sourcePage: "34" },
  { id: "167", word: "duck", chineseMeaning: "鴨子", partOfSpeech: "n", rawMeaning: "n. 鴨子", sourcePage: "34" },
  { id: "168", word: "dumpling", chineseMeaning: "水餃", partOfSpeech: "n", rawMeaning: "n. 水餃、餃子", sourcePage: "34" },
  { id: "169", word: "during", chineseMeaning: "在...期間", partOfSpeech: "prep", rawMeaning: "prep. 在...期間", sourcePage: "34" },
  { id: "170", word: "each", chineseMeaning: "每個", partOfSpeech: "adj", rawMeaning: "adj. 每個、各自的", sourcePage: "34" },
  { id: "171", word: "ear", chineseMeaning: "耳朵", partOfSpeech: "n", rawMeaning: "n. 耳朵", sourcePage: "35" },
  { id: "172", word: "early", chineseMeaning: "早的", partOfSpeech: "adj", rawMeaning: "adj. 早的、提早的", sourcePage: "35" },
  { id: "173", word: "earth", chineseMeaning: "地球", partOfSpeech: "n", rawMeaning: "n. 地球、泥土", sourcePage: "35" },
  { id: "174", word: "east", chineseMeaning: "東方", partOfSpeech: "n", rawMeaning: "n. 東方、向東", sourcePage: "35" },
  { id: "175", word: "easy", chineseMeaning: "容易的", partOfSpeech: "adj", rawMeaning: "adj. 容易的、輕鬆的", sourcePage: "35" },
  { id: "176", word: "eat", chineseMeaning: "吃", partOfSpeech: "v", rawMeaning: "v. 吃、進食", sourcePage: "36" },
  { id: "177", word: "egg", chineseMeaning: "蛋", partOfSpeech: "n", rawMeaning: "n. 蛋、雞蛋", sourcePage: "36" },
  { id: "178", word: "eight", chineseMeaning: "八", partOfSpeech: "num", rawMeaning: "num. 八", sourcePage: "36" },
  { id: "179", word: "either", chineseMeaning: "也（用於否定）", partOfSpeech: "adv", rawMeaning: "adv. 也（用於否定）、兩者之一", sourcePage: "36" },
  { id: "180", word: "elephant", chineseMeaning: "大象", partOfSpeech: "n", rawMeaning: "n. 大象", sourcePage: "36" },
  { id: "181", word: "eleven", chineseMeaning: "十一", partOfSpeech: "num", rawMeaning: "num. 十一", sourcePage: "37" },
  { id: "182", word: "else", chineseMeaning: "其他", partOfSpeech: "adv", rawMeaning: "adv. 其他、另外", sourcePage: "37" },
  { id: "183", word: "email", chineseMeaning: "電子郵件", partOfSpeech: "n", rawMeaning: "n. 電子郵件", sourcePage: "37" },
  { id: "184", word: "empty", chineseMeaning: "空的", partOfSpeech: "adj", rawMeaning: "adj. 空的", sourcePage: "37" },
  { id: "185", word: "end", chineseMeaning: "結束", partOfSpeech: "n", rawMeaning: "n. 結束、終點", sourcePage: "37" },
  { id: "186", word: "engineer", chineseMeaning: "工程師", partOfSpeech: "n", rawMeaning: "n. 工程師", sourcePage: "38" },
  { id: "187", word: "enjoy", chineseMeaning: "享受", partOfSpeech: "vt", rawMeaning: "vt. 享受、喜愛", sourcePage: "38" },
  { id: "188", word: "enough", chineseMeaning: "足夠的", partOfSpeech: "adj", rawMeaning: "adj. 足夠的", sourcePage: "38" },
  { id: "189", word: "enter", chineseMeaning: "進入", partOfSpeech: "v", rawMeaning: "v. 進入、輸入", sourcePage: "38" },
  { id: "190", word: "envelope", chineseMeaning: "信封", partOfSpeech: "n", rawMeaning: "n. 信封", sourcePage: "38" },
  { id: "191", word: "eraser", chineseMeaning: "橡皮擦", partOfSpeech: "n", rawMeaning: "n. 橡皮擦", sourcePage: "39" },
  { id: "192", word: "eve", chineseMeaning: "前夕", partOfSpeech: "n", rawMeaning: "n. 前夕、前夜", sourcePage: "39" },
  { id: "193", word: "even", chineseMeaning: "甚至", partOfSpeech: "adv", rawMeaning: "adv. 甚至、連", sourcePage: "39" },
  { id: "194", word: "evening", chineseMeaning: "傍晚", partOfSpeech: "n", rawMeaning: "n. 傍晚、晚上", sourcePage: "39" },
  { id: "195", word: "ever", chineseMeaning: "曾經", partOfSpeech: "adv", rawMeaning: "adv. 曾經、無論何時", sourcePage: "39" },
  { id: "196", word: "every", chineseMeaning: "每個", partOfSpeech: "adj", rawMeaning: "adj. 每個、所有的", sourcePage: "40" },
  { id: "197", word: "everyone", chineseMeaning: "每個人", partOfSpeech: "pron", rawMeaning: "pron. 每個人", sourcePage: "40" },
  { id: "198", word: "everything", chineseMeaning: "每件事", partOfSpeech: "pron", rawMeaning: "pron. 每件事、一切", sourcePage: "40" },
  { id: "199", word: "example", chineseMeaning: "例子", partOfSpeech: "n", rawMeaning: "n. 例子、範例", sourcePage: "40" },
  { id: "200", word: "excellent", chineseMeaning: "優秀的", partOfSpeech: "adj", rawMeaning: "adj. 優秀的、極佳的", sourcePage: "40" },
  { id: "201", word: "except", chineseMeaning: "除了...之外", partOfSpeech: "prep", rawMeaning: "prep. 除了...之外", sourcePage: "41" },
  { id: "202", word: "excited", chineseMeaning: "興奮的", partOfSpeech: "adj", rawMeaning: "adj. 興奮的、激動的", sourcePage: "41" },
  { id: "203", word: "exciting", chineseMeaning: "令人興奮的", partOfSpeech: "adj", rawMeaning: "adj. 令人興奮的", sourcePage: "41" },
  { id: "204", word: "excuse", chineseMeaning: "原諒", partOfSpeech: "vt", rawMeaning: "vt. 原諒、藉口", sourcePage: "41" },
  { id: "205", word: "exercise", chineseMeaning: "運動", partOfSpeech: "n", rawMeaning: "v. 運動、練習", sourcePage: "41" },
  { id: "206", word: "expensive", chineseMeaning: "昂貴的", partOfSpeech: "adj", rawMeaning: "adj. 昂貴的", sourcePage: "42" },
  { id: "207", word: "experience", chineseMeaning: "經驗", partOfSpeech: "n", rawMeaning: "n. 經驗、體驗", sourcePage: "42" },
  { id: "208", word: "eye", chineseMeaning: "眼睛", partOfSpeech: "n", rawMeaning: "n. 眼睛", sourcePage: "42" },
  { id: "209", word: "face", chineseMeaning: "臉", partOfSpeech: "n", rawMeaning: "n. 臉部、面對", sourcePage: "42" },
  { id: "210", word: "fact", chineseMeaning: "事實", partOfSpeech: "n", rawMeaning: "n. 事實、真相", sourcePage: "42" },
  { id: "211", word: "factory", chineseMeaning: "工廠", partOfSpeech: "n", rawMeaning: "n. 工廠", sourcePage: "43" },
  { id: "212", word: "fall", chineseMeaning: "落下", partOfSpeech: "vi", rawMeaning: "vi. 落下、秋天", sourcePage: "43" },
  { id: "213", word: "family", chineseMeaning: "家庭", partOfSpeech: "n", rawMeaning: "n. 家庭、家人", sourcePage: "43" },
  { id: "214", word: "famous", chineseMeaning: "著名的", partOfSpeech: "adj", rawMeaning: "adj. 著名的", sourcePage: "43" },
  { id: "215", word: "fan", chineseMeaning: "風扇", partOfSpeech: "n", rawMeaning: "n. 電風扇、迷、狂熱者", sourcePage: "43" },
  { id: "216", word: "far", chineseMeaning: "遙遠的", partOfSpeech: "adj", rawMeaning: "adj. 遙遠的、遠的", sourcePage: "44" },
  { id: "217", word: "farm", chineseMeaning: "農場", partOfSpeech: "n", rawMeaning: "n. 農場", sourcePage: "44" },
  { id: "218", word: "farmer", chineseMeaning: "農夫", partOfSpeech: "n", rawMeaning: "n. 農夫", sourcePage: "44" },
  { id: "219", word: "fast", chineseMeaning: "快速的", partOfSpeech: "adj", rawMeaning: "adj. 快速的、快地", sourcePage: "44" },
  { id: "220", word: "fat", chineseMeaning: "胖的", partOfSpeech: "adj", rawMeaning: "adj. 肥胖的、脂肪", sourcePage: "44" },
  { id: "221", word: "father", chineseMeaning: "父親", partOfSpeech: "n", rawMeaning: "n. 父親、爸爸", sourcePage: "45" },
  { id: "222", word: "favorite", chineseMeaning: "最喜愛的", partOfSpeech: "adj", rawMeaning: "adj. 最喜愛的", sourcePage: "45" },
  { id: "223", word: "fear", chineseMeaning: "害怕", partOfSpeech: "n", rawMeaning: "v. 害怕、恐懼", sourcePage: "45" },
  { id: "224", word: "feed", chineseMeaning: "餵食", partOfSpeech: "vt", rawMeaning: "vt. 餵食、飼養", sourcePage: "45" },
  { id: "225", word: "feel", chineseMeaning: "感覺", partOfSpeech: "v", rawMeaning: "v. 感覺、觸摸", sourcePage: "45" },
  { id: "226", word: "festival", chineseMeaning: "節日", partOfSpeech: "n", rawMeaning: "n. 節日、慶典", sourcePage: "46" },
  { id: "227", word: "few", chineseMeaning: "很少的", partOfSpeech: "adj", rawMeaning: "adj. 很少的、幾乎沒有的", sourcePage: "46" },
  { id: "228", word: "fifteen", chineseMeaning: "十五", partOfSpeech: "num", rawMeaning: "num. 十五", sourcePage: "46" },
  { id: "229", word: "fifty", chineseMeaning: "五十", partOfSpeech: "num", rawMeaning: "num. 五十", sourcePage: "46" },
  { id: "230", word: "fight", chineseMeaning: "打架", partOfSpeech: "v", rawMeaning: "v. 打架、戰鬥", sourcePage: "46" },
  { id: "231", word: "fill", chineseMeaning: "裝滿", partOfSpeech: "vt", rawMeaning: "vt. 裝滿、填寫", sourcePage: "47" },
  { id: "232", word: "film", chineseMeaning: "電影", partOfSpeech: "n", rawMeaning: "n. 電影、膠卷", sourcePage: "47" },
  { id: "233", word: "find", chineseMeaning: "尋找", partOfSpeech: "vt", rawMeaning: "vt. 尋找、發現", sourcePage: "47" },
  { id: "234", word: "fine", chineseMeaning: "好的", partOfSpeech: "adj", rawMeaning: "adj. 好的、晴朗的、罰款", sourcePage: "47" },
  { id: "235", word: "finger", chineseMeaning: "手指", partOfSpeech: "n", rawMeaning: "n. 手指", sourcePage: "47" },
  { id: "236", word: "finish", chineseMeaning: "完成", partOfSpeech: "vt", rawMeaning: "vt. 完成、結束", sourcePage: "48" },
  { id: "237", word: "fire", chineseMeaning: "火", partOfSpeech: "n", rawMeaning: "n. 火、火災、解雇", sourcePage: "48" },
  { id: "238", word: "first", chineseMeaning: "第一的", partOfSpeech: "adj", rawMeaning: "adj. 第一的、首先", sourcePage: "48" },
  { id: "239", word: "fish", chineseMeaning: "魚", partOfSpeech: "n", rawMeaning: "n. 魚肉、釣魚", sourcePage: "48" },
  { id: "240", word: "fisher", chineseMeaning: "漁夫", partOfSpeech: "n", rawMeaning: "n. 漁夫（常用fisherman）", sourcePage: "48" },
  { id: "241", word: "five", chineseMeaning: "五", partOfSpeech: "num", rawMeaning: "num. 五", sourcePage: "49" },
  { id: "242", word: "fix", chineseMeaning: "修理", partOfSpeech: "vt", rawMeaning: "vt. 修理、固定", sourcePage: "49" },
  { id: "243", word: "floor", chineseMeaning: "地板", partOfSpeech: "n", rawMeaning: "n. 地板、樓層", sourcePage: "49" },
  { id: "244", word: "flower", chineseMeaning: "花", partOfSpeech: "n", rawMeaning: "n. 花朵", sourcePage: "49" },
  { id: "245", word: "fly", chineseMeaning: "飛", partOfSpeech: "v", rawMeaning: "v. 飛翔、蒼蠅", sourcePage: "49" },
  { id: "246", word: "follow", chineseMeaning: "跟隨", partOfSpeech: "vt", rawMeaning: "vt. 跟隨、遵守", sourcePage: "50" },
  { id: "247", word: "food", chineseMeaning: "食物", partOfSpeech: "n", rawMeaning: "n. 食物", sourcePage: "50" },
  { id: "248", word: "foot", chineseMeaning: "腳", partOfSpeech: "n", rawMeaning: "n. 腳（複數feet）、英尺", sourcePage: "50" },
  { id: "249", word: "for", chineseMeaning: "為了", partOfSpeech: "prep", rawMeaning: "prep. 為了、給、適合", sourcePage: "50" },
  { id: "250", word: "foreign", chineseMeaning: "外國的", partOfSpeech: "adj", rawMeaning: "adj. 外國的", sourcePage: "50" },
  { id: "251", word: "forest", chineseMeaning: "森林", partOfSpeech: "n", rawMeaning: "n. 森林", sourcePage: "51" },
  { id: "252", word: "forget", chineseMeaning: "忘記", partOfSpeech: "vt", rawMeaning: "vt. 忘記", sourcePage: "51" },
  { id: "253", word: "fork", chineseMeaning: "叉子", partOfSpeech: "n", rawMeaning: "n. 叉子、餐叉", sourcePage: "51" },
  { id: "254", word: "forty", chineseMeaning: "四十", partOfSpeech: "num", rawMeaning: "num. 四十", sourcePage: "51" },
  { id: "255", word: "four", chineseMeaning: "四", partOfSpeech: "num", rawMeaning: "num. 四", sourcePage: "51" },
  { id: "256", word: "fourteen", chineseMeaning: "十四", partOfSpeech: "num", rawMeaning: "num. 十四", sourcePage: "52" },
  { id: "257", word: "free", chineseMeaning: "自由的", partOfSpeech: "adj", rawMeaning: "adj. 自由的、免費的", sourcePage: "52" },
  { id: "258", word: "fresh", chineseMeaning: "新鮮的", partOfSpeech: "adj", rawMeaning: "adj. 新鮮的", sourcePage: "52" },
  { id: "259", word: "friend", chineseMeaning: "朋友", partOfSpeech: "n", rawMeaning: "n. 朋友", sourcePage: "52" },
  { id: "260", word: "friendly", chineseMeaning: "友好的", partOfSpeech: "adj", rawMeaning: "adj. 友善的、友好的", sourcePage: "52" },
  { id: "261", word: "frighten", chineseMeaning: "使驚嚇", partOfSpeech: "vt", rawMeaning: "vt. 使驚嚇、嚇唬", sourcePage: "53" },
  { id: "262", word: "frog", chineseMeaning: "青蛙", partOfSpeech: "n", rawMeaning: "n. 青蛙", sourcePage: "53" },
  { id: "263", word: "from", chineseMeaning: "來自", partOfSpeech: "prep", rawMeaning: "prep. 來自、從", sourcePage: "53" },
  { id: "264", word: "front", chineseMeaning: "前面的", partOfSpeech: "adj", rawMeaning: "adj. 前面的、前部", sourcePage: "53" },
  { id: "265", word: "fruit", chineseMeaning: "水果", partOfSpeech: "n", rawMeaning: "n. 水果", sourcePage: "53" },
  { id: "266", word: "full", chineseMeaning: "滿的", partOfSpeech: "adj", rawMeaning: "adj. 滿的、飽的", sourcePage: "54" },
  { id: "267", word: "fun", chineseMeaning: "有趣的", partOfSpeech: "adj", rawMeaning: "adj. 有趣的、娛樂", sourcePage: "54" },
  { id: "268", word: "funny", chineseMeaning: "好笑的", partOfSpeech: "adj", rawMeaning: "adj. 好笑的、滑稽的", sourcePage: "54" },
  { id: "269", word: "future", chineseMeaning: "未來", partOfSpeech: "n", rawMeaning: "n. 未來、將來", sourcePage: "54" },
  { id: "270", word: "game", chineseMeaning: "遊戲", partOfSpeech: "n", rawMeaning: "n. 遊戲、比賽", sourcePage: "54" },
  { id: "271", word: "garden", chineseMeaning: "花園", partOfSpeech: "n", rawMeaning: "n. 花園", sourcePage: "55" },
  { id: "272", word: "gas", chineseMeaning: "瓦斯", partOfSpeech: "n", rawMeaning: "n. 瓦斯、氣體、汽油", sourcePage: "55" },
  { id: "273", word: "gate", chineseMeaning: "大門", partOfSpeech: "n", rawMeaning: "n. 大門", sourcePage: "55" },
  { id: "274", word: "general", chineseMeaning: "一般的", partOfSpeech: "adj", rawMeaning: "adj. 一般的、將軍", sourcePage: "55" },
  { id: "275", word: "get", chineseMeaning: "得到", partOfSpeech: "v", rawMeaning: "v. 得到、獲得、變得", sourcePage: "55" },
  { id: "276", word: "giant", chineseMeaning: "巨人", partOfSpeech: "n", rawMeaning: "n. 巨人、巨大的", sourcePage: "56" },
  { id: "277", word: "gift", chineseMeaning: "禮物", partOfSpeech: "n", rawMeaning: "n. 禮物、天賦", sourcePage: "56" },
  { id: "278", word: "girl", chineseMeaning: "女孩", partOfSpeech: "n", rawMeaning: "n. 女兒、女孩", sourcePage: "56" },
  { id: "279", word: "give", chineseMeaning: "給", partOfSpeech: "vt", rawMeaning: "vt. 給予", sourcePage: "56" },
  { id: "280", word: "glad", chineseMeaning: "高興的", partOfSpeech: "adj", rawMeaning: "adj. 高興的、樂意的", sourcePage: "56" },
  { id: "281", word: "glass", chineseMeaning: "玻璃杯", partOfSpeech: "n", rawMeaning: "n. 玻璃杯、玻璃、眼鏡", sourcePage: "57" },
  { id: "282", word: "glove", chineseMeaning: "手套", partOfSpeech: "n", rawMeaning: "n. 手套", sourcePage: "57" },
  { id: "283", word: "goat", chineseMeaning: "山羊", partOfSpeech: "n", rawMeaning: "n. 山羊", sourcePage: "57" },
  { id: "284", word: "good", chineseMeaning: "好的", partOfSpeech: "adj", rawMeaning: "adj. 好的、優良的", sourcePage: "57" },
  { id: "285", word: "goose", chineseMeaning: "鵝", partOfSpeech: "n", rawMeaning: "n. 鵝（複數geese）", sourcePage: "57" },
  { id: "286", word: "grade", chineseMeaning: "年級", partOfSpeech: "n", rawMeaning: "n. 年級、成績", sourcePage: "58" },
  { id: "287", word: "grandma", chineseMeaning: "祖母", partOfSpeech: "n", rawMeaning: "n. 祖母、外婆", sourcePage: "58" },
  { id: "288", word: "grandpa", chineseMeaning: "祖父", partOfSpeech: "n", rawMeaning: "n. 祖父、外公", sourcePage: "58" },
  { id: "289", word: "grape", chineseMeaning: "葡萄", partOfSpeech: "n", rawMeaning: "n. 葡萄", sourcePage: "58" },
  { id: "290", word: "grass", chineseMeaning: "草", partOfSpeech: "n", rawMeaning: "n. 草地、青草", sourcePage: "58" },
  { id: "291", word: "gray", chineseMeaning: "灰色的", partOfSpeech: "adj", rawMeaning: "adj. 灰色的", sourcePage: "59" },
  { id: "292", word: "great", chineseMeaning: "偉大的", partOfSpeech: "adj", rawMeaning: "adj. 偉大的、棒極了", sourcePage: "59" },
  { id: "293", word: "green", chineseMeaning: "綠色的", partOfSpeech: "adj", rawMeaning: "adj. 綠色的", sourcePage: "59" },
  { id: "294", word: "ground", chineseMeaning: "地面", partOfSpeech: "n", rawMeaning: "n. 地面、土地", sourcePage: "59" },
  { id: "295", word: "group", chineseMeaning: "團體", partOfSpeech: "n", rawMeaning: "n. 團體、小組", sourcePage: "59" },
  { id: "296", word: "grow", chineseMeaning: "生長", partOfSpeech: "vi", rawMeaning: "vi. 生長、種植、變成", sourcePage: "60" },
  { id: "297", word: "guava", chineseMeaning: "芭樂", partOfSpeech: "n", rawMeaning: "n. 芭樂、番石榴", sourcePage: "60" },
  { id: "298", word: "guess", chineseMeaning: "猜測", partOfSpeech: "v", rawMeaning: "v. 猜測、估計", sourcePage: "60" },
  { id: "299", word: "guitar", chineseMeaning: "吉他", partOfSpeech: "n", rawMeaning: "n. 吉他", sourcePage: "60" },
  { id: "300", word: "guy", chineseMeaning: "傢伙", partOfSpeech: "n", rawMeaning: "n. 傢伙、人", sourcePage: "60" },
  { id: "301", word: "habit", chineseMeaning: "習慣", partOfSpeech: "n", rawMeaning: "n. 習慣", sourcePage: "61" },
  { id: "302", word: "hair", chineseMeaning: "頭髮", partOfSpeech: "n", rawMeaning: "n. 頭髮、毛髮", sourcePage: "61" },
  { id: "303", word: "half", chineseMeaning: "一半", partOfSpeech: "n", rawMeaning: "一半、半個", sourcePage: "61" },
  { id: "304", word: "ham", chineseMeaning: "火腿", partOfSpeech: "n", rawMeaning: "n. 火腿", sourcePage: "61" },
  { id: "305", word: "hamburger", chineseMeaning: "漢堡", partOfSpeech: "n", rawMeaning: "n. 漢堡、漢堡排", sourcePage: "61" },
  { id: "306", word: "hand", chineseMeaning: "手", partOfSpeech: "n", rawMeaning: "n. 手、遞交", sourcePage: "62" },
  { id: "307", word: "handsome", chineseMeaning: "英俊的", partOfSpeech: "adj", rawMeaning: "adj. 英俊的、帥氣的", sourcePage: "62" },
  { id: "308", word: "hang", chineseMeaning: "懸掛", partOfSpeech: "v", rawMeaning: "v. 懸掛、吊掛", sourcePage: "62" },
  { id: "309", word: "happen", chineseMeaning: "發生", partOfSpeech: "vi", rawMeaning: "vi. 發生", sourcePage: "62" },
  { id: "310", word: "happy", chineseMeaning: "快樂的", partOfSpeech: "adj", rawMeaning: "adj. 快樂的、幸福的", sourcePage: "62" }
];

// --- 應用程式狀態 ---
let vocabulary = [];
let levels = [];
let progress = {};
let currentDay = 1;
let dataSource = "fallback";

// 單字卡學習狀態
let currentCardIndex = 0;
let isFlipped = false;
let activeTab = "new"; // 'new' | 'review'

// 測驗狀態
let quizQuestions = [];
let currentQuestionIndex = 0;
let selectedAnswer = null;
let hasAnswered = false;
let correctCount = 0;
let wrongCount = 0;
let wrongWordsInQuiz = [];

// --- 啟動初始化 ---
window.addEventListener("DOMContentLoaded", () => {
    loadProgress();
    loadVocabulary();
});

/**
 * 1. loadVocabulary()
 * 載入單字資料，若抓不到 CSV 則會啟用備用單字庫
 */
async function loadVocabulary() {
    showLoading(true);
    try {
        // 在本地 file:// 協議下 fetch 會受跨域 CORS 阻擋，如果失敗將會直接 catch 到 fallback
        const response = await fetch("../vocabulary_full.csv");
        if (!response.ok) {
            throw new Error("無法取得 CSV 檔案，準備進入備用方案");
        }
        const csvText = await response.text();
        const parsedItems = parseCSV(csvText);
        const validation = validateVocabulary(parsedItems);

        if (validation.isValid) {
            vocabulary = validation.cleanedItems;
            levels = buildLevels(validation.cleanedItems);
            dataSource = "csv";
            document.getElementById("home-data-badge").innerText = "📂 vocabulary_full.csv (" + validation.uniqueCount + "字)";
            showView("home");
        } else {
            showValidationError(validation.message);
        }
    } catch (e) {
        console.warn(" fetch 失敗，自動啟用內建備用單字庫：", e);
        loadWithFallback();
    } finally {
        showLoading(false);
    }
}

/**
 * 啟用備用單字庫
 */
function loadWithFallback() {
    document.getElementById("data-error-banner").classList.add("hidden");
    const validation = validateVocabulary(fallbackVocabulary);
    vocabulary = validation.cleanedItems;
    levels = buildLevels(validation.cleanedItems);
    dataSource = "fallback";
    document.getElementById("home-data-badge").innerText = "💡 內建備用單字庫 (" + validation.uniqueCount + "字)";
    showView("home");
}

function showValidationError(msg) {
    document.getElementById("data-error-msg").innerText = msg;
    document.getElementById("data-error-banner").classList.remove("hidden");
    document.getElementById("view-loading").classList.add("hidden");
}

function showLoading(isLoading) {
    const loader = document.getElementById("view-loading");
    if (isLoading) {
        loader.classList.remove("hidden");
    } else {
        loader.classList.add("hidden");
    }
}

/**
 * 2. parseCSV()
 * 將 CSV 字串轉成物件陣列
 */
function parseCSV(csvText) {
    const lines = csvText.split(/\r?\n/);
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim());
    const idIdx = headers.indexOf("ID");
    const wordIdx = headers.indexOf("Word");
    const chineseIdx = headers.indexOf("ChineseMeaning");
    const posIdx = headers.indexOf("PartOfSpeech");
    const rawIdx = headers.indexOf("RawMeaning");
    const pageIdx = headers.indexOf("SourcePage");

    const items = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // 簡易解析 quote 欄位
        const cols = [];
        let current = "";
        let inQuotes = false;
        for (let j = 0; j < line.length; j++) {
            const char = line[j];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                cols.push(current);
                current = "";
            } else {
                current += char;
            }
        }
        cols.push(current);

        const getVal = (idx, fallback = "") => {
            if (idx === -1 || idx >= cols.length) return fallback;
            return cols[idx].trim().replace(/^"|"$/g, "");
        };

        const word = getVal(wordIdx);
        if (word) {
            items.push({
                id: getVal(idIdx, String(i)),
                word: word,
                chineseMeaning: getVal(chineseIdx, getVal(rawIdx, "無")),
                partOfSpeech: getVal(posIdx, "n"),
                rawMeaning: getVal(rawIdx, getVal(chineseIdx)),
                sourcePage: getVal(pageIdx, "1")
            });
        }
    }
    return items;
}

/**
 * 3. validateVocabulary()
 * 檢查單字是否重複、空白
 */
function validateVocabulary(items) {
    let emptyWordCount = 0;
    let emptyMeaningCount = 0;
    const wordMap = new Map();
    let duplicateCount = 0;

    for (const item of items) {
        const trimmedWord = item.word.trim();
        const trimmedMeaning = item.chineseMeaning.trim();

        if (!trimmedWord) {
            emptyWordCount++;
            continue;
        }
        if (!trimmedMeaning) {
            emptyMeaningCount++;
            continue;
        }

        const key = trimmedWord.toLowerCase();
        if (wordMap.has(key)) {
            duplicateCount++;
        } else {
            wordMap.set(key, {
                ...item,
                word: trimmedWord,
                chineseMeaning: trimmedMeaning
            });
        }
    }

    const cleanedItems = Array.from(wordMap.values());
    const uniqueCount = cleanedItems.length;
    const isValid = uniqueCount >= 305 && emptyWordCount === 0 && emptyMeaningCount === 0;

    let message = "";
    if (uniqueCount < 305) {
        message = "單字資料尚未準備完成，請確認 vocabulary_full.csv 是否存在、格式是否正確，且至少包含 305 個不重複單字（目前僅有 " + uniqueCount + " 個不重複單字）。";
    } else if (emptyWordCount > 0 || emptyMeaningCount > 0) {
        message = "資料錯誤：發現 " + emptyWordCount + " 個空白單字與 " + emptyMeaningCount + " 個空白解釋。";
    } else {
        message = "驗證通過！";
    }

    return {
        isValid,
        message,
        duplicateCount,
        emptyWordCount,
        emptyMeaningCount,
        uniqueCount,
        cleanedItems
    };
}

/**
 * Seeded Shuffle algorithm using a robust LCG / Mulberry32 generator
 */
function seededShuffle(array, seed) {
    let h = 179424673;
    for (let i = 0; i < seed.length; i++) {
        h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
        h = (h << 13) | (h >>> 19);
    }

    const lcg = () => {
        let z = (h += 0x6D2B79F5);
        z = Math.imul(z ^ (z >>> 15), z | 1);
        z ^= z + Math.imul(z ^ (z >>> 7), z | 61);
        return ((z ^ (z >>> 14)) >>> 0) / 4294967296;
    };

    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(lcg() * (i + 1));
        const temp = shuffled[i];
        shuffled[i] = shuffled[j];
        shuffled[j] = temp;
    }
    return shuffled;
}

/**
 * 4. buildLevels()
 * 分配 60 個關卡 (分層混合隨機建立)
 */
function buildLevels(items) {
    const list = [];
    
    // Categorization helper
    const getCategory = (item) => {
        const word = item.word.trim();
        const pos = item.partOfSpeech.toLowerCase().trim();

        // 1. Phrase group: PartOfSpeech contains '片' or Word has space
        if (pos.includes("片") || word.includes(" ")) {
            return "phrase";
        }
        // 2. Adjective group: PartOfSpeech contains 'adj'
        if (pos.includes("adj")) {
            return "adj";
        }
        // 3. Adverb group: PartOfSpeech contains 'adv'
        if (pos.includes("adv")) {
            return "adv";
        }
        // 4. Verb group: PartOfSpeech contains 'v', 'vt', 'vi'
        if (pos.includes("vi") || pos.includes("vt") || pos === "v" || pos.startsWith("v") || pos === "vi." || pos === "vt.") {
            return "verb";
        }
        // 5. Noun group: PartOfSpeech contains 'n' (excluding conj)
        if (pos.includes("n") && !pos.includes("conj")) {
            return "noun";
        }
        // 6. Other group
        return "other";
    };

    // Group items
    const nounGroup = [];
    const verbGroup = [];
    const adjectiveGroup = [];
    const adverbGroup = [];
    const phraseGroup = [];
    const otherGroup = [];

    items.forEach(item => {
        const cat = getCategory(item);
        if (cat === "phrase") phraseGroup.push(item);
        else if (cat === "adj") adjectiveGroup.push(item);
        else if (cat === "adv") adverbGroup.push(item);
        else if (cat === "verb") verbGroup.push(item);
        else if (cat === "noun") nounGroup.push(item);
        else otherGroup.push(item);
    });

    // Seeded shuffle each group with fixed seeds
    const nouns = seededShuffle(nounGroup, "vocabulary-quest-noun-seed");
    const verbs = seededShuffle(verbGroup, "vocabulary-quest-verb-seed");
    const adjectives = seededShuffle(adjectiveGroup, "vocabulary-quest-adj-seed");
    const adverbs = seededShuffle(adverbGroup, "vocabulary-quest-adv-seed");
    const phrases = seededShuffle(phraseGroup, "vocabulary-quest-phrase-seed");
    const others = seededShuffle(otherGroup, "vocabulary-quest-other-seed");

    // Convert shuffled groups to queues
    const nounQueue = [...nouns];
    const verbQueue = [...verbs];
    const adjQueue = [...adjectives];
    const phraseQueue = [...phrases];
    const advQueue = [...adverbs];
    const otherQueue = [...others];

    // Master backup pool containing all items shuffled with a seed
    const backupPool = seededShuffle(items, "vocabulary-quest-backup-seed");

    const usedIds = new Set();

    const pullFromQueue = (queue) => {
        while (queue.length > 0) {
            const item = queue.shift();
            if (!usedIds.has(item.id)) {
                usedIds.add(item.id);
                return item;
            }
        }
        return null;
    };

    const pullFallback = () => {
        const fromOther = pullFromQueue(otherQueue);
        if (fromOther) return fromOther;

        while (backupPool.length > 0) {
            const item = backupPool.shift();
            if (!usedIds.has(item.id)) {
                usedIds.add(item.id);
                return item;
            }
        }
        throw new Error("單字庫中的不重複單字不足以分配至 60 個關卡！");
    };

    const categoryCounts = {
        noun: 0,
        verb: 0,
        adj: 0,
        adv: 0,
        phrase: 0,
        other: 0
    };

    const recordCategoryUse = (item) => {
        const cat = getCategory(item);
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    };

    const dayNewWords = {};

    // Assign words for all 60 days
    for (let day = 1; day <= 60; day++) {
        const newWords = [];

        if (day === 1) {
            // Day 1: 10 new words
            // Nouns: 3
            for (let i = 0; i < 3; i++) {
                const item = pullFromQueue(nounQueue) || pullFallback();
                newWords.push(item);
                recordCategoryUse(item);
            }
            // Verbs: 2
            for (let i = 0; i < 2; i++) {
                const item = pullFromQueue(verbQueue) || pullFallback();
                newWords.push(item);
                recordCategoryUse(item);
            }
            // Adjectives: 2
            for (let i = 0; i < 2; i++) {
                const item = pullFromQueue(adjQueue) || pullFallback();
                newWords.push(item);
                recordCategoryUse(item);
            }
            // Adverb or other: 1
            let advOrOther = pullFromQueue(advQueue);
            if (!advOrOther) advOrOther = pullFromQueue(otherQueue);
            if (!advOrOther) advOrOther = pullFallback();
            newWords.push(advOrOther);
            recordCategoryUse(advOrOther);
            // Phrases: 2
            for (let i = 0; i < 2; i++) {
                const item = pullFromQueue(phraseQueue) || pullFallback();
                newWords.push(item);
                recordCategoryUse(item);
            }
        } else {
            // Day 2-60: 5 new words
            // Noun: 1
            const n = pullFromQueue(nounQueue) || pullFallback();
            newWords.push(n);
            recordCategoryUse(n);

            // Verb: 1
            const v = pullFromQueue(verbQueue) || pullFallback();
            newWords.push(v);
            recordCategoryUse(v);

            // Adjective: 1
            const adj = pullFromQueue(adjQueue) || pullFallback();
            newWords.push(adj);
            recordCategoryUse(adj);

            // Phrase: 1
            const ph = pullFromQueue(phraseQueue) || pullFallback();
            newWords.push(ph);
            recordCategoryUse(ph);

            // Other or Adverb: 1
            let otherOrAdv = pullFromQueue(otherQueue);
            if (!otherOrAdv) otherOrAdv = pullFromQueue(advQueue);
            if (!otherOrAdv) otherOrAdv = pullFallback();
            newWords.push(otherOrAdv);
            recordCategoryUse(otherOrAdv);
        }

        dayNewWords[day] = newWords;
    }

    // Build levels with review words
    for (let day = 1; day <= 60; day++) {
        const newWords = dayNewWords[day];

        let reviewWords = [];
        if (day === 2) {
            reviewWords = dayNewWords[1];
        } else if (day > 2) {
            const prevDayNew = dayNewWords[day - 1];
            const beforePrevDayNew = dayNewWords[day - 2];
            reviewWords = [...prevDayNew, ...beforePrevDayNew];
        }

        const quizWords = [...newWords, ...reviewWords];

        list.push({
            day,
            newWords,
            reviewWords,
            quizWords
        });
    }

    // Output check results to console
    console.log("=== 資料檢查與關卡分配數據 ===");
    console.log(`總單字數: ${items.length}`);
    console.log(`不重複單字數: ${items.length}`);
    console.log(`已建立關卡數: ${list.length}`);
    console.log(`已使用新單字數: ${usedIds.size}`);
    console.log("各詞性使用數量:", categoryCounts);

    // Show stats in standalone index.html DOM
    setTimeout(() => {
        const card = document.getElementById("standalone-stats-card");
        if (card) {
            card.classList.remove("hidden");
            document.getElementById("stat-total").innerText = items.length;
            document.getElementById("stat-unique").innerText = items.length;
            document.getElementById("stat-levels").innerText = list.length;
            document.getElementById("stat-used").innerText = usedIds.size;

            document.getElementById("pos-noun").innerText = categoryCounts.noun || 0;
            document.getElementById("pos-verb").innerText = categoryCounts.verb || 0;
            document.getElementById("pos-adj").innerText = categoryCounts.adj || 0;
            document.getElementById("pos-adv").innerText = categoryCounts.adv || 0;
            document.getElementById("pos-phrase").innerText = categoryCounts.phrase || 0;
            document.getElementById("pos-other").innerText = categoryCounts.other || 0;
        }
    }, 0);

    return list;
}

/**
 * 13. loadProgress()
 * 從 localStorage 載入學習進度
 */
function loadProgress() {
    const saved = localStorage.getItem("vocabulary_quest_progress_html5");
    if (saved) {
        try {
            progress = JSON.parse(saved);
        } catch (e) {
            console.error("解析紀錄出錯", e);
            progress = {};
        }
    } else {
        progress = {};
    }
}

/**
 * 11. saveQuizResult()
 * 記錄成績
 */
function saveQuizResult(day, resultScore, correct, wrong, wrongWords) {
    const passed = resultScore >= 80;
    let stars = 0;
    if (resultScore === 100) stars = 3;
    else if (resultScore >= 90) stars = 2;
    else if (resultScore >= 80) stars = 1;

    const prevRecord = progress[day];
    const bestScore = prevRecord ? Math.max(prevRecord.bestScore, resultScore) : resultScore;
    const isNowPassed = prevRecord ? (prevRecord.passed || passed) : passed;
    const bestStars = prevRecord ? Math.max(prevRecord.stars, stars) : stars;

    progress[day] = {
        day,
        lastScore: resultScore,
        bestScore,
        passed: isNowPassed,
        stars: bestStars,
        attemptCount: prevRecord ? prevRecord.attemptCount + 1 : 1,
        correctCount: correct,
        wrongCount: wrong,
        lastPlayedAt: new Date().toLocaleString("zh-TW"),
        wrongWords: wrongWords.map(w => w.word)
    };

    localStorage.setItem("vocabulary_quest_progress_html5", JSON.stringify(progress));
}

/**
 * 15. clearProgress()
 * 清除紀錄
 */
function resetLearnerProgress() {
    const sure = confirm("⚠️ 確定要清除所有天數的單字挑戰成績嗎？");
    if (sure) {
        progress = {};
        localStorage.removeItem("vocabulary_quest_progress_html5");
        alert("🧹 成果進度已清空！");
        showView("map");
    }
}

/**
 * 7. generateQuizQuestions()
 * 產生測驗選擇題
 */
function generateQuizQuestions(words) {
    return words.map(word => {
        const filtered = vocabulary.filter(v => v.word.toLowerCase() !== word.word.toLowerCase());
        const shuffled = shuffleArray([...filtered]);
        const wrongOptions = shuffled.slice(0, 3).map(v => v.chineseMeaning);

        const options = shuffleArray([word.chineseMeaning, ...wrongOptions]);
        return {
            word,
            options,
            correctAnswer: word.chineseMeaning
        };
    });
}

/**
 * 8. shuffleArray()
 * 隨機打亂
 */
function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

/**
 * 語音發音 (TTS)
 */
function speakText(txt) {
    if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(txt);
        utter.lang = "en-US";
        utter.rate = 0.85;
        window.speechSynthesis.speak(utter);
    }
}

// --- 介面渲染與路由控制 ---

function showView(viewId) {
    // 隱藏所有頁面
    document.querySelectorAll(".view").forEach(el => el.classList.add("hidden"));
    document.getElementById("data-error-banner").classList.add("hidden");

    // 顯示指定頁面
    if (viewId === "home") {
        document.getElementById("view-home").classList.remove("hidden");
    } else if (viewId === "map") {
        renderLevelMap();
        document.getElementById("view-map").classList.remove("hidden");
    } else if (viewId === "study") {
        renderStudyPage();
        document.getElementById("view-study").classList.remove("hidden");
    } else if (viewId === "quiz") {
        renderQuizPage();
        document.getElementById("view-quiz").classList.remove("hidden");
    } else if (viewId === "result") {
        document.getElementById("view-result").classList.remove("hidden");
    } else if (viewId === "records") {
        renderRecordsPage();
        document.getElementById("view-records").classList.remove("hidden");
    }

    // 更新導航列按鈕樣式
    document.querySelectorAll(".nav-btn").forEach(btn => {
        btn.classList.remove("bg-amber-400");
        btn.classList.add("bg-white");
    });
    if (viewId === "home") document.querySelectorAll(".nav-btn")[0].classList.add("bg-amber-400");
    if (viewId === "map") document.querySelectorAll(".nav-btn")[1].classList.add("bg-amber-400");
    if (viewId === "records") document.querySelectorAll(".nav-btn")[2].classList.add("bg-amber-400");
}

/**
 * 5. renderLevelMap()
 * 產生 60 關地圖
 */
function renderLevelMap() {
    const grid = document.getElementById("levels-grid");
    grid.innerHTML = "";

    let totalStars = 0;
    let passedCount = 0;

    for (let i = 1; i <= 60; i++) {
        const day = i;
        const rec = progress[day];
        const isFirst = day === 1;
        const isUnlocked = isFirst || (progress[day - 1] && progress[day - 1].passed);
        const isPassed = rec && rec.passed;
        const stars = rec ? rec.stars : 0;
        const score = rec ? rec.bestScore : 0;

        if (isPassed) passedCount++;
        totalStars += stars;

        const btn = document.createElement("button");
        btn.className = `relative h-24 rounded-2xl border-4 shadow-sm flex flex-col items-center justify-between py-2 px-1 transition-all cursor-pointer ${
            isPassed 
                ? "bg-emerald-400 border-emerald-950 text-emerald-950" 
                : isUnlocked 
                    ? "bg-amber-300 border-amber-950 text-amber-950 animate-bounce-slow" 
                    : "bg-slate-200 border-slate-400 text-slate-400 opacity-60 cursor-not-allowed"
        }`;

        btn.onclick = () => {
            if (!isUnlocked) {
                alert("🔒 請先通過前一關（達到 80 分以上），再來挑戰這一關！加油！");
                return;
            }
            currentDay = day;
            currentCardIndex = 0;
            isFlipped = false;
            
            const levelData = levels.find(l => l.day === day);
            if (levelData && levelData.reviewWords.length > 0) {
                activeTab = "review";
            } else {
                activeTab = "new";
            }
            showView("study");
        };

        btn.innerHTML = `
            <div class="text-xs font-black uppercase tracking-wider">Day ${day}</div>
            <div class="my-auto flex gap-0.5">
                ${isPassed 
                    ? Array.from({ length: 3 }).map((_, s) => `<span class="text-sm ${s < stars ? "" : "opacity-30"}">⭐</span>`).join("")
                    : isUnlocked ? `<span class="text-xs bg-amber-400 text-amber-900 border border-slate-800 px-1.5 rounded-full font-bold">挑戰</span>` : `<span class="text-xs">🔒</span>`
                }
            </div>
            <div class="text-[10px] font-bold">
                ${isPassed ? `最佳:${score}分` : isUnlocked ? "可挑戰" : "未解鎖"}
            </div>
        `;
        grid.appendChild(btn);
    }

    const progressPercentage = Math.round((passedCount / 60) * 100);
    document.getElementById("map-stars-count").innerText = totalStars;
    document.getElementById("map-progress-percent").innerText = passedCount + " / 60 關 (" + progressPercentage + "%)";
    document.getElementById("map-bar-percent").innerText = progressPercentage + "%";
    document.getElementById("map-progress-bar-fill").style.width = progressPercentage + "%";
}

/**
 * 6. renderStudyPage()
 * 學習單字頁面
 */
function renderStudyPage() {
    const levelData = levels.find(l => l.day === currentDay);
    if (!levelData) return;

    document.getElementById("study-level-title").innerText = "Day " + currentDay + " 任務解密";

    const hasReview = levelData.reviewWords.length > 0;
    const tabs = document.getElementById("study-tabs-container");
    
    if (!hasReview) {
        tabs.classList.add("hidden");
        activeTab = "new";
    } else {
        tabs.classList.remove("hidden");
    }

    updateStudyTabButtons();
    renderFlashcard();
}

function updateStudyTabButtons() {
    const rBtn = document.getElementById("tab-btn-review");
    const nBtn = document.getElementById("tab-btn-new");

    rBtn.className = "py-2 rounded-lg text-center transition-all cursor-pointer";
    nBtn.className = "py-2 rounded-lg text-center transition-all cursor-pointer";

    if (activeTab === "review") {
        rBtn.className += " bg-sky-400 border border-slate-950 text-slate-950";
        nBtn.className += " bg-white text-slate-500";
        document.getElementById("study-tip-banner").innerHTML = "💡 正在複習前一天的單字，先熟練它們，打好基礎！";
    } else {
        nBtn.className += " bg-amber-400 border border-slate-950 text-slate-950";
        rBtn.className += " bg-white text-slate-500";
        document.getElementById("study-tip-banner").innerHTML = "🚀 正在背誦今日全新單字，完成後即可發起挑戰測驗！";
    }
}

function toggleStudyTab(tab) {
    activeTab = tab;
    currentCardIndex = 0;
    isFlipped = false;
    document.getElementById("study-card-flipper").classList.remove("flipped");
    updateStudyTabButtons();
    renderFlashcard();
}

function renderFlashcard() {
    const levelData = levels.find(l => l.day === currentDay);
    const activeWords = activeTab === "review" ? levelData.reviewWords : levelData.newWords;
    const word = activeWords[currentCardIndex];

    document.getElementById("study-card-counter").innerText = "進度：" + (currentCardIndex + 1) + " / " + activeWords.length + " 字";

    if (word) {
        document.getElementById("study-card-word").innerText = word.word;
        document.getElementById("study-card-word-back").innerText = word.word;
        document.getElementById("study-card-pos").innerText = "[" + word.partOfSpeech + "]";
        document.getElementById("study-card-pos-back").innerText = "[" + word.partOfSpeech + "] 詞性";
        document.getElementById("study-card-meaning").innerText = word.chineseMeaning;
        document.getElementById("study-card-page-front").innerText = "p." + word.sourcePage;
        document.getElementById("study-card-page-back").innerText = "p." + word.sourcePage;
    }

    // 控制下一張、上一張按鈕狀態
    document.getElementById("study-btn-prev").disabled = currentCardIndex === 0;
    document.getElementById("study-btn-prev").style.opacity = currentCardIndex === 0 ? "0.4" : "1";
    document.getElementById("study-btn-next").disabled = currentCardIndex === activeWords.length - 1;
    document.getElementById("study-btn-next").style.opacity = currentCardIndex === activeWords.length - 1 ? "0.4" : "1";
}

function flipCard() {
    isFlipped = !isFlipped;
    const flipper = document.getElementById("study-card-flipper");
    if (isFlipped) {
        flipper.classList.add("flipped");
    } else {
        flipper.classList.remove("flipped");
    }
}

function prevCard() {
    if (currentCardIndex > 0) {
        isFlipped = false;
        document.getElementById("study-card-flipper").classList.remove("flipped");
        setTimeout(() => {
            currentCardIndex--;
            renderFlashcard();
        }, 150);
    }
}

function nextCard() {
    const levelData = levels.find(l => l.day === currentDay);
    const activeWords = activeTab === "review" ? levelData.reviewWords : levelData.newWords;
    if (currentCardIndex < activeWords.length - 1) {
        isFlipped = false;
        document.getElementById("study-card-flipper").classList.remove("flipped");
        setTimeout(() => {
            currentCardIndex++;
            renderFlashcard();
        }, 150);
    }
}

function speakCurrentWord() {
    const levelData = levels.find(l => l.day === currentDay);
    const activeWords = activeTab === "review" ? levelData.reviewWords : levelData.newWords;
    const word = activeWords[currentCardIndex];
    if (word) speakText(word.word);
}

/**
 * 8. renderQuizPage()
 * 測驗畫面控制
 */
function startLevelQuiz() {
    const levelData = levels.find(l => l.day === currentDay);
    if (!levelData) return;

    quizQuestions = shuffleArray(generateQuizQuestions(levelData.quizWords));
    currentQuestionIndex = 0;
    selectedAnswer = null;
    hasAnswered = false;
    correctCount = 0;
    wrongCount = 0;
    wrongWordsInQuiz = [];

    showView("quiz");
}

function renderQuizPage() {
    if (quizQuestions.length === 0) return;

    const currentQ = quizQuestions[currentQuestionIndex];
    document.getElementById("quiz-level-label").innerText = "Day " + currentDay + " 試煉";
    document.getElementById("quiz-question-counter").innerText = "第 " + (currentQuestionIndex + 1) + " / " + quizQuestions.length + " 題";
    document.getElementById("quiz-correct-count").innerText = correctCount + " 題";

    document.getElementById("quiz-card-word").innerText = currentQ.word.word;
    document.getElementById("quiz-card-pos").innerText = "[" + currentQ.word.partOfSpeech + "]";

    // 渲染 4 個選項
    const optionsGrid = document.getElementById("quiz-options-container");
    optionsGrid.innerHTML = "";

    currentQ.options.forEach((option, idx) => {
        const btn = document.createElement("button");
        btn.className = "w-full p-4 rounded-xl border-4 border-slate-950 bg-white font-bold text-left flex justify-between items-center transition-all cursor-pointer";
        btn.id = "opt-btn-" + idx;
        btn.onclick = () => selectQuizOption(option, idx);
        btn.innerHTML = `
            <div class="flex items-center gap-2">
                <span class="bg-slate-100 border-2 border-slate-300 w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs">${String.fromCharCode(65 + idx)}</span>
                <span>${option}</span>
            </div>
        `;
        optionsGrid.appendChild(btn);
    });

    document.getElementById("quiz-answer-alert").classList.add("hidden");
}

function speakQuizWord() {
    const currentQ = quizQuestions[currentQuestionIndex];
    if (currentQ) speakText(currentQ.word.word);
}

function selectQuizOption(option, idx) {
    if (hasAnswered) return;
    hasAnswered = true;
    selectedAnswer = option;

    const currentQ = quizQuestions[currentQuestionIndex];
    const isCorrect = option === currentQ.correctAnswer;

    // 立即顯示對錯
    if (isCorrect) {
        correctCount++;
        document.getElementById("opt-btn-" + idx).className += " bg-emerald-100 border-emerald-950";
        document.getElementById("quiz-answer-alert").className = "p-4 rounded-2xl border-4 border-emerald-950 bg-emerald-100 text-emerald-900 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4";
        document.getElementById("quiz-alert-emoji").innerText = "🎉";
        document.getElementById("quiz-alert-title").innerText = "回答正確！太棒了！";
    } else {
        wrongCount++;
        wrongWordsInQuiz.push(currentQ.word);
        document.getElementById("opt-btn-" + idx).className += " bg-rose-100 border-rose-950";
        document.getElementById("quiz-answer-alert").className = "p-4 rounded-2xl border-4 border-rose-950 bg-rose-100 text-rose-900 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4";
        document.getElementById("quiz-alert-emoji").innerText = "😭";
        document.getElementById("quiz-alert-title").innerText = "回答錯誤！繼續努力！";
    }

    // 標註正確解答
    currentQ.options.forEach((opt, sIdx) => {
        if (opt === currentQ.correctAnswer && sIdx !== idx) {
            document.getElementById("opt-btn-" + sIdx).className += " bg-emerald-100 border-emerald-950 text-emerald-950";
        }
    });

    document.getElementById("quiz-alert-body").innerHTML = "<strong>" + currentQ.word.word + "</strong> 的正確中文意思是：<strong>" + currentQ.correctAnswer + "</strong>";
    document.getElementById("quiz-answer-alert").classList.remove("hidden");
}

function nextQuizQuestion() {
    const nextIdx = currentQuestionIndex + 1;
    if (nextIdx < quizQuestions.length) {
        currentQuestionIndex = nextIdx;
        selectedAnswer = null;
        hasAnswered = false;
        renderQuizPage();
    } else {
        // 測驗結束，儲存成果
        const totalQuiz = quizQuestions.length;
        const finalScore = Math.round((correctCount / totalQuiz) * 100);
        saveQuizResult(currentDay, finalScore, correctCount, wrongCount, wrongWordsInQuiz);
        showQuizResultScreen(finalScore);
    }
}

/**
 * 10. 顯示測驗結果畫面
 */
function showQuizResultScreen(score) {
    const passed = score >= 80;
    
    // 計算星星
    let stars = 0;
    if (score === 100) stars = 3;
    else if (score >= 90) stars = 2;
    else if (score >= 80) stars = 1;

    // 狀態標章
    const badge = document.getElementById("result-status-badge");
    badge.innerHTML = passed ? "🏆" : "🌱";
    badge.className = passed ? "bg-emerald-100 border-2 border-slate-950 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 text-3xl animate-bounce-slow" : "bg-slate-100 border-2 border-slate-950 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 text-3xl";

    document.getElementById("result-title").innerText = passed ? "🎉 恭喜通關！" : "💪 再接再厲！";
    document.getElementById("result-level-subtitle").innerText = "Day " + currentDay + " 關卡測驗成績";
    document.getElementById("result-score-num").innerHTML = score + "<span class='text-sm'>分</span>";

    // 星星圖示
    const starContainer = document.getElementById("result-stars-container");
    starContainer.innerHTML = "";
    if (passed) {
        for (let s = 1; s <= 3; s++) {
            const star = document.createElement("span");
            star.className = "text-4xl";
            star.innerText = s <= stars ? "⭐" : "⚪";
            starContainer.appendChild(star);
        }
    } else {
        starContainer.innerHTML = "<span class='text-sm text-slate-400 font-bold'>達到 80 分以上即可解鎖星星並開啟下一關！</span>";
    }

    document.getElementById("result-stat-correct").innerText = correctCount;
    document.getElementById("result-stat-wrong").innerText = wrongCount;

    // 鼓勵字詞
    let encouragement = "";
    if (passed) {
        encouragement = score === 100 ? "💯 完美大滿貫！你獲得最高榮譽 3 顆星獎章！" : "表現出色！你已經解鎖了下一關，請繼續保持這股熱情！";
    } else {
        encouragement = "可惜未達到 80 分門檻，沒關係，這是一場與自己的冒險！點擊「重新練習」翻看單字卡，再挑戰一次吧！";
    }
    document.getElementById("result-encouragement").innerText = encouragement;

    // 錯字回顧
    const wrongBox = document.getElementById("result-wrong-words-box");
    const wrongList = document.getElementById("result-wrong-words-list");
    wrongList.innerHTML = "";

    if (wrongWordsInQuiz.length > 0) {
        wrongBox.classList.remove("hidden");
        wrongWordsInQuiz.forEach(word => {
            const div = document.createElement("div");
            div.className = "bg-white border border-rose-200 px-3 py-1.5 rounded-lg flex justify-between items-center text-xs font-bold";
            div.innerHTML = `
                <div>
                    <span class="text-slate-800">${word.word}</span>
                    <span class="text-slate-400 font-mono ml-1">[${word.partOfSpeech}]</span>
                </div>
                <span class="text-rose-700">${word.chineseMeaning}</span>
            `;
            wrongList.appendChild(div);
        });
    } else {
        wrongBox.classList.add("hidden");
    }

    showView("result");
}

function restartStudy() {
    currentCardIndex = 0;
    isFlipped = false;
    document.getElementById("study-card-flipper").classList.remove("flipped");
    showView("study");
}

/**
 * 14. renderRecordsPage()
 * 學習紀錄報表頁面
 */
function renderRecordsPage() {
    const list = Object.values(progress).sort((a, b) => a.day - b.day);

    let totalStars = 0;
    let passedCount = 0;
    let attemptsCount = 0;

    const tbody = document.getElementById("records-table-body");
    tbody.innerHTML = "";

    list.forEach(rec => {
        totalStars += rec.stars;
        if (rec.passed) passedCount++;
        attemptsCount += rec.attemptCount;

        const tr = document.createElement("tr");
        tr.className = "border-b border-slate-100 hover:bg-slate-50 transition-all";
        tr.innerHTML = `
            <td class="py-3 px-3 font-display font-black text-slate-800">Day ${rec.day}</td>
            <td class="py-3 px-3 text-center">
                <span class="px-2 py-0.5 rounded-full text-[10px] ${rec.passed ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}">
                    ${rec.passed ? "已通關" : "未通關"}
                </span>
            </td>
            <td class="py-3 px-3 text-center font-mono text-slate-700">${rec.bestScore} 分</td>
            <td class="py-3 px-3 text-center font-mono text-slate-500">${rec.lastScore} 分</td>
            <td class="py-3 px-3 text-center font-mono text-slate-500">${rec.attemptCount}</td>
            <td class="py-3 px-3 text-center">
                ${Array.from({ length: 3 }).map((_, s) => s < rec.stars ? "⭐" : "⚪").join("")}
            </td>
            <td class="py-3 px-3">
                ${rec.wrongWords && rec.wrongWords.length > 0 
                    ? `<span class="bg-rose-50 text-rose-700 px-2 py-1 rounded text-[10px] inline-block font-mono">${rec.wrongWords.join(", ")}</span>` 
                    : `<span class="text-slate-400 text-[10px]">無錯題</span>`}
            </td>
            <td class="py-3 px-3 text-right text-slate-400 text-[10px]">${rec.lastPlayedAt}</td>
        `;
        tbody.appendChild(tr);
    });

    if (list.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center py-8 text-slate-400 font-bold">
                    🐾 還沒有測驗紀錄喔！請先通關挑戰吧！
                </td>
            </tr>
        `;
    }

    const progressPercentage = Math.round((passedCount / 60) * 100);
    document.getElementById("record-stat-passed").innerText = passedCount + " 關";
    document.getElementById("record-stat-stars").innerText = totalStars + " 顆";
    document.getElementById("record-stat-progress").innerText = progressPercentage + "%";
    document.getElementById("record-stat-attempts").innerText = attemptsCount + " 次";
}
