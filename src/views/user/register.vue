<script lang="ts">
import { defineComponent, ref } from 'vue'
import type {
  FormInst,
  FormItemInst,
  FormItemRule,
  FormRules,
  FormValidationError,
} from 'naive-ui'
import {
  useMessage,
} from 'naive-ui'
import { doRegister, sendVerifyCode } from '@/api/user'

interface ModelType {
  email: string | null
  verify_code: string | null
  password: string | null
  reenteredPassword: string | null
}

export default defineComponent({
  setup() {
    const formRef = ref<FormInst | null>(null)
    const rPasswordFormItemRef = ref<FormItemInst | null>(null)
    const ms = useMessage()
    const modelRef = ref<ModelType>({
      email: 'wangyu0248@gmail.com',
      password: null,
      verify_code: null,
      reenteredPassword: null,
    })
    const isVeirifyCodeSent = ref<Boolean>(false)
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
    const rules: FormRules = {
      age: [
        {
          required: true,
          validator(rule: FormItemRule, value: string) {
            if (!value)
              return new Error('Age is required')
            else if (!/^\d*$/.test(value))
              return new Error('Age should be an integer')
            else if (Number(value) < 18)
              return new Error('Age should be above 18')

            return true
          },
          trigger: ['input', 'blur'],
        },
      ],
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

    function sendRegisterRequest() {
      const data = {
        email: modelRef.value.email!,
        verify_code: modelRef.value.verify_code!,
        password: modelRef.value.password!,
      }
      console.log('doRegister', data)
      doRegister(data).then(() => {
        console.log('注册成功')
      }, (err) => {
        console.log('注册失败', err)
      })
    }
    return {
      formRef,
      rPasswordFormItemRef,
      model: modelRef,
      rules,
      isVeirifyCodeSent,
      handlePasswordInput() {
        if (modelRef.value.reenteredPassword)
          rPasswordFormItemRef.value?.validate({ trigger: 'password-input' })
      },
      sendVerifyCode() {
        const params = {
          email: modelRef.value.email!,
        }
        isVeirifyCodeSent.value = true

        sendVerifyCode(params).then((res) => {
          console.log(res)
        }, (err) => {
          if (err.msg) {
            // ms.error(t('auth.verifyCodeSendFailed'))
            ms.error(err.msg)
          }
          console.log(err)
        })
      },
      async handleValidateButtonClick(e: MouseEvent) {
        e.preventDefault()
        formRef.value?.validate(
          (errors: Array<FormValidationError> | undefined) => {
            if (!errors) {
              // ms.success("Valid");
              sendRegisterRequest()
            }
            else {
              sendRegisterRequest()
              // console.log(errors);
              // ms.error("Invalid");
            }
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
      <n-form-item path="verify_code" label="Verify Code">
        <n-input v-model:value="model.verify_code" @keydown.enter.prevent />
        <div style="margin-left: 12px">
          <n-button v-if="!isVeirifyCodeSent" @click="sendVerifyCode">
            <text>
              Send Verify Code
            </text>
          </n-button>
          <n-button v-else style="width: 100px;" disabled>
            <n-countdown
              :duration="59000" :active="isVeirifyCodeSent"
              :on-finish="() => isVeirifyCodeSent = !isVeirifyCodeSent"
            />
          </n-button>
        </div>
      </n-form-item>
      <n-form-item path="password" label="Password">
        <n-input
          v-model:value="model.password" type="password" show-password-on="click" @input="handlePasswordInput"
          @keydown.enter.prevent
        />
      </n-form-item>
      <n-form-item ref="rPasswordFormItemRef" first path="reenteredPassword" label="Re-enter Password">
        <n-input
          v-model:value="model.reenteredPassword" :disabled="!model.password" type="password"
          show-password-on="click" @keydown.enter.prevent
        />
      </n-form-item>
      <n-row :gutter="[0, 24]">
        <n-col :span="24">
          <div style="display: flex; justify-content: flex-end">
            <n-button class="mr-12" round type="default" @click="handleValidateButtonClick">
              <router-link to="/user/login">
                Login
              </router-link>
            </n-button>
            <n-button round type="primary" @click="handleValidateButtonClick">
              Register
            </n-button>
          </div>
        </n-col>
      </n-row>
    </n-form>
  </div>

  <pre>{{ JSON.stringify(model, null, 2) }}
</pre>
</template>
