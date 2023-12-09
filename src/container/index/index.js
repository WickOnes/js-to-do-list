class Todo {
  static #NAME = 'todo'

  static #saveData = () => {
    localStorage.setItem(
      this.#NAME,
      JSON.stringify({
        list: this.#list,
        count: this.#count,
      }),
    )
  }

  static #loadData = () => {
    const data = localStorage.getItem(this.#NAME)

    if (data) {
      const { list, count } = JSON.parse(data)
      this.#list = list
      this.#count = count
    }
  }

  static #list = []
  static #count = 0

  static #createTaskData = (text) => {
    this.#list.push({
      id: ++this.#count,
      text,
      done: false,
    })
  }

  static #template = null
  static #block = null
  static #input = null
  static #button = null

  static init = () => {
    this.#template =
      document.getElementById(
        'task',
      ).content.firstElementChild

    this.#block = document.querySelector('.content__tasks')
    this.#input = document.querySelector('.input__add-task')
    this.#button = document.querySelector(
      '.button__add-task',
    )
    this.#button.onclick = this.#handleAdd
    this.#loadData()

    this.#render()
  }

  static #handleAdd = () => {
    const value = this.#input.value
    if (value.length > 0) {
      this.#createTaskData(this.#input.value)
      this.#input.value = ''
    }

    this.#saveData()
    this.#render()
  }

  static #render = () => {
    this.#block.innerHTML = ''

    if (this.#list.length === 0) {
      this.#block.innerHTML = `Список задач пустий`
    } else {
      this.#list.forEach((taskData) => {
        const el = this.#createTaskEl(taskData)
        this.#block.append(el)
      })
    }
  }

  static #createTaskEl = (data) => {
    const el = this.#template.cloneNode(true)

    const [id, text, btnDo, btnCancel] = el.children

    id.innerHTML = `${data.id}.`
    text.innerHTML = data.text
    btnCancel.onclick = () => this.#handleCancel(data)
    btnDo.onclick = () => this.#handleDo(data, btnDo, el)
    if (data.done) {
        el.classList.toggle('task--done')
        btnDo.classList.toggle('task__button--do')
        btnDo.classList.toggle('task__button--done')
      }
    return el
  }

  static #handleCancel = (data) => {
    if (confirm('Видалити?')) {
      const result = this.#deleteById(data.id)
      if (result) {
        this.#saveData()
        this.#render()
      }
    }
  }

  static #deleteById = (id) => {
    this.#list = this.#list.filter((item) => item.id !== id)
    return true
  }

  static #handleDo = (data, btn, el) => {
    const result = this.#toggleDone(data.id)
    if (result === true || result === false) {
      el.classList.toggle('task--done')
      btn.classList.toggle('task__button--do')
      btn.classList.toggle('task__button--done')
    }

    this.#saveData()
  }

  static #toggleDone = (id) => {
    const task = this.#list.find((item) => item.id === id)

    if (task) {
      task.done = !task.done
      return task.done
    } else {
      return null
    }
  }
}

Todo.init()

window.todo = Todo
