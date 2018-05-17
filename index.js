//the main form
const entryForm = document.getElementById("entryForm");
entryForm.addEventListener("submit", onSubmit)
function Entry(name, version, android_version, domain)
{
    this.name = name;
    this.version = version;
    this.android_version = android_version;
}

function onSubmit(ev)
{
    ev.preventDefault();
    if(entryForm.name.value == "")
    {
        const spanText = document.querySelector("#noNameErrorText");
        spanText.style.display = 'inline';
    }
}

