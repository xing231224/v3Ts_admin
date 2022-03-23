<!--
 * @Author: your name
 * @Date: 2022-02-16 14:12:32
 * @LastEditTime: 2022-02-26 15:04:46
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \v3-ts_demo\src\views\login\index.vue
-->
<template>
  <div class="login-container vben-login">
    <div class="flex layout">
      <div style="flex: 1" class="login-img flex-col-center">
        <div style="width: 70%; margin: 0 auto">
          <p class="flex" style="padding: 0 10px; position: relative; top: -120px">
            <img
              class="animate__animated animate__backInDown"
              style="border-radius: 50%; width: 60px; margin: 0 10px"
              src="../../assets/age1f-rzq97.png"
            />
            <span class="juz" style="font-size: 30px; font-weight: bold">后台系统管理</span>
          </p>
          <img class="svg" src="../../assets/Clip_Applying_to_University_online_transparent_by_Icons8.gif" />
          <div style="padding: 0 20px" class="animate__animated animate__fadeInLeft">
            <p style="font-size: 30px">开箱即用的后台管理系统</p>
            <span>请输入您的账号和密码开始登录使用！！！</span>
          </div>
        </div>
      </div>
      <div style="flex: 1" class="flex-col-center">
        <el-form
          id="login"
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          autocomplete="on"
          label-position="left"
        >
          <div id="owl-login" :class="isBlur ? 'password' : ''">
            <div class="hand"></div>
            <div class="hand hand-r"></div>
            <div class="arms">
              <div class="arm"></div>
              <div class="arm arm-r"></div>
            </div>
          </div>
          <div class="title-container">
            <h3 class="title">系统登录</h3>
          </div>

          <el-form-item prop="mobile" class="animate__animated animate__fadeInRight ms-2">
            <span class="svg-container juz svg-container_login">
              <i-ep-iphone />
            </span>

            <el-input
              ref="userNameRef"
              v-model="loginForm.mobile"
              name="username"
              placeholder="手机号"
              type="text"
              tabindex="1"
              autocomplete="on"
            />
          </el-form-item>
          <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
            <el-form-item prop="password" class="animate__animated animate__fadeInRight ms-3">
              <span class="svg-container juz">
                <i-mdi-lock-outline />
              </span>
              <el-input
                :key="passwordType"
                ref="passwordRef"
                v-model="loginForm.password"
                :type="passwordType"
                name="password"
                tabindex="2"
                autocomplete="on"
                @keyup="checkCapslock"
                @blur="
                  capsTooltip = false;
                  isBlur = false;
                "
                @focus="isBlur = true"
                @keyup.enter="handleLogin"
              />
              <a></a>
              <span class="show-pwd" @click="showPwd">
                <i-mdi-eye v-if="passwordType === 'password'" />
                <i-ph-eye-closed-bold v-else />
              </span>
            </el-form-item>
          </el-tooltip>

          <el-form-item prop="code" class="animate__animated animate__fadeInRight ms-3">
            <span class="svg-container juz">
              <i-icomoon-free-codepen />
            </span>
            <el-input v-model="loginForm.code" name="smsCode" type="text" autocomplete="on" placeholder="验证码" />
            <div style="text-align: right; margin-right: 10px; flex: 1">
              <el-button :disabled="timeFlag" size="small" @click="getMobileCode">{{ text }}</el-button>
            </div>
          </el-form-item>
          <el-button
            class="animate__animated animate__fadeInRight ms-4"
            :loading="loading"
            type="primary"
            style="width: 100%"
            @click="handleLogin"
            >验证码登录</el-button
          >
          <div style="position: relative">
            <div class="tips">
              <span></span>
              <span></span>
            </div>
            <div class="tips">
              <span></span>
              <span></span>
            </div>
          </div>
        </el-form>
      </div>
    </div>
    <div class="main">
      <div class="shadow"></div>
      <div class="boy">
        <div class="leg leg-r">
          <div class="leg-top">
            <div class="leg-bottom">
              <div class="leg-foot"></div>
            </div>
          </div>
        </div>
        <div class="c">
          <div class="ear">
            <div class="ear-r"></div>
          </div>
          <div class="arm-r"></div>
          <div class="torso"></div>
          <div class="face">
            <div class="face__eye-l"></div>
            <div class="face__eye-r"></div>
            <div class="face__nose"></div>
            <div class="face__mouth"></div>
            <div class="face__bubble"></div>
          </div>
          <div class="hair-b">
            <div class="hair-b__a hair-a--i"></div>
            <div class="hair-b__b hair-a--i"></div>
            <div class="hair-b__c hair-a--i"></div>
            <div class="hair-b__d hair-a--i"></div>
          </div>
          <div class="cap">
            <div class="cap__bottom"></div>
            <div class="cap__top"></div>
            <div class="cap__center"></div>
          </div>
          <div class="hair-a">
            <div class="hair-a__a hair-a--i"></div>
            <div class="hair-a__b hair-a--i"></div>
            <div class="hair-a__c hair-a--i"></div>
          </div>
          <div class="ear">
            <div class="ear-l"></div>
          </div>
          <div class="pants"></div>
          <div class="t-shirt"></div>
          <div class="jacket"></div>
          <div class="arm-l"></div>
        </div>
        <div class="leg leg-l">
          <div class="leg-top">
            <div class="leg-bottom">
              <div class="leg-foot"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();
