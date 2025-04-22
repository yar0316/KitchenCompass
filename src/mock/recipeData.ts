// src/mock/recipeData.ts

export interface RecipeIngredient {
  id: string;
  name: string;
  amount: string;
  unit: string;
}

export interface RecipeStep {
  id: string;
  description: string;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  cookingTime: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  servings?: number;
  prepTime?: number;
  category?: string;
  tags: string[];
  rating?: number;
  createdAt: string;
  ingredients?: RecipeIngredient[];
  steps?: RecipeStep[];
}

// グレーのダミー画像URL（実際のデプロイ時には差し替える）
export const DUMMY_IMAGE_URL = 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 width%3D%22320%22 height%3D%22180%22 viewBox%3D%220 0 320 180%22 fill%3D%22%23e0e0e0%22%3E%3Crect width%3D%22320%22 height%3D%22180%22%2F%3E%3C%2Fsvg%3E';

export const MOCK_RECIPES = [
  {
    id: '1',
    name: '簡単トマトパスタ',
    description: '短時間で作れる美味しいトマトパスタのレシピです。材料も少なく、初心者でも簡単に作ることができます。',
    imageUrl: DUMMY_IMAGE_URL,
    cookingTime: 15,
    prepTime: 5,
    servings: 2,
    category: 'main',
    tags: ['イタリアン', '主食', '簡単', '初心者向け'],
    createdAt: '2025-04-01T09:00:00Z',
    ingredients: [
      { id: '1-1', name: 'スパゲッティ', amount: '200', unit: 'g' },
      { id: '1-2', name: 'オリーブオイル', amount: '大さじ', unit: '2' },
      { id: '1-3', name: 'ニンニク', amount: '1', unit: '片' },
      { id: '1-4', name: 'ホールトマト缶', amount: '1', unit: '缶' },
      { id: '1-5', name: '塩', amount: '小さじ', unit: '1/2' },
      { id: '1-6', name: '黒胡椒', amount: '適量', unit: '' },
      { id: '1-7', name: 'バジル（生または乾燥）', amount: '適量', unit: '' }
    ],
    steps: [
      { id: '1-1', description: '鍋に湯を沸かし、塩を加えてスパゲッティを表示時間通りに茹でる' },
      { id: '1-2', description: 'フライパンにオリーブオイルを熱し、みじん切りにしたニンニクを軽く炒める' },
      { id: '1-3', description: '香りが出たらホールトマト缶を加え、潰しながら中火で10分程煮込む' },
      { id: '1-4', description: '塩、黒胡椒で味を調える' },
      { id: '1-5', description: '茹で上がったパスタを加えて全体に絡める' },
      { id: '1-6', description: '器に盛り、バジルを飾って完成' }
    ]
  },
  {
    id: '2',
    name: 'あっさり和風サラダ',
    description: '新鮮な野菜を使ったヘルシーな和風サラダです。さっぱりとした味付けで、どんな料理にも合わせやすいです。',
    imageUrl: DUMMY_IMAGE_URL,
    cookingTime: 10,
    prepTime: 10,
    servings: 4,
    category: 'salad',
    tags: ['和食', 'サラダ', 'ヘルシー', 'ベジタリアン'],
    createdAt: '2025-04-02T10:15:00Z',
    ingredients: [
      { id: '2-1', name: 'レタス', amount: '1/2', unit: '個' },
      { id: '2-2', name: 'きゅうり', amount: '1', unit: '本' },
      { id: '2-3', name: 'プチトマト', amount: '8', unit: '個' },
      { id: '2-4', name: 'わかめ（乾燥）', amount: '10', unit: 'g' },
      { id: '2-5', name: '醤油', amount: '大さじ', unit: '1' },
      { id: '2-6', name: '酢', amount: '大さじ', unit: '1' },
      { id: '2-7', name: 'ごま油', amount: '小さじ', unit: '1' },
      { id: '2-8', name: '白いりごま', amount: '小さじ', unit: '1' }
    ],
    steps: [
      { id: '2-1', description: 'わかめを水で戻し、食べやすい大きさに切る' },
      { id: '2-2', description: 'レタスを手でちぎり、きゅうりを薄切りにし、プチトマトを半分に切る' },
      { id: '2-3', description: '醤油、酢、ごま油を混ぜてドレッシングを作る' },
      { id: '2-4', description: 'ボウルに野菜とわかめを入れ、ドレッシングをかけて和える' },
      { id: '2-5', description: '器に盛り、白いりごまをふりかけて完成' }
    ]
  },
  {
    id: '3',
    name: 'ふわふわオムレツ',
    description: 'バターの香りとふわふわ食感が特徴的な基本のオムレツです。朝食にぴったりの一品です。',
    imageUrl: DUMMY_IMAGE_URL,
    cookingTime: 5,
    prepTime: 5,
    servings: 1,
    category: 'main',
    tags: ['朝食', '卵料理', '簡単', '洋食'],
    createdAt: '2025-04-03T08:30:00Z',
    ingredients: [
      { id: '3-1', name: '卵', amount: '2', unit: '個' },
      { id: '3-2', name: '牛乳', amount: '大さじ', unit: '1' },
      { id: '3-3', name: 'バター', amount: '10', unit: 'g' },
      { id: '3-4', name: '塩', amount: '少々', unit: '' },
      { id: '3-5', name: '黒胡椒', amount: '少々', unit: '' },
      { id: '3-6', name: 'パセリ（あれば）', amount: '適量', unit: '' }
    ],
    steps: [
      { id: '3-1', description: 'ボウルに卵を割り入れ、牛乳、塩、こしょうを加えて混ぜる' },
      { id: '3-2', description: 'フライパンにバターを熱し、溶けたら卵液を一気に流し入れる' },
      { id: '3-3', description: '箸やフォークで全体をかき混ぜながら、半熟状になったら火を弱める' },
      { id: '3-4', description: '片側に寄せるようにして形を整え、フライパンを傾けて滑らせるように折りたたむ' },
      { id: '3-5', description: '器に盛り、必要に応じてパセリを散らして完成' }
    ]
  },
  {
    id: '4',
    name: '基本の肉じゃが',
    description: '日本の家庭料理の定番、肉じゃがのレシピです。ほっとする味わいで、作り置きにも向いています。',
    imageUrl: DUMMY_IMAGE_URL,
    cookingTime: 30,
    prepTime: 15,
    servings: 4,
    category: 'main',
    tags: ['和食', '定番', '煮物', '肉料理'],
    createdAt: '2025-04-04T14:20:00Z',
    ingredients: [
      { id: '4-1', name: '豚バラ肉（または牛肉）', amount: '200', unit: 'g' },
      { id: '4-2', name: 'じゃがいも', amount: '3', unit: '個' },
      { id: '4-3', name: '玉ねぎ', amount: '1', unit: '個' },
      { id: '4-4', name: 'にんじん', amount: '1/2', unit: '本' },
      { id: '4-5', name: 'しらたき', amount: '1', unit: '袋' },
      { id: '4-6', name: '醤油', amount: '大さじ', unit: '3' },
      { id: '4-7', name: '酒', amount: '大さじ', unit: '2' },
      { id: '4-8', name: 'みりん', amount: '大さじ', unit: '2' },
      { id: '4-9', name: '砂糖', amount: '大さじ', unit: '1' },
      { id: '4-10', name: '和風だしの素', amount: '小さじ', unit: '2' },
      { id: '4-11', name: '水', amount: '400', unit: 'ml' },
      { id: '4-12', name: 'サラダ油', amount: '大さじ', unit: '1' }
    ],
    steps: [
      { id: '4-1', description: 'じゃがいもは皮をむいて一口大に切り、水にさらす。玉ねぎはくし切り、にんじんは乱切りにする' },
      { id: '4-2', description: 'しらたきは下茹でし、食べやすい長さに切る' },
      { id: '4-3', description: '鍋に油を熱し、肉を炒める。色が変わったら玉ねぎを加えてさらに炒める' },
      { id: '4-4', description: 'にんじん、水気を切ったじゃがいも、しらたきを加え、全体に油が回ったら水を加える' },
      { id: '4-5', description: '沸騰したらアクを取り、だしの素、酒、みりん、砂糖、醤油を加える' },
      { id: '4-6', description: '落とし蓋をして中火で15〜20分煮込み、じゃがいもに火が通ったら完成' }
    ]
  },
  {
    id: '5',
    name: 'さっぱりレモンチキン',
    description: 'レモンの風味が爽やかな鶏肉料理です。さっぱりとしているので暑い季節にもおすすめです。',
    imageUrl: DUMMY_IMAGE_URL,
    cookingTime: 20,
    prepTime: 10,
    servings: 2,
    category: 'main',
    tags: ['肉料理', '鶏肉', 'さっぱり', '洋食'],
    createdAt: '2025-04-05T18:45:00Z',
    ingredients: [
      { id: '5-1', name: '鶏むね肉', amount: '1', unit: '枚' },
      { id: '5-2', name: 'レモン', amount: '1', unit: '個' },
      { id: '5-3', name: 'にんにく', amount: '1', unit: '片' },
      { id: '5-4', name: 'オリーブオイル', amount: '大さじ', unit: '2' },
      { id: '5-5', name: '塩', amount: '小さじ', unit: '1/2' },
      { id: '5-6', name: '黒こしょう', amount: '少々', unit: '' },
      { id: '5-7', name: '砂糖', amount: '小さじ', unit: '1/2' },
      { id: '5-8', name: 'パセリ（みじん切り）', amount: '適量', unit: '' },
      { id: '5-9', name: 'ベビーリーフ', amount: '適量', unit: '' }
    ],
    steps: [
      { id: '5-1', description: '鶏むね肉は厚みを均一にし、塩、こしょうで下味をつける' },
      { id: '5-2', description: 'レモンは半分は薄切りにし、残り半分は絞ってレモン汁を作る' },
      { id: '5-3', description: 'にんにくはみじん切りにする' },
      { id: '5-4', description: 'フライパンにオリーブオイルとにんにくを入れ、弱火で香りを出す' },
      { id: '5-5', description: '鶏むね肉を入れて両面に焼き色がつくまで焼く' },
      { id: '5-6', description: 'レモン汁、砂糖を加えて味を調える' },
      { id: '5-7', description: 'レモンの薄切りを加えてさらに1分程度煮る' },
      { id: '5-8', description: '器にベビーリーフを敷き、鶏肉を盛り付け、ソースをかけ、パセリを散らして完成' }
    ]
  },
  {
    id: '6',
    name: '基本の味噌汁',
    description: '日本の食卓に欠かせない味噌汁の基本レシピです。具材はお好みで変えられます。',
    imageUrl: DUMMY_IMAGE_URL,
    cookingTime: 10,
    prepTime: 5,
    servings: 2,
    category: 'soup',
    tags: ['和食', '汁物', '基本', '定番'],
    createdAt: '2025-04-06T07:30:00Z',
    ingredients: [
      { id: '6-1', name: '水', amount: '400', unit: 'ml' },
      { id: '6-2', name: 'だし昆布', amount: '5', unit: 'cm' },
      { id: '6-3', name: 'かつお節', amount: '5', unit: 'g' },
      { id: '6-4', name: '味噌', amount: '大さじ', unit: '2' },
      { id: '6-5', name: '豆腐', amount: '1/4', unit: '丁' },
      { id: '6-6', name: 'わかめ（乾燥）', amount: '5', unit: 'g' },
      { id: '6-7', name: '長ねぎ', amount: '1/4', unit: '本' }
    ],
    steps: [
      { id: '6-1', description: '鍋に水と昆布を入れ、弱火で10分程度温める（沸騰させない）' },
      { id: '6-2', description: '昆布を取り出し、かつお節を加えて沸騰させる。沸騰したらすぐに火を止める' },
      { id: '6-3', description: 'かつお節が沈んだら、ていねいに濾す' },
      { id: '6-4', description: '出来上がっただし汁に、一口大に切った豆腐を加えて温める' },
      { id: '6-5', description: '戻したわかめ、小口切りにした長ねぎを加える' },
      { id: '6-6', description: '火を止め、味噌を溶き入れて完成' }
    ]
  },
  {
    id: '7',
    name: '簡単ガーリックチャーハン',
    description: 'ニンニクの香りが食欲をそそる、シンプルながら美味しいチャーハンです。',
    imageUrl: DUMMY_IMAGE_URL,
    cookingTime: 15,
    prepTime: 5,
    servings: 2,
    category: 'main',
    tags: ['中華', '主食', '簡単', 'ご飯もの'],
    createdAt: '2025-04-07T12:15:00Z',
    ingredients: [
      { id: '7-1', name: 'ご飯（冷やご飯が理想）', amount: '300', unit: 'g' },
      { id: '7-2', name: 'にんにく', amount: '2', unit: '片' },
      { id: '7-3', name: '長ねぎ', amount: '1/2', unit: '本' },
      { id: '7-4', name: '卵', amount: '2', unit: '個' },
      { id: '7-5', name: 'ハム', amount: '2', unit: '枚' },
      { id: '7-6', name: '塩', amount: '小さじ', unit: '1/2' },
      { id: '7-7', name: '醤油', amount: '小さじ', unit: '2' },
      { id: '7-8', name: 'こしょう', amount: '少々', unit: '' },
      { id: '7-9', name: 'サラダ油', amount: '大さじ', unit: '2' }
    ],
    steps: [
      { id: '7-1', description: 'にんにくはみじん切り、長ねぎは小口切り、ハムは1cm角に切る' },
      { id: '7-2', description: '卵は溶いておく' },
      { id: '7-3', description: 'フライパンに油を熱し、にんにくを弱火で炒める。香りが出たら強火にする' },
      { id: '7-4', description: '溶き卵を加え、半熟状になったらハムを加えて炒める' },
      { id: '7-5', description: 'ご飯を加えて粒をほぐしながら炒め、塩、醤油、こしょうで味を調える' },
      { id: '7-6', description: '最後に長ねぎを加えて混ぜ、香りが出たら火を止めて完成' }
    ]
  },
  {
    id: '8',
    name: '具だくさん野菜スープ',
    description: '栄養たっぷりの野菜スープです。冷蔵庫にある野菜で簡単に作れます。',
    imageUrl: DUMMY_IMAGE_URL,
    cookingTime: 25,
    prepTime: 15,
    servings: 4,
    category: 'soup',
    tags: ['スープ', 'ヘルシー', '野菜', 'ベジタリアン'],
    createdAt: '2025-04-08T17:30:00Z',
    ingredients: [
      { id: '8-1', name: 'たまねぎ', amount: '1', unit: '個' },
      { id: '8-2', name: 'にんじん', amount: '1', unit: '本' },
      { id: '8-3', name: 'じゃがいも', amount: '2', unit: '個' },
      { id: '8-4', name: 'セロリ', amount: '1', unit: '本' },
      { id: '8-5', name: 'キャベツ', amount: '2', unit: '枚' },
      { id: '8-6', name: 'コンソメキューブ', amount: '2', unit: '個' },
      { id: '8-7', name: '水', amount: '1.5', unit: 'L' },
      { id: '8-8', name: '塩・こしょう', amount: '適量', unit: '' },
      { id: '8-9', name: 'オリーブオイル', amount: '大さじ', unit: '1' },
      { id: '8-10', name: 'パセリ（みじん切り）', amount: '適量', unit: '' }
    ],
    steps: [
      { id: '8-1', description: '野菜はすべて一口大に切る' },
      { id: '8-2', description: '鍋にオリーブオイルを熱し、玉ねぎを透き通るまで炒める' },
      { id: '8-3', description: 'にんじん、じゃがいも、セロリを加えて2〜3分炒める' },
      { id: '8-4', description: '水を加え、沸騰したらアクを取り、コンソメキューブを加える' },
      { id: '8-5', description: '野菜が柔らかくなるまで15分程度煮る' },
      { id: '8-6', description: 'キャベツを加え、さらに3分程度煮る' },
      { id: '8-7', description: '塩・こしょうで味を調え、器に盛り、パセリを散らして完成' }
    ]
  },
  {
    id: '9',
    name: 'チョコチップクッキー',
    description: 'サクサク食感のチョコチップクッキーです。おやつや贈り物にぴったりです。',
    imageUrl: DUMMY_IMAGE_URL,
    cookingTime: 15,
    prepTime: 30,
    servings: 20,
    category: 'dessert',
    tags: ['デザート', 'おやつ', '焼き菓子', '甘い'],
    createdAt: '2025-04-09T10:00:00Z',
    ingredients: [
      { id: '9-1', name: '薄力粉', amount: '180', unit: 'g' },
      { id: '9-2', name: 'ベーキングパウダー', amount: '小さじ', unit: '1/2' },
      { id: '9-3', name: 'バター（常温に戻す）', amount: '80', unit: 'g' },
      { id: '9-4', name: '砂糖', amount: '80', unit: 'g' },
      { id: '9-5', name: '卵', amount: '1', unit: '個' },
      { id: '9-6', name: 'バニラエッセンス', amount: '少々', unit: '' },
      { id: '9-7', name: 'チョコチップ', amount: '100', unit: 'g' },
      { id: '9-8', name: '塩', amount: '少々', unit: '' }
    ],
    steps: [
      { id: '9-1', description: 'オーブンを170℃に予熱する' },
      { id: '9-2', description: '薄力粉、ベーキングパウダー、塩を合わせてふるっておく' },
      { id: '9-3', description: 'バターをクリーム状に練り、砂糖を少しずつ加えて白っぽくなるまで混ぜる' },
      { id: '9-4', description: '卵を加えて混ぜ、バニラエッセンスを加える' },
      { id: '9-5', description: 'ふるった粉類を加えてさっくりと混ぜ、最後にチョコチップを加える' },
      { id: '9-6', description: 'クッキングシートを敷いた天板に一口大の生地を間隔を開けて置く' },
      { id: '9-7', description: '170℃のオーブンで12〜15分、端が色づくまで焼く' },
      { id: '9-8', description: '焼きあがったら網の上で冷まして完成' }
    ]
  },
  {
    id: '10',
    name: 'アボカドサラダ',
    description: '濃厚なアボカドを使った栄養満点のサラダです。シンプルな味付けで素材の美味しさを楽しめます。',
    imageUrl: DUMMY_IMAGE_URL,
    cookingTime: 10,
    prepTime: 5,
    servings: 2,
    category: 'salad',
    tags: ['サラダ', 'ヘルシー', 'アボカド', '簡単'],
    createdAt: '2025-04-10T13:45:00Z',
    ingredients: [
      { id: '10-1', name: 'アボカド', amount: '1', unit: '個' },
      { id: '10-2', name: 'ミニトマト', amount: '6', unit: '個' },
      { id: '10-3', name: 'きゅうり', amount: '1/2', unit: '本' },
      { id: '10-4', name: '赤玉ねぎ', amount: '1/4', unit: '個' },
      { id: '10-5', name: 'レモン汁', amount: '大さじ', unit: '1' },
      { id: '10-6', name: 'オリーブオイル', amount: '大さじ', unit: '2' },
      { id: '10-7', name: '塩', amount: '小さじ', unit: '1/4' },
      { id: '10-8', name: '黒こしょう', amount: '少々', unit: '' },
      { id: '10-9', name: '(オプション) フェタチーズ', amount: '30', unit: 'g' }
    ],
    steps: [
      { id: '10-1', description: 'アボカドは皮と種を取り除き、一口大に切る' },
      { id: '10-2', description: 'ミニトマトは半分に切り、きゅうりは薄切りにする' },
      { id: '10-3', description: '赤玉ねぎは薄切りにし、水にさらしておく' },
      { id: '10-4', description: 'レモン汁、オリーブオイル、塩、こしょうを混ぜてドレッシングを作る' },
      { id: '10-5', description: 'ボウルに全ての野菜を入れ、ドレッシングをかけて優しく和える' },
      { id: '10-6', description: '器に盛り、お好みでフェタチーズをちらして完成' }
    ]
  }
];