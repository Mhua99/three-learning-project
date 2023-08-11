class Mitt {
  constructor() {
    this.eventList = {}
  }
  on(key, event) {
    this.eventList[key] = event;
  }
  emit(key, ...args) {
    this.eventList[key] && this.eventList[key](...args)
  }
}

export default new Mitt;