const { proxy } = getCurrentInstance() as any;
const validateMobile = (rule: any, value: string, callback: Function) => {
  if (!/^1[34578]\d{9}$/.test(value)) {
    callback(new Error('手机号格式不正确'));
  } else {
    callback();
  }
};
const validatePassword = (rule: any, value: string, callback: Function) => {
  if (value.length < 6) {
    callback(new Error('The password can not be less than 6 digits'));
  } else {
    callback();
  }
};
// 获取dom
const loginFormRef = ref(null);
const passwordRef = ref(null);
const state = reactive({
  loginForm: {
    mobile: '15779333244',
    code: '',
    password: 'pwx123.456',
  },
  loginRules: {
    mobile: [{ validator: validateMobile, trigger: 'blur' }],
    password: [{ validator: validatePassword, trigger: 'blur' }],
    code: [{ required: true, trigger: 'blur' }],
  },
  passwordType: 'password',
  loading: false,
  showDialog: false,
  capsTooltip: false,
  redirect: '',
  otherQuery: {},
  timeFlag: false,
  time: 60,
  isBlur: false,
});
const text = computed(() => {
  if (state.timeFlag === false && state.time > 0) {
    return '获取验证码';
  }
  return state.time > 0 ? `${state.time}s` : '重新获取';
});
const handleLogin = () => {
  (loginFormRef.value as any).validate(async (valid: boolean) => {
    if (valid) {
      state.loading = true;
      router.push('/home');
      // mobileLogin(this.loginForm).then((res) => {
      //   if (res.data.status === 200) {
      //     getUserInfo(res.data.data).then((response) => {
      //       if (response.data.status === 200) {
      //         let info = response.data.data;
      //         info.memberId = res.data.data;
      //         localStorage.setItem("info", JSON.stringify(info));
      //         this.$message.success("登陆成功！！！");
      //         this.$router.push("/advanceOrder/creatOrder");
      //       }
      //     });
      //   } else {
      //     this.$message.error(res.data.msg);
      //   }
      // });
      // Just to simulate the time of the request
      // setTimeout(() => {
      //   state.loading = false;
      // }, 0.5 * 1000);
    } else {
      return false;
    }
  });
};
function timer() {
  if (state.time > 0) {
    state.timeFlag = true;
    // eslint-disable-next-line no-plusplus
    state.time--;
    setTimeout(timer, 1000);
  } else {
    state.timeFlag = false;
  }
}
const getMobileCode = () => {
  state.time = 60;
  if (!state.loginForm.mobile) {
    proxy.$tips('error', '请输入手机号码');
  } else if (!/^1[34578]\d{9}$/.test(state.loginForm.mobile)) {
    proxy.$tips('error', '手机号格式不正确');
  } else {
    timer();
    // getCode(this.loginForm).then((response) => {
    //   if (response.data.status === 200) {
    //     this.timer();
    //     this.$message.success("验证码发送成功");
    //   } else {
    //     this.$message.error(response.data.msg);
    //   }
    // });
  }
};
function checkCapslock(e: any) {
  const { key } = e;
  if (!key) return;
  state.capsTooltip = key !== null && key.length === 1 && key >= 'A' && key <= 'Z';
}
function showPwd() {
  if (state.passwordType === 'password') {
    state.passwordType = '';
  } else {
    state.passwordType = 'password';
  }
  nextTick(() => {
    (passwordRef.value as any).focus();
  });
}
const { loginForm, loginRules, loading, isBlur, passwordType, capsTooltip, timeFlag } = toRefs(state);
</script>

<style lang="scss" scoped>
@import '../../assets/styles/login.css';
.login-container {
  height: 100%;
  width: 100%;
  overflow: hidden;
  &::before {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    margin-left: -45%;
    background-image: url(../../assets/svg/login-bg.svg);
    background-position: 100%;
    background-repeat: no-repeat;
    background-size: auto 100%;
    content: '';
  }
  :deep(.el-input) {
    display: inline-block;
    height: 47px;
    width: 60%;
    input {
      height: 47px;
      background: transparent;
      border: 0px;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      // color: #eee;
      // caret-color: #fff;
      // -webkit-appearance: none;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px white inset !important;
        // -webkit-text-fill-color: transparent !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid #e5e7eb;
    // background: rgba(0, 0, 0, 0.1);
    background: #fff;
    border-radius: 5px;
    color: #454545;
    margin-bottom: 20px;
  }
  .layout {
    position: relative;
    width: 90%;
    height: 100vh;
    margin: auto;

    .login-img {
      width: 520px;
      max-width: 100%;
      margin: 0 auto;
      color: #fff;
      .svg {
        width: 100%;
        position: relative;
        right: 50px;
      }
    }
  }
  video {
    position: absolute;
    /* Vertical and Horizontal center*/
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: -1;
  }
  .login-form {
    width: 440px;
    max-width: 100%;
    background: #fff;
    padding: 20px 40px;
    border-radius: 40px;
    margin: auto;

    :deep(.is-disabled .el-input__inner) {
      background: transparent;
    }
    :deep(.el-form-item__content) {
      line-height: normal;
    }
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 0px 6px 10px;
    color: #889aa4;
    vertical-align: middle;
    // display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      // color: #eee;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }

    .set-language {
      position: absolute;
      top: 3px;
      font-size: 18px;
      right: 0px;
      cursor: pointer;
    }
  }

  .show-pwd {
    position: absolute;
    right: 12px;
    top: 18px;
    font-size: 12px;
    color: #889aa4;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  .flex-col-center {
    display: flex;
    flex-direction: column;
    justify-content: center;
    // &:last-child {
    //   background: url(../../assets/Clip_Applying_to_University_online_transparent_by_Icons8.gif)
    //     no-repeat;
    //   background-size: cover;
    //   background-position: center;
    // }
  }
  .ms-2 {
    --animate-duration: 400ms;
  }
  .ms-3 {
    --animate-duration: 600ms;
  }
  .ms-4 {
    --animate-duration: 800ms;
  }
}
</style>
