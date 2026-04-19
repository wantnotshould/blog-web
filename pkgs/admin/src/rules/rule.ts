import type { FormRules } from 'element-plus'

export function baseSearchRules(): FormRules {
  return {
    keyword: [{ max: 26, message: '搜索内容最多26字符', trigger: 'blur' }],
  }
}

export const listRules: FormRules = {
  ...baseSearchRules(),
}
