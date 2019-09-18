
const helper = {}

helper.permission = {
    init: function() {
        let permissions = JSON.parse(localStorage.getItem('permissions'))
        if(permissions)
            this.data = new Map(permissions.map((item) => [item, true]))
        else
            this.data = new Map()
    },
    accessable: function(resource){
        return !resource || this.data.has('flow:' + resource + ':access')
    },
    editable: function(resource) {
        return !resource || this.data.has('flow:' + resource + ':edit')
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
    init: function() {
        this.username = localStorage.getItem('username')
    }
}

helper.init = () => {
    for(var item in helper) {
        if(helper[item].init && typeof(helper[item].init) == 'function') {
            try{
                helper[item].init()
            } catch(e) {console.error(e)}
        }
    }
}

helper.init()

export default helper