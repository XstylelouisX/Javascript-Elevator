//所有樓層
var floor = ["B2", "B1", "F1", "F2", "F3", "F4", "F5", "F6", "F7"];
//樓層索引
var floorNum = [-1, 0, 1, 2, 3, 4, 5, 6, 7];
//電梯狀態
var elevatorStatus = ["停留中", "已到達", "下樓中", "上樓中"];

//建構的電梯
var elevatorGroup = [];

function elevator(id, elevatorSpeed, floorIndex, enterFloor, recordFloor, isRunUp, isOpen, direction, status, enterUpFloor, enterDownFloor) {
    //電梯編號
    this.id = id;
    //電梯速度
    this.elevatorSpeed = elevatorSpeed;
    //樓層索引
    this.floorIndex = floorIndex; //1F=2
    //目前輸入樓層(判斷優先度用)
    this.enterFloor = enterFloor;
    //紀錄輸入樓層(備用)
    this.recordFloor = recordFloor;
    //電梯狀態
    this.isRunUp = isRunUp;
    //開門
    this.isOpen = isOpen;
    //電梯方向(判斷消除按鈕) Up=true,Down=false
    this.direction = direction;
    //電梯狀態
    this.status = status;
    //輸入樓層
    this.enterUpFloor = enterUpFloor;
    this.enterDownFloor = enterDownFloor;
}

