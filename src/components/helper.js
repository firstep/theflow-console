
const helper = {}

helper.permission = {
  init: function () {
    let permissions = JSON.parse(localStorage.getItem('permissions'))
    if (permissions) {
      this.data = new Map(permissions.map((item) => [item, true]))
    } else {
      this.data = new Map()
    }
  },
  has: function (permission) {
    return !permission || this.data.has('flow:' + permission)
  }
}

helper.session = {
  reset: (data) => {
    localStorage.setItem('username', data.name || data.id)
    localStorage.setItem('permissions', JSON.stringify(data.permissions))
    helper.init()
  },
  clear: () => {
    localStorage.clear()
  },
  init: function () {
    this.username = localStorage.getItem('username')
  }
}

// position: [top|bottom|top-right|top-left|bottom-right|bottom-left]
helper.toast = {
  success: (message, position = 'top', vm = window.vm) => {
    vm.$dialog.message.success(message, { position: position })
  },
  warning: (message, position = 'top', vm = window.vm) => {
    vm.$dialog.message.warning(message, { position: position })
  },
  error: (message, position = 'top', vm = window.vm) => {
    vm.$dialog.message.error(message, { position: position })
  },
  info: (message, position = 'top', vm = window.vm) => {
    vm.$dialog.message.info(message, { position: position })
  }
}

helper.init = () => {
  for (var item in helper) {
    if (helper[item].init && typeof (helper[item].init) === 'function') {
      try {
        helper[item].init()
      } catch (e) { console.error(e) }
    }
  }
}

helper.init()

export default helper
