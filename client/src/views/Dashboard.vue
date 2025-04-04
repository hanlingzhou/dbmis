<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <h2 class="gradient-text">数据可视化展示</h2>
    </div>
    
    <el-row :gutter="24">
      <!-- 数据卡片 -->
      <el-col :xs="24" :sm="12" :md="6">
        <div class="data-card card-1" tabindex="0">
          <div class="data-card-content">
            <div class="data-card-value">{{ stats.totalEmployees }}</div>
            <div class="data-card-label">员工总数</div>
          </div>
          <div class="card-hover-effect"></div>
        </div>
      </el-col>
      
      <el-col :xs="24" :sm="12" :md="6">
        <div class="data-card card-2" tabindex="0">
          <div class="data-card-content">
            <div class="data-card-value">{{ stats.departments }}</div>
            <div class="data-card-label">部门总数</div>
          </div>
          <div class="card-hover-effect"></div>
        </div>
      </el-col>
      
      <el-col :xs="24" :sm="12" :md="6">
        <div class="data-card card-3" tabindex="0">
          <div class="data-card-content">
            <div class="data-card-value">{{ stats.positions }}</div>
            <div class="data-card-label">岗位总数</div>
          </div>
          <div class="card-hover-effect"></div>
        </div>
      </el-col>
      
      <el-col :xs="24" :sm="12" :md="6">
        <div class="data-card card-4" tabindex="0">
          <div class="data-card-content">
            <div class="data-card-value">{{ stats.newHires }}</div>
            <div class="data-card-label">本月新增</div>
          </div>
          <div class="card-hover-effect"></div>
        </div>
      </el-col>
    </el-row>
    
    <!-- 饼图1：部门人员分布 -->
    <el-row :gutter="24" class="chart-row">
      <el-col :span="24">
        <div class="chart-card">
          <div class="chart-header">
            <h3>部门人员分布</h3>
            <div class="chart-desc">全公司共 {{ stats.totalEmployees }} 名员工，分布于 {{ stats.departments }} 个部门</div>
          </div>
          <div id="departmentDistribution" class="chart-container"></div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, onBeforeUnmount, onErrorCaptured } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts/core'
import { PieChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { LabelLayout } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'

// 注册 ECharts 组件
echarts.use([
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  CanvasRenderer,
  LabelLayout
])

// 组件卸载标志，用于防止异步操作在组件卸载后继续执行
const isComponentUnmounted = ref(false)
const stats = ref({
  totalEmployees: 128,
  departments: 8,
  positions: 24,
  newHires: 6,
  leaveCount: 10,
  attendanceRate: 95,
  averageSalary: 8000,
  laborCost: 200,
  retentionRate: 92,
  trainingCourses: 15,
  satisfaction: 4.2,
  goalCompletion: 86,
  trainingHours: 120,
  avgAge: 32,
  certifications: 65,
  projectRate: 94
})

// 部门分布数据
const departmentData = [
  { value: 42, name: '技术部' },
  { value: 28, name: '市场部' },
  { value: 18, name: '财务部' },
  { value: 15, name: '人力资源部' },
  { value: 12, name: '行政部' },
  { value: 8, name: '客服部' },
  { value: 5, name: '法务部' }
]

// 饼图实例
let departmentChart = null

// 简化的鼠标移动处理函数
let handleMouseMove = null;

// 安全操作函数
function safeOperation(fn) {
  try {
    if (typeof window === 'undefined' || isComponentUnmounted?.value === true) {
      return false;
    }
    return fn();
  } catch (e) {
    console.error('安全操作执行失败:', e);
    return false;
  }
}

// 初始化图表
function initCharts() {
  // 初始化部门分布饼图
  const departmentDom = document.getElementById('departmentDistribution')
  if (departmentDom) {
    departmentChart = echarts.init(departmentDom)
    departmentChart.setOption({
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c}人 ({d}%)',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderColor: 'rgba(0, 0, 0, 0.05)',
        borderWidth: 1,
        padding: [10, 15],
        textStyle: {
          color: '#333',
          fontSize: 14
        },
        extraCssText: 'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); border-radius: 8px;'
      },
      legend: {
        orient: 'vertical',
        right: '15%',
        top: 'center',
        itemWidth: 22,
        itemHeight: 22,
        itemGap: 24,
        textStyle: {
          fontSize: 16,
          fontWeight: 500,
          color: '#555'
        },
        icon: 'roundRect',
        formatter: function(name) {
          const item = departmentData.find(item => item.name === name);
          if (item) {
            return `${name} (${item.value}人)`;
          }
          return name;
        },
        data: departmentData.map(item => item.name)
      },
      series: [
        {
          name: '部门分布',
          type: 'pie',
          center: ['35%', '50%'],
          radius: ['40%', '75%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 15,
            borderColor: '#fff',
            borderWidth: 3
          },
          label: {
            show: true,
            position: 'inside',
            formatter: '{d}%',
            fontSize: 16,
            fontWeight: 'bold',
            color: '#fff',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 20,
              fontWeight: 'bold',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
            },
            itemStyle: {
              shadowBlur: 15,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            { 
              value: 42, 
              name: '技术部',
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0, y: 0, x2: 0, y2: 1,
                  colorStops: [
                    { offset: 0, color: '#4facfe' },
                    { offset: 1, color: '#00f2fe' }
                  ]
                }
              }
            },
            { 
              value: 28, 
              name: '市场部',
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0, y: 0, x2: 0, y2: 1,
                  colorStops: [
                    { offset: 0, color: '#ff8177' },
                    { offset: 1, color: '#ff867a' }
                  ]
                }
              }
            },
            { 
              value: 18, 
              name: '财务部',
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0, y: 0, x2: 0, y2: 1,
                  colorStops: [
                    { offset: 0, color: '#84fab0' },
                    { offset: 1, color: '#8fd3f4' }
                  ]
                }
              }
            },
            { 
              value: 15, 
              name: '人力资源部',
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0, y: 0, x2: 0, y2: 1,
                  colorStops: [
                    { offset: 0, color: '#a18cd1' },
                    { offset: 1, color: '#fbc2eb' }
                  ]
                }
              }
            },
            { 
              value: 12, 
              name: '行政部',
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0, y: 0, x2: 0, y2: 1,
                  colorStops: [
                    { offset: 0, color: '#fad0c4' },
                    { offset: 1, color: '#ffd1ff' }
                  ]
                }
              }
            },
            { 
              value: 8, 
              name: '客服部',
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0, y: 0, x2: 0, y2: 1,
                  colorStops: [
                    { offset: 0, color: '#f6d365' },
                    { offset: 1, color: '#fda085' }
                  ]
                }
              }
            },
            { 
              value: 5, 
              name: '法务部',
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0, y: 0, x2: 0, y2: 1,
                  colorStops: [
                    { offset: 0, color: '#96e6a1' },
                    { offset: 1, color: '#d4fc79' }
                  ]
                }
              }
            }
          ]
        }
      ]
    })
  }
}

// 调整图表大小
function resizeCharts() {
  if (departmentChart) {
    departmentChart.resize()
  }
}

// 路由钩子
const router = useRouter();

if (router && !window.__routerGuardsInstalled) {
  window.__routerGuardsInstalled = true;
  
  router.beforeEach((to, from, next) => {
    if (from.name === 'Dashboard' || from.path.includes('/dashboard')) {
      isComponentUnmounted.value = true;
    }
    next();
  });
}

// 简化后的挂载钩子
onMounted(() => {
  isComponentUnmounted.value = false;
  
  safeOperation(() => {
    // 设置卡片索引
    document.querySelectorAll('.data-card').forEach((card, index) => {
      if (card) card.style.setProperty('--index', index);
    });
    
    // 初始化图表
    initCharts();
    
    // 添加窗口大小改变事件监听
    window.addEventListener('resize', resizeCharts);
    
    // 简化的鼠标效果处理
    handleMouseMove = (e) => {
      if (isComponentUnmounted.value) return;
      
      const element = document.elementFromPoint(e.clientX, e.clientY);
      if (!element) return;
      
      const card = element.closest('.data-card');
      if (card && document.body.contains(card)) {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
      }
    };
    
    document.addEventListener('mousemove', handleMouseMove);
  });
});

// 组件卸载钩子
onBeforeUnmount(() => {
  isComponentUnmounted.value = true;
  
  safeOperation(() => {
    // 移除事件监听
    if (handleMouseMove) {
      document.removeEventListener('mousemove', handleMouseMove);
    }
    
    // 移除窗口大小改变事件监听
    window.removeEventListener('resize', resizeCharts);
    
    // 销毁图表实例
    if (departmentChart) {
      departmentChart.dispose();
      departmentChart = null;
    }
  });
});

// 组件完全卸载
onUnmounted(() => {
  isComponentUnmounted.value = true;
});

// 错误捕获钩子
onErrorCaptured((err) => {
  console.warn('[错误捕获]', err);
  return false;
});
</script>

