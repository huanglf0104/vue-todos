(function (window) {
	'use strict';

	// Your starting point. Enjoy the ride!

  // 用于事件筛选
  let filters = {
    all(todos) {
      return todos
    },
    active(todos) {
      return todos.filter(f => !f.completed)
    },
    completed(todos) {
      return todos.filter(f => f.completed)
    }
  }

  // 数据持久化
  const TODOS_VUE = 'todos_vue'
  let todoLocalStorage = {
    // 获取 local Storage 数据
    get () {
      return JSON.parse(localStorage.getItem(TODOS_VUE)) || []
    },
    // 设置 local Storage 数据
    set (todos) {
      localStorage.setItem(TODOS_VUE, JSON.stringify(todos))
    }
  }

  // 创建 vue 实例
  new Vue({
    el: "#app",
    // 存储初始值
    data: {
      // todo 列表
      // todos: [
      //   {id:1, title: "示例内容1", completed: true},
      //   {id:2, title: "示例内容2", completed: false}
      // ],
      todos: todoLocalStorage.get(),
      // 新增todo
      newtodo: '',
      // 编辑todo
      editingTodo: null,
      // 编辑之前的todo值
      editBeforTitle: null,
      // 筛选类型
      todoType: 'all'
    },
    // 计算属性
    computed: {
      // 计算未完成的状态
      remaining() {
        // return this.todos.filter(f => !f.completed)
        return filters.active(this.todos)
      },
      // 全选
      checkall: {
        // 获取全选状态
        get () {
        return this.remaining.length === 0
        },
        // 根据todos列表设置是否全选
        set(value) {
          // console.log(value)
          return this.todos.map(val => {
            val.completed = value
          })
        }
      },
      // 获取筛选后的todos
      filtersTodos() {
        return filters[this.todoType](this.todos)
      }
    },
    // 监听器
    watch: {
      // 监听todos
      todos: {
        // todos是数组，需要监听深层的数据
        deep: true,
        // 监听函数
        handler: todoLocalStorage.set
      }
    },
    methods: {
      // 判断未完成的有1个还是多个，展示不同的单位
      unitDisplay (params) {
        return `${params}${this.remaining.length === 1 ? '' : 's'}`
      },
      // 新增事件
      addTodo() {
        const value = this.newtodo.trim()
        if(!value) {
          return alert('新增待办为空，不能新增！')
        }
        this.todos.push({ id: this.todos.length + 1, title: value, completed: false })
        this.newtodo = ''
      },
      // 删除待办
      deleteTodo(index) {
        this.todos.splice(index, 1)
      },
      // 清除已完成待办
      clearCompletedTodo() {
        // this.todos = this.todos.filter(f => !f.completed)
        this.todos = filters.active(this.todos)
      },
      // 编辑todo
      editTodo(todo, index) {
        this.editingTodo = todo
        this.editBeforTitle = todo.title
      },
      // 取消编辑todo
      cancelEdit(todo) {
        this.editingTodo = null
        todo.title = this.editBeforTitle
      },
      // 保存todo
      saveTodo(todo,index) {
        // title是控制时，通过回车出发，同时会触发失去焦点事件，会执行两次删除事件，先判断头都是否存在，如果不存在则不执行下面代码
        if (!this.editingTodo) return;
        this.editingTodo = null
        todo.title = todo.title.trim()
        if (!todo.title) {
          this.deleteTodo(index)
        }
      }
    }
  })

})(window);
