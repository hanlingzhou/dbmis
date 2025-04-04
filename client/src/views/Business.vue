<template>
  <div class="business-container">
    <div class="page-header">
      <h2>业务信息</h2>
      <div class="header-actions">
        <!-- 移除刷新数据按钮 -->
      </div>
    </div>
    
    <div class="table-container">
      <el-table
        v-loading="loading"
        :data="businessList"
        style="width: 100%"
        border
      >
        <el-table-column type="index" label="序号" width="50" />
        <el-table-column prop="name" label="业务名称" />
        <el-table-column prop="category" label="业务分类" />
        <el-table-column prop="region" label="所属地区" />
        <el-table-column prop="value" label="业务量" />
        <el-table-column prop="unit" label="单位" width="80" />
        <el-table-column prop="year" label="年份" width="80" />
        <el-table-column prop="month" label="月份" width="80" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag v-if="scope.row.status === 'active'" type="success">有效</el-tag>
            <el-tag v-else-if="scope.row.status === 'inactive'" type="danger">无效</el-tag>
            <el-tag v-else-if="scope.row.status === 'pending'" type="warning">待审核</el-tag>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination-container">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    
    <!-- 业务详情对话框 -->
    <el-dialog 
      v-model="dialogVisible" 
      :title="dialogType === 'add' ? '新增业务' : dialogType === 'edit' ? '编辑业务' : '业务详情'"
      width="600px"
    >
      <el-form 
        ref="businessFormRef" 
        :model="businessForm" 
        :rules="businessRules"
        label-width="100px"
      >
        <el-form-item label="业务名称" prop="name">
          <el-input v-model="businessForm.name" :disabled="dialogType === 'view'" />
        </el-form-item>
        <el-form-item label="业务分类" prop="category">
          <el-select v-model="businessForm.category" placeholder="请选择业务分类" :disabled="dialogType === 'view'">
            <el-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属地区" prop="region">
          <el-select v-model="businessForm.region" placeholder="请选择所属地区" :disabled="dialogType === 'view'">
            <el-option v-for="item in regionOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="业务量" prop="value">
          <el-input-number v-model="businessForm.value" :min="0" :precision="2" :step="0.1" :disabled="dialogType === 'view'" />
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-select v-model="businessForm.unit" placeholder="请选择单位" :disabled="dialogType === 'view'">
            <el-option label="人次" value="人次" />
            <el-option label="户" value="户" />
            <el-option label="万元" value="万元" />
            <el-option label="次" value="次" />
          </el-select>
        </el-form-item>
        <el-form-item label="年份" prop="year">
          <el-date-picker v-model="businessForm.yearMonth" type="month" format="YYYY-MM" placeholder="选择年月" :disabled="dialogType === 'view'" @change="handleYearMonthChange" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="businessForm.status" placeholder="请选择状态" :disabled="dialogType === 'view'">
            <el-option label="有效" value="active" />
            <el-option label="无效" value="inactive" />
            <el-option label="待审核" value="pending" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button v-if="dialogType !== 'view'" type="primary" @click="submitForm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeMount } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 表格数据
const loading = ref(false)
const businessList = ref([])
const total = ref(0)
const pageSize = ref(10)
const currentPage = ref(1)

// 选项数据
const categoryOptions = ref([
  { label: '广电独家', value: '广电独家' },
  { label: '互动增值', value: '互动增值' },
  { label: '频道回看', value: '频道回看' },
  { label: '互动基础点播', value: '互动基础点播' },
  { label: '其他业务', value: '其他业务' }
])

const regionOptions = ref([
  { label: '南京市', value: '南京市' },
  { label: '无锡市', value: '无锡市' },
  { label: '徐州市', value: '徐州市' },
  { label: '常州市', value: '常州市' },
  { label: '苏州市', value: '苏州市' },
  { label: '南通市', value: '南通市' },
  { label: '连云港市', value: '连云港市' },
  { label: '淮安市', value: '淮安市' },
  { label: '盐城市', value: '盐城市' },
  { label: '扬州市', value: '扬州市' },
  { label: '镇江市', value: '镇江市' },
  { label: '泰州市', value: '泰州市' },
  { label: '宿迁市', value: '宿迁市' }
])

// 对话框相关
const dialogVisible = ref(false)
const dialogType = ref('') // add, edit, view
const businessFormRef = ref(null)
const businessForm = reactive({
  id: '',
  name: '',
  category: '',
  region: '',
  value: 0,
  unit: '人次',
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  yearMonth: new Date(),
  status: 'active'
})

// 处理年月数据
const handleYearMonthChange = (date) => {
  if (date) {
    businessForm.year = date.getFullYear()
    businessForm.month = date.getMonth() + 1
  }
}

