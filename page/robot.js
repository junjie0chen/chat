function sendData(event) {
    if (event instanceof KeyboardEvent && event.key != "Enter") {
        return ;
    }
    const val = document.getElementsByClassName("input")[0].value;
    if (val == null || val == '') {
        return ;
    }

    const me = document.createElement("p");
    me.innerText = "我：" + val;
    me.style.color = "blue";
    document.getElementsByClassName("content")[0].appendChild(me);

    const ajax = new XMLHttpRequest();
    ajax.open("GET", "http://127.0.0.1:12306/chat?text=" + val, true);
    ajax.send();
    ajax.onreadystatechange = function () {
        if (ajax.readyState == 4 && ajax.status == 200) {
            console.log(ajax.responseText)
        }
    }

}