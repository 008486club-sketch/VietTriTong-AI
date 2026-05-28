/**
 * 越智通AI · Prompt 模板库
 * 
 * 中文 + 越南语 双语言模板，按行业/场景分类
 * 用于 Seedance 2.0 视频生成 prompt 优化
 */

export type Industry = 'restaurant' | 'fashion' | 'beauty' | 'tech' | 'realestate' | 'education' | 'health' | 'general'
export type Scene = 'product' | 'brand' | 'event' | 'tutorial' | 'lifestyle' | 'promo'

export interface PromptTemplate {
  industry: Industry
  scene: Scene
  labelZh: string
  labelVi: string
  promptZh: string
  promptVi: string
  /** 英文版 prompt（Seedance 最佳输入语言） */
  promptEn: string
  tips: string
  duration: number  // 推荐时长(秒)
}

export const templates: PromptTemplate[] = [
  // ═══ 餐饮 ═══
  {
    industry: 'restaurant', scene: 'product',
    labelZh: '美食展示', labelVi: 'Giới thiệu món ăn',
    promptZh: '专业美食摄影风格，菜品在柔和灯光下缓缓旋转，蒸汽飘散，食材特写镜头，高级餐厅氛围，4K画质',
    promptVi: 'Phong cách chụp ẩm thực chuyên nghiệp, món ăn xoay nhẹ dưới ánh đèn dịu, hơi nước lan tỏa, cận cảnh nguyên liệu, không khí nhà hàng cao cấp, chất lượng 4K',
    promptEn: 'Professional food cinematography, dish slowly rotating under warm soft lighting, steam gently rising, close-up ingredient details, upscale restaurant ambiance, 4K quality, cinematic',
    tips: '关键词: slow rotation, steam, close-up, warm lighting', duration: 5,
  },
  {
    industry: 'restaurant', scene: 'lifestyle',
    labelZh: '餐厅探店', labelVi: 'Khám phá nhà hàng',
    promptZh: '第一人称探店视角，推门进入餐厅，环顾店内装修，服务员微笑迎接，菜品上桌过程，顾客享受美食，TikTok风格快节奏剪辑',
    promptVi: 'Góc nhìn người thứ nhất khám phá nhà hàng, đẩy cửa bước vào, nhìn quanh không gian, nhân viên chào đón, món ăn được dọn ra, khách thưởng thức, phong cách TikTok nhanh',
    promptEn: 'First-person restaurant exploration POV, pushing door open, panning across interior, smiling staff greeting, dishes being served, customers enjoying food, fast-paced TikTok-style editing, warm tones',
    tips: '关键词: POV, panning, fast cuts, warm tones', duration: 15,
  },
  {
    industry: 'restaurant', scene: 'promo',
    labelZh: '优惠促销', labelVi: 'Khuyến mãi đặc biệt',
    promptZh: '动态文字弹出效果，菜品轮播展示，价格标签动画，"限时优惠"醒目文字，鲜艳色彩，快节奏，适合TikTok信息流',
    promptVi: 'Hiệu ứng chữ động, trình chiếu món ăn, animation giá, chữ "Ưu đãi giới hạn" nổi bật, màu sắc tươi, nhịp nhanh, phù hợp TikTok feed',
    promptEn: 'Dynamic text pop-up effects, food carousel showcase, animated price tags, bold "Limited Offer" text, vibrant colors, fast-paced, optimized for TikTok feed, call to action',
    tips: '关键词: dynamic text, carousel, vibrant, TikTok, CTA', duration: 10,
  },

  // ═══ 时尚 ═══
  {
    industry: 'fashion', scene: 'product',
    labelZh: '服装展示', labelVi: 'Trình diễn thời trang',
    promptZh: '模特走秀风格，服装飘逸动态展示，柔和打光，布料质感特写，简约白色背景，杂志级质感',
    promptVi: 'Phong cách trình diễn catwalk, trang phục chuyển động mềm mại, ánh sáng dịu, cận cảnh chất liệu, nền trắng tối giản, chất lượng tạp chí',
    promptEn: 'Runway model style, fabric flowing gracefully, soft studio lighting, texture close-ups, minimalist white background, magazine-quality aesthetic, slow motion',
    tips: '关键词: runway, flowing fabric, studio lighting, minimalist', duration: 10,
  },
  {
    industry: 'fashion', scene: 'lifestyle',
    labelZh: '穿搭日常', labelVi: 'Phối đồ hàng ngày',
    promptZh: '都市街拍风格，自然光，人物漫步街头，多套穿搭快速切换，轻松愉悦氛围，电影感调色',
    promptVi: 'Phong cách street style, ánh sáng tự nhiên, người mẫu đi dạo phố, chuyển đổi nhanh giữa các bộ trang phục, không khí thoải mái, màu phim điện ảnh',
    promptEn: 'Urban street style photography, natural daylight, person walking through city streets, quick outfit transitions, relaxed joyful atmosphere, cinematic color grading, trendy',
    tips: '关键词: street style, natural light, transitions, cinematic', duration: 15,
  },

  // ═══ 美妆 ═══
  {
    industry: 'beauty', scene: 'tutorial',
    labelZh: '美妆教程', labelVi: 'Hướng dẫn trang điểm',
    promptZh: '美妆教程风格，产品平铺展示，使用步骤动画演示，前后对比效果，柔光滤镜，干净简约',
    promptVi: 'Phong cách hướng dẫn trang điểm, sản phẩm trưng bày, animation các bước sử dụng, so sánh trước-sau, filter dịu, gọn gàng tối giản',
    promptEn: 'Beauty tutorial style, products laid flat, animated step-by-step demonstration, before-after comparison, soft focus filter, clean minimal aesthetic, bright lighting',
    tips: '关键词: tutorial, flat lay, before-after, step animation', duration: 15,
  },

  // ═══ 3C/科技 ═══
  {
    industry: 'tech', scene: 'product',
    labelZh: '3C产品展示', labelVi: 'Giới thiệu sản phẩm công nghệ',
    promptZh: '科技产品3D旋转展示，暗色背景，蓝色光束扫描产品轮廓，数据流动特效，未来感，极简设计',
    promptVi: 'Trình diễn sản phẩm công nghệ xoay 3D, nền tối, tia sáng xanh quét viền sản phẩm, hiệu ứng dữ liệu chảy, cảm giác tương lai, thiết kế tối giản',
    promptEn: '3D product rotation showcase, dark background, blue light beams scanning product contours, flowing data effects, futuristic atmosphere, minimalist design, sci-fi aesthetic',
    tips: '关键词: 3D rotation, dark bg, blue scan lines, futuristic', duration: 10,
  },

  // ═══ 房产 ═══
  {
    industry: 'realestate', scene: 'product',
    labelZh: '房产展示', labelVi: 'Giới thiệu bất động sản',
    promptZh: '无人机航拍视角，从高空缓缓下降至建筑，室内巡游展示，阳光透过落地窗，宽敞空间感，专业房产摄影',
    promptVi: 'Góc quay drone từ trên cao, từ từ hạ xuống tòa nhà, tham quan nội thất, nắng xuyên cửa kính, cảm giác không gian rộng, chụp bất động sản chuyên nghiệp',
    promptEn: 'Drone aerial perspective, slowly descending to the building, interior walkthrough, sunlight streaming through floor-to-ceiling windows, spacious feeling, professional real estate cinematography',
    tips: '关键词: drone shot, aerial to ground, walkthrough, sunlight', duration: 15,
  },

  // ═══ 通用 ═══
  {
    industry: 'general', scene: 'brand',
    labelZh: '品牌介绍', labelVi: 'Giới thiệu thương hiệu',
    promptZh: '品牌宣传片风格，Logo动画开场，公司场景穿插，团队成员微笑，产品展示，温暖专业色调，激励人心',
    promptVi: 'Phong cách phim giới thiệu thương hiệu, animation logo mở đầu, cảnh công ty xen kẽ, đội ngũ mỉm cười, trưng bày sản phẩm, tông màu ấm chuyên nghiệp, truyền cảm hứng',
    promptEn: 'Brand promotional video style, animated logo opening, interspersed office scenes, smiling team members, product showcase, warm professional color tones, inspiring atmosphere, corporate',
    tips: '关键词: brand film, logo animation, team, warm tones', duration: 15,
  },
  {
    industry: 'general', scene: 'promo',
    labelZh: '通用促销', labelVi: 'Khuyến mãi chung',
    promptZh: '活力促销风格，彩色粒子背景，产品居中展示，优惠信息动态弹出，倒计时元素，紧迫感，适合社交媒体广告',
    promptVi: 'Phong cách khuyến mãi năng động, nền hạt màu sắc, sản phẩm trung tâm, thông tin ưu đãi pop-up động, yếu tố đếm ngược, cảm giác khẩn cấp, phù hợp quảng cáo mạng xã hội',
    promptEn: 'Energetic promo style, colorful particle background, product centered, dynamic discount pop-ups, countdown element, urgency feeling, social media ad optimized, bold typography',
    tips: '关键词: particles, dynamic text, countdown, bold colors', duration: 10,
  },
]

/** 按行业筛选模板 */
export function getTemplatesByIndustry(industry: Industry): PromptTemplate[] {
  return templates.filter(t => t.industry === industry)
}

/** 按场景筛选 */
export function getTemplatesByScene(scene: Scene): PromptTemplate[] {
  return templates.filter(t => t.scene === scene)
}

/** 获取推荐模板列表 */
export function getRecommendedTemplates(): PromptTemplate[] {
  return [
    templates.find(t => t.industry === 'restaurant' && t.scene === 'lifestyle')!,
    templates.find(t => t.industry === 'fashion' && t.scene === 'product')!,
    templates.find(t => t.industry === 'tech' && t.scene === 'product')!,
    templates.find(t => t.industry === 'general' && t.scene === 'brand')!,
  ]
}
