let _data = {};

class Store {
  constructor(props) {
    if (props) {
      _data = props;
    }
  }
  getData() {
    return _data;
  }
  setData(data) {
    _data = data;
  }
  setKey(key, data) {
    _data[key] = data
  }
  getKey(key) {
    return _data[key]
  }
}
export default Store
