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

//display using keyboard
display.addEventListener("input", () => {
    const allowed = "0123456789.".split("")
    const operator = "+-*/%()".split("")
    let val = display.value;

    val = [...val].filter(ch => allowed.includes(ch) || operator.includes(ch)).join("")

    // prevent start
    if (val.length === 1 && "+*/%)".includes(val))
        val = ""

    if (val.length >= 2) {
        const last = val.at(-1)
        const secondLast = val.at(-2)

        if (secondLast === ")" && last === "(") {
            val = val.slice(0, -1) + "*("
        }

        if (secondLast === "%" && "0123456789.".includes(last)) {
            val = val.slice(0, -1);
        } 
        else if (operator.includes(last) && operator.includes(secondLast)) {
        const validCombo =
            (last === "(" && "+-*/(".includes(secondLast)) ||
            (last === ")" && "0123456789)%".includes(secondLast)) ||   
            (secondLast === ")" && "+-*/%".includes(last)) ||
            (last === "-" &&  "(".includes(secondLast)) ||
            (last === "%" && "0123456789)".includes(secondLast)) ||
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
            const operator="+-*/".split("")

            let val=e.target.innerText

            if (val === "x") val = "*"
            if (val === "C" || val === "=" || val ==="_" || val === "()") return
            
            // prevent start
            if (display.value === "" && "+*/%)".includes(val)) return

            const last = display.value.at(-1)
            const InvalidCombo = 
                (operator.includes(val) && operator.includes(last)) ||
                (last === "%" && "123456789.%".includes(val))
            if (InvalidCombo) return

            display.value += val 
            exp=display.value
        })
    }) 
}


//calculte
function calc() {
    if (exp.trim() === "") return

    try {
        let finalExp = ""
        let currentNum = "" 

        for (let i of exp) {
            if (i === "%") {
                finalExp += `(${currentNum}/100)`
                currentNum = "";
            } 
            else {
                if ("0123456789.".includes(i)) 
                    currentNum += i
                else {
                    finalExp += currentNum + i
                    currentNum = ""
                }
            }
        }
        finalExp += currentNum

        res = eval(finalExp)
        display.value = res
        exp = display.value
    } 
    catch {
        display.value = "ERROR"
        exp = ""
    }
}


//erase
erase.addEventListener("click", () => {
    display.value = display.value.slice(0, -1)
    exp=display.value
})

//add bracket
let open = true
bracket.addEventListener("click", () => {
    const last = display.value.slice(-1)
    if (open) {  
        if (last === ")") {
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