/**
 * Created by lailiqiang on 2016/10/20.
 */
window.indexedDB = window.indexedDB
  || window.mozIndexedDB
  || window.webkitIndexedDB
  || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction
  || window.webkitIDBTransaction
  || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange
  || window.webkitIDBKeyRange
  || window.msIDBKeyRange;
if (!window.indexedDB) console.warn("您的浏览器不支持indexDB");

var success = (msg) => {
  console.log(msg);
}
var error = (msg) => {
  console.warn(msg);
}

function openDB(db) {
  var request = window.indexedDB.open(db.name, db.version);
  request.onsuccess = ev=> {
    success("打开成功");
    myDB.db = ev.target.result;
  }

  request.onerror = ev => {
    error("打开失败" + ev.target.result);
  }

  request.onupgradeneeded = ev => {
    myDB.db = ev.target.result;
    //if (myDB.db.objectStoreNames.contains(store.name)) {
    //  myDB.db.deleteObjectStore(store.name);
    //  console.log(store.name + "数据库删除成功");
    //}
    if (!myDB.db.objectStoreNames.contains(store.name)) {
      var storeObject = myDB.db.createObjectStore(store.name, {keyPath: "id"});
      //storeObject.createIndex("indexId", "id", {unique: true});
      storeObject.createIndex("indexName", "name", {unique: true});
      storeObject.createIndex("indexAge", "age", {unique: false});
      //db.createObjectStore(store.name, {autoIncrement: true});
    }
    console.log("DB version changed to : " + myDB.version);
  }
}

function closeDB(db) {
  db.close();
}

function deleteDB(name) {
  window.indexedDB.deleteDatabase(name);
}

var myDB = {
  name: 'mainbo',
  version: 1,
  db: null
}

var store = {
  name: 'students'
}

var students = [{
  id: 1001,
  name: "张三",
  age: 22
}, {
  id: 1002,
  name: "李四",
  age: 22
}, {
  id: 1003,
  name: "王五",
  age: 25
}];

var msg, add, query, queryIndexName, queryIndexAge, update, del, clear;

/**
 * 入口函数
 */
function init() {
  msg = document.getElementById("msg"),
    add = document.getElementById("btn_add"),
    query = document.getElementById("btn_query"),
    queryIndexName = document.getElementById("btn_query_index_name"),
    queryIndexAge = document.getElementById("btn_query_index_age"),
    update = document.getElementById("btn_update"),
    del = document.getElementById("btn_del"),
    clear = document.getElementById("btn_clear");

  add.addEventListener("click", addData);
  query.addEventListener("click", getData);
  queryIndexName.addEventListener("click", getDataByIndexName);
  queryIndexAge.addEventListener("click", getDataByIndexAge)
  update.addEventListener("click", updateData);
  del.addEventListener("click", deleteData);
  clear.addEventListener("click", clearStore);

  openDB(myDB);
}
init();

function tip(tip, type) {
  var tip = type == "+" ? msg.innerHTML + "<br/>" + tip : tip;
  msg.innerHTML = tip || "";
}

function addData() {
  tip();
  var transaction = myDB.db.transaction([store.name], "readwrite");
  transaction.oncomplete = ev=> {
    success("事务完成");
  }
  transaction.onerror = ev => {
    error("事务失败");
  }
  transaction.onbort = ev => {
    error("事务被终止");
  }
  var objStore = transaction.objectStore(store.name);
  students.forEach(item=> {
    var req = objStore.get(item.id);
    req.onsuccess = ev => {
      var temp = ev.target.result;
      if (temp) tip(JSON.stringify(temp) + " 已存在，请勿重复添加", "+")
      else {
        objStore.add(item);
        tip(JSON.stringify(item) + " 添加成功，请通过调试器查看效果", "+");
      }
    }
  });
}

function getData() {
  var transaction = myDB.db.transaction([store.name], "readonly");
  var objStore = transaction.objectStore(store.name);
  var req = objStore.get(students[1].id);
  req.onsuccess = ev => {
    var item = ev.target.result;
    if (item)
      tip("数据查询成功：key=" + students[1].id + ", value=" + JSON.stringify(item));
    else
      tip("key=" + students[1].id + " 数据查询失败");
  }
}

function getDataByIndexName() {
  var transaction = myDB.db.transaction([store.name], "readonly");
  var objStore = transaction.objectStore(store.name);
  var index = objStore.index("indexName");
  index.get("张三").onsuccess = ev => {
    var item = ev.target.result;
    if (item)
      tip("数据查询成功：" + JSON.stringify(item));
    else
      tip("数据查询失败");
  }
}

function getDataByIndexAge() {
  tip();
  var transaction = myDB.db.transaction([store.name], "readonly");
  var objStore = transaction.objectStore(store.name);
  var index = objStore.index("indexAge");
  index.openCursor(IDBKeyRange.only(22)).onsuccess = ev => {
    var cursor = ev.target.result;
    if (cursor) {
      var item = cursor.value;
      if (item)
        tip("数据查询成功：" + JSON.stringify(item), "+");
      else
        tip("数据查询失败");
      cursor.continue();
    }
  }
}

function updateData() {
  var transaction = myDB.db.transaction([store.name], "readwrite");
  var objStore = transaction.objectStore(store.name);
  var req = objStore.get(students[1].id);
  req.onsuccess = ev => {
    var item = ev.target.result;
    if (item) {
      item.age++;
      objStore.put(item);
      tip("数据更新成功：key=" + students[1].id + ", value=" + JSON.stringify(item) + " 注意age的变化");
    } else
      tip("key=" + students[1].id + " 数据更新失败");

  }
}

function deleteData() {
  var transaction = myDB.db.transaction([store.name], "readwrite");
  var objStore = transaction.objectStore(store.name);
  var req = objStore.delete(students[1].id);
  req.onsuccess = ev => {
    tip("数据删除成功：key=" + students[1].id + " 请通过调试器查看效果");
  }
}

function clearStore() {
  var transaction = myDB.db.transaction([store.name], "readwrite");
  var objStore = transaction.objectStore(store.name);
  var req = objStore.clear();
  req.onsuccess = ev => {
    tip(store.name + " 数据清除成功，请通过调试器查看效果");
  }
}

//TODO ？？？
function deleteStore() {
  console.log("数据库删除开始");
  if (myDB.db.objectStoreNames.contains(store.name)) {
    myDB.db.deleteObjectStore(store.name);
    console.log(store.name + " 数据库删除成功");
  }
}