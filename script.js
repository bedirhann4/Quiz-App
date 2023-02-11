function Question(text, options, answer){
    this.text = text;
    this.options = options;
    this.answer = answer;
};

Question.prototype.checkAnswer = function(correctanswer){
    return correctanswer == this.answer;
};

function UI(){
    this.btn_start = document.querySelector(".btn_start");
    this.quiz_box = document.querySelector(".quiz-box");
    this.option_list = document.querySelector(".option-list");
    this.nextquestion = document.querySelector(".nextquestion");
    this.timer = document.querySelector(".timer");
    this.time_liner = document.querySelector(".time-liner");
    this.time_text = document.querySelector(".time-text");
}

UI.prototype.displayQuestion = function(soru){
    let question = `<span>${soru.text}</span>`;
    let option = ``;
    
    for(let cevap in soru.options){
        option += `
        <div class="option">
        <span><b>${cevap}</b>) ${soru.options[cevap]}</span>
        </div>
        `;
    };

    document.querySelector(".question-text").innerHTML = question;
    this.option_list.innerHTML = option;

    const options = this.option_list.querySelectorAll(".option");
    
    for(let opt of options){
        opt.setAttribute("onClick", "selectedOption(this)");
    };
};
UI.prototype.displayPage = function(currentPage, totalPage){
    let page = `<span class="badge bg-warning">${currentPage}/${totalPage}</span>`;
    document.querySelector(".question-index").innerHTML = page;
}
UI.prototype.displayCorrectAnswer = function(c_answer){
    let correctanswer = `<span class="badge bg-success">${c_answer}</span>`;
    document.querySelector(".correct").innerHTML = correctanswer;
}
UI.prototype.displayWrongAnswer = function(w_answer){
    let wronganswer = `<span class="badge bg-danger">${w_answer}</span>`
    document.querySelector(".wrong").innerHTML = wronganswer;
}
const ui = new UI();

let sorular = [
    new Question("1-Hangisi javascript paket yönetim uygulamasıdır.", {a: "Node.js", b: "Typescript", c: "npm", d: "Nuget"}, "c"),
    new Question("2-Hangisi front-end kapsamında değerlendirilmez.", {a: "Css", b: "Html", c: "Javascript", d: "PHP"}, "d"),
    new Question("3-Hangisi back-end kapsamında değerlendirilir.", {a: "Node.js", b: "Typescript", c: "Angular"}, "a"),
    new Question("4-Hangisi javascript programlama dilini kullanmaz", {a: "Vue.js", b: "React", c: "Angular", d: "PHP"}, "d"),
    new Question("5-Hangisi PHP'nin kullandığı veritabanı türüdür", {a: "SQL", b: "MySQL", c: "MsSQL", d: "Orecle"}, "b"),
];

function Quiz(sorular){
    this.sorular = sorular;
    this.soruIndex = 0;
    this.correctAnswerCount = 0;
    this.wrongAnswerCount = 0;
    this.timer = 5;
};

Quiz.prototype.getQuestion = function(){
    return this.sorular[this.soruIndex];
};

const quiz = new Quiz(sorular);

