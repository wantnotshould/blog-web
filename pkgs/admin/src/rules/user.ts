import type { FormRules } from 'element-plus'

export const loginRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名称', trigger: 'blur' },
    {
      min: 1,
      max: 26,
      message: '名称长度为1~26个字符',
      trigger: 'blur',
    },
    {
      pattern: /^[a-zA-Z0-9+-]{1,26}$/,
      message: '名称只能包含字母、数字、+、-',
      trigger: 'blur',
    },
  ],

  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      min: 6,
      max: 18,
      message: '密码长度应在 6 到 18 个字符之间',
      trigger: 'blur',
    },
    {
      pattern: /^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{}:;,.?]{6,18}$/,
      message: '密码格式不正确',
      trigger: 'blur',
    },
  ],
}
