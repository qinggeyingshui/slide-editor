/**
 * 示例数据 - 达芬奇主题演示（可删除，仅用于开发演示）
 */
import { uid } from './types.js'

export function createDavinciSlides() {
  return [
    {
      bg: '/assets/slide1_bg.png', bgColor: '#1A1A2E',
      blocks: [
        { id: uid(), type: 'heading', content: '列奥纳多·达·芬奇', style: { fontSize: '42px', color: '#FFD93D', fontWeight: 'bold', textAlign: 'center' } },
        { id: uid(), type: 'text', content: 'Leonardo da Vinci (1452-1519)', style: { fontSize: '20px', color: '#FFF8EE', textAlign: 'center' } },
        { id: uid(), type: 'text', content: '文艺复兴时期最伟大的博学家', style: { fontSize: '18px', color: '#B8B8D0', textAlign: 'center' } }
      ],
      shapes: []
    },
    {
      bg: '/assets/slide2_bg.png', bgColor: '#FFF8EE',
      blocks: [
        { id: uid(), type: 'heading', content: '生平简介', style: { fontSize: '32px', color: '#1A1A2E', fontWeight: 'bold' } },
        { id: uid(), type: 'text', content: '1452年出生于意大利佛罗伦萨共和国的芬奇镇', style: { fontSize: '18px', color: '#2D2D4E' } },
        { id: uid(), type: 'list', content: '<ul><li>14岁进入韦罗基奥工作室学艺</li><li>1482年移居米兰，为斯福尔扎家族服务</li><li>晚年受法王弗朗索瓦一世邀请赴法</li><li>1519年在昂布瓦斯逝世</li></ul>', style: { fontSize: '16px', color: '#2D2D4E', lineHeight: '1.8' } }
      ],
      shapes: []
    },
    {
      bg: '/assets/slide5_bg.png', bgColor: '#FFF8EE',
      blocks: [
        { id: uid(), type: 'heading', content: '艺术成就', style: { fontSize: '32px', color: '#1A1A2E', fontWeight: 'bold' } },
        { id: uid(), type: 'cards', cards: [
          { content: '🎨 蒙娜丽莎', style: { background: '#FF6B6B', padding: '16px', borderRadius: '8px' } },
          { content: '🖼️ 最后的晚餐', style: { background: '#4ECDC4', padding: '16px', borderRadius: '8px' } },
          { content: '✏️ 维特鲁威人', style: { background: '#FFD93D', padding: '16px', borderRadius: '8px' } }
        ], style: {} }
      ],
      shapes: []
    },
    {
      bg: '/assets/slide8_bg.png', bgColor: '#FFF8EE',
      blocks: [
        { id: uid(), type: 'heading', content: '科学研究', style: { fontSize: '32px', color: '#1A1A2E', fontWeight: 'bold' } },
        { id: uid(), type: 'list', content: '<ul><li>解剖学：绘制超700幅人体解剖图</li><li>光学：研究透视法与光影原理</li><li>水力学：设计运河与水利工程</li><li>地质学：化石研究先驱</li></ul>', style: { fontSize: '16px', color: '#2D2D4E', lineHeight: '1.8' } }
      ],
      shapes: []
    },
    {
      bg: '/assets/slide11_bg.png', bgColor: '#FFF8EE',
      blocks: [
        { id: uid(), type: 'heading', content: '工程发明', style: { fontSize: '32px', color: '#1A1A2E', fontWeight: 'bold' } },
        { id: uid(), type: 'text', content: '达芬奇设计了大量超越时代的机械装置：', style: { fontSize: '16px', color: '#2D2D4E' } },
        { id: uid(), type: 'list', content: '<ul><li>飞行器（扑翼机、螺旋桨）</li><li>装甲车（坦克原型）</li><li>自动机器人（机械骑士）</li><li>潜水装置</li></ul>', style: { fontSize: '16px', color: '#2D2D4E', lineHeight: '1.8' } }
      ],
      shapes: []
    }
  ]
}
