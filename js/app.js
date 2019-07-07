(function (window) {
  const vm = new Vue({
    el: '.todoapp',
    data: {
      list: [],
      todoName: '',
      now: -1
    },
    created() {
      this.getTodoList()
    },
    methods: {
      getTodoList() {
        axios({
          method: 'get',
          url: 'http://localhost:3000/todos?_sort=id&_order=desc'
        }).then(res => {
          this.list = res.data
        })
      },
      changeState(id, flag) {
        axios({
          method: 'patch',
          url: `http://localhost:3000/todos/${id}`,
          data: {
            flag
          }
        }).then(res => {
          this.getTodoList()
        })
      },
      add() {
        axios({
          method: 'post',
          url: 'http://localhost:3000/todos',
          data: {
            name : this.todoName,
            flag: false
          }
        }).then(res => {
          this.getTodoList()
          this.todoName = ''
        })
      },
      del(id) {
        axios({
          method: 'delete',
          url: `http://localhost:3000/todos/${id}`
        }).then(res => {
          this.getTodoList()
        })
      },
      clearCompleted() {
        this.list.filter(item => item.flag).forEach(item => {
          this.del(item.id)
        })
      },
      update(id) {
        this.now = id
      },
      change(id, value) {
        axios({
          method: 'patch',
          url: `http://localhost:3000/todos/${id}`,
          data: {
            name: value
          }
        }).then(res => {
          this.now = -2
          this.getTodoList()
        })
      }

    },
    computed: {
      num() {
        return this.list.filter(item => !item.flag).length
      },
      showFooter() {
        return this.list.length
      },
      showClear() {
        return this.list.some(item => item.flag === true)
      },
      allCheck: {
        //下面->上面
        get() { 
          return this.list.every(item => item.flag === true)
        },
        set(value) {
          this.list.forEach(item => this.changeState(item.id, value) )
        }
      }


    }
  })

  window.vm = vm

})(window);
