$(".tag-cloud-link").on("click", function(e) {
    e.preventDefault();
    var input = document.getElementById("navbar-search-input")
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
    nativeInputValueSetter.call(input, e.target.innerText);
    const changeEvent = new Event('input',{
        bubbles: true
    });
    input.dispatchEvent(changeEvent);
    window.scrollTo(0, 0);
})
