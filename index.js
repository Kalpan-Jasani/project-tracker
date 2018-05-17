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
    const userList = document.querySelector("#userList");
    if(entryForm.name.value == "")
    {
        const spanText = document.querySelector("#noNameErrorText");
        spanText.style.display = 'inline';
        return;
    }

    else
    {
        const spanText = document.querySelector("#noNameErrorText");
        spanText.style.display = "none";
    }

    const entry = new Entry(entryForm.name.value, entryForm.version.value, entryForm.android_version.value, entryForm.domain.value);
    const deleteButton = document.createElement("BUTTON");
    deleteButton.innerHTML = "del";
    deleteButton.style.display = "none";
    deleteButton.style.float = "right";
    
    //creating a text node for the data payload
    const textNode = document.createTextNode(`${entry.name}`);

    //creating a list item
    const listItem = document.createElement("LI");
    listItem.appendChild(textNode);
    listItem.appendChild(deleteButton);

    listItem.addEventListener("mouseover", function()
        {
            deleteButton.style.display = "inline";
        }
    )

    listItem.addEventListener("mouseleave", function()
        {
            deleteButton.style.display = "none";
        }
    )
    userList.appendChild(listItem);

}