//初始化載入
window.onload = function () {
    //電梯一
    var elevator_1 = new elevator(1, 500, 4, 0, 0, null, null, null, null, [], []);
    //初始更新
    initialization(elevator_1);
    //持續更新
    Updata(elevator_1);

    //電梯二
    var elevator_2 = new elevator(2, 500, 4, 0, 0, null, null, null, null, [], []);
    //初始更新
    initialization(elevator_2);
    //持續更新
    Updata(elevator_2);

    //電梯群組初始化
    elevatorGroup.push(elevator_1);
    elevatorGroup.push(elevator_2);
    initializationGroup(elevatorGroup);
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
}
//外部按鈕事件
function floorButtonOnClick(num, isUp, elevatorGroup) {
    for (var i = 0; floor.length > i; i++) {
        var floorUp = document.getElementById("Up_" + floor[i]);
        var floorDown = document.getElementById("Down_" + floor[i]);
        //初始化為空值
        if (num == floor[i] && isUp != null) {
            //輸入樓層(索引值) //判斷優先度用
            elevatorGroup[0].enterFloor = i;
            elevatorGroup[1].enterFloor = i;
            //console.log(Priority(isUp, elevatorGroup));
            //檢查電梯優先度
            if (Priority(isUp, elevatorGroup) == true) { //外部面板按鈕
                //顯示輸入紀錄用
                elevatorGroup[0].recordFloor = i;
                if (isUp) { //如果上樓
                    elevatorGroup[0].enterUpFloor.push(floorNum[i]); //紀錄輸入流程
                    floorUp.style.backgroundColor = "yellow";
                } else { //如果下樓
                    elevatorGroup[0].enterDownFloor.push(floorNum[i]); //紀錄輸入流程
                    floorDown.style.background = "yellow";
                }
            } else {
                //顯示輸入紀錄用
                elevatorGroup[1].recordFloor = i;
                if (isUp) { //如果上樓
                    elevatorGroup[1].enterUpFloor.push(floorNum[i]); //紀錄輸入流程
                    floorUp.style.backgroundColor = "yellow";
                } else { //如果下樓
                    elevatorGroup[1].enterDownFloor.push(floorNum[i]); //紀錄輸入流程
                    floorDown.style.background = "yellow";
                }
            }
        }
    }
}
//內部面板事件
function floorPanelOnClick(num, floorPanel, elevator) {
    for (var i = 0; floor.length > i; i++) {
        var floorUp = document.getElementById("Up_" + floor[i]);
        var floorDown = document.getElementById("Down_" + floor[i]);
        if (num == floor[i]) {
            //數入樓層 與 當前樓層判斷
            if (i - 1 > floorNum[elevator.floorIndex]) {
                elevator.enterUpFloor.push(floorNum[i]); //紀錄輸入流程
                floorPanel.style.background = "yellow";
            } else if (i - 1 < floorNum[elevator.floorIndex]) {
                elevator.enterDownFloor.push(floorNum[i]); //紀錄輸入流程
                floorPanel.style.background = "yellow";
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
                if (elevator.direction == true) { //先判斷方向，再確認顏色
                    if (floorUp.style.backgroundColor == "yellow") {
                        floorUp.style.background = "white";
                    } else {
                        floorDown.style.background = "white";
                        elevator.direction = false;
                    }
                } else { //先判斷方向，再確認顏色
                    if (floorDown.style.backgroundColor == "yellow") {
                        floorDown.style.background = "white";
                    } else {
                        floorUp.style.background = "white";
                        elevator.direction = true;
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
//持續更新
function Updata(elevator) {
    window.setTimeout(function () {
        //上下樓排序
        Sort(elevator);
        //運行順序
        if (elevator.enterUpFloor.length > 0 && elevator.enterDownFloor.length == 0) {
            elevator.isRunUp = true;
        } else if (elevator.enterDownFloor.length > 0 && elevator.enterUpFloor.length == 0) {
            elevator.isRunUp = false;
        } else if (elevator.enterUpFloor.length == 0 && elevator.enterDownFloor.length == 0) {
            elevator.isRunUp = null;
            elevator.isOpen = false;
        }
        // console.log("是否上樓:" + elevator.isRunUp);
        // console.log("是否上樓:" + elevator.direction); //停止時為相反布林值
        // console.log("目前樓層:" + floorNum[elevator.floorIndex]);
        // console.log("向上目標樓層:" + elevator.enterUpFloor[0]);
        // console.log("向下目標樓層:" + elevator.enterDownFloor[0]);
        // console.log("向上目標紀錄:" + elevator.enterUpFloor);
        // console.log("向下目標紀錄:" + elevator.enterDownFloor);

        var floorPanel_status = document.getElementById("FloorPanel_" + elevator.id + "_status");
        ElevatorRun(elevator, floorPanel_status);

        //持續更新
        Updata(elevator);

    }, elevator.elevatorSpeed)
}
//電梯運行
function ElevatorRun(elevator, status) {
    if (elevator.isRunUp) {
        if (elevator.enterUpFloor[0] > floorNum[elevator.floorIndex]) {
            elevator.isOpen = false;
            elevator.direction = true;
            elevator.floorIndex++;
            status.textContent = elevatorStatus[3] + (floor[elevator.enterUpFloor[0] + 1]).toString();
            elevator.status = elevatorStatus[3];
        } else if (elevator.enterUpFloor[0] < floorNum[elevator.floorIndex]) {
            elevator.isOpen = false;
            elevator.direction = false;
            elevator.floorIndex--;
            status.textContent = elevatorStatus[2] + (floor[elevator.enterUpFloor[0] + 1]).toString();
            elevator.status = elevatorStatus[2];
        } else {
            elevator.isOpen = true;
            elevator.enterUpFloor.shift();
            floorStatus(true, elevator);
            status.textContent = elevatorStatus[1];
            elevator.status = elevatorStatus[1];
        }
    } else if (elevator.isRunUp == false) {
        if (elevator.enterDownFloor[0] < floorNum[elevator.floorIndex]) {
            elevator.isOpen = false;
            elevator.direction = false;
            elevator.floorIndex--;
            status.textContent = elevatorStatus[2] + (floor[elevator.enterDownFloor[0] + 1]).toString();
            elevator.status = elevatorStatus[2];
        } else if (elevator.enterDownFloor[0] > floorNum[elevator.floorIndex]) {
            elevator.isOpen = false;
            elevator.direction = true;
            elevator.floorIndex++;
            status.textContent = elevatorStatus[3] + (floor[elevator.enterDownFloor[0] + 1]).toString();
            elevator.status = elevatorStatus[3];
        } else {
            elevator.isOpen = true;
            elevator.enterDownFloor.shift();
            floorStatus(true, elevator);
            status.textContent = elevatorStatus[1];
            elevator.status = elevatorStatus[1];
        }
    } else {
        floorStatus(false, elevator);
        status.textContent = elevatorStatus[0];
        elevator.status = elevatorStatus[0];
    }

    if (elevator.isOpen == false) {
        floorStatus(false, elevator);
    }
}
//上下樓排序
function Sort(elevator) {
    if (elevator.enterDownFloor.length > 1 && elevator.direction == true || //往上時排往下順序
        elevator.enterDownFloor[elevator.enterDownFloor.length - 1] < elevator.floorIndex - 1) { //輸入樓層 小於 目前樓層
        elevator.enterDownFloor.sort(function (a, b) { //大到小排序
            return b - a
        })
    }
    if (elevator.enterUpFloor.length > 1 && elevator.direction == false || //往下時排往上順序
        elevator.enterUpFloor[elevator.enterUpFloor.length - 1] > elevator.floorIndex - 1) { //輸入樓層 大於 目前樓層
        elevator.enterUpFloor.sort(function (a, b) { //小到大排序
            return a - b
        })
    }
}
//優先度 //true = 電梯1，false = 電梯2
function Priority(isUp, elevatorGroup) {
    var distance1 = Math.abs(elevatorGroup[0].enterFloor) - Math.abs(elevatorGroup[0].floorIndex);
    var distance2 = Math.abs(elevatorGroup[1].enterFloor) - Math.abs(elevatorGroup[1].floorIndex);
    distance1 = Math.abs(distance1);
    distance2 = Math.abs(distance2);
    // console.log(distance1);
    // console.log(distance2);
    // console.log(elevatorGroup[1].status[0]);
    if (elevatorGroup[0].status == elevatorStatus[0] && elevatorGroup[1].status == elevatorStatus[0]) {
        if (distance1 <= distance2) {
            return true;
        } else {
            return false;
        }
    } else if (isUp == true) { //電梯向上
        //console.log(elevatorGroup[0].enterFloor, elevatorGroup[0].floorIndex);
        //點選樓層大於等於電梯所在樓層
        if (elevatorGroup[0].enterFloor >= elevatorGroup[0].floorIndex) {
            //如果電梯1向上
            if (elevatorGroup[0].status == elevatorStatus[3] ||
                elevatorGroup[0].status == elevatorStatus[1] && elevatorGroup[0].enterUpFloor > 0) {
                return true;
                //點選樓層小於電梯2位置
            } else if (elevatorGroup[0].enterFloor < elevatorGroup[1].floorIndex) {
                return true;
            } else {
                return false;
            }
        } else {
            //如果電梯2向上
            if (elevatorGroup[1].status == elevatorStatus[3] ||
                elevatorGroup[1].status == elevatorStatus[1] && elevatorGroup[1].enterDownFloor > 0) {
                return false;
            } else {
                if (distance1 <= distance2) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    } else { //電梯向下
        //console.log(elevatorGroup[0].enterFloor, elevatorGroup[0].floorIndex);
        //點選樓層小於等於電梯所在樓層
        if (elevatorGroup[0].enterFloor <= elevatorGroup[0].floorIndex) {
            //如果電梯1向下
            if (elevatorGroup[0].status == elevatorStatus[2] ||
                elevatorGroup[0].status == elevatorStatus[1] && elevatorGroup[0].enterDownFloor > 0) {
                return true;
                //點選樓層大於電梯2位置
            } else if (elevatorGroup[0].enterFloor > elevatorGroup[1].floorIndex) {
                return true;
            } else {
                return false;
            }
        } else {
            //如果電梯2向下
            if (elevatorGroup[1].status == elevatorStatus[2] ||
                elevatorGroup[1].status == elevatorStatus[1] && elevatorGroup[1].enterDownFloor > 0) {
                return false;
            } else {
                if (distance1 <= distance2) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    }
}