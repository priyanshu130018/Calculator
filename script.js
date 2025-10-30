let num=document.querySelectorAll(".num")
let op1=document.querySelectorAll(".operand1")
let op2=document.querySelectorAll(".operand2")
let display=document.querySelector("#display")
let reset=document.querySelector("#reset")
let equal=document.querySelector("#result")
let bracket=document.querySelector("#bracket")
let erase=document.querySelector("#erase")

let exp=""
let res=""
let open = true

//display using keyboard
display.addEventListener("input", () => {
    const allowed = "0123456789."
    const operator = "+-*/%()"
    let val = display.value;

    val = [...val].filter(ch => allowed.includes(ch) || operator.includes(ch)).join("")

    // prevent start
    if (val.length === 1 && "+*/%)".includes(val))
        val = ""

    if (val.length >= 2) {
        const last = val.at(-1)
        const secondLast = val.at(-2)

        if (last === "." && hasDecimalInCurrentNumber(val.slice(0, -1))) {
            val = val.slice(0, -1)
        }

        if (secondLast === ")" && "0123456789(.".includes(last)) {
            val = val.slice(0, -1) + `*${last}`
        }

        if (secondLast === "%" && "0123456789(".includes(last)) {
            val = val.slice(0, -1) + `*${last}`
        } 
        else if (operator.includes(last) && operator.includes(secondLast)) {
        const validCombo =
            (last === "(" && "+-*/())".includes(secondLast)) || 
            (secondLast === ")" && "+-*/%()".includes(last)) ||
            (last === "-" && secondLast === "(") ||
            (secondLast === "%" && "+-*/)".includes(last))
        
            if (!validCombo )
                val = val.slice(0, -1)
        }
    }

    display.value = val;
    exp = display.value;
});


//display using click
function displayInput(a) {
    a.forEach( (i) => {
        i.addEventListener("click", (e)=> {
            const operator="+-*/"

            let val=e.target.innerText

            if (val === "x") val = "*"
            if (val === "C" || val === "=" || val ==="_" || val === "()") return
            
            // prevent start
            if (display.value === "" && "+*/%)".includes(val)) return

            const last = display.value.at(-1)
            if ((operator.includes(val) && operator.includes(last))) {
                if (!(val === "-" && last === "(")) return
            }

            if(last === "%" && "0123456789(".includes(val)) {
                display.value += "*" 
            }

            if (val === "." && hasDecimalInCurrentNumber(display.value)) return
            
            display.value += val 
            exp=display.value

            updateBracketState()
        })
    }) 
}


//calculte
function calc() {
    if (exp.trim() === "") return

    try {
        if (exp.includes("()")) {
            display.value = "ERROR"
            exp = ""
            return
        }

        let finalExp = ""
        let currentNum = "" 

        for (let i of exp) {
            if (i === "%") {
                if (currentNum !== "") {
                    finalExp += `${currentNum}/100`
                    currentNum = ""
                }
                else 
                    continue
            } 
            else {
                if ("0123456789.()".includes(i)) 
                    currentNum += i
                else {
                    finalExp += currentNum + i
                    currentNum = ""
                }
            }
        }
        finalExp += currentNum

        res = eval(finalExp)
        if (!isFinite(res)) {
            display.value = "Cannot divide by 0"
            exp = ""
            return
        }
        display.value = res
        exp = display.value
    } 
    catch {
        display.value = "ERROR"
        exp = ""
    }
}

//check decimal
function hasDecimalInCurrentNumber(str) {
    let lastNumber = ""
    for (let i = str.length - 1; i >= 0; i--) {
        if ("+-*/%()".includes(str[i])) break
        lastNumber += str[i]
    }
    
    let count = 0
    for (let c of lastNumber) {
        if (c === ".") count++
    }
    return count > 0
}

//update bracket
function updateBracketState() {
    let openCount = 0, closeCount = 0
    for (let char of display.value) {
        if (char === "(") openCount++
        else if (char === ")") closeCount++
    }
    open = (openCount === closeCount)
}



//erase
erase.addEventListener("click", () => {
    display.value = display.value.slice(0, -1)
    exp=display.value
    updateBracketState()
})

//add bracket
bracket.addEventListener("click", () => {
    const last = display.value.at(-1)
    if (open) {  
        if (")%0123456789.".includes(last)) {
            display.value += "*("
        }
        else {
            display.value += "("
        }
    } 
    else {
        display.value += ")"
    }
    open = !open
    exp=display.value
})


//reset
reset.addEventListener("click", ()=> {
    display.value=""
    res=""
    exp=""
    open=true
})

//result
equal.addEventListener("click", () => calc());

document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault()
        calc()
    }
})


displayInput(num)
displayInput(op1)
displayInput(op2)
console.log("CALUCALTOR")