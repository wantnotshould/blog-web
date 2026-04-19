import type { FormRules } from 'element-plus'

export function postSaveRules(isUpdate = false): FormRules {
  const rules: FormRules = {
    title: [
      { required: true, message: '请输入标题', trigger: 'blur' },
      { max: 100, message: '最多输入100个字符', trigger: 'blur' },
    ],

    category_id: [{ required: true, message: '请选择类型', trigger: 'change' }],

    slug: [
      { required: true, message: '请输入SLUG', trigger: 'blur' },
      { max: 50, message: '最多输入50个字符', trigger: 'blur' },
      {
        pattern: /^[a-zA-Z0-9-]{1,50}$/,
        message: 'Slug 只能包含字母、数字和短横线',
        trigger: 'blur',
      },
    ],

    summary: [
      { required: true, message: '请输入摘要', trigger: 'blur' },
      { max: 200, message: '最多输入200个字符', trigger: 'blur' },
    ],

    status: [{ required: true, message: '请选择状态', trigger: 'change' }],

    content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
  }

  if (isUpdate) {
    rules.id = [
      { required: true, message: 'ID 不可为空', trigger: 'blur' },
      { type: 'number', min: 1, message: 'ID 必须为大于 0 的数字', trigger: 'blur' },
    ]
  }

  return rules
}
