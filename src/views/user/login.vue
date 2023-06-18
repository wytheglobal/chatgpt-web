<script lang="ts">
import { defineComponent, ref } from 'vue'
import type {
  FormInst,
  FormItemInst,
  FormItemRule,
  FormRules,
} from 'naive-ui'
import {
  useMessage,
} from 'naive-ui'
import { useAuthStore } from '@/store'
import { doLogin } from '@/api/user'
import { router } from '@/router'

interface ModelType {
  email: string | null
  verify_code: string | null
  password: string | null
  reenteredPassword: string | null
}

const authStore = useAuthStore()
export default defineComponent({
  setup() {
    const formRef = ref<FormInst | null>(null)
    const rPasswordFormItemRef = ref<FormItemInst | null>(null)
    const message = useMessage()
    const modelRef = ref<ModelType>({
      email: '254287512@qq.com',
      password: null,
      // verify_code: null,
      // reenteredPassword: null,
    })
    function validatePasswordStartWith(
      rule: FormItemRule,
      value: string,
    ): boolean {
      return (
        !!modelRef.value.password
        && modelRef.value.password.startsWith(value)
        && modelRef.value.password.length >= value.length
      )
    }
    function validatePasswordSame(rule: FormItemRule, value: string): boolean {
      return value === modelRef.value.password
    }
    function sendLoginRequest() {
      const data = {
        email: modelRef.value.email!,
        password: modelRef.value.password!,
      }
      console.log('doLogin', data)
      doLogin(data).then((res: any) => {
        message.success('登录成功')
        authStore.setToken(res.access_token)
        router.push('/')
      }, (err) => {
        message.error(err.msg)
      })
    }
    const rules: FormRules = {
      // age: [
      //   {
      //     required: true,
      //     validator(rule: FormItemRule, value: string) {
      //       if (!value) {
      //         return new Error("Age is required");
      //       } else if (!/^\d*$/.test(value)) {
      //         return new Error("Age should be an integer");
      //       } else if (Number(value) < 18) {
      //         return new Error("Age should be above 18");
      //       }
      //       return true;
      //     },
      //     trigger: ["input", "blur"],
      //   },
      // ],
      password: [
        {
          required: true,
          message: 'Password is required',
        },
      ],
      reenteredPassword: [
        {
          required: true,
          message: 'Re-entered password is required',
          trigger: ['input', 'blur'],
        },
        {
          validator: validatePasswordStartWith,
          message: 'Password is not same as re-entered password!',
          trigger: 'input',
        },
        {
          validator: validatePasswordSame,
          message: 'Password is not same as re-entered password!',
          trigger: ['blur', 'password-input'],
        },
      ],
    }
    return {
      formRef,
      rPasswordFormItemRef,
      model: modelRef,
      rules,
      handlePasswordInput() {
        if (modelRef.value.reenteredPassword)
          rPasswordFormItemRef.value?.validate({ trigger: 'password-input' })
      },
      async handleValidateButtonClick(e: MouseEvent) {
        e.preventDefault()
        formRef.value?.validate(
          (errors: Array<FormValidationError> | undefined) => {
            if (!errors)
              sendLoginRequest()
          },
        )
      },
    }
  },
})
</script>

<template>
  <div style="width: 400px;margin: 0 auto;">
    <n-form ref="formRef" :model="model" :rules="rules">
      <n-form-item path="email" label="Email">
        <n-input v-model:value="model.email" @keydown.enter.prevent />
      </n-form-item>
      <n-form-item path="password" label="Password">
        <n-input v-model:value="model.password" type="password" @input="handlePasswordInput" @keydown.enter.prevent />
      </n-form-item>
      <n-row :gutter="[0, 24]">
        <n-col :span="24">
          <div style="display: flex; justify-content: flex-end">
            <n-button round type="default" class="mr-12">
              <router-link to="/user/register">
                Register
              </router-link>
            </n-button>
            <n-button round type="primary" @click="handleValidateButtonClick">
              Login
            </n-button>
          </div>
        </n-col>
      </n-row>
    </n-form>
  </div>

  <pre>{{ JSON.stringify(model, null, 2) }}
</pre>
</template>