// 表单验证规则
const businessRules = {
  name: [{ required: true, message: '请输入业务名称', trigger: 'blur' }],
  category: [{ required: true, message: '请选择业务分类', trigger: 'change' }],
  region: [{ required: true, message: '请选择所属地区', trigger: 'change' }],
  value: [{ required: true, message: '请输入业务量', trigger: 'blur' }],
  unit: [{ required: true, message: '请选择单位', trigger: 'change' }],
  yearMonth: [{ required: true, message: '请选择年月', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

// 刷新所有数据
const refreshData = async () => {
  loading.value = true
  useMockData()
  loading.value = false
}

// 获取业务数据列表
const fetchBusinessData = async () => {
  loading.value = true
  try {
    useMockData()
  } finally {
    loading.value = false
  }
}

// 使用模拟数据作为最后的后备方案
const useMockData = () => {
  businessList.value = [
    { id: 1, name: '爱艺在线', category: '广电独家', region: '南京市', value: 1250.5, unit: '人次', year: 2023, month: 1, status: 'active' },
    { id: 2, name: '孝乐华夏', category: '广电独家', region: '无锡市', value: 980.25, unit: '人次', year: 2023, month: 1, status: 'active' },
    { id: 3, name: '奇异影视', category: '互动增值', region: '南京市', value: 2345.75, unit: '人次', year: 2023, month: 1, status: 'active' },
    { id: 4, name: '频道回看', category: '频道回看', region: '苏州市', value: 3562.80, unit: '人次', year: 2023, month: 1, status: 'active' },
    { id: 5, name: '点8', category: '互动基础点播', region: '徐州市', value: 892.60, unit: '人次', year: 2023, month: 1, status: 'pending' },
    { id: 6, name: '教育视听', category: '互动增值', region: '常州市', value: 1567.20, unit: '人次', year: 2023, month: 2, status: 'active' },
    { id: 7, name: '融媒体', category: '广电独家', region: '南通市', value: 2450.30, unit: '人次', year: 2023, month: 2, status: 'active' },
    { id: 8, name: '新闻综合', category: '频道回看', region: '扬州市', value: 1872.90, unit: '人次', year: 2023, month: 2, status: 'active' },
    { id: 9, name: '城市风采', category: '互动基础点播', region: '镇江市', value: 1245.60, unit: '人次', year: 2023, month: 2, status: 'inactive' },
    { id: 10, name: '少儿动漫', category: '互动增值', region: '泰州市', value: 2789.40, unit: '人次', year: 2023, month: 2, status: 'active' }
  ]
  total.value = businessList.value.length
}

const handleSizeChange = (size) => {
  pageSize.value = size
  fetchBusinessData()
}

const handleCurrentChange = (page) => {
  currentPage.value = page
  fetchBusinessData()
}

const resetForm = () => {
  if (businessFormRef.value) {
    businessFormRef.value.resetFields()
  }
  businessForm.id = ''
  businessForm.name = ''
  businessForm.category = ''
  businessForm.region = ''
  businessForm.value = 0
  businessForm.unit = '人次'
  businessForm.year = new Date().getFullYear()
  businessForm.month = new Date().getMonth() + 1
  businessForm.yearMonth = new Date()
  businessForm.status = 'active'
}

const handleAdd = () => {
  dialogType.value = 'add'
  resetForm()
  dialogVisible.value = true
}

const handleView = (row) => {
  dialogType.value = 'view'
  Object.keys(businessForm).forEach(key => {
    if (key === 'yearMonth') {
      businessForm.yearMonth = new Date(row.year, row.month - 1)
    } else {
      businessForm[key] = row[key]
    }
  })
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogType.value = 'edit'
  Object.keys(businessForm).forEach(key => {
    if (key === 'yearMonth') {
      businessForm.yearMonth = new Date(row.year, row.month - 1)
    } else {
      businessForm[key] = row[key]
    }
  })
  dialogVisible.value = true
}

const handleDelete = (row) => {
  ElMessage.success(`删除业务: ${row.name}`)
  fetchBusinessData()
}

const submitForm = () => {
  businessFormRef.value.validate((valid) => {
    if (valid) {
      if (dialogType.value === 'add') {
        ElMessage.success('新增业务成功')
      } else if (dialogType.value === 'edit') {
        ElMessage.success('编辑业务成功')
      }
      dialogVisible.value = false
      fetchBusinessData()
    }
  })
}

onBeforeMount(() => {
  // 不需要调用外部API，所以不需要在这里调用fetchCategories和fetchRegions
})

onMounted(() => {
  fetchBusinessData()
})
</script>

<style scoped>
.business-container {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  font-size: 22px;
  font-weight: 600;
  margin: 0;
  background: linear-gradient(90deg, #003B8C, #0066E0, #00A1FF);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.table-container {
  background-color: var(--apple-card-bg);
  border-radius: var(--apple-radius-md);
  padding: 20px;
  box-shadow: 0 1px 5px var(--apple-shadow), 0 0 1px var(--apple-shadow);
  margin-bottom: 20px;
  animation: fadeIn 0.5s ease forwards;
  animation-delay: 0.2s;
  opacity: 0;
  transform: translateY(10px);
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

:deep(.el-pagination) {
  --el-pagination-bg-color: var(--apple-card-bg);
  --el-pagination-button-bg-color: var(--apple-card-bg);
  --el-pagination-hover-color: var(--apple-primary);
}

:deep(.el-dialog) {
  border-radius: var(--apple-radius-md);
  box-shadow: 0 10px 30px var(--apple-shadow);
  overflow: hidden;
}

:deep(.el-dialog__header) {
  padding: 20px;
  margin: 0;
  border-bottom: 1px solid var(--apple-border);
}

:deep(.el-dialog__title) {
  font-weight: 600;
  background: linear-gradient(90deg, #003B8C, #0066E0, #00A1FF);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

:deep(.el-dialog__body) {
  padding: 20px;
}

:deep(.el-tag) {
  white-space: nowrap;
  width: auto;
  padding-left: 8px;
  padding-right: 8px;
}
</style> 