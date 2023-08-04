document.addEventListener("DOMContentLoaded", ()=>{
    let splitUrl = window.location.href.split("/");
    let sectionFromUrl = splitUrl[splitUrl.length - 2];
    let sectionMenuChildrenArray = Array.from(document.getElementsByClassName("js-section-button"));
    sectionMenuChildrenArray.forEach(element=>{
        let elmMatches = element.innerText.trim().toUpperCase().includes(sectionFromUrl.toUpperCase());
        if (elmMatches) {
            localStorage.setItem("section", element.innerText.trim().charAt(0) + element.innerText.trim().slice(1).toLowerCase());
        }
    }
    );
    let section = localStorage.getItem("section") ?? "Exercises";
    setDisplayGender(getGender());
    $(".js-sex-option").on("click", (e)=>{
        e.preventDefault()
        if (getGender() === "male") {
            return setDisplayGender("female");
        }
        setDisplayGender("male");
    }
    );
    const $advToggle = $("#advanced-toggle");
    if (getAdvanced()) {
        $advToggle.prop("checked", true);
    }
    $advToggle.on("change", (e)=>{
        e.preventDefault()
        localStorage.setItem("advancedMap", $advToggle.prop("checked"))
        setDisplayGender(getGender());
    }
    );
    $("#body-map").on("click", (event)=>{
        const bodyPart = event.target.parentElement.id;
        const navigationPath = buildNavigationPath(bodyPart, section);
        if (navigationPath) {
            window.location = "./" + navigationPath + ".html";
        }
    }
    );
    $(".js-close-modal").on("click", ()=>{
        _hideModal()
    }
    )
    $(`#sexchooser ${getGender()}label`).click();
    document.onclick = ()=>{
        $moreMenu.removeClass("more-menu--open");
        $mobileMenu.removeClass("mobile-menu--open");
    }
    ;
    var $moreMenu = $(".js-more-menu")
      , $mobileMenu = $(".js-mobile-menu")
      , $mobileMenuToggle = $(".js-mobile-menu-toggle")
      , $mobileToggleLabel = $(".js-toggle-button-label")
      , $showMoreButton = $(".js-show-more-button")
      , $showMoreButtonLabel = $(".js-category-display")
      , optDeselect = false;
    section = section.toLowerCase();
    $(".section-selected").removeClass("section-selected");
    $(`[data-js-section="${section}"]`).addClass("section-selected");
    let selectedText = $(".section-selected").first().text();
    $mobileToggleLabel.text(selectedText || "Featured");
    if ($(".section-selected").hasClass("more-menu-opt")) {
        $showMoreButton.addClass("section-selected");
        $showMoreButtonLabel.text(selectedText);
    }
    $mobileMenuToggle.on("click", (e)=>{
        $mobileMenu.toggleClass("mobile-menu--open");
        e.stopPropagation();
    }
    );
    $(".js-section-button").on("click", (e)=>{
        let $button = $(e.target)
          , oldSection = localStorage.getItem("section")
          , newSection = $button.data("js-section")
          , noChange = (getAdvanced() && newSection !== "exercises" || oldSection === newSection);
        if (noChange) {
            return false;
        }
        optDeselect = false;
        $showMoreButtonLabel.text("More");
        $mobileMenuToggle.addClass("mobile-menu-toggle--section-selected")
        $(".section-selected").removeClass("section-selected");
        localStorage.removeItem("section");
        $mobileToggleLabel.text("Featured");
        if (newSection === oldSection) {
            optDeselect = true;
            $showMoreButton.removeClass("section-selected");
            $mobileMenuToggle.removeClass("mobile-menu-toggle--section-selected")
            return;
        }
        $mobileToggleLabel.text($button.text());
        $button.addClass("section-selected");
        section = newSection;
        localStorage.setItem("section", newSection);
    }
    );
    $(".js-more-menu-opt").on("click", (e)=>{
        if (optDeselect) {
            return;
        }
        $showMoreButton.addClass("section-selected");
        $showMoreButtonLabel.text($(e.target).text());
    }
    );
    $showMoreButton.on("click", (e)=>{
        if (getAdvanced()) {
            return false;
        }
        $moreMenu.toggleClass("more-menu--open");
        e.stopPropagation();
    }
    );
}
);
function getGender() {
    let gender = localStorage.getItem("sex") || "male";
    if (gender !== "male" && gender !== "female") {
        localStorage.setItem("sex", "male");
        gender = "male";
    }
    return gender;
}
function getAdvanced() {
    return (localStorage.getItem("advancedMap") === "true");
}
const checkModal = function() {
    const user = JSON.parse(localStorage.getItem("user"));
    const hasPremium = (user?.profile.premium || user?.profile.premium_cancelled)
    const ctaModalShown = localStorage.getItem("ctaModalShown")
    const show = (!hasPremium && !ctaModalShown);
    if (show) {
        localStorage.setItem("ctaModalShown", true)
        _showModal();
    }
}
function setDisplayGender(gender) {
    const $bodyMapContainer = $("#body-map");
    const $maleBodyMaps = $("#male-body-maps");
    const $femaleBodyMaps = $("#female-body-maps");
    const $simpleMaps = $(".body-map__body").not(".body-map--advanced");
    const $advancedMaps = $(".body-map--advanced");
    const $maleIcon = $(".js-toggle-male-icon");
    const $femaleIcon = $(".js-toggle-female-icon");
    const $genderTextWrapper = $(".js-gender-toggle-text");
    $maleBodyMaps.hide();
    $femaleBodyMaps.hide();
    $advancedMaps.hide();
    $simpleMaps.hide();
    $bodyMapContainer.removeClass("invisible");
    if (getAdvanced()) {
        $advancedMaps.show();
        $(".js-featued-button").trigger("click");
        $(".js-nav").addClass("menu-disabled");
        checkModal();
    } else {
        $simpleMaps.show();
        $(".js-nav").removeClass("menu-disabled");
    }
    $genderTextWrapper.text(gender);
    localStorage.setItem("sex", gender)
    switch (gender) {
    case "female":
        {
            $maleIcon.addClass('tw-hidden');
            $femaleIcon.removeClass('tw-hidden');
            $femaleBodyMaps.fadeIn(500);
            break;
        }
    case "male":
        {
            $maleIcon.removeClass('tw-hidden');
            $femaleIcon.addClass('tw-hidden');
            $maleBodyMaps.fadeIn(500);
            break;
        }
    }
}
function buildNavigationPath(bodyPart, section) {
    const validBodyParts = ["calves", "quads", "traps", "shoulders", "biceps", "triceps", "forearms", "lowerback", "hamstrings", "obliques", "chest", "abdominals", "quads", "lats", "glutes", "traps-middle", "upper-abdominals", "gastrocnemius", "tibialis", "soleus", "outer-quadricep", "rectus-femoris", "inner-quadricep", "inner-thigh", "lower-abdominals", "wrist-flexors", "wrist-extensors", "short-head-bicep", "long-head-bicep", "mid-lower-pectoralis", "upper-pectoralis", "lateral-deltoid", "upper-trapezius", "hands", "inner-thigh", "anterior-deltoid", "medial-hamstrings", "lateral-hamstrings", "gluteus-medius", "gluteus-maximus", "long-head-triceps", "lateral-head-triceps", "posterior-deltoid", "lateral-deltoid", "lower-trapezius", "upper-trapezius", "medial-head-triceps", ];
    if (validBodyParts.includes(bodyPart)) {
        const gender = localStorage.getItem("sex");
        return [section, gender, bodyPart].join("/");
    }
}
function _hideModal() {
    $(".js-cta-modal").addClass("tw-opacity-0");
    $(".js-cta-modal").addClass("tw-pointer-events-none");
}
function _showModal() {
    $(".js-cta-modal").removeClass("tw-opacity-0");
    $(".js-cta-modal").removeClass("tw-pointer-events-none");
}