ui.btn_start.addEventListener("click", function(){
    ui.quiz_box.classList.add("active");
    ui.displayQuestion(quiz.getQuestion());
    ui.displayPage(quiz.soruIndex+1, quiz.sorular.length);
    ui.displayCorrectAnswer(quiz.correctAnswerCount);
    ui.displayWrongAnswer(quiz.wrongAnswerCount);
    timer(quiz.timer);
    timer_line();
    ui.btn_start.classList.remove("active");
    ui.nextquestion.classList.remove("show");
});
ui.nextquestion.addEventListener("click", function(){
    clearInterval(counter);
    timer(quiz.timer);
    timer_line();
    document.querySelector(".time-text").textContent = "Kalan Süre";
    let sınavSonuc = quiz.correctAnswerCount * 20;
    let sonucDegerlendirme;
    if(sınavSonuc > 1 && sınavSonuc < 25){
        sonucDegerlendirme = "Çok Kötü ,Kaldınız";
    }else if(sınavSonuc >= 26 && sınavSonuc < 50){
        sonucDegerlendirme = "Kötü, Kaldınız"
    }else if(sınavSonuc >= 51 && sınavSonuc < 75){
        sonucDegerlendirme = "İyi, Geçtiniz";
    }else if(sınavSonuc >= 76 && sınavSonuc <= 100){
        sonucDegerlendirme = "Süper, Geçtiniz";
    }
    if (quiz.sorular.length != quiz.soruIndex+1) { //mevcut soru son soru mu?
        quiz.soruIndex += 1;
        ui.displayQuestion(quiz.getQuestion());
        ui.displayPage(quiz.soruIndex+1, quiz.sorular.length);
        ui.displayCorrectAnswer(quiz.correctAnswerCount);
        ui.displayWrongAnswer(quiz.wrongAnswerCount);
        ui.quiz_box.classList.add("active");
        ui.nextquestion.classList.remove("show");
    }else{
        document.querySelector(".question-text").innerHTML = "Tebrikler Sınav Sona Erdi";
        document.querySelector(".option-list").innerHTML = `
            <div class="option">
                <span><b>Tüm soruları bitirdiniz, İşte Sonuçlar;</b></span>
            </div>
            <div>
                Doğru Cevap Sayısı; <b>${quiz.correctAnswerCount}</b>
            </div>
            <div>
                Yanlış Cevap Sayısı; <b>${quiz.wrongAnswerCount}</b>
            </div>
            <div>
                Aldığınız Puan; <b>${sınavSonuc}</b>
            </div>
            <div>
                Geçme Durumu; <b>${sonucDegerlendirme}</b>
            </div>
        `;
        document.querySelector(".option").classList.add("bitti");
        clearInterval(counter);
        clearInterval(counter_line)
        ui.nextquestion.classList.remove("show");
        ui.time_liner.style.display = "none";
        ui.time_text.textContent = "Sınav Bitti";
        for (let i = 0; i < ui.option_list.children.length; i++) {
            ui.option_list.children[i].classList.add("disabled");
        }
    };
});

function selectedOption(option){
    let cevap = option.querySelector("span b").textContent;
    let soru = quiz.getQuestion();
    ui.nextquestion.classList.add("show");
    clearInterval(counter);
    clearInterval(counter_line);

    if(soru.checkAnswer(cevap)){
        quiz.correctAnswerCount++;
        ui.displayCorrectAnswer(quiz.correctAnswerCount);
        option.classList.add("correct");
        option.insertAdjacentHTML("beforeend", '<div class="icon"><i class="fas fa-check"></i></div>');
    }else{
        quiz.wrongAnswerCount++;
        ui.displayWrongAnswer(quiz.wrongAnswerCount);
        option.classList.add("wrong");
        option.insertAdjacentHTML("beforeend", '<div class="icon"><i class="fas fa-times"></i></div>');
    }

    for (let i = 0; i < ui.option_list.children.length; i++) {
        ui.option_list.children[i].classList.add("disabled");
    }
};
let counter;
function timer(timer){
    let options = ui.option_list.children;
    counter = setInterval(function(){
        ui.timer.textContent = timer;
        timer--;
        if(timer < 0){
            clearInterval(counter);
            ui.time_text.textContent = "Süre Bitti"
            ui.nextquestion.classList.add("show");
            let cevap = quiz.getQuestion().answer;
            for (let option of ui.option_list.children) {
                if(option.querySelector("span b").textContent == cevap){
                    option.classList.add("correct");
                    option.classList.add("disabled");
                    option.insertAdjacentHTML("beforeend", '<div class="icon"><i class="fas fa-check"></i></div>');
                }else{
                    option.classList.add("wrong");
                    option.classList.add("disabled");
                    option.insertAdjacentHTML("beforeend", '<div class="icon"><i class="fas fa-times"></i></div>');
                }
            }
        };
    }, 1000);
}
let counter_line;
function timer_line(){
    let line_width = 0;
    counter_line = setInterval(function() {
        line_width += 1;
        ui.time_liner.style.width = line_width + "px";

        if(line_width > 548){
            clearInterval(counter_line);
        }
    },11)
}