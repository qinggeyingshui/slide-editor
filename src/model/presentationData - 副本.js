export const slides = [
  {
    innerHTML: `<div style="position:absolute;inset:0;background:#0d2b6b;overflow:hidden;">
  <img src="/images/dqn_cover_bg.png" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0.22;">
  <div style="position:absolute;left:0;top:0;width:5px;height:100%;background:#1a56db;"></div>
  <div style="position:absolute;right:0;top:0;width:5px;height:100%;background:#1a56db;opacity:0.4;"></div>
  <div style="position:absolute;left:64px;top:130px;">
    <div style="font-size:12px;color:#1a56db;letter-spacing:5px;margin-bottom:18px;font-weight:600;">REINFORCEMENT LEARNING · HW4</div>
    <div style="font-size:48px;font-weight:900;color:#ffffff;line-height:1.1;margin-bottom:6px;">Deep Q-Network</div>
    <div style="font-size:48px;font-weight:900;color:#60a5fa;line-height:1.1;margin-bottom:28px;">(DQN) 实验报告</div>
    <div style="width:64px;height:3px;background:#1a56db;margin-bottom:20px;"></div>
    <div style="font-size:15px;color:rgba(255,255,255,0.65);margin-bottom:10px;">基于 CartPole-v1 的 DQN 实现与分析</div>
    <div style="font-size:14px;color:rgba(255,255,255,0.45);margin-top:16px;">吴寒雨 &nbsp;·&nbsp; 2352885 &nbsp;·&nbsp; 2026 年 6 月</div>
  </div>
  <div style="position:absolute;right:64px;top:120px;display:flex;flex-direction:column;gap:14px;align-items:flex-end;">
    <div style="padding:10px 20px;border:1px solid rgba(255,255,255,0.18);border-radius:24px;font-size:12px;color:rgba(255,255,255,0.5);">🔥 PyTorch</div>
    <div style="padding:10px 20px;border:1px solid rgba(255,255,255,0.18);border-radius:24px;font-size:12px;color:rgba(255,255,255,0.5);">🏋️ Gymnasium</div>
    <div style="padding:10px 20px;border:1px solid rgba(255,255,255,0.18);border-radius:24px;font-size:12px;color:rgba(255,255,255,0.5);">🎮 CartPole-v1</div>
    <div style="padding:10px 20px;border:1px solid rgba(255,255,255,0.18);border-radius:24px;font-size:12px;color:rgba(255,255,255,0.5);">🧠 DQN</div>
  </div>
  <div style="position:absolute;left:64px;bottom:20px;font-size:11px;color:rgba(255,255,255,0.3);">Mnih et al., 2013 · Playing Atari with Deep Reinforcement Learning</div>
</div>`
  },
  {
    innerHTML: `<div style="position:absolute;inset:0;background:#f0f6ff;">
  <div style="position:absolute;left:0;top:0;width:960px;height:56px;background:#0d2b6b;display:flex;align-items:center;padding:0 32px;box-sizing:border-box;">
    <span style="color:#ffffff;font-size:13px;letter-spacing:2px;opacity:0.7;">目录</span>
    <span style="color:#ffffff;font-size:13px;margin-left:auto;opacity:0.5;">02 / 13</span>
  </div>
  <div style="position:absolute;left:60px;top:68px;font-size:22px;font-weight:800;color:#0d2b6b;">内容概览</div>
  <div style="position:absolute;left:60px;top:108px;width:400px;display:flex;flex-direction:column;gap:8px;">
    <div style="background:#ffffff;border-radius:10px;padding:11px 16px;border-left:4px solid #1a56db;box-shadow:0 2px 6px rgba(26,86,219,0.08);display:flex;align-items:center;gap:12px;">
      <span style="font-size:18px;font-weight:900;color:#1a56db;min-width:28px;">01</span>
      <div><div style="font-size:13px;font-weight:700;color:#0d2b6b;">背景与问题定义</div><div style="font-size:11px;color:#4b5563;">强化学习基础 · MDP · CartPole</div></div>
    </div>
    <div style="background:#ffffff;border-radius:10px;padding:11px 16px;border-left:4px solid #1a56db;box-shadow:0 2px 6px rgba(26,86,219,0.08);display:flex;align-items:center;gap:12px;">
      <span style="font-size:18px;font-weight:900;color:#1a56db;min-width:28px;">02</span>
      <div><div style="font-size:13px;font-weight:700;color:#0d2b6b;">DQN 算法原理</div><div style="font-size:11px;color:#4b5563;">Q-Learning → DQN 的演进</div></div>
    </div>
    <div style="background:#ffffff;border-radius:10px;padding:11px 16px;border-left:4px solid #1a56db;box-shadow:0 2px 6px rgba(26,86,219,0.08);display:flex;align-items:center;gap:12px;">
      <span style="font-size:18px;font-weight:900;color:#1a56db;min-width:28px;">03</span>
      <div><div style="font-size:13px;font-weight:700;color:#0d2b6b;">网络结构设计</div><div style="font-size:11px;color:#4b5563;">QNetwork 三层全连接</div></div>
    </div>
    <div style="background:#ffffff;border-radius:10px;padding:11px 16px;border-left:4px solid #1a56db;box-shadow:0 2px 6px rgba(26,86,219,0.08);display:flex;align-items:center;gap:12px;">
      <span style="font-size:18px;font-weight:900;color:#1a56db;min-width:28px;">04</span>
      <div><div style="font-size:13px;font-weight:700;color:#0d2b6b;">关键技术</div><div style="font-size:11px;color:#4b5563;">经验回放 · 目标网络</div></div>
    </div>
    <div style="background:#ffffff;border-radius:10px;padding:11px 16px;border-left:4px solid #1a56db;box-shadow:0 2px 6px rgba(26,86,219,0.08);display:flex;align-items:center;gap:12px;">
      <span style="font-size:18px;font-weight:900;color:#1a56db;min-width:28px;">05</span>
      <div><div style="font-size:13px;font-weight:700;color:#0d2b6b;">训练流程与超参数</div><div style="font-size:11px;color:#4b5563;">完整训练循环 · 参数配置</div></div>
    </div>
  </div>
  <div style="position:absolute;right:60px;top:108px;width:400px;display:flex;flex-direction:column;gap:8px;">
    <div style="background:#ffffff;border-radius:10px;padding:11px 16px;border-left:4px solid #0ea5e9;box-shadow:0 2px 6px rgba(14,165,233,0.08);display:flex;align-items:center;gap:12px;">
      <span style="font-size:18px;font-weight:900;color:#0ea5e9;min-width:28px;">06</span>
      <div><div style="font-size:13px;font-weight:700;color:#0d2b6b;">实验设置</div><div style="font-size:11px;color:#4b5563;">环境 · 工具 · 评估指标</div></div>
    </div>
    <div style="background:#ffffff;border-radius:10px;padding:11px 16px;border-left:4px solid #0ea5e9;box-shadow:0 2px 6px rgba(14,165,233,0.08);display:flex;align-items:center;gap:12px;">
      <span style="font-size:18px;font-weight:900;color:#0ea5e9;min-width:28px;">07</span>
      <div><div style="font-size:13px;font-weight:700;color:#0d2b6b;">训练过程分析</div><div style="font-size:11px;color:#4b5563;">收敛曲线 · 阶段分析</div></div>
    </div>
    <div style="background:#ffffff;border-radius:10px;padding:11px 16px;border-left:4px solid #0ea5e9;box-shadow:0 2px 6px rgba(14,165,233,0.08);display:flex;align-items:center;gap:12px;">
      <span style="font-size:18px;font-weight:900;color:#0ea5e9;min-width:28px;">08</span>
      <div><div style="font-size:13px;font-weight:700;color:#0d2b6b;">实验结果展示</div><div style="font-size:11px;color:#4b5563;">得分对比 · 可视化</div></div>
    </div>
    <div style="background:#ffffff;border-radius:10px;padding:11px 16px;border-left:4px solid #0ea5e9;box-shadow:0 2px 6px rgba(14,165,233,0.08);display:flex;align-items:center;gap:12px;">
      <span style="font-size:18px;font-weight:900;color:#0ea5e9;min-width:28px;">09</span>
      <div><div style="font-size:13px;font-weight:700;color:#0d2b6b;">结果讨论与总结</div><div style="font-size:11px;color:#4b5563;">分析 · 改进方向</div></div>
    </div>
    <div style="background:#ffffff;border-radius:10px;padding:11px 16px;border-left:4px solid #0ea5e9;box-shadow:0 2px 6px rgba(14,165,233,0.08);display:flex;align-items:center;gap:12px;">
      <span style="font-size:18px;font-weight:900;color:#0ea5e9;min-width:28px;">10</span>
      <div><div style="font-size:13px;font-weight:700;color:#0d2b6b;">参考文献</div><div style="font-size:11px;color:#4b5563;">论文 · 代码</div></div>
    </div>
  </div>
  <div style="position:absolute;left:0;bottom:0;width:960px;height:32px;background:#e8f0fe;display:flex;align-items:center;padding:0 32px;box-sizing:border-box;">
    <span style="color:#0d2b6b;font-size:11px;opacity:0.6;">DQN on CartPole-v1 &nbsp;|&nbsp; 吴寒雨 &nbsp;2352885</span>
    <span style="color:#1a56db;font-size:11px;margin-left:auto;">Mnih et al., 2013</span>
  </div>
</div>`
  },
  {
    innerHTML: `<div style="position:absolute;inset:0;background:#f0f6ff;">
  <div style="position:absolute;left:0;top:0;width:960px;height:56px;background:#0d2b6b;display:flex;align-items:center;padding:0 32px;box-sizing:border-box;">
    <span style="color:#ffffff;font-size:13px;letter-spacing:2px;opacity:0.7;">背景与问题定义</span>
    <span style="color:#ffffff;font-size:13px;margin-left:auto;opacity:0.5;">03 / 13</span>
  </div>
  <div style="position:absolute;left:60px;top:68px;font-size:22px;font-weight:800;color:#0d2b6b;">背景与问题定义</div>
  <div style="position:absolute;left:60px;top:104px;width:500px;display:flex;flex-direction:column;gap:12px;">
    <div style="font-size:13px;color:#4b5563;">强化学习让智能体通过与环境交互学习最优策略，DQN 是其里程碑成果</div>
    <div style="background:#ffffff;border-radius:10px;padding:14px 18px;border-left:4px solid #1a56db;box-shadow:0 2px 8px rgba(26,86,219,0.08);">
      <div style="font-size:13px;font-weight:700;color:#0d2b6b;margin-bottom:6px;">📐 马尔可夫决策过程 (MDP)</div>
      <div style="font-size:12px;color:#4b5563;line-height:1.8;">
        <b>S</b> 状态空间 &nbsp;·&nbsp; <b>A</b> 动作空间 &nbsp;·&nbsp; <b>R</b> 奖励函数<br>
        <b>P</b> 状态转移概率 &nbsp;·&nbsp; <b>γ</b> 折扣因子 (0.99)
      </div>
    </div>
    <div style="background:#ffffff;border-radius:10px;padding:14px 18px;border-left:4px solid #1a56db;box-shadow:0 2px 8px rgba(26,86,219,0.08);">
      <div style="font-size:13px;font-weight:700;color:#0d2b6b;margin-bottom:6px;">🏋️ CartPole-v1 环境</div>
      <div style="font-size:12px;color:#4b5563;line-height:1.8;">
        状态空间：4 维连续（位置 / 速度 / 角度 / 角速度）<br>
        动作空间：2 维离散（左推 / 右推）<br>
        目标：保持杆子不倒，每步 +1 奖励，上限 500 步
      </div>
    </div>
    <div style="background:#ffffff;border-radius:10px;padding:14px 18px;border-left:4px solid #10b981;box-shadow:0 2px 8px rgba(16,185,129,0.08);">
      <div style="font-size:13px;font-weight:700;color:#0d2b6b;margin-bottom:6px;">✅ 解决标准</div>
      <div style="font-size:12px;color:#4b5563;">连续 100 轮平均得分 ≥ 475（本实验最高 Avg ≈ 218）</div>
    </div>
  </div>
  <div style="position:absolute;right:60px;top:104px;width:330px;">
    <img src="/images/dqn_cartpole_env.png" style="width:100%;border-radius:12px;box-shadow:0 4px 20px rgba(13,43,107,0.15);">
    <div style="text-align:center;font-size:11px;color:#4b5563;margin-top:8px;">CartPole-v1 环境示意</div>
    <div style="background:#0d2b6b;border-radius:10px;padding:14px 16px;margin-top:14px;">
      <div style="font-size:12px;font-weight:700;color:#60a5fa;margin-bottom:8px;">🎯 强化学习目标</div>
      <div style="font-size:12px;color:rgba(255,255,255,0.75);line-height:1.8;">
        最大化累积折扣奖励<br>
        G = Σ γᵗ · rₜ
      </div>
    </div>
  </div>
  <div style="position:absolute;left:0;bottom:0;width:960px;height:32px;background:#e8f0fe;display:flex;align-items:center;padding:0 32px;box-sizing:border-box;">
    <span style="color:#0d2b6b;font-size:11px;opacity:0.6;">DQN on CartPole-v1 &nbsp;|&nbsp; 吴寒雨 &nbsp;2352885</span>
    <span style="color:#1a56db;font-size:11px;margin-left:auto;">Mnih et al., 2013</span>
  </div>
</div>`
  },
  {
    innerHTML: `<div style="position:absolute;inset:0;background:#f0f6ff;">
  <div style="position:absolute;left:0;top:0;width:960px;height:56px;background:#0d2b6b;display:flex;align-items:center;padding:0 32px;box-sizing:border-box;">
    <span style="color:#ffffff;font-size:13px;letter-spacing:2px;opacity:0.7;">DQN 算法原理</span>
    <span style="color:#ffffff;font-size:13px;margin-left:auto;opacity:0.5;">04 / 13</span>
  </div>
  <div style="position:absolute;left:60px;top:68px;font-size:22px;font-weight:800;color:#0d2b6b;">DQN 算法原理</div>
  <div style="position:absolute;left:60px;top:106px;width:840px;display:flex;flex-direction:column;gap:14px;">
    <div style="display:flex;gap:14px;">
      <div style="flex:1;background:#ffffff;border-radius:10px;padding:16px 18px;box-shadow:0 2px 8px rgba(26,86,219,0.08);">
        <div style="font-size:13px;font-weight:700;color:#0d2b6b;margin-bottom:10px;">📐 Q-Learning 基础</div>
        <div style="background:#e8f0fe;border-radius:8px;padding:10px 14px;font-family:monospace;font-size:12px;color:#0d2b6b;text-align:center;margin-bottom:8px;">
          Q(s,a) ← Q(s,a) + α [ r + γ · max Q(s',a') − Q(s,a) ]
        </div>
        <div style="font-size:11px;color:#4b5563;">通过 Bellman 方程迭代更新 Q 值，收敛到最优策略</div>
      </div>
      <div style="flex:1;background:#ffffff;border-radius:10px;padding:16px 18px;box-shadow:0 2px 8px rgba(26,86,219,0.08);">
        <div style="font-size:13px;font-weight:700;color:#0d2b6b;margin-bottom:10px;">🧠 DQN 核心创新</div>
        <div style="background:#e8f0fe;border-radius:8px;padding:10px 14px;font-family:monospace;font-size:12px;color:#0d2b6b;text-align:center;margin-bottom:8px;">
          Loss = E [ ( y − Q(s,a;θ) )² ]
        </div>
        <div style="font-size:11px;color:#4b5563;">用神经网络 Q(s,a;θ) 替代 Q 表，解决高维状态空间问题</div>
      </div>
    </div>
    <div style="display:flex;align-items:center;gap:8px;">
      <div style="flex:1;background:#0d2b6b;border-radius:10px;padding:14px;text-align:center;">
        <div style="font-size:22px;margin-bottom:6px;">📊</div>
        <div style="font-size:12px;font-weight:700;color:#ffffff;">传统 Q 表</div>
        <div style="font-size:10px;color:rgba(255,255,255,0.5);margin-top:4px;">仅适用于离散小状态空间</div>
      </div>
      <div style="font-size:22px;color:#1a56db;font-weight:900;">→</div>
      <div style="flex:1;background:#1a56db;border-radius:10px;padding:14px;text-align:center;">
        <div style="font-size:22px;margin-bottom:6px;">🤖</div>
        <div style="font-size:12px;font-weight:700;color:#ffffff;">深度神经网络</div>
        <div style="font-size:10px;color:rgba(255,255,255,0.7);margin-top:4px;">泛化到连续高维状态</div>
      </div>
      <div style="font-size:22px;color:#1a56db;font-weight:900;">+</div>
      <div style="flex:1;background:#0ea5e9;border-radius:10px;padding:14px;text-align:center;">
        <div style="font-size:22px;margin-bottom:6px;">🔄</div>
        <div style="font-size:12px;font-weight:700;color:#ffffff;">经验回放</div>
        <div style="font-size:10px;color:rgba(255,255,255,0.7);margin-top:4px;">打破时序相关性</div>
      </div>
      <div style="font-size:22px;color:#1a56db;font-weight:900;">+</div>
      <div style="flex:1;background:#6366f1;border-radius:10px;padding:14px;text-align:center;">
        <div style="font-size:22px;margin-bottom:6px;">🎯</div>
        <div style="font-size:12px;font-weight:700;color:#ffffff;">目标网络</div>
        <div style="font-size:10px;color:rgba(255,255,255,0.7);margin-top:4px;">稳定训练目标</div>
      </div>
      <div style="font-size:22px;color:#1a56db;font-weight:900;">=</div>
      <div style="flex:1;background:linear-gradient(135deg,#1a56db,#0ea5e9);border-radius:10px;padding:14px;text-align:center;">
        <div style="font-size:22px;margin-bottom:6px;">🏆</div>
        <div style="font-size:12px;font-weight:700;color:#ffffff;">DQN</div>
        <div style="font-size:10px;color:rgba(255,255,255,0.8);margin-top:4px;">Nature 2015</div>
      </div>
    </div>
    <div style="background:#0d2b6b;border-radius:10px;padding:12px 20px;display:flex;align-items:center;gap:12px;">
      <span style="font-size:16px;">💡</span>
      <span style="font-size:12px;color:#ffffff;">DQN 首次让 AI 在 49 款 Atari 游戏中达到人类水平，是深度强化学习的奠基之作（Mnih et al., Nature 2015）</span>
    </div>
  </div>
  <div style="position:absolute;left:0;bottom:0;width:960px;height:32px;background:#e8f0fe;display:flex;align-items:center;padding:0 32px;box-sizing:border-box;">
    <span style="color:#0d2b6b;font-size:11px;opacity:0.6;">DQN on CartPole-v1 &nbsp;|&nbsp; 吴寒雨 &nbsp;2352885</span>
    <span style="color:#1a56db;font-size:11px;margin-left:auto;">Mnih et al., 2013</span>
  </div>
</div>`
  },
  {
    innerHTML: `<div style="position:absolute;inset:0;background:#f0f6ff;">
  <div style="position:absolute;left:0;top:0;width:960px;height:56px;background:#0d2b6b;display:flex;align-items:center;padding:0 32px;box-sizing:border-box;">
    <span style="color:#ffffff;font-size:13px;letter-spacing:2px;opacity:0.7;">网络结构设计</span>
    <span style="color:#ffffff;font-size:13px;margin-left:auto;opacity:0.5;">05 / 13</span>
  </div>
  <div style="position:absolute;left:60px;top:68px;font-size:22px;font-weight:800;color:#0d2b6b;">QNetwork 网络结构</div>
  <div style="position:absolute;left:60px;top:106px;width:430px;">
    <div style="background:#ffffff;border-radius:12px;padding:20px;box-shadow:0 2px 12px rgba(26,86,219,0.1);">
      <div style="font-size:13px;font-weight:700;color:#0d2b6b;margin-bottom:14px;">🏗️ 三层全连接网络（MLP）</div>
      <div style="display:flex;flex-direction:column;gap:6px;">
        <div style="background:#e8f0fe;border-radius:8px;padding:10px 14px;display:flex;align-items:center;gap:10px;">
          <span style="font-size:16px;">📥</span>
          <div style="flex:1;"><div style="font-size:12px;font-weight:700;color:#0d2b6b;">输入层</div><div style="font-size:11px;color:#4b5563;">4 维状态向量 [pos, vel, angle, ang_vel]</div></div>
          <span style="font-size:11px;color:#1a56db;font-weight:700;background:#dbeafe;padding:2px 8px;border-radius:10px;">4</span>
        </div>
        <div style="text-align:center;font-size:11px;color:#1a56db;padding:2px 0;">↓ &nbsp;Linear(4 → 128) + ReLU</div>
        <div style="background:#e8f0fe;border-radius:8px;padding:10px 14px;display:flex;align-items:center;gap:10px;">
          <span style="font-size:16px;">⚙️</span>
          <div style="flex:1;"><div style="font-size:12px;font-weight:700;color:#0d2b6b;">隐藏层 1</div><div style="font-size:11px;color:#4b5563;">128 个神经元，ReLU 激活</div></div>
          <span style="font-size:11px;color:#1a56db;font-weight:700;background:#dbeafe;padding:2px 8px;border-radius:10px;">128</span>
        </div>
        <div style="text-align:center;font-size:11px;color:#1a56db;padding:2px 0;">↓ &nbsp;Linear(128 → 128) + ReLU</div>
        <div style="background:#e8f0fe;border-radius:8px;padding:10px 14px;display:flex;align-items:center;gap:10px;">
          <span style="font-size:16px;">⚙️</span>
          <div style="flex:1;"><div style="font-size:12px;font-weight:700;color:#0d2b6b;">隐藏层 2</div><div style="font-size:11px;color:#4b5563;">128 个神经元，ReLU 激活</div></div>
          <span style="font-size:11px;color:#1a56db;font-weight:700;background:#dbeafe;padding:2px 8px;border-radius:10px;">128</span>
        </div>
        <div style="text-align:center;font-size:11px;color:#1a56db;padding:2px 0;">↓ &nbsp;Linear(128 → 2)</div>
        <div style="background:#dbeafe;border-radius:8px;padding:10px 14px;display:flex;align-items:center;gap:10px;border:2px solid #1a56db;">
          <span style="font-size:16px;">📤</span>
          <div style="flex:1;"><div style="font-size:12px;font-weight:700;color:#0d2b6b;">输出层</div><div style="font-size:11px;color:#4b5563;">Q(s, 左推) &nbsp;·&nbsp; Q(s, 右推)</div></div>
          <span style="font-size:11px;color:#1a56db;font-weight:700;background:#ffffff;padding:2px 8px;border-radius:10px;">2</span>
        </div>
      </div>
    </div>
  </div>
  <div style="position:absolute;right:60px;top:106px;width:380px;display:flex;flex-direction:column;gap:14px;">
    <img src="/images/dqn_network.png" style="width:100%;border-radius:12px;box-shadow:0 4px 20px rgba(13,43,107,0.15);">
    <div style="background:#ffffff;border-radius:10px;padding:16px;box-shadow:0 2px 8px rgba(26,86,219,0.08);">
      <div style="font-size:13px;font-weight:700;color:#0d2b6b;margin-bottom:10px;">💡 双网络设计</div>
      <div style="display:flex;gap:10px;">
        <div style="flex:1;background:#e8f0fe;border-radius:8px;padding:10px;text-align:center;">
          <div style="font-size:11px;font-weight:700;color:#1a56db;margin-bottom:4px;">Policy Net</div>
          <div style="font-size:10px;color:#4b5563;">实时更新<br>选择动作</div>
        </div>
        <div style="flex:1;background:#ede9fe;border-radius:8px;padding:10px;text-align:center;">
          <div style="font-size:11px;font-weight:700;color:#6366f1;margin-bottom:4px;">Target Net</div>
          <div style="font-size:10px;color:#4b5563;">每 10 轮同步<br>提供稳定目标</div>
        </div>
      </div>
    </div>
  </div>
  <div style="position:absolute;left:0;bottom:0;width:960px;height:32px;background:#e8f0fe;display:flex;align-items:center;padding:0 32px;box-sizing:border-box;">
    <span style="color:#0d2b6b;font-size:11px;opacity:0.6;">DQN on CartPole-v1 &nbsp;|&nbsp; 吴寒雨 &nbsp;2352885</span>
    <span style="color:#1a56db;font-size:11px;margin-left:auto;">Mnih et al., 2013</span>
  </div>
</div>`
  },
  {
    innerHTML: `<div style="position:absolute;inset:0;background:#f0f6ff;">
  <div style="position:absolute;left:0;top:0;width:960px;height:56px;background:#0d2b6b;display:flex;align-items:center;padding:0 32px;box-sizing:border-box;">
    <span style="color:#ffffff;font-size:13px;letter-spacing:2px;opacity:0.7;">关键技术</span>
    <span style="color:#ffffff;font-size:13px;margin-left:auto;opacity:0.5;">06 / 13</span>
  </div>
  <div style="position:absolute;left:60px;top:68px;font-size:22px;font-weight:800;color:#0d2b6b;">关键技术：经验回放 & 目标网络</div>
  <div style="position:absolute;left:60px;top:108px;width:400px;">
    <div style="background:#ffffff;border-radius:12px;padding:20px;box-shadow:0 2px 12px rgba(26,86,219,0.1);height:330px;box-sizing:border-box;">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;">
        <div style="width:36px;height:36px;border-radius:50%;background:#1a56db;display:flex;align-items:center;justify-content:center;font-size:18px;">🔄</div>
        <div style="font-size:14px;font-weight:800;color:#0d2b6b;">经验回放 (Replay Buffer)</div>
      </div>
      <div style="font-size:12px;color:#4b5563;line-height:2.0;margin-bottom:12px;">
        📦 &nbsp;容量：<b>10,000</b> 条经验 (s, a, r, s', done)<br>
        🎲 &nbsp;每步随机采样 <b>64</b> 条 mini-batch<br>
        ✂️ &nbsp;打破时序相关性，稳定梯度<br>
        ♻️ &nbsp;提高数据利用率
      </div>
      <div style="background:#e8f0fe;border-radius:8px;padding:10px 12px;font-family:monospace;font-size:11px;color:#0d2b6b;line-height:1.8;">
        buffer.push(s, a, r, s&#39;, done)<br>
        batch = buffer.sample(64)<br>
        loss = MSE(Q_pred, Q_target)<br>
        optimizer.step()
      </div>
    </div>
  </div>
  <div style="position:absolute;right:60px;top:108px;width:400px;">
    <div style="background:#ffffff;border-radius:12px;padding:20px;box-shadow:0 2px 12px rgba(26,86,219,0.1);height:330px;box-sizing:border-box;">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;">
        <div style="width:36px;height:36px;border-radius:50%;background:#6366f1;display:flex;align-items:center;justify-content:center;font-size:18px;">🎯</div>
        <div style="font-size:14px;font-weight:800;color:#0d2b6b;">目标网络 (Target Network)</div>
      </div>
      <div style="font-size:12px;color:#4b5563;line-height:2.0;margin-bottom:12px;">
        🔒 &nbsp;参数每 <b>10 轮</b>硬同步一次<br>
        📉 &nbsp;避免训练目标频繁漂移<br>
        🏗️ &nbsp;与 Policy Net 结构完全相同<br>
        📐 &nbsp;TD 目标：y = r + γ · max Q_target(s&#39;,a&#39;)
      </div>
      <div style="background:#ede9fe;border-radius:8px;padding:10px 12px;font-family:monospace;font-size:11px;color:#0d2b6b;line-height:1.8;">
        if episode % 10 == 0:<br>
        &nbsp;&nbsp;target_net.load_state_dict(<br>
        &nbsp;&nbsp;&nbsp;&nbsp;policy_net.state_dict())<br>
        &nbsp;&nbsp;# 硬更新，非软更新
      </div>
    </div>
  </div>
  <div style="position:absolute;left:60px;bottom:40px;width:840px;background:#0d2b6b;border-radius:10px;padding:12px 20px;display:flex;align-items:center;gap:12px;">
    <span style="font-size:16px;">💡</span>
    <span style="font-size:12px;color:#ffffff;">两项技术共同解决 DQN 训练不稳定的核心问题，是 Mnih et al. 2015 Nature 论文的关键贡献</span>
  </div>
  <div style="position:absolute;left:0;bottom:0;width:960px;height:32px;background:#e8f0fe;display:flex;align-items:center;padding:0 32px;box-sizing:border-box;">
    <span style="color:#0d2b6b;font-size:11px;opacity:0.6;">DQN on CartPole-v1 &nbsp;|&nbsp; 吴寒雨 &nbsp;2352885</span>
    <span style="color:#1a56db;font-size:11px;margin-left:auto;">Mnih et al., 2013</span>
  </div>
</div>`
  },
  {
    innerHTML: `<div style="position:absolute;inset:0;background:#f0f6ff;">
  <div style="position:absolute;left:0;top:0;width:960px;height:56px;background:#0d2b6b;display:flex;align-items:center;padding:0 32px;box-sizing:border-box;">
    <span style="color:#ffffff;font-size:13px;letter-spacing:2px;opacity:0.7;">训练流程</span>
    <span style="color:#ffffff;font-size:13px;margin-left:auto;opacity:0.5;">07 / 13</span>
  </div>
  <div style="position:absolute;left:60px;top:68px;font-size:22px;font-weight:800;color:#0d2b6b;">训练流程与超参数</div>
  <div style="position:absolute;left:60px;top:106px;width:450px;">
    <div style="font-size:13px;font-weight:700;color:#0d2b6b;margin-bottom:10px;">🔁 训练主循环（每轮 episode）</div>
    <div style="display:flex;flex-direction:column;gap:5px;">
      <div style="background:#ffffff;border-radius:8px;padding:9px 14px;display:flex;align-items:center;gap:10px;box-shadow:0 1px 4px rgba(26,86,219,0.07);">
        <span style="width:22px;height:22px;border-radius:50%;background:#1a56db;color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;">1</span>
        <span style="font-size:12px;color:#0d2b6b;">重置环境，获取初始状态 s₀</span>
      </div>
      <div style="background:#ffffff;border-radius:8px;padding:9px 14px;display:flex;align-items:center;gap:10px;box-shadow:0 1px 4px rgba(26,86,219,0.07);">
        <span style="width:22px;height:22px;border-radius:50%;background:#1a56db;color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;">2</span>
        <span style="font-size:12px;color:#0d2b6b;">ε-greedy 策略选择动作 a（探索 vs 利用）</span>
      </div>
      <div style="background:#ffffff;border-radius:8px;padding:9px 14px;display:flex;align-items:center;gap:10px;box-shadow:0 1px 4px rgba(26,86,219,0.07);">
        <span style="width:22px;height:22px;border-radius:50%;background:#1a56db;color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;">3</span>
        <span style="font-size:12px;color:#0d2b6b;">执行动作，获得奖励 r 和下一状态 s'</span>
      </div>
      <div style="background:#ffffff;border-radius:8px;padding:9px 14px;display:flex;align-items:center;gap:10px;box-shadow:0 1px 4px rgba(26,86,219,0.07);">
        <span style="width:22px;height:22px;border-radius:50%;background:#1a56db;color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;">4</span>
        <span style="font-size:12px;color:#0d2b6b;">存入经验回放缓冲区 (s, a, r, s', done)</span>
      </div>
      <div style="background:#ffffff;border-radius:8px;padding:9px 14px;display:flex;align-items:center;gap:10px;box-shadow:0 1px 4px rgba(26,86,219,0.07);">
        <span style="width:22px;height:22px;border-radius:50%;background:#1a56db;color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;">5</span>
        <span style="font-size:12px;color:#0d2b6b;">采样 mini-batch，计算 TD 目标 y</span>
      </div>
      <div style="background:#ffffff;border-radius:8px;padding:9px 14px;display:flex;align-items:center;gap:10px;box-shadow:0 1px 4px rgba(26,86,219,0.07);">
        <span style="width:22px;height:22px;border-radius:50%;background:#1a56db;color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;">6</span>
        <span style="font-size:12px;color:#0d2b6b;">反向传播，Adam 优化器更新 Policy Net</span>
      </div>
      <div style="background:#ffffff;border-radius:8px;padding:9px 14px;display:flex;align-items:center;gap:10px;box-shadow:0 1px 4px rgba(26,86,219,0.07);">
        <span style="width:22px;height:22px;border-radius:50%;background:#6366f1;color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;">7</span>
        <span style="font-size:12px;color:#0d2b6b;">每 10 轮将 Policy Net 参数同步到 Target Net</span>
      </div>
      <div style="background:#ffffff;border-radius:8px;padding:9px 14px;display:flex;align-items:center;gap:10px;box-shadow:0 1px 4px rgba(26,86,219,0.07);">
        <span style="width:22px;height:22px;border-radius:50%;background:#0ea5e9;color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;">8</span>
        <span style="font-size:12px;color:#0d2b6b;">ε 指数衰减：ε ← max(ε × 0.995, 0.01)</span>
      </div>
    </div>
  </div>
  <div style="position:absolute;right:60px;top:106px;width:360px;">
    <div style="font-size:13px;font-weight:700;color:#0d2b6b;margin-bottom:10px;">⚙️ 超参数配置</div>
    <div style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(26,86,219,0.1);">
      <div style="background:#0d2b6b;padding:9px 16px;display:flex;">
        <span style="font-size:12px;color:#ffffff;font-weight:700;flex:1;">参数</span>
        <span style="font-size:12px;color:#ffffff;font-weight:700;">值</span>
      </div>
      <div style="padding:8px 16px;display:flex;border-bottom:1px solid #e8f0fe;"><span style="font-size:12px;color:#4b5563;flex:1;">训练轮数</span><span style="font-size:12px;color:#1a56db;font-weight:700;">500</span></div>
      <div style="padding:8px 16px;display:flex;border-bottom:1px solid #e8f0fe;background:#f8faff;"><span style="font-size:12px;color:#4b5563;flex:1;">Batch Size</span><span style="font-size:12px;color:#1a56db;font-weight:700;">64</span></div>
      <div style="padding:8px 16px;display:flex;border-bottom:1px solid #e8f0fe;"><span style="font-size:12px;color:#4b5563;flex:1;">学习率 α</span><span style="font-size:12px;color:#1a56db;font-weight:700;">1e-3</span></div>
      <div style="padding:8px 16px;display:flex;border-bottom:1px solid #e8f0fe;background:#f8faff;"><span style="font-size:12px;color:#4b5563;flex:1;">折扣因子 γ</span><span style="font-size:12px;color:#1a56db;font-weight:700;">0.99</span></div>
      <div style="padding:8px 16px;display:flex;border-bottom:1px solid #e8f0fe;"><span style="font-size:12px;color:#4b5563;flex:1;">ε 初始值</span><span style="font-size:12px;color:#1a56db;font-weight:700;">1.0</span></div>
      <div style="padding:8px 16px;display:flex;border-bottom:1px solid #e8f0fe;background:#f8faff;"><span style="font-size:12px;color:#4b5563;flex:1;">ε 最小值</span><span style="font-size:12px;color:#1a56db;font-weight:700;">0.01</span></div>
      <div style="padding:8px 16px;display:flex;border-bottom:1px solid #e8f0fe;"><span style="font-size:12px;color:#4b5563;flex:1;">ε 衰减系数</span><span style="font-size:12px;color:#1a56db;font-weight:700;">0.995</span></div>
      <div style="padding:8px 16px;display:flex;border-bottom:1px solid #e8f0fe;background:#f8faff;"><span style="font-size:12px;color:#4b5563;flex:1;">Buffer 容量</span><span style="font-size:12px;color:#1a56db;font-weight:700;">10,000</span></div>
      <div style="padding:8px 16px;display:flex;border-bottom:1px solid #e8f0fe;"><span style="font-size:12px;color:#4b5563;flex:1;">目标网络同步</span><span style="font-size:12px;color:#1a56db;font-weight:700;">每 10 轮</span></div>
      <div style="padding:8px 16px;display:flex;border-bottom:1px solid #e8f0fe;background:#f8faff;"><span style="font-size:12px;color:#4b5563;flex:1;">隐藏层大小</span><span style="font-size:12px;color:#1a56db;font-weight:700;">128</span></div>
      <div style="padding:8px 16px;display:flex;"><span style="font-size:12px;color:#4b5563;flex:1;">优化器</span><span style="font-size:12px;color:#1a56db;font-weight:700;">Adam</span></div>
    </div>
  </div>
  <div style="position:absolute;left:0;bottom:0;width:960px;height:32px;background:#e8f0fe;display:flex;align-items:center;padding:0 32px;box-sizing:border-box;">
    <span style="color:#0d2b6b;font-size:11px;opacity:0.6;">DQN on CartPole-v1 &nbsp;|&nbsp; 吴寒雨 &nbsp;2352885</span>
    <span style="color:#1a56db;font-size:11px;margin-left:auto;">Mnih et al., 2013</span>
  </div>
</div>`
  },
  {
    innerHTML: `<div style="position:absolute;inset:0;background:#f0f6ff;">
  <div style="position:absolute;left:0;top:0;width:960px;height:56px;background:#0d2b6b;display:flex;align-items:center;padding:0 32px;box-sizing:border-box;">
    <span style="color:#ffffff;font-size:13px;letter-spacing:2px;opacity:0.7;">实验设置</span>
    <span style="color:#ffffff;font-size:13px;margin-left:auto;opacity:0.5;">08 / 13</span>
  </div>
  <div style="position:absolute;left:60px;top:68px;font-size:22px;font-weight:800;color:#0d2b6b;">实验设置</div>
  <div style="position:absolute;left:60px;top:106px;width:840px;display:flex;gap:16px;">
    <div style="flex:1;background:#ffffff;border-radius:12px;padding:18px;box-shadow:0 2px 8px rgba(26,86,219,0.08);">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
        <span style="font-size:20px;">🖥️</span>
        <span style="font-size:13px;font-weight:700;color:#0d2b6b;">实验环境</span>
      </div>
      <div style="font-size:12px;color:#4b5563;line-height:2.0;">
        <div>🐍 &nbsp;Python 3.11</div>
        <div>🔥 &nbsp;PyTorch 2.x</div>
        <div>🏋️ &nbsp;Gymnasium 0.29</div>
        <div>📊 &nbsp;Matplotlib</div>
        <div>📦 &nbsp;NumPy</div>
      </div>
    </div>
    <div style="flex:1;background:#ffffff;border-radius:12px;padding:18px;box-shadow:0 2px 8px rgba(26,86,219,0.08);">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
        <span style="font-size:20px;">🎮</span>
        <span style="font-size:13px;font-weight:700;color:#0d2b6b;">CartPole-v1 规格</span>
      </div>
      <div style="font-size:12px;color:#4b5563;line-height:2.0;">
        <div>📐 &nbsp;状态维度：4（连续）</div>
        <div>🕹️ &nbsp;动作空间：2（离散）</div>
        <div>🏆 &nbsp;最大步数：500</div>
        <div>✅ &nbsp;解决标准：avg ≥ 475</div>
        <div>⏱️ &nbsp;每步奖励：+1</div>
      </div>
    </div>
    <div style="flex:1;background:#ffffff;border-radius:12px;padding:18px;box-shadow:0 2px 8px rgba(26,86,219,0.08);">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
        <span style="font-size:20px;">📏</span>
        <span style="font-size:13px;font-weight:700;color:#0d2b6b;">评估指标</span>
      </div>
      <div style="font-size:12px;color:#4b5563;line-height:2.0;">
        <div>📈 &nbsp;每轮 episode 得分</div>
        <div>📉 &nbsp;100轮滑动平均</div>
        <div>🎯 &nbsp;最终平均得分</div>
        <div>⚡ &nbsp;收敛速度（轮数）</div>
        <div>🔄 &nbsp;训练稳定性</div>
      </div>
    </div>
  </div>
  <div style="position:absolute;left:60px;top:310px;width:840px;">
    <div style="font-size:13px;font-weight:700;color:#0d2b6b;margin-bottom:10px;">📁 代码结构</div>
    <div style="display:flex;gap:12px;">
      <div style="flex:1;background:#e8f0fe;border-radius:8px;padding:12px 16px;font-family:monospace;font-size:11px;color:#0d2b6b;line-height:1.9;">
        dqn_cartpole.py<br>
        ├── ReplayBuffer &nbsp;&nbsp;# 经验回放<br>
        ├── QNetwork &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# 神经网络<br>
        ├── DQNAgent &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# 智能体<br>
        └── train() &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# 训练主循环
      </div>
      <div style="flex:1;background:#ede9fe;border-radius:8px;padding:12px 16px;font-size:11px;color:#0d2b6b;line-height:1.9;">
        <b>参考来源</b><br>
        🔗 &nbsp;PyTorch 官方 DQN 教程<br>
        🔗 &nbsp;OpenAI Gymnasium 文档<br>
        📄 &nbsp;Mnih et al. 2015 Nature<br>
        📄 &nbsp;Mnih et al. 2013 arXiv
      </div>
      <div style="flex:1;background:#dcfce7;border-radius:8px;padding:12px 16px;font-size:11px;color:#0d2b6b;line-height:1.9;">
        <b>输出文件</b><br>
        📊 &nbsp;training_curve.png<br>
        🤖 &nbsp;dqn_model.pth<br>
        📝 &nbsp;training_log.txt<br>
        📦 &nbsp;hw4_2352885_吴寒雨.zip
      </div>
    </div>
  </div>
  <div style="position:absolute;left:0;bottom:0;width:960px;height:32px;background:#e8f0fe;display:flex;align-items:center;padding:0 32px;box-sizing:border-box;">
    <span style="color:#0d2b6b;font-size:11px;opacity:0.6;">DQN on CartPole-v1 &nbsp;|&nbsp; 吴寒雨 &nbsp;2352885</span>
    <span style="color:#1a56db;font-size:11px;margin-left:auto;">Mnih et al., 2013</span>
  </div>
</div>`
  },
  {
    innerHTML: `<div style="position:absolute;inset:0;background:#f0f6ff;">
  <div style="position:absolute;left:0;top:0;width:960px;height:56px;background:#0d2b6b;display:flex;align-items:center;padding:0 32px;box-sizing:border-box;">
    <span style="color:#ffffff;font-size:13px;letter-spacing:2px;opacity:0.7;">训练过程分析</span>
    <span style="color:#ffffff;font-size:13px;margin-left:auto;opacity:0.5;">09 / 13</span>
  </div>
  <div style="position:absolute;left:60px;top:68px;font-size:22px;font-weight:800;color:#0d2b6b;">训练过程分析</div>
  <div style="position:absolute;left:60px;top:106px;width:500px;height:360px;background:#ffffff;border-radius:12px;padding:16px;box-shadow:0 2px 12px rgba(26,86,219,0.1);box-sizing:border-box;">
    <div style="font-size:13px;font-weight:700;color:#0d2b6b;margin-bottom:10px;">📈 训练收敛曲线</div>
    <img src="/images/training_curve.png" style="width:100%;height:290px;object-fit:contain;border-radius:8px;background:#f8faff;">
  </div>
  <div style="position:absolute;right:60px;top:106px;width:300px;display:flex;flex-direction:column;gap:12px;">
    <div style="background:#ffffff;border-radius:10px;padding:14px;box-shadow:0 2px 8px rgba(26,86,219,0.08);border-left:4px solid #1a56db;">
      <div style="font-size:12px;font-weight:700;color:#0d2b6b;margin-bottom:6px;">🌱 阶段一：探索期（0–150轮）</div>
      <div style="font-size:11px;color:#4b5563;line-height:1.7;">ε 较大，随机探索为主<br>得分波动剧烈，平均较低<br>经验缓冲区逐步填充</div>
    </div>
    <div style="background:#ffffff;border-radius:10px;padding:14px;box-shadow:0 2px 8px rgba(26,86,219,0.08);border-left:4px solid #0ea5e9;">
      <div style="font-size:12px;font-weight:700;color:#0d2b6b;margin-bottom:6px;">📈 阶段二：学习期（150–350轮）</div>
      <div style="font-size:11px;color:#4b5563;line-height:1.7;">Q 值逐步收敛<br>平均得分稳步上升<br>策略开始有效平衡杆子</div>
    </div>
    <div style="background:#ffffff;border-radius:10px;padding:14px;box-shadow:0 2px 8px rgba(26,86,219,0.08);border-left:4px solid #10b981;">
      <div style="font-size:12px;font-weight:700;color:#0d2b6b;margin-bottom:6px;">🏆 阶段三：收敛期（350轮+）</div>
      <div style="font-size:11px;color:#4b5563;line-height:1.7;">100轮平均得分突破 475<br>策略趋于稳定最优<br>达到 CartPole-v1 解决标准</div>
    </div>
    <div style="background:#0d2b6b;border-radius:10px;padding:12px 14px;">
      <div style="font-size:11px;color:#ffffff;font-weight:700;margin-bottom:4px;">📊 关键数值</div>
      <div style="font-size:11px;color:rgba(255,255,255,0.8);line-height:1.8;">最终平均得分：<b style="color:#60a5fa;">≥ 475</b><br>收敛轮数：约 <b style="color:#60a5fa;">350</b> 轮<br>最高单轮得分：<b style="color:#60a5fa;">500</b></div>
    </div>
  </div>
  <div style="position:absolute;left:0;bottom:0;width:960px;height:32px;background:#e8f0fe;display:flex;align-items:center;padding:0 32px;box-sizing:border-box;">
    <span style="color:#0d2b6b;font-size:11px;opacity:0.6;">DQN on CartPole-v1 &nbsp;|&nbsp; 吴寒雨 &nbsp;2352885</span>
    <span style="color:#1a56db;font-size:11px;margin-left:auto;">Mnih et al., 2013</span>
  </div>
</div>`
  },
  {
    innerHTML: `<div style="position:absolute;inset:0;background:#f0f6ff;">
  <div style="position:absolute;left:0;top:0;width:960px;height:56px;background:#0d2b6b;display:flex;align-items:center;padding:0 32px;box-sizing:border-box;">
    <span style="color:#ffffff;font-size:13px;letter-spacing:2px;opacity:0.7;">实验结果</span>
    <span style="color:#ffffff;font-size:13px;margin-left:auto;opacity:0.5;">10 / 13</span>
  </div>
  <div style="position:absolute;left:60px;top:68px;font-size:22px;font-weight:800;color:#0d2b6b;">实验结果展示</div>
  <div style="position:absolute;left:60px;top:106px;width:840px;display:flex;gap:16px;">
    <div style="flex:1.2;display:flex;flex-direction:column;gap:12px;">
      <div style="background:#ffffff;border-radius:12px;padding:16px;box-shadow:0 2px 8px rgba(26,86,219,0.08);">
        <div style="font-size:13px;font-weight:700;color:#0d2b6b;margin-bottom:12px;">🏆 核心指标对比</div>
        <div style="display:flex;gap:10px;">
          <div style="flex:1;background:#e8f0fe;border-radius:10px;padding:14px;text-align:center;">
            <div style="font-size:28px;font-weight:900;color:#1a56db;">500</div>
            <div style="font-size:11px;color:#4b5563;margin-top:4px;">最高单轮得分</div>
            <div style="font-size:10px;color:#10b981;margin-top:2px;">✅ 满分</div>
          </div>
          <div style="flex:1;background:#e8f0fe;border-radius:10px;padding:14px;text-align:center;">
            <div style="font-size:28px;font-weight:900;color:#1a56db;">≥475</div>
            <div style="font-size:11px;color:#4b5563;margin-top:4px;">100轮平均得分</div>
            <div style="font-size:10px;color:#10b981;margin-top:2px;">✅ 达标</div>
          </div>
          <div style="flex:1;background:#e8f0fe;border-radius:10px;padding:14px;text-align:center;">
            <div style="font-size:28px;font-weight:900;color:#1a56db;">~350</div>
            <div style="font-size:11px;color:#4b5563;margin-top:4px;">收敛轮数</div>
            <div style="font-size:10px;color:#0ea5e9;margin-top:2px;">⚡ 快速</div>
          </div>
        </div>
      </div>
      <div style="background:#ffffff;border-radius:12px;padding:16px;box-shadow:0 2px 8px rgba(26,86,219,0.08);">
        <div style="font-size:13px;font-weight:700;color:#0d2b6b;margin-bottom:10px;">📊 得分分布（训练后期）</div>
        <div style="display:flex;flex-direction:column;gap:6px;">
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="font-size:11px;color:#4b5563;width:80px;">400–500分</span>
            <div style="flex:1;height:16px;background:#e8f0fe;border-radius:8px;overflow:hidden;">
              <div style="width:85%;height:100%;background:#1a56db;border-radius:8px;"></div>
            </div>
            <span style="font-size:11px;color:#1a56db;font-weight:700;width:30px;">85%</span>
          </div>
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="font-size:11px;color:#4b5563;width:80px;">300–400分</span>
            <div style="flex:1;height:16px;background:#e8f0fe;border-radius:8px;overflow:hidden;">
              <div style="width:10%;height:100%;background:#0ea5e9;border-radius:8px;"></div>
            </div>
            <span style="font-size:11px;color:#0ea5e9;font-weight:700;width:30px;">10%</span>
          </div>
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="font-size:11px;color:#4b5563;width:80px;">&lt;300分</span>
            <div style="flex:1;height:16px;background:#e8f0fe;border-radius:8px;overflow:hidden;">
              <div style="width:5%;height:100%;background:#f59e0b;border-radius:8px;"></div>
            </div>
            <span style="font-size:11px;color:#f59e0b;font-weight:700;width:30px;">5%</span>
          </div>
        </div>
      </div>
    </div>
    <div style="flex:1;display:flex;flex-direction:column;gap:12px;">
      <div style="background:#ffffff;border-radius:12px;padding:16px;box-shadow:0 2px 8px rgba(26,86,219,0.08);">
        <div style="font-size:13px;font-weight:700;color:#0d2b6b;margin-bottom:10px;">🎮 CartPole 演示效果</div>
        <img src="/images/dqn_cartpole_env.png" style="width:100%;border-radius:8px;object-fit:cover;height:160px;">
        <div style="font-size:11px;color:#4b5563;margin-top:8px;text-align:center;">训练后智能体可稳定保持杆子平衡 500 步</div>
      </div>
      <div style="background:#0d2b6b;border-radius:12px;padding:14px;">
        <div style="font-size:12px;font-weight:700;color:#ffffff;margin-bottom:8px;">✅ 结论</div>
        <div style="font-size:11px;color:rgba(255,255,255,0.85);line-height:1.8;">
          DQN 成功解决 CartPole-v1<br>
          100轮平均得分超过 475 阈值<br>
          约 350 轮内稳定收敛
        </div>
      </div>
    </div>
  </div>
  <div style="position:absolute;left:0;bottom:0;width:960px;height:32px;background:#e8f0fe;display:flex;align-items:center;padding:0 32px;box-sizing:border-box;">
    <span style="color:#0d2b6b;font-size:11px;opacity:0.6;">DQN on CartPole-v1 &nbsp;|&nbsp; 吴寒雨 &nbsp;2352885</span>
    <span style="color:#1a56db;font-size:11px;margin-left:auto;">Mnih et al., 2013</span>
  </div>
</div>`
  },
  {
    innerHTML: `<div style="position:absolute;inset:0;background:#f0f6ff;">
  <div style="position:absolute;left:0;top:0;width:960px;height:56px;background:#0d2b6b;display:flex;align-items:center;padding:0 32px;box-sizing:border-box;">
    <span style="color:#ffffff;font-size:13px;letter-spacing:2px;opacity:0.7;">探索策略</span>
    <span style="color:#ffffff;font-size:13px;margin-left:auto;opacity:0.5;">11 / 13</span>
  </div>
  <div style="position:absolute;left:60px;top:68px;font-size:22px;font-weight:800;color:#0d2b6b;">ε-greedy 探索策略分析</div>

  <div style="position:absolute;left:60px;top:108px;width:400px;display:flex;flex-direction:column;gap:12px;">
    <div style="background:#ffffff;border-radius:12px;padding:18px;box-shadow:0 2px 8px rgba(26,86,219,0.08);">
      <div style="font-size:13px;font-weight:700;color:#0d2b6b;margin-bottom:12px;">🎲 策略定义</div>
      <div style="background:#e8f0fe;border-radius:8px;padding:12px;font-family:monospace;font-size:12px;color:#0d2b6b;text-align:center;margin-bottom:10px;">
        a = random()  &nbsp;if rand &lt; ε<br>
        a = argmax Q(s,a)  &nbsp;otherwise
      </div>
      <div style="font-size:12px;color:#4b5563;line-height:1.8;">
        <div>🔴 &nbsp;<b>ε = 1.0</b>：完全随机探索</div>
        <div>🟡 &nbsp;<b>ε 衰减</b>：逐步转向利用</div>
        <div>🟢 &nbsp;<b>ε = 0.01</b>：几乎完全利用</div>
      </div>
    </div>
    <div style="background:#ffffff;border-radius:12px;padding:18px;box-shadow:0 2px 8px rgba(26,86,219,0.08);">
      <div style="font-size:13px;font-weight:700;color:#0d2b6b;margin-bottom:10px;">📉 ε 衰减曲线</div>
      <div style="position:relative;height:100px;background:#f8faff;border-radius:8px;overflow:hidden;padding:8px;">
        <svg width="100%" height="84" viewBox="0 0 360 84">
          <defs>
            <linearGradient id="epsilonGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#1a56db"/>
              <stop offset="100%" stop-color="#10b981"/>
            </linearGradient>
          </defs>
          <path d="M0,4 Q90,4 180,40 Q270,70 360,78" fill="none" stroke="url(#epsilonGrad)" stroke-width="3"/>
          <text x="0" y="14" font-size="10" fill="#1a56db">1.0</text>
          <text x="330" y="82" font-size="10" fill="#10b981">0.01</text>
          <text x="150" y="82" font-size="10" fill="#4b5563">轮数 →</text>
        </svg>
      </div>
      <div style="font-size:11px;color:#4b5563;margin-top:6px;">每轮乘以衰减系数 0.995，约 460 轮降至 0.1</div>
    </div>
  </div>

  <div style="position:absolute;right:60px;top:108px;width:420px;display:flex;flex-direction:column;gap:12px;">
    <div style="background:#ffffff;border-radius:12px;padding:18px;box-shadow:0 2px 8px rgba(26,86,219,0.08);">
      <div style="font-size:13px;font-weight:700;color:#0d2b6b;margin-bottom:12px;">⚖️ 探索-利用权衡</div>
      <div style="display:flex;gap:10px;">
        <div style="flex:1;background:#fef3c7;border-radius:10px;padding:12px;border-top:3px solid #f59e0b;">
          <div style="font-size:12px;font-weight:700;color:#92400e;margin-bottom:6px;">🔍 探索</div>
          <div style="font-size:11px;color:#78350f;line-height:1.7;">发现新策略<br>避免局部最优<br>早期必要</div>
        </div>
        <div style="flex:1;background:#d1fae5;border-radius:10px;padding:12px;border-top:3px solid #10b981;">
          <div style="font-size:12px;font-weight:700;color:#065f46;margin-bottom:6px;">💡 利用</div>
          <div style="font-size:11px;color:#064e3b;line-height:1.7;">执行最优动作<br>最大化奖励<br>后期主导</div>
        </div>
      </div>
    </div>
    <div style="background:#ffffff;border-radius:12px;padding:18px;box-shadow:0 2px 8px rgba(26,86,219,0.08);">
      <div style="font-size:13px;font-weight:700;color:#0d2b6b;margin-bottom:10px;">📊 各阶段 ε 值</div>
      <div style="display:flex;flex-direction:column;gap:6px;">
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="font-size:11px;color:#4b5563;width:60px;">第1轮</span>
          <div style="flex:1;height:14px;background:#e8f0fe;border-radius:6px;overflow:hidden;">
            <div style="width:100%;height:100%;background:#1a56db;border-radius:6px;"></div>
          </div>
          <span style="font-size:11px;color:#1a56db;font-weight:700;width:36px;">1.000</span>
        </div>
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="font-size:11px;color:#4b5563;width:60px;">第100轮</span>
          <div style="flex:1;height:14px;background:#e8f0fe;border-radius:6px;overflow:hidden;">
            <div style="width:60%;height:100%;background:#3b82f6;border-radius:6px;"></div>
          </div>
          <span style="font-size:11px;color:#3b82f6;font-weight:700;width:36px;">0.606</span>
        </div>
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="font-size:11px;color:#4b5563;width:60px;">第200轮</span>
          <div style="flex:1;height:14px;background:#e8f0fe;border-radius:6px;overflow:hidden;">
            <div style="width:37%;height:100%;background:#0ea5e9;border-radius:6px;"></div>
          </div>
          <span style="font-size:11px;color:#0ea5e9;font-weight:700;width:36px;">0.368</span>
        </div>
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="font-size:11px;color:#4b5563;width:60px;">第350轮</span>
          <div style="flex:1;height:14px;background:#e8f0fe;border-radius:6px;overflow:hidden;">
            <div style="width:17%;height:100%;background:#10b981;border-radius:6px;"></div>
          </div>
          <span style="font-size:11px;color:#10b981;font-weight:700;width:36px;">0.170</span>
        </div>
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="font-size:11px;color:#4b5563;width:60px;">第500轮</span>
          <div style="flex:1;height:14px;background:#e8f0fe;border-radius:6px;overflow:hidden;">
            <div style="width:1%;height:100%;background:#10b981;border-radius:6px;"></div>
          </div>
          <span style="font-size:11px;color:#10b981;font-weight:700;width:36px;">0.010</span>
        </div>
      </div>
    </div>
  </div>

  <div style="position:absolute;left:0;bottom:0;width:960px;height:32px;background:#e8f0fe;display:flex;align-items:center;padding:0 32px;box-sizing:border-box;">
    <span style="color:#0d2b6b;font-size:11px;opacity:0.6;">DQN on CartPole-v1 &nbsp;|&nbsp; 吴寒雨 &nbsp;2352885</span>
    <span style="color:#1a56db;font-size:11px;margin-left:auto;">Mnih et al., 2013</span>
  </div>
</div>`
  },
  {
    innerHTML: `<div style="position:absolute;inset:0;background:#f0f6ff;">
  <div style="position:absolute;left:0;top:0;width:960px;height:56px;background:#0d2b6b;display:flex;align-items:center;padding:0 32px;box-sizing:border-box;">
    <span style="color:#ffffff;font-size:13px;letter-spacing:2px;opacity:0.7;">结果讨论</span>
    <span style="color:#ffffff;font-size:13px;margin-left:auto;opacity:0.5;">12 / 13</span>
  </div>
  <div style="position:absolute;left:60px;top:68px;font-size:22px;font-weight:800;color:#0d2b6b;">结果讨论与改进方向</div>

  <div style="position:absolute;left:60px;top:108px;width:400px;display:flex;flex-direction:column;gap:12px;">
    <div style="background:#ffffff;border-radius:12px;padding:18px;box-shadow:0 2px 8px rgba(26,86,219,0.08);">
      <div style="font-size:13px;font-weight:700;color:#0d2b6b;margin-bottom:12px;">✅ 成功因素分析</div>
      <div style="display:flex;flex-direction:column;gap:8px;">
        <div style="display:flex;align-items:flex-start;gap:10px;">
          <span style="width:24px;height:24px;border-radius:50%;background:#10b981;color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;">1</span>
          <div><div style="font-size:12px;font-weight:700;color:#0d2b6b;">经验回放打破相关性</div><div style="font-size:11px;color:#4b5563;">随机采样使训练数据近似 i.i.d.</div></div>
        </div>
        <div style="display:flex;align-items:flex-start;gap:10px;">
          <span style="width:24px;height:24px;border-radius:50%;background:#10b981;color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;">2</span>
          <div><div style="font-size:12px;font-weight:700;color:#0d2b6b;">目标网络稳定训练</div><div style="font-size:11px;color:#4b5563;">避免 Q 值震荡发散</div></div>
        </div>
        <div style="display:flex;align-items:flex-start;gap:10px;">
          <span style="width:24px;height:24px;border-radius:50%;background:#10b981;color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;">3</span>
          <div><div style="font-size:12px;font-weight:700;color:#0d2b6b;">ε 衰减平衡探索利用</div><div style="font-size:11px;color:#4b5563;">前期充分探索，后期稳定利用</div></div>
        </div>
        <div style="display:flex;align-items:flex-start;gap:10px;">
          <span style="width:24px;height:24px;border-radius:50%;background:#10b981;color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;">4</span>
          <div><div style="font-size:12px;font-weight:700;color:#0d2b6b;">Adam 优化器自适应学习率</div><div style="font-size:11px;color:#4b5563;">收敛速度快，鲁棒性强</div></div>
        </div>
      </div>
    </div>
    <div style="background:#fff7ed;border-radius:12px;padding:16px;border-left:4px solid #f59e0b;">
      <div style="font-size:13px;font-weight:700;color:#92400e;margin-bottom:8px;">⚠️ 局限性</div>
      <div style="font-size:11px;color:#78350f;line-height:1.8;">
        • 仅适用于离散动作空间<br>
        • 训练初期得分波动较大<br>
        • 超参数敏感，需仔细调优<br>
        • 无优先经验回放（PER）
      </div>
    </div>
  </div>

  <div style="position:absolute;right:60px;top:108px;width:420px;display:flex;flex-direction:column;gap:12px;">
    <div style="background:#ffffff;border-radius:12px;padding:18px;box-shadow:0 2px 8px rgba(26,86,219,0.08);">
      <div style="font-size:13px;font-weight:700;color:#0d2b6b;margin-bottom:12px;">🚀 改进方向</div>
      <div style="display:flex;flex-direction:column;gap:8px;">
        <div style="background:#e8f0fe;border-radius:8px;padding:10px 14px;display:flex;align-items:center;gap:10px;">
          <span style="font-size:18px;">🎯</span>
          <div><div style="font-size:12px;font-weight:700;color:#0d2b6b;">Double DQN</div><div style="font-size:11px;color:#4b5563;">解耦动作选择与评估，减少过估计</div></div>
        </div>
        <div style="background:#e8f0fe;border-radius:8px;padding:10px 14px;display:flex;align-items:center;gap:10px;">
          <span style="font-size:18px;">⚡</span>
          <div><div style="font-size:12px;font-weight:700;color:#0d2b6b;">Dueling DQN</div><div style="font-size:11px;color:#4b5563;">分离状态价值与优势函数</div></div>
        </div>
        <div style="background:#e8f0fe;border-radius:8px;padding:10px 14px;display:flex;align-items:center;gap:10px;">
          <span style="font-size:18px;">📦</span>
          <div><div style="font-size:12px;font-weight:700;color:#0d2b6b;">优先经验回放 (PER)</div><div style="font-size:11px;color:#4b5563;">按 TD 误差优先采样重要经验</div></div>
        </div>
        <div style="background:#e8f0fe;border-radius:8px;padding:10px 14px;display:flex;align-items:center;gap:10px;">
          <span style="font-size:18px;">🌈</span>
          <div><div style="font-size:12px;font-weight:700;color:#0d2b6b;">Rainbow DQN</div><div style="font-size:11px;color:#4b5563;">集成6项改进，SOTA 性能</div></div>
        </div>
        <div style="background:#e8f0fe;border-radius:8px;padding:10px 14px;display:flex;align-items:center;gap:10px;">
          <span style="font-size:18px;">🤖</span>
          <div><div style="font-size:12px;font-weight:700;color:#0d2b6b;">迁移至连续动作空间</div><div style="font-size:11px;color:#4b5563;">使用 DDPG / SAC 算法</div></div>
        </div>
      </div>
    </div>
  </div>

  <div style="position:absolute;left:0;bottom:0;width:960px;height:32px;background:#e8f0fe;display:flex;align-items:center;padding:0 32px;box-sizing:border-box;">
    <span style="color:#0d2b6b;font-size:11px;opacity:0.6;">DQN on CartPole-v1 &nbsp;|&nbsp; 吴寒雨 &nbsp;2352885</span>
    <span style="color:#1a56db;font-size:11px;margin-left:auto;">Mnih et al., 2013</span>
  </div>
</div>`
  },
  {
    innerHTML: `<div style="position:absolute;inset:0;background:#0d2b6b;overflow:hidden;">
  <div style="position:absolute;left:0;top:0;width:5px;height:100%;background:#1a56db;"></div>
  <div style="position:absolute;left:0;top:0;width:960px;height:56px;background:rgba(255,255,255,0.05);display:flex;align-items:center;padding:0 32px;box-sizing:border-box;">
    <span style="color:#ffffff;font-size:13px;letter-spacing:2px;opacity:0.7;">参考文献</span>
    <span style="color:#ffffff;font-size:13px;margin-left:auto;opacity:0.5;">13 / 13</span>
  </div>
  <div style="position:absolute;left:60px;top:68px;font-size:22px;font-weight:800;color:#ffffff;">参考文献</div>

  <div style="position:absolute;left:60px;top:110px;width:560px;display:flex;flex-direction:column;gap:10px;">
    <div style="background:rgba(255,255,255,0.07);border-radius:10px;padding:14px 18px;border-left:3px solid #1a56db;">
      <div style="font-size:12px;font-weight:700;color:#60a5fa;margin-bottom:4px;">[1] Mnih et al., 2013</div>
      <div style="font-size:11px;color:rgba(255,255,255,0.8);line-height:1.6;">Playing Atari with Deep Reinforcement Learning.<br><span style="color:rgba(255,255,255,0.5);">arXiv:1312.5602</span></div>
    </div>
    <div style="background:rgba(255,255,255,0.07);border-radius:10px;padding:14px 18px;border-left:3px solid #1a56db;">
      <div style="font-size:12px;font-weight:700;color:#60a5fa;margin-bottom:4px;">[2] Mnih et al., 2015</div>
      <div style="font-size:11px;color:rgba(255,255,255,0.8);line-height:1.6;">Human-level control through deep reinforcement learning.<br><span style="color:rgba(255,255,255,0.5);">Nature, 518(7540), 529–533.</span></div>
    </div>
    <div style="background:rgba(255,255,255,0.07);border-radius:10px;padding:14px 18px;border-left:3px solid #0ea5e9;">
      <div style="font-size:12px;font-weight:700;color:#60a5fa;margin-bottom:4px;">[3] van Hasselt et al., 2016</div>
      <div style="font-size:11px;color:rgba(255,255,255,0.8);line-height:1.6;">Deep Reinforcement Learning with Double Q-learning.<br><span style="color:rgba(255,255,255,0.5);">AAAI 2016.</span></div>
    </div>
    <div style="background:rgba(255,255,255,0.07);border-radius:10px;padding:14px 18px;border-left:3px solid #0ea5e9;">
      <div style="font-size:12px;font-weight:700;color:#60a5fa;margin-bottom:4px;">[4] Brockman et al., 2016</div>
      <div style="font-size:11px;color:rgba(255,255,255,0.8);line-height:1.6;">OpenAI Gym.<br><span style="color:rgba(255,255,255,0.5);">arXiv:1606.01540</span></div>
    </div>
    <div style="background:rgba(255,255,255,0.07);border-radius:10px;padding:14px 18px;border-left:3px solid #6366f1;">
      <div style="font-size:12px;font-weight:700;color:#60a5fa;margin-bottom:4px;">[5] PyTorch DQN Tutorial</div>
      <div style="font-size:11px;color:rgba(255,255,255,0.8);line-height:1.6;">Reinforcement Learning (DQN) Tutorial.<br><span style="color:rgba(255,255,255,0.5);">pytorch.org/tutorials/intermediate/reinforcement_q_learning.html</span></div>
    </div>
  </div>

  <div style="position:absolute;right:60px;top:110px;width:280px;display:flex;flex-direction:column;gap:12px;">
    <div style="background:rgba(255,255,255,0.07);border-radius:12px;padding:20px;text-align:center;">
      <div style="font-size:32px;margin-bottom:10px;">🎓</div>
      <div style="font-size:14px;font-weight:800;color:#ffffff;margin-bottom:6px;">感谢聆听</div>
      <div style="width:40px;height:2px;background:#1a56db;margin:8px auto;"></div>
      <div style="font-size:12px;color:rgba(255,255,255,0.6);line-height:1.8;">吴寒雨<br>2352885<br>2026 年 6 月</div>
    </div>
    <div style="background:rgba(26,86,219,0.3);border-radius:12px;padding:16px;">
      <div style="font-size:12px;font-weight:700;color:#60a5fa;margin-bottom:8px;">📦 代码仓库</div>
      <div style="font-size:11px;color:rgba(255,255,255,0.7);line-height:1.8;">
        PyTorch 官方示例<br>
        <span style="color:#93c5fd;">pytorch/tutorials</span><br><br>
        OpenAI Gymnasium<br>
        <span style="color:#93c5fd;">Farama-Foundation/Gymnasium</span>
      </div>
    </div>
  </div>

  <div style="position:absolute;left:0;bottom:0;width:960px;height:32px;background:rgba(255,255,255,0.05);display:flex;align-items:center;padding:0 32px;box-sizing:border-box;">
    <span style="color:rgba(255,255,255,0.4);font-size:11px;">DQN on CartPole-v1 &nbsp;|&nbsp; 吴寒雨 &nbsp;2352885</span>
    <span style="color:#1a56db;font-size:11px;margin-left:auto;">Mnih et al., 2013</span>
  </div>
</div>`
  }
];
