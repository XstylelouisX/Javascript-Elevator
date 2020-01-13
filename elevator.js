//所有樓層
var floor = ["B2", "B1", "F1", "F2", "F3", "F4", "F5", "F6", "F7"];
//電梯狀態
var elevatorStatus = ["停留中", "已到達", "下樓中", "上樓中"];

//建構的電梯
var elevatorGroup = [];
//輸入紀錄(樓層)
var recordUpEnter = [];
var recordDownEnter = [];

function elevator(id, elevatorSpeed, floorIndex, enterFloor, recordFloor, isRunUp, status,
    maxValue, minValue, recordEnter) {
    //電梯編號
    this.id = id;
    //電梯速度
    this.elevatorSpeed = elevatorSpeed;
    //樓層索引
    this.floorIndex = floorIndex;
    //目前輸入樓層(判斷優先度用)
    this.enterFloor = enterFloor;
    //紀錄輸入樓層(備用)
    this.recordFloor = recordFloor;
    //電梯狀態
    this.isRunUp = isRunUp;
    //電梯狀態
    this.status = status;
    //最大值
    this.maxValue = maxValue;
    //最小值
    this.minValue = minValue;
    //輸入樓層
    this.recordEnter = recordEnter;
}

//初始化載入
window.onload = function () {
    //電梯一
    var elevator_1 = new elevator(1, 500, 4, 0, 0, null, null, null, null, []);
    //初始更新
    initialization(elevator_1);

    //電梯二
    var elevator_2 = new elevator(2, 500, 4, 0, 0, null, null, null, null, []);
    //初始更新
    initialization(elevator_2);

    //電梯群組初始化
    elevatorGroup.push(elevator_1);
    elevatorGroup.push(elevator_2);
    initializationGroup(elevatorGroup);
}
//初始化設定
function initialization(elevator) {
    //樓層初始化(樓層初始值)
    floorStatus(false, elevator);
    //按鈕監聽事件
    for (var i = 0; floor.length > i; i++) {
        //內部按鈕
        document.getElementById("FloorPanel_" + elevator.id + "_" + floor[i]).addEventListener("click", (function (num) {
            return function () {
                floorPanelOnClick(num, this, elevator);
            };
        })(floor[i])); //num值
    }
    Updata(elevator);
}
//初始化設定
function initializationGroup(elevatorGroup) {
    //按鈕監聽事件
    for (var i = 0; floor.length > i; i++) {
        //外部上樓按鈕
        document.getElementById("Up_" + floor[i]).addEventListener("click", (function (num) {
            return function () {
                floorButtonOnClick(num, true, elevatorGroup);
            };
        })(floor[i])); //num值
        //外部下樓按鈕
        document.getElementById("Down_" + floor[i]).addEventListener("click", (function (num) {
            return function () {
                floorButtonOnClick(num, false, elevatorGroup);
            };
        })(floor[i])); //num值
    }
}
//內部面板事件
function floorPanelOnClick(num, floorPanel, elevator) {
    for (var i = 0; floor.length > i; i++) {
        if (num == floor[i]) {
            //數入樓層 與 當前樓層判斷
            elevator.enterFloor = i;
            if (floorPanel.style.background != "yellow") {
                elevator.recordEnter.push(i);
                floorPanel.style.background = "yellow";
                if (elevator.isRunUp == null) {
                    if (elevator.enterFloor > elevator.floorIndex) {
                        elevator.isRunUp = true;
                    } else if (elevator.enterFloor < elevator.floorIndex) {
                        elevator.isRunUp = false;
                    } else {
                        elevator.isRunUp = null;
                    }
                }
            }
        }
    }
}
//外部按鈕事件
function floorButtonOnClick(num, isUp, elevatorGroup) {
    for (var i = 0; floor.length > i; i++) {
        var floorUp = document.getElementById("Up_" + floor[i]);
        var floorDown = document.getElementById("Down_" + floor[i]);
        //初始化為空值
        if (num == floor[i] && isUp != null) {
            //輸入樓層(索引值) //判斷優先度用
            for (var n = 0; elevatorGroup.length > n; n++) {
                elevatorGroup[n].enterFloor = i;
            }
            if (isUp && floorUp.style.backgroundColor != "yellow") { //如果上樓
                recordUpEnter.push(i);
                Priority(elevatorGroup);
                floorUp.style.backgroundColor = "yellow";
            } else if (isUp == false && floorDown.style.background != "yellow") { //如果下樓
                recordDownEnter.push(i);
                Priority(elevatorGroup);
                floorDown.style.background = "yellow";
            }
        }
    }
}
//樓層事件
function floorStatus(isArrive, elevator) {
    for (var i = 0; floor.length > i; i++) {
        var floorUp = document.getElementById("Up_" + floor[i]);
        var floorDown = document.getElementById("Down_" + floor[i]);
        var floorPanel = document.getElementById("FloorPanel_" + elevator.id + "_" + floor[i]);
        var elevatorBg = document.getElementById(floor[i] + "_" + elevator.id);
        if (i == elevator.floorIndex) { //目前樓層
            if (isArrive == true) { //到達樓層
                if (elevator.isRunUp == true) { //先判斷方向，再確認顏色
                    if (floorUp.style.backgroundColor == "yellow") {
                        floorUp.style.background = "white";
                    } else {
                        floorDown.style.background = "white";
                    }
                } else { //先判斷方向，再確認顏色
                    if (floorDown.style.backgroundColor == "yellow") {
                        floorDown.style.background = "white";
                    } else {
                        floorUp.style.background = "white";
                    }
                }
                elevatorBg.style.backgroundColor = "lightgreen";
                floorPanel.style.backgroundColor = "white";
            }
            else { //未到達樓層
                elevatorBg.style.backgroundColor = "yellow";
            }
        } else { //非目前樓層
            elevatorBg.style.backgroundColor = "white";
        }
    }
}
//檢查樓層(當前樓層是否有值)
function CheckFloor(elevator, recordEnter) {
    var recordNum = recordEnter.indexOf(elevator.floorIndex);
    if (recordNum != -1) {
        return recordNum;
    } else {
        return null;
    }
}
//檢查外部按鈕(當前樓層是否有按按鈕)
function CheckButton(elevator) {
    for (var i = 0; floor.length > i; i++) {
        var floorUp = document.getElementById("Up_" + floor[i]);
        var floorDown = document.getElementById("Down_" + floor[i]);
        if (i == elevator.floorIndex) { //目前樓層
            if (elevator.isRunUp == true) {
                if (floorUp.style.backgroundColor == "yellow") {
                    return true;
                } else {
                    return false;
                }
            } else if (elevator.isRunUp == false) {
                if (floorDown.style.backgroundColor == "yellow") {
                    return true;
                } else {
                    return false;
                }
            } else {
                if (floorUp.style.backgroundColor == "yellow") {
                    return 1;
                } else if (floorDown.style.backgroundColor == "yellow") {
                    return 2;
                }
            }
        }
    }
}
//檢查內部面板(當前樓層是否有按按鈕)
function CheckPanel(elevator) {
    for (var i = 0; floor.length > i; i++) {
        var floorPanel = document.getElementById("FloorPanel_" + elevator.id + "_" + floor[i]);
        if (i == elevator.floorIndex) { //目前樓層
            if (floorPanel.style.backgroundColor == "yellow") {
                return true;
            } else {
                return false;
            }
        }
    }
}
//回傳輸入最大值
function CheckMaxValue(elevator, recordEnter) {
    var sortArray = recordEnter;
    //大到小排序
    sortArray.sort(function (a, b) {
        return b - a
    })
    //輸入最高樓層
    elevator.maxValue = sortArray[0];
    return elevator.maxValue;
}
//回傳輸入最小值
function CheckMinValue(elevator, recordEnter) {
    var sortArray = recordEnter;
    //小到大排序
    sortArray.sort(function (a, b) {
        return a - b
    })
    //輸入最低樓層
    elevator.minValue = sortArray[0];
    return elevator.minValue;
}
//持續更新(檢查電梯運行狀況)
function Updata(elevator) {
    window.setTimeout(function () {

        // console.log(recordUpEnter);
        // console.log(recordDownEnter);
        // console.log(elevator.recordEnter);
        // console.log(elevator.isRunUp);
        //電梯運行
        ElevatorRun(elevator);
        //持續更新
        Updata(elevator);
    }, 500)
}
//電梯運行
function ElevatorRun(elevator) {
    var floorPanelStatus = document.getElementById("FloorPanel_" + elevator.id + "_status");
    //內部按鈕最大值
    var floorMaxValue = CheckMaxValue(elevator, elevator.recordEnter);
    //內部按鈕最小值
    var floorMinValue = CheckMinValue(elevator, elevator.recordEnter);

    //外部上樓按鈕最大值
    var floorUpGroupMaxValue = CheckMaxValue(elevator, recordUpEnter);
    //外部上樓按鈕最小值
    var floorUpGroupMinValue = CheckMinValue(elevator, recordUpEnter);

    //外部下樓按鈕最大值
    var floorDownGroupMaxValue = CheckMaxValue(elevator, recordDownEnter);
    //外部下樓按鈕最小值
    var floorDownGroupMinValue = CheckMinValue(elevator, recordDownEnter);

    //如果有人按上樓
    if (elevator.isRunUp == true) {
        //先判斷該樓層是否有按按鈕
        if (CheckButton(elevator) == true || CheckPanel(elevator) == true) {
            //消除外部按鈕
            if (CheckButton(elevator) == true) {
                var floorValue = CheckFloor(elevator, recordUpEnter);
                recordUpEnter.splice(floorValue, 1);
            } else if (CheckFloor(elevator, recordDownEnter) != null) {
                var floorValue = CheckFloor(elevator, recordDownEnter);
                recordDownEnter.splice(floorValue, 1);
                //刪除後再重新抓值
                floorDownGroupMaxValue = CheckMaxValue(elevator, recordDownEnter);
            }
            //消除內部按鈕
            if (CheckPanel(elevator) == true) {
                var floorValue = CheckFloor(elevator, elevator.recordEnter);
                elevator.recordEnter.splice(floorValue, 1);
            }
            //狀態
            elevator.status = elevatorStatus[1];
            floorPanelStatus.textContent = elevatorStatus[1];
            floorStatus(true, elevator);
            //判斷是否有更高樓的按鈕，如果有就繼續往上
            if (floorMaxValue > elevator.floorIndex || floorUpGroupMaxValue > elevator.floorIndex) {
                elevator.isRunUp = true;
                //如果沒有就判斷往下任務
            } else if (recordDownEnter.length > 0) {
                if (floorDownGroupMaxValue > elevator.floorIndex) {
                    elevator.isRunUp = true;
                } else if (floorDownGroupMaxValue < elevator.floorIndex) {
                    elevator.isRunUp = false;
                } else {
                    elevator.isRunUp = null;
                }
                //內部按鈕到達頂端 或 外部按鈕到達頂端
            } else {
                if (elevator.recordEnter.length > 0) {
                    elevator.isRunUp = false;
                } else {
                    elevator.isRunUp = null;
                }
            }
            //再判斷該樓層是否有按反向按鈕 同時 反向按鈕的最大值
        } else if (CheckButton(elevator) == false && elevator.floorIndex == floorDownGroupMaxValue) {
            var floorDownGroupValue = CheckFloor(elevator, recordDownEnter);
            //判斷是否有更高樓的按鈕，如果有就繼續往上
            if (floorMaxValue > floorDownGroupMaxValue || floorUpGroupMaxValue > floorDownGroupMaxValue) {
                floorRunStatus(elevator, floorPanelStatus);
                //如果沒有就往下
            } else if (recordDownEnter.length > 0) {
                elevator.isRunUp = false;
                recordDownEnter.splice(floorDownGroupValue, 1);
                elevator.status = elevatorStatus[1];
                floorPanelStatus.textContent = elevatorStatus[1];
                floorStatus(true, elevator);
                //如果沒有就停留
            } else {
                elevator.isRunUp = null;
                recordDownEnter.splice(floorDownGroupValue, 1);
                elevator.status = elevatorStatus[1];
                floorPanelStatus.textContent = elevatorStatus[1];
                floorStatus(true, elevator);
            }
            //如果該樓層沒按鈕，判斷方向
        } else {
            if (recordUpEnter.length == 0 && recordDownEnter.length == 0 &&
                elevator.recordEnter.length == 0) {
                elevator.isRunUp = null;
            } else {
                //按鈕大於目前樓層
                if (floorMaxValue > elevator.floorIndex || floorUpGroupMaxValue > elevator.floorIndex ||
                    floorDownGroupMaxValue > elevator.floorIndex) {
                    elevator.isRunUp = true;
                    //按鈕小於目前樓層
                } else if (floorMinValue < elevator.floorIndex || floorUpGroupMinValue < elevator.floorIndex ||
                    floorDownGroupMinValue < elevator.floorIndex) {
                    elevator.isRunUp = false;
                } else {
                    elevator.isRunUp = null;
                }
            }
            floorRunStatus(elevator, floorPanelStatus);
        }
        //如果有人按下樓
    } else if (elevator.isRunUp == false) {
        if (CheckButton(elevator) == true || CheckPanel(elevator) == true) {
            //消除外部按鈕
            if (CheckButton(elevator) == true) {
                var floorValue = CheckFloor(elevator, recordDownEnter);
                recordDownEnter.splice(floorValue, 1);
            } else if (CheckFloor(elevator, recordUpEnter) != null) {
                var floorValue = CheckFloor(elevator, recordUpEnter);
                recordUpEnter.splice(floorValue, 1);
                //刪除後再重新抓值
                floorUpGroupMinValue = CheckMaxValue(elevator, recordUpEnter);
            }
            //消除內部按鈕
            if (CheckPanel(elevator) == true) {
                var floorValue = CheckFloor(elevator, elevator.recordEnter);
                elevator.recordEnter.splice(floorValue, 1);
            }
            //狀態
            elevator.status = elevatorStatus[1];
            floorPanelStatus.textContent = elevatorStatus[1];
            floorStatus(true, elevator);
            //判斷是否有更低樓的按鈕，如果有就繼續往下
            if (floorMinValue < elevator.floorIndex || floorDownGroupMinValue < elevator.floorIndex) {
                elevator.isRunUp = false;
                //如果沒有就判斷往上任務
            } else if (recordUpEnter.length > 0) {
                if (floorUpGroupMinValue < elevator.floorIndex) {
                    elevator.isRunUp = false;
                } else if (floorUpGroupMinValue > elevator.floorIndex) {
                    elevator.isRunUp = true;
                } else {
                    elevator.isRunUp = null;
                }
                //內部按鈕到達頂端 或 外部按鈕到達頂端
            } else {
                if (elevator.recordEnter.length > 0) {
                    elevator.isRunUp = true;
                } else {
                    elevator.isRunUp = null;
                }
            }
            //再判斷該樓層是否有按反向按鈕 同時 反向按鈕的最小值
        } else if (CheckButton(elevator) == false && elevator.floorIndex == floorUpGroupMinValue) {
            var floorUpGroupValue = CheckFloor(elevator, recordUpEnter);
            //判斷是否有更低樓的按鈕，如果有就繼續往下
            if (floorMinValue < floorUpGroupMinValue || floorDownGroupMinValue < floorUpGroupMinValue) {
                floorRunStatus(elevator, floorPanelStatus);
                //如果沒有就往上
            } else if (recordUpEnter.length > 0) {
                elevator.isRunUp = true;
                recordUpEnter.splice(floorUpGroupValue, 1);
                elevator.status = elevatorStatus[1];
                floorPanelStatus.textContent = elevatorStatus[1];
                floorStatus(true, elevator);
                //如果沒有就停留
            } else {
                elevator.isRunUp = null;
                recordUpEnter.splice(floorUpGroupValue, 1);
                elevator.status = elevatorStatus[1];
                floorPanelStatus.textContent = elevatorStatus[1];
                floorStatus(true, elevator);
            }
            //如果該樓層沒按鈕，判斷方向
        } else {
            if (recordUpEnter.length == 0 && recordDownEnter.length == 0 &&
                elevator.recordEnter.length == 0) {
                elevator.isRunUp = null;
            } else {
                //按鈕小於目前樓層
                if (floorMinValue < elevator.floorIndex || floorDownGroupMinValue < elevator.floorIndex ||
                    floorUpGroupMinValue < elevator.floorIndex) {
                    elevator.isRunUp = false;
                    //按鈕大於目前樓層
                } else if (floorMaxValue > elevator.floorIndex || floorDownGroupMaxValue > elevator.floorIndex ||
                    floorUpGroupMaxValue > elevator.floorIndex) {
                    elevator.isRunUp = true;
                } else {
                    elevator.isRunUp = null;
                }
            }
            floorRunStatus(elevator, floorPanelStatus);
        }
        //停留中
    } else {
        //如果有按按鈕
        if (CheckButton(elevator) > 0 || CheckPanel(elevator) == true) {
            //消除外部按鈕(1 = 往上按鈕，2 = 往下按鈕)，此情況是同層有上下按鈕時的判斷
            if (CheckButton(elevator) == 1) {
                var floorUpGroupValue = CheckFloor(elevator, recordUpEnter);
                recordUpEnter.splice(floorUpGroupValue, 1);
                if (recordUpEnter.length > 0) {
                    elevator.isRunUp = true;
                }
            } else {
                var floorDownGroupValue = CheckFloor(elevator, recordDownEnter);
                recordDownEnter.splice(floorDownGroupValue, 1);
                if (recordDownEnter.length > 0) {
                    elevator.isRunUp = false;
                }
            }
            //消除內部按鈕
            if (CheckPanel(elevator) == true) {
                var floorValue = CheckFloor(elevator, elevator.recordEnter);
                elevator.recordEnter.splice(floorValue, 1);
            }
            //狀態
            elevator.status = elevatorStatus[1];
            floorPanelStatus.textContent = elevatorStatus[1];
            floorStatus(true, elevator);
        } else {
            elevator.status = elevatorStatus[0];
            floorPanelStatus.textContent = elevatorStatus[0];
            floorStatus(false, elevator);
        }
    }
}
//電梯物件和面板狀態
function floorRunStatus(elevator, floorPanelStatus) {
    if (elevator.isRunUp == true) {
        if (elevator.floorIndex < floor.length - 1) {
            elevator.floorIndex++;
            elevator.status = elevatorStatus[3];
            floorPanelStatus.textContent = elevatorStatus[3];
            floorStatus(false, elevator);
        }
    } else if (elevator.isRunUp == false) {
        if (elevator.floorIndex > 0) {
            elevator.floorIndex--;
            elevator.status = elevatorStatus[2];
            floorPanelStatus.textContent = elevatorStatus[2];
            floorStatus(false, elevator);
        }
    } else {
        elevator.status = elevatorStatus[0];
        floorPanelStatus.textContent = elevatorStatus[0];
        floorStatus(false, elevator);
    }
}
//優先度
function Priority(elevatorGroup) {
    //紀錄所有電梯距離
    var distance = [];
    //紀錄最短距離
    var minDistance = 999;
    //檢查所有電梯的目前樓層和點選樓層的距離
    for (var i = 0; elevatorGroup.length > i; i++) {
        distance[i] = Math.abs(Math.abs(elevatorGroup[i].enterFloor) - Math.abs(elevatorGroup[i].floorIndex));
        //如果大於最短距離
        if (minDistance > distance[i]) {
            minDistance = distance[i];
        }
    }
    for (var n = 0; elevatorGroup.length > n; n++) {
        //最短距離的電梯
        if (distance.indexOf(minDistance) == n) {
            //如果沒有在運作
            if (elevatorGroup[n].isRunUp == null) {
                if (elevatorGroup[n].enterFloor > elevatorGroup[n].floorIndex) {
                    elevatorGroup[n].isRunUp = true;
                } else if (elevatorGroup[n].enterFloor < elevatorGroup[n].floorIndex) {
                    elevatorGroup[n].isRunUp = false;
                } else {
                    elevatorGroup[n].isRunUp = null;
                }
            }
            //console.log("電梯編號：" + elevatorGroup[n].id + "，運行方向：" + elevatorGroup[n].isRunUp);
        }
    }
}