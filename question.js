/*1. 编写一个 People 类，使其的实例具有监听事件、触发事件、解除绑定功能。（实例可能监听多个不同的事件，也可以去除监听事件）*/
class People {
    constructor(name) {
        this.name = name
        this.listenerContainer = {}
    }

    on(event, callback) {
        let listenerContainer = this.listenerContainer
        /*总线中没有该事件，添加入总线*/
        if (!(event in listenerContainer)) {
            listenerContainer[event] = []
        }
        listenerContainer[event].push(callback)
    }

    emit(event, data) {
        let callback_arr = this.listenerContainer[event]
        if (callback_arr) {
            callback_arr.forEach((callback, index) => {
                callback(data)
            })
        }
    }

    off(event, callback) {
        let callback_arr = this.listenerContainer[event]
        if (callback && callback_arr) {
            callback_arr.forEach(value => {
                callback_arr.splice(callback, 1)
            })
        }
    }

    sayHi() {
        console.log(`Hi, I am ${this.name}`)
    }
}


/* 以下为测试代码 */
const say1 = (greeting) => {
    console.log(`${greeting}, nice meeting you.`)
}

const say2 = (greeting) => {
    console.log(`${greeting}, nice meeting you, too.`)
}

const jerry = new People('Jerry')
jerry.sayHi()
// => 输出：'Hi, I am Jerry'

jerry.on('greeting', say1)
jerry.on('greeting', say2)
jerry.emit('greeting', 'Hi')
// => 输出：'Hi, nice meeting you.' 和 'Hi, nice meeting you, too'

jerry.off('greeting', say1)
jerry.emit('greeting', 'Hi')
// => 只输出：'Hi, nice meeting you, too'

/*2.实现sleep函数*/
const sleep = (duration) => {
    /*用定时器去控制*/
    return new Promise(resolve => setTimeout(resolve,duration))
}

const anyFunc = async () => {
    console.log("123") // 输出 123
    await sleep(300) // 暂停 300 毫秒
    console.log("456") // 输出 456，但是距离上面输出的 123 时间上相隔了 300 毫秒
}
anyFunc()

/*3.deepGet函数 完成 deepGet 函数，给它传入一个对象和字符串，
字符串表示对象深层属性的获取路径，可以深层次获取对象内容*/
const deepGet = (obj, prop) => {
    let keys = prop.split(".").map((i) => i.trim())
    if (!keys) return undefined
    let res = keys.reduce((prev, curr) => {
        let objKey = curr.split("[")
        if (prev && Object.keys(prev).includes(objKey[0])) {
            if (objKey.length > 1 && Array.isArray(prev[objKey[0]])) {
                let idx = objKey[1].slice(0, -1).trim()
                return prev[objKey[0]][idx]
            } else if (objKey.length > 1 && !Array.isArray(prev[objKey[0]])) {
                return undefined
            } else {
                // prop为school时 即objKey.length=1时候
                return prev[objKey[0]]
            }
        } else {
            return undefined
        }
    }, obj)
    console.log(res)
    return res
}


/** 以下为测试代码 */
deepGet({
    school: {
        student: { name: 'Tomy' },
    },
}, 'school.student.name') // => 'Tomy'

deepGet({
    school: {
        students: [
            { name: 'Tomy' },
            { name: 'Lucy' },
        ],
    }
}, 'school.students[1].name') // => 'Lucy'

// 对于不存在的属性，返回 undefined
deepGet({ user: { name: 'Tomy' } }, 'user.age') // => undefined
deepGet({ user: { name: 'Tomy' } }, 'school.user.age') // => undefined


/*4.combo函数
完成 combo 函数，它接受任意多个单参函数（只接受一个参数的函数）作为参数，并且返回一个函数，它的作用：使得类似 f(g(h(a)))
这样的函数调用可以简写为 combo(f, g, h)(a)*/
const combo = (...fn_arr) => {
    /*reverse反转数组,因为最后一个函数是最先调用的*/
    fn_arr.reverse()
    /*用数组的累加器实现是比较明智的*/
    return prop =>
        fn_arr.reduce((init, fn) => {
            return fn(init)
        }, prop)
}

/* 以下为测试代码 */
const addOne = (a) => a + 1
const multiTwo = (a) => a * 2
const divThree = (a) => a / 3
const toString = (a) => a + ''
const split = (a) => a.split('')

split(toString(addOne(multiTwo(divThree(666)))))
// => ["4", "4", "5"]
const testForCombo = combo(split, toString, addOne, multiTwo, divThree)
console.log(testForCombo(666))
// => ["4", "4", "5"]

/*5. 有两个盘子分别放有 5 个和 7 个小球，两个朋友玩游戏：每个人轮流从两个盘子中拿小球，
每人每次只能从其中一个盘子中拿，每次可以拿 1 个或者多个（不能一个都不拿），拿到最后一个小球的人算输，
问开局先手和后手是否有必胜策略？如果有，请描述必胜策略。*/
//先手的拿掉B的2个球。后面保持 A,B两个盘子的数量相同，大概的思路就是后手从A盘子拿x个球，先手就从B盘子拿x个球,
// 后手从B盘子拿y个球，先手就从A盘子拿y个球。