<style scoped>
.dashboard-container {
  padding: 0;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.dashboard-header h2 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
  background: linear-gradient(90deg, #003B8C, #0066E0, #00A1FF);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
}

.gradient-text {
  background: var(--gradient-blue);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.5px;
}

.data-card {
  background-color: var(--apple-card-bg);
  border-radius: var(--apple-radius-md);
  padding: 30px;
  height: 100%;
  margin-bottom: 20px;
  box-shadow: 0 1px 5px var(--apple-shadow), 0 0 1px var(--apple-shadow);
  position: relative;
  cursor: pointer;
  transition: var(--transition-bounce);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  opacity: 0;
  transform: translateY(10px);
  animation: fadeIn 0.5s ease forwards;
  animation-delay: calc(var(--index, 0) * 0.1s);
}

.data-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.data-card-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 5px 0;
}

.data-card-value {
  font-size: 28px;
  font-weight: 600;
  color: var(--apple-text);
  margin-bottom: 10px;
  letter-spacing: -0.5px;
  transition: var(--transition-normal);
}

.data-card-label {
  font-size: 14px;
  color: var(--apple-text-secondary);
  font-weight: 500;
}

.card-hover-effect {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), 
              rgba(255, 255, 255, 0.8) 0%, 
              rgba(255, 255, 255, 0) 60%);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s;
}

.data-card:hover .card-hover-effect, 
.data-card:focus .card-hover-effect {
  opacity: 1;
}

.data-row {
  margin-bottom: 30px;
}

.el-row {
  margin-bottom: 0 !important;
}

:deep(.el-col) {
  padding-bottom: 10px;
}

.card-1 {
  background: linear-gradient(145deg, #f0f7ff, #e6f0ff);
}

.card-2 {
  background: linear-gradient(145deg, #f0fffd, #e6fff9);
}

.card-3 {
  background: linear-gradient(145deg, #f2f0ff, #ebe6ff);
}

.card-4 {
  background: linear-gradient(145deg, #fff7e6, #ffefcc);
}

.card-5 {
  background: linear-gradient(145deg, #e6f4ff, #d6ecff);
}

.card-6 {
  background: linear-gradient(145deg, #e8fff0, #d0fce0);
}

.card-7 {
  background: linear-gradient(145deg, #fff0f6, #ffe0ec);
}

.card-8 {
  background: linear-gradient(145deg, #f5f0ff, #ece0ff);
}

.card-9 {
  background: linear-gradient(145deg, #ffe1e0, #ffc5c0);
}

.card-10 {
  background: linear-gradient(145deg, #c7f9ff, #adefff);
}

.card-11 {
  background: linear-gradient(145deg, #e0ddff, #c9c3ff);
}

.card-12 {
  background: linear-gradient(145deg, #ffd9a8, #ffc88c);
}

.card-13 {
  background: linear-gradient(145deg, #dff5d7, #c3eab4);
}

.card-14 {
  background: linear-gradient(145deg, #ffeebc, #ffe28f);
}

.card-15 {
  background: linear-gradient(145deg, #d4f2ff, #b1e4ff);
}

.card-16 {
  background: linear-gradient(145deg, #e6d7ff, #d2beff);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.chart-row {
  margin-top: 20px;
}

.chart-card {
  background-color: var(--apple-card-bg);
  border-radius: var(--apple-radius-md);
  box-shadow: 0 1px 5px var(--apple-shadow), 0 0 1px var(--apple-shadow);
  padding: 30px;
  height: 800px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  animation: fadeIn 0.6s ease forwards;
  animation-delay: 0.5s;
  opacity: 0;
  transform: translateY(10px);
  position: relative;
  overflow: hidden;
}

.chart-card:hover {
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
  transform: translateY(-8px);
}

.chart-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 80% 40%, rgba(255, 255, 255, 0.15), transparent 60%);
  pointer-events: none;
}

.chart-header {
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  z-index: 1;
}

.chart-header h3 {
  font-size: 24px;
  font-weight: 600;
  color: var(--apple-text);
  margin: 0;
  background: var(--gradient-blue);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.5px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.chart-desc {
  font-size: 15px;
  color: var(--apple-text-secondary);
  margin-top: 10px;
  position: relative;
}

.chart-desc::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 0;
  width: 50px;
  height: 3px;
  background: linear-gradient(90deg, var(--apple-primary), transparent);
  border-radius: 2px;
}

.chart-container {
  width: 100%;
  height: 720px;
  display: flex;
  position: relative;
  z-index: 0;
}
</style> 